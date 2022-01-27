import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { ADD_TO_MESSAGE_QUEUE, RootState } from '.';
import {
	ETransactionCategory,
	ETransactionType,
	IFlattenTransactionType,
	IManualTransactionRecord,
	ITransactionRecord,
	ITransactionType,
} from '~/types/transaction/types';
import { ESortOrder } from '~/types/common/types';
import { IManualCategorize } from '~/types/review/types';
import {
	IChangeTypes,
	IExcludeTransactionsDTO,
	ILoadTransactionsHistoryDTO,
	ILoadTransactionsHistoryRes,
} from '~/types/transaction/dto';

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const SET_TRANSACTIONS_COUNT = 'SET_TRANSACTIONS_COUNT';
export const DELETE_TRANSACTIONS = 'DELETE_TRANSACTIONS';
export const LOADING_START = 'LOADING_START';
export const LOADING_END = 'LOADING_END';
export const LOAD_ALL_TYPES = 'LOAD_ALL_TYPES';
export const SET_CREATED_TRANSACTION = 'SET_CREATED_TRANSACTION';
export const SET_UPDATED_TRANSACTION = 'SET_UPDATED_TRANSACTION';
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';
export const UPDATE_TRANSACTION_COMMENT = 'UPDATE_TRANSACTION_COMMENT';
export const SET_PARAMS = 'SET_PARAMS';
export const SET_TYPE_FILTER = 'SET_TYPE_FILTER';
export const SET_ACCOUNT_FILTER = 'SET_ACCOUNT_FILTER';
export const SET_PROVIDER_ID_FILTER = 'SET_PROVIDER_ID_FILTER';
export const SET_BLOCKCHAIN_ASSET_FILTER = 'SET_BLOCKCHAIN_ASSET_FILTER';
export const SET_CATEGORY_FILTER = 'SET_CATEGORY_FILTER';
export const SET_FROM_FILTER = 'SET_FROM_FILTER';
export const SET_TO_FILTER = 'SET_TO_FILTER';
export const SET_CURRENCY_FILTER = 'SET_CURRENCY_FILTER';
export const ADD_MANUAL_IMPORTED_TRANSACTION = 'ADD_MANUAL_IMPORTED_TRANSACTION';
export const SET_MANUAL_UPDATED_TRANSACTION = 'SET_MANUAL_UPDATED_TRANSACTION';
export const EXCLUDE_TRANSACTIONS = 'EXCLUDE_TRANSACTIONS';
export const UPDATE_MANUAL_IMPORTED_TRANSACTION = 'UPDATE_MANUAL_IMPORTED_TRANSACTION';
export const SET_MANUAL_IMPORTED_TRANSACTION = 'SET_MANUAL_IMPORTED_TRANSACTION';
export const DELETE_MANUAL_IMPORTED_TRANSACTION = 'DELETE_MANUAL_IMPORTED_TRANSACTION';
export const DELETE_MANUAL_IMPORTED_TRANSACTIONS_ALL = 'DELETE_MANUAL_IMPORTED_TRANSACTIONS_ALL';
export const CHANGE_TYPES = 'CHANGE_TYPES';
export const CLEAR_ALL_FILTERS = 'CLEAR_ALL_FILTERS';
export const LOAD_TRANSACTIONS_HISTORY = 'LOAD_TRANSACTIONS_HISTORY';
export const LOAD_TRANSACTIONS_FEE = 'LOAD_TRANSACTIONS_FEE';
export const SET_TEMP_TRANSACTIONS = 'SET_TEMP_TRANSACTIONS';
export const ADD_TEMP_TRANSACTION = 'ADD_TEMP_TRANSACTION';
export const SET_SELECTED_TRANSACTIONS = 'SET_SELECTED_TRANSACTIONS';
export const ADD_SELECTED_TRANSACTION = 'ADD_SELECTED_TRANSACTION';
export const REMOVE_SELECTED_TRANSACTION = 'REMOVE_SELECTED_TRANSACTION';
export const TOGGLE_SELECTED_TRANSACTION = 'TOGGLE_SELECTED_TRANSACTION';
export const DELETE_ALL_TRANSACTIONS = 'DELETE_ALL_TRANSACTIONS';

