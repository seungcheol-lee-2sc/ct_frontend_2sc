<template>
	<div>
		<div class="globalButtonWrapper">
			<template v-if="tab === 0 && errorDatas.length > 0">
				<Button
					v-if="errorsSelected.length === 0"
					:disabled="errorLoading || fineLoading || autoMatching"
					:height="52"
					color="secondary"
					fontcolor="white"
					:rounded="true"
					:loading="autoMatching"
					@click="onClickAutoMatch"
				>
					Auto match
				</Button>
			</template>
			<template v-if="tab === 1 && finesSelected.length > 0">
				<Button
					:rounded="true"
					:height="44"
					:outlined="true"
					color="primary"
					:disabled="errorLoading || fineLoading || excludedLoading"
					@click="onUndo(finesSelected)"
				>
					{{ $t('common.undo') }}
				</Button>
			</template>
			<template v-if="tab === 2 && excludedSelected.length > 0">
				<Button
					:rounded="true"
					:height="44"
					:outlined="true"
					color="primary"
					:disabled="errorLoading || fineLoading || excludedLoading"
					@click="onUndo(excludedSelected)"
				>
					{{ $t('common.undo') }}
				</Button>
			</template>
		</div>
		<div class="tabWrapper">
			<div class="tableToolbar">
				<v-tabs v-model="tab">
					<v-tab>{{ $t('page.review.review3.tab1') }}({{ errorsTotal }})</v-tab>
					<v-tab>{{ $t('page.review.review3.tab2') }}({{ finesTotal }})</v-tab>
					<v-tab>{{ $t('page.review.review3.tab3') }}({{ excludedTotal }})</v-tab>
				</v-tabs>
				<div class="filtersWrapper">
					<ClearAllButton v-if="filtered" @click="clearAllFilters" />

					<DateFilter
						:final-from-filter="fromInstant"
						:final-to-filter="toInstant"
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

		<EmptyDataSection v-if="autoMatching"> Matching... </EmptyDataSection>

		<template v-else>
			<template v-if="tab === 0">
				<EmptyDataSection v-if="errorDatas.length === 0" src="/characters/big-smile-4.png">
					All internals has been matched!
				</EmptyDataSection>
				<v-data-table
					v-else
					class="productTable"
					:height="tableHeight > 0 ? `${tableHeight}px` : 'calc(90vh - 360px)'"
					:items-per-page="REVIEW_PER_PAGE"
					:loading="errorLoading"
					:headers="headers"
					:items="errorDatas"
					item-key="id"
					hide-default-footer
					:sort-by="errorsSortBy"
					:sort-desc="errorsSortDesc"
					@update:sort-by="onSortByErrors"
					@update:sort-desc="onSortDescErrors"
				>
					<template #item="{ item }">
						<tr>
							<td colspan="2">
								<MatchInternalTransaction
									:timestamp="item.timestamp"
									:symbol="item.asset"
									:quantity="item.quantity"
									:source-name="item.sourceName"
								/>
							</td>
							<td>
								<v-icon color="disabled">mdi-arrow-right</v-icon>
							</td>
							<td colspan="2">
								<MatchInternalTransaction
									v-if="item.ins && item.ins.length === 1"
									:timestamp="item.ins[0] && item.ins[0].timestamp"
									:symbol="item.asset"
									:quantity="item.ins[0] && item.ins[0].quantity"
									:source-name="item.ins[0] && item.ins[0].sourceName"
								/>
								<TransactionSelector
									v-else
									placeholder="Select transaction"
									:asset="item.asset"
									:match-ins="item.ins"
									:value="item.selectedMatchIn"
									@onchange="v => (item.selectedMatchIn = v)"
								/>
							</td>
							<td>
								<div class="buttonsWrapper -right">
									<Button
										:disabled="errorLoading"
										:height="36"
										:fontsize="14"
										color="primary"
										:rounded="true"
										:text="true"
										@click="onExclude([item])"
									>
										{{ $t('common.exclude') }}
									</Button>
									<Button
										:disabled="errorLoading"
										:height="36"
										fontcolor="white"
										color="primary"
										:fontsize="14"
										:rounded="true"
										@click="onMatch([item])"
									>
										{{ $t('common.match') }}
									</Button>
								</div>
							</td>
						</tr>
					</template>

					<template #footer>
						<div class="paginationWrapper">
							<div>{{ errorsPaginationText }}</div>
							<ArrowPagination
								:page="errorsPage"
								:page-length="errorsPageLength"
								@next="onClickNextErrors(EReviewStatus.errors)"
								@prev="onClickPrevErrors(EReviewStatus.errors)"
							/>
						</div>
					</template>
				</v-data-table>
			</template>

			<template v-else-if="tab === 1">
				<EmptyDataSection v-if="fineDatas.length === 0" src="/characters/big-smile-question.png">
					No internals matched yet.
				</EmptyDataSection>
				<v-data-table
					v-else
					v-model="finesSelected"
					class="productTable"
					:height="tableHeight > 0 ? `${tableHeight}px` : 'calc(90vh - 360px)'"
					:items-per-page="REVIEW_PER_PAGE"
					:loading="fineLoading"
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
					<template #item="{ item }">
						<tr>
							<td>
								<v-checkbox
									color="primaryLight"
									readonly
									:value="included(finesSelected, item)"
									@click="onSelectFine(item)"
								/>
							</td>
							<td colspan="2">
								<MatchInternalTransaction
									:timestamp="item.timestamp"
									:symbol="item.asset"
									:quantity="item.quantity"
									:source-name="item.sourceName"
								/>
							</td>
							<td>
								<v-icon color="disabled">mdi-arrow-right</v-icon>
							</td>
							<td colspan="2">
								<MatchInternalTransaction
									:timestamp="item.ins[0] && item.ins[0].timestamp"
									:symbol="item.asset"
									:quantity="item.ins[0] && item.ins[0].quantity"
									:source-name="item.ins[0] && item.ins[0].sourceName"
								/>
							</td>
							<td>
								<div class="buttonsWrapper -right">
									<Button
										:disabled="fineLoading"
										:height="36"
										:fontsize="14"
										:rounded="true"
										:text="true"
										color="primary"
										@click="onExclude([item])"
									>
										{{ $t('common.exclude') }}
									</Button>
									<Button
										:disabled="fineLoading"
										:height="36"
										color="primary"
										:fontsize="14"
										:rounded="true"
										fontcolor="white"
										@click="onUndo([item])"
									>
										{{ $t('common.undo') }}
									</Button>
								</div>
							</td>
						</tr>
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

			<template v-if="tab === 2">
				<EmptyDataSection v-if="excludedDatas.length === 0" src="/characters/big-smile-blink.png" :no-gap="true">
					No internals excluded.
				</EmptyDataSection>

				<v-data-table
					v-else
					v-model="excludedSelected"
					class="productTable"
					:height="tableHeight > 0 ? `${tableHeight}px` : 'calc(90vh - 360px)'"
					:items-per-page="REVIEW_PER_PAGE"
					:loading="excludedLoading"
					show-select
					:headers="headers"
					:items="excludedDatas"
					item-key="customId"
					hide-default-footer
					:sort-by="excludedSortBy"
					:sort-desc="excludedSortDesc"
					@update:sort-by="onSortByExcluded"
					@update:sort-desc="onSortDescExcluded"
				>
					<template #item="{ item }">
						<tr>
							<td>
								<v-checkbox
									color="primaryLight"
									readonly
									:value="includedInExcludedDatas(excludedSelected, item)"
									@click="onSelectExclude(item)"
								/>
							</td>
							<td colspan="2">
								<MatchInternalTransaction
									:timestamp="item.timestamp"
									:symbol="item.asset"
									:quantity="item.quantity"
									:source-name="item.sourceName"
								/>
							</td>
							<td>
								<v-icon color="disabled">mdi-arrow-right</v-icon>
							</td>
							<td colspan="2">
								<MatchInternalTransaction
									:timestamp="item.ins[0] && item.ins[0].timestamp"
									:symbol="item.asset"
									:quantity="item.ins[0] && item.ins[0].quantity"
									:source-name="item.ins[0] && item.ins[0].sourceName"
								/>
							</td>
							<td>
								<Button
									:outlined="true"
									:disabled="excludedLoading"
									:height="36"
									color="primary"
									:fontsize="14"
									:rounded="true"
									@click="onUndo([item])"
								>
									{{ $t('common.undo') }}
								</Button>
							</td>
						</tr>
					</template>

					<template #footer>
						<div class="paginationWrapper">
							<div>{{ excludedPaginationText }}</div>
							<ArrowPagination
								:page="excludedPage"
								:page-length="excludedPageLength"
								@next="onClickNextExcluded"
								@prev="onClickPrevExcluded"
							/>
						</div>
					</template>
				</v-data-table>
			</template>
		</template>
	</div>
