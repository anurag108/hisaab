export enum OrderStatus {
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
}

export interface Order {
    id: string,
    businessId: string,
    brokerId: string,
    totalQuantity: number,
    rate: number,
    contractDate: string,
    deliveryDate: string,
    // status: OrderStatus,
    status: string,
    creationTime: string,
    updateTime: string,
    items: OrderItem[],
}

export enum OrderItemStatus {
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
}

export interface OrderItem {
    id: string,
    partyId: string,
    quantity: number,
    vehicleNumber: string,
    gateEntryNumber: string,
    billNumber: string,
    claim: number,
    bardana: number,
    fumigation: number,
    cd2: number,
    otherDeductions: number,
    commission: number,
    creationTime: string,
    updateTime: string,
    // status: OrderItemStatus,
    status: string,
}