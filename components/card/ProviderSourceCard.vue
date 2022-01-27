<template>
	<div>
		<v-card class="providerCard" elevation="0" color="offWhite">
			<div class="columnsWrapper" :class="addtionalClasses">
				<div class="firstCol">
					<span v-if="!activateEditing" class="sourceNameWrapper">
						<span class="sourceName" @click="onClickEdit">
							<span>
								{{ providerSource.name }}
							</span>
							<v-icon class="pencilIcon" small color="disabled"> mdi-pencil-outline </v-icon>
						</span>
						<span
							v-if="providerSource.apiKey || providerSource.publicAddress"
							class="keyText"
							@click="onClickKey(providerSource.apiKey || providerSource.publicAddress)"
						>
							{{ keyFormatting(providerSource.apiKey || providerSource.publicAddress) }}
							<v-icon small color="disabled">mdi-content-copy</v-icon>
						</span>
					</span>
					<template v-else>
						<v-text-field
							v-model="newName"
							hide-details="auto"
							outlined
							dense
							append-icon="mdi-content-save-outline"
							append-outer-icon="mdi-close"
							:rules="[v => !duplicated || $t('rules.exist', { target: 'The name' })]"
							@click:append="saveNewName"
							@keypress.enter="saveNewName"
							@click:append-outer="onClickEdit"
						/>
					</template>
				</div>

				<div class="secondCol">
					<template v-if="stopping"> Stopping </template>
					<template v-else-if="importing"> {{ progress }} % </template>
					<template v-else-if="!importing">
						<span
							class="count"
							:class="providerSource && providerSource.count > 0 ? '-active' : ''"
							@click="openTransactionsDialog"
						>
							{{ countText }}
						</span>
						<template v-if="reformedDates">
							{{ reformedDates }}
						</template>
						<template v-else>-</template>
					</template>
				</div>

				<div class="thirdCol">
					<span v-if="providerSource.jobStatus === EJobStatus.FAILED" class="text-error">
						Failed <v-icon color="error">mdi-close-circle-outline</v-icon>
					</span>
					<Button
						v-else-if="
							providerSource.sourceType === SourceType.API_KEY ||
							providerSource.sourceType === SourceType.OAUTH2 ||
							providerSource.sourceType === SourceType.PUBLIC_ADDRESS
						"
						:disabled="importing || syncBtnClicked || deleting || stopping"
						color="primaryLight"
						:fontsize="14"
						:outlined="true"
						:width="82"
						:height="36"
						:rounded="true"
						head-icon="mdi-refresh"
						@click="syncAction"
					>
						Sync
					</Button>
					<span v-else>
						<template v-if="providerSource.sourceType === SourceType.CSV"> File </template>
						<template v-else-if="providerSource.sourceType === SourceType.TEMPLATE"> Manual (Template)</template>
						<template v-else-if="providerSource.sourceType === SourceType.MANUAL"> Manual (Form)</template>
						<template v-else-if="providerSource.sourceType === SourceType.CUSTOM"> Custom </template>
					</span>
				</div>

				<span v-if="!importing && !deleting && !stopping" style="text-align: right">
					<v-menu offset-y>
						<template #activator="{ on, attrs }">
							<v-btn icon v-bind="attrs" v-on="on">
								<v-icon color="primaryLight">mdi-dots-vertical</v-icon>
							</v-btn>
						</template>
						<ProductMenuList :product-menu-list="productMenuList" />
					</v-menu>
				</span>
			</div>
		</v-card>

		<TransactionsDialog
			:dialog="transactionsDialog"
			:injected-account="providerSource"
			@close="closeTransactionsDialog"
		/>
	</div>
</template>

<script lang="ts">
import { Vue, Component, State, Prop, Getter, Watch } from 'nuxt-property-decorator';
import { debounce } from 'lodash';
import Button from '../button/Button.vue';
import TransactionsDialog from '../dialog/TransactionsDialog.vue';
import { EJobStatus, IReformedJob, IUserTransactionRecordSource, SourceType } from '~/types/provider/types';
import { DELETE_PROVIDER_SOURCE, LOAD_PROVIDER_SOURCES, UPDATE_PROVIDER_SOURCE } from '~/store/provider';
import ProductMenuList, { IProductMenuList } from '~/components/list/ProductMenuList.vue';
import { CONFIRM_ACTION, CUSTOM_CONFIRM_ACTION, ADD_TO_MESSAGE_QUEUE } from '~/store';
import { DATE_FORMAT_PRODUCT } from '~/utils/constants';
import { getIconImage, reserveLoginImport } from '~/utils/application';
import { ICognitoUserExt } from '~/types/auth/types';
import { IConfirmation } from '~/types/common/types';
import { SYNC_SOURCE } from '~/store/import';
import { copyUrltoClipboard } from '~/utils/dom';

