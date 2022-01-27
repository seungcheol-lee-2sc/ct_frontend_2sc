<template>
	<v-dialog v-model="dialog" width="745" persistent @keydown.esc="close" @click:outside="close">
		<v-card class="dialogCard">
			<v-icon class="closeBtn" color="primaryLight" @click="close" v-text="'mdi-close'" />
			<GeneratingText v-if="!gainLoadDone" height="20vh" :progress="gainLoadProgress">
				downloading report
			</GeneratingText>
			<div v-else>
				<div class="titleText">Please select the tax year</div>
				<div class="descText">You can download each file by year.</div>
				<div class="yearListWrapper scroll">
					<template v-for="year in clientTaxYearList">
						<div :key="`purchasedYear-${year}`" class="yearListBox">
							<span class="yearText">{{ year }}</span>
							<div class="buttonsWrapper">
								<Button
									v-if="csvAvailable"
									:height="36"
									:rounded="true"
									:outlined="true"
									color="outline"
									background="white"
									fontcolor="primary"
									:fontsize="13"
									:disabled="loading"
									@click="onclickDownload(csvTypeBySoftware, year)"
								>
									<v-icon color="primary">mdi-tray-arrow-down</v-icon>
									CSV
								</Button>
								<Button
									:height="36"
									:rounded="true"
									:outlined="true"
									fontcolor="primary"
									color="outline"
									background="white"
									:fontsize="13"
									:disabled="loading"
									@click="onclickDownload(EReportType.PDF_8949, year)"
								>
									<v-icon color="primary">mdi-tray-arrow-down</v-icon>
									Form 8949
								</Button>
								<Button
									:height="36"
									:rounded="true"
									:outlined="true"
									fontcolor="primary"
									color="outline"
									background="white"
									:fontsize="13"
									:disabled="loading"
									@click="onclickDownload(EReportType.SCHEDULE_D, year)"
								>
									<v-icon color="primary">mdi-tray-arrow-down</v-icon>
									Schedule D
								</Button>
							</div>
						</div>
					</template>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
// import { throttle } from 'lodash';
import { Vue, Prop, State, Component } from 'nuxt-property-decorator';
import GeneratingText from '../text/GeneratingText.vue';
import Button from '~/components/button/Button.vue';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { CHECK_GAIN, TAX_REPORT } from '~/store/tax';
import { IRelatedObject } from '~/types/accountant/types';
import { ESoftware } from '~/types/auth/types';
import { IJobCondition } from '~/types/common/dto';
import { EJobStatus } from '~/types/provider/types';
import { EReportType, ITaxReportRequest } from '~/types/tax/types';

@Component({
	components: {
		Button,
		GeneratingText,
	},
})
export default class DownloadClientReportDialog extends Vue {
	@Prop({ required: true }) dialog!: boolean;
	@Prop({ required: true }) client!: IRelatedObject;
	@Prop({ required: true }) selectedSoftware!: string;

	selectedYear: number | null = null;
	loading: boolean = false;
	gainLoadProgress: number = 0;
	gainLoadDone: boolean = false;
	progressInterval: any = null;

	EReportType = EReportType;

	@State(({ tax }) => tax.capitalGainStatus) capitalGainStatus!: EJobStatus;

	get clientTaxYearList() {
		return this.client.taxYearList.split(',');
	}

	get csvAvailable() {
		if (
			this.selectedSoftware &&
			// @ts-ignore
			[ESoftware.ATX, ESoftware.CCH_AXCESS, ESoftware.CCH_PROSYSTEM, ESoftware.DRAKE].includes(this.selectedSoftware)
		) {
			return true;
		}
		return false;
	}

	get csvTypeBySoftware() {
		if (this.selectedSoftware === ESoftware.CCH_AXCESS || this.selectedSoftware === ESoftware.CCH_PROSYSTEM) {
			return EReportType.CCH;
		} else if (this.selectedSoftware === ESoftware.DRAKE) {
			return EReportType.DRAKE;
		} else if (this.selectedSoftware === ESoftware.ATX) {
			return EReportType.ATX;
		}
	}

	// downloadAction = throttle(async (req: ITaxReportRequest) => {
	// 	await this.$store.dispatch(`tax/${TAX_REPORT}`, req);
	// }, 1000);

	async downloadTaxReport(type: EReportType, year: number) {
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

		const clientLogin = this.client.relatedUser.login || '';
		if (!clientLogin) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'warning',
				msg: "Couldn't find client's Id",
			});
			return;
		}

		const req: ITaxReportRequest = {
			taxYear: year,
			type,
			loginId: clientLogin,
		};

		console.log(req);

		this.loading = true;
		const result = await this.$store.dispatch(`tax/${TAX_REPORT}`, req);
		setTimeout(() => {
			this.loading = false;
		}, 1000);
		if (!result) return;
		this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.download') });
	}

	onclickDownload(type: EReportType, year: string) {
		console.log('dd');
		this.downloadTaxReport(type, +year);
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
		}
	}

	close() {
		this.$emit('close');
	}

	created() {
		this.gainLoadDone = this.capitalGainStatus === EJobStatus.SUCCEEDED || this.capitalGainStatus === EJobStatus.FAILED;

		if (!this.gainLoadDone) {
			this.checkCapitalgain();
			this.progressInterval = setInterval(() => {
				this.checkCapitalgain();
			}, 2000);
		}
	}
}
</script>

<style lang="scss" scoped>
.dialogCard {
	padding: 24px;
	overflow: hidden;
	border-radius: $round-xs;
	border-width: 2px;
	.closeBtn {
		position: absolute !important;
		top: 28px;
		right: 28px;
	}

	.titleText {
		text-align: center;
		color: $primary;
		font-family: $poppins;
		font-weight: $font-normal;
		font-size: 23px;
		letter-spacing: 0;
		margin-top: 10px;
	}
	.descText {
		text-align: center;
		font-weight: $font-normal;
		line-height: 1.7;
		color: $primaryLight;
		font-size: 13px;
		margin-top: 17px;
	}
	.yearListWrapper {
		display: grid;
		gap: 20px;
		margin: 40px 0 12px 0;
		.yearText {
			font-family: $poppins;
			font-size: 22px;
			letter-spacing: 4px;
			font-weight: $font-medium;
		}

		.yearListBox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 20px;
			background-color: $offWhite;
			padding: 24px;
			border-radius: $round-sm;
		}
	}
}
</style>
