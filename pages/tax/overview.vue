<template>
	<div>
		<ProductTitleSection>
			<template slot="title">
				{{ $t('page.overview.greeting') }}
			</template>

			<template slot="button">
				<span class="topNextStepButton" @click="$router.push('/tax/review')">
					NEXT STEP
					<img src="/icon/next-step.png" />
					<img src="/icon/next-step.png" />
				</span>
			</template>
		</ProductTitleSection>

		<div class="sectionsWrapper">
			<InfoWithCharacterCard
				title="Check your imported data."
				desc="1. Are the start dates correct for each exchange?<br /> 2. Are there assets under each exchange?"
				src="/characters/laugh-1.png"
			/>
			<div
				v-show="
					unknownCurrencyStatus === EUnknownCurrencyStatus.OPEN ||
					unknownCurrencyStatus === EUnknownCurrencyStatus.WIDE_OPEN
				"
				class="cardWrapper -orange"
				:class="openPanel ? '' : '-close'"
			>
				<div class="headerWrapper -dense">
					<div class="titleText">
						<v-icon color="orange">mdi-help-circle-outline</v-icon>
						Unknown currency
					</div>

					<div>
						<v-btn class="chevronButton" :class="openPanel ? '-open' : ''" icon @click="openPanel = !openPanel">
							<v-icon>mdi-chevron-down</v-icon>
						</v-btn>
					</div>
				</div>
				<div class="descText">
					An unknown currency has been found. Please match the currency we have.<br />
					If there is no currency to match, ignore it. If you ignore it, the data of that currency will be disappear.
				</div>
				<UnknownCurrenciesTable @status="getUnkownCurrencyStatus" @refresh="onRefresh" />
			</div>

			<div class="cardWrapper">
				<div class="headerWrapper">
					<div class="titleText">Transactions Summary</div>
					<Button
						class="rightButton"
						fontcolor="white"
						color="primary"
						:rounded="true"
						:height="52"
						:fontsize="14"
						@click="openTransactionsDialog"
					>
						View transactions
					</Button>
				</div>

				<div class="summaryWrapper">
					<div>
						<div class="infoTitle">Total period</div>
						<div class="infoText">{{ reformedFromTo(totalFrom, totalTo) }}</div>
					</div>
					<div>
						<div class="infoTitle -grey">Total transactions</div>
						<div class="infoText -grey">{{ totalCount }}</div>
					</div>
				</div>

				<div class="headerWrapper">
					<div class="titleText">Number of Total Transactions</div>
					<div>
						<v-menu offset-y>
							<template #activator="{ on, attrs }">
								<FilterAndValueButton
									:disabled="loadingTransactionsChart"
									:attrs="attrs"
									:on="on"
									:filtered-text="viewYear"
									:activate="viewYear !== null"
									init-text="Year"
								/>
							</template>
							<ProductMenuList :product-menu-list="yearSelectList" :dense="true" :value="viewYear" />
						</v-menu>

						<FilterButton
							:disabled="loadingTransactionsChart"
							:active="viewYear === null"
							name="All"
							@click="onChangeTaxYear(null)"
						/>
					</div>
				</div>

				<div>
					<template v-if="!loadingTransactionsChart">
						<BarChart
							v-if="transactionData.length > 0"
							:display-x="true"
							:grid-x="true"
							:display-y="true"
							:grid-y="true"
							:hide-first-label="true"
							:datasets="transactionDataset"
						/>
						<LottieLoader v-else src="/lottie-files/rocket/rocket.json">
							There is no transaction {{ viewYear && `at ${viewYear}` }}
						</LottieLoader>
					</template>
					<DataLoader v-else />
				</div>
			</div>

			<div class="cardWrapper">
				<div class="headerWrapper">
					<div class="titleText">Trade History</div>
				</div>
				<div class="tradeHistory">
					<v-data-table
						id="tradeHistoryTable"
						:page="platformPage + 1"
						:headers="platformHeaders"
						item-key="id"
						:items="sortedPlatforms"
						hide-default-footer
						:items-per-page="PER_PAGE"
					>
						<template #[`item.name`]="{ item }">
							<PlatformItem :platform="item" />
						</template>
						<template #[`item.date`]="{ item }">
							<span class="-td">
								{{ reformedFromTo(item.fromDate, item.toDate) }}
							</span>
						</template>
						<template #[`item.count`]="{ item }">
							<span class="-td">
								{{ item.count === 1 ? `${item.count} transaction` : `${item.count} transactions` }}
							</span>
						</template>
						<template #[`item.action`]="{ item }">
							<Button
								:center="true"
								:rounded="true"
								:outlined="true"
								color="primary"
								:fontsize="14"
								:width="100"
								:height="36"
								@click="onClickViewTransactions(item)"
							>
								{{ $t('common.view') }}
							</Button>
							<TransactionsDialog
								:dialog="transactionsDialog && viewingPlatform && viewingPlatform.id === item.id"
								:injected-platform="item"
								@close="closeTransactionsDialog"
							/>
						</template>

						<template #[`body.append`]="{}">
							<tr v-if="platformPage + 1 === platformPageLength" class="platformsSummary">
								<td class="-td -bold">Total</td>
								<td class="-td -bold">
									{{ reformedFromTo(totalFrom, totalTo) }}
								</td>
								<td class="-td -bold">
									{{ totalCount === 1 ? `${totalCount} transaction` : `${totalCount} transactions` }}
								</td>
								<td class="-td -bold">
									<Button
										:center="true"
										:rounded="true"
										color="primary"
										fontcolor="white"
										:fontsize="14"
										:width="100"
										:height="36"
										@click="openTransactionsDialog"
									>
										{{ $t('common.view') }}
									</Button>
								</td>
							</tr>
						</template>
					</v-data-table>

					<ArrowPagination
						v-if="platformPageLength !== 1"
						:page="platformPage"
						:page-length="platformPageLength"
						@next="platformPage += 1"
						@prev="platformPage -= 1"
					>
						<span class="paginationText"> {{ platformPage + 1 }} / {{ platformPageLength }} </span>
					</ArrowPagination>
				</div>
			</div>

			<!-- <div class="cardWrapper">
				<div class="headerWrapper">
					<div class="titleText">
						Assets per Exchange
						<client-only>
							<div class="platformSelector">
								<PlatformSelector
									:disabled="loadingAssetsInProvider"
									:exchange-only="true"
									:hide-label="true"
									:rules="[]"
									:value="selectedPlatform"
									@onchange="onChangePlatform"
								/>
							</div>
						</client-only>
					</div>
					<div v-if="!loadingAssetsInProvider" class="rightDesc">Total value: {{ totalMarketValue }}</div>
				</div>
				<div v-if="exchangesLength === 0">
					<LottieLoader src="/lottie-files/rocket/rocket.json"> There is no exchange </LottieLoader>
				</div>
				<template v-else>
					<template v-if="assetLoadSuccess">
						<div v-if="loadingAssetsInProvider">
							<client-only>
								<DataLoader />
							</client-only>
						</div>
						<template v-else>
							<div v-if="reformedAssetDatas.length > 0" class="percentage">
								<div class="infoGraph">
									<DoughnutChart
										:width="60"
										:data="assetMarketValues"
										:labels="assetCoins"
										@colors="c => (colors = c)"
									/>
								</div>
								<div class="infoTable">
									<v-data-table
										:loading="loadingAssetsInProvider"
										hide-default-footer
										dense
										:headers="assetsHeaders"
										:sort-by="['marketValue']"
										:sort-desc="[true]"
										:items="reformedAssetDatas"
										item-key="asset"
										:items-per-page="ASSET_PER_PAGE"
										:page="assetDatasPage + 1"
									>
										<template #[`item.asset`]="{ item, index }">
											<span class="assetItem">
												<span class="colorCircle" :style="{ backgroundColor: assetColor(index) }"></span>
												{{ item.asset }}
											</span>
										</template>

										<template #[`item.marketValue`]="{ item }">
											{{ reformedAmountValue(+item.marketValue, 2) }}
										</template>
									</v-data-table>

									<ArrowPagination
										v-if="assetPageLength !== 1"
										:page="assetDatasPage"
										:page-length="assetPageLength"
										@next="assetDatasPage += 1"
										@prev="assetDatasPage -= 1"
									>
										<span class="paginationText"> {{ assetDatasPage + 1 }} / {{ assetPageLength }} </span>
									</ArrowPagination>
								</div>
							</div>
							<div v-else>
								<LottieLoader src="/lottie-files/rocket/rocket.json">There is no currency</LottieLoader>
							</div>
						</template>
					</template>
					<template v-else>
						<FailedAndRefreshCard @refresh="selectedProvider && loadAssetsInProvider(selectedProvider)" />
					</template>
				</template>
			</div> -->

			<div class="cardWrapper">
				<div class="headerWrapper">
					<div class="titleText">Fee</div>
				</div>
				<div v-if="!feeLoading" class="feeInfoWrapper">
					<div>
						<div class="infoTitle">Total Trading fee</div>
						<div class="infoText -bold">${{ totalFee }}</div>
					</div>
					<div class="rightSideWrapper">
						<div>
							<div class="infoTitle">Trade Fee Rate</div>
							<div class="infoText">{{ feeRate }}%</div>
						</div>
						<div>
							<div class="infoTitle">Total Trade Amount</div>
							<div class="infoText">${{ tradeAmount }}</div>
						</div>
					</div>
				</div>
				<DataLoader v-else />
			</div>
		</div>

		<div class="stepButtonsWrapper">
			<StepMoveButton :next-step="false" @click="$router.push('/tax/import')" />
			<StepMoveButton :next-step="true" @click="$router.push('/tax/review')" />
		</div>

		<TransactionsDialog v-if="!viewingPlatform" :dialog="transactionsDialog" @close="closeTransactionsDialog" />
	</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, State, Getter } from 'nuxt-property-decorator';
