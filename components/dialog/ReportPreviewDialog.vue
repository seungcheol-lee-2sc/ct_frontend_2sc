<template>
	<v-dialog
		v-model="dialog"
		persistent
		content-class="ct-scroll"
		width="1290"
		@keydown.esc="close"
		@click:outside="close"
	>
		<v-card class="reportPreviewWrapper">
			<v-icon class="closeButton" color="primaryLight" @click="close" v-text="'mdi-close'" />
			<div class="titleText">Tax report preview</div>
			<div class="buttonWrapper">
				<template v-for="sample in reportSamples">
					<FilterButton
						:key="sample.value"
						:name="sample.text"
						:active="sample.value === selectedSample.value"
						@click="selectForm(sample)"
					/>
				</template>
			</div>
			<div>
				<img
					style="width: 100%"
					:src="`/report-forms/${selectedSample.value}-sample.jpg`"
					:alt="`img of ${selectedSample.value}`"
				/>
			</div>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import FilterButton from '../button/FilterButton.vue';
import { EReportType } from '~/types/tax/types';

@Component({
	components: { FilterButton },
})
export default class ReportPreviewDialog extends Vue {
	@Prop({ required: true }) dialog!: boolean;

	EReportType = EReportType;
	selectedSample: any | null = null;
	reportSamples = [
		{ value: EReportType.PDF_8949, text: 'Form 8949' },
		{ value: EReportType.SCHEDULE_D, text: 'Schedule D' },
		{ value: EReportType.AUDIT_TRIAL, text: 'Audit Trail Report' },
		{ value: EReportType.INCOME_TAX, text: 'Income Report' },
		{ value: EReportType.TRANSACTION, text: 'Transactional History' },
		{ value: EReportType.TURBO_TAX_ONLINE, text: 'Turbotax Online' },
		{ value: EReportType.TURBO_TAX_DESKTOP, text: 'Turbotax Desktop' },
		{ value: EReportType.TAX_ACT, text: 'Tax Act' },
	];

	selectForm(report: any) {
		this.selectedSample = report;
	}

	close() {
		this.$emit('close');
	}

	created() {
		this.selectedSample = this.reportSamples[0];
	}
}
</script>

<style lang="scss" scoped>
.reportPreviewWrapper {
	padding: 32px;
	.closeButton {
		position: absolute !important;
		top: 28px;
		right: 28px;
	}
	.titleText {
		font-size: 33px;
		font-family: $poppins;
		letter-spacing: 0.25px;
	}
	.buttonWrapper {
		margin-top: 36px;
		margin-bottom: 20px;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
}
</style>
