<template>
	<GeneratingText v-if="!gainLoadDone" height="calc(100vh - 200px)" :progress="gainLoadProgress">
		Generating dashboard
	</GeneratingText>
	<div v-else id="dashboard">
		<ProductTitleSection>
			<template slot="title">
				{{ $t('page.dashboard.greeting', { name: loggedInUserName }) }}
			</template>
			<template slot="desc"> Here’s your dash view by today. </template>
			<template slot="button">
				<RefreshButton
					:disabled="pageLoading || lineGraphLoading || assetGraphLoading || yearSummaryLoading"
					@click="retrieve"
				/>
			</template>
		</ProductTitleSection>

		<div v-if="capitalGainStatus === EJobStatus.FAILED" class="alertsWrapper">
			<AlertCard :no-margin="true" :msg="$t('message.dashboardError1')" color="error" icon="mdi-alert-circle-outline" />
		</div>
		<template v-else>
			<div class="twoColumnsWrapper">
				<div class="leftColumn">
					<OutlinedCard :pad-x="28" :pad-y="28" :shadow="true" :small-rounding="true">
						<DataLoader v-if="loadingBillboardData" />

						<template v-else>
							<FailedAndRefreshCard v-if="!billboardData || !successToLoadBillboardData" @refresh="loadBillboardData" />
							<div v-else class="dataWrapper">
								<BillboardText
									class="data"
									title="Total Value"
									:amount="billboardData && billboardData.totalValue"
									:bold="true"
								/>
								<BillboardText
									class="data"
									title="24H Value Change"
									:amount="billboardData && billboardData.change24H"
									:icon="billboardData && billboardData.changeRate > 0"
									:percent="billboardData && billboardData.changeRate"
								/>
								<BillboardText class="data" title="Cost basis" :amount="billboardData && billboardData.costBasis" />
								<BillboardText
									class="data"
									title="Unrealized gains"
									:amount="billboardData && billboardData.unrealizedGain"
								/>
							</div>
						</template>
					</OutlinedCard>

					<div class="dashboardCard">
						<!-- title and filters -->
						<v-card elevation="0" color="white" class="dashboardFilterWrap">
							<div class="contentInner">
								<span class="titleText">{{ $t('page.dashboard.portfolio') }}</span>
								<div class="filterText">
									<DateFilter
										:disabled="lineGraphLoading"
										:final-from-filter="fromDateFilter"
										:final-to-filter="toDateFilter"
										from-query-mapper="fromInstant"
										to-query-mapper="toInstant"
										@fromSetter="fromSetter"
										@toSetter="toSetter"
										@onclear="clearDateFilter"
										@onsave="saveDateFilter"
									/>
									<!-- <FilterButton
									v-if="!dateFilterSelected"
									:disabled="lineGraphLoading"
									:active="selectedFilter === DATE_RANGE.WEEK"
									:name="DATE_RANGE.WEEK"
									@click="loadGraphByRange(DATE_RANGE.WEEK, 7)"
								/> -->
									<FilterButton
										v-if="!dateFilterSelected"
										:small="true"
										:disabled="lineGraphLoading"
										:active="selectedFilter === DATE_RANGE.ONE_MONTH"
										:name="DATE_RANGE.ONE_MONTH"
										@click="loadGraphByRange(DATE_RANGE.ONE_MONTH, 10)"
									/>
									<FilterButton
										v-if="!dateFilterSelected"
										:small="true"
										:disabled="lineGraphLoading"
										:active="selectedFilter === DATE_RANGE.THREE_MONTHS"
										:name="DATE_RANGE.THREE_MONTHS"
										@click="loadGraphByRange(DATE_RANGE.THREE_MONTHS, 20)"
									/>
									<FilterButton
										v-if="!dateFilterSelected"
										:small="true"
										:disabled="lineGraphLoading"
										:active="selectedFilter === DATE_RANGE.ONE_YEAR"
										:name="DATE_RANGE.ONE_YEAR"
										@click="loadGraphByRange(DATE_RANGE.ONE_YEAR, 30)"
									/>
									<FilterButton
										v-if="!dateFilterSelected"
										:small="true"
										:disabled="lineGraphLoading"
										:active="selectedFilter === DATE_RANGE.YEAR_TO_DATE"
										:name="DATE_RANGE.YEAR_TO_DATE"
										@click="loadGraphByRange(DATE_RANGE.YEAR_TO_DATE, 20)"
									/>
									<FilterButton
										v-if="!dateFilterSelected"
										:small="true"
										:disabled="lineGraphLoading"
										:active="selectedFilter === DATE_RANGE.LAST_YEAR"
										:name="DATE_RANGE.LAST_YEAR"
										@click="loadGraphByRange(DATE_RANGE.LAST_YEAR, 30)"
									/>
									<FilterButton
										:small="true"
										:disabled="lineGraphLoading"
										:active="selectedFilter === DATE_RANGE.TOTAL"
										:name="DATE_RANGE.TOTAL"
										@click="loadGraphByRange(DATE_RANGE.TOTAL, 30)"
									/>
								</div>
							</div>
						</v-card>

						<!-- graph area -->
						<div>
							<div class="lineChartWrapper">
								<DataLoader v-if="lineGraphLoading" />

								<template v-else>
									<FailedAndRefreshCard v-if="!successToLoadLineGraph" @refresh="loadGraphByRange(DATE_RANGE.TOTAL, 20)" />
									<LineChart
										v-else
										:display-x="true"
										:grid-x="false"
										:display-y="false"
										:grid-y="false"
										:hide-first-label="true"
										:datasets="lineChardDatasets"
									/>
								</template>
							</div>
						</div>
					</div>
				</div>

				<div class="rightColumn">
					<ReferralBenefitCard :small-rounding="true" :button-padding="true" />
					<OutlinedCard :pad-x="24" :pad-y="18" :small-rounding="true" outline-color="outline">
						<DataLoader v-if="yearSummaryLoading || loadingBillboardData" />

						<div v-else class="yearSummaryWrap">
							<div class="flex-between">
								<span class="titleText">{{ $t('page.dashboard.Summary.title') }}</span>
								<span class="textLink" @click="$router.push('/tax/report')"> View reports > </span>
							</div>
							<div class="subtitle">Year to date</div>
							<FailedAndRefreshCard v-if="!yearSummary || !successToLoadYearSummary" @refresh="loadTaxSummaryData" />
							<div v-else>
								<YearSummaryTextLine :name="$t('page.dashboard.Summary.item1')" :amount="realizedGains" />
								<YearSummaryTextLine
									:name="$t('page.dashboard.Summary.item2')"
									:amount="yearSummary && yearSummary.tradingFee"
								/>
								<YearSummaryTextLine
									:name="$t('page.dashboard.Summary.item3')"
									:amount="yearSummary && yearSummary.ordinaryIncome"
								/>
								<YearSummaryTextLine
									:name="$t('page.dashboard.Summary.item4')"
									:amount="yearSummary && yearSummary.giftReceived"
								/>
								<YearSummaryTextLine
									:name="$t('page.dashboard.Summary.item5')"
									:amount="yearSummary && yearSummary.giftSent"
								/>
								<YearSummaryTextLine
									:name="$t('page.dashboard.Summary.item6')"
									:amount="billboardData ? billboardData.unrealizedGain : '-'"
								/>
							</div>
						</div>
					</OutlinedCard>
				</div>
			</div>

			<div class="assetsWrapper">
				<OutlinedCard :pad-x="24" :pad-y="26" :small-rounding="true" outline-color="outline">
					<span class="titleText">{{ $t('page.dashboard.yourAssets') }}</span>
					<DataLoader v-if="assetGraphLoading" />

					<template v-else>
						<div class="chartWrapper">
							<FailedAndRefreshCard v-if="!successToLoadAssetGraph" @refresh="loadAssetGraphData" />
							<div v-else class="doughnutWrapper">
								<div class="doughnutChart">
									<DoughnutChart
										:data="assetDoughnutGraphData"
										:labels="assetDoughnutGraphLabels"
										:width="70"
										@colors="colorSelected"
									/>
								</div>
								<div class="centeredText">
									<p class="totalText">Total</p>
									<span class="value">{{
										reformedAmountValue(billboardData ? billboardData.totalValue : '-', 2)
									}}</span>
								</div>
							</div>
						</div>
						<v-data-table
							v-if="successToLoadAssetGraph"
							:headers="assetLabels"
							:items="assetGraphData"
							:sort-by="['marketValue']"
							class="elevation-0 assetTableWrapper"
							height="700"
							fixed-header
							disable-pagination
							hide-default-footer
						>
							<template #[`item.asset`]="{ item }">
								<div class="assetIconWrapper">
									<v-avatar size="36" color="outline">
										<v-img :src="iconImage(assetObj(item.asset) && assetObj(item.asset).iconImage)" />
									</v-avatar>
									<div>
										<p class="mainText">{{ item.asset }}</p>
										<p class="subText">{{ assetObj(item.asset) && assetObj(item.asset).name }}</p>
									</div>
								</div>
							</template>
							<template #[`item.quantity`]="{ item }">
								<div class="align-right">
									<span class="mainText">{{ addComma(round(item.quantity, 4)) }}</span>
								</div>
							</template>
							<template #[`item.costBasis`]="{ item }">
								<div class="align-right">
									<div class="mainText">{{ reformedAmountValue(item.costBasis) }}</div>
									<div class="subText">{{ reformedAmountValue(item.costBasis / item.quantity) }} / unit</div>
								</div>
							</template>
							<template #[`item.marketValue`]="{ item }">
								<div class="align-right">
									<div class="mainText">{{ reformedAmountValue(item.marketValue) }}</div>
									<div class="subText">{{ reformedAmountValue(item.spotPrice) }} / unit</div>
								</div>
							</template>
							<template #[`item.24hValue`]="{ item }">
								<div class="align-right">
									<v-icon small :color="sideColor(item.change24H)">{{ sideIcon(item.change24H) }}</v-icon>
									<span class="sideText" :class="`text-${sideColor(item.change24H)}`">
										${{ addComma(Math.abs(round(item.change24H))) }}
									</span>
								</div>
							</template>
							<template #[`item.unrealizedGain`]="{ item }">
								<div class="align-right">
									<v-icon small :color="sideColor(item.unrealizedGain)">{{ sideIcon(item.unrealizedGain) }}</v-icon>
									<span class="sideText" :class="`text-${sideColor(item.unrealizedGain)}`">
										${{ addComma(Math.abs(round(item.unrealizedGain))) }}
									</span>
								</div>
							</template>
							<template #[`item.roi`]="{ item }">
								<div class="align-right iconSideText">
									<v-icon small :color="sideColor(item.roi)">{{ sideIcon(item.roi) }}</v-icon>
									<span class="sideText" :class="`text-${sideColor(item.roi)}`">
										{{ addComma(Math.abs(round(item.roi))) }}%
									</span>
								</div>
							</template>
						</v-data-table>
						<div v-if="!assetGraphLoading && !unlockOverlay && !isBelowTen" class="overlay">
							<div class="moreAsset">
								<img src="/icon/arrow-down-in-circle.png" class="moreAssetImg" @click="scrollClick" />
								<span class="moreAssetText"> There are more assets you can see, click. </span>
							</div>
						</div>
					</template>
				</OutlinedCard>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { Component, Vue, State } from 'nuxt-property-decorator';
