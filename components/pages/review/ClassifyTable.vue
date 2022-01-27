<template>
	<div>
		<div class="globalButtonWrapper">
			<template v-if="tab === 0 && errorDatas.length > 0">
				<template v-if="errorsSelected.length > 0">
					<TooltipItem v-if="typeChangable" color="disabled" :top="true">
						Must select transactions under the same category to modify
					</TooltipItem>
					<v-menu :disabled="typeChangable" offset-y>
						<template #activator="{ on, attrs }">
							<span style="display: inline-block" v-bind="attrs" v-on="on" @click="() => {}">
								<Button
									:disabled="typeChangable"
									:rounded="true"
									color="primary"
									:outlined="true"
									:height="44"
									tail-icon="mdi-menu-down"
								>
									{{ $t('page.review.review5.topButton') }}
								</Button>
							</span>
						</template>
						<ProductMenuList :product-menu-list="typeSelectList" />
					</v-menu>
					<Button
						color="primary"
						fontcolor="white"
						:rounded="true"
						:disabled="!canSaveBulk || errorLoading || fineLoading"
						:height="44"
						@click="onSave(errorsSelected)"
					>
						{{ $t('common.save') }}
					</Button>
				</template>
			</template>

			<Button
				v-if="tab === 1 && finesSelected.length > 0"
				:rounded="true"
				color="primary"
				:outlined="true"
				:disabled="errorLoading || fineLoading"
				:height="44"
				@click="onUndo(finesSelected)"
			>
				{{ $t('common.undo') }}
			</Button>
		</div>

		<div class="tabWrapper">
			<div class="tableToolbar">
				<v-tabs v-model="tab">
					<v-tab>{{ $t('page.review.review5.tab1') }}({{ errorsTotal }})</v-tab>
					<v-tab>{{ $t('page.review.review5.tab2') }}({{ finesTotal }})</v-tab>
				</v-tabs>
				<div class="filtersWrapper">
					<ClearAllButton v-if="filtered" @click="clearAllFilters" />

					<DateFilter
						:final-from-filter="fromInstant"
						:final-to-filter="toInstant"
						:clear-trigger="clearAllTrigger"
						@fromSetter="fromSetter"
						@toSetter="toSetter"
						@onclear="clearDateFilter"
						@onsave="saveDateFilter"
					/>

					<CategoryFilter :final-filter="categoryFilter" @selector="selectCategoryFilter" />

					<PlatformFilter
						:final-filter="platformFilter"
						@parentSelector="selectPlatformFilter"
						@selector="selectAccountFilter"
					/>
				</div>
			</div>
		</div>

		<template v-if="tab === 0">
			<EmptyDataSection
				v-if="errorDatas.length === 0"
				src="/characters/big-smile-2.png"
				:style="{ height: tableHeight > 0 ? `${tableHeight}px` : 'calc(90vh - 360px)' }"
			>
				All missing price has been confirmed!
			</EmptyDataSection>
			<v-data-table
				v-else
				v-model="errorsSelected"
				fixed-header
				:height="tableHeight > 0 ? `${tableHeight}px` : 'calc(90vh - 360px)'"
				:items-per-page="REVIEW_PER_PAGE"
				:loading="errorLoading"
				class="productTable"
				show-select
				:headers="headers"
				:items="errorDatas"
				item-key="id"
				hide-default-footer
				:sort-by="errorsSortBy"
				:sort-desc="errorsSortDesc"
				@update:sort-by="onSortByErrors"
				@update:sort-desc="onSortDescErrors"
			>
				<template #[`item.timestamp`]="{ item }">
					{{ $moment(item.timestamp).utc().format(DATETIME_FORMAT_PRODUCT) }}
				</template>

				<template #[`item.category`]="{ item }">
					{{ firstCharUppercase(item.category) }}
				</template>

				<template #[`item.transaction`]="{ item }">
					<TransactionItem
						:run-calc="true"
						:in-number="item.inQuantity"
						:in-asset="item.inAsset"
						:out-number="item.outQuantity"
						:out-asset="item.outAsset"
					/>
				</template>

				<template #[`item.type`]="{ item }">
					<TypeSelector
						custom-type-key="newType"
						:can-edit="true"
						:outlined="true"
						:transaction="item"
						:activate-reset="item.newType && item.type !== item.newType"
						@action="t => onChangeTypes(t, [item])"
						@reset="item.newType = item.type"
					/>
				</template>

				<template #[`item.costBasis`]="{ item }">
					<div style="max-width: 150px">
						<v-autocomplete
							v-if="costBasisStatus(item, true) === ECostBasisStatus.edit"
							v-model="item.newCostBasis"
							:search-input.sync="item.enteredCostBasis"
							:items="costBasisArr(item)"
							:rules="natureNumberRules"
							item-text="text"
							item-value="value"
							hide-details="auto"
							prefix="$"
							placeholder="0.00"
							outlined
							auto-select-first
							class="noArrow"
							min="0"
							type="number"
							@update:search-input="onUpdateCostBasisInput(item)"
						>
							<template #item="{ item }"> $ {{ reformedCost(item.text) }} </template>
						</v-autocomplete>
					</div>
				</template>

				<template #[`item.actions`]="{ item }">
					<Button
						color="primary"
						:rounded="true"
						fontcolor="white"
						:disabled="(costBasisStatus(item) !== ECostBasisStatus.edit && item.type === item.newType) || errorLoading"
						@click="onSave([item])"
					>
						{{ $t('common.save') }}
					</Button>
				</template>

				<template #footer>
					<div class="paginationWrapper">
						<div>{{ errorsPaginationText }}</div>
						<ArrowPagination
							:page="errorsPage"
							:page-length="errorsPageLength"
							@next="onClickNextErrors"
							@prev="onClickPrevErrors"
						/>
					</div>
				</template>
			</v-data-table>
		</template>
		<template v-else-if="tab === 1">
			<EmptyDataSection
				v-if="fineDatas.length === 0"
				src="/characters/big-smile-3.png"
				:style="{ height: tableHeight > 0 ? `${tableHeight}px` : 'calc(90vh - 360px)' }"
			>
				All missing price has been confirmed!
			</EmptyDataSection>
			<v-data-table
				v-else
				v-model="finesSelected"
				fixed-header
				:height="tableHeight > 0 ? `${tableHeight}px` : 'calc(90vh - 360px)'"
				:items-per-page="REVIEW_PER_PAGE"
				:loading="fineLoading"
				class="productTable reviewTable"
				show-select
				:headers="headers"
				:items="fineDatas"
				item-key="id"
				hide-default-footer
				:sort-by="finesSortBy"
				:sort-desc="finesSortDesc"
				@update:sort-by="onSortByFines"
				@update:sort-desc="onSortDescFines"
			>
				<template #[`item.timestamp`]="{ item }">
					{{
						item.transactionRecord && $moment(item.transactionRecord.timestamp).utc().format(DATETIME_FORMAT_PRODUCT)
					}}
				</template>

				<template #[`item.category`]="{ item }">
					{{ item.transactionRecord && firstCharUppercase(item.transactionRecord.category) }}
				</template>

				<template #[`item.batch.source.name`]="{ item }">
					{{ item.transactionRecord && item.transactionRecord.batch && item.transactionRecord.batch.source.name }}
				</template>

				<template #[`item.transaction`]="{ item }">
					<TransactionItem
						:run-calc="true"
						:in-number="item.transactionRecord && item.transactionRecord.inQuantity"
						:in-asset="item.transactionRecord && item.transactionRecord.inAsset"
						:out-number="item.transactionRecord && item.transactionRecord.outQuantity"
						:out-asset="item.transactionRecord && item.transactionRecord.outAsset"
					/>
				</template>

				<template #[`item.type`]="{ item }">
					{{
						item.transactionRecord &&
						foundFlattenType(item.transactionRecord.type) &&
						foundFlattenType(item.transactionRecord.type).label
					}}
				</template>

				<template #[`item.costBasis`]="{ item }">
					<span
						v-if="
							item.mappedType === ETransactionType.GIFT_RECEIVED ||
							item.mappedType === ETransactionType.DONATION_RECEIVED
						"
					>
						${{ reformedNumber((item.transactionRecord && item.transactionRecord.costBasis) || 0) }}
					</span>
				</template>

				<template #[`item.actions`]="{ item }">
					<Button :outlined="true" :disabled="fineLoading" color="primary" :rounded="true" @click="onUndo([item])">
						{{ $t('common.undo') }}
					</Button>
				</template>

				<template #footer>
					<div class="paginationWrapper">
						<div>{{ finesPaginationText }}</div>
						<ArrowPagination
							:page="finesPage"
							:page-length="finesPageLength"
							@next="onClickNextFines"
							@prev="onClickPrevFines"
						/>
					</div>
				</template>
			</v-data-table>
		</template>
	</div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import { AxiosResponse } from 'axios';
