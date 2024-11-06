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

export enum BrokerStatus {
    INVITED,
    ACTIVE,
    INACTIVE,
}

export type Trader = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    status: BrokerStatus;
    creationTime: number;
    updateTime: number;
    parties: Party[];
};

export enum PartyStatus {
    ACTIVE,
    INACTIVE
};

export type Party = {
    id: string;
    name: string;
    address: string;
    pan: string;
    gstNumber: string;
    status: PartyStatus;
    creationTime: number;
    updateTime: number;
};

export enum InvitationDecision {
    ACCEPT,
    REJECT
};

export enum POStatus {
    PENDING_APPROVAL,
    APPROVED,
    REJECTED,
    FULFILLED
};

export type PurchaseOrder = {
    id: string;
    businessId: string;
    brokerId: string;
    status: POStatus;
    totalQuantity: number;
    rate: number;
    contractDate: number;
    deliveryDate: number;
    creationTime: number;
    updateTime: number;
    items: PurchaseOrderItem[];
};

export enum POItemStatus {
    PENDING_APPROVAL,
    FULFILLED
};

export type PurchaseOrderItem = {
    id: string;
    poId: string;
    businessId: string;
    brokerId: string;
    partyId: string;
    quantity: number;
    vehicleNumber: string;
    billNumber: string;
    status: POItemStatus;
    creationTime: number;
    updateTime: number;
};
