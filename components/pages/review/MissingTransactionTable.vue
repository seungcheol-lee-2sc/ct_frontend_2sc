<template>
	<div>
		<div class="titleText">Choose one exchange or wallet at a time.</div>
		<div v-if="platforms.length > 0" class="platformLayout">
			<div
				v-for="platform in platforms"
				:key="platform.id"
				class="platformCard"
				:class="selectedPlatform && platform.id === selectedPlatform.id ? '-selected' : ''"
				@click="onSelectPlatform(platform)"
			>
				<v-img :src="getIconImage(platform.img)" max-width="40" class="icon" />
				{{ platform.name }}
			</div>
		</div>
		<EmptyDataSection v-else src="/characters/big-smile-4.png"> You have no missing transaction. </EmptyDataSection>

		<div v-if="selectedPlatform" class="noticeCardsWrapper">
			<div class="noticeCard">
				<div class="titleText">Check transactions period to {{ fromDate }}</div>
				<div class="descText">
					We’ve confirmed your transactions from {{ fromDate }} to {{ toDate }}. Are there any trades you made before
					{{ fromDate }}? Please check your import page for any missing data.
				</div>

				<Button
					:fontsize="14"
					class="actionButton"
					color="primary"
					fontcolor="white"
					:rounded="true"
					:height="44"
					@click="$router.push('/tax/import')"
				>
					Go to import page
				</Button>
			</div>
			<div class="noticeCard">
				<div class="titleText">Add transactions manually</div>
				<div class="descText">
					You can manually enter missing incoming transactions. Check your transaction history for each coin listed
					below.
				</div>

				<template v-if="selectedPlatform && (selectedPlatform.provider || selectedPlatform.asset)">
					<Button
						:fontsize="14"
						class="actionButton"
						color="primary"
						:rounded="true"
						fontcolor="white"
						:height="44"
						@click="onClickAddTransaction"
					>
						Add Transaction
					</Button>
					<TransactionsDialog
						:dialog="transactionsDialog"
						:injected-platform="selectedPlatform"
						@close="closeTransactionsDialog"
					/>
				</template>
			</div>
		</div>

		<div v-if="selectedPlatform" class="tableWrapper">
			<v-data-table
				:items-per-page="10"
				:headers="parentHeaders"
				:items="selectedAssets"
				item-key="uid"
				hide-default-footer
				:expanded.sync="expanded"
				single-expand
				show-expand
				class="productTable step2Table"
				@item-expanded="onClickExpand"
			>
				<template #[`item.missing_value`]="{ item }"> $ {{ reformedNumber(item.missing_value) }} </template>

				<template #[`item.missing_quantity`]="{ item }">
					<span style="color: crimson; font-weight: bold">
						{{ reformedNumber8(item.missing_quantity) }}
					</span>
				</template>

				<template #expanded-item="">
					<td :colspan="1000" style="padding: 0">
						<div class="expandedInner">
							<v-data-table
								:items-per-page="REVIEW_PER_PAGE"
								:loading="transactionLoading"
								:headers="childHeaders"
								:items="missingTransactions"
								item-key="id"
								:page.sync="childPage"
								hide-default-footer
								class="childTable"
							>
								<template #[`item.out_asset`]="{ item }"> {{ item.out_asset }}ss </template>

								<template #[`item.timestamp`]="{ item }">
									{{ item && $moment(item.timestamp).utc().format(DATETIME_FORMAT_PRODUCT) }}
								</template>

								<template #[`item.type`]="{ item }">
									{{ categorize(item.type) }}
								</template>

								<template #[`item.transaction`]="{ item }">
									<TransactionItem
										:hide-arrow="true"
										:hide-in="true"
										:flex="true"
										:reverse="true"
										:in-asset="null"
										:in-number="null"
										:out-number="item && item.outQuantity"
										:out-asset="item && item.asset"
									/>
								</template>

								<template #[`item.unmatchedQty`]="{ item }">
									<span style="color: crimson"> {{ reformedNumber8(item.unmatchedQty) }} </span>
								</template>

								<template #footer>
									<div class="paginationWrapper">
										<div>{{ missingPaginationText }}</div>
										<ArrowPagination
											:page="childPage - 1"
											:page-length="missingPageLength"
											@next="childPage += 1"
											@prev="childPage -= 1"
										/>
									</div>
								</template>
							</v-data-table>
						</div>
					</td>
				</template>
			</v-data-table>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, State, Watch } from 'nuxt-property-decorator';
