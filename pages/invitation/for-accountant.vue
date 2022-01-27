<template>
	<div class="topBodyWrapper bottomBodyWrapper text-align-center">
		<div v-if="!pageLoading" id="forAccountant">
			<div v-if="resultError">
				<h2 class="sectiontitle">Oops, Can't find client's reports.</h2>
			</div>
			<div v-else-if="!clientTaxYears">
				<h2 class="sectiontitle">Oops, Your client doesn't select any tax years.</h2>
			</div>
			<div v-else-if="expired">
				<h2 class="sectiontitle">Oops, This link is expired.</h2>
			</div>
			<section v-else class="sectionWrapper">
				<div class="chooseTaxYearWrap">
					<h2 class="sectiontitle">Choose the tax year.</h2>
					<div class="checkboxWrap">
						<div v-for="year in clientTaxYears" :key="`year-${year}`">
							<Checkbox color="primary" :value="selectedYears.includes(year)" @click="toggleYear(year)" />
							<span class="checkboxLabel">{{ year }}</span>
						</div>
					</div>
				</div>

				<div class="choosesoftwareWrap">
					<h2 class="sectiontitle">Choose the software you have to download.</h2>
					<v-menu offset-y min-width="354">
						<template #activator="{ on, attrs }">
							<v-card width="354" height="52" outlined v-bind="attrs" class="selectFormWrap" v-on="on">
								<span>{{ selectedSoftware ? selectedSoftware : 'Select...' }}</span>
								<v-icon>mdi-menu-down</v-icon>
							</v-card>
						</template>
						<v-list>
							<v-list-item v-for="(item, index) in softwareList" :key="index" @click="changeSoftware(item)">
								<span>{{ item }}</span>
							</v-list-item>
						</v-list>
					</v-menu>
				</div>
				<div class="buttonWrapper">
					<Button
						:height="44"
						:rounded="true"
						color="secondary"
						:depressed="true"
						:fontsize="14"
						:disabled="disableButton"
						fontcolor="white"
						@click="onclickDownload(EReportType.PDF_8949)"
					>
						<v-icon style="margin-right: 8px">mdi-tray-arrow-down</v-icon>
						Form 8949
					</Button>
					<Button
						:height="44"
						:rounded="true"
						color="secondary"
						:depressed="true"
						:fontsize="14"
						fontcolor="white"
						:disabled="disableButton"
						@click="onclickDownload(EReportType.SCHEDULE_D)"
					>
						<v-icon style="margin-right: 8px">mdi-tray-arrow-down</v-icon>
						Schedule D
					</Button>
					<Button
						v-if="csvTypeBySoftware"
						:height="44"
						:rounded="true"
						color="secondary"
						:fontsize="14"
						:disabled="disableButton"
						fontcolor="white"
						@click="onclickDownload(csvTypeBySoftware)"
					>
						<v-icon style="margin-right: 8px">mdi-tray-arrow-down</v-icon>
						CSV
					</Button>
				</div>

				<div class="signupProfessionalWrap">
					<div class="innerWrapper">
						<img src="/captures/manage-clients.png" alt="Capture image of Cointelli program of managing clients" />
						<div class="text">
							<h3>Crypto tax software for beginner,</h3>
							<h2>Cointelli</h2>
							<!-- <ul>
								<li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
								<li>Scelerisque nulla volutpat arcu nulla sodales mauris enim loremloe.</li>
							</ul> -->
							<div class="button">
								<Button color="secondary" fontcolor="white" :rounded="true" :height="52" :fontsize="16">
									Sign Up for Professional
								</Button>
								<img src="/characters/pointing-left.png" alt="Character of Cointelli pointing left" />
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
		<LottieLoader v-else src="/lottie-files/concept2/arcodian.json"> Wait... </LottieLoader>
	</div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator';
import moment from 'moment';
import { throttle } from 'lodash';
import { GET_INFO_OF_CLIENT_SELECTED } from '~/store/accountant';
import { ESoftware } from '~/types/auth/types';
import Button from '~/components/button/Button.vue';
import { ADD_TO_MESSAGE_QUEUE, PAGE_LOADER } from '~/store';
import { TAX_REPORT_PUBLIC } from '~/store/tax';
import { EReportType, ITaxReportRequest } from '~/types/tax/types';
import LottieLoader from '~/components/LottieLoader.vue';
import Checkbox from '~/components/input/Checkbox.vue';

@Component({
	components: { Button, LottieLoader, Checkbox },
	asyncData: ({ store }) => {
		store.commit(PAGE_LOADER, true);
	},
})
export default class ForAccountant extends Vue {
	@State(state => state.isMobile) isMobile!: boolean;
	@State(state => state.pageLoading) pageLoading!: boolean;

