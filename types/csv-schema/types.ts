import { ITransactionCSVSchemaField } from '../csv-schema-fields/types';
import { ETransactionType, ITransactionRecord } from '../transaction/types';

export enum EWorkflowStatus {
	ASSIGNED = 'ASSIGNED',
	COMPLETED = 'COMPLETED',
	ERROR = 'ERROR',
	INVALID = 'INVALID',
	INVESTIGATING = 'INVESTIGATING',
	NEW = 'NEW',
}

export interface ITransactionCSVSchema {
	allowTypeConversionAcrossCategory: boolean;
	createdDate: Date | null;
	defaultTransactionType: ETransactionType;
	fieldList: string;
	fileNameKeyword: string;
	groupByFieldIndex: number;
	groupByFieldName: string;
	id: number;
	ignoreGroupByFieldOnFee: boolean;
	inOutRatioFieldName: string;
	inOutRatioIndex: number;
	inOutRatioRule: string;
	nickname: string;
	lastModifiedDate: Date;
	orderIdFieldName: string;
	orderIdIndex: number;
	recordProvider: ITransactionRecord;
	schemaFields: ITransactionCSVSchemaField[];
	sequence: number;
	sideFieldName: string;
	sideIndex: number;
	sideMap: string;
	skipLines: number;
	timestampFieldName: string;
	timestampFormat: string;
	timestampIndex: number;
	tradeIdFieldName: string;
	tradeIdIndex: number;
	transactionTypeFieldName: string;
	transactionTypeIndex: number;
	transactionTypeMap: string;
	version: string;
	workflowStatus: string;
	Enum: EWorkflowStatus;
}