</template>

<script lang="ts">
import { Component, State } from 'nuxt-property-decorator';
import { debounce } from 'lodash';
import { AxiosResponse } from 'axios';
import MatchInternalTransaction from './MatchInternalTransaction.vue';
import CategoryFilter from '~/components/select/CategoryFilter.vue';
import DateFilter from '~/components/select/DateFilter.vue';
import PlatformFilter from '~/components/select/PlatformFilter.vue';
import ClearAllButton from '~/components/button/ClearAllButton.vue';
import { IMatchCandidate, IReformedExcludedMatchCandidate, IReformedMatchCandidate } from '~/types/review/types';
import ManualReviewDefault from '~/components/mixins/ManualReviewDefault.vue';
import TransactionSelector from '~/components/select/TransactionSelector.vue';
import {
	EXCLUDE_MATCH_INTERNAL,
	LOAD_IGNORED_INTERNALS,
	LOAD_MATCHED_INTERNALS,
	LOAD_MISSING_PLATFORMS,
	LOAD_UNMATCHED_INTERNALS,
	MATCH_INTERNAL,
	STEP3_COUNT,
	STEP1_COUNT,
	UNDO_MATCH_INTERNAL,
	AUTO_MATCH,
} from '~/store/review';
import ArrowPagination from '~/components/pagination/ArrowPagination.vue';
import { getIconImage } from '~/utils/application';
import { IAsset } from '~/types/asset/types';
import Button from '~/components/button/Button.vue';
import { ADD_TO_MESSAGE_QUEUE, CONFIRM_ACTION } from '~/store';
import EmptyDataSection from '~/components/section/EmptyDataSectino.vue';

