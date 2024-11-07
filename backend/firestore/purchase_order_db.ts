import {
	getFirestore,
	collection,
	doc,
	getDoc,
	getDocs,
	addDoc,
	where,
	query,
	updateDoc,
	DocumentData
} from "firebase/firestore";
import { firebaseApp } from "./firebase_client";
import { POItemStatus, POStatus, PurchaseOrder, PurchaseOrderItem } from "../types";

const db = getFirestore(firebaseApp);
const poCollectionName = "purchase_order";
const poColRef = collection(db, poCollectionName);
const poItemColName = "purchase_order_item"
const poItemColRef = collection(db, poItemColName);

function buildPurchaseOrderFromSnapshot(id: string, poData: DocumentData) {
	return {
		id,
		businessId: poData.businessId as string,
		traderId: poData.traderId as string,
		status: poData.status as POStatus,
		totalQuantity: poData.totalQuantity as number,
		rate: poData.rate as number,
		contractDate: poData.contractDate as string,
		deliveryDate: poData.deliveryDate as string,
		creationTime: poData.creationTime as number,
		updateTime: poData.updateTime as number
	};
}

export async function getPurchaseOrder(purchaseOrderId: string) {
	const docRef = doc(db, poCollectionName, purchaseOrderId);
	const poSnapshot = await getDoc(docRef);
	if (!poSnapshot.exists()) {
		return null;
	}
	return buildPurchaseOrderFromSnapshot(poSnapshot.id, poSnapshot.data());
}

export async function getPurchaseOrders(businessId: string) {
	const poSnapshots = await getDocs(query(poColRef, where('businessId', '==', businessId)));
	return poSnapshots.docs.map((poSnap) =>
		buildPurchaseOrderFromSnapshot(poSnap.id, poSnap.data())
	);
}

export async function createNewPurchaseOrder(
	businessId: string,
	traderId: string,
	totalQuantity: number,
	rate: number,
	contractDate: string,
	deliveryDate: string) {
	const currTime = Date.now();
	const poData = {
		businessId,
		traderId,
		totalQuantity,
		rate,
		contractDate,
		deliveryDate,
		status: POStatus.PENDING_APPROVAL,
		creationTime: currTime,
		updateTime: currTime,
	};
	const docRef = await addDoc(collection(db, poCollectionName), poData);
	return {
		id: docRef.id,
		...poData
	}
}

export async function updatePurchaseOrder(
	purchaseOrder: PurchaseOrder,
	updatedPOData: any) {
	const poRef = doc(db, poCollectionName, purchaseOrder.id);
	await updateDoc(poRef, {
		...updatedPOData,
		updateTime: Date.now()
	});
}

function buildPurchaseOrderItemFromSnapshot(id: string, itemData: DocumentData) {
	return {
		id,
		poId: itemData.poId as string,
		businessId: itemData.businessId as string,
		traderId: itemData.traderId as string,
		partyId: itemData.partyId as string,
		status: itemData.status as POItemStatus,
		quantity: itemData.quantity as number,
		vehicleNumber: itemData.vehicleNumber as string,
		creationTime: itemData.creationTime as number,
		updateTime: itemData.updateTime as number
	};
}

export async function getPurchaseOrderItem(itemId: string) {
	const itemSnapshot = await getDoc(doc(db, poItemColName, itemId));
	if (!itemSnapshot.exists()) {
		return null;
	}
	return buildPurchaseOrderItemFromSnapshot(itemSnapshot.id, itemSnapshot.data());
}

export async function createNewPOItem(
	purchaseOrder: PurchaseOrder,
	partyId: string,
	vehicleNumber: string,
	quantity: number,
) {
	const currTime = Date.now();
	const poItemData = {
		poId: purchaseOrder.id,
		businessId: purchaseOrder.businessId,
		traderId: purchaseOrder.traderId,
		partyId: partyId,
		vehicleNumber: vehicleNumber,
		quantity: quantity,
		status: POItemStatus.PENDING_APPROVAL,
		creationTime: currTime,
		updateTime: currTime,
	};
	const ref = await addDoc(poItemColRef, poItemData);
	return {
		id: ref.id,
		...poItemData
	}
}

export async function updatePOItem(item: PurchaseOrderItem, updatedPOItemData: any) {
	const poRef = doc(db, poItemColName, item.id);
	await updateDoc(poRef, {
		...updatedPOItemData,
		updateTime: Date.now()
	});
}