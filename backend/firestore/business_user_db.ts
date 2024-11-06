import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, where, query, QueryCompositeFilterConstraint, getDoc, DocumentData } from "firebase/firestore";
import { firebaseApp } from "./firebase_client";
import { BizUserMapping, BizUserMappingStatus, BizUserRole, InvitationDecision } from "../types";

const bizUserCollection = "business_user";
const db = getFirestore(firebaseApp);
const colRef = collection(db, bizUserCollection);

export async function createBizOwnerMapping(businessId: string, userId: string) {
	const currTime = Date.now();
	const inviteData = {
		businessId: businessId,
		userId: userId,
		role: BizUserRole.OWNER,
		status: BizUserMappingStatus.ACTIVE,
		creationTime: currTime,
		updateTime: currTime
	};
	const inviteRef = await addDoc(colRef, inviteData);
	return {
		id: inviteRef.id,
		...inviteData,
	}
}

export async function createNewTraderInvitation(businessId: string, userId: string) {
	const currTime = Date.now();
	const inviteData = {
		businessId: businessId,
		userId: userId,
		role: BizUserRole.TRADER,
		status: BizUserMappingStatus.INVITED,
		creationTime: currTime,
		updateTime: currTime
	};
	const inviteRef = await addDoc(colRef, inviteData);
	return {
		id: inviteRef.id,
		...inviteData,
	}
}

function buildInviteFromSnapshot(invitationId: string, inviteData: DocumentData) {
	return {
		id: invitationId,
		businessId: inviteData.businessId as string,
		userId: inviteData.userId as string,
		role: inviteData.role as string,
		status: inviteData.status as BizUserMappingStatus,
		creationTime: inviteData.creatimeTime as number,
		updateTime: inviteData.updateTime as number
	}
}

export async function fetchTraderInvitation(invitationId: string) {
	const inviteSnapshot = await getDoc(doc(db, bizUserCollection, invitationId));
	if (!inviteSnapshot.exists()) {
		return null;
	}
	return buildInviteFromSnapshot(invitationId, inviteSnapshot.data());
}

export async function updateTraderInvitationStatus(invitationId: string, status: BizUserMappingStatus) {
	await updateDoc(doc(db, bizUserCollection, invitationId), {
		status: status,
		updatedTime: Date.now()
	});
}

export async function cancelTraderInvitation(businessId: string, brokerId: string) {
	const mappingSnapshot = await fetchBizUserMapping(businessId, brokerId, BizUserRole.TRADER);
	if (!mappingSnapshot) {
		throw new Error("MAPPING_NOT_FOUND");
	}
	await updateDoc(doc(db, bizUserCollection, mappingSnapshot.id), {
		status: BizUserMappingStatus.INVITE_CANCELLED,
		updatedTime: Date.now()
	});
}

export async function removeBizTraderMapping(businessId: string, brokerId: string) {
	const mappingSnapshot = await fetchBizUserMapping(businessId, brokerId, BizUserRole.TRADER);
	if (!mappingSnapshot) {
		throw new Error("MAPPING_NOT_FOUND");
	}
	await updateDoc(doc(db, bizUserCollection, mappingSnapshot.id), {
		status: BizUserMappingStatus.DEACTIVATED,
		updatedTime: Date.now()
	});
}

export async function fetchBizUserMapping(businessId: string, userId: string, role?: BizUserRole) {
	let q = query(
		colRef,
		where('businessId', '==', businessId),
		where('userId', '==', userId));
	if (role) {
		q = query(q, where("role", "==", role));
	}
	const docSnapshot = await getDocs(q);
	if (docSnapshot.size > 1) {
		throw new Error("MULTIPLE_MAPPINGS_FOUND");
	}
	if (docSnapshot.empty) {
		return null;
	}
	const snap = docSnapshot.docs[0];
	return buildInviteFromSnapshot(snap.id, snap.data());
}

export async function handleInvitationAction(invitationId: string, decision: InvitationDecision) {
	await updateDoc(doc(db, bizUserCollection, invitationId), {
		status: decision == InvitationDecision.ACCEPT
			? BizUserMappingStatus.ACTIVE
			: BizUserMappingStatus.INVITE_REJECTED,
		updateTime: Date.now()
	});
}

export async function fetchAllBizTraderMappings(businessId: string) {
	return await fetchAllBizUserMappings(businessId, BizUserRole.TRADER, [BizUserMappingStatus.ACTIVE, BizUserMappingStatus.INVITED]);
}

export async function fetchAllBizUserMappings(businessId: string, role?: BizUserRole, statuses?: BizUserMappingStatus[]) {
	let userQuery = query(
		colRef, where('businessId', '==', businessId)
	);
	if (role) {
		userQuery = query(userQuery, where("role", "==", role));
	}
	if (statuses) {
		userQuery = query(userQuery, where("status", "in", statuses))
	}

	const docSnapshot = await getDocs(userQuery);
	let mapping: BizUserMapping[] = []
	docSnapshot.forEach((snap) => {
		const data = snap.data();
		mapping.push(
			{
				id: snap.id,
				businessId,
				userId: data.userId as string,
				role: data.role as BizUserRole,
				status: data.status as BizUserMappingStatus,
				creationTime: data.creatimeTime as number,
				updateTime: data.updateTime as number
			});
	});
	return mapping;
}