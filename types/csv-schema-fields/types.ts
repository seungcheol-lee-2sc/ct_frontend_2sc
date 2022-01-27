import { ITransactionCSVSchema } from '../csv-schema/types';

export enum ESchemaFieldType {
	DOUBLE = 'DOUBLE',
	STRING = 'STRING',
}

export enum EMappedColumn {
	ASSET = 'ASSET',
	ASSET_IN_COLUMN_NAME = 'ASSET_IN_COLUMN_NAME',
	BALANCE = 'BALANCE',
	FEE_ASSET = 'FEE_ASSET',
	FEE_ASSET_IN_COLUMN_NAME = 'FEE_ASSET_IN_COLUMN_NAME',
	FEE_BALANCE = 'FEE_BALANCE',
	FEE_QUANTITY = 'FEE_QUANTITY',
	FEE_SPOT_PRICE = 'FEE_SPOT_PRICE',
	FEE_TOTAL = 'FEE_TOTAL',
	QUANTITY = 'QUANTITY',
	SPOT_PRICE = 'SPOT_PRICE',
	TOTAL = 'TOTAL',
	TRANSACTION_HASH = 'TRANSACTION_HASH',
	WALLET_ADDRESS = 'WALLET_ADDRESS',
}

export enum ESchemaFieldSide {
	FEE = 'FEE',
	IN = 'IN',
	IN_PRICE = 'IN_PRICE',
	OUT = 'OUT',
	OUT_IN = 'OUT_IN',
	OUT_IN_FEE = 'OUT_IN_FEE',
	OUT_IN_PRICE = 'OUT_IN_PRICE',
	OUT_PRICE = 'OUT_PRICE',
}

export interface ITransactionCSVSchemaField {
	conversionRule: string;
	createdDate: Date;
	fieldIndex: number;
	fieldName: string;
	id: number;
	lastModifiedDate: Date;
	mappedColumn: string;
	Enum: EMappedColumn;
	schema: ITransactionCSVSchema;
	side: ESchemaFieldSide;
	type: ESchemaFieldType;
}