import TransactionItem from '../transaction/TransactionItem.vue';
import Button from '~/components/button/Button.vue';
import ManualReviewDefault from '~/components/mixins/ManualReviewDefault.vue';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { GET_MISSING_DATE, GET_MISSING_TRANSACITONS, LOAD_MISSING_PLATFORMS, REVIEW_PER_PAGE } from '~/store/review';
import { IMissingAsset, IMissingDate, IMissingTransactionPlatform, IMissingTransactionRes } from '~/types/review/types';
import { getIconImage, pageLength, paginationText } from '~/utils/application';
import { DATE_FORMAT_PRODUCT } from '~/utils/constants';
import ArrowPagination from '~/components/pagination/ArrowPagination.vue';
import { ILoadMissingTransactionDTO } from '~/types/review/dto';
import EmptyDataSection from '~/components/section/EmptyDataSectino.vue';
import { ETransactionType, ITransactionType } from '~/types/transaction/types';
import { firstCharUppercase } from '~/utils/string';
import TransactionsDialog from '~/components/dialog/TransactionsDialog.vue';

interface IReformedMissingAsset extends IMissingAsset {
	uid: string;
}

@Component({
	components: {
		Button,
		TransactionItem,
		ArrowPagination,
		EmptyDataSection,
		TransactionsDialog,
	},
})
export default class MissingTransactionTable extends ManualReviewDefault {
	@Prop({ required: true }) platforms!: IMissingTransactionPlatform[];

	@State(({ transaction }) => transaction.transactionTypes) transactionTypes!: Map<ETransactionType, ITransactionType>;

	parentHeaders = [
		{ text: 'Coin', value: 'out_asset', align: 'center', sortable: false },
		{ text: 'Missing quantity', value: 'missing_quantity', align: 'center', sortable: false },
		{ text: 'Missing value', value: 'missing_value', align: 'center', sortable: false },
		{ text: '# of Transacations', value: 'count', align: 'center', sortable: false },
		{ text: '', value: 'data-table-expand' },
	];

	childHeaders = [
		{ text: 'Date (UTC)', value: 'timestamp', align: 'center', sortable: false },
		{ text: 'Missing quantity', value: 'unmatchedQty', align: 'center', sortable: false },
		{ text: 'Category', value: 'type', align: 'center', sortable: false },
		{ text: 'Sold or outgoing', value: 'transaction', align: 'center', sortable: false },
	];

	selectedPlatform: IMissingTransactionPlatform | null = null;
	missingDates: IMissingDate = {
		mintime: '',
		maxtime: '',
	};

	childPage: number = 1;
	missingTransactions: IMissingTransactionRes[] = [];
	transactionLoading: boolean = false;
	expanded: IMissingTransactionPlatform[] = [];
	transactionsDialog: boolean = false;

	get missingPageLength(): number {
		return pageLength(this.missingTransactions.length, REVIEW_PER_PAGE);
	}

	get missingPaginationText(): string {
		return paginationText(this.childPage - 1, REVIEW_PER_PAGE, this.missingTransactions.length, REVIEW_PER_PAGE);
	}

	get fromDate(): string {
		return this.missingDates.mintime ? this.$moment(this.missingDates.mintime).format(DATE_FORMAT_PRODUCT) : '-';
	}

	get toDate(): string {
		return this.missingDates.maxtime ? this.$moment(this.missingDates.maxtime).format(DATE_FORMAT_PRODUCT) : '-';
	}

	get selectedAssets(): IReformedMissingAsset[] {
		if (!this.selectedPlatform) return [];
		const missingAssets: IMissingAsset[] = [];
		const targetPlaform: IMissingTransactionPlatform | undefined = this.platforms.find(
			v => v.id === this.selectedPlatform?.id,
		);

		if (!targetPlaform) return [];
		targetPlaform.providerSources.forEach(source => {
			missingAssets.push(...source.missingInfos);
		});
		const result = missingAssets
			.sort((a, b) => (a.out_asset > b.out_asset ? 1 : -1))
			.map(v => ({
				...v,
				uid: `${targetPlaform?.id}-${v.out_asset}`,
			}));
		return result;
	}

	@Watch('platforms')
	watchPlatforms() {
		const selectedPlatformId = (this.selectedPlatform && this.selectedPlatform.id) || 0;
		if (selectedPlatformId) {
			const found = this.platforms.find(v => v.id === selectedPlatformId);
			if (!found) {
				this.selectedPlatform = null;
			}
		}
	}