import { debounce } from 'lodash';
import TransactionItem from '../transaction/TransactionItem.vue';
import CategoryFilter from '~/components/select/CategoryFilter.vue';
import DateFilter from '~/components/select/DateFilter.vue';
import PlatformFilter from '~/components/select/PlatformFilter.vue';
import ClearAllButton from '~/components/button/ClearAllButton.vue';
import TypeSelector, { typeSelectorList } from '~/components/select/TypeSelector.vue';
import ArrowPagination from '~/components/pagination/ArrowPagination.vue';
import ProductMenuList from '~/components/list/ProductMenuList.vue';
import ManualReviewDefault from '~/components/mixins/ManualReviewDefault.vue';
import {
	LOAD_CLASSFIED_TRANSFERS,
	LOAD_MISSING_PLATFORMS,
	LOAD_UNCLASSFIED_TRANSFERS,
	STEP1_COUNT,
	STEP3_COUNT,
	UNDO_CATEGORIZE,
} from '~/store/review';
import { ETransactionCategory, ETransactionType, ITransactionRecord } from '~/types/transaction/types';
import { ILoadClassifyTransfersRes } from '~/types/review/dto';
import { IManualCategorize, IReformedTransactionRecord } from '~/types/review/types';
import { ADD_TO_MESSAGE_QUEUE, CUSTOM_CONFIRM_ACTION } from '~/store';
import Button from '~/components/button/Button.vue';
import { IChangeTypes } from '~/types/transaction/dto';
import { CHANGE_TYPES } from '~/store/transaction';
import { roundingNumber } from '~/utils/number';
import { natureNumberRule } from '~/utils/rules';
import EmptyDataSection from '~/components/section/EmptyDataSectino.vue';
import { IConfirmation } from '~/types/common/types';
import TooltipItem from '~/components/tooltip/TooltipItem.vue';
import { addComma } from '~/utils/string';