@Component({
	components: {
		ProductMenuList,
		Button,
		TransactionsDialog,
	},
})
export default class ProviderSourceCard extends Vue {
	@Prop({ required: true }) providerSource!: IUserTransactionRecordSource;
	@Prop({ required: true }) importing!: boolean;

	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ provider }) => provider.providerSources) providerSources!: IUserTransactionRecordSource[];
	@State(({ provider }) => provider.updatedSource) updatedSource!: IUserTransactionRecordSource | null;
	@State(({ provider }) => provider.deletingSourceIds) deletingSourceIds!: number[];
	@State(({ auth }) => auth.user) user!: ICognitoUserExt | null;
	@State(({ provider }) => provider.stoppingJobIds) stoppingJobIds!: string[];

	transactionsDialog: boolean = false;
	syncBtnClickTimeout: any = null;
	syncBtnClicked: boolean = false;
	DATE_FORMAT_PRODUCT = DATE_FORMAT_PRODUCT;
	manualImortDialog: boolean = false;
	activateEditing: boolean = false;
	newName: string = '';
	SourceType = SourceType;
	EJobStatus = EJobStatus;

	paused: boolean = false;

	@Watch('processingSourceIds')
	watchProcessingSourceIds(newVal: number[]) {
		if (this.providerSource && newVal.includes(Number(this.providerSource?.id))) {
			this.syncBtnClicked = false;
			clearTimeout(this.syncBtnClickTimeout);
		}
	}

	@Getter('provider/reformedJobs') reformedJobs!: IReformedJob[];
	@Getter('provider/processingSourceIds') processingSourceIds!: number[];

	get stopping(): boolean {
		return Boolean(this.stoppingJobIds.find(id => id === this.providerSource.jobId));
	}

	get deleting(): boolean {
		return Boolean(this.deletingSourceIds.find(id => id === this.providerSource.id));
	}

	get addtionalClasses(): string {
		let result = '';
		if (this.stopping) {
			result += ' -stopping ';
		} else {
			result += this.deleting ? '-deleting' : '';
			result += !this.deleting && this.importing ? '-importing' : '';
		}

		return result;
	}

	get productMenuList(): IProductMenuList[] {
		const deleteingMenu = [
			{
				color: 'error',
				text: this.$t('common.delete'),
				icon: 'mdi-delete-outline',
				fixStyle: true,
				onclick: () => {
					this.onClickDelete();
				},
			},
		];

		if (Number(this.providerSource?.count) > 0) {
			return [
				{
					color: 'primaryLight',
					text: this.$t('page.import.viewTransactions'),
					icon: 'mdi-view-list-outline',
					onclick: () => {
						this.openTransactionsDialog();
					},
				},
			].concat(deleteingMenu);
		}

		return deleteingMenu;
	}

	get countText(): string {
		const count = this.providerSource?.count;
		if (!count) {
			return 'No transaction';
		} else if (count === 1) {
			return '1 transaction';
		} else {
			return `${count} transactions`;
		}
	}

	get foundJob(): IReformedJob | undefined {
		return this.reformedJobs.find(job => job.sourceId === this.providerSource.id);
	}

	get progress(): number {
		if (this.foundJob && this.foundJob.progress) {
			return +this.foundJob.progress > 100 ? 100 : this.foundJob.progress;
		} else {
			return 0;
		}
	}

	get reformedDates(): string {
		const from = this.providerSource.fromDate
			? this.$moment(this.providerSource.fromDate).format(DATE_FORMAT_PRODUCT)
			: '';
		const to = this.providerSource.toDate ? this.$moment(this.providerSource.toDate).format(DATE_FORMAT_PRODUCT) : '';
		return `${from} - ${to}`;
	}

	get iconImage(): string {
		let result = '';
		if (this.providerSource.provider) {
			result = this.providerSource.provider.iconImage || '';
		} else if (this.providerSource.asset) {
			result = this.providerSource.asset?.iconImage || '';
		}

		return result ? getIconImage(result) : '';
	}

	get duplicated(): boolean {
		if (this.newName && this.newName.trim()) {
			const found = this.providerSources.find(v => v.name?.toLowerCase() === this.newName.trim().toLowerCase());
			return !!found;
		}
		return false;
	}

	keyFormatting(keyString: string): string {
		if (keyString.length > 7) {
			const head = keyString.substring(0, 4);
			const tail = keyString.substring(keyString.length - 3, keyString.length);
			return `${head}....${tail}`;
		} else {
			return keyString;
		}
	}

	onClickKey = debounce((key: string) => {
		this.copyApiKey(key);
	}, 300);

	copyApiKey(key: string) {
		const success: boolean = copyUrltoClipboard(key);
		if (success) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.copy') });
		} else {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$t('message.fail.copy') });
		}
	}

	openTransactionsDialog() {
		if (!(Number(this.providerSource?.count) > 0)) return;
		this.transactionsDialog = true;
	}

	closeTransactionsDialog() {
		this.transactionsDialog = false;
	}

	async syncAction() {
		this.syncBtnClicked = true;
		const res = await this.$store.dispatch(`import/${SYNC_SOURCE}`, this.providerSource);
		if (typeof res === 'string' && res.includes('http')) {
			this.$store.commit(CONFIRM_ACTION, {
				title: this.$t('message.notFoundTarget', { target: 'Connection' }),
				text: this.$t('message.continueConnection'),
				pending: () => {
					reserveLoginImport(this.$cookies, this.providerSource?.provider?.id || 0);
					location.href = res;
				},
			});
		} else {
			this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
		}
		clearTimeout(this.syncBtnClickTimeout);
		this.syncBtnClickTimeout = setTimeout(() => {
			this.syncBtnClicked = false;
		}, 3000);
	}

	async saveNewName() {
		if (this.newName && this.newName.trim() === this.providerSource.name) {
			this.activateEditing = false;
			this.newName = '';
			return;
		}

		if (!this.newName || !this.newName.trim()) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('rules.required', { target: this.$t('product.accoutName') }),
			});
			return;
		}
		if (this.providerSource?.name && this.providerSource?.name.trim() === this.newName.trim()) {
			// There is no change between old and new
			this.activateEditing = !this.activateEditing;
			return;
		}

		if (this.duplicated) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('rules.unique', { target: this.$t('product.accoutName') }),
			});
			return;
		}

		await this.$store.dispatch(`provider/${UPDATE_PROVIDER_SOURCE}`, {
			...this.providerSource,
			name: this.newName,
		});
		await this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
		this.activateEditing = false;
		this.newName = '';
	}

	onClickEdit() {
		if (!this.activateEditing) {
			// open
			this.newName = this.providerSource.name || '';
		}
		this.activateEditing = !this.activateEditing;
	}

	async deleteAction() {
		const username = this.user?.username || '';
		await this.$store.dispatch(`provider/${DELETE_PROVIDER_SOURCE}`, { source: this.providerSource, username });
		this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
	}

	onClickDelete() {
		const sourceName = this.providerSource?.name || '';

		const data: IConfirmation = {
			dialog: true,
			title: this.$t('common.targetDelete', { target: sourceName }),
			text: this.$t('message.deleteSource', { target: sourceName }),
			btnText: this.$t('common.delete'),
			cancelBtn: true,
			pending: () => this.deleteAction(),
		};

		this.$store.commit(CUSTOM_CONFIRM_ACTION, data);
	}
}
</script>

