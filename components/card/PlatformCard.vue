<template>
	<div class="platformCard">
		<div>
			<div class="sourceNameWrapper">
				<div class="sourceNameInner">
					<v-img v-if="iconImage" class="sourceImage" :src="iconImage" max-width="40" />
					<div>
						<span class="sourceName">
							{{ platform.name }}
						</span>
						<div v-if="platform.subname" class="customText">{{ platform.subname }}</div>
					</div>
				</div>
			</div>
		</div>

		<div>
			<template v-if="!importing">
				<span class="count" :class="platform && platform.count > 0 ? '-active' : ''" @click="openTransactionsDialog">
					{{ countText }}
				</span>
				<span class="lastUpdated">
					<template v-if="reformedDates"> {{ reformedDates }} </template>
					<template v-else>-</template>
				</span>
			</template>
		</div>

		<div>
			<div v-if="stopping" class="progressWrapper">
				<ProgressBar :progress="0" :height="24" color="warning"> Stopping </ProgressBar>
			</div>
			<div v-else-if="importing" class="progressWrapper">
				<ProgressBar :progress="progress" :height="24">
					{{ !progress ? 'Getting ready' : '' }}
				</ProgressBar>
				<v-btn small icon color="secondary" @click="onClickStopJob">
					<v-icon color="secondary">mdi-stop-circle-outline</v-icon>
				</v-btn>
			</div>
			<template v-else-if="!importing">
				<span v-if="completeText" class="completeText">
					{{ completeText }}
					<v-icon color="secondary">mdi-checkbox-marked-circle-outline</v-icon>
				</span>
			</template>
		</div>

		<TransactionsDialog :dialog="transactionsDialog" :injected-platform="platform" @close="closeTransactionsDialog" />
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, State, Getter } from 'nuxt-property-decorator';
import TransactionsDialog from '../dialog/TransactionsDialog.vue';
import ProgressBar from '../bar/ProgressBar.vue';
import Button from '../button/Button.vue';
import { STOP_IMPORTING_JOB } from '~/store/provider';
import { getIconImage } from '~/utils/application';
import { DATE_FORMAT_PRODUCT } from '~/utils/constants';
import { ICognitoUserExt } from '~/types/auth/types';
import { CONFIRM_ACTION } from '~/store';
import { EJobStatus, IPlatform, IReformedJob } from '~/types/provider/types';
import { IStopImportingDTO } from '~/types/provider/dto';

@Component({
	components: {
		TransactionsDialog,
		ProgressBar,
		Button,
	},
})
export default class PlatformCard extends Vue {
	@Prop({ required: true }) platform!: IPlatform;
	@Prop({ required: true }) importing!: boolean;
	@Prop({ required: true }) stopping!: boolean;
	@Prop({ required: true }) progress!: number;

	@State(({ auth }) => auth.user) user!: ICognitoUserExt | null;

	transactionsDialog: boolean = false;

	@Getter(`provider/processingSourceIds`) processingSourceIds!: number[];
	@Getter('provider/reformedJobs') reformedJobs!: IReformedJob[];

	get completeText(): string {
		const count = this.platform.providerSources.filter(
			v => v.jobStatus !== EJobStatus.FAILED && !this.processingSourceIds.includes(v.id || 0) && (v.count || 0) > 0,
		).length;

		if (count === 0) {
			return '';
		} else if (count === 1) {
			return 'Complete';
		} else {
			return `${count} Complete`;
		}
	}

	get countText(): string {
		const count = this.platform?.count;
		if (!count) {
			return 'No transactions';
		} else if (count === 1) {
			return '1 transaction';
		} else {
			return `${count} transactions`;
		}
	}

	get reformedDates(): string {
		const from = this.platform.fromDate ? this.$moment(this.platform.fromDate).format(DATE_FORMAT_PRODUCT) : '';
		const to = this.platform.toDate ? this.$moment(this.platform.toDate).format(DATE_FORMAT_PRODUCT) : '';
		return `${from} - ${to}`;
	}

	get iconImage(): string {
		return getIconImage(this.platform?.img || '');
	}

	onClickStopJob() {
		const username = this.user?.username;
		if (!username) return;

		const foundJobs = [];

		for (let i = 0; i < this.reformedJobs.length; i++) {
			const job: IReformedJob = this.reformedJobs[i];
			const existed: number = this.platform.providerSources.findIndex(v => v.id === job.sourceId);
			if (existed !== -1) {
				foundJobs.push(job);
			}
		}

		const DTOs: IStopImportingDTO[] = foundJobs.map(job => ({
			username,
			jobId: job.jobId,
		}));

		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.stop'),
			text: this.$t('message.pauseImport'),
			pending: () => Promise.all(DTOs.map(dto => this.$store.dispatch(`provider/${STOP_IMPORTING_JOB}`, dto))),
		});
	}

	openTransactionsDialog() {
		if (!(this.platform?.count > 0)) return;
		this.transactionsDialog = true;
	}

	closeTransactionsDialog() {
		this.transactionsDialog = false;
	}
}
</script>

<style lang="scss" scoped>
.platformCard {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 4px;
	align-items: center;
	width: 100%;

	@media (min-width: #{$breakpoint-xl}) {
		grid-template-columns: repeat(12, minmax(0, 1fr));
	}

	> div {
		&:nth-child(1) {
			@media (min-width: #{$breakpoint-xl}) {
				grid-column: span 3 / span 3;
			}
		}
		&:nth-child(2) {
			@media (min-width: #{$breakpoint-xl}) {
				text-align: center;
				grid-column: span 6 / span 6;
			}
		}
		&:nth-child(3) {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 2px;
			@media (min-width: #{$breakpoint-xl}) {
				grid-column: span 3 / span 3;
			}
		}

		.sourceNameWrapper {
			display: flex;
			align-items: center;
			gap: 16px;

			.sourceNameInner {
				display: flex;
				align-items: center;

				.sourceImage {
					margin-right: 16px;
					border-radius: $round-sm;
				}

				.sourceName {
					font-family: $poppins;
					font-weight: $font-medium;
					font-size: 19px;
					color: $primary;
					line-height: 1;

					.customText {
						font-family: $poppins;
						color: $primaryLight;
						font-size: 10px;
						line-height: 1;
						margin-top: 4px;
					}
				}
			}
		}

		.count {
			font-family: $roboto;
			font-size: 16px;
			color: $primary;
			margin-right: 12px;
			font-weight: $font-medium;

			&.-active {
				cursor: pointer;
				&:hover {
					text-decoration: underline;
				}
			}
		}

		.lastUpdated {
			font-family: $roboto;
			font-size: 16px;
			color: $primaryPale;
		}

		.progressWrapper {
			width: 100%;
			display: flex;
			align-items: center;
			gap: 4px;
			justify-content: space-between;
		}

		.completeText {
			font-family: $poppins;
			font-size: 16px;
			letter-spacing: 0.15px;
			font-weight: $font-medium;
			color: $secondary;
			padding-right: 58px;
		}
	}
}
</style>
