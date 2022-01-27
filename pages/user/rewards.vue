<template>
	<client-only>
		<div class="rewardsSection" :class="isAccountant ? 'accountantBodyWrapper' : ''">
			<ProductTitleSection v-show="!isAccountant" :no-margin="true">
				<template slot="title">
					{{ $t('page.rewards.pageTitle') }}
				</template>
			</ProductTitleSection>

			<div class="tabWrapper">
				<v-tabs v-model="tab" grow background-color="offWhite">
					<v-tab> {{ String($t('page.rewards.tab1')).toUpperCase() }} </v-tab>
					<v-tab> REWARD HISTORY </v-tab>
					<v-tab> PAID HISTORY </v-tab>
				</v-tabs>
			</div>

			<v-tabs-items v-if="!pageLoading" v-model="tab" class="tabItemsWrapper">
				<!-- TAB 1: Current subscription -->
				<v-tab-item :key="0" class="tabItem" :transition="false">
					<div v-if="affiliateInfo" class="twoColumnsWrapper">
						<div class="inviteCardSection">
							<v-sheet class="inviteCardWrapper">
								<div class="contentSection">
									<div class="rewardTitle">Refer someone with the link below</div>
									<p class="rewardSubtitle">Get 10% rewards for every person who signs up with your link.</p>
								</div>
								<div class="insertImgWrapper">
									<img src="/characters/celebrating-two-characters.png" alt="illustration of characters" />
								</div>
								<div class="linkShareSection">
									<v-sheet class="linkSheet rounded" color="offWhite">
										<span class="linkText">
											{{ affiliateLink }}
										</span>
									</v-sheet>
									<Button
										fontcolor="white"
										color="primary"
										:fontsize="16"
										:width="90"
										:height="52"
										@click="copyUrl(affiliateLink)"
									>
										{{ $t('common.copy') }}
									</Button>
								</div>
							</v-sheet>
						</div>
						<div class="redeemCardSection">
							<v-card v-if="referralsInfo" elevation="0" class="referralSummaryWrap">
								<!-- alert case : No Paypal account -->
								<v-sheet v-if="userPaypalEmail === null" color="errorLight" rounded class="alertSheet -noPaypal">
									<v-icon color="errorDark" class="alertIconWrap">mdi-alert-circle-outline</v-icon>
									<span>
										{{ $t('page.rewards.redeem.alert') }}
									</span>
								</v-sheet>
								<v-divider v-if="userPaypalEmail === null" class="divider -my"></v-divider>
								<!-- /alert case : No Paypal account -->

								<h2 class="descTitle boldSubtitle">{{ $t('product.referrals') }}</h2>
								<div class="descWrap">
									<div class="descLine">
										<span>People who signed up</span> <span>{{ referralsInfo.signedUp }}</span>
									</div>
									<div class="descLine">
										<span>People who bought a plan</span> <span>{{ referralsInfo.bought }}</span>
									</div>
								</div>

								<h2 class="descTitle boldSubtitle -mt">Referrals Rewards</h2>
								<div class="descWrap">
									<div class="descLine">
										<span>Paid rewards</span> <span>${{ referralsInfo.paid }}</span>
									</div>
									<div class="descLine">
										<span>Unpaid rewards</span> <span>${{ referralsInfo.unpaid }}</span>
									</div>
								</div>

								<v-divider class="divider"></v-divider>

								<div class="descTotal">
									<div class="innerFlex">
										<span>Total Rewards</span> <span>${{ referralsInfo.total }}</span>
									</div>
								</div>
							</v-card>
						</div>
					</div>
					<NoticeCard v-else src="/characters/surprised-smile-1.png">
						Load affiliate failed.({{ errorMessage }}) <br />
						Please contact us.
					</NoticeCard>
				</v-tab-item>

				<!-- TAB 2: reward history -->
				<v-tab-item :key="1" class="tabItem" :transition="false">
					<NoticeCard v-if="loadingReferrals"> Loading history </NoticeCard>
					<ProductCard v-else-if="rewardHistory.length > 0" title="Rewards History">
						<table class="historyTable">
							<thead>
								<tr>
									<th v-for="(header, idx) in rewardHeader" :key="`rewardHeader-${idx}`">{{ header.text }}</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, idx) in rewardHistory" :key="`rewardHistory-${idx}`">
									<td>{{ item.name }}</td>
									<td>{{ item.email }}</td>
									<td>{{ item.state }}</td>
								</tr>
							</tbody>
						</table>
					</ProductCard>
					<NoticeCard v-else src="/characters/big-smile-question.png"> There is no reward history </NoticeCard>
				</v-tab-item>

				<!-- TAB 3: paid history -->
				<v-tab-item :key="2" class="tabItem" :transition="false">
					<NoticeCard v-if="loadingCommissions"> Loading history </NoticeCard>
					<div v-else-if="paidHistory.length > 0" class="twoColumnsWrapper">
						<ProductCard title="Payments History" class="paymentHistoryWrapper">
							<table class="historyTable">
								<thead>
									<tr>
										<th v-for="(header, idx) in paidHeader" :key="`paidHeader-${idx}`">{{ header.text }}</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(item, idx) in paidHistory" :key="`paidHistory-${idx}`">
										<td>{{ item.date }}</td>
										<td>${{ item.amount }}</td>
									</tr>
								</tbody>
							</table>
						</ProductCard>
						<div class="redeemCardSection">
							<v-card v-if="referralsInfo" elevation="0" class="referralSummaryWrap">
								<h2 class="descTitle boldSubtitle">Referrals rewards</h2>
								<div class="descWrap">
									<div class="descLine">
										<span>Paid rewards</span> <span>${{ referralsInfo.paid }}</span>
									</div>
									<div class="descLine">
										<span>Unpaid rewards</span> <span>${{ referralsInfo.unpaid }}</span>
									</div>
								</div>

								<v-divider class="divider"></v-divider>

								<div class="descTotal">
									<div class="innerFlex">
										<span>Total Rewards</span> <span>${{ referralsInfo.total }}</span>
									</div>
								</div>
							</v-card>
						</div>
					</div>
					<NoticeCard v-else src="/characters/big-smile-question.png"> There is no payment history </NoticeCard>
				</v-tab-item>
			</v-tabs-items>
		</div>
	</client-only>
