import express, { Express, Request, Response } from "express";
const router: Express = express();

import { getBroker, createNewBroker, createNewParty } from "../firestore/trader_db";
import { handleInvitationAction } from "../firestore/business_user_db";

router.get("/:brokerId", async (req: Request, res: Response) => {
	res.send(await getBroker(req.params.brokerId));
});

router.post("/", async (req: Request, res: Response) => {
	res.send(await createNewBroker(
		req.body.name,
		req.body.phoneNumber,
		req.body.email,
		req.body.password
	)
	);
});

router.post("/party", async (req: Request, res: Response) => {
	await createNewParty(req.body.brokerId, req.body.name, req.body.address, req.body.pan, req.body.gstNumber);
	res.send("New party created");
});

router.post("/invitation", async (req: Request, res: Response) => {
	// const broker = await brokerDb.getBroker(req.body.brokerId);
	await handleInvitationAction(req.body.invitationId, req.body.decision);
	// notify business
	res.send("Invitation processed");
});

export default router;