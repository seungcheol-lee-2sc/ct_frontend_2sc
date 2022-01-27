<template>
	<v-dialog :value="dialog" width="1440" persistent scrollable @keydown.esc="closeDialog(false)">
		<div style="position: relative">
			<!-- not selected -->
			<ProviderSelectionCard
				v-show="!selectedProvider"
				:init-trigger="initTrigger"
				@selectProvider="selectProvider"
				@close="closeDialog(false)"
			/>
			<!-- /not selected -->

			<!-- Provider selected -->
			<v-card v-if="selectedProvider" min-height="730">
				<div class="dialogCardWrapper cardWrapper noPadBottom">
					<v-icon class="closeBtn" color="primary" @click="closeDialog(false)">mdi-close</v-icon>

					<div class="providerTitle">
						<Button
							v-if="!injectedProvider"
							:icon="true"
							color="primary"
							class="prevButton"
							head-icon="mdi-chevron-left"
							@click="onClickPrev"
						/>
						{{ importingTitle }}
					</div>
				</div>
				<div class="dialogCardWrapper cardWrapper">
					<div class="contentsWrapper" :class="importType === EImport.MANUAL ? '-hide-nav' : ''">
						<div class="actionContent">
							<template v-if="isThisAsset(selectedProvider) && importType === EImport.AUTO">
								<ImportCard :title="$t('page.import.addressImporting')" :no-pad="true">
									<template slot="button">
										<DropdownButton color="primary" :list="importTypes" value="Auto import">
											Auto import
										</DropdownButton>
									</template>
									<WalletImportForm
										:datas="walletImportDatas"
										:selected-provider="selectedProvider"
										:hide-append-button="true"
										@callback="closeDialog(true)"
										@init="onClickAddWalletImportInput"
										@removeLine="removeWalletImportLine"
									/>
								</ImportCard>
							</template>
							<template v-else-if="!isThisAsset(selectedProvider) && importType === EImport.AUTO">
								<ImportCard :title="`${importMethodTitle}`" :no-pad="true">
									<template slot="button">
										<DropdownButton color="primary" :list="importTypes" value="Auto import">
											Auto import
										</DropdownButton>
									</template>
									<WalletImportForm
										v-if="selectedProvider.type === TransactionRecordProviderType.WALLET"
										:datas="walletImportDatas"
										:selected-provider="selectedProvider"
										@callback="closeDialog(true)"
										@init="onClickAddWalletImportInput"
										@removeLine="removeWalletImportLine"
									>
										<template slot="addButton">
											<div style="buttonsWrapper -right">
												<Button
													color="primary"
													:outlined="true"
													:fontsize="14"
													:height="44"
													head-icon="mdi-plus"
													@click="onClickAddWalletImportInput"
												>
													{{ $t('common.add') }}
												</Button>
											</div>
										</template>
									</WalletImportForm>
									<ImportByLoginSheet
										v-else-if="selectedProvider.isLoginImportEnabled"
										:selected-provider="selectedProvider"
										@callback="closeDialog(true)"
									/>
									<ApiSyncForm
										v-else-if="selectedProvider.isAPIImportEnabled"
										:selected-provider="selectedProvider"
										@callback="closeDialog(true)"
									/>
								</ImportCard>
							</template>
							<template v-else-if="importType === EImport.FILE">
								<ImportCard :title="$t('page.import.fileImporting')" :no-pad="true">
									<template slot="button">
										<DropdownButton color="primary" :list="importTypes" value="Import file">
											Import file
										</DropdownButton>
									</template>
									<FileUploadCard
										v-for="(providerInput, idx) in providerInputs"
										:key="`${providerInput.label}-${idx}`"
										:uploaded-files="providerInput.files || []"
										:label="providerInput.label"
										:accept-types="['csv', 'zip']"
										:multiple="true"
										:large-file-alarm="true"
										@upload="files => grabFiles(files, idx)"
										@delete="deleteUploadedFile(idx)"
									>
										{{ $t('common.dropFile') }}
									</FileUploadCard>

									<div
										class="tzAndButtonWrapper"
										:class="selectedProvider.timestampTimeZone === 'USER_TIMEZONE' ? '-tz' : ''"
									>
										<TimezoneSelector
											v-if="selectedProvider.timestampTimeZone === 'USER_TIMEZONE'"
											:hide-details="true"
											:init-value="fileTimezone"
											:tooltip="$t('product.tooltip.timezone2')"
											@onchange="onChangeFileTimezone"
										/>

										<Button
											fontcolor="white"
											:rounded="true"
											:block="true"
											:disabled="uploadingFile"
											:height="52"
											color="primary"
											@click="importFiles"
										>
											{{ $t('product.import') }}
										</Button>
									</div>
								</ImportCard>
							</template>
							<template v-else-if="importType === EImport.TEMPLATE">
								<ImportCard :title="$t('page.import.templateImporting')" :no-pad="true">
									<template slot="button">
										<DropdownButton color="primary" :list="importTypes" value="Use template">
											Use template
										</DropdownButton>
									</template>
									<div class="templateImportStep">
										<span>STEP 1</span>
										<p>{{ $t('page.import.manual.step1') }}</p>
										<div class="roundedButton" @click="onClickDownloadTemplate">
											<v-icon color="white">mdi-tray-arrow-down</v-icon>
										</div>
									</div>

									<div class="nextStepIcon">
										<v-icon color="disabled">mdi-chevron-down</v-icon>
									</div>

									<div class="templateImportStep">
										<span>STEP 2</span>
										<p>{{ $t('page.import.manual.step2') }}</p>
									</div>

									<div class="nextStepIcon">
										<v-icon color="disabled">mdi-chevron-down</v-icon>
									</div>

									<div class="templateImportStep">
										<span>STEP 3</span>
										<p>
											{{ $t('page.import.manual.step3') }}
											<a @click="() => {}">Browse</a>
										</p>
										<UploadSheet :droppable="true" :accept-types="['csv', 'zip']" @upload="grabTemplateFiles" />
										<UploadedFileList
											v-if="uploadedTemplateFiles.length > 0"
											:files="uploadedTemplateFiles"
											:max-length="30"
											@delete="onDeleteTemplateFile"
										/>
									</div>
								</ImportCard>

								<div class="tzAndButtonWrapper -tz">
									<TimezoneSelector
										:hide-details="true"
										:init-value="templateTimezone"
										:tooltip="$t('product.tooltip.timezone2')"
										@onchange="onChangeTemplateTimezone"
									/>

									<Button
										fontcolor="white"
										:disabled="uploadingFile"
										:rounded="true"
										:block="true"
										:height="52"
										color="primary"
										type="submit"
										@click="importManualTemplate"
									>
										{{ $t('product.import') }}
									</Button>
								</div>
							</template>
							<template v-else-if="importType === EImport.MANUAL">
								<ImportCard title="Manually import your data" :no-pad="true">
									<template slot="button">
										<DropdownButton color="primary" :list="importTypes" value="Fill out form">
											Fill out form
										</DropdownButton>
									</template>
									<template slot="appendButton">
										<Button
											:outlined="true"
											:rounded="true"
											:fontsize="14"
											color="primaryLight"
											head-icon="mdi-plus"
											@click="onClickManualForm"
										>
											{{ $t('common.add') }}
										</Button>
									</template>
									<TransactionsTable
										:submit-type="EManualSubmitType.IMPORT"
										:target-transactions="manualImportedTransactions"
										:adding="Boolean(importedTransaction)"
										:provider="selectedProvider"
										@callback="() => {}"
										@cancelCreate="onCancelCreate"
										@cancelUpdate="onCancelUpdate"
									/>
								</ImportCard>

								<div class="tzAndButtonWrapper -tz -right">
									<TimezoneSelector
										:hide-details="true"
										:init-value="manualTimezone"
										:tooltip="$t('product.tooltip.timezone1')"
										@onchange="onChangeManualTimezone"
									/>

									<Button
										:rounded="true"
										:block="true"
										fontcolor="white"
										:height="52"
										color="primary"
										@click="manualFormImport"
									>
										{{ $t('product.import') }} ({{ manualImportedTransactions.length }})
									</Button>
								</div>
							</template>
						</div>
						<div class="navContent">
							<ImportNavCard :current-tab="importType" :provider="selectedProvider" @bug="openBugReporter" />
						</div>
					</div>
				</div>
			</v-card>
			<!-- /Provider selected -->

			<div v-if="bugReport" class="absoluteBugReport">
				<v-card class="dialogCardWrapper cardWrapper" color="offWhite" max-width="715">
					<BugReportCard
						:can-not-close="isCustomProvider ? true : false"
						:fixed-category="isCustomProvider ? 'Import data' : null"
						@cancel="closeBugReporter"
					/>
				</v-card>
			</div>
		</div>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, State, Vue, Watch } from 'nuxt-property-decorator';
