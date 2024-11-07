import {
	getFirestore, collection, doc, getDoc, addDoc,
	DocumentSnapshot,
	DocumentData,
	updateDoc,
	getDocs,
	where,
	documentId,
	query,
} from "firebase/firestore";
import { firebaseApp } from "./firebase_client";
import { Business, BusinessStatus } from "../types";

const bizCollectionName = "business";
const db = getFirestore(firebaseApp);
const colRef = collection(db, bizCollectionName);

function makeBizFromSnapshot(bizSnapshot: DocumentSnapshot) {
	const bizData = bizSnapshot.data() as DocumentData;
	return {
		id: bizSnapshot.id as string,
		name: bizData.name as string,
		address: bizData.address as string,
		gstNumber: bizData.gstNumber as string,
		pan: bizData.pan as string,
		status: bizData.status as BusinessStatus,
		creationTime: bizData.creationTime as number,
		updateTime: bizData.updateTime as number,
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
	const currTime = Date.now();
	const bizData = {
		name,
		address,
		gstNumber,
		pan,
		status: BusinessStatus.ACTIVE,
		creationTime: currTime,
		updateTime: currTime
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

export async function genBizFromIds(ids: string[]) {
	const bizSnaps = await getDocs(query(colRef, where(documentId(), "in", ids)));
	const businesses: Business[] = [];
	bizSnaps.forEach((snap) => businesses.push(makeBizFromSnapshot(snap)));
	return businesses;
}