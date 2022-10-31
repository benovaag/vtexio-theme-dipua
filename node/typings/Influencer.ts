export default interface TInfluencer {
    id?: string;
    Utmi_cp?: number;
    clientID: string;
    categoryCommission: string;
    blocked?: boolean;
    bankInfo?: string;
    affiliateURL?: string;
    commissionTotal?: string;
    paymentDay?: string;
}

export interface TInfluencerOrder {
    id?: string;
    influencerId: string;
    orderId: string;
    value: number;
    commissionValue: number;
    status: string;
    creationDate: Date;
    authorizedDate?: Date;
    invoicedDate?: Date;
    cancelDate?: Date;
    items: string;
    comment?: string;
}

export interface TCategoryCommission {
    id?: string;
    category: string;
    commissionPercentage: number;
}
