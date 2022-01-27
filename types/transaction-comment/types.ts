/* eslint-disable no-useless-constructor */
import { ITransactionRecord } from '../transaction/types';

export interface ITransactionRecordComment {
	id?: number;
	comment?: string | null;
	transactionRecord?: ITransactionRecord | null;
}

export class TransactionRecordComment implements ITransactionRecordComment {
	constructor(
		public id?: number,
		public comment?: string | null,
		public transactionRecord?: ITransactionRecord | null,
	) {}
}
