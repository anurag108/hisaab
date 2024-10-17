import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, where, query } from "firebase/firestore";
import { firebaseApp } from "./firebase_client";
import { BizBrokerMappingStatus, InvitationDecision } from "../types";

const bizBrokerCollection = "business_broker";
const db = getFirestore(firebaseApp);
const colRef = collection(db, bizBrokerCollection);

export async function createNewBrokerInvitation(businessId: string, brokerId: string) {
	const inviteData = {
		businessId: businessId,
		brokerId: brokerId,
		status: BizBrokerMappingStatus.INVITED,
		creationTime: Date.now(),
		updatedTime: Date.now()
	};
	await addDoc(colRef, inviteData);
}

export async function removeBizBrokerMapping(businessId: string, brokerId: string) {
	const mappingSnapshot = await fetchBizBrokerMapping(businessId, brokerId);
	if (!mappingSnapshot) {
		throw new Error("Business & broker mapping not found");
	}
	await updateDoc(doc(db, bizBrokerCollection, mappingSnapshot.id), {
		status: BizBrokerMappingStatus.MAPPING_REMOVED,
		updatedTime: Date.now()
	});
}

export async function fetchBizBrokerMapping(businessId: string, brokerId: string) {
	const mappingQuery = query(
		colRef,
		where('businessId', '==', businessId),
		where('brokerId', '==', brokerId));

	const docSnapshot = await getDocs(mappingQuery);
	if (docSnapshot.size > 1) {
		throw new Error("Multiple mappings for business & broker found");
	}
	if (docSnapshot.empty) {
		return null;
	}
	const snap = docSnapshot.docs[0];
	const data = snap.data();
	return {
		id: snap.id,
		businessId: data.businessId,
		brokerId: data.brokerId,
		status: data.status,
		creationTime: data.creatimeTime,
		updateTime: data.updateTime
	}
}

export async function handleInvitationAction(invitationId: string, decision: InvitationDecision) {
	await updateDoc(doc(db, bizBrokerCollection, invitationId), {
		status: decision == InvitationDecision.ACCEPT
			? BizBrokerMappingStatus.MAPPING_ACTIVE
			: BizBrokerMappingStatus.MAPPING_REMOVED,
		updateTime: Date.now()
	});
}
