import { ICtUser } from '../common/types';
import { IPlatform, IUserTransactionRecordSource } from '../provider/types';
import { ETransactionType, ITransactionRecord } from '../transaction/types';

export enum EColumnType {
	IN = 'IN',
	OUT = 'OUT',
	IN_FEE = 'IN_FEE',
	OUT_FEE = 'OUT_FEE',
}

export interface IManualCategorize {
	id: number;
	mappedType: ETransactionType;
	originalType: ETransactionType;
	transactionRecord: ITransactionRecord;
	user: ICtUser;
	modifiedInSpotPrice: number | null;
	modifiedInTotal: number | null;
	originalInFeeAsset: string | null;
	originalInFeeBalance: number | null;
	originalInFeeQuantity: number | null;
	originalInFeeSpotPrice: number | null;
	originalInFeeTotal: number | null;
	originalInSpotPrice: number | null;
	originalInTotal: number | null;
}

export interface IMatchIn {
	id: number;
	quantity: number;
	sourceName: string;
	timestamp: Date;
}

export interface IMissingAsset {
	count: number;
	out_asset: string;
	source_id: number;
	missing_quantity: number;
}

export interface IMissingTransactionSource extends IUserTransactionRecordSource {
	missingInfos: IMissingAsset[];
}

export interface IMissingTransactionPlatform extends IPlatform {
	providerSources: IMissingTransactionSource[];
}

export interface IMatchCandidate {
	id: number;
	asset: string;
	idTransaction: number;
	ins: IMatchIn[];
	quantity: number;
	sourceName: string;
	timestamp: Date;
}

export interface IReformedMatchCandidate extends IMatchCandidate {
	selectedMatchIn: IMatchIn;
}

export interface IReformedExcludedMatchCandidate extends IMatchCandidate {
	customId: string;
}

export interface IMissingTransactionRes {
	asset: string;
	id: number;
	outQuantity: number;
	timestamp: string | Date;
	type: ETransactionType;
	unmatchedQty: number;
	unmatchedValue: number;
}

export interface IMissingDate {
	mintime: string;
	maxtime: string;
}

export interface IReformedTransactionRecord extends ITransactionRecord {
	newSymbol?: string;
	newType?: ETransactionType;
	newCostBasis?: number | null;
	enteredCostBasis?: number | null;
}

export enum EEmptyColumn {
	OUT = 'OUT',
	IN = 'IN',
	BOTH = 'BOTH',
}

export interface IMarketPrice {
	emptyColumn: EEmptyColumn;
	columnType: EColumnType;
	price: number | null;
	transactionRecord: ITransactionRecord | null;
}

export enum ETransactionErrorCode {
	UNKNOWN_CURRENCY_ASSET = 'UnknownCurrencyAsset',
	UNMATCHED_INTERNAL = 'UnmatchedInternal',
	NEGATIVE_BALANCE = 'NegativeBalance',
	UNKNOWN_TRANSACTION_TYPE = 'UnknownTransactionType',
	DUPLICATE_RECORD_CODE = 'DuplicateRecord',
	NO_TIMESTAMP_CODE = 'NoTimestamp',
	UNRECOGNIZED_TIMESTAMP = 'UnrecognizedTimestamp',
}

export interface IReviewParams {
	page: number;
	sort: string | null;
}

export interface ICommonReviewParams {
	fromInstant: string | null;
	toInstant: string | null;
	sourceName: string | null;
	providerId: number | null;
	blockchainAsset: string | null;
	category: string | null;
}

export interface IReviewApiParams extends IReviewParams, ICommonReviewParams {}