@Component({
	components: {
		ClearAllButton,
		DateFilter,
		CategoryFilter,
		PlatformFilter,
		TransactionSelector,
		ArrowPagination,
		MatchInternalTransaction,
		Button,
		EmptyDataSection,
	},
})
export default class MatchInternalTable extends ManualReviewDefault {
	/**
	 * @override
	 */
	errorDatas: IReformedMatchCandidate[] = [];
	fineDatas: IMatchCandidate[] = [];
	excludedDatas: IReformedExcludedMatchCandidate[] = [];
	autoMatching: boolean = false;

	headers = [
		{ text: 'Withdrawal date (UTC)', value: 'timestamp', align: 'center', sortable: true },
		{ text: 'Withdrawal amount', value: 'Withdrawal', align: 'center', sortable: false },
		{ text: '', value: 'arrow', align: 'center', sortable: false },
		{ text: 'Deposit date (UTC)', value: 'depositDate', align: 'center', sortable: false },
		{ text: 'Deposit amount', value: 'deposit', align: 'center', sortable: false },
		{ text: 'Actions', value: 'actions', align: 'center', sortable: false },
	];

	@State(({ asset }) => asset.assetsMap) assetsMap!: Map<string, IAsset[]>;

	onClickAutoMatch() {
		this.$store.commit(CONFIRM_ACTION, {
			title: 'Are you sure?',
			text: 'Do you want to automatically match these datas?',
			pending: async () => {
				this.autoMatching = true;
				await this.$store.dispatch(`review/${AUTO_MATCH}`);
				await this.retrieve();
				this.autoMatching = false;
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
					msg: 'Match successful',
					color: 'primary',
				});
			},
		});
	}

	included(
		items: IReformedMatchCandidate[] | IMatchCandidate[],
		item: IReformedMatchCandidate | IMatchCandidate,
	): boolean {
		return Boolean(items.find(v => v.id === item.id));
	}

	includedInExcludedDatas(items: IReformedExcludedMatchCandidate[], item: IReformedExcludedMatchCandidate): boolean {
		return Boolean(items.find(v => v.customId === item.customId));
	}

	symbolIconImage(symbol: string): string {
		const found = this.assetsMap.get(symbol.toLowerCase());
		return found ? getIconImage(found[0]?.iconImage || '', 32) : '';
	}

	onSelectError(item: IReformedMatchCandidate) {
		const foundIndex = this.errorsSelected.findIndex(v => v.id === item.id);
		if (foundIndex !== -1) {
			this.errorsSelected.splice(foundIndex, 1);
		} else {
			this.errorsSelected.push(item);
		}
	}

	onSelectFine(item: IMatchCandidate) {
		const foundIndex = this.finesSelected.findIndex(v => v.id === item.id);
		if (foundIndex !== -1) {
			this.finesSelected.splice(foundIndex, 1);
		} else {
			this.finesSelected.push(item);
		}
	}

	onSelectExclude(item: IReformedExcludedMatchCandidate) {
		const foundIndex = this.excludedSelected.findIndex(v => v.customId === item.customId);
		if (foundIndex !== -1) {
			this.excludedSelected.splice(foundIndex, 1);
		} else {
			this.excludedSelected.push(item);
		}
	}

	async onMatch(matchCandidates: IReformedMatchCandidate[]) {
		this.errorLoading = true;
		this.fineLoading = true;
		this.excludedLoading = true;
		const submitDatas = matchCandidates.map(v => ({
			...v,
			ins: [v.selectedMatchIn],
		}));

		const success: boolean = await this.$store.dispatch(`review/${MATCH_INTERNAL}`, submitDatas);
		if (success) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				msg: 'Match successful',
				color: 'primary',
				actionText: this.$t('common.undo'),
				action: () => {
					this.onUndo(submitDatas);
				},
			});
		}

		this.filterErrorsSelected(matchCandidates);
		await this.retrieve();
	}

	async onUndo(matchCandidates: IReformedMatchCandidate[]) {
		this.errorLoading = true;
		this.fineLoading = true;
		this.excludedLoading = true;
		const success = await this.$store.dispatch(`review/${UNDO_MATCH_INTERNAL}`, matchCandidates);
		if (success) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { msg: 'Undo successful', color: 'successDark' });
		} else {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { msg: 'Undo failed', color: 'error' });
		}

		this.filterFinesSelected(matchCandidates);
		this.filterExcludedSelected(matchCandidates);
		await this.retrieve();

		if (!document.querySelector('.manualReviewCard')) {
			this.$store.dispatch(`review/${STEP1_COUNT}`);
			this.$store.dispatch(`review/${LOAD_MISSING_PLATFORMS}`);
			this.$store.dispatch(`review/${STEP3_COUNT}`);
		}
	}

	async onExclude(matchCandidates: IReformedMatchCandidate[]) {
		this.errorLoading = true;
		this.fineLoading = true;
		this.excludedLoading = true;
		const success = await this.$store.dispatch(`review/${EXCLUDE_MATCH_INTERNAL}`, matchCandidates);
		if (success) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { msg: 'Exclude successful', color: 'successDark' });
		} else {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { msg: 'Exclude failed', color: 'error' });
		}

		this.filterFinesSelected(matchCandidates);
		this.filterErrorsSelected(matchCandidates);
		await this.retrieve();
	}

	/**
	 * @override
	 */
	// @ts-ignore
	loadErrors = debounce(() => {
		this.loadErrorsAction();
	}, 300);

	async loadErrorsAction() {
		this.errorLoading = true;
		const res: AxiosResponse | false = await this.$store.dispatch(
			`review/${LOAD_UNMATCHED_INTERNALS}`,
			this.errorsParams,
		);

		if (res === false) {
			this.errorDatas = [];
			this.errorsTotal = 0;
		} else {
			console.log('err:', res.data);
			this.errorDatas = res.data.map((v: IMatchCandidate) => ({
				...v,
				selectedMatchIn: (v.ins && v.ins[0]) || null,
			}));
			this.errorsTotal = Number(res.headers['x-total-count']);
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
		const res: AxiosResponse | false = await this.$store.dispatch(`review/${LOAD_MATCHED_INTERNALS}`, this.finesParams);
		if (res === false) {
			this.fineDatas = [];
			this.finesTotal = 0;
		} else {
			console.log('fines: ', res.data);
			this.fineDatas = res.data;
			this.finesTotal = Number(res.headers['x-total-count']);
		}
		this.fineLoading = false;
	}

	/**
	 * @override
	 */
	loadExcluded = debounce(() => {
		this.loadExcludedAction();
	}, 300);

	async loadExcludedAction() {
		this.excludedLoading = true;
		const res: AxiosResponse | false = await this.$store.dispatch(
			`review/${LOAD_IGNORED_INTERNALS}`,
			this.excludedParams,
		);
		if (res === false) {
			this.excludedDatas = [];
			this.excludedTotal = 0;
		} else {
			console.log('ex: ', res.data);
			this.excludedDatas = res.data.map((v: IMatchCandidate) => ({ ...v, customId: `${v.id}-${v.ins[0].id}` }));
			this.excludedTotal = Number(res.headers['x-total-count']);
		}
		this.excludedLoading = false;
	}

	/**
	 * @override
	 */
	async retrieve() {
		await Promise.all([this.loadErrors(), this.loadFines(), this.loadExcluded()]);
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