import { AxiosResponse } from 'axios';
import Button from '~/components/button/Button.vue';
import StepMoveButton from '~/components/button/StepMoveButton.vue';
import InfoWithCharacterCard from '~/components/card/InfoWithCharacterCard.vue';
import DoughnutChart from '~/components/chart/DoughnutChart.vue';
import TransactionsDialog from '~/components/dialog/TransactionsDialog.vue';
import PlatformItem from '~/components/item/PlatformItem.vue';
import ArrowPagination from '~/components/pagination/ArrowPagination.vue';
import ProductTitleSection from '~/components/section/ProductTitleSection.vue';
import PlatformSelector from '~/components/select/PlatformSelector.vue';
import UnknownCurrenciesTable, { EUnknownCurrencyStatus } from '~/components/table/UnknownCurrenciesTable.vue';
import { LOAD_COINS, LOAD_DISABLED_COINS, LOAD_DISABLED_FIATS, LOAD_FIATS } from '~/store/asset';
import { LOAD_ALL_TYPES, LOAD_TRANSACTIONS_FEE, LOAD_TRANSACTIONS_HISTORY } from '~/store/transaction';
import { ICognitoUserExt } from '~/types/auth/types';
import { EAuthRole, ESortOrder, ITwoDemensionData } from '~/types/common/types';
import { IPlatform, ITransactionRecordProvider } from '~/types/provider/types';
import { ILoadTransactionsHistoryDTO, ILoadTransactionsHistoryRes } from '~/types/transaction/dto';
import { getIconImage, metaInfo, pageLength, reformedAmountValue } from '~/utils/application';
import { DATE_FORMAT_PRODUCT } from '~/utils/constants';
import FilterAndValueButton from '~/components/button/FilterAndValueButton.vue';
import ProductMenuList, { IProductMenuList } from '~/components/list/ProductMenuList.vue';
import FilterButton from '~/components/button/FilterButton.vue';
import DataLoader from '~/components/DataLoader.vue';
import LottieLoader from '~/components/LottieLoader.vue';
import { roundingNumber } from '~/utils/number';
import { addComma } from '~/utils/string';
import { LOAD_ASSETS_IN_PROVIDER } from '~/store/review';
import { IAssetPercentageRes, ILoadAssetInProviderDTO } from '~/types/review/dto';
import FailedAndRefreshCard from '~/components/card/FailedAndRefreshCard.vue';
import BarChart, { IBarGraphDataSet } from '~/components/chart/BarChart.vue';