enum ECostBasisStatus {
	hide = 'hide',
	show = 'show',
	edit = 'edit',
}

@Component({
	components: {
		TooltipItem,
		ClearAllButton,
		DateFilter,
		CategoryFilter,
		PlatformFilter,
		TypeSelector,
		ArrowPagination,
		TransactionItem,
		ProductMenuList,
		Button,
		EmptyDataSection,
	},
})
export default class ClassifyTable extends ManualReviewDefault {
	/**
	 * @override
	 */
	errorDatas: IReformedTransactionRecord[] = [];
	fineDatas: ITransactionRecord[] = [];

	headers = [
		{ text: this.$t('page.review.review5.head1'), value: 'timestamp', align: 'center', sortable: true },
		{ text: this.$t('page.review.review5.head2'), value: 'category', align: 'center', sortable: false },
		{ text: this.$t('page.review.review5.head3'), value: 'batch.source.name', align: 'center', sortable: false },
		{ text: this.$t('page.review.review5.head4'), value: 'transaction', align: 'center', sortable: false },
		{ text: this.$t('page.review.review5.head5'), value: 'type', align: 'center', sortable: false },
		{ text: this.$t('page.review.review5.head6'), value: 'costBasis', align: 'center', sortable: false },
		{ text: this.$t('page.review.review5.head7'), value: 'actions', align: 'center', sortable: false },
	];

	ECostBasisStatus = ECostBasisStatus;
	ETransactionType = ETransactionType;
	natureNumberRules = [(v: any) => natureNumberRule(v, this.$nuxt)];

	get typeSelectList() {
		const tempTransaction = this.errorsSelected && this.errorsSelected[0] ? this.errorsSelected[0] : null;
		if (tempTransaction === null) return [];
		return typeSelectorList(tempTransaction, this.transactionTypeArr, t => {
			this.onChangeTypes(t, this.errorsSelected);
		});
	}

	get canSaveBulk(): boolean {
		if (this.errorsSelected.length === 0) return false;
		return this.errorsSelected.filter((v: IReformedTransactionRecord) => v.type === v.newType).length === 0;
	}

