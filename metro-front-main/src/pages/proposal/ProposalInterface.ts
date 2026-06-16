export interface ProposalDetail {
    id: number;
    type: string;
    proposal: {
        id: number;
        client: {
            name: string;
        },
        type: string;
    };
    bank?: string;
    price?: number;
    term?: number;
    property?: {
        description: string;
    };
    seller?: string;
    asset?: string;
    modality?: string;
    product?: string;
    zone?: string;
    model?: string;
    payment?: string;
    registration?: string;
    service?: string;
    chargedValue?: number;
}
