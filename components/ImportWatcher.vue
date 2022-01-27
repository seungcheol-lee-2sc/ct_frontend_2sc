<template>
	<div id="importWatcher" v-click-outside="closeWatcher" :class="addtionalClass">
		<div class="watcherHeader" :class="status">
			{{ headerText }}

			<span v-if="showLists" class="chevronButton" @click="toggleWatcher">
				<v-icon class="chevron" color="primary">mdi-chevron-up</v-icon>
			</span>
			<span v-else-if="status === EWatcherStatus.ERROR">
				<v-tooltip top>
					<template #activator="{ on }">
						<v-icon :color="importingColor" v-on="on">mdi-connection</v-icon>
					</template>
					<template v-if="!successToConnect">
						{{ $t('product.importWatcher.error1') }}
					</template>
					<template v-else>
						{{ $t('product.importWatcher.error2') }}
					</template>
				</v-tooltip>
			</span>
		</div>

		<div class="watcherLists">
			<ImportingJobCard v-for="job in reformedJobs" v-show="showLists" :key="job.jobId" :job="job" />

			<div v-show="status === EWatcherStatus.ERROR">
				<template v-if="!successToConnect">
					{{ $t('product.importWatcher.error1') }}
				</template>
				<template v-else>
					{{ $t('product.importWatcher.error2') }}
				</template>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, State, Getter } from 'nuxt-property-decorator';
import { SSEClient } from 'vue-sse';
import { CT_BACK } from '~/utils/constants';
import { getAccessToken } from '~/utils/application';
import {
	COMPLETE_STOPPING_JOB,
	DELETE_IMPORT_JOB,
	DELETE_PENDING,
	LOAD_PROVIDER_SOURCES,
	RENEW_IMPORT_JOB,
	TOGGLE_IMPORT_SWITCH,
} from '~/store/provider';
import { BatchProcessStatus, ITransactionRecordBatch } from '~/types/transaction/types';
import { CONFIRM_ERROR, ADD_TO_MESSAGE_QUEUE } from '~/store';
import { EJobStatus, IJob, IReformedJob, IUserTransactionRecordSource } from '~/types/provider/types';
import ImportingJobCard from '~/components/card/ImportingJobCard.vue';
import { ICognitoUserExt } from '~/types/auth/types';

enum EWatcherStatus {
	WAIT = '-wait',
	ERROR = '-error',
	IMPORT = '-importing',
	STOP = '-stopping',
}

@Component({
	components: {
		ImportingJobCard,
	},
})
export default class ImportWatcher extends Vue {
	sseInterval: any = null;
	sseClient: SSEClient | null = null;
	@State(({ provider }) => provider.providerSources) providerSources!: IUserTransactionRecordSource[];
	@State(({ auth }) => auth.user) user!: ICognitoUserExt | null;
	@State(({ provider }) => provider.stoppingJobIds) stoppingJobIds!: string[];

	oldJobIds: string = '';
	lastDeletedJobId: string = '';
	lastSuccessedJobId: string = '';
	successToConnect: boolean = true;
	loading: boolean = false;
	jobCollectorTimeout: any = null;
	open: boolean = false;
	EWatcherStatus = EWatcherStatus;
	jobMemory: IJob[] = [];
	errorBatchStatus: BatchProcessStatus[] = [
		BatchProcessStatus.UNKNOWNN_SCHEMA,
		BatchProcessStatus.INAVLID_DATA,
		BatchProcessStatus.UNKNOWN_SCHEMA,
		BatchProcessStatus.INVALID_DATA,
		BatchProcessStatus.ERROR,
	];

	@Getter('provider/reformedJobs') reformedJobs!: IReformedJob[];

	get showLists(): boolean {
		return this.status === EWatcherStatus.IMPORT || this.status === EWatcherStatus.STOP;
	}

	get importingColor(): string {
		if (this.status === EWatcherStatus.ERROR) {
			return 'error';
		} else if (this.status === EWatcherStatus.STOP) {
			return 'warning';
		} else {
			return 'secondary';
		}
	}

	get addtionalClass(): string {
		let result = '';

		if (this.status === EWatcherStatus.WAIT) {
			result += ' -hide ';
		} else if (this.status === EWatcherStatus.ERROR) {
			result += ' -error ';
		} else if (this.status === EWatcherStatus.STOP) {
			result += ' -stopping ';
			if (this.open) {
				result += ' -open ';
			}
		} else if (this.open) {
			result += ' -open ';
		}

		return result;
	}

	get status(): EWatcherStatus {
		if (this.stoppingJobIds.length > 0) {
			return EWatcherStatus.STOP;
		} else if (this.reformedJobs.length === 0) {
			return !this.successToConnect ? EWatcherStatus.ERROR : EWatcherStatus.WAIT;
		} else {
			return EWatcherStatus.IMPORT;
		}
	}

	get headerText(): string {
		switch (this.status) {
			case EWatcherStatus.STOP:
				return 'Stopping...';
			case EWatcherStatus.ERROR:
				return 'Connection error';
			case EWatcherStatus.IMPORT:
				return 'Importing...';
			default:
				return '';
		}
	}

