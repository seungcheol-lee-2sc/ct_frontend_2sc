<template>
	<GeneratingText v-if="!gainLoadDone" height="calc(100vh - 280px)" :progress="gainLoadProgress">
		Generating Report
	</GeneratingText>
	<div v-else>
		<div>
			<ProductTitleSection>
				<template slot="title"> Get Report </template>
			</ProductTitleSection>
			<div class="subtitleSection">
				<div class="subtitleText">
					Select your tax report year to preview, pay, and download.<br />
					Support: Form 8949, Schedule D, Audit Trail Report, Income Report, TurboTax Online/Desktop, TaxAct
				</div>
				<Button
					:outlined="true"
					:rounded="true"
					:fontsize="14"
					color="primary"
					@click="showReportPreviewDialog"
					@close="closeReportPreviewDialog"
				>
					Preview tax report
				</Button>
				<ReportPreviewDialog :dialog="reportPreviewDialog" @close="closeReportPreviewDialog" />
			</div>
		</div>

		<OutlinedCard color="white" :pad-x="40" :pad-y="36" :bolder="true">
			<div class="cardTitle">Select Tax Reports</div>
			<img class="yellowBallImg" src="/characters/yellow-ball-smile.png" alt="icon illust" />
			<div class="cardsWrapper">
				<div class="leftWrapper">
					<div class="innerGrid">
						<DataLoader v-if="loadingTaxSummaries" :outlined="true"> Generating... </DataLoader>
						<template v-else-if="successToLoad">
							<OutlinedCard
								v-if="taxSummaries.length === 0"
								color="white"
								outline-color="primaryPale"
								:pad-x="38"
								:pad-y="32"
							>
								<div class="downloadText">There is no report</div>
							</OutlinedCard>
							<ExpandPanel
								v-for="summary in taxSummaries"
								:key="summary.taxyear"
								:force-expand="taxSummaries.length === 1"
							>
								<template slot="panel">
									<div class="center -between">
										<div class="center">
											<Checkbox
												v-if="thisYear > summary.taxyear && !purchased(+summary.taxyear)"
												:value="selectedYears.includes(+summary.taxyear)"
												:disabled="purchased(+summary.taxyear)"
												color="primary"
												style="margin-right: 8px"
												@click="toggleSelection(+summary.taxyear)"
											/>

											<span
												class="text-taxyear"
												:class="thisYear <= summary.taxyear || purchased(+summary.taxyear) ? '-ml' : ''"
											>
												{{ summary.taxyear }}
											</span>
											<Chip
												v-if="purchased(summary.taxyear)"
												style="margin-left: 8px"
												icon="mdi-check"
												color="successLight"
												fontcolor="successDark"
											>
												Purchased
											</Chip>
										</div>
										<div class="tailInfo">
											<span class="text-capitalGain">Capital Gain</span>
											<span class="text-capitalGainNum">
												{{ reformedAmountValue(summary.longterm + summary.shortterm) }}
											</span>
										</div>
									</div>
								</template>
								<template slot="expand">
									<div class="expandContentWrap">
										<div class="topWrapper">
											<div class="totalInfo">
												<div>Total Transactions</div>
												<span>{{ summary.count }}</span>
											</div>
											<div class="termsWrap">
												<div class="center -between">
													<span>
														Long Term Capital Gains
														<TooltipItem :small="true" color="primary" :right="true">
															Capital gains from selling assets held for longer than 1 year
														</TooltipItem>
													</span>
													<span> {{ reformedAmountValue(summary.longterm) }} </span>
												</div>
												<div class="center -between">
													<span>
														Short Term Capital Gains
														<TooltipItem :small="true" color="primary" :right="true">
															Capital gains from selling assets held for 1 year or less
														</TooltipItem>
													</span>
													<span>{{ reformedAmountValue(summary.shortterm) }}</span>
												</div>
											</div>
										</div>
										<div class="bottomWrapper">
											<div class="center -between">
												<span>
													Ordinary Income
													<TooltipItem :small="true" color="primaryLight" :right="true">
														Salary, mining rewards, airdrops, interest, rewards, etc
													</TooltipItem>
												</span>
												<span>{{ reformedAmountValue(summary.ordinaryIncome) }}</span>
											</div>
											<div class="center -between">
												<span>Trading Fee</span>
												<span>{{ reformedAmountValue(summary.tradingFee) }}</span>
											</div>
											<div class="center -between">
												<span>Gift/Donation Sent</span>
												<span>{{ reformedAmountValue(summary.giftSent) }}</span>
											</div>
											<div class="center -between">
												<span>Gift/Donation Received</span>
												<span>{{ reformedAmountValue(summary.giftReceived) }}</span>
											</div>
										</div>
									</div>
								</template>
							</ExpandPanel>
						</template>
						<OutlinedCard v-else color="white" outline-color="primaryPale" :pad-x="38" :pad-y="32">
							<FailedAndRefreshCard @refresh="retrieve" />
						</OutlinedCard>
						<OutlinedCard
							:color="disableDownloadReport ? 'offWhite' : 'white'"
							:outline-color="disableDownloadReport ? 'offWhite' : 'secondary'"
							:pad-x="38"
							:pad-y="32"
						>
							<div class="text-sendReport">Send Report</div>
							<div class="sendReportWrap">
								<span class="desc"> Got a CPA or helper? Email a copy of your report right away. </span>
								<div>
									<Button
										color="secondary"
										fontcolor="white"
										:fontsize="14"
										:width="220"
										:height="44"
										:disabled="loadingTaxSummaries || disableDownloadReport"
										@click="openSendingDialog"
									>
										Send to accountant
									</Button>
								</div>
								<client-only>
									<SendToAccountantDialog :dialog="sendingDialog" @close="closeSendingDialog" />
								</client-only>
							</div>

							<v-divider class="divider"></v-divider>

							<span class="downloadText">Select your report to download.</span>
							<div class="downloadWrap">
								<v-select
									v-model="downloadYear"
									outlined
									hide-details
									:height="44"
									:items="purchasedYearList"
									:disabled="disableDownloadReport"
									@change="onChangeYear"
								></v-select>
								<Button
									:outlined="true"
									color="primary"
									:fontsize="14"
									:width="220"
									:height="44"
									:disabled="loadingTaxSummaries || disableDownloadReport"
									@click="openDownloadDialog"
								>
									Download
								</Button>
							</div>
						</OutlinedCard>
					</div>
				</div>
				<div class="rightWrapper">
					<div class="innerGrid">
						<OutlinedCard color="white" outline-color="primaryPale" :pad-x="28" :pad-y="24">
							<div class="orderTitle">Your Order</div>
							<div class="orderDesc">
								<div class="descItem -border">
									<div class="-grey">
										{{ $moment().format(DATEFORMAT_REPORT_ORDER) }}
									</div>
									<div>
										<span>{{ selectedYears.length }} × Year</span>
										<span>${{ totalAmount }}</span>
									</div>
								</div>
								<div class="descItem total">
									<div>
										<span>Total</span>
										<span>${{ totalAmount }}</span>
									</div>
								</div>
							</div>
							<Button
								color="primary"
								fontcolor="white"
								:fontsize="16"
								:height="52"
								:block="true"
								:rounded="true"
								:disabled="selectedYears.length === 0"
								@click="onClickPay"
							>
								Order now
							</Button>
						</OutlinedCard>

						<ReferralBenefitCard />
					</div>
				</div>
			</div>
		</OutlinedCard>
		<DownloadTaxReportDialog :download-year="downloadYear" :dialog="downloadDialog" @close="closeDownloadDialog" />
	</div>
