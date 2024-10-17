import {
	getFirestore,
	collection,
	doc,
	getDoc,
	getDocs,
	addDoc,
	where,
	writeBatch,
	DocumentReference,
	query
} from "firebase/firestore";
import { firebaseApp } from "./firebase_client";
import { POItemStatus, POStatus, PurchaseOrder, PurchaseOrderItem } from "../types";

const db = getFirestore(firebaseApp);
const poCollectionName = "purchase_order";
const poItemsCollectionName = "purchase_order_items";
const poColRef = collection(db, poCollectionName);

async function getPOItemsFromPORef(poRef: DocumentReference) {
	const poItemsSnapshot = await getDocs(collection(poRef, poItemsCollectionName));
	const poItems: PurchaseOrderItem[] = [];
	poItemsSnapshot.forEach(poItemSnap => {
		const data = poItemSnap.data();
		poItems.push({
			id: poItemSnap.id,
			poId: data.poId,
			businessId: data.businessId,
			brokerId: data.brokerId,
			partyId: data.partyId,
			quantity: data.quantity,
			vehicleNumber: data.vehicleNumber,
			billNumber: data.billNumber,
			status: data.status,
			creationTime: data.creationTime,
			updateTime: data.updateTime
		});
	});
	return poItems;
}

export async function getPurchaseOrder(purchaseOrderId: string) {
	const docRef = doc(db, poCollectionName, purchaseOrderId);
	const poSnapshot = await getDoc(docRef);
	if (!poSnapshot.exists()) {
		return null;
	}
	const poData = poSnapshot.data();
	const poItems = await getPOItemsFromPORef(docRef);
	return {
		id: purchaseOrderId,
		businessId: poData.businessId,
		brokerId: poData.brokerId,
		status: poData.status,
		totalQuantity: poData.totalQuantity,
		rate: poData.rate,
		contractDate: poData.contractDate,
		deliveryDate: poData.deliveryDate,
		creationTime: poData.creationTime,
		updateTime: poData.updateTime,
		items: poItems
	};
}

export async function getPurchaseOrders(businessId: string) {
	const poSnapshots = await getDocs(query(poColRef, where('businessId', '==', businessId)));
	const purchaseOrders: PurchaseOrder[] = [];
	for (const poSnap of poSnapshots.docs) {
		const purchaseOrder = poSnap.data();
		const poRef = doc(db, poCollectionName, poSnap.id)
		const poItems = await getPOItemsFromPORef(poRef);
		purchaseOrders.push({
			id: poSnap.id,
			businessId: purchaseOrder.businessId,
			brokerId: purchaseOrder.brokerId,
			totalQuantity: purchaseOrder.totalQuantity,
			rate: purchaseOrder.rate,
			contractDate: purchaseOrder.contractDate,
			deliveryDate: purchaseOrder.deliveryDate,
			status: purchaseOrder.status,
			creationTime: purchaseOrder.creationTime,
			updateTime: purchaseOrder.updateTime,
			items: poItems
		})
	}
	return purchaseOrders;
}

export async function createNewPurchaseOrder(
	businessId: string,
	brokerId: string,
	totalQuantity: number,
	rate: number,
	contractDate: number,
	deliveryDate: number) {
	const poData = {
		businessId: businessId,
		brokerId: brokerId,
		totalQuantity: totalQuantity,
		rate: rate,
		contractDate: contractDate,
		deliveryDate: deliveryDate,
		status: POStatus.PENDING_APPROVAL,
		creationTime: Date.now(),
		updateTime: Date.now()
	};
	const docRef = await addDoc(collection(db, poCollectionName), poData);
	return {
		id: docRef.id,
		...poData
	}
}

export async function createNewPurchaseOrderItems(
	purchaseOrderId: string,
	items: PurchaseOrderItem[]) {
	const purchaseOrder = await getPurchaseOrder(purchaseOrderId);
	if (!purchaseOrder) {
		throw new Error("No purchase order found");
	}
	const poDocRef = doc(db, poCollectionName, purchaseOrderId);
	const poItemColRef = collection(poDocRef, poItemsCollectionName);
	const batch = writeBatch(db);
	items.forEach(item => {
		const itemData = {
			poId: purchaseOrderId,
			businessId: purchaseOrder.businessId,
			brokerId: purchaseOrder.brokerId,
			partyId: item.partyId,
			vehicleNumber: item.vehicleNumber,
			quantity: item.quantity,
			billNumber: item.billNumber,
			status: POItemStatus.PENDING_APPROVAL,
			creationTime: Date.now(),
			updateTime: Date.now(),
		};
		const newItemRef = doc(poItemColRef);
		batch.set(newItemRef, itemData);
	});
	await batch.commit();
	return await getPurchaseOrder(purchaseOrderId);
}