	closeWatcher() {
		this.open = false;
	}

	toggleWatcher() {
		this.open = !this.open;
	}

	removeFromJobList(jobIds: string[], sourceIds: number[]) {
		this.$store.commit(`provider/${DELETE_PENDING}`, sourceIds);
		this.$store.commit(`provider/${DELETE_IMPORT_JOB}`, jobIds);
		this.jobMemory = this.jobMemory.filter(job => !jobIds.includes(job.jobId));
	}

	async jobCollecting(ending: boolean = false) {
		ending && console.log(`Job collecting ${ending ? '(Ending)' : ''}`);

		let detected = false;
		for (let i = 0; i < this.reformedJobs.length; i++) {
			const job: IReformedJob = this.reformedJobs[i];
			const foundSource: IUserTransactionRecordSource | undefined = this.providerSources.find(
				v => v.jobId === job.jobId,
			);
			if (foundSource && foundSource?.jobStatus === EJobStatus.SUCCEEDED) {
				this.notifytingSuccess(foundSource, job);
				this.removeFromJobList([job.jobId], [foundSource?.id || 0]);
				console.log('Auto processing (success) : ', foundSource);
				detected = true;
				break;
			} else if (foundSource && foundSource?.jobStatus === EJobStatus.FAILED) {
				this.notifyingFailure(foundSource);
				this.removeFromJobList([job.jobId], [foundSource?.id || 0]);
				console.log('Auto processing (fail) : ', foundSource);
				detected = true;
				break;
			}
		}

		if (detected) {
			await this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
			this.$store.commit(`provider/${TOGGLE_IMPORT_SWITCH}`);
		}
	}

	onMessage(sentJobs: IJob[] | IJob) {
		console.log('job: ', sentJobs);
		const jobs = Array.isArray(sentJobs) ? sentJobs : [sentJobs];

		for (let i = 0; i < jobs.length; i++) {
			const job = jobs[i];
			const foundIndex = this.jobMemory.findIndex(v => v.jobId === job.jobId);
			if (foundIndex === -1) {
				this.jobMemory.push(job);
			} else {
				this.jobMemory[foundIndex] = job;
			}
		}

		this.jogProcessing([...this.jobMemory]);
	}

	errorIncludingJob(job: IJob) {
		let found = false;
		if (job.batches && job.batches.length > 0) {
			for (let i = 0; i < job.batches?.length; i++) {
				const batch = job.batches[i];
				if (
					batch.status === BatchProcessStatus.UNKNOWNN_SCHEMA ||
					batch.status === BatchProcessStatus.INAVLID_DATA ||
					batch.status === BatchProcessStatus.ERROR
				) {
					found = true;
					break;
				}
			}
		}

		return found;
	}

	async jogProcessing(jobs: IJob[]) {
		if (!jobs || jobs.length === 0) return;

		/**
		 * Initialize
		 */
		this.$store.commit(`provider/${RENEW_IMPORT_JOB}`, jobs);
		const jobIds = jobs.map(job => job.jobId).join('');
		const sourceIds = jobs.map(job => job.sourceId);
		this.$store.commit(`provider/${DELETE_PENDING}`, sourceIds);

		const successedJobs: IJob[] = [];
		const failedJobs: IJob[] = [];
		const deletedJobs: IJob[] = [];
		for (let i = 0; i < jobs.length; i++) {
			const job = jobs[i];
			job.status === EJobStatus.SUCCEEDED && successedJobs.push(job);
			job.status === EJobStatus.FAILED && failedJobs.push(job);
			job.status === EJobStatus.DELETED && deletedJobs.push(job);
		}
		const finishedJobs: IJob[] = [...successedJobs, ...failedJobs, ...deletedJobs];

		if (finishedJobs.length > 0) {
			this.removeFromJobList(
				finishedJobs.map(v => v.jobId),
				sourceIds,
			);

			if (deletedJobs.length > 0) {
				const deletedJobIds = deletedJobs.map(v => v.jobId);
				this.$store.commit(`provider/${COMPLETE_STOPPING_JOB}`, deletedJobIds);
				this.notifyingDeletedJobs(deletedJobs[0]);
			}

			await this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
			this.$store.commit(`provider/${TOGGLE_IMPORT_SWITCH}`);

			/** Notifying */
			const errorFoundJobs: IJob[] = finishedJobs.filter(job => this.errorIncludingJob(job));
			if (errorFoundJobs.length > 0) {
				const errorBatches = (errorFoundJobs[0].batches || []).filter(batch => {
					return (
						batch.status === BatchProcessStatus.UNKNOWNN_SCHEMA ||
						batch.status === BatchProcessStatus.INAVLID_DATA ||
						batch.status === BatchProcessStatus.ERROR
					);
				});
				const sourceName = (errorFoundJobs[0].batches || [])[0].source?.name || '';
				this.notifyingError(sourceName, errorBatches);
			} else if (successedJobs.length > 0) {
				const foundSource = this.providerSources.find(v => v.id === successedJobs[0]?.sourceId);
				this.notifytingSuccess(foundSource, successedJobs[0]);
			} else if (failedJobs.length > 0) {
				const foundSource = this.providerSources.find(v => v.id === failedJobs[0]?.sourceId);
				this.notifyingFailure(foundSource);
			}
		} else if (jobIds !== this.oldJobIds) {
			this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
		}
		this.oldJobIds = jobIds;

		/**
		 * Job collector
		 */
		this.jobCollecting();
		clearTimeout(this.jobCollectorTimeout);
		this.jobCollectorTimeout = setTimeout(async () => {
			await this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
			this.jobCollecting(true);
		}, 1000 * 5);
	}