import { IProductMenuList } from '../list/ProductMenuList.vue';
import ImportCard from '../card/ImportCard.vue';
import TransactionsTable from '../table/TransactionsTable.vue';
import { EManualSubmitType } from '../form/ManualImportForm.vue';
import {
	EImportGuideType,
	EProviderTypeFilter,
	ERecommandedImportMethod,
	ITransactionRecordProvider,
	SourceType,
	TransactionRecordProviderType,
} from '~/types/provider/types';
import ImportNavCard from '~/components/card/ImportNavCard.vue';
import ImportByLoginSheet from '~/components/sheet/ImportByLoginSheet.vue';
import ApiSyncForm from '~/components/form/ApiSyncForm.vue';
import { ON_CHANGE_SEARCH_TEXT, LOAD_PROVIDER_SOURCES, GET_PROVIDER_SCHEMAS } from '~/store/provider';
import {
	MANUAL_FORM_IMPORT_CUSTOM,
	MANUAL_FORM_IMPORT,
	FILE_IMPORT_S3,
	TEMPLATE_IMPORT_S3,
	CUSTOM_TEMPLATE_IMPORT_S3,
} from '~/store/import';
import UploadedFileList from '~/components/list/UploadedFileList.vue';
import { ITransactionRecord } from '~/types/transaction/types';
import { IConfirmation, ITimeZone } from '~/types/common/types';
import { fileListToArr } from '~/utils/func';
import ProviderSelectionCard from '~/components/card/ProviderSelectionCard.vue';
import WalletImportForm from '~/components/form/WalletImportForm.vue';
import FileUploadCard from '~/components/card/FileUploadCard.vue';
import TimezoneSelector from '~/components/select/TimezoneSelector.vue';
import { NO_NEED_TO_INIT_PROVIDERS } from '~/utils/constants';
import {
	CONFIRM_ACTION,
	ADD_TO_MESSAGE_QUEUE,
	ADD_TO_CLOSING_QUEUE,
	CUSTOM_CONFIRM_ACTION,
	CONFIRM_ERROR,
} from '~/store';
import { IAsset } from '~/types/asset/types';
import BugReportCard from '~/components/card/BugReportCard.vue';
import DropdownButton from '~/components/button/DropdownButton.vue';
import Button from '~/components/button/Button.vue';
import UploadSheet from '~/components/sheet/UploadSheet.vue';
import {
	DELETE_MANUAL_IMPORTED_TRANSACTIONS_ALL,
	SET_CREATED_TRANSACTION,
	SET_MANUAL_IMPORTED_TRANSACTION,
	SET_MANUAL_UPDATED_TRANSACTION,
} from '~/store/transaction';
import { makeNewTransaction } from '~/utils/application';
import { futureTimeChecker, tzAddedDate } from '~/utils/date';
import { ITransactionCSVSchema } from '~/types/csv-schema/types';
import { IFileImportDTO, IManualFormImportDTO, ITemplateImportDTO, IWalletImportDTO } from '~/types/import/dto';
import { LOAD_DEFAULT_IMPORT_GUIDE } from '~/store/content';
import { isThisAsset } from '~/utils/provider';
import { FileService } from '~/services/FileService';