import { DATEFORMAT_GRAPH, DATETIME_FORMAT_CLASSIC, DATE_RANGE } from '~/utils/constants';
import ProductTitleSection from '~/components/section/ProductTitleSection.vue';
import BillboardText from '~/components/text/BillboardText.vue';
import YearSummaryTextLine from '~/components/text/YearSummaryTextLine.vue';
import PortfolioAssetsList from '~/components/list/PortfolioAssetsList.vue';
import LineChart, { ILineGraphDataSet } from '~/components/chart/LineChart.vue';
import DoughnutChart from '~/components/chart/DoughnutChart.vue';
import RefreshButton from '~/components/button/RefreshButton.vue';
import FilterButton from '~/components/button/FilterButton.vue';
import DateFilter from '~/components/select/DateFilter.vue';
import { getIconImage, reformedAmountValue } from '~/utils/application';
import {
	LOAD_LINE_GRAPH_DATA,
	LOAD_ASSET_GRAPH_DATA,
	LOAD_BILLBOARD_DATA,
	LOAD_TAX_YEAR_SUMMARY,
	CHECK_GAIN,
} from '~/store/tax';
import { roundingNumber } from '~/utils/number';
import { ICognitoUserExt } from '~/types/auth/types';
import { LOAD_COINS, LOAD_DISABLED_COINS, LOAD_DISABLED_FIATS, LOAD_FIATS } from '~/store/asset';
import {
	ILineGraphResponse,
	IAssetGraphResponse,
	IBillboardResponse,
	IYearSummaryResponse,
	ILineGraphParams,
	IAssetGraphParams,
	IBillboardParams,
	IYearSummaryParams,
} from '~/types/tax/types';
import FailedAndRefreshCard from '~/components/card/FailedAndRefreshCard.vue';
import AlertCard from '~/components/card/AlertCard.vue';
import { EAuthRole, ITwoDemensionData } from '~/types/common/types';
import { querySyncer } from '~/utils/func';
import Button from '~/components/button/Button.vue';
import OutlinedCard from '~/components/card/OutlinedCard.vue';
import ReferralBenefitCard from '~/components/card/ReferralBenefitCard.vue';
import { IAsset } from '~/types/asset/types';
import { addComma } from '~/utils/string';
import DataLoader from '~/components/DataLoader.vue';
import { IJobCondition } from '~/types/common/dto';
import { EJobStatus } from '~/types/provider/types';
import GeneratingText from '~/components/text/GeneratingText.vue';

