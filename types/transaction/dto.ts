import { IReformedTransactionRecord } from '../review/types';
import { ETransactionType, ITransactionRecord } from './types';

export interface IChangeTypesDTO {
	costBasis: number | null;
	type: ETransactionType;
	transactionRecordId: number;
}

export interface IChangeTypes {
	data: IChangeTypesDTO[];
	denyMutation?: boolean;
}

export interface ICreateTransactionToProviderDTO {
	sourceId: number;
	transactions: ITransactionRecord[];
}

export interface ILoadTransactionsHistoryRes {
	count: number;
	// date: string;
	year: number;
	month: number;
}

export interface ILoadTransactionsHistoryDTO {
	username: string;
	fromInstant: string | null;
	toInstant: string | null;
}

export interface IExcludeTransactionsDTO {
	isExcluded: boolean;
	transactions: IReformedTransactionRecord[];
}
