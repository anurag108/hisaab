import {
	getFirestore, collection, doc, getDoc, addDoc,
	DocumentSnapshot,
	DocumentData,
	updateDoc,
} from "firebase/firestore";
import { firebaseApp } from "./firebase_client";

const bizCollectionName = "business";
const db = getFirestore(firebaseApp);
const colRef = collection(db, bizCollectionName);

function makeBizFromSnapshot(bizSnapshot: DocumentSnapshot) {
	const bizData = bizSnapshot.data() as DocumentData;
	return {
		id: bizSnapshot.id,
		name: bizData.name,
		address: bizData.address,
		gstNumber: bizData.gstNumber,
		pan: bizData.pan,
		status: bizData.status,
		creationTime: bizData.creationTime,
		updateTime: bizData.updateTime,
	}
}

export async function getBusiness(businessId: string) {
	const bizSnapshot = await getDoc(doc(db, bizCollectionName, businessId));
	if (!bizSnapshot.exists()) {
		return null;
	}
	return makeBizFromSnapshot(bizSnapshot);
}

export async function createNewBusiness(
	name: string,
	address: string,
	gstNumber: string,
	pan: string) {
	const bizData = {
		name,
		address,
		gstNumber,
		pan,
		status: "ACTIVE",
		creationTime: Date.now(),
		udpateTime: Date.now()
	};
	const docRef = await addDoc(colRef, bizData);
	return {
		id: docRef.id,
		...bizData
	}
}

export async function updateBusiness(businessId: string, bizData: any) {
	const bizRef = doc(db, bizCollectionName, businessId);
	await updateDoc(bizRef, bizData);
}