export interface PhoneNumber {
    countryCode: string,
    phoneNumber: string,
}

export enum UserStatus {
    PENDING_EMAIL_VERIFICATION = "PENDING_EMAIL_VERIFICATION",
    ACTIVE = "ACTIVE",
    DEACTIVATED = "DEACTIVATED"
}

export interface User {
    id: string,
    name: string,
    email: string,
    phone: PhoneNumber,
    status: UserStatus,
    creationTime: number,
    updateTime: number
}

export enum BusinessStatus {
    ACTIVE = "ACTIVE",
    DEACTIVATED = "DEACTIVATED"
};

export type Business = {
    id: string;
    name: string;
    address: string;
    gstNumber: string,
    pan: string,
    status: BusinessStatus;
    creationTime: number;
    updateTime: number;
};

export enum BizUserRole {
    OWNER = "OWNER",
    TRADER = "TRADER",
}

export enum BizUserMappingStatus {
    INVITED = "INVITED",
    INVITE_CANCELLED = "INVITE_CANCELLED",
    INVITE_REJECTED = "INVITE_REJECTED",
    ACTIVE = "ACTIVE",
    DEACTIVATED = "DEACTIVATED"
};

export type BizUserMapping = {
    id: string;
    businessId: string;
    userId: string;
    role: BizUserRole;
    status: BizUserMappingStatus;
    creationTime: number;
    updateTime: number;
};

export enum InvitationDecision {
    ACCEPT,
    REJECT
};

export enum POStatus {
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    FULFILLED = "FULFILLED"
};

export type PurchaseOrder = {
    id: string;
    businessId: string;
    traderId: string;
    status: POStatus;
    totalQuantity: number;
    rate: number;
    contractDate: string;
    deliveryDate: string;
    creationTime: number;
    updateTime: number;
};

export enum POItemStatus {
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    CANCELLED = "CANCELLED",
    FULFILLED = "FULFILLED"
};

export type PurchaseOrderItem = {
    id: string;
    poId: string;
    businessId: string;
    traderId: string;
    partyId: string;
    quantity: number;
    deliveredQuantity?: number,
    vehicleNumber: string;
    gateEntryNumber?: string,
    billNumber?: string,
    claim?: number,
    bardana?: number,
    fumigation?: number,
    cd2?: number,
    commission?: number,
    otherDeductions?: number,
    deliveryDate?: string,
    status: POItemStatus;
    creationTime: number;
    updateTime: number;
};