	onError(err: any) {
		console.error('Error : ', err);
	}

	refreshSSE() {
		if (!this.user?.username) return;

		this.loading = true;
		this.sseClient?.disconnect();

		this.sseClient = this.$sse.create({
			// url: `${CT_BACK}/services/ct/api/queue/import/current/user`,
			url: `${CT_BACK}/services/ct/api/queue/import/job/user/login/${this.user?.username}`,
			// @ts-ignore
			polyfillOptions: {
				headers: { Authorization: `Bearer ${getAccessToken(this.$cookies)}` },
			},
		});

		this.sseClient
			.on('message', data => this.onMessage(data))
			.on('error', err => this.onError(err))
			.connect()
			.then(() => {
				this.successToConnect = true;
				this.loading = false;
			})
			.catch(err => {
				console.error('Fail:', err);

				this.successToConnect = false;
				this.loading = false;
			});
	}

	notifyingDeletedJobs(job: IJob) {
		if (job.jobId === this.lastDeletedJobId) return;

		this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: 'Stop imporing successful' });
		this.lastDeletedJobId = job?.jobId;
	}

	notifytingSuccess(source: IUserTransactionRecordSource | undefined, job: IJob) {
		if (!source) return;
		if (job.jobId === this.lastSuccessedJobId) return;

		this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
			color: 'successDark',
			msg: this.$t('message.success.importTarget', { target: source?.name }),
		});
		this.lastSuccessedJobId = job?.jobId;
	}

	notifyingFailure(source: IUserTransactionRecordSource | undefined) {
		if (!source) return;

		this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
			color: 'error',
			msg: this.$t('message.fail.importTarget', { target: source?.name }),
		});
	}

	notifyingError(sourceName: string, batches: ITransactionRecordBatch[]) {
		const title = sourceName;
		let text = '';
		let total = 0;
		let error = 0;
		for (let i = 0; i < batches.length; i++) {
			const batch = batches[i];
			if (batches.length === 1) {
				text += `${batch.errorMessage || 'Unknown error 😥'}\n`;
			} else {
				text += `${i + 1}. ${batch.errorMessage || 'Unknown error 😥'}\n`;
			}
			total += batch.countTotal || 0;
			error += batch.countError || 0;
		}
		if (error > 0) {
			text += `\nTotal : ${total}`;
			text += `\nError: ${error}`;
		}

		this.$store.commit(CONFIRM_ERROR, { title, text });
	}

	mounted() {
		this.refreshSSE();
		this.sseInterval = setInterval(() => {
			this.refreshSSE();
		}, 1000 * 60 * 30);
	}

	beforeDestroy() {
		this.sseClient?.disconnect();
		clearInterval(this.sseInterval);
	}
}
</script>

<style lang="scss" scoped>
@mixin transition {
	transition: all 0.3s ease-out;
}

@mixin defaultPadding {
	padding: 10px 20px;
}

#importWatcher {
	@include transition();
	opacity: 1;
	position: fixed;
	bottom: 0px;
	z-index: 99;
	left: 50%;
	transform: translate(-50%, calc(100% - 50px));
	width: calc(100vw - 40px);
	max-width: 320px;
	@media (min-width: #{$breakpoint-xl}) {
		width: 300px;
		left: 80px;
		transform: translate(0, calc(100% - 47px));
	}

	.watcherHeader {
		@include defaultPadding();
		user-select: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: $primary;
		font-weight: $font-medium;
		border-top-left-radius: $round-md;
		border-top-right-radius: $round-md;
		overflow: hidden;
		border: 1px solid $outline;

		.chevronButton {
			border-radius: $round-full;
			cursor: pointer;
			padding: 2px;
		}

		&.-stopping {
			border: 1px solid $warning;
			background-color: $warningLight;
		}
		&.-importing {
			border: 1px solid $secondary;
			background-color: $secondaryPale;
		}
		&.-error {
			border: 1px solid $error;
			background-color: $errorLight;
		}
		&.-wait {
			border: 1px solid $primary;
			background-color: $primaryPale;
		}
	}

	.watcherLists {
		@include defaultPadding();
		border-left: 1px solid $outline;
		border-right: 1px solid $outline;
		background-color: white;
	}

	&.-open {
		transform: translateY(0);
		.watcherHeader {
			.chevronButton {
				transform: rotate(180deg);
			}
		}
	}

	&.-hide {
		bottom: -50px;
		opacity: 0;
		.watcherHeader {
			padding-top: 0;
			padding-bottom: 0;
		}
		.watcherLists {
			padding-top: 0;
			padding-bottom: 0;
		}
	}
}
</style>