export enum EImport {
	AUTO = 'AUTO',
	FILE = 'FILE',
	MANUAL = 'MANUAL',
	TEMPLATE = 'TEMPLATE',
}

@Component({
	components: {
		TimezoneSelector,
		ProviderSelectionCard,
		ImportNavCard,
		ApiSyncForm,
		UploadedFileList,
		ImportByLoginSheet,
		ImportCard,
		WalletImportForm,
		FileUploadCard,
		BugReportCard,
		DropdownButton,
		Button,
		UploadSheet,
		TransactionsTable,
	},
})
export default class ImportDialog extends Vue {
	@Prop({ required: true }) dialog!: boolean;
	@Prop() injectedProvider!: ITransactionRecordProvider | IAsset;
	@Prop() fixedImportType!: EImport | undefined;

	@State(state => state.timeZoneLists) timeZoneLists!: ITimeZone[];
	@State(({ provider }) => provider.providers) providers!: ITransactionRecordProvider[];
	@State(({ transaction }) => transaction.manualImportedTransactions) manualImportedTransactions!: ITransactionRecord[];
	@State(({ transaction }) => transaction.importedTransaction) importedTransaction!: ITransactionRecord;

	EImport = EImport;
	EManualSubmitType = EManualSubmitType;
	ERecommandedImportMethod = ERecommandedImportMethod;
	EImportGuideType = EImportGuideType;
	EProviderTypeFilter = EProviderTypeFilter;
	TransactionRecordProviderType = TransactionRecordProviderType;
	SourceType = SourceType;
	tab: number = 0;
	importType: EImport | null = null;
	selectedProvider: ITransactionRecordProvider | IAsset | null = null;
	customProvider: ITransactionRecordProvider | null = null;
	providerInputs: any[] = []; // CSV Import
	uploadedTemplateFiles: File[] = []; // Template Import
	templateTimezone: ITimeZone | null = null;
	manualTimezone: ITimeZone | null = null;
	fileTimezone: ITimeZone | null = null;
	walletImportDatas: IWalletImportDTO[] = [];
	bugReport: boolean = false;
	importTexts: any = {
		auto: 'Auto import',
		file: 'Import file',
		manual: 'Fill out form',
		template: 'Use template',
	};