<style lang="scss" scoped>
@import '~/assets/mixins/common.scss';

.providerCard {
	position: relative;
	overflow: hidden;
	padding: 16px;
	border-radius: $round-lg;
	@media (min-width: #{$breakpoint-xl}) {
		padding: 16px 20px;
	}

	.columnsWrapper {
		display: grid;
		text-align: center;
		align-items: center;
		grid-template-columns: repeat(2, minmax(0, 1fr));

		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(12, minmax(0, 1fr));
		}

		&.-stopping {
			&::after {
				@include shimmer-base(rgba($warning, 0.05));
				animation: shimmer 3s infinite;
			}
		}

		&.-importing {
			&::after {
				@include shimmer-base(rgba($secondary, 0.05));
				animation: shimmer 3s infinite;
			}
		}

		&.-deleting {
			&::after {
				@include shimmer-base(rgba($error, 0.05));
				animation: shimmer 3s infinite;
			}
		}
	}

	.firstCol {
		@media (min-width: #{$breakpoint-xl}) {
			text-align: left;
			padding-left: 36px;
			grid-column: span 3 / span 3;
		}

		.sourceNameWrapper {
			.sourceName {
				font-size: 14px;
				font-weight: $font-medium;
				color: $primaryLight;
				font-family: $poppins;
				cursor: pointer;

				.pencilIcon {
					opacity: 0;
					transition: all 0.3 ease-in-out;
					max-width: 0;
					max-height: 0;
				}

				&:hover {
					.pencilIcon {
						opacity: 1;
						max-width: 100%;
						max-height: 100%;
					}
				}
			}
			.keyText {
				color: $disabled;
				font-family: $roboto;
				font-size: 13px;
				letter-spacing: 0.25px;
				line-height: 1.54;
				cursor: pointer;
			}
		}
	}

	.secondCol {
		font-size: 14px;
		color: $primaryPale;
		@media (min-width: #{$breakpoint-xl}) {
			text-align: center;
			grid-column: span 5 / span 5;
		}

		.count {
			font-family: $roboto;
			font-size: 14px;
			color: $primary;
			margin-right: 12px;
			&.-active {
				cursor: pointer;
				&:hover {
					text-decoration: underline;
				}
			}
		}
	}

	.thirdCol {
		font-size: 16px;
		justify-content: space-between;
		color: $primaryLight;
		@media (min-width: #{$breakpoint-xl}) {
			text-align: right;
			grid-column: span 3 / span 3;
			display: flex;
			justify-content: flex-end;
		}
	}
}
</style>