	closeTransactionsDialog() {
		this.$store.dispatch(`review/${LOAD_MISSING_PLATFORMS}`);
		this.selectedPlatform && this.loadPlatformInfo(this.selectedPlatform);
		this.transactionsDialog = false;
	}

	categorize(transactionType: ETransactionType) {
		return firstCharUppercase(String(this.transactionTypes.get(transactionType)?.category || transactionType));
	}

	afterSubmit() {
		this.expanded = [];
		this.missingTransactions = [];
		this.missingDates = { mintime: '', maxtime: '' };
		this.selectedPlatform = null;
		this.$emit('refresh');
	}

	onSelectPlatform(platform: IMissingTransactionPlatform) {
		if (this.selectedPlatform && this.selectedPlatform.id === platform.id) return;
		this.loadPlatformInfo(platform);
	}

	async loadPlatformInfo(platform: IMissingTransactionPlatform) {
		this.selectedPlatform = platform;
		const sourceIds = this.selectedPlatform.providerSources.map(v => v.id);
		const result: IMissingDate | false = await this.$store.dispatch(`review/${GET_MISSING_DATE}`, sourceIds);
		if (result !== false) {
			this.missingDates = result;
		} else {
			this.missingDates = {
				mintime: '',
				maxtime: '',
			};
			this.selectedPlatform = null;
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { msg: 'Load failed', color: 'error' });
		}
	}

	async loadMissingTransactions(asset: string) {
		const sourceIds = (this.selectedPlatform?.providerSources.map(v => v.id) || []).join(',');
		this.missingTransactions = [];
		this.transactionLoading = true;
		const DTO: ILoadMissingTransactionDTO = {
			asset,
			size: 9999,
			sourceIds,
		};
		const datas = await this.$store.dispatch(`review/${GET_MISSING_TRANSACITONS}`, DTO);
		this.missingTransactions = datas || [];
		this.transactionLoading = false;
	}

	onClickExpand({ item, value }: { item: IReformedMissingAsset; value: boolean }) {
		this.childPage = 1;
		if (!value) return;
		this.loadMissingTransactions(item.out_asset);
	}

	onClickAddTransaction() {
		this.transactionsDialog = true;
		this.expanded = [];
	}

	getIconImage(str: string) {
		return getIconImage(str, 16);
	}
}
</script>

<style lang="scss" scoped>
@import '~/assets/pages/review/table.scss';

.titleText {
	margin-bottom: 20px;
	font-size: 19px;
	letter-spacing: 0.15px;
	font-weight: $font-medium;
	font-family: $poppins;
}

.platformLayout {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 16px;
	user-select: none;
	margin-bottom: 24px;
	@media (min-width: #{$breakpoint-xl}) {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.platformCard {
		padding: 20px 24px;
		display: flex;
		align-items: center;
		gap: 16px;
		border-radius: $round-md;
		border: 1px solid $disabled;
		transition: all 0.2s ease-in-out;
		cursor: pointer;

		&.-selected {
			background-color: $offWhite;
			border: 1px solid $primary;
		}
		&:hover {
			background-color: $offWhite;
		}

		.icon {
			border-radius: $round-xs;
		}

		.name {
			font-family: $poppins;
			font-weight: $font-medium;
			font-size: 14px;
			letter-spacing: 0.15px;
			color: $primaryLight;
		}
	}
}

.noticeCardsWrapper {
	margin-bottom: 44px;
	display: grid;
	gap: 24px;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	@media (min-width: #{$breakpoint-xl}) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.noticeCard {
		position: relative;
		padding: 24px;
		background-color: $offWhite;
		border: 1px solid $outline;
		border-radius: $round-md;
		padding-bottom: 88px;

		.titleText {
			display: flex;
			gap: 8px;
			align-items: center;
			justify-content: center;
			font-size: 16px;
			font-weight: $font-medium;
			font-family: $poppins;
			letter-spacing: 0.15px;
			margin-bottom: 16px;
			color: $primary;
		}

		.descText {
			font-size: 13px;
			letter-spacing: 0.25px;
			line-height: 1.54;
			color: $primaryLight;
		}

		.actionButton {
			position: absolute;
			bottom: 24px;
			left: 50%;
			transform: translateX(-50%);
		}
	}
}

.expandedInner {
	padding: 20px;
	background-color: $offWhite;
}
</style>
