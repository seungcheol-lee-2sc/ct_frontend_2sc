<template>
	<v-expansion-panel :id="platform.id" class="outlinedPanel" :disabled="disabled">
		<div class="panelHeader">
			<PlatformCard
				:platform="platform"
				:importing="platformImporting"
				:stopping="platformStopping"
				:progress="platformProgress"
			/>
			<Button
				:icon="true"
				color="primaryLight"
				:head-icon="opened ? 'mdi-chevron-up' : 'mdi-chevron-down'"
				@click="onClickPanel"
			>
			</Button>
		</div>
		<v-expansion-panel-content v-show="opened">
			<slot name="content">
				<div class="panelContent">
					<div v-for="providerSource in platform.providerSources" :key="providerSource.id">
						<ProviderSourceCard
							v-if="providerSource.id"
							:provider-source="providerSource"
							:importing="providerSource && processingSourceIds.includes(providerSource.id)"
						/>
					</div>
				</div>
				<div class="addtionalButtons">
					<Button
						:disabled="deleting"
						:outlined="true"
						:fontsize="14"
						:height="36"
						color="outline"
						fontcolor="primary"
						@click="openImportDialog"
					>
						{{ $t('product.import') }}
					</Button>
					<Button
						:disabled="platformImporting || deleting"
						color="outline"
						:outlined="true"
						:height="36"
						:width="36"
						@click="deletePlatform"
					>
						<v-icon :color="platformImporting || deleting ? 'white' : 'primary'">mdi-trash-can-outline</v-icon>
					</Button>
				</div>
				<ImportDialog
					:dialog="importDialog"
					:injected-provider="(platform && platform.provider) || (platform && platform.asset) || null"
					@close="closeImportDialog"
				/>
			</slot>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script lang="ts">
import { Component, Getter, Prop, State, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import ImportDialog from '../dialog/ImportDialog.vue';
import { DELETE_PROVIDER_SOURCE, LOAD_PROVIDER_SOURCES } from '~/store/provider';
import ProviderSourceCard from '~/components/card/ProviderSourceCard.vue';
import PlatformCard from '~/components/card/PlatformCard.vue';
import { IPlatform, IReformedJob, IUserTransactionRecordSource } from '~/types/provider/types';
import { ADD_TO_CLOSING_QUEUE, ADD_TO_MESSAGE_QUEUE, CONFIRM_ACTION } from '~/store';
import { ICognitoUserExt } from '~/types/auth/types';

@Component({
	components: {
		PlatformCard,
		ProviderSourceCard,
		Button,
		ImportDialog,
	},
})
export default class PlatformPanel extends Vue {
	@Prop({ required: true }) platform!: IPlatform;
	@Prop() disabled!: boolean;

	importDialog: boolean = false;
	deleting: boolean = false;
	opened: boolean = false;
	@State(({ provider }) => provider.stoppingJobIds) stoppingJobIds!: string[];
	@State(({ auth }) => auth.user) user!: ICognitoUserExt | null;

	@Getter(`provider/processingSourceIds`) processingSourceIds!: number[];
	@Getter(`provider/reformedJobs`) reformedJobs!: IReformedJob[];

	get platformProgress(): number {
		let result = 0;
		let count = 0;
		this.platform.providerSources.forEach(source => {
			const found = this.reformedJobs.find(job => job.sourceId === source?.id);
			if (found) {
				const progress = +(found.progress || 0);
				if (!progress || isNaN(progress)) {
					result += 0;
				} else if (progress > 100) {
					result += 100;
				} else {
					result += progress;
				}
				count += 1;
			}
		});
		return Math.ceil(result / count);
	}

	get platformStopping(): boolean {
		let result = false;

		for (let i = 0; i < this.platform.providerSources.length; i++) {
			const source: IUserTransactionRecordSource = this.platform.providerSources[i];
			if (source?.id && this.stoppingJobIds.includes(source?.jobId || '')) {
				result = true;
				break;
			}
		}

		return result;
	}

	get platformImporting(): boolean {
		let result = false;
		for (let i = 0; i < this.platform.providerSources.length; i++) {
			const source: IUserTransactionRecordSource = this.platform.providerSources[i];
			if (
				source?.id &&
				this.processingSourceIds.includes(source?.id) &&
				!this.stoppingJobIds.includes(source?.jobId || '')
			) {
				result = true;
				break;
			}
		}
		return result;
	}

	openImportDialog() {
		this.importDialog = true;
	}

	closeImportDialog() {
		this.importDialog = false;
	}

	onClickPanel() {
		this.opened = !this.opened;
	}

	async deleteAction(sources: IUserTransactionRecordSource[]) {
		this.deleting = true;
		const messageId = await this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
			msg: 'Deleting...',
			color: 'primary',
			manual: true,
		});
		const username = this.user?.username || '';
		await Promise.all(
			sources.map(source => this.$store.dispatch(`provider/${DELETE_PROVIDER_SOURCE}`, { source, username })),
		);
		this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
		this.$store.dispatch(ADD_TO_CLOSING_QUEUE, messageId);
		this.deleting = false;
	}

	deletePlatform() {
		const sourceIds: number[] = this.platform.providerSources.map(v => v.id || 0);
		const target = sourceIds.length === 1 ? this.platform.providerSources[0].name : sourceIds.length;
		const text =
			sourceIds.length === 1
				? this.$t('message.deleteSource', { target })
				: this.$t('message.deleteSources', { num: target });

		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.delete'),
			text,
			pending: () => this.deleteAction(this.platform.providerSources),
		});
	}
}
</script>

<style lang="scss" scoped>
.outlinedPanel {
	border: 1px solid $outline !important;
	border-radius: 16px !important;
	overflow: hidden;

	.panelHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: default !important;
		padding: 28px 24px;
	}
	.panelContent {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.addtionalButtons {
		margin-top: 20px;
		text-align: right;
		display: flex;
		gap: 12px;
		justify-content: flex-end;
	}
}
</style>