@Component({
	layout: 'product',
	components: {
		BarChart,
		ArrowPagination,
		DoughnutChart,
		ProductTitleSection,
		Button,
		UnknownCurrenciesTable,
		TransactionsDialog,
		StepMoveButton,
		PlatformSelector,
		InfoWithCharacterCard,
		PlatformItem,
		FilterAndValueButton,
		FilterButton,
		ProductMenuList,
		DataLoader,
		LottieLoader,
		FailedAndRefreshCard,
	},
	meta: { auth: true, roles: [EAuthRole.INDIVIDUAL] },
	middleware: 'loadSources',
	asyncData: async ({ store }) => {
		await Promise.all([store.dispatch(`transaction/${LOAD_ALL_TYPES}`)]);
	},
})
export default class Overview extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'Overview',
		);
	}

	@State(({ auth }) => auth.user) user!: ICognitoUserExt | null;
	@State(({ provider }) => provider.platforms) platforms!: IPlatform[];

	platformHeaders: any[] = [
		{ text: 'Exchange', value: 'name', sortable: true, align: 'center' },
		{ text: 'Start Date - End Date', value: 'date', sortable: false, align: 'center' },
		{ text: 'Total Transactions', value: 'count', sortable: true, align: 'center' },
		{ text: 'View Transactions', value: 'action', sortable: false, align: 'center' },
	];

	assetsHeaders: any[] = [
		{ text: 'Currency', value: 'asset', sortable: true, align: 'center', cellClass: '-percentageTd' },
		{ text: 'Quantity', value: 'quantity', sortable: true, align: 'center', cellClass: '-percentageTd' },
		{ text: 'Market Value', value: 'marketValue', sortable: true, align: 'center', cellClass: '-percentageTd' },
	];

	DATE_FORMAT_PRODUCT = DATE_FORMAT_PRODUCT;
	transactionData: ITwoDemensionData[] = [];
	viewingPlatform: IPlatform | null = null;
	platformPage: number = 0;
	selectedPlatform: IPlatform | null = null;
	transactionsDialog: boolean = false;
	openPanel: boolean = true;
	PER_PAGE = 9;
	ASSET_PER_PAGE = 5;
	colors: string[] = [];
	viewYear: number | null = null;
	loadingTransactionsChart: boolean = true;
	EUnknownCurrencyStatus = EUnknownCurrencyStatus;
	unknownCurrencyStatus: EUnknownCurrencyStatus = EUnknownCurrencyStatus.CLOSE;
	feeData: number[] = [];
	feeLoading: boolean = true;
	loadingAssetsInProvider: boolean = true;
	assetDatasTotal: number = 0;
	assetDatas: IAssetPercentageRes[] = [];
	assetDatasPage: number = 0;
	assetLoadSuccess: boolean = true;
	reformedAmountValue = reformedAmountValue;

	@Getter('tax/taxYears') taxYears!: number[];

	get exchangesLength(): number {
		return this.platforms.filter(v => v.provider?.id).length;
	}

	get assetPageLength(): number {
		return pageLength(this.assetDatasTotal, this.ASSET_PER_PAGE);
	}

	get totalMarketValue(): string {
		let result = 0;
		this.assetDatas.forEach(v => {
			result += +v.marketValue;
		});
		return reformedAmountValue(result, 2);
	}

	get assetCoins(): string[] {
		return this.assetDatas.map(v => v.asset);
	}

	get assetMarketValues(): number[] {
		return this.assetDatas.filter(v => +v.marketValue >= 0).map(v => +v.marketValue);
	}

	get reformedAssetDatas(): IAssetPercentageRes[] {
		return this.assetDatas.map(v => ({
			...v,
			marketValue: v.marketValue,
			quantity: addComma(roundingNumber(v.quantity, 8)),
		}));
	}

	get selectedProvider(): ITransactionRecordProvider | null {
		return this.selectedPlatform?.provider || null;
	}

	get totalFee(): string {
		if (typeof this.feeData[0] === 'number') {
			return addComma(roundingNumber(this.feeData[0], 2));
		} else {
			return '0';
		}
	}

	get feeRate(): string {
		if (typeof this.feeData[1] === 'number') {
			return addComma(roundingNumber(this.feeData[1], 2));
		} else {
			return '0';
		}
	}

	get tradeAmount(): string {
		if (typeof this.feeData[2] === 'number') {
			return addComma(roundingNumber(this.feeData[2], 2));
		} else {
			return '0';
		}
	}

	get yearSelectList(): IProductMenuList[] {
		return this.taxYears.map(year => ({
			text: year,
			onclick: () => {
				this.onChangeTaxYear(+year);
			},
			color: 'primary',
		}));
	}

	get totalFrom(): string | Date {
		let from: string | Date = '';
		this.platforms.forEach(platform => {
			if ((platform.fromDate && !from) || from > platform.fromDate) {
				from = platform.fromDate;
			}
		});
		return from;
	}

	get totalTo(): string | Date {
		let to: string | Date = '';
		this.platforms.forEach(platform => {
			if (to < platform.toDate) {
				to = platform.toDate;
			}
		});
		return to;
	}

	get totalCount(): number {
		let result = 0;
		this.platforms.map(v => v.count || 0).forEach(cnt => (result += cnt));
		return result;
	}

	get sortedPlatforms(): IPlatform[] {
		return _.cloneDeep(this.platforms).sort((a, b) => (a.name > b.name ? 1 : -1));
	}

	get platformPageLength(): number {
		return pageLength(this.platforms.length, this.PER_PAGE);
	}

	get transactionDataset(): IBarGraphDataSet[] {
		return [
			{
				label: ' # of Transactions',
				data: this.transactionData,
			},
		];
	}

	assetColor(index: number) {
		return this.colors[index + this.assetDatasPage * this.ASSET_PER_PAGE] || '';
	}

	getUnkownCurrencyStatus(status: EUnknownCurrencyStatus) {
		if (status === EUnknownCurrencyStatus.WIDE_OPEN) {
			this.openPanel = true;
		}
		this.unknownCurrencyStatus = status;
	}

	onSettedColors(colors: string[]) {
		this.colors = colors;
	}

	reformedFromTo(from: string | Date, to: string | Date): string {
		const finalFrom = (from && this.$moment(from).format(DATE_FORMAT_PRODUCT)) || '';
		const finalTo = (to && this.$moment(to).format(DATE_FORMAT_PRODUCT)) || '';
		return `${finalFrom} - ${finalTo}`;
	}

	onClickViewTransactions(platform: IPlatform) {
		this.viewingPlatform = platform;
		this.openTransactionsDialog();
	}

	iconImage(iconImage: string) {
		return getIconImage(iconImage, 16);
	}

	closeTransactionsDialog() {
		this.viewingPlatform = null;
		this.transactionsDialog = false;
	}

	openTransactionsDialog() {
		this.transactionsDialog = true;
	}

	onChangePlatform(platform: IPlatform) {
		this.assetDatasPage = 0;
		this.selectedPlatform = platform;
		platform?.provider && this.loadAssetsInProvider(platform?.provider);
	}

	makeTrnasactionData(datas: ILoadTransactionsHistoryRes[] | false) {
		if (datas) {
			this.transactionData = datas
				.sort((a, b) => {
					if (a.year > b.year) {
						return 1;
					} else if (a.year < b.year) {
						return -1;
					} else if (a.month > b.month) {
						return 1;
					} else if (a.month < b.month) {
						return -1;
					} else {
						return 1;
					}
				})
				.map(v => ({ x: `${v.year}-${v.month}`, y: v.count }));
		}
	}

	onRefresh() {
		this.selectedProvider && this.loadAssetsInProvider(this.selectedProvider);
		this.loadFeeData();
	}

	async loadAssetsInProvider(provider: ITransactionRecordProvider) {
		this.loadingAssetsInProvider = true;
		this.assetLoadSuccess = true;
		const DTO: ILoadAssetInProviderDTO = {
			providerId: provider.id,
			size: 9999,
			page: this.assetDatasPage,
			// sort: this.sortDesc === null ? null : `${this.sortBy},${this.sortDesc ? ESortOrder.DESC : ESortOrder.ASC}`,
			sort: `marketValue,${ESortOrder.DESC}`,
		};
		const res: AxiosResponse | false = await this.$store.dispatch(`review/${LOAD_ASSETS_IN_PROVIDER}`, DTO);
		if (res !== false) {
			this.assetDatasTotal = Number(res.headers['x-total-count']);
			this.assetDatas = res.data;
		} else {
			this.assetDatasPage = 0;
			this.assetDatasTotal = 0;
			this.assetDatas = [];
			this.assetLoadSuccess = false;
		}
		this.loadingAssetsInProvider = false;
	}

	async onChangeTaxYear(year: number | null, force: boolean = false) {
		if (!force && this.viewYear === year) {
			this.loadingTransactionsChart = false;
			return;
		}

		const username = this.user?.username;
		if (!username) {
			this.loadingTransactionsChart = false;
			return;
		}

		this.loadingTransactionsChart = true;
		this.viewYear = year;

		const historyDTO: ILoadTransactionsHistoryDTO = {
			username,
			fromInstant: this.viewYear ? `${this.viewYear}-01-01T00:00:00Z` : null,
			toInstant: this.viewYear ? `${this.viewYear}-12-31T00:00:00Z` : null,
		};
		const res = await this.$store.dispatch(`transaction/${LOAD_TRANSACTIONS_HISTORY}`, historyDTO);
		this.makeTrnasactionData(res);

		this.loadingTransactionsChart = false;
	}

	async loadFeeData() {
		const username = this.user?.username;
		if (username) {
			this.feeLoading = true;
			this.feeData = await this.$store.dispatch(`transaction/${LOAD_TRANSACTIONS_FEE}`, username);
			this.feeLoading = false;
		}
	}

	fetchOnServer() {
		return false;
	}

	fetch() {
		this.selectedPlatform = this.platforms[0] || null;
		this.selectedProvider && this.loadAssetsInProvider(this.selectedProvider);
		const username = this.user?.username;
		if (username) {
			this.$store.dispatch(`asset/${LOAD_COINS}`);
			this.$store.dispatch(`asset/${LOAD_FIATS}`);
			this.$store.dispatch(`asset/${LOAD_DISABLED_FIATS}`);
			this.$store.dispatch(`asset/${LOAD_DISABLED_COINS}`);
			this.onChangeTaxYear(null, true);
			this.loadFeeData();
		}
	}
}
</script>

