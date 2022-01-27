import { ICtUser } from '../common/types';

export type UserRelationType = 'ACCOUNTANT' | 'CLIENT' | 'REFERRAL';
export type InviteStatus = 'ACCEPTED' | 'CANCELED' | 'DECLINED' | 'INVITED';
export type TaxStatus = 'IN_PROGRESS' | 'IN_REVIEW' | 'WAITING' | 'COMPLETED';
export enum ESendEmailStatus {
	BEFORE = 'before',
	SUCCESS = 'success',
	FAIL = 'fail',
}

export interface IInvitedObject {
	createdDate: string;
	email: string;
	id: number;
	lastModifiedDate: string;
	name: string;
	reminderSentDate: string;
	taxYearList: string;
	status: InviteStatus;
	type: UserRelationType;
	user: ICtUser;
}

export interface IRelatedObject {
	createdDate: string;
	id: number;
	lastActedDate: string;
	lastModifiedDate: string;
	relatedUser: ICtUser;
	reminderSentDate: string;
	taxYearList: string;
	status: TaxStatus;
	type: UserRelationType;
	user: ICtUser;
	name: string;
}

export interface IInviteRequest {
	email: string;
	name: string;
	taxYearList?: string;
	memo?: string;
}

export interface IInviteHash {
	id: number;
	token: string;
	createdAt?: string;
	expireAt?: string;
}