interface IAssetString {
	name: string;
	iconImage: string;
}

@Component({
	layout: 'product',
	meta: { auth: true, roles: [EAuthRole.INDIVIDUAL] },
	components: {
		DataLoader,
		AlertCard,
		ProductTitleSection,
		BillboardText,
		PortfolioAssetsList,
		LineChart,
		DoughnutChart,
		RefreshButton,
		FilterButton,
		DateFilter,
		YearSummaryTextLine,
		FailedAndRefreshCard,
		Button,
		OutlinedCard,
		ReferralBenefitCard,
		GeneratingText,
	},
	// middleware: 'loadSources',
	middleware: 'absoluteDenying',
	asyncData: async ({ store }) => {
		store.dispatch(`asset/${LOAD_COINS}`);
		store.dispatch(`asset/${LOAD_FIATS}`);
		store.dispatch(`asset/${LOAD_DISABLED_COINS}`);
		store.dispatch(`asset/${LOAD_DISABLED_FIATS}`);
		await store.dispatch(`tax/${CHECK_GAIN}`);
	},
})
export default class Dashboard extends Vue {
	@State(state => state.isMobile) isMobile!: boolean;
	@State(state => state.pageLoading) pageLoading!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;
	@State(({ provider }) => provider.providerSources) providerSources!: boolean;
	@State(({ tax }) => tax.taxYear) taxYear!: number;
	@State(({ tax }) => tax.lineGraphData) lineGraphData!: ILineGraphResponse[];
	@State(({ tax }) => tax.assetGraphData) assetGraphData!: IAssetGraphResponse[];
	@State(({ tax }) => tax.lineGraphLoading) lineGraphLoading!: boolean;
	@State(({ tax }) => tax.assetGraphLoading) assetGraphLoading!: boolean;
	@State(({ tax }) => tax.billboardData) billboardData!: IBillboardResponse | null;
	@State(({ tax }) => tax.yearSummary) yearSummary!: IYearSummaryResponse | null;
	@State(({ tax }) => tax.successToLoadBillboardData) successToLoadBillboardData!: boolean;
	@State(({ tax }) => tax.successToLoadLineGraph) successToLoadLineGraph!: boolean;
	@State(({ tax }) => tax.successToLoadAssetGraph) successToLoadAssetGraph!: boolean;
	@State(({ tax }) => tax.successToLoadYearSummary) successToLoadYearSummary!: boolean;
	@State(({ tax }) => tax.loadingBillboardData) loadingBillboardData!: boolean;
	@State(({ tax }) => tax.yearSummaryLoading) yearSummaryLoading!: boolean;
	@State(({ tax }) => tax.capitalGainStatus) capitalGainStatus!: EJobStatus;