	clientTaxYears: number[] = [];
	selectedYears: number[] = [];
	selectedSoftware = '';
	inviteHash: string | any = '';
	expireDate: string = '';
	loading: boolean = false;
	fetching: boolean = false;
	resultError: boolean = false;
	ESoftware = ESoftware;
	EReportType = EReportType;

	get disableButton() {
		return this.selectedYears.length === 0 || !this.selectedSoftware || this.fetching || this.loading;
	}

	get softwareList() {
		// @ts-ignore
		return Object.keys(ESoftware).map(v => ESoftware[v]);
	}

	get expired(): boolean {
		if (!this.expireDate) return true;
		const daysLeft = moment(this.expireDate).diff(moment(new Date()), 'days');
		console.log(daysLeft);
		if (daysLeft <= 0) return true;
		return false;
	}

	get csvTypeBySoftware(): string | null {
		if (this.selectedSoftware === ESoftware.CCH_AXCESS || this.selectedSoftware === ESoftware.CCH_PROSYSTEM) {
			return EReportType.CCH;
		} else if (this.selectedSoftware === ESoftware.DRAKE) {
			return EReportType.DRAKE;
		} else if (this.selectedSoftware === ESoftware.ATX) {
			return EReportType.ATX;
		} else {
			return null;
		}
	}

	toggleYear(year: number) {
		const foundIndex = this.selectedYears.findIndex(v => v === year);
		if (foundIndex === -1) {
			this.selectedYears.push(year);
		} else {
			this.selectedYears.splice(foundIndex, 1);
		}
	}

	changeSoftware(item: string) {
		this.selectedSoftware = item;
	}

	downloadAction = throttle(async (req: ITaxReportRequest) => {
		await this.$store.dispatch(`tax/${TAX_REPORT_PUBLIC}`, req);
	}, 1000);

	downloadTaxReport(type: EReportType, year: number) {
		if (!year) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'warning',
				msg: String(this.$t('page.report.notfound2')) + String(this.$t('message.tryAgain')),
			});
			return;
		}
		if (!type) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'warning',
				msg: String(this.$t('page.report.notfound3')) + String(this.$t('message.tryAgain')),
			});
			return;
		}

		const req: ITaxReportRequest = {
			type,
			taxYear: year,
			inviteId: this.inviteHash,
		};

		console.log(req);

		this.fetching = true;
		this.downloadAction(req);
		setTimeout(() => {
			this.fetching = false;
		}, 1000);
	}

	onclickDownload(type: EReportType) {
		if (this.selectedYears.length === 0) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'warning',
				msg: String(this.$t('page.report.notfound2')) + String(this.$t('message.tryAgain')),
			});
			return;
		}

		this.selectedYears.forEach(year => {
			this.downloadTaxReport(type, +year);
		});
	}

	async getClientInfo(inviteId: string | any) {
		const result = await this.$store.dispatch(`accountant/${GET_INFO_OF_CLIENT_SELECTED}`, inviteId);
		if (result.length === 0) {
			this.resultError = true;
			return;
		}
		this.clientTaxYears = result.taxYears.split(',');
		this.expireDate = result.expireDate;
	}

	fetchOnServer() {
		return false;
	}

	async fetch() {
		if (!this.$route.query.inviteId) {
			this.resultError = true;
			return;
		}
		this.inviteHash = this.$route.query.inviteId;
		await this.getClientInfo(this.inviteHash);
		this.$store.commit(PAGE_LOADER, false);
	}
}
</script>

<style lang="scss" scoped>
#forAccountant h2 {
	max-width: 450px;
	margin: 0 auto;
}
#forAccountant {
	.sectiontitle {
		font-size: 33px;
		font-family: $poppins;
		line-height: 1.4;
		font-weight: $font-normal;
		margin-bottom: 36px;
	}
}
.chooseTaxYearWrap {
	padding-bottom: 84px;
	.checkboxWrap {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 60px;

		> div {
			display: flex;
			gap: 10px;
			align-items: center;

			.checkboxLabel {
				font-size: 19px;
				font-family: $poppins;
				color: $primaryLight;
			}
		}
	}
}
.choosesoftwareWrap {
	padding-bottom: 32px;
	.selectFormWrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 12px;
		margin: 0 auto;
	}
}
.signupProfessionalWrap {
	border-radius: 16px;
	background-color: $secondaryPale;
	padding: 56px 24px 0 24px;
	.innerWrapper {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: 12px;
		.text {
			text-align: left;
		}
		.button {
			display: flex;
			align-items: center;
			gap: 8px;
		}
	}
}
.buttonWrapper {
	display: flex;
	justify-content: center;
	gap: 12px;
	margin-bottom: 100px;
}
</style>
