import { backend_endpoint } from "@/constants";

export async function getPurchaseOrders() {
    const purchaseOrders = await fetch(`${backend_endpoint}/po`);
    return purchaseOrders.json();
}