	uploadingFile: boolean = false;
	providerSchemas: ITransactionCSVSchema[] = [];
	manuallyAdded: boolean = false;
	initTrigger: boolean = false;
	reservedAction: () => any = () => {};

	@Watch('dialog')
	watchDialog(newVal: boolean) {
		if (newVal) {
			this.init();
			// this.reimportProvider && this.selectProvider(this.reimportProvider);
			this.injectedProvider && this.selectProvider(this.injectedProvider);
			this.$store.dispatch(`content/${LOAD_DEFAULT_IMPORT_GUIDE}`);
		} else {
			this.$store.commit(`transaction/${SET_CREATED_TRANSACTION}`, null);
			this.$store.commit(`transaction/${SET_MANUAL_UPDATED_TRANSACTION}`, null);
			this.$store.commit(`transaction/${SET_MANUAL_IMPORTED_TRANSACTION}`, null);
			this.$store.commit(`transaction/${DELETE_MANUAL_IMPORTED_TRANSACTIONS_ALL}`);
		}
	}

	@Watch('selectedProvider')
	watchSelectedProvider(newVal: ITransactionRecordProvider | IAsset | null) {
		if (!newVal) return;

		if (NO_NEED_TO_INIT_PROVIDERS.includes(newVal?.slug || '')) {
			this.fileTimezone = null;
		} else {
			const currentUserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			this.fileTimezone = this.timeZoneLists.filter(v => v.name === currentUserTimezone)[0];
		}

		if (newVal && !isThisAsset(newVal)) {
			const provider: ITransactionRecordProvider = newVal;
			const tempArr = provider?.label
				? provider.label.split(', ')
				: this.providerSchemas.map((_, index) => `label ${index + 1}`);
			this.providerInputs = tempArr.map(v => ({ label: v, files: [] }));
		} else {
			this.providerInputs = [];
		}
	}

	get importingTitle(): string {
		if (this.isCustomProvider) {
			return `Manually Import from ${this.selectedProvider && this.selectedProvider?.name}`;
		} else {
			return `Import from ${this.selectedProvider?.name}`;
		}
	}