export interface ILoadTransactionsParams {
	page: number;
	size: number;
	sort: string | null;
	sourceName: string | null;
	providerId: number | null;
	blockchainAsset: string | null;
	type: string | null;
	category: string | null;
	fromInstant: string | null;
	toInstant: string | null;
	asset: string | null;
}

const DLoadTransactionParams: ILoadTransactionsParams = {
	page: 0,
	size: 200,
	sort: `timestamp,${ESortOrder.ASC}`,
	sourceName: null,
	providerId: null,
	blockchainAsset: null,
	type: null,
	category: null,
	fromInstant: null,
	toInstant: null,
	asset: null,
};

export const TRANSACTION_SIZE_ARR = [10, 50, 100, 150, 200];

export const typeEditable = (transactions: ITransactionRecord[]): boolean => {
	if (!transactions || transactions.length === 0) return false;
	return !transactions.find(v => v.type === ETransactionType.BUY || v.type === ETransactionType.SELL);
};

export const state = () => ({
	params: { ...DLoadTransactionParams } as ILoadTransactionsParams,
	loading: false as boolean,
	transactions: [] as ITransactionRecord[],
	totalTransactions: 0 as number,
	manualImportedTransactions: [] as IManualTransactionRecord[],
	manualUpdatedTransaction: null as IManualTransactionRecord | null,
	manualEditedTransactionIdx: null as number | null,
	transactionTypes: new Map() as Map<ETransactionType, ITransactionType>,
	transactionTypeArr: [] as IFlattenTransactionType[],
	createdTransaction: null as ITransactionRecord | null,
	updatedTransaction: null as ITransactionRecord | null,
	importedTransaction: null as ITransactionRecord | null,
	typeFilter: null as IFlattenTransactionType | null,
	accountFilter: null as string | null,
	providerIdFilter: null as number | null,
	blockchainAssetFilter: null as string | null,
	currencyFilter: null as string | null,
	categoryFilter: null as string | null,
	fromDateFilter: null as string | null,
	toDateFilter: null as string | null,
	selectedTransactions: [] as ITransactionRecord[],
	expandedTransacitons: [] as ITransactionRecord[],
	usedAssets: [] as string[],
	tempTransactions: [] as ITransactionRecord[],
});

export type TransactionState = ReturnType<typeof state>;

export const getters: GetterTree<TransactionState, RootState> = {
	transactionCategoryArr: (_state): string[] => {
		return [ETransactionCategory.TRADE, ETransactionCategory.INCOMING, ETransactionCategory.OUTGOING];
	},
};