<style lang="scss">
td {
	&.-percentageTd {
		color: $primary !important;
		font-size: 16px !important;
		height: 48px !important;
	}
}
</style>

<style lang="scss" scoped>
@mixin transition {
	transition: all 0.3s ease-in-out;
}

.chevronButton {
	@include transition();
	&.-open {
		transform: rotate(180deg);
	}
}

.platformSelector {
	max-width: 200px;
}

.topNextStepButton {
	font-weight: $font-bold;
	font-size: 14px;
	color: $primary;
	display: flex;
	align-items: center;
	gap: 5px;
	cursor: pointer;

	img {
		transition: all 0.2s ease-in-out;
		transform: translateX(-14px);
		&:first-child {
			opacity: 0;
			transform: translateX(-4px);
		}
	}

	&:hover {
		img {
			transform: translateX(0);
			&:first-child {
				transform: translateX(8px);
				opacity: 1;
			}
		}
	}
}

.sectionsWrapper {
	@include transition();
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	margin-top: 20px;
	gap: 24px;

	.cardWrapper {
		padding: 24px 34px;
		padding-bottom: 38px;
		border: 1px solid $outline;
		background-color: $white;
		border-radius: $round-lg;
		max-height: 100%;

		&.-close {
			@include transition();
			overflow: hidden;
			max-height: 80px;

			.descText {
				opacity: 0;
			}
		}

		.headerWrapper {
			margin-bottom: 32px;
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;

			&.-dense {
				margin-bottom: 4px;
			}

			.titleText {
				font-size: 19px;
				font-weight: $font-semibold;
				font-family: $poppins;
				letter-spacing: 0.15px;
				color: $primary;
				line-height: 1;
				margin-bottom: 4px;
				display: flex;
				align-items: center;
				gap: 20px;
			}

			.rightDesc {
				color: $primaryLight;
				font-size: 19px;
				font-weight: $font-semibold;
				letter-spacing: 0.15px;
				font-family: $poppins;
			}
		}

		.descText {
			@include transition();
			font-size: 14px;
			letter-spacing: 0.15px;
			color: $primaryLight;
			line-height: 1.4;
			font-family: $poppins;
			max-width: 840px;
			opacity: 1;
			margin-bottom: 24px;
		}

		&.-orange {
			border: 1px solid $primary;

			.headerWrapper {
				.titleText {
					color: $orange;
					font-weight: $font-bold;
				}
			}
		}
		&.-primary {
			border: 1px solid $primary;
		}
	}
}