	get importMethodTitle(): any {
		if (isThisAsset(this.selectedProvider)) {
			// blockchain
			return this.$t('page.import.addressImporting');
			// @ts-ignore
		} else if (this.selectedProvider?.type === TransactionRecordProviderType.WALLET) {
			// wallet
			return this.$t('page.import.addressImporting');
		} else {
			const target: ITransactionRecordProvider | null = this.selectedProvider;
			return target?.isLoginImportEnabled ? this.$t('page.import.loginImporting') : this.$t('page.import.apiImporting');
		}
	}

	get isCustomProvider(): boolean {
		if (!this.selectedProvider) return false;
		return 'type' in this.selectedProvider && this.selectedProvider.type === TransactionRecordProviderType.CUSTOM;
	}

	get importTypes(): IProductMenuList[] {
		if (!this.selectedProvider) return [];

		const result: IProductMenuList[] = [];

		const AUTO = {
			color: 'primaryLight',
			text: this.importTexts.auto,
			onclick: () => {
				this.changeImportType(EImport.AUTO);
			},
		};
		const FILE = {
			color: 'primaryLight',
			text: this.importTexts.file,
			onclick: () => {
				this.changeImportType(EImport.FILE);
			},
		};
		const MANUAL = {
			color: 'primaryLight',
			text: this.importTexts.manual,
			onclick: () => {
				this.changeImportType(EImport.MANUAL);
				this.onClickManualForm();
			},
		};
		const TEMPLATE = {
			color: 'primaryLight',
			text: this.importTexts.template,
			onclick: () => {
				this.changeImportType(EImport.TEMPLATE);
			},
		};

		if (isThisAsset(this.selectedProvider)) {
			result.push(AUTO);
		} else {
			const provider: ITransactionRecordProvider = this.selectedProvider;
			if (
				provider?.type === TransactionRecordProviderType.WALLET ||
				provider?.isAPIImportEnabled ||
				provider?.isLoginImportEnabled
			) {
				result.push(AUTO);
			}
			if (provider?.isCSVImportEnabled) {
				result.push(FILE);
			}
		}

		result.push(TEMPLATE);
		result.push(MANUAL);

		return result;
	}

	onDeleteTemplateFile(idx: number) {
		this.uploadedTemplateFiles.splice(idx, 1);
	}

	onClickManualForm() {
		this.$store.commit(`transaction/${SET_MANUAL_UPDATED_TRANSACTION}`, null);
		this.$store.commit(`transaction/${SET_MANUAL_IMPORTED_TRANSACTION}`, makeNewTransaction());
	}

	onCancelCreate() {
		this.$store.commit(`transaction/${SET_MANUAL_IMPORTED_TRANSACTION}`, null);
	}

	onCancelUpdate() {
		this.$store.commit(`transaction/${SET_MANUAL_UPDATED_TRANSACTION}`, null);
	}

	changeImportType(importType: EImport | null) {
		this.importType = importType;
	}

	closeBugReporter() {
		this.bugReport = false;
	}

	openBugReporter() {
		this.bugReport = true;
	}

