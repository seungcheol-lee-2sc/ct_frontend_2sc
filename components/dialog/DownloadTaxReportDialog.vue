<template>
	<v-dialog v-model="dialog" width="1206" persistent @keydown.esc="close">
		<v-card class="dialogCardWrapper -large">
			<v-icon class="closeBtn" color="primaryLight" @click="close" v-text="'mdi-close'" />
			<div class="downloadTitle">Download Tax Report</div>
			<div class="downloadListWrapper">
				<div>
					<div class="downloadsubtitle">IRS Forms & Reports</div>
					<div class="downloadListInner">
						<DownloadList
							:disabled="loading"
							title="Form 8949"
							icon="mdi-file-document-outline"
							:doc-type="EReportType.PDF_8949"
							@click="downloadTaxReport(EReportType.PDF_8949)"
						/>
						<DownloadList
							:disabled="loading"
							title="Schedule D"
							icon="mdi-file-document-outline"
							:doc-type="EReportType.SCHEDULE_D"
							@click="downloadTaxReport(EReportType.SCHEDULE_D)"
						/>
						<DownloadList
							:disabled="loading"
							title="Audit Trail Report"
							icon="mdi-file-document-outline"
							:doc-type="EReportType.AUDIT_TRIAL"
							@click="downloadTaxReport(EReportType.AUDIT_TRIAL)"
						/>
						<DownloadList
							:disabled="loading"
							title="Income Report"
							icon="mdi-file-document-outline"
							:doc-type="EReportType.INCOME_TAX"
							@click="downloadTaxReport(EReportType.INCOME_TAX)"
						/>
						<DownloadList
							:disabled="loading"
							title="Transaction history"
							icon="mdi-file-document-outline"
							:doc-type="EReportType.TRANSACTION"
							@click="downloadTaxReport(EReportType.TRANSACTION)"
						/>
					</div>
				</div>
				<v-divider vertical class="dividerLine"></v-divider>
				<div>
					<div class="downloadsubtitle">Tax Filing Software</div>
					<div class="downloadListInner">
						<DownloadList
							:disabled="loading"
							title="Individual Turbo Tax Online"
							icon="mdi-file-document-outline"
							:doc-type="EReportType.TURBO_TAX_ONLINE"
							@click="downloadTaxReport(EReportType.TURBO_TAX_ONLINE)"
						/>
						<DownloadList
							:disabled="loading"
							title="Individual Turbo Tax Desktop"
							icon="mdi-file-document-outline"
							:doc-type="EReportType.TURBO_TAX_DESKTOP"
							@click="downloadTaxReport(EReportType.TURBO_TAX_DESKTOP)"
						/>
						<DownloadList
							:disabled="loading"
							title="Individual TaxAct"
							icon="mdi-file-document-outline"
							:doc-type="EReportType.TAX_ACT"
							@click="downloadTaxReport(EReportType.TAX_ACT)"
						/>
					</div>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { throttle } from 'lodash';
import DownloadList from '~/components/list/DownloadList.vue';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { TAX_REPORT } from '~/store/tax';
import { EReportType, ITaxReportRequest } from '~/types/tax/types';

@Component({
	components: {
		DownloadList,
	},
})
export default class DownloadTaxReportDialog extends Vue {
	@Prop({ required: true }) dialog!: boolean;
	@Prop({ required: true }) downloadYear!: number | null;
	EReportType = EReportType;

	loading: boolean = false;

	downloadTaxReport(type: EReportType) {
		if (!this.downloadYear) {
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
			taxYear: this.downloadYear,
			type,
		};

		this.loading = true;
		this.downloadAction(req);
		setTimeout(() => {
			this.loading = false;
		}, 1000);
	}

	downloadAction = throttle(async (req: ITaxReportRequest) => {
		await this.$store.dispatch(`tax/${TAX_REPORT}`, req);
	}, 1000);

	close() {
		this.$emit('close');
	}
}
</script>

<style lang="scss" scoped>
.downloadListInner {
	margin-top: 16px;
	margin-bottom: 20px;
}

.downloadTitle {
	font-size: 36px;
	font-family: $poppins;
	margin-bottom: 38px;
}
.downloadsubtitle {
	font-weight: $font-medium;
	font-size: 24px;
	margin-bottom: 40px;
}
.downloadListWrapper {
	display: grid;
	grid-template-columns: 1fr 1px 1fr;
	gap: 28px;
}
</style>
