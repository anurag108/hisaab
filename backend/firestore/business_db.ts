import {
	getFirestore, collection, doc, getDoc, addDoc,
	DocumentSnapshot,
	DocumentData,
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

export async function createNewBusiness(name: string, address: string) {
	const bizData = {
		name: name,
		address: address,
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