	closeDialog(doNotAsking: boolean = false) {
		this.initTrigger = !this.initTrigger;
		this.reservedAction = () => {};

		if (doNotAsking || this.manualImportedTransactions.length === 0) {
			this.$emit('close');
			return;
		}

		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.areYouSure'),
			text: this.$t('message.confirmClosing'),
			pending: () => {
				this.$emit('close');
			},
		});
	}

	timeZone(timezoneInput: ITimeZone | null): string | null {
		if (isThisAsset(this.selectedProvider)) {
			return timezoneInput?.format || null;
		} else {
			const target: ITransactionRecordProvider | null = this.selectedProvider;
			if (target && target.timestampTimeZone) {
				if (target.timestampTimeZone === 'USER_TIMEZONE') {
					return timezoneInput?.format || null;
				}
				return target.timestampTimeZone;
			}
			return null;
		}
	}

	onChangeTemplateTimezone(timezone: ITimeZone) {
		this.templateTimezone = timezone;
	}

	onChangeManualTimezone(timezone: ITimeZone) {
		this.manualTimezone = timezone;
	}

	onChangeFileTimezone(timezone: ITimeZone) {
		this.fileTimezone = timezone;
	}

	isThisAsset = (provider: ITransactionRecordProvider | IAsset) => isThisAsset(provider);

	init() {
		this.$store.commit(`provider/${ON_CHANGE_SEARCH_TEXT}`, '');
		this.onClickManualForm();
		this.walletImportDatas = [];
		this.providerInputs = [];
		this.uploadedTemplateFiles = [];
		this.importType = null;
		this.selectedProvider = null;
		this.templateTimezone = null;
		this.fileTimezone = null;
	}

	onClickPrev() {
		this.selectedProvider = null;
		this.providerInputs = [];
		this.uploadedTemplateFiles = [];
		this.closeBugReporter();
		this.reservedAction = () => {};
	}

	// every provider selections are come here
	async selectProvider(provider: ITransactionRecordProvider | IAsset) {
		this.importType = null;
		this.tab = 0;
		if (isThisAsset(provider)) {
			this.importType = EImport.AUTO;
		} else {
			const transactionProvider: ITransactionRecordProvider = provider;
			const autoEnable: boolean = Boolean(
				transactionProvider.isAPIImportEnabled ||
					transactionProvider.isLoginImportEnabled ||
					transactionProvider.type === TransactionRecordProviderType.WALLET,
			);
			const fileEnable: boolean = Boolean(transactionProvider.isCSVImportEnabled);
			if (autoEnable) {
				this.importType = EImport.AUTO;
			} else if (fileEnable) {
				this.importType = EImport.FILE;
			} else {
				this.importType = EImport.TEMPLATE;
			}

			if (transactionProvider.recommendedImportMethod) {
				if (
					transactionProvider.recommendedImportMethod === ERecommandedImportMethod.OAUTH2 ||
					transactionProvider.recommendedImportMethod === ERecommandedImportMethod.API_KEY ||
					transactionProvider.recommendedImportMethod === ERecommandedImportMethod.PUBLIC_ADDRESS
				) {
					this.importType = EImport.AUTO;
				} else if (transactionProvider.recommendedImportMethod === ERecommandedImportMethod.CSV) {
					this.importType = EImport.FILE;
					this.tab = autoEnable ? 1 : 0;
				} else {
					this.importType = EImport.TEMPLATE;
					if (autoEnable && fileEnable) {
						this.tab = 2;
					} else if ((autoEnable && !fileEnable) || (!autoEnable && fileEnable)) {
						this.tab = 1;
					}
				}
			}
		}

		!this.isCustomProvider && (await this.$store.dispatch(`provider/${GET_PROVIDER_SCHEMAS}`, provider?.id));
		this.selectedProvider = provider;
	}

	async grabTemplateFiles(files: FileList) {
		const fileArr = fileListToArr(files);
		const fileService = new FileService(fileArr, ['csv']);
		const cointelliFiles: boolean[] = await fileService.cointelliTemplate();

		if (cointelliFiles.includes(false)) {
			this.$store.commit(CONFIRM_ERROR, {
				title: 'Warning',
				text: 'You have to upload Cointelli’ template. Please check again.',
			});
			return;
		}
		this.uploadedTemplateFiles.push(...fileArr);
	}

	async grabFiles(files: FileList, index: number) {
		const fileArr = fileListToArr(files);
		const fileService = new FileService(fileArr, ['csv']);
		const cointelliFiles: boolean[] = await fileService.cointelliTemplate();

		if (cointelliFiles.includes(true)) {
			this.$store.commit(CONFIRM_ERROR, {
				title: 'Warning',
				text: 'Cointelli’ template was detected. Please upload the file received from the exchange.',
			});
			return;
		}
		this.providerInputs[index].files.push(...fileArr);
	}

	deleteUploadedFile(index: number) {
		this.providerInputs[index].files = [];
	}

	importFiles() {
		// upload data to the server
		const files: File[] = [];
		this.providerInputs.forEach(v => {
			files.push(...v.files);
		});
		if (files.length === 0) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('rules.required', { target: this.$t('product.file') }),
			});
			return;
		}

		if (!this.timeZone(this.fileTimezone)) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('rules.required', { target: this.$t('product.timezone') }),
			});
			return;
		}

		const providerId: number = this.selectedProvider?.id || 0;
		this.fileImport(providerId, files);
	}

	async fileImport(providerId: number, files: File[]) {
		const DTO: IFileImportDTO = {
			providerId,
			timezone: this.timeZone(this.fileTimezone) || '',
			files,
		};

		this.reservedAction = () => {
			this.closeDialog(true);
		};

		this.uploadingFile = true;
		const messageId = await this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
			msg: 'Uploading...',
			color: 'primary',
			manual: true,
		});

		await this.$store.dispatch(`import/${FILE_IMPORT_S3}`, DTO);

		this.uploadingFile = false;
		this.$store.dispatch(ADD_TO_CLOSING_QUEUE, messageId);
		this.reservedAction();

		this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
	}

	onClickDownloadTemplate() {
		// window.open(
		// 	'https://docs.google.com/spreadsheets/d/1X5qqVUe21WGIasAGh3bVslCnDDWAGFaCtxJ0H-z4mNM/copy',
		// 	'Cointelli template',
		// 	'top=0,left=0,width=500,height=600',
		// );
		window.open('https://docs.google.com/spreadsheets/d/1X5qqVUe21WGIasAGh3bVslCnDDWAGFaCtxJ0H-z4mNM/copy', '_blank');
	}

	async manualFormImportAction(payload: IManualFormImportDTO) {
		this.reservedAction = () => {
			this.closeDialog(true);
		};
		if (this.isCustomProvider) {
			// Custom(Non-exist) Provider Import
			payload.sourceName = this.selectedProvider?.name;
			const success: boolean = await this.$store.dispatch(`import/${MANUAL_FORM_IMPORT_CUSTOM}`, payload);
			if (success) {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
					color: 'successDark',
					msg: this.$i18n.t('message.success.save'),
				});
			} else {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$i18n.t('message.fail.save') });
			}
		} else {
			// Exist Provider Import
			if (isThisAsset(this.selectedProvider)) {
				// @ts-ignore
				payload.assetSymbol = this.selectedProvider.symbol;
			} else {
				// @ts-ignore
				payload.providerId = this.selectedProvider.id;
			}
			const success: boolean = await this.$store.dispatch(`import/${MANUAL_FORM_IMPORT}`, payload);
			if (success) {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
					color: 'successDark',
					msg: this.$i18n.t('message.success.save'),
				});
			} else {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$i18n.t('message.fail.save') });
			}
		}
		this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
		this.reservedAction();

		this.$emit('manualFormCallback');
	}

	manualFormImport() {
		if (this.manualImportedTransactions.length === 0) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$t('message.atLeastOneTransaction') });
			return;
		}
		if (!this.selectedProvider) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Provider is not selected' });
			return;
		}
		const timezone = this.manualTimezone?.format;

		if (!timezone) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('rules.required', { target: this.$t('product.timezone') }),
			});
			return;
		}
		const checkList: boolean[] = this.manualImportedTransactions.map(transaction => {
			return futureTimeChecker(transaction.tempTimeStamp || '', timezone);
		});
		if (checkList.includes(false)) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('rules.futureTimestamp'),
			});
			return;
		}
		const timezoneAdded = this.manualImportedTransactions.map(v => ({
			...v,
			timestamp: tzAddedDate(v?.timestamp || '', timezone),
		}));
		const payload: IManualFormImportDTO = { data: timezoneAdded };

		const data: IConfirmation = {
			dialog: true,
			title: 'Ready to proceed?',
			text: 'Have you saved it? If not, it will not be imported. Click “continue” if you have checked everything.',
			btnText: this.$t('common.continue'),
			cancelBtn: true,
			pending: () => this.manualFormImportAction(payload),
		};

		this.$store.commit(CUSTOM_CONFIRM_ACTION, data);
	}

	async importManualTemplate() {
		this.reservedAction = () => {
			this.closeDialog(true);
		};
		if (this.uploadedTemplateFiles.length === 0) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('rules.required', { target: this.$t('product.file') }),
			});
			return;
		}
		if (!this.templateTimezone) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('rules.required', { target: this.$t('product.timezone') }),
			});
			return;
		}

		const params: ITemplateImportDTO = { timezone: this.templateTimezone.format, files: this.uploadedTemplateFiles };
		this.uploadingFile = true;
		const messageId = await this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
			msg: 'Uploading...',
			color: 'primary',
			manual: true,
		});

		if (this.isCustomProvider) {
			// Custom(Non-exist) Provider Import
			params.sourceName = this.selectedProvider?.name;
			this.uploadedTemplateFiles = [];
			await this.$store.dispatch(`import/${CUSTOM_TEMPLATE_IMPORT_S3}`, params);
		} else {
			// Exist Provider Import
			if (isThisAsset(this.selectedProvider)) {
				const asset: IAsset | null = this.selectedProvider;
				params.assetSymbol = asset?.symbol || '';
			} else {
				params.providerId = this.selectedProvider?.id || 0;
			}
			this.uploadedTemplateFiles = [];
			await this.$store.dispatch(`import/${TEMPLATE_IMPORT_S3}`, params);
		}
		this.uploadingFile = false;
		this.$store.dispatch(ADD_TO_CLOSING_QUEUE, messageId);
		this.reservedAction();
		this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
	}

	onClickAddWalletImportInput() {
		const temp: IWalletImportDTO = { symbol: '', address: '' };
		this.walletImportDatas.push(temp);
	}

	removeWalletImportLine(idx: number) {
		this.walletImportDatas.splice(idx, 1);
	}

	destroyed() {
		this.closeDialog(true);
	}
}
</script>