	reformedCost(inputNumber: string | number): string {
		const rounded = roundingNumber(+inputNumber, 2);
		return rounded !== 0 ? addComma(rounded) : '0';
	}

	onClickAutoMatch() {
		const zeroAdded = this.errorDatas.map(t => ({
			...t,
			newType: t.category === ETransactionCategory.INCOMING ? ETransactionType.BUY : ETransactionType.SELL,
			newCostBasis: !t.newCostBasis || t.newCostBasis <= 0 ? 0 : t.newCostBasis,
		}));
		this.autoMatchAction(zeroAdded);
	}

	autoMatchAction = debounce((targets: IReformedTransactionRecord[]) => {
		this.saveAction(targets);
	}, 300);

	onChangeTypes(t: ETransactionType, transactions: IReformedTransactionRecord[] = []) {
		transactions.forEach(transaction => {
			const foundIndex: number = this.errorDatas.findIndex(v => v.id === transaction.id);
			if (foundIndex !== -1) {
				this.errorDatas[foundIndex].newType = t;
				this.errorDatas[foundIndex].newCostBasis = transaction.costBasis;
			}
		});
	}

	onUpdateCostBasisInput(transactionRecord: IReformedTransactionRecord) {
		transactionRecord.newCostBasis = transactionRecord.enteredCostBasis;
	}

	costBasisArr(transactionRecord: IReformedTransactionRecord): any[] {
		const origin = Number(transactionRecord?.inSpotPrice) * Number(transactionRecord?.inQuantity);
		const result = [];
		if (transactionRecord.enteredCostBasis) {
			result.push({
				value: transactionRecord.enteredCostBasis,
				text: transactionRecord.enteredCostBasis,
			});
		}
		result.push({ header: 'Market value' });
		result.push({
			value: origin,
			text: roundingNumber(origin || 0, 2),
		});
		return result;
	}

	costBasisStatus(transaction: IReformedTransactionRecord, newType: boolean = false): ECostBasisStatus {
		const key = newType ? 'newType' : 'type';
		const found = this.foundFlattenType(transaction[key] || '');
		const addtionalCondition: boolean = newType ? Boolean(transaction?.newType) : true;

		let result: ECostBasisStatus = ECostBasisStatus.hide;
		if (addtionalCondition && found?.userSelectable && found?.category === ETransactionCategory.INCOMING) {
			result =
				found.type === ETransactionType.GIFT_RECEIVED || found?.type === ETransactionType.DONATION_RECEIVED
					? ECostBasisStatus.edit
					: ECostBasisStatus.show;
		}

		return result;
	}

	onSave(transactions: IReformedTransactionRecord[]) {
		const zeroAdded = transactions.map(t => ({
			...t,
			newCostBasis: !t.newCostBasis || t.newCostBasis <= 0 ? 0 : t.newCostBasis,
		}));
		const noCostBasis = zeroAdded.filter(
			v => v.newCostBasis === 0 && this.costBasisStatus(v, true) === ECostBasisStatus.edit,
		);

		if (noCostBasis.length > 0) {
			const confirmDTO: IConfirmation = {
				dialog: true,
				title: this.$t('page.review.review5.confirm1.title'),
				text: this.$t('page.review.review5.confirm1.text'),
				btnText: this.$t('page.review.review5.confirm1.button'),
				cancelBtn: true,
				pending: () => this.saveAction(zeroAdded),
			};
			this.$store.commit(CUSTOM_CONFIRM_ACTION, confirmDTO);
		} else {
			this.saveAction(zeroAdded);
		}
	}