export const mutations: MutationTree<TransactionState> = {
	[TOGGLE_SELECTED_TRANSACTION]: (state, payload: ITransactionRecord) => {
		const foundIndex = state.selectedTransactions.findIndex(v => v.id === payload.id);
		if (foundIndex === -1) {
			state.selectedTransactions.push(payload);
		} else {
			state.selectedTransactions = state.selectedTransactions.filter((_, idx) => idx !== foundIndex);
		}
	},
	[REMOVE_SELECTED_TRANSACTION]: (state, payload: ITransactionRecord) => {
		const foundIndex = state.selectedTransactions.findIndex(v => v.id === payload.id);
		state.selectedTransactions = state.selectedTransactions.filter((_, idx) => idx !== foundIndex);
	},
	[ADD_SELECTED_TRANSACTION]: (state, payload: ITransactionRecord) => {
		const foundIndex = state.selectedTransactions.findIndex(v => v.id === payload.id);
		foundIndex === -1 && state.selectedTransactions.push(payload);
	},
	[SET_SELECTED_TRANSACTIONS]: (state, payload: ITransactionRecord[]) => {
		state.selectedTransactions = payload;
	},
	[ADD_TEMP_TRANSACTION]: (state, payload: ITransactionRecord) => {
		state.tempTransactions.push(payload);
	},
	[SET_TEMP_TRANSACTIONS]: (state, payload: ITransactionRecord[]) => {
		state.tempTransactions = payload;
	},
	[CLEAR_ALL_FILTERS]: state => {
		state.createdTransaction = null;
		state.updatedTransaction = null;
		state.typeFilter = null;
		state.accountFilter = null;
		state.providerIdFilter = null;
		state.blockchainAssetFilter = null;
		state.categoryFilter = null;
		state.fromDateFilter = null;
		state.currencyFilter = null;
		state.toDateFilter = null;
		state.params = { ...DLoadTransactionParams, size: state.params.size };
	},
	[CHANGE_TYPES]: (state, payload: IChangeTypes) => {
		payload.data.forEach(d => {
			const foundIndex = state.transactions.findIndex((v: ITransactionRecord) => v.id === d.transactionRecordId);
			if (foundIndex !== -1) {
				state.transactions[foundIndex].type = d.type;
			}
		});
	},
	[ADD_MANUAL_IMPORTED_TRANSACTION]: (state, payload: IManualTransactionRecord) => {
		state.manualImportedTransactions.push(payload);
		state.totalTransactions = state.manualImportedTransactions.length;
	},
	[UPDATE_MANUAL_IMPORTED_TRANSACTION]: (state, payload: IManualTransactionRecord) => {
		const foundIndex = state.manualImportedTransactions.findIndex(v => v.tempDate === payload.tempDate);
		if (foundIndex !== -1) {
			console.log('payload : ', payload);
			state.manualImportedTransactions.splice(foundIndex, 1, { ...payload, tempDate: new Date().valueOf() });
		}
	},
	[SET_MANUAL_UPDATED_TRANSACTION]: (state, payload: IManualTransactionRecord) => {
		state.manualUpdatedTransaction = payload;
	},
	[DELETE_MANUAL_IMPORTED_TRANSACTION]: (state, index: number) => {
		state.manualImportedTransactions.splice(index, 1);
		state.totalTransactions = state.manualImportedTransactions.length;
	},
	[DELETE_MANUAL_IMPORTED_TRANSACTIONS_ALL]: state => {
		state.manualImportedTransactions = [];
	},
	[SET_CURRENCY_FILTER]: (state, payload: string | null) => {
		state.currencyFilter = payload;
	},
	[SET_FROM_FILTER]: (state, payload: string | null) => {
		state.fromDateFilter = payload;
	},
	[SET_TO_FILTER]: (state, payload: string | null) => {
		state.toDateFilter = payload;
	},
	[SET_TYPE_FILTER]: (state, payload: IFlattenTransactionType | null) => {
		state.typeFilter = payload;
	},
	[SET_ACCOUNT_FILTER]: (state, payload: string | null) => {
		state.accountFilter = payload;
	},
	[SET_PROVIDER_ID_FILTER]: (state, payload: number | null) => {
		state.providerIdFilter = payload;
	},
	[SET_BLOCKCHAIN_ASSET_FILTER]: (state, payload: string | null) => {
		state.blockchainAssetFilter = payload;
	},
	[SET_CATEGORY_FILTER]: (state, payload: string | null) => {
		state.categoryFilter = payload;
	},
	[UPDATE_TRANSACTION]: (state, payload: ITransactionRecord) => {
		const foundIndex = state.transactions.findIndex((v: ITransactionRecord) => v.id === payload.id);
		if (foundIndex !== -1) {
			state.transactions.splice(foundIndex, 1, payload);
		}
	},
	[SET_PARAMS]: (state, payload: ILoadTransactionsParams) => {
		state.params = payload;
	},
	[SET_UPDATED_TRANSACTION]: (state, payload: ITransactionRecord) => {
		state.updatedTransaction = payload;
	},
	[SET_CREATED_TRANSACTION]: (state, payload: ITransactionRecord) => {
		state.createdTransaction = payload;
	},
	[SET_MANUAL_IMPORTED_TRANSACTION]: (state, payload: ITransactionRecord | null) => {
		state.importedTransaction = payload;
	},
	[LOAD_ALL_TYPES]: (state, payload: any) => {
		// @ts-ignore
		state.transactionTypes = new Map(Object.entries(payload));

		const result: IFlattenTransactionType[] = [];

		state.transactionTypes.forEach((value, key) => {
			let rank = 9999;
			if (
				key === ETransactionType.INTERNAL_TRANSFER_IN ||
				key === ETransactionType.INTERNAL_TRANSFER_OUT ||
				key === ETransactionType.BUY
			) {
				rank = 1;
			} else if (
				key === ETransactionType.INTEREST_RECEIVED ||
				key === ETransactionType.JUST_FEE ||
				key === ETransactionType.SELL
			) {
				rank = 2;
			} else if (
				key === ETransactionType.STAKING_REWARD ||
				key === ETransactionType.INTEREST_PAID ||
				key === ETransactionType.CONVERT
			) {
				rank = 3;
			} else if (key === ETransactionType.REWARD || key === ETransactionType.LOST || key === ETransactionType.SWAP) {
				rank = 4;
			} else if (key === ETransactionType.AIRDROP || key === ETransactionType.STOLEN) {
				rank = 5;
			} else if (key === ETransactionType.HARD_FORK) {
				rank = 6;
			}

			result.push({
				...value,
				nameForSort: `${value.category} ${rank} ${key}`,
				type: key,
			});
		});
		state.transactionTypeArr = result.sort((a, b) => (a.nameForSort > b.nameForSort ? 1 : -1));
	},
	[LOADING_START]: state => {
		state.loading = true;
	},
	[LOADING_END]: state => {
		state.loading = false;
	},
	[LOAD_TRANSACTIONS]: (state, payload) => {
		state.transactions = payload;
	},
	[SET_TRANSACTIONS_COUNT]: (state, payload) => {
		state.totalTransactions = payload.headers['x-total-count'] || 0;
	},
};

