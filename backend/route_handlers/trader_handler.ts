import express, { Express, Request, Response } from "express";
const router: Express = express();

import { fetchTraderInvitation, updateTraderInvitationStatus } from "../firestore/business_user_db";
import { decryptInvitationInfo } from "../encryption_utils";
import { BizUserMappingStatus } from "../types";

router.post("/invitation", async (req: Request, res: Response) => {
	const invitationId = decryptInvitationInfo(req.body.invitationCipher);
	const invitation = await fetchTraderInvitation(invitationId);
	if (!invitation || invitation.status !== BizUserMappingStatus.INVITED) {
		res.send({
			error: true,
			errorCode: "INVITATION_NOT_FOUND"
		});
	} else {
		const status = req.body.decision === "ACCEPT" ? BizUserMappingStatus.ACTIVE : BizUserMappingStatus.INVITE_REJECTED;
		await updateTraderInvitationStatus(invitation.id, status);
		// TODO: notify business
		res.send({
			error: false
		});
	}
});

export default router;