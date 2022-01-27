/* eslint-disable no-useless-constructor */
import { ICtUser } from '../common/types';
import { IUserTransactionRecordSource } from '../provider/types';
import { ITransactionRecordComment } from '../transaction-comment/types';
import { ITransactionImportError } from '../transaction-import-error/types';
import { IRawTransaction } from '../raw-transaction/types';

export interface ITransactionType {
	category: string;
	side: string;
	label: string;
	userSelectable: boolean;
	grouping: any;
}
export interface IFlattenTransactionType extends ITransactionType {
	type: string;
	nameForSort: string;
}

export enum ETransactionType {
	AIRDROP = 'AIRDROP',
	BUY = 'BUY',
	CONVERT = 'CONVERT',
	DONATION_PAID = 'DONATION_PAID',
	DONATION_RECEIVED = 'DONATION_RECEIVED',
	FIAT_DEPOSIT = 'FIAT_DEPOSIT',
	FIAT_WITHDRAWAL = 'FIAT_WITHDRAWAL',
	GIFT_RECEIVED = 'GIFT_RECEIVED',
	GIFT_SENT = 'GIFT_SENT',
	HARD_FORK = 'HARD_FORK',
	IGNORE = 'IGNORE',
	INCOME = 'INCOME',
	INTEREST_PAID = 'INTEREST_PAID',
	INTEREST_RECEIVED = 'INTEREST_RECEIVED',
	INTERNAL_TRANSFER_IN = 'INTERNAL_TRANSFER_IN',
	INTERNAL_TRANSFER_OUT = 'INTERNAL_TRANSFER_OUT',
	JUST_FEE = 'JUST_FEE',
	LOST = 'LOST',
	MARGIN_FEE = 'MARGIN_FEE',
	MINING = 'MINING',
	OTHER_EXPENSE = 'OTHER_EXPENSE',
	PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
	PAYMENT_SENT = 'PAYMENT_SENT',
	REALIZED_GAIN = 'REALIZED_GAIN',
	REALIZED_LOSS = 'REALIZED_LOSS',
	REWARD = 'REWARD',
	SELL = 'SELL',
	STAKING_LOCKUP = 'STAKING_LOCKUP',
	STAKING_RETURN = 'STAKING_RETURN',
	STAKING_REWARD = 'STAKING_REWARD',
	STOLEN = 'STOLEN',
	SWAP = 'SWAP',
	UNCATEGORIZED = 'UNCATEGORIZED',
	UNCATEGORIZED_INCOME = 'UNCATEGORIZED_INCOME',
	UNCATEGORIZED_OUT = 'UNCATEGORIZED_OUT',
	UNCATEGORIZED_IN = 'UNCATEGORIZED_IN',
	UNCATEGORIZED_TRADE = 'UNCATEGORIZED_TRADE',
	VOID = 'VOID',
}

export enum ETransactionCategory {
	INCOMING = 'INCOMING',
	OUTGOING = 'OUTGOING',
	TRADE = 'TRADE',
	VOID = 'VOID',
}

export enum BatchProcessStatus {
	DONE = 'DONE',
	DUPLICATE = 'DUPLICATE',
	ERROR = 'ERROR',
	INAVLID_DATA = 'INAVLID_DATA', // will be deleted
	INVALID_DATA = 'INVALID_DATA',
	PARTIAL_DUPLICATE = 'PARTIAL_DUPLICATE',
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	UNKNOWNN_SCHEMA = 'UNKNOWNN_SCHEMA', // will be deleted
	UNKNOWNN_STATUS = 'UNKNOWNN_STATUS', // will be deleted
	UNKNOWNN_TYPE = 'UNKNOWNN_TYPE', // will be deleted
	UNKNOWN_SCHEMA = 'UNKNOWN_SCHEMA',
	UNKNOWN_STATUS = 'UNKNOWN_STATUS',
	UNKNOWN_TYPE = 'UNKNOWN_TYPE',
	UPLOADING = 'UPLOADING',
}

export interface ITransactionRecordBatch {
	id?: number | null;
	status?: BatchProcessStatus | null;
	fileLocation?: string | null;
	fileName?: string | null;
	timestampTimeZone?: string | null;
	countTotal?: number | null;
	countDuplicate?: number | null;
	countError?: number | null;
	source?: IUserTransactionRecordSource | null;
	errorCode: string | null;
	errorDescription: string | null;
	errorMessage: string | null;
	importErrors: ITransactionImportError[];
	rawData: string | null;
}

export interface ITransactionRecord {
	id?: any; // string(custom)
	timestamp?: Date;
	tempTimeStamp?: Date | string;
	type?: ETransactionType;
	category?: ETransactionCategory;
	orderId?: string | null;
	tradeId?: string | null;
	outAsset?: string | null;
	outQuantity?: number | null;
	outSpotPrice?: number | null;
	outTotal?: number | null;
	outBalance?: number | null;
	inAsset?: string | null;
	inQuantity?: number | null;
	inSpotPrice?: number | null;
	inTotal?: number | null;
	inBalance?: number | null;
	outFeeAsset?: string | null;
	outFeeQuantity?: number | null;
	outFeeSpotPrice?: number | null;
	outFeeTotal?: number | null;
	outFeeBalance?: number | null;
	inFeeAsset?: string | null;
	inFeeQuantity?: number | null;
	inFeeSpotPrice?: number | null;
	inFeeTotal?: number | null;
	inFeeBalance?: number | null;
	outWalletAddress?: string | null;
	inWalletAddress?: string | null;
	outTransactionHash?: string | null;
	inTransactionHash?: string | null;
	batch?: ITransactionRecordBatch | null;
	user?: ICtUser | null;
	sourceName?: string | null;
	rawTransactions?: IRawTransaction[];
	comments?: ITransactionRecordComment[] | null;
	excluded?: boolean | null;
	costBasis?: number | null;
}

export interface IManualTransactionRecord extends ITransactionRecord {
	tempDate: number;
}