export const actions: ActionTree<TransactionState, RootState> = {
	async [CHANGE_TYPES]({ commit }, payload: IChangeTypes): Promise<IManualCategorize[] | boolean> {
		try {
			const res = await this.$axios({
				method: 'PUT',
				url: '/services/ct/api/transaction-records/type/update/bulk',
				data: payload.data,
			});

			!payload.denyMutation && commit(CHANGE_TYPES, payload);
			return res.data;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_TRANSACTIONS]({ commit, dispatch }, params: ILoadTransactionsParams) {
		commit(LOADING_START);

		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/transaction-records/user/current/with-filter`,
				params,
			});
			commit(LOAD_TRANSACTIONS, res.data);
			commit(SET_TRANSACTIONS_COUNT, res);
		} catch (error) {
			console.error(error);
			dispatch(
				ADD_TO_MESSAGE_QUEUE,
				{
					color: 'error',
					msg: this.$i18n.t('message.fail.loadTarget', { target: this.$i18n.t('product.transactions') }),
				},
				{ root: true },
			);
		}
		commit(LOADING_END);
	},
	async [DELETE_TRANSACTIONS]({ dispatch }, transactionIds: number[]) {
		const msg =
			transactionIds.length === 1
				? this.$i18n.t('message.deleteItem.a')
				: this.$i18n.t('message.deleteItem.multiple', { num: transactionIds.length });

		try {
			await this.$axios({
				method: 'DELETE',
				url: `/services/ct/api/transaction-records/${transactionIds.join(',')}/children/delete/all`,
			});
		} catch ({ response }) {
			console.error(response);
			dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$i18n.t('message.fail.delete') }, { root: true });
			return;
		}
		dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg }, { root: true });
	},
	async [LOAD_ALL_TYPES]({ commit }): Promise<boolean> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/transaction-records/types/all',
			});
			commit(LOAD_ALL_TYPES, res.data);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [UPDATE_TRANSACTION]({ commit }, payload: ITransactionRecord): Promise<boolean> {
		try {
			await this.$axios({
				method: 'PUT',
				url: `/services/ct/api/transaction-records/${payload.id}`,
				data: payload,
			});

			commit(UPDATE_TRANSACTION, payload);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [EXCLUDE_TRANSACTIONS](_, payload: IExcludeTransactionsDTO): Promise<boolean> {
		try {
			const idList = payload.transactions.map(v => v.id).join(',');
			await this.$axios({
				method: 'PUT',
				url: `/services/ct/api/transaction-records/${idList}/exclude/update/${payload.isExcluded}`,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_TRANSACTIONS_HISTORY](
		_,
		payload: ILoadTransactionsHistoryDTO,
	): Promise<ILoadTransactionsHistoryRes[] | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/transaction-records/count-by-month/login/${payload.username}`,
				params: {
					fromInstant: payload.fromInstant,
					toInstant: payload.toInstant,
				},
			});
			return res.data;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_TRANSACTIONS_FEE](_, username: string): Promise<number[] | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/transaction-records/fee-stats/login/${username}`,
			});
			return res.data;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [DELETE_ALL_TRANSACTIONS](_, username: string): Promise<boolean> {
		try {
			await this.$axios({
				method: 'DELETE',
				url: `/services/ct/api/user-transaction-record-sources/user/login/${username}`,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
};
