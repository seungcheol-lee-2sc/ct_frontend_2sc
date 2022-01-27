<template>
	<div class="jobCardWrapper">
		<v-img class="providerImage" :src="iconImage" width="100%" contain max-width="24" />
		<span class="sourceName">
			{{ job.source && job.source.name }}
			<span class="progress"> {{ progress }} </span>
			<v-btn :disabled="stopping" color="error" icon style="margin-right: 24px" @click="onClickStop">
				<v-icon>mdi-stop-circle-outline</v-icon>
			</v-btn>
		</span>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, State } from 'nuxt-property-decorator';
import { CONFIRM_ACTION } from '~/store';
import { ICognitoUserExt } from '~/types/auth/types';
import { STOP_IMPORTING_JOB } from '~/store/provider';
import { getIconImage } from '~/utils/application';
import { IStopImportingDTO } from '~/types/provider/dto';
import { IReformedJob } from '~/types/provider/types';

@Component
export default class ImportingJobCard extends Vue {
	@Prop({ required: true }) job!: IReformedJob;

	@State(({ auth }) => auth.user) user!: ICognitoUserExt | null;
	@State(({ provider }) => provider.stoppingJobIds) stoppingJobIds!: string[];

	get stopping(): boolean {
		return Boolean(this.stoppingJobIds.find(v => v === this.job.jobId));
	}

	get progress(): string {
		if (!this.job.progress) {
			return '0%';
		} else if (this.job.progress >= 100) {
			return '100%';
		} else {
			return `${this.job.progress}%`;
		}
	}

	get iconImage(): string {
		let result = '';
		if (this.job?.source?.provider) {
			result = this.job?.source?.provider.iconImage || '';
		} else if (this.job?.source?.asset) {
			result = this.job?.source?.asset?.iconImage || '';
		}

		return result ? getIconImage(result) : '';
	}

	onClickStop() {
		const username = this.user?.username;
		if (!username) return;

		const DTO: IStopImportingDTO = {
			username,
			jobId: this.job.jobId,
		};

		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('message.stopDelete'),
			text: this.$t('message.pauseImport'),
			pending: () => this.$store.dispatch(`provider/${STOP_IMPORTING_JOB}`, DTO),
		});
	}
}
</script>

<style lang="scss" scoped>
.jobCardWrapper {
	display: flex;
	gap: 4px;

	.providerImage {
		margin-right: 16px;
		border-radius: $round-sm;
	}

	.sourceName {
		font-size: 14px;
		font-family: $poppins;
		display: flex;
		align-items: center;
		gap: 8px;

		.progress {
			color: $primary;
			font-weight: $font-bold;
		}
	}
}
</style>