</template>

<script lang="ts">
import { Vue, Component, Getter, State } from 'nuxt-property-decorator';
import { DATEFORMAT_GRAPH } from '~/utils/constants';
import { ADD_TO_MESSAGE_QUEUE, PAGE_LOADER } from '~/store';
import { LOAD_PAYMENT_HISTORIES } from '~/store/pay';
import { LOAD_PROVIDER_SOURCES } from '~/store/provider';
import { EAuthRole } from '~/types/common/types';
import NothingText from '~/components/text/NothingText.vue';
import ProductCard from '~/components/card/ProductCard.vue';
import { IAffiliateBody, ICommissionObject, IReferralObject } from '~/types/affiliate/types';
import { ICognitoUserExt } from '~/types/auth/types';
import ProductTitleSection from '~/components/section/ProductTitleSection.vue';
import { copyUrltoClipboard } from '~/utils/dom';
import Button from '~/components/button/Button.vue';
import NoticeCard from '~/components/card/NoticeCard.vue';
import { AffiliateService } from '~/services/AffiliateService';

@Component({
	layout: 'product',
	meta: { auth: true, roles: [EAuthRole.INDIVIDUAL, EAuthRole.PROFESSIONAL] },
	components: {
		NothingText,
		ProductCard,
		ProductTitleSection,
		Button,
		NoticeCard,
	},
	asyncData: async ({ store }) => {
		await Promise.all([
			store.dispatch(`pay/${LOAD_PAYMENT_HISTORIES}`),
			store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`),
		]);
		store.commit(PAGE_LOADER, true);
	},
})
export default class Rewards extends Vue {
	DATEFORMAT_GRAPH = DATEFORMAT_GRAPH;
	tab: number = 0;
	redeemDialog: boolean = false;
	alertMessage: string = '';
	alertButton: string = '';
	rewardHeader: any[] = [
		{ text: 'Name', value: 'name', cellClass: 'borderAround' },
		{ text: 'Email', value: 'email', cellClass: 'borderAround' },
		{ text: 'Status', value: 'state', cellClass: 'borderAround' },
	];

	paidHeader: any[] = [
		{ text: 'Purchase Date', value: 'date' },
		{ text: 'Amount', value: 'amount' },
	];

	affiliateService: AffiliateService | null = null;
	affiliateInfo: IAffiliateBody | null = null;
	commissions: ICommissionObject[] = [];
	referrals: IReferralObject[] = [];
	errorMessage: string = '';
	loadingCommissions: boolean = false;
	loadingReferrals: boolean = false;

	@State(state => state.pageLoading) pageLoading!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;

	@Getter('auth/userPaypalEmail') userPaypalEmail!: string | null;
	@Getter('auth/isAccountant') isAccountant!: boolean;

	get affiliateLink(): string {
		return this.affiliateService?.getLink() || '';
	}

	get referralsInfo() {
		const rewardsInfo = {
			signedUp: 0,
			bought: 0,
			paid: 0,
			unpaid: 0,
			total: 0,
		};

		let paidCommission = 0;
		let unpaidCommission = 0;

		if (this.commissions.length > 0) {
			this.commissions.filter(v => v.paid_at !== null).forEach(v => (paidCommission += v.amount || 0));
			this.commissions.filter(v => v.paid_at === null).forEach(v => (unpaidCommission += v.amount || 0));
			rewardsInfo.paid = paidCommission / 100;
			rewardsInfo.unpaid = unpaidCommission / 100;
		}

		if (this.affiliateInfo) {
			rewardsInfo.signedUp = this.affiliateInfo.leads || 0;
			rewardsInfo.bought = this.affiliateInfo.conversions || 0;
		}

		rewardsInfo.total = rewardsInfo.paid + rewardsInfo.unpaid;
		return rewardsInfo;
	}

	get rewardHistory(): any[] {
		return this.affiliateService?.getRewardHistory() || [];
	}

	get paidHistory(): any[] {
		return this.affiliateService?.getPaidHistory() || [];
	}

	copyUrl(url: string) {
		const success = copyUrltoClipboard(url);

		if (success) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.copy') });
		} else {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$t('message.fail.copy') });
		}
	}

	async loadCommissions(service: AffiliateService, info: IAffiliateBody) {
		this.loadingCommissions = true;
		this.commissions = await service.getCommissions(info?.id || '');
		this.loadingCommissions = false;
	}

	async loadReferrals(service: AffiliateService, info: IAffiliateBody) {
		this.loadingReferrals = true;
		this.referrals = await service.getReferrals(info?.id || '');
		this.loadingReferrals = false;
	}

	async retrieve() {
		this.affiliateService = AffiliateService.getInstance(this.$store, this.user);
		const info: IAffiliateBody | string = await this.affiliateService.getAffiliateInfo();
		if (typeof info === 'string') {
			this.errorMessage = info;
			this.affiliateInfo = null;
		} else {
			this.errorMessage = '';
			this.affiliateInfo = info;
			this.loadCommissions(this.affiliateService, info);
			this.loadReferrals(this.affiliateService, info);
			this.affiliateService.updatePaypal(this.userPaypalEmail || '');
		}

		this.$store.commit(PAGE_LOADER, false);
	}

	fetchOnServer() {
		return false;
	}

	fetch() {
		this.retrieve();
	}
}
</script>

<style lang="scss" scoped>
.rewardsSection {
	.tabWrapper {
		display: grid;
		@media (min-width: #{$breakpoint-xl}) {
			margin-top: 44px;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.tabItemsWrapper {
		margin-top: 48px;

		.tabItem {
			background-color: $offWhite;

			.twoColumnsWrapper {
				display: grid;
				gap: 24px;
				@media (min-width: #{$breakpoint-xl}) {
					grid-template-columns: repeat(3, minmax(0, 1fr));
				}
			}
		}
	}

	.inviteCardSection {
		grid-column: span 1 / span 1;
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 2 / span 2;
		}

		.inviteCardWrapper {
			background-color: $white;
			padding: 38px 28px 30px 28px;
			text-align: center;
			border-radius: $round-sm;
			.contentSection {
				.rewardTitle {
					font-family: $poppins;
					font-weight: $font-bold;
					font-size: 23px;
					line-height: 36px;
					letter-spacing: 0px;
					padding-bottom: 12px;
				}
				.rewardSubtitle {
					font-size: 15px;
					line-height: 24px;
					letter-spacing: 0.15px;
					font-weight: $font-normal;
					color: $primaryLight;
					padding-bottom: 56px;
					@media (min-width: #{$breakpoint-xl}) {
						font-size: 16px;
						line-height: 24px;
					}
				}
				.insertImg {
					margin: inherit auto;
					margin-bottom: 32px;
				}
			}
			.linkShareSection {
				text-align: center;
				margin-top: 24px;
				@media (min-width: #{$breakpoint-xl}) {
					text-align: left;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 16px;
				}
				.linkSheet {
					margin: 8px;
					padding: 12px;
					overflow: auto;
					width: 100%;
					text-align: center;
					@media (min-width: #{$breakpoint-xl}) {
						margin: 0px;
					}
					.linkText {
						color: $primaryLight;
						font-size: 13px;
						line-height: 20px;
						letter-spacing: 0.1px;
						font-weight: 500;
						font-family: $poppins;
						@media (min-width: #{$breakpoint-xl}) {
							font-size: 16px;
							line-height: 30px;
							letter-spacing: 0px;
						}
					}
				}
				.linkButton {
					margin-top: 8px;
					@media (min-width: #{$breakpoint-xl}) {
						margin-top: 0px;
					}
				}
			}
		}
	}

	.redeemCardSection {
		grid-column: span 1 / span 1;

		.referralSummaryWrap {
			background-color: $white;
			padding: 24px;
			border-radius: $round-sm;
			.alertSheet {
				display: flex;
				padding: 8px 16px;
				margin-bottom: 12px;
				&.-noTotal {
					align-items: center;
					span {
						color: $tertiaryDarkPale;
					}
				}
				&.-noPaypal {
					align-items: flex-start;
					span {
						color: $errorDark;
						font-size: 14px;
						line-height: 26px;
						letter-spacing: 0.25px;
					}
				}
				.alertIconWrap {
					margin-right: 12px;
				}
			}
			.divider {
				border-color: $outline;
				&.-my {
					margin: 26px 0;
				}
			}
			.descTitle {
				margin-bottom: 32px;
				&.-mt {
					margin-top: 64px;
				}
			}
			.descWrap {
				color: $primaryLight;
				font-size: 16px;
				line-height: 24px;
				letter-spacing: 0.25px;
				.descLine {
					display: flex;
					justify-content: space-between;
					margin-bottom: 20px;
				}
			}
			.descTotal {
				font-size: 18px;
				font-weight: $font-medium;
				line-height: 30px;
				letter-spacing: 0.25px;
				margin-top: 22px;
				.innerFlex {
					display: flex;
					justify-content: space-between;
				}
			}
		}
	}
	.paymentHistoryWrapper {
		grid-column: span 2 / span 2;
	}
}
.borderAround {
	border: 1px solid $outline !important;
	font-size: 24px;
}
.historyTable {
	border: 1px solid $outline;
	width: 100%;
	td,
	th {
		border: 1px solid $outline;
	}
	thead {
		text-align: left;
		th {
			padding: 15px;
			span {
				font-size: 14px;
				font-weight: $font-bold;
			}
		}
	}
	tbody {
		td {
			padding: 10px 15px;
			span {
				font-size: 14px;
			}
		}
	}
}

.noDataText {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	padding-top: 80px;
	padding-bottom: 133px;
	font-size: 16px;
	letter-spacing: 0.5px;
}
</style>
