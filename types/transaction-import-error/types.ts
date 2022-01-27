/* eslint-disable no-useless-constructor */
import { IRawTransaction } from '../raw-transaction/types';
import { ITransactionRecordBatch } from '../transaction/types';

export interface ITransactionImportError {
	id?: number;
	code?: string | null;
	message?: string | null;
	description?: string | null;
	rawTransaction?: IRawTransaction | null;
	transactionRecordBatch?: ITransactionRecordBatch | null;
}

export class TransactionImportError implements ITransactionImportError {
	constructor(
		public id?: number,
		public code?: string | null,
		public message?: string | null,
		public description?: string | null,
		public rawTransaction?: IRawTransaction | null,
		public transactionRecordBatch?: ITransactionRecordBatch | null,
		public resolved?: boolean | null,
	) {}
}
