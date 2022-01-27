/* eslint-disable no-useless-constructor */

import { ITransactionImportError } from '../transaction-import-error/types';
import { ITransactionRecord, ITransactionRecordBatch } from '../transaction/types';

export interface IRawTransaction {
	id?: number;
	value0?: string | null;
	value1?: string | null;
	value2?: string | null;
	value3?: string | null;
	value4?: string | null;
	value5?: string | null;
	value6?: string | null;
	value7?: string | null;
	value8?: string | null;
	value9?: string | null;
	value10?: string | null;
	value11?: string | null;
	value12?: string | null;
	value13?: string | null;
	value14?: string | null;
	value15?: string | null;
	value16?: string | null;
	value17?: string | null;
	value18?: string | null;
	value19?: string | null;
	value20?: string | null;
	value21?: string | null;
	value22?: string | null;
	value23?: string | null;
	value24?: string | null;
	value25?: string | null;
	value26?: string | null;
	value27?: string | null;
	value28?: string | null;
	value29?: string | null;
	importErrors?: ITransactionImportError[] | null;
	transactionRecord?: ITransactionRecord | null;
	batch?: ITransactionRecordBatch | null;
}

export class RawTransaction implements IRawTransaction {
	constructor(
		public id?: number,
		public value0?: string | null,
		public value1?: string | null,
		public value2?: string | null,
		public value3?: string | null,
		public value4?: string | null,
		public value5?: string | null,
		public value6?: string | null,
		public value7?: string | null,
		public value8?: string | null,
		public value9?: string | null,
		public value10?: string | null,
		public value11?: string | null,
		public value12?: string | null,
		public value13?: string | null,
		public value14?: string | null,
		public value15?: string | null,
		public value16?: string | null,
		public value17?: string | null,
		public value18?: string | null,
		public value19?: string | null,
		public value20?: string | null,
		public value21?: string | null,
		public value22?: string | null,
		public value23?: string | null,
		public value24?: string | null,
		public value25?: string | null,
		public value26?: string | null,
		public value27?: string | null,
		public value28?: string | null,
		public value29?: string | null,
		public importErrors?: ITransactionImportError[] | null,
		public transactionRecord?: ITransactionRecord | null,
		public batch?: ITransactionRecordBatch | null,
	) {}
}