	selectedFilter: string = '';
	selectedPixel: number = 0;
	fromDateFilter: string | null = '';
	toDateFilter: string | null = '';
	dateFilterSelected: boolean = false;
	unlockOverlay: boolean = false;
	progressInterval: any = null;
	gainLoadProgress: number = 0;
	gainLoadDone: boolean = false;
	coinColors: string[] = [];

	assetLabels: any[] = [
		{ text: 'Asset', value: 'asset', sortable: false, align: 'center', class: 'headerText' },
		{ text: 'Quantity', value: 'quantity', sortable: false, align: 'center', class: 'headerText' },
		{ text: 'Cost basis', value: 'costBasis', sortable: false, align: 'center', class: 'headerText' },
		{ text: 'Market value', value: 'marketValue', sortable: true, align: 'center', class: 'headerText' },
		{ text: '24h value change', value: '24hValue', sortable: false, align: 'center', class: 'headerText' },
		{ text: 'Unrealized gain', value: 'unrealizedGain', sortable: false, align: 'center', class: 'headerText' },
		{ text: 'ROI', value: 'roi', sortable: false, align: 'center', class: 'headerText' },
	];

	DATE_RANGE = DATE_RANGE;
	EJobStatus = EJobStatus;
	thisYear: number = Number(new Date().getFullYear());
	lastYear: number = Number(new Date().getFullYear()) - 1;
	@State(({ asset }) => asset.assetsMap) assetsMap!: Map<string, IAsset[]>;

