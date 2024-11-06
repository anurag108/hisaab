import {
	getFirestore,
	collection,
	getDocs,
	getDoc,
	doc,
	query,
	where,
	DocumentReference,
	DocumentSnapshot,
	DocumentData,
	addDoc
}
	from "firebase/firestore";
import { firebaseApp } from "./firebase_client";
import { Trader, BrokerStatus, Party, PartyStatus } from "../types";

const db = getFirestore(firebaseApp);
const brokerCollectionName = "broker";
const brokerCollectionRef = collection(db, brokerCollectionName);
const partyCollectionName = "party";

async function getPartiesFromBrokerRef(brokerRef: DocumentReference) {
	const partySnapshot = await getDocs(collection(brokerRef, partyCollectionName));
	const parties: Party[] = [];
	partySnapshot.forEach(party => {
		const data = party.data();
		parties.push({
			id: party.id,
			name: data.name,
			address: data.address,
			pan: data.pan,
			gstNumber: data.gstNumber,
			status: data.status,
			creationTime: data.creationTime,
			updateTime: data.updateTime,
		});
	});
	return parties;
}

function makeBrokerFromSnapshot(brokerSnapshot: DocumentSnapshot, parties?: Party[]) {
	const brokerData = brokerSnapshot.data() as DocumentData;
	return {
		id: brokerSnapshot.id,
		name: brokerData.name,
		phoneNumber: brokerData.phoneNumber,
		email: brokerData.email,
		status: brokerData.status,
		creationTime: brokerData.creationTime,
		parties: parties
	};
}

export async function getBroker(brokerId: string) {
	const docRef = doc(db, brokerCollectionName, brokerId);
	const brokerSnapshot = await getDoc(docRef);
	if (!brokerSnapshot.exists()) {
		return null;
	}
	const parties = await getPartiesFromBrokerRef(docRef);
	return makeBrokerFromSnapshot(brokerSnapshot, parties);
}

export async function getBrokerByEmail(brokerEmail: string) {
	const brokerSnapshot = await getDocs(query(brokerCollectionRef, where('email', '==', brokerEmail)));
	if (brokerSnapshot.empty) {
		return null;
	}
	if (brokerSnapshot.size > 1) {
		throw new Error("Duplicate account");
	}
	return makeBrokerFromSnapshot(brokerSnapshot.docs[0]);
}

// export async function getAllBrokersForBusiness(businessId: string) {
// 	const query = query(brokerCollectionRef, where('businessId', '==', businessId));
// 	const brokerSnapshots = await getDocs(query);
// 	const brokers: Broker[] = [];
// 	for (const brokerSnap of brokerSnapshots.docs) {
// 		const brokerData = brokerSnap.data();
// 		brokers.push({
// 			id: brokerSnap.id,
// 			name: brokerData.name,
// 			email: brokerData.email,
// 			phoneNumber: brokerData.phoneNumber,
// 			status: brokerData.status,
// 			creationTime: brokerData.creationTime,
// 			parties: await getPartiesFromBrokerRef(brokerSnap)
// 		})
// 	}
// 	return brokers;
// }

export async function createNewBroker(name: string, phoneNumber: string, email: string, password: string) {
	const brokerData = {
		name: name,
		phoneNumber: phoneNumber,
		email: email,
		password: password,
		status: BrokerStatus.ACTIVE,
		creationTime: Date.now(),
		udpateTime: Date.now()
	};
	const docRef = await addDoc(brokerCollectionRef, brokerData);
	return {
		id: docRef.id,
		name: brokerData.name,
		email: brokerData.email,
		phoneNumber: brokerData.phoneNumber,
		status: brokerData.status,
		creationTime: brokerData.creationTime,
		parties: []
	}
}

export async function createNewParty(brokerId: string, name: string, address: string, pan: string, gstNumber: string) {
	const docRef = doc(db, brokerCollectionName, brokerId);
	const subColRef = collection(docRef, partyCollectionName);
	await addDoc(subColRef, {
		name: name,
		address: address,
		pan: pan,
		gstNumber: gstNumber,
		status: PartyStatus.ACTIVE,
		creationTime: Date.now(),
		udpateTime: Date.now()
	});
	return await getBroker(brokerId);
}

export async function createInvitedBrokerAccount(brokerEmail: string) {
	const brokerData = {
		name: null,
		phoneNumber: null,
		email: brokerEmail,
		status: BrokerStatus.INVITED,
		creationTime: Date.now(),
		udpateTime: Date.now()
	};
	const docRef = await addDoc(brokerCollectionRef, brokerData);
	return {
		id: docRef.id,
		...brokerData,
		parties: []
	};
}
