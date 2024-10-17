export enum BusinessStatus {
    ACTIVE,
    INACTIVE
};

export type Business = {
    id: string;
    name: string;
    address: string;
    status: BusinessStatus;
    creationTime: number;
    updateTime: number;
};

export enum BrokerStatus {
    INVITED,
    ACTIVE,
    INACTIVE,
}

export type Broker = {
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

export enum BizBrokerMappingStatus {
    INVITED,
    MAPPING_ACTIVE,
    INVITATION_CANCELLED,
    MAPPING_REMOVED
};

export type BizBrokerMapping = {
    businessId: string;
    brokerId: string;
    status: BizBrokerMappingStatus;
    creationTime: number;
    updateTime: number;
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