<style lang="scss" scoped>
@mixin transition {
	transition: all 0.2s ease-in-out;
}

.cardWrapper {
	background-color: $white;
	text-align: left;

	.providerTitle {
		display: flex;
		gap: 4px;
		color: $primary;
		align-items: center;

		font-size: 18px;
		font-family: $poppins;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 33px;
			transform: translateX(-16px);
		}
	}

	.period {
		font-size: 16px;
		font-family: $roboto;
		color: $primary;
		margin-top: 8px;
	}

	.tzAndButtonWrapper {
		margin-top: 20px;
		display: grid;
		gap: 20px;
		&.-tz {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		&.-right {
			width: 100%;
			margin-left: auto;
			@media (min-width: #{$breakpoint-xl}) {
				width: 50%;
			}
		}
	}
}

.contentsWrapper {
	height: 100%;
	@media (min-width: #{$breakpoint-xl}) {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: 24px;
	}

	.actionContent {
		font-family: $poppins;
		font-size: 16px;
		position: relative;
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 5 / span 5;
		}

		.manualImportHeader {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.siwtchingButton {
			position: absolute;
			width: max-content;
			bottom: 0;
			left: 0;
		}
	}
	.navContent {
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 7 / span 7;
		}
	}

	&.-hide-nav {
		.actionContent {
			grid-column: span 12 / span 12;
		}
		.navContent {
			display: none;
		}
	}
}
.absoluteBugReport {
	position: absolute;
	right: 0;
	top: 0;
	height: 100%;
	padding: 12px;
	justify-content: flex-end;
	z-index: 123;
	width: fit-content;
	// overflow-y: scroll;
}

.nextStepIcon {
	padding-left: 24px;
}

.templateImportStep {
	position: relative;
	border-radius: $round-xs;
	padding: 24px;
	color: $primary;
	letter-spacing: 0.25px;
	border: 1px solid $outline;

	> span {
		font-family: $poppins;
		font-weight: $font-bold;
		font-size: 14px;
		line-height: 1.3;
		display: block;
	}

	> p {
		font-size: 14px;
		margin-top: 4px;
		line-height: 1.4;
	}

	.roundedButton {
		border-radius: 50%;
		cursor: pointer;
		background-color: $primary;
		width: 46px;
		height: 46px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		right: 36px;
		top: 50%;
		transform: translateY(-50%);
		@include transition();
		&:hover {
			background-color: $secondary;
		}
	}
}
</style>