</template>

<script lang="ts">
import { Vue, Component, State, Getter } from 'nuxt-property-decorator';
import { Stripe } from '@stripe/stripe-js';
import { CT_PAY_REDIRECT, DATEFORMAT_REPORT_ORDER, PRICE_ID } from '~/utils/constants';
import ProductTitleSection from '~/components/section/ProductTitleSection.vue';
import { CREATE_CHECKOUT_SESSEION, LOAD_PAYMENT_HISTORIES, STRIPE_SET_UP } from '~/store/pay';
import { CHECK_GAIN, LOAD_TAX_YEAR_SUMMARY } from '~/store/tax';
import { reformedAmountValue, setPayRedirectCookie } from '~/utils/application';
import { CONFIRM_ERROR, ADD_TO_MESSAGE_QUEUE } from '~/store';
import { IYearSummaryResponse, IYearTaxSummary } from '~/types/tax/types';
import { EAuthRole } from '~/types/common/types';
import { roundingNumber } from '~/utils/number';
import ExpandPanel from '~/components/panel/ExpandPanel.vue';
import OutlinedCard from '~/components/card/OutlinedCard.vue';
import Button from '~/components/button/Button.vue';
import SendToAccountantDialog from '~/components/dialog/SendToAccountantDialog.vue';
import DownloadTaxReportDialog from '~/components/dialog/DownloadTaxReportDialog.vue';
import ReportPreviewDialog from '~/components/dialog/ReportPreviewDialog.vue';
import { ICognitoUserExt } from '~/types/auth/types';
import { IPaymentHistory } from '~/types/pay/types';
import { ICheckoutReq } from '~/types/pay/dto';
import FailedAndRefreshCard from '~/components/card/FailedAndRefreshCard.vue';
import { EJobStatus } from '~/types/provider/types';
import { IJobCondition } from '~/types/common/dto';
import ProgressBar from '~/components/bar/ProgressBar.vue';
import DataLoader from '~/components/DataLoader.vue';
import GeneratingText from '~/components/text/GeneratingText.vue';
import Chip from '~/components/chip/Chip.vue';
import ReferralBenefitCard from '~/components/card/ReferralBenefitCard.vue';
import TooltipItem from '~/components/tooltip/TooltipItem.vue';
import Checkbox from '~/components/input/Checkbox.vue';
import { LOAD_TRANSACTIONS_HISTORY } from '~/store/transaction';
import { ILoadTransactionsHistoryDTO, ILoadTransactionsHistoryRes } from '~/types/transaction/dto';

