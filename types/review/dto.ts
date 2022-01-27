import { ITransactionRecord } from '../transaction/types';

export interface ILoadReviewDataDTO {
	total: number;
	res: any;
}

export interface ILoadClassifyTransfersRes {
	totalCount: number;
	transactionRecords: ITransactionRecord[];
}

export interface ILoadMissingTransactionDTO {
	size: number;
	asset: string;
	sourceIds: string;
}

export interface ILoadAssetInProviderDTO {
	providerId: number;
	page: number;
	size: number;
	sort: string | null;
}

export interface IAssetPercentageRes {
	asset: string;
	marketValue: number | string;
	quantity: number | string;
}