	get assetDoughnutGraphLabels(): string[] {
		return this.assetGraphData.map((v: IAssetGraphResponse) => v.asset);
	}

	get assetDoughnutGraphData(): number[] {
		return this.assetGraphData.map((v: IAssetGraphResponse) => v.marketValue);
	}

	get totalWorthGraphData(): ITwoDemensionData[] {
		return this.lineGraphData.map((v: ILineGraphResponse) => ({
			x: v.timestamp.split(' ')[0],
			y: v.totalValue,
		}));
	}

	get costBasisGraphData(): ITwoDemensionData[] {
		return this.lineGraphData.map((v: ILineGraphResponse) => ({
			x: v.timestamp.split(' ')[0],
			y: v.costBasis,
		}));
	}

	get lineChardDatasets(): ILineGraphDataSet[] {
		return [
			{
				label: 'Cost basis',
				borderColor: 'rgba(0, 0, 0, 0.38)',
				fill: false,
				data: this.reformattingLineData(this.costBasisGraphData),
				borderDash: [6, 6],
				pointStyle: 'rectRot',
				gradient: false,
				tension: 0.6,
			},
			{
				label: 'Total Value',
				borderColor: 'rgba(17, 44, 168, 1)',
				fill: true,
				data: this.reformattingLineData(this.totalWorthGraphData),
				borderDash: [0, 0],
				pointStyle: 'circle',
				gradient: true,
				tension: 0.6,
			},
		];
	}

	get loggedInUserName() {
		if (this.user?.attributes) {
			return this.user.attributes.given_name
				? `, ${this.user.attributes.given_name}`
				: `, ${this.user.attributes.email}`;
		}
	}

	get totalGraphReq(): ILineGraphParams {
		return {
			range: 'Total',
			pixels: 50,
			asset: '',
		};
	}

	get realizedGains(): number | null {
		return this.yearSummary ? this.yearSummary.longterm + this.yearSummary.shortterm : null;
	}

	get isBelowTen() {
		return this.assetGraphData && this.assetGraphData.length < 11;
	}

	addComma = addComma;
	reformedAmountValue = reformedAmountValue;

	colorSelected(colors: string[]) {
		this.coinColors = colors;
	}

	reformattingLineData(arr: any[]): any[] {
		return arr.map(v => {
			return { ...v, x: this.$moment(v.x).utc().format(DATEFORMAT_GRAPH) };
		});
	}

	iconImage(iconImage: string) {
		return getIconImage(iconImage, 16);
	}

	assetObj(symbol: string): IAssetString {
		const found = this.assetsMap.get(symbol.toLowerCase());

		return {
			name: (found && found[0]?.name) || '',
			iconImage: (found && found[0]?.iconImage) || '',
		};
	}

