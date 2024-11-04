import express, { Express, Request, Response } from "express";
const router: Express = express();

import { getBusiness, createNewBusiness, updateBusiness } from "../firestore/business_db";
import { getBrokerByEmail, createInvitedBrokerAccount } from "../firestore/broker_db";
import { fetchBizBrokerMapping, removeBizBrokerMapping, createNewBrokerInvitation } from "../firestore/business_broker_db";

router.get("/:businessId", async (req: Request, res: Response) => {
	const biz = await getBusiness(req.params.businessId);
	res.send({
		biz
	});
});

router.post("/", async (req: Request, res: Response) => {
	const biz = await createNewBusiness(
		req.body.name,
		req.body.address,
		req.body.gstNumber,
		req.body.pan
	);
	res.send({
		biz
	});
});

router.post("/:businessId", async (req: Request, res: Response) => {
	const businessId = req.params.businessId;
	const biz = await getBusiness(businessId);
	if (!biz) {
		throw new Error("BIZ_NOT_FOUND");
	}
	const updatedBizData = {
		name: req.body.name ?? biz.name,
		address: req.body.address ?? biz.address,
		gstNumber: req.body.gstNumber ?? biz.gstNumber,
		pan: req.body.pan ?? biz.pan,
		updateTime: Date.now()
	};
	await updateBusiness(businessId, updatedBizData);
	res.send({
		id: biz.id,
		...updatedBizData,
		status: biz.status,
		creationTime: biz.creationTime
	});
});

router.post("/invite_broker", async (req: Request, res: Response) => {
	// validate email
	var broker = await getBrokerByEmail(req.body.brokerEmail);
	if (!broker) {
		broker = await createInvitedBrokerAccount(req.body.brokerEmail);
	}
	// check if business <-> broker mapping already exists
	const businessId = req.body.businessId;
	const mapping = await fetchBizBrokerMapping(businessId, broker.id);
	if (!mapping) {
		await createNewBrokerInvitation(businessId, broker.id);
		// send email to broker
		res.send("Invitation sent to broker");
	} else {
		if (mapping.status == "INVITED") {
			res.send("Broker already invited");
		} else {
			res.send("Broker already mapped");
		}
	}
	// send email to broker
});

router.post("/cancel_invite", async (req: Request, res: Response) => {
	res.send("This functionality is coming soon");
});

router.post("/remove_broker", async (req: Request, res: Response) => {
	await removeBizBrokerMapping(req.body.businessId, req.body.brokerId);
	res.send("Biz broker mapping removed");
});

export default router;