@Component({
	layout: 'product',
	meta: { auth: true, roles: [EAuthRole.INDIVIDUAL] },
	components: {
		ReferralBenefitCard,
		SendToAccountantDialog,
		DownloadTaxReportDialog,
		ExpandPanel,
		OutlinedCard,
		Button,
		ProductTitleSection,
		ReportPreviewDialog,
		FailedAndRefreshCard,
		ProgressBar,
		DataLoader,
		GeneratingText,
		Chip,
		Checkbox,
		TooltipItem,
	},
	middleware: 'loadSources',
	asyncData: async ({ store }) => {
		await store.dispatch(`tax/${CHECK_GAIN}`);
	},
})
export default class Report extends Vue {
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;
	@State(({ pay }) => pay.stripe) stripe!: Stripe | null;
	@State(({ pay }) => pay.sessionId) sessionId!: string;
	@State(({ pay }) => pay.paymentHistories) paymentHistories!: IPaymentHistory[];
	@State(({ tax }) => tax.yearSummary) yearSummary!: IYearSummaryResponse;
	@State(({ tax }) => tax.capitalGainStatus) capitalGainStatus!: EJobStatus;

	successToLoad: boolean = true;
	selectedYears: number[] = [];
	downloadYear: number | null = null;
	taxSummaries: IYearTaxSummary[] = [];
	downloadDialog: boolean = false;
	sendingDialog: boolean = false;
	reportPreviewDialog: boolean = false;
	progressInterval: any = null;
	gainLoadProgress: number = 0;
	gainLoadDone: boolean = false;
	loadingTaxSummaries: boolean = false;
	thisYear: number = Number(new Date().getFullYear());

	setPayRedirectCookie = setPayRedirectCookie;
	reformedAmountValue = reformedAmountValue;
	DATEFORMAT_REPORT_ORDER = DATEFORMAT_REPORT_ORDER;

	@Getter('tax/taxYears') taxYears!: number[];

	get purchasedYearList(): number[] {
		return this.paymentHistories.map(v => +v.taxYear);
	}

	get totalAmount(): number {
		return this.selectedYears.length * 49;
	}

	get disableDownloadReport(): boolean {
		return this.purchasedYearList.length === 0;
	}

	toggleSelection(year: number) {
		const foundIndex = this.selectedYears.findIndex(v => v === year);
		if (foundIndex === -1) {
			this.selectedYears.push(year);
		} else {
			this.selectedYears.splice(foundIndex, 1);
		}
	}

	onChangeYear(v: number | null) {
		this.downloadYear = v;
	}

	purchased(year: number) {
		return this.purchasedYearList.includes(year);
	}

	round(inputNumber: string | number, pow: number = 2) {
		return roundingNumber(inputNumber, pow);
	}

	showReportPreviewDialog() {
		this.reportPreviewDialog = true;
	}

	closeReportPreviewDialog() {
		this.reportPreviewDialog = false;
	}