	sideColor(inputNum: number) {
		if (Math.sign(inputNum) > 0 || Math.sign(inputNum) === 0) {
			return 'successDark';
		} else {
			return 'error';
		}
	}

	sideIcon(inputNum: number) {
		if (Math.sign(inputNum) > 0 || Math.sign(inputNum) === 0) {
			return 'mdi-plus';
		} else {
			return 'mdi-minus';
		}
	}

	round(inputNumber: string | number, pow: number = 2) {
		return roundingNumber(inputNumber, pow);
	}

	scrollClick() {
		this.unlockOverlay = true;
	}

	fromSetter(data: string | null) {
		this.fromDateFilter = data;
	}

	toSetter(data: string | null) {
		this.toDateFilter = data;
	}

	clearDateFilter() {
		const params = { fromInstant: null, toInstant: null };
		querySyncer(params, this.$router, this.$route);
		this.fromDateFilter = '';
		this.toDateFilter = '';
		this.dateFilterSelected = false;
	}

	saveDateFilter(from: string, to: string) {
		const params = {
			fromInstant: from ? `${from}T00:00:00Z` : '',
			toInstant: to ? `${to}T00:00:00Z` : '',
		};
		querySyncer(params, this.$router, this.$route);

		const diffDays: number = (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 3600 * 24);
		const pixelsForGraph: number = diffDays < 30 ? diffDays : 20;
		const reformedFrom: string = `${this.$moment.utc(from).utc().format(DATETIME_FORMAT_CLASSIC)}`;
		const reformedTo: string = `${this.$moment.utc(to).utc().format(DATETIME_FORMAT_CLASSIC)}`;
		const customRange: string = `${reformedFrom},${reformedTo}`;
		this.loadGraphByRange(DATE_RANGE.CUSTOM, pixelsForGraph, customRange);
		this.dateFilterSelected = true;
	}

	async loadGraphByRange(range: string, pixels: number, customRange: string = '') {
		let rangeParam = '';
		if (range === DATE_RANGE.CUSTOM) {
			rangeParam = customRange;
		} else if (range === DATE_RANGE.LAST_YEAR) {
			rangeParam = this.lastYear.toString();
			this.clearDateFilter();
		} else {
			rangeParam = range;
			this.clearDateFilter();
		}

		this.selectedFilter = range;
		this.selectedPixel = pixels;
		const lineGraphParams: ILineGraphParams = {
			range: rangeParam,
			pixels,
			asset: '',
		};
		await this.$store.dispatch(`tax/${LOAD_LINE_GRAPH_DATA}`, lineGraphParams);
	}

	async loadAssetGraphData() {
		const assetGraphParams: IAssetGraphParams = { sort: 'asset,asc' };
		await this.$store.dispatch(`tax/${LOAD_ASSET_GRAPH_DATA}`, assetGraphParams);
	}

	async loadBillboardData() {
		const params: IBillboardParams = { asset: '' };
		await this.$store.dispatch(`tax/${LOAD_BILLBOARD_DATA}`, params);
	}

	async loadTaxSummaryData() {
		const params: IYearSummaryParams = { taxYear: this.thisYear };
		await this.$store.dispatch(`tax/${LOAD_TAX_YEAR_SUMMARY}`, params);
	}

	retrieve() {
		const params: IYearSummaryParams = { taxYear: this.thisYear };
		this.$store.dispatch(`tax/${LOAD_TAX_YEAR_SUMMARY}`, params);
		this.loadBillboardData();
		this.loadGraphByRange(this.selectedFilter || DATE_RANGE.TOTAL, this.selectedPixel || 20);
		this.loadAssetGraphData();
	}

	async checkCapitalgain() {
		const result: IJobCondition | null | false = await this.$store.dispatch(`tax/${CHECK_GAIN}`);
		if (result === null) {
			// null
		} else if (result === false) {
			// false
		} else {
			if (result.status === EJobStatus.PROCESSING) {
				this.gainLoadProgress = result.progress;
			}
			if (result.status === EJobStatus.SUCCEEDED || result.status === EJobStatus.FAILED) {
				this.gainLoadDone = true;
			}
		}

		if (this.gainLoadDone) {
			clearInterval(this.progressInterval);
			this.retrieve();
		}
	}