.summaryWrapper {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	background-color: $offWhite;
	border-radius: $round-sm;
	padding: 36px;
	margin-bottom: 80px;

	> div {
		&:first-child {
			grid-column: span 2 / span 2;
		}

		&:last-child {
			text-align: right;
		}
	}

	.infoTitle {
		font-size: 14px;
		letter-spacing: 0.15px;
		font-family: $poppins;
		line-height: 1.6;
		margin-bottom: 10px;
		font-weight: $font-medium;
		color: $primary;
		&.-grey {
			color: $disabled;
		}
	}

	.infoText {
		font-size: 33px;
		font-weight: $font-bold;
		color: $primary;
		&.-grey {
			color: $disabled;
		}
	}
}

.tradeHistory {
	text-align: center;

	#tradeHistoryTable {
		.-td {
			font-size: 16px;
			letter-spacing: 0.5px;
			&.-bold {
				font-weight: $font-medium;
			}
		}
	}

	.platformsSummary {
		border-top: 2px solid $primaryLight;
	}

	.paginationText {
		font-family: $poppins;
	}
}

.percentage {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	@media (min-width: #{$breakpoint-xl}) {
		grid-template-columns: repeat(5, minmax(0, 1fr));
	}
	gap: 24px;

	.infoGraph {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 2 / span 2;
		}
	}

	.infoTable {
		text-align: center;
		@media (min-width: #{$breakpoint-xl}) {
			text-align: right;
			grid-column: span 3 / span 3;
		}

		.assetItem {
			display: flex;
			gap: 12px;
			align-items: center;
			justify-content: center;
			font-weight: $font-medium;

			.colorCircle {
				width: 16px;
				height: 16px;
				border-radius: $round-full;
			}
		}
	}
}

.feeInfoWrapper {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));

	> div {
		&:first-child {
			grid-column: span 1 / span 1;
		}

		&:last-child {
			grid-column: span 3 / span 3;
			justify-content: flex-end;
		}
	}

	.rightSideWrapper {
		display: flex;
		gap: 72px;
	}

	.infoTitle {
		font-size: 14px;
		font-family: $poppins;
		font-weight: $font-medium;
		letter-spacing: 0.15px;
		color: $primaryLight;
	}

	.infoText {
		color: $primary;
		font-size: 33px;
		letter-spacing: 0.25px;
		&.-bold {
			font-weight: $font-bold;
		}
	}
}
</style>
