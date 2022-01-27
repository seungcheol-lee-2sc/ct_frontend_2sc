<template>
	<span></span>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator';
import { debounce } from 'lodash';
import { EManualSubmitType } from '../form/ManualImportForm.vue';
import { ETransactionType, ITransactionRecord } from '~/types/transaction/types';
import {
	CHANGE_TYPES,
	CLEAR_ALL_FILTERS,
	DELETE_TRANSACTIONS,
	ILoadTransactionsParams,
	LOAD_TRANSACTIONS,
	SET_ACCOUNT_FILTER,
	SET_BLOCKCHAIN_ASSET_FILTER,
	SET_CREATED_TRANSACTION,
	SET_PARAMS,
	SET_PROVIDER_ID_FILTER,
	SET_SELECTED_TRANSACTIONS,
	SET_TEMP_TRANSACTIONS,
	SET_UPDATED_TRANSACTION,
} from '~/store/transaction';
import { ADD_TO_MESSAGE_QUEUE, CONFIRM_ACTION } from '~/store';
import { DATETIME_FORMAT_PRODUCT, DATE_FORMAT_PRODUCT } from '~/utils/constants';
import { makeNewTransaction } from '~/utils/application';
import { ESortOrder } from '~/types/common/types';
import { LOAD_PROVIDER_SOURCES } from '~/store/provider';
import { IChangeTypesDTO } from '~/types/transaction/dto';
import { IManualCategorize } from '~/types/review/types';

@Component
export default class TransactionDefault extends Vue {
	@State(({ transaction }) => transaction.params) params!: ILoadTransactionsParams;
	@State(({ transaction }) => transaction.loading) loading!: boolean;
	@State(({ transaction }) => transaction.selectedTransactions) selectedTransactions!: ITransactionRecord[];
	@State(state => state.isMobile) isMobile!: boolean;

	isThisReviewpage: boolean = false;
	ESortOrder = ESortOrder;
	EManualSubmitType = EManualSubmitType;
	DATE_FORMAT_PRODUCT = DATE_FORMAT_PRODUCT;
	DATETIME_FORMAT_PRODUCT = DATETIME_FORMAT_PRODUCT;
	expandedTransacitons: ITransactionRecord[] = [];
	tableContent: HTMLElement | null = null;

	srollTop() {
		document.querySelector('#transactionsTable > div')?.scrollTo(0, 0);
	}

	platformFilterSetter(platform: number | string | null): ILoadTransactionsParams {
		let params: ILoadTransactionsParams = {
			...this.params,
			providerId: null,
			blockchainAsset: null,
			sourceName: null,
			page: 0,
		};
		this.$store.commit(`transaction/${SET_ACCOUNT_FILTER}`, null);
		if (typeof platform === 'number') {
			this.$store.commit(`transaction/${SET_PROVIDER_ID_FILTER}`, platform); // providerId
			this.$store.commit(`transaction/${SET_BLOCKCHAIN_ASSET_FILTER}`, null);
			params = { ...this.params, providerId: platform, blockchainAsset: null, sourceName: null, page: 0 };
		} else if (typeof platform === 'string') {
			// asset symbol
			this.$store.commit(`transaction/${SET_PROVIDER_ID_FILTER}`, null);
			this.$store.commit(`transaction/${SET_BLOCKCHAIN_ASSET_FILTER}`, platform);
			params = { ...this.params, providerId: null, blockchainAsset: platform, sourceName: null, page: 0 };
		} else {
			this.$store.commit(`transaction/${SET_PROVIDER_ID_FILTER}`, null);
			this.$store.commit(`transaction/${SET_BLOCKCHAIN_ASSET_FILTER}`, null);
		}
		return params;
	}

	onClickClearAllFilters() {
		this.$store.commit(`transaction/${CLEAR_ALL_FILTERS}`);
		this.retrieve({
			...this.params,
			sourceName: null,
			type: null,
			category: null,
			providerId: null,
			blockchainAsset: null,
			asset: null,
			fromInstant: null,
			toInstant: null,
			page: 0,
		});
	}

	onClickPrev() {
		const newParams: ILoadTransactionsParams = {
			...this.params,
			page: isNaN(+this.params.page) ? 0 : +this.params.page - 1,
		};
		this.retrieve(newParams);
	}

	onClickNext() {
		const newParams: ILoadTransactionsParams = {
			...this.params,
			page: isNaN(+this.params.page) ? 0 : +this.params.page + 1,
		};
		this.retrieve(newParams);
	}

	onChangeSize(size: number) {
		if (size === this.params.size) return;
		const newParams: ILoadTransactionsParams = { ...this.params, size, page: 0 };
		this.retrieve(newParams);
	}

	async onChangeTypes(transactions: ITransactionRecord[], type: ETransactionType) {
		if (!transactions || transactions.length === 0) return;
		const DTO: IChangeTypesDTO[] = transactions.map(t => ({
			transactionRecordId: t.id || 0,
			type,
			costBasis: null,
		}));
		const res: IManualCategorize[] | boolean = await this.$store.dispatch(`transaction/${CHANGE_TYPES}`, { data: DTO });
		const msg = transactions.length === 1 ? '1 item is updated' : `${transactions.length} items are updated`;
		if (res !== false) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg });
			this.$store.commit(`transaction/${SET_SELECTED_TRANSACTIONS}`, []);
			this.expandedTransacitons = [];
		} else {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Fail to update type' });
		}
	}

	onClickDelete(transactions: ITransactionRecord[]) {
		const msg = String(this.$t('message.delete'));
		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.delete'),
			text: msg,
			pending: async () => {
				await this.$store.dispatch(
					`transaction/${DELETE_TRANSACTIONS}`,
					transactions.map(t => t.id),
				);
				this.retrieve(this.params);
				this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
			},
		});
	}

	onClickAddTransaction() {
		this.$store.commit(`transaction/${SET_UPDATED_TRANSACTION}`, null);
		this.$store.commit(`transaction/${SET_CREATED_TRANSACTION}`, makeNewTransaction());
	}

	retrieve(params: ILoadTransactionsParams) {
		this.$store.commit(`transaction/${SET_PARAMS}`, params);
		// querySyncer(params, this.$router, this.$route);
		this.retrieveAction(params);
	}

	retrieveAction = debounce(async (params: ILoadTransactionsParams) => {
		this.srollTop();
		this.$store.commit(`transaction/${SET_TEMP_TRANSACTIONS}`, []);
		this.$store.commit(`transaction/${SET_SELECTED_TRANSACTIONS}`, []);
		this.expandedTransacitons = [];
		await this.$store.dispatch(`transaction/${LOAD_TRANSACTIONS}`, params);
	}, 300);
}
</script>
