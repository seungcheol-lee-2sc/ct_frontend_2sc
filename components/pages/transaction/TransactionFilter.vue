<template>
	<span class="productFilterWrapper">
		<DateFilter
			:final-from-filter="fromDateFilter"
			:final-to-filter="toDateFilter"
			@fromSetter="fromSetter"
			@toSetter="toSetter"
			@onclear="clearDateFilter"
			@onsave="saveDateFilter"
		/>

		<CategoryFilter :final-filter="categoryFilter" @selector="selectCategoryFilter" />

		<PlatformFilter
			:final-filter="platformFinalFilter"
			@parentSelector="selectPlatformFilter"
			@selector="selectAccountFilter"
		/>

		<CurrencyFilter :final-filter="currencyFilter" @selector="selectCurrencyFilter" />

		<TypeFilter :final-filter="typeFilter" :parent-filter="categoryFilter" @selector="selectTypeFilter" />

		<ClearAllButton v-if="filtered" @click="onClickClearAllFilters" />
	</span>
</template>

<script lang="ts">
import { Component, State } from 'nuxt-property-decorator';
import {
	ILoadTransactionsParams,
	SET_ACCOUNT_FILTER,
	SET_CATEGORY_FILTER,
	SET_CURRENCY_FILTER,
	SET_FROM_FILTER,
	SET_TO_FILTER,
	SET_TYPE_FILTER,
} from '~/store/transaction';
import ProductMenuList from '~/components/list/ProductMenuList.vue';
import { IFlattenTransactionType } from '~/types/transaction/types';
import DateFilter from '~/components/select/DateFilter.vue';
import CategoryFilter from '~/components/select/CategoryFilter.vue';
import PlatformFilter from '~/components/select/PlatformFilter.vue';
import TypeFilter from '~/components/select/TypeFilter.vue';
import ClearAllButton from '~/components/button/ClearAllButton.vue';
import { IUserTransactionRecordSource } from '~/types/provider/types';
import TransactionDefault from '~/components/mixins/TransactionDefault.vue';
import CurrencyFilter from '~/components/select/CurrencyFilter.vue';

@Component({
	components: {
		ClearAllButton,
		ProductMenuList,
		DateFilter,
		CategoryFilter,
		PlatformFilter,
		TypeFilter,
		CurrencyFilter,
	},
})
export default class TransactionFilter extends TransactionDefault {
	@State(({ transaction }) => transaction.typeFilter) typeFilter!: IFlattenTransactionType | null;
	@State(({ transaction }) => transaction.accountFilter) accountFilter!: string | null;
	@State(({ transaction }) => transaction.currencyFilter) currencyFilter!: string | null;
	@State(({ transaction }) => transaction.providerIdFilter) providerIdFilter!: number | null;
	@State(({ transaction }) => transaction.blockchainAssetFilter) blockchainAssetFilter!: string | null;
	@State(({ transaction }) => transaction.categoryFilter) categoryFilter!: string | null;
	@State(({ transaction }) => transaction.fromDateFilter) fromDateFilter!: string | null;
	@State(({ transaction }) => transaction.toDateFilter) toDateFilter!: string | null;
	@State(({ provider }) => provider.providerSources) providerSources!: IUserTransactionRecordSource[];

	get filtered(): boolean {
		return Boolean(
			this.typeFilter ||
				this.accountFilter ||
				this.providerIdFilter ||
				this.blockchainAssetFilter ||
				this.categoryFilter ||
				this.fromDateFilter ||
				this.toDateFilter ||
				this.currencyFilter,
		);
	}

	get platformFinalFilter(): string {
		if (this.accountFilter) {
			return this.accountFilter;
		} else if (this.providerIdFilter) {
			const foundSource: IUserTransactionRecordSource | undefined = this.providerSources.find(
				v => v.provider?.id === this.providerIdFilter,
			);
			return foundSource?.provider?.name || '';
		} else if (this.blockchainAssetFilter) {
			const foundSource: IUserTransactionRecordSource | undefined = this.providerSources.find(
				v => v.asset?.symbol === this.blockchainAssetFilter,
			);
			return foundSource?.asset?.name || '';
		}
		return '';
	}

	selectTypeFilter(transactionType: IFlattenTransactionType | null) {
		if (this.typeFilter === null && transactionType === null) return;
		if (this.typeFilter !== null && transactionType !== null && this.typeFilter.type === transactionType.type) return;

		this.$store.commit(`transaction/${SET_TYPE_FILTER}`, transactionType);
		const params: ILoadTransactionsParams = {
			...this.params,
			type: transactionType?.type ? String(transactionType?.type) : null,
			page: 0,
		};
		this.retrieve(params);
	}

	selectCurrencyFilter(currency: string | null) {
		this.$store.commit(`transaction/${SET_CURRENCY_FILTER}`, currency);

		const params: ILoadTransactionsParams = {
			...this.params,
			asset: currency,
			page: 0,
		};
		this.retrieve(params);
	}

	selectPlatformFilter(platform: number | string | null) {
		const params: ILoadTransactionsParams = this.platformFilterSetter(platform);
		this.retrieve(params);
	}

	selectAccountFilter(accountName: string | null) {
		if (this.accountFilter === null && accountName === null) return;

		this.$store.commit(`transaction/${SET_ACCOUNT_FILTER}`, accountName);
		// @ts-ignore
		const params: ILoadTransactionsParams = {
			...this.params,
			sourceName: accountName || null,
			providerId: null,
			blockchainAsset: null,
			page: 0,
		};
		this.retrieve(params);
	}

	setCurrencyFilter(currency: string | null) {
		if (this.currencyFilter === null && currency === null) return;

		const params: ILoadTransactionsParams = {
			...this.params,
			asset: currency,
			page: 0,
		};
		this.retrieve(params);
	}

	selectCategoryFilter(category: string | null) {
		if (this.categoryFilter === category) return;

		this.$store.commit(`transaction/${SET_CATEGORY_FILTER}`, category);
		let params: ILoadTransactionsParams = { ...this.params, category, page: 0 };

		if (this.typeFilter && this.typeFilter.category !== category) {
			this.$store.commit(`transaction/${SET_TYPE_FILTER}`, null);
			params = { ...params, type: null };
		}
		this.retrieve(params);
	}

	clearDateFilter() {
		const params: ILoadTransactionsParams = { ...this.params, fromInstant: null, toInstant: null, page: 0 };
		this.retrieve(params);
	}

	saveDateFilter(from: string, to: string) {
		const params: ILoadTransactionsParams = {
			...this.params,
			fromInstant: from ? `${from}T00:00:00Z` : '',
			toInstant: to ? `${to}T00:00:00Z` : '',
			page: 0,
		};
		this.retrieve(params);
	}

	fromSetter(data: string | null) {
		this.$store.commit(`transaction/${SET_FROM_FILTER}`, data);
	}

	toSetter(data: string | null) {
		this.$store.commit(`transaction/${SET_TO_FILTER}`, data);
	}
}
</script>
