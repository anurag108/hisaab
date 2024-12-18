import express, { Express, Request, Response } from "express";
const router: Express = express();

import {
	getBusiness,
	createNewBusiness,
	updateBusiness
} from "../firestore/business_db";
import {
	removeBizTraderMapping,
	createNewTraderInvitation,
	fetchBizUserMapping,
	cancelTraderInvitation,
	fetchAllBizTraderMappings,
	createBizOwnerMapping,
	updateTraderInvitationStatus
} from "../firestore/business_user_db";
import { createPartialUser, genUserByEmail, genUsers } from "../firestore/user_db";
import { BizUserMappingStatus, BizUserRole } from "../types";
import { sendEmail, sendTraderInvitationEmail } from "../mail_handler/mailer";

router.get("/:businessId", async (req: Request, res: Response) => {
	const biz = await getBusiness(req.params.businessId);
	res.send({
		error: false,
		biz
	});
});

router.post("/", async (req: Request, res: Response) => {
	const user = req.session.user;
	if (!user) { return; }
	const biz = await createNewBusiness(
		req.body.name,
		req.body.address,
		req.body.gstNumber,
		req.body.pan
	);
	await createBizOwnerMapping(biz.id, user.id);
	res.send({
		error: false,
		biz
	});
});

router.post("/:businessId", async (req: Request, res: Response) => {
	// TODO: Authorize so that only OWNER is able to do this
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
		error: false,
		biz: {
			id: biz.id,
			...updatedBizData,
			status: biz.status,
			creationTime: biz.creationTime
		}
	});
});

router.post("/invite/new", async (req: Request, res: Response) => {
	// TODO: validate email & businessId
	const email = req.body.email;
	const businessId = req.body.businessId;

	// TODO: authorize this operation. Only a business user can do this
	let user = await genUserByEmail(email);
	if (!user) {
		user = await createPartialUser(email);
	}
	if (user.status === "DEACTIVATED") {
		res.send({
			error: true,
			errorCode: "USER_DEACTIVATED"
		});
	} else {
		let invitation = await fetchBizUserMapping(businessId, user.id);
		if (invitation) {
			// console.log("No invitation found");
			// invitation = await createNewTraderInvitation(businessId, user.id);
			// console.log("created invitation");
			// TODO: send email to trader
			await sendTraderInvitationEmail(email, invitation);
			res.send({
				error: false,
			})
		}
		// else {
		// 	if (invitation.role === BizUserRole.OWNER) {
		// 		res.send({
		// 			error: true,
		// 			errorCode: "OWNER_CANNOT_BE_INVITED"
		// 		});
		// 	} else if (invitation.status === BizUserMappingStatus.INVITE_REJECTED
		// 		|| invitation.status === BizUserMappingStatus.DEACTIVATED
		// 	) {
		// 		res.send({
		// 			error: true,
		// 			errorCode: "USER_CANNOT_BE_INVITED"
		// 		});
		// 	} else if (invitation.status === BizUserMappingStatus.ACTIVE || invitation.status === BizUserMappingStatus.INVITED) {
		// 		res.send({
		// 			error: true,
		// 			errorCode: "USER_ALREADY_ACTIVE_OR_INVITED"
		// 		});
		// 	} else if (invitation.status === BizUserMappingStatus.INVITE_CANCELLED) {
		// 		await updateTraderInvitationStatus(invitation.id, BizUserMappingStatus.INVITED);
		// 		// TODO: send another email
		// 		res.send({
		// 			error: false
		// 		});
		// 	}
		// }
	}
});

router.post("/invite/cancel", async (req: Request, res: Response) => {
	// TODO: authorize this operation. Only a business user can do this
	const businessId = req.body.businessId;
	const traderId = req.body.traderId;
	let invitation = await fetchBizUserMapping(businessId, traderId, BizUserRole.TRADER);
	if (invitation && invitation.status === BizUserMappingStatus.INVITED) {
		await cancelTraderInvitation(businessId, traderId);
	} else {
		throw new Error("INVITATION_NOT_FOUND");
	}
	res.send();
});

router.post("/deactivate/trader", async (req: Request, res: Response) => {
	// TODO: authorize this operation. Only a business user can do this
	const businessId = req.body.businessId;
	const traderId = req.body.traderId;
	let invitation = await fetchBizUserMapping(businessId, traderId, BizUserRole.TRADER);
	if (invitation && invitation.status === BizUserMappingStatus.ACTIVE) {
		await removeBizTraderMapping(businessId, traderId);
		res.send({
			error: false
		});
	} else {
		res.send({
			error: true,
			errorCode: "MAPPING_NOT_FOUND"
		});
	}
});

router.get("/:businessId/traders", async (req: Request, res: Response) => {
	// TODO: authorize this operation. Only a business user can do this
	const businessId = req.params.businessId;
	const traderMappings = await fetchAllBizTraderMappings(businessId);
	const invitationStatusMap = new Map<String, BizUserMappingStatus>();
	traderMappings.map((m) => invitationStatusMap.set(m.userId, m.status));
	const traderIds = traderMappings.map((m) => m.userId)
	if (traderIds.length > 0) {
		const traders = await genUsers(traderIds);
		const results = traders.map((trader) => {
			return {
				...trader,
				invitationStatus: invitationStatusMap.get(trader.id)
			}
		});
		res.send({
			error: false,
			traders: results
		})
	} else {
		res.send({
			error: false,
			traders: []
		})
	}
});

export default router;