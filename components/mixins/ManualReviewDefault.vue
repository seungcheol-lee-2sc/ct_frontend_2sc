<template>
	<div></div>
</template>

<script lang="ts">
import { Component, State, Vue, Watch } from 'nuxt-property-decorator';
import { foundFlattenType } from '../select/TypeSelector.vue';
import { IFlattenTransactionType } from '~/types/transaction/types';
import { DATETIME_FORMAT_PRODUCT } from '~/utils/constants';
import { REVIEW_PER_PAGE } from '~/store/review';
import { IUserTransactionRecordSource } from '~/types/provider/types';
import { addComma, firstCharUppercase } from '~/utils/string';
import { uniqueKeyChecker } from '~/utils/func';
import { EEmptyColumn, IReviewApiParams } from '~/types/review/types';
import { ESortOrder } from '~/types/common/types';
import { pageLength, paginationText } from '~/utils/application';
import { roundingNumber } from '~/utils/number';

export enum EReviewStatus {
	errors = 'errors',
	fines = 'fines',
	excluded = 'excluded',
}

export interface IAdditionalInfo {
	id: null | number;
	value: any;
}

@Component
export default class ManualReviewDefault extends Vue {
	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ provider }) => provider.providerSources) providerSources!: IUserTransactionRecordSource[];
	@State(({ provider }) => provider.importSwitch) importSwitch!: boolean;
	@State(({ transaction }) => transaction.transactionTypeArr) transactionTypeArr!: IFlattenTransactionType[];

	clearAllTrigger: boolean = false;
	errorDatas: any[] = [];
	fineDatas: any[] = [];
	excludedDatas: any[] = [];
	REVIEW_PER_PAGE = REVIEW_PER_PAGE;
	EEmptyColumn = EEmptyColumn;
	EReviewStatus = EReviewStatus;
	DATETIME_FORMAT_PRODUCT = DATETIME_FORMAT_PRODUCT;
	errorsSelected: any[] = [];
	errorsExpanded: any[] = [];
	finesSelected: any[] = [];
	finesExpanded: any[] = [];
	excludedSelected: any[] = [];
	excludedExpanded: any[] = [];
	tab = 0;
	errorsSortBy: string | null = null;
	errorsSortDesc: boolean | null = null;
	finesSortBy: string | null = null;
	finesSortDesc: boolean | null = null;
	excludedSortBy: string | null = null;
	excludedSortDesc: boolean | null = null;
	actionLoading: boolean = false;
	errorsTotal: number = 0;
	finesTotal: number = 0;
	excludedTotal: number = 0;
	errorLoading: boolean = false;
	fineLoading: boolean = false;
	excludedLoading: boolean = false;
	//
	fromInstant: string | null = null;
	toInstant: string | null = null;
	categoryFilter: string | null = null;
	sourceNameFilter: string | null = null;
	providerIdFilter: number | null = null;
	symbolFilter: string | null = null;
	errorsPage: number = 0;
	finesPage: number = 0;
	excludedPage: number = 0;
	tableHeight: number = 0;
	manualReviewCardElement: HTMLElement | null = null;
	tabWrapperElement: HTMLElement | null = null;
	topSectionElement: HTMLElement | null = null;

	@Watch('tab')
	watchTab() {
		this.errorsSelected = [];
		this.errorsExpanded = [];
		this.finesSelected = [];
		this.finesExpanded = [];
		this.excludedSelected = [];
		this.excludedExpanded = [];
	}

	get filtered() {
		return (
			this.fromInstant ||
			this.toInstant ||
			this.categoryFilter ||
			this.sourceNameFilter ||
			this.providerIdFilter ||
			this.symbolFilter
		);
	}

	get platformFilter(): string {
		if (this.sourceNameFilter) {
			return this.sourceNameFilter;
		} else if (this.providerIdFilter) {
			const foundSource: IUserTransactionRecordSource | undefined = this.providerSources.find(
				v => v.provider?.id === this.providerIdFilter,
			);
			return foundSource?.provider?.name || '';
		} else if (this.symbolFilter) {
			const foundSource: IUserTransactionRecordSource | undefined = this.providerSources.find(
				v => v.asset?.symbol === this.symbolFilter,
			);
			return foundSource?.asset?.name || '';
		}
		return '';
	}

	get errorsPageLength(): number {
		return pageLength(this.errorsTotal, REVIEW_PER_PAGE);
	}

	get errorsPaginationText(): string {
		return paginationText(this.errorsPage, REVIEW_PER_PAGE, this.errorsTotal, this.errorDatas.length);
	}

	get finesPageLength(): number {
		return pageLength(this.finesTotal, REVIEW_PER_PAGE);
	}

	get finesPaginationText(): string {
		return paginationText(this.finesPage, REVIEW_PER_PAGE, this.finesTotal, this.fineDatas.length);
	}

	get excludedPageLength(): number {
		return pageLength(this.excludedTotal, REVIEW_PER_PAGE);
	}

	get excludedPaginationText(): string {
		return paginationText(this.excludedPage, REVIEW_PER_PAGE, this.excludedTotal, this.excludedDatas.length);
	}

	get defaultParams(): IReviewApiParams {
		return {
			page: 0,
			sort: null,
			fromInstant: this.fromInstant || null,
			toInstant: this.toInstant || null,
			sourceName: this.sourceNameFilter || null,
			providerId: this.providerIdFilter || null,
			blockchainAsset: this.symbolFilter || null,
			category: this.categoryFilter || null,
		};
	}

	get errorsParams(): IReviewApiParams {
		const sort =
			this.errorsSortDesc === null
				? null
				: `${this.errorsSortBy},${this.errorsSortDesc ? ESortOrder.DESC : ESortOrder.ASC}`;
		return { ...this.defaultParams, page: this.errorsPage || 0, sort };
	}

	get finesParams(): IReviewApiParams {
		const sort =
			this.finesSortDesc === null
				? null
				: `${this.finesSortBy},${this.finesSortDesc ? ESortOrder.DESC : ESortOrder.ASC}`;
		return { ...this.defaultParams, page: this.finesPage || 0, sort };
	}

	get excludedParams(): IReviewApiParams {
		const sort =
			this.excludedSortDesc === null
				? null
				: `${this.excludedSortBy},${this.excludedSortDesc ? ESortOrder.DESC : ESortOrder.ASC}`;
		return { ...this.defaultParams, page: this.excludedPage || 0, sort };
	}

	get typeChangable(): boolean {
		return uniqueKeyChecker(this.errorsSelected, 'category');
	}

	filterErrorsSelected(datas: any[]) {
		const ids = datas.map(v => v.id);
		this.errorsSelected = this.errorsSelected.filter(v => !ids.includes(v.id));
	}

	filterFinesSelected(datas: any[]) {
		const ids = datas.map(v => v.id);
		this.finesSelected = this.finesSelected.filter(v => !ids.includes(v.id));
	}

	filterExcludedSelected(datas: any[]) {
		const ids = datas.map(v => v.id);
		this.excludedSelected = this.excludedSelected.filter(v => !ids.includes(v.id));
	}

	onSortByErrors(e: string) {
		this.errorsSortBy = e || null;
	}

	onSortDescErrors(e: boolean) {
		this.errorsSortDesc = typeof e === 'boolean' ? e : null;
		this.loadErrors();
	}

	onSortByFines(e: string) {
		this.finesSortBy = e || null;
	}

	onSortDescFines(e: boolean) {
		this.finesSortDesc = typeof e === 'boolean' ? e : null;
		this.loadFines();
	}

	onSortByExcluded(e: string) {
		this.excludedSortBy = e || null;
	}

	onSortDescExcluded(e: boolean) {
		this.excludedSortDesc = typeof e === 'boolean' ? e : null;
		this.loadExcluded();
	}

	onClickNextErrors() {
		this.errorsPage += 1;
		this.retrieve();
	}

	onClickPrevErrors() {
		this.errorsPage -= 1;
		this.retrieve();
	}

	onClickNextFines() {
		this.finesPage += 1;
		this.retrieve();
	}

	onClickPrevFines() {
		this.finesPage -= 1;
		this.retrieve();
	}

	onClickNextExcluded() {
		this.excludedPage += 1;
		this.retrieve();
	}

	onClickPrevExcluded() {
		this.excludedPage -= 1;
		this.retrieve();
	}

	clearAllFilters() {
		this.fromInstant = null;
		this.toInstant = null;
		this.categoryFilter = null;
		this.sourceNameFilter = null;
		this.providerIdFilter = null;
		this.symbolFilter = null;
		this.clearAllTrigger = !this.clearAllTrigger;
		this.retrieve();
	}

	fromSetter(fromDate: string | null) {
		this.fromInstant = fromDate ? `${fromDate}T00:00:00Z` : '';
	}

	toSetter(toDate: string | null) {
		this.toInstant = toDate ? `${toDate}T00:00:00Z` : '';
	}

	clearDateFilter() {
		this.fromInstant = null;
		this.toInstant = null;
		this.retrieve();
	}

	saveDateFilter() {
		this.retrieve();
	}

	selectCategoryFilter(category: string | null) {
		this.categoryFilter = category;
		this.retrieve();
	}

	selectAccountFilter(source: string | null) {
		this.sourceNameFilter = source;
		this.providerIdFilter = null;
		this.symbolFilter = null;
		this.retrieve();
	}

	selectPlatformFilter(platformFilter: string | number | null) {
		this.sourceNameFilter = null;
		this.providerIdFilter = null;
		this.symbolFilter = null;
		if (typeof platformFilter === 'number') {
			this.providerIdFilter = platformFilter;
		} else if (typeof platformFilter === 'string') {
			this.symbolFilter = platformFilter;
		}

		this.retrieve();
	}

	firstCharUppercase = (str: string) => firstCharUppercase(str);

	foundFlattenType(str: string): IFlattenTransactionType | undefined {
		return foundFlattenType(str, this.transactionTypeArr || []);
	}

	reformedNumber8(inputNumber: string | number): string {
		const rounded = roundingNumber(+inputNumber, 8);
		return rounded !== 0 ? addComma(rounded) : '0';
	}

	reformedNumber(inputNumber: string | number): string {
		const rounded = roundingNumber(+inputNumber, 2);
		return rounded !== 0 ? addComma(rounded) : '0';
	}

	retrieve() {}

	loadErrors() {}

	loadFines() {}

	loadExcluded() {}

	refresh() {}

	calcHeight() {
		this.tableHeight =
			(this.manualReviewCardElement?.clientHeight || 0) -
			(this.topSectionElement?.clientHeight || 0) -
			(this.tabWrapperElement?.clientHeight || 0) -
			100;
	}

	mounted() {
		this.manualReviewCardElement = document.querySelector('.manualReviewCard');
		this.topSectionElement = document.querySelector('.manualReviewCard .topSection');
		this.tabWrapperElement = document.querySelector('.manualReviewCard .tabWrapper');
	}
}
</script>
