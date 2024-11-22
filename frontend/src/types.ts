export interface User {
    id: string,
    name: string,
    email: string,
    phoneNumber: string,
    status: string,
    creationTime: string,
    updateTime: string
}

export enum OrderStatus {
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
}

export interface Order {
    id: string,
    businessId: string,
    traderId: string,
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
    deliveredQuantity: number,
    vehicleNumber: string,
    gateEntryNumber: string,
    billNumber: string,
    claim: number,
    bardana: number,
    fumigation: number,
    cd2: number,
    otherDeductions: number,
    commission: number,
    deliveryDate: string,
    creationTime: string,
    updateTime: string,
    // status: OrderItemStatus,
    status: string,
}

export interface ExpandedOrderItem {
    id: string,
    poId: string,
    businessId: string,
    traderId: string,
    partyId: string,
    quantity: number,
    deliveredQuantity: number,
    vehicleNumber: string,
    gateEntryNumber: string,
    billNumber: string,
    claim: number,
    bardana: number,
    fumigation: number,
    cd2: number,
    commission: number,
    otherDeductions: number,
    deliveryDate: string,
    creationTime: string,
    updateTime: string,
    // status: OrderItemStatus,
    status: string,
}

export interface Trader {
    id: string,
    name: string,
    email: string,
    phoneNumber: string,
    status: string,
    creationTime: string,
    updateTime: string,
    parties: Party[],
}

export interface Party {
    id: string,
    name: string,
    gstNumber: string,
    pan: string,
    status: string,
    creationTime: string,
    updateTime: string,
}