	async saveAction(transactions: IReformedTransactionRecord[]) {
		const noNewType = transactions.filter(
			t => this.costBasisStatus(t) !== ECostBasisStatus.edit && t.type === t.newType,
		);
		if (transactions.length === 0) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$t('page.review.review5.error1') });
			return;
		}

		if (noNewType.length > 0) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'warning', msg: this.$t('page.review.review5.error2') });
			return;
		}

		// @ts-ignore
		const DTO: IChangeTypesDTO[] = transactions.map((transaction: IReformedTransactionRecord) => ({
			transactionRecordId: transaction.id || 0,
			type: transaction.newType,
			costBasis:
				this.costBasisStatus(transaction, true) === ECostBasisStatus.edit && transaction.newCostBasis
					? +transaction.newCostBasis
					: null,
		}));

		const changeTypeDTO: IChangeTypes = {
			data: DTO,
			denyMutation: true,
		};

		this.errorLoading = true;
		this.fineLoading = true;

		const returnItems: IManualCategorize[] = await this.$store.dispatch(`transaction/${CHANGE_TYPES}`, changeTypeDTO);
		if (returnItems.length > 0) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				msg: 'Matched successful',
				color: 'primary',
				actionText: this.$t('common.undo'),
				action: () => {
					this.onUndo(returnItems);
				},
			});
		}

		await this.loadErrorsAction(transactions);
		this.filterErrorsSelected(transactions);
		this.loadFines();
	}

	async onUndo(manualCategorizeItems: IManualCategorize[]) {
		this.errorLoading = true;
		this.fineLoading = true;
		const success = await this.$store.dispatch(`review/${UNDO_CATEGORIZE}`, manualCategorizeItems);
		if (success) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { msg: 'Undo successful', color: 'successDark' });
		} else {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { msg: 'Undo failed', color: 'error' });
		}

		this.filterFinesSelected(manualCategorizeItems);
		await this.loadFinesAction();
		this.loadErrors(this.errorDatas);
		if (!document.querySelector('.manualReviewCard')) {
			this.$store.dispatch(`review/${STEP1_COUNT}`);
			this.$store.dispatch(`review/${LOAD_MISSING_PLATFORMS}`);
			this.$store.dispatch(`review/${STEP3_COUNT}`);
		}
	}

	/**
	 * @override
	 */
	// @ts-ignore
	loadErrors = debounce(transactions => {
		this.loadErrorsAction(transactions);
	}, 300);

	async loadErrorsAction(removedData: IReformedTransactionRecord[] = []) {
		const removedDataIds = removedData.map(v => v.id);
		this.errorLoading = true;
		const res: ILoadClassifyTransfersRes | false = await this.$store.dispatch(
			`review/${LOAD_UNCLASSFIED_TRANSFERS}`,
			this.errorsParams,
		);

		console.log(res);

		if (res === false) {
			alert('err');
			this.errorsTotal = 0;
			this.errorDatas = [];
		} else {
			this.errorsTotal = res.totalCount;
			const oldDatas = this.errorDatas.filter(v => !removedDataIds.includes(v.id));
			this.errorDatas = res.transactionRecords.map(v => {
				const foundOldData = oldDatas.find(old => old.id === v.id);

				if (foundOldData) {
					return {
						...v,
						newSymbol: foundOldData.newSymbol,
						newType: foundOldData.newType,
						newCostBasis: foundOldData.newCostBasis,
						enteredCostBasis: foundOldData.enteredCostBasis,
					};
				}

				return { ...v, newSymbol: '', newType: v.type, newCostBasis: null, enteredCostBasis: null };
			});
		}
		this.errorLoading = false;
	}

	/**
	 * @override
	 */
	loadFines = debounce(() => {
		this.loadFinesAction();
	}, 300);

	async loadFinesAction() {
		this.fineLoading = true;
		const res: AxiosResponse | false = await this.$store.dispatch(
			`review/${LOAD_CLASSFIED_TRANSFERS}`,
			this.finesParams,
		);

		console.log(res);

		if (res === false) {
			alert('err');
			this.finesTotal = 0;
			this.fineDatas = [];
		} else {
			this.finesTotal = Number(res.headers['x-total-count']);
			this.fineDatas = res.data;
		}
		this.fineLoading = false;
	}

	/**
	 * @override
	 */
	async retrieve() {
		await Promise.all([this.loadErrors([]), this.loadFines()]);
	}

	async mounted() {
		await this.retrieve();
		this.calcHeight();
		if (this.manualReviewCardElement && this.topSectionElement) {
			window.addEventListener('resize', () => {
				this.calcHeight();
			});
		}
	}
}
</script>

<style lang="scss" scoped>
@import '~/assets/pages/review/table.scss';

.tableToolbar {
	display: flex;
	padding-bottom: 44px;
	align-items: center;

	.filtersWrapper {
		display: flex;
		gap: 12px;
		align-items: center;
	}
}
</style>