	openDownloadDialog() {
		if (this.disableDownloadReport) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('page.plans.zeroState.title'),
			});
			return;
		}
		if (!this.downloadYear) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('message.choose', { target: this.$t('product.plan.year') }),
			});
			return;
		}
		this.downloadDialog = true;
	}

	closeDownloadDialog() {
		this.downloadDialog = false;
	}

	openSendingDialog() {
		if (this.disableDownloadReport) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('page.plans.zeroState.title'),
			});
			return;
		}
		this.sendingDialog = true;
	}

	closeSendingDialog() {
		this.sendingDialog = false;
	}

	async onClickPay() {
		const purchasedYears = this.selectedYears.filter(v => +v !== +this.thisYear);

		if (purchasedYears.length === 0) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('message.choose', { target: this.$t('product.plan.year') }),
			});
			return;
		}

		if (this.stripe === null) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: `${this.$t('message.notFound', { target: 'Payment module' })}. ${this.$t('message.refreshPage')}`,
			});
			return;
		}

		const params: ICheckoutReq = {
			priceId: PRICE_ID,
			taxYear: purchasedYears.join(','),
		};

		await this.$store.dispatch(`pay/${CREATE_CHECKOUT_SESSEION}`, params);

		if (!this.sessionId) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: `${this.$t('message.notFound', { target: 'Session id' })}. ${this.$t('message.refreshPage')}`,
			});
			return;
		}

		try {
			await this.stripe?.redirectToCheckout({
				sessionId: this.sessionId,
			});
		} catch (error) {
			console.error(error);
			this.$store.commit(CONFIRM_ERROR, { title: this.$t('common.error'), text: this.$t('message.fail.payment') });
		}
	}

	async getTaxSummaryOfYear(year: number): Promise<IYearTaxSummary | null> {
		const res: IYearSummaryResponse | false = await this.$store.dispatch(`tax/${LOAD_TAX_YEAR_SUMMARY}`, {
			taxYear: year,
		});

		if (res === false) {
			this.successToLoad = false;
			return null;
		}

		return { taxyear: year, ...res, count: 0 };
	}

	async getTransactionsByYear(year: number): Promise<number> {
		const DTO: ILoadTransactionsHistoryDTO = {
			username: this.user.username,
			fromInstant: `${year}-01-01T00:00:00Z`,
			toInstant: `${year}-12-31T00:00:00Z`,
		};
		const res: ILoadTransactionsHistoryRes[] | false = await this.$store.dispatch(
			`transaction/${LOAD_TRANSACTIONS_HISTORY}`,
			DTO,
		);

		if (!res) {
			this.successToLoad = false;
			return 0;
		}

		let count = 0;
		for (let i = 0; i < res.length; i++) {
			const monthTransaction = res[i];
			count += monthTransaction.count || 0;
		}

		return count;
	}

	setCookie() {
		const cookie: string | null = this.$cookies.get(CT_PAY_REDIRECT) || null;
		if (cookie && cookie !== this.$route.path) {
			this.$cookies.remove(CT_PAY_REDIRECT);
		}
		setPayRedirectCookie(this.$cookies, this.$route.path);
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

	async retrieve() {
		this.loadingTaxSummaries = true;
		const result: IYearTaxSummary[] = [];
		for (const year of this.taxYears) {
			const summary: IYearTaxSummary | null = await this.getTaxSummaryOfYear(year);
			if (summary) {
				const count: number = await this.getTransactionsByYear(year);
				result.push({ ...summary, count });
			}
		}
		if (result.length > 0) {
			this.taxSummaries = result
				.filter(v => v.longterm + v.shortterm !== 0 || this.purchasedYearList.includes(v.taxyear))
				.sort((a, b) => (b.taxyear > a.taxyear ? 1 : -1));
		}
		this.loadingTaxSummaries = false;
	}

	fetchOnServer() {
		return false;
	}

	async fetch() {
		await Promise.all([
			this.$store.dispatch(`pay/${STRIPE_SET_UP}`),
			this.$store.dispatch(`pay/${LOAD_PAYMENT_HISTORIES}`),
		]);

		this.downloadYear = (this.purchasedYearList && this.purchasedYearList[0]) || null;
	}

	created() {
		this.setCookie();

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
@mixin textDefault {
	font-family: $poppins;
	font-weight: 500;
}
@mixin center {
	display: flex;
	align-items: center;
}
.center {
	display: flex;
	align-items: center;
	gap: 4px;

	&.-between {
		justify-content: space-between;
	}

	> span {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.tailInfo {
		display: flex;
		align-items: center;
	}
}
.subtitleSection {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	margin-top: 20px;
	margin-bottom: 28px;

	.subtitleText {
		font-size: 18px;
		line-height: 30px;
		letter-spacing: 0.25px;
		line-height: 26px;
		color: $primaryLight;

		.bold {
			font-weight: 700;
		}
	}
}
.progressBarWrapper {
	margin: 40px 0;
}
.cardTitle {
	@include textDefault();
	@media (min-width: #{$breakpoint-xl}) {
		font-size: 19px;
		line-height: 30px;
		letter-spacing: 0px;
	}
}
.cardsWrapper {
	display: grid;
	margin-top: 24px;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	@media (min-width: #{$breakpoint-xl}) {
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: 20px;
	}
	.leftWrapper {
		grid-column: span 1 / span 1;
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 7 / span 7;
		}
		.sendReportWrap {
			@include center();
			justify-content: space-between;
			margin-top: 24px;
			.desc {
				@include textDefault();
				font-size: 12px;
				line-height: 24px;
				margin-right: 24px;
			}
		}
		.divider {
			border-color: $outline;
			margin-top: 34px;
			margin-bottom: 26px;
		}
		.downloadText {
			@include textDefault();
			font-size: 12px;
			line-height: 24px;
		}
		.downloadWrap {
			@include center();
			justify-content: space-between;
			margin-top: 14px;
			gap: 20px;
		}
	}
	.rightWrapper {
		grid-column: span 1 / span 1;
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 5 / span 5;
		}
		.orderTitle {
			@include textDefault();
			font-size: 19px;
			margin-bottom: 20px;
		}
		.promoWrap {
			@include center();
			justify-content: space-between;
			margin-top: 8px;
			gap: 10px;
		}
		.orderDesc {
			margin-bottom: 33px;
			padding: 0 12px;
			font-size: 14px;

			.descItem {
				padding-bottom: 16px;
				margin-bottom: 18px;
				> div {
					display: flex;
					justify-content: space-between;
					margin-bottom: 8px;

					&.-grey {
						color: $disabled;
					}
				}

				&.-border {
					border-bottom: 1px dashed $outline;
				}

				&.total {
					@include textDefault();
					font-size: 19px;
					padding-bottom: 0;
					margin-bottom: 0;

					> div {
						margin-bottom: 0;
					}
				}
			}
		}

		.referralCardWrapper {
			position: relative;
			overflow: hidden;
			text-align: left;
			border: 1px solid $primaryLight;
			border-radius: $round-lg;
			padding: 36px 0 48px 40px;

			.coinsImg {
				position: absolute;
				bottom: 0px;
				right: 0px;
				mix-blend-mode: multiply;
			}
			.titleText {
				font-family: $poppins;
				font-weight: $font-semibold;
				font-size: 16px;
				margin-bottom: 2px;
			}
			.descText {
				@include textDefault();
				font-size: 13px;
				margin-bottom: 12px;
				&.-dashboard {
					margin-bottom: 110px;
				}
			}
			.textButton {
				@include textDefault();
				color: $link;
				font-size: 14px;
				top: 100px;
				cursor: pointer;
				position: absolute;
			}
		}
	}
	.innerGrid {
		display: grid;
		gap: 14px;
	}
	.expandContentWrap {
		padding: 24px 32px;
		@include textDefault();
		letter-spacing: 0.15px;
		line-height: 1.9;

		.topWrapper {
			font-size: 14px;
			color: $primary;

			.totalInfo {
				line-height: 1.4;
				font-weight: $font-medium;
				> span {
					font-weight: $font-semibold;
					font-size: 19px;
				}
			}

			.termsWrap {
				margin-top: 8px;
				font-size: 13px;
				font-weight: $font-medium;
			}
		}

		.bottomWrapper {
			font-size: 13px;
			color: $primaryLight;
			margin-top: 20px;
		}
	}

	.text {
		&-taxyear {
			@include textDefault();
			font-size: 24px;
			letter-spacing: 3px;
			&.-ml {
				margin-left: 30px;
			}
		}
		&-capitalGain {
			font-family: $poppins;
			font-weight: 400;
			font-size: 13px;
			color: $primaryLight;
			margin-right: 8px;
		}
		&-capitalGainNum {
			@include textDefault();
			font-size: 24px;
		}

		&-sendReport {
			font-family: $poppins;
			font-weight: 600;
			font-size: 19px;
		}

		&-link {
			color: $link;
			cursor: pointer;
			font-size: 14px;
		}
	}
}
.yellowBallImg {
	z-index: 0;
	position: absolute;
	right: 64px;
	top: 36px;
}
</style>