	created() {
		this.gainLoadDone = this.capitalGainStatus === EJobStatus.SUCCEEDED || this.capitalGainStatus === EJobStatus.FAILED;

		if (this.gainLoadDone) {
			this.retrieve();
		} else {
			this.checkCapitalgain();
			this.progressInterval = setInterval(() => {
				this.checkCapitalgain();
			}, 2000);
		}
	}

	destroyed() {
		clearInterval(this.progressInterval);
	}
}
</script>

<style lang="scss" scoped>
.loadingWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
}

#dashboard .titleText {
	font-size: 16px;
	font-weight: $font-bold;
	letter-spacing: 0.15px;
	font-family: $poppins;
}

.lineChartWrapper {
	padding: 24px 0;
}

.doughnutWrapper {
	position: relative;
	margin-bottom: 20px;

	.doughnutChart {
		position: relative;
		z-index: 10;
		margin: 0 auto;
		width: 100%;
		@media (min-width: #{$breakpoint-xl}) {
			width: 50%;
		}
	}

	.centeredText {
		left: 0;
		top: 0;
		right: 0;
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;

		.totalText {
			font-size: 14px;
			color: $secondaryLight;
		}

		.value {
			font-size: 23px;
			color: $secondary;
		}
	}
}

.twoColumnsWrapper {
	margin-top: 48px;
	@media (min-width: #{$breakpoint-xl}) {
		display: grid;
		grid-template-columns: repeat(10, minmax(0, 1fr));
		gap: 24px;
	}

	.alertsWrapper {
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 10 / span 10;
		}
	}

	.leftColumn {
		display: grid;
		grid-column: span 7 / span 7;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: 24px;

		.dashboardCard {
			overflow: hidden;
			border-radius: $round-sm;
			border: 1px solid $outline;
			background-color: $white;
			.dashboardFilterWrap {
				padding: 24px;

				.contentInner {
					@media (min-width: #{$breakpoint-xl}) {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}

					.filterText {
						margin-top: 16px;
						@media (min-width: #{$breakpoint-xl}) {
							margin-top: 0;
						}
					}
				}
			}
		}

		.dataWrapper {
			@media (min-width: #{$breakpoint-xl}) {
				margin-right: 16px;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				// gap: 40px;
			}
			.data {
				flex-basis: 20%;
				flex-grow: 0;
				flex-shrink: 1;
			}
		}

		.chartWrapper {
			margin-bottom: 80px;
		}
	}

	.rightColumn {
		grid-column: span 3 / span 3;
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: 24px;
		margin-top: 24px;
		@media (min-width: #{$breakpoint-xl}) {
			margin-top: 0;
		}

		.yearSummaryWrap {
			.flex-between {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.textLink {
				color: $link;
				font-size: 14px;
				cursor: pointer;
				font-family: $poppins;
			}
			.subtitle {
				font-family: $poppins;
				font-size: 12px;
				color: $primaryLight;
				margin: 4px 0 32px 0;
			}
		}
	}
}
.assetsWrapper {
	margin-top: 24px;
	.align-right {
		text-align: right;
	}
	.headerText {
		font-family: $roboto !important;
		font-size: 12px;
		color: $secondary;
	}
	.assetIconWrapper {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.mainText {
		font-family: $poppins;
		font-size: 14px;
		font-weight: 500;
		color: $primary;
	}
	.subText {
		font-family: $roboto;
		font-size: 12px;
		font-weight: 400;
		color: $primaryLight;
	}
	.sideText {
		font-family: $poppins;
		font-size: 14px;
		font-weight: 500;
	}
	.iconSideText {
		margin-right: 4px;
	}
	// .assetTableWrapper {

	// }
}
.overlay {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgb(2, 0, 36);
	background: linear-gradient(187deg, rgba(2, 0, 36, 0) 0%, rgba(9, 9, 121, 0) 19%, rgba(255, 255, 255, 1) 100%);
}
.moreAsset {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	height: 100%;
	padding-bottom: 48px;

	.moreAssetImg {
		margin-left: auto;
		margin-right: auto;
		cursor: pointer;
	}
	.moreAssetText {
		font-family: $poppins;
		font-weight: 500;
		font-size: 14px;
		color: $primary;
		margin-top: 16px;
	}
}
</style>
