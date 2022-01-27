import { TaxStatus, UserRelationType } from './types';

export interface IRelatedReq {
	type: UserRelationType;
	taxStatus?: TaxStatus;
}

export interface IGenerateHashReq {
	expireDays: string;
	inviteId: number;
}
