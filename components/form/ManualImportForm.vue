<template>
	<div ref="manualFormWrapper">
		<v-form v-if="transaction" id="manualForm" ref="form" v-model="formValid">
			<AlertCard v-if="errorMsg && !formValid" :msg="errorMsg" color="error" icon="mdi-alert-circle-outline" />
			<div class="titleText">{{ $t('product.required') }}</div>
			<div class="formWrapper">
				<div class="firstInner">
					<span>
						<DatetimePicker
							:disabled="loading"
							:init-switch="initSwitch"
							inner-class="datetimePicker"
							:value="transaction.tempTimeStamp"
							:required="true"
							@onchange="onChangeDatetime"
						/>
					</span>

					<!-- account -->
					<div>
						<template v-if="!editableProvider">
							<div
								v-if="!getProviderFromTransaction"
								class="providerWrapper"
								:class="provider && provider.iconImage ? '-pad' : ''"
							>
								<v-img
									v-if="provider && provider.iconImage"
									style="margin-right: 4px"
									:src="iconImage(provider.iconImage)"
									max-width="24"
								/>
								<div class="providerName">{{ provider && provider.name }}</div>
							</div>
							<v-text-field
								v-else
								outlined
								:value="transaction.batch && transaction.batch.source && transaction.batch.source.name"
								disabled
								filled
							/>
						</template>

						<PlatformSelector v-else :rules="requiredRules" :value="selectedPlatform" @onchange="onChangePlatform" />
					</div>
					<!-- /account -->

					<div class="categorySelector">
						<v-select
							v-model="transaction.category"
							:disabled="loading"
							:items="reformedCategories"
							item-text="text"
							item-value="value"
							:label="$t('product.category')"
							outlined
							hide-details
							:rules="requiredRules"
						/>
					</div>
				</div>
				<div class="secondInner">
					<div class="assets">
						<div class="assetItem">
							<div style="assetSelector">
								<AssetSelector
									v-model="transaction.outAsset"
									:label="$t('product.outCurrency')"
									:disabled="disableOut || loading"
									:filled="disableOut"
									:required="true"
									@onchange="onChangeOutAsset"
								/>
							</div>
							<v-text-field
								v-model="transaction.outQuantity"
								:disabled="disableOut || loading"
								:filled="disableOut"
								class="noArrow quantity"
								:label="$t('product.outQuantity')"
								outlined
								hide-details="auto"
								type="number"
								:min="0"
								step="0.00001"
								:rules="disableOut ? [true] : assetRules"
							/>
						</div>
						<div class="arrow">
							<v-icon>mdi-chevron-right</v-icon>
						</div>
						<div class="assetItem">
							<div class="assetSelector">
								<AssetSelector
									v-model="transaction.inAsset"
									:label="$t('product.inCurrency')"
									:disabled="disableIn || loading"
									:filled="disableIn"
									:required="true"
									@onchange="onChangeInAsset"
								/>
							</div>
							<v-text-field
								v-model="transaction.inQuantity"
								:disabled="disableIn || loading"
								:filled="disableIn"
								class="quantity noArrow"
								:label="$t('product.inQuantity')"
								outlined
								hide-details="auto"
								type="number"
								:min="0"
								step="0.00001"
								:rules="disableIn ? [true] : assetRules"
							/>
						</div>
					</div>

					<div>
						<v-text-field
							v-if="transaction.category === ETransactionCategory.TRADE"
							outlined
							:label="$t('product.type')"
							disabled
							filled
						/>
						<v-autocomplete
							v-else
							ref="typeAutocomplete"
							v-model.trim="transaction.type"
							:items="reformedTransactionTypes"
							item-text="label"
							item-value="type"
							outlined
							:label="$t('product.type')"
							hide-details="auto"
							:disabled="!transaction.category || transaction.category === ETransactionCategory.TRADE || loading"
							:filled="!transaction.category || transaction.category === ETransactionCategory.TRADE"
							:rules="requiredRules"
							@change="onChangeType"
						/>
					</div>
				</div>
			</div>

			<div class="detailText">{{ $t('product.details') }} (Optional)</div>
			<div class="detailInputsWrapper">
				<template v-if="feeType === EFeeType.NO">
					<v-select disabled outlined :label="$t('product.feeCurrency')" hide-details="auto" filled />
					<v-text-field disabled outlined :label="$t('product.feeQuantity')" hide-details="auto" filled />
				</template>
				<template v-if="feeType === EFeeType.OUT || feeType === EFeeType.BOTH">
					<AssetSelector
						v-model="transaction.outFeeAsset"
						:disabled="loading"
						:label="`${$t('product.feeCurrency')}${feeType === EFeeType.BOTH ? ' (out)' : ''}`"
						@onchange="onChangeOutFeeAsset"
					/>
					<v-text-field
						v-model="transaction.outFeeQuantity"
						outlined
						:disabled="loading"
						:label="`${$t('product.feeQuantity')}${feeType === EFeeType.BOTH ? ' (out)' : ''}`"
						hide-details="auto"
						class="noArrow"
						type="number"
						step="0.00001"
					/>
				</template>
				<template v-if="feeType === EFeeType.IN || feeType === EFeeType.BOTH">
					<AssetSelector
						v-model="transaction.inFeeAsset"
						:disabled="loading"
						:label="`${$t('product.feeCurrency')}${feeType === EFeeType.BOTH ? ' (in)' : ''}`"
						@onchange="onChangeInFeeAsset"
					/>
					<v-text-field
						v-model="transaction.inFeeQuantity"
						:disabled="loading"
						outlined
						:label="`${$t('product.feeQuantity')}${feeType === EFeeType.BOTH ? ' (in)' : ''}`"
						hide-details="auto"
						class="noArrow"
						type="number"
						step="0.00001"
					/>
				</template>
			</div>

			<div class="txIdWrapper">
				<template v-if="!makeNew">
					<template v-if="transaction.outTransactionHash">
						<v-text-field
							v-model="transaction.outTransactionHash"
							:disabled="loading"
							outlined
							label="Tx ID"
							hide-details="auto"
						/>
					</template>
					<template v-else-if="transaction.inTransactionHash">
						<v-text-field
							v-model="transaction.inTransactionHash"
							:disabled="loading"
							outlined
							label="Tx ID"
							hide-details="auto"
						/>
					</template>
					<template v-else-if="feeType === EFeeType.OUT || feeType === EFeeType.BOTH">
						<v-text-field
							v-model="transaction.outTransactionHash"
							:disabled="loading"
							outlined
							label="Tx ID"
							hide-details="auto"
						/>
					</template>
					<template v-else-if="feeType === EFeeType.IN">
						<v-text-field
							v-model="transaction.inTransactionHash"
							:disabled="loading"
							outlined
							label="Tx ID"
							hide-details="auto"
						/>
					</template>
				</template>
				<template v-else>
					<template v-if="feeType === EFeeType.OUT || feeType === EFeeType.BOTH">
						<v-text-field
							v-model="transaction.outTransactionHash"
							:disabled="loading"
							outlined
							label="Tx ID"
							hide-details="auto"
						/>
					</template>
					<template v-if="feeType === EFeeType.IN">
						<v-text-field
							v-model="transaction.inTransactionHash"
							:disabled="loading"
							outlined
							label="Tx ID"
							hide-details="auto"
						/>
					</template>
				</template>

				<v-text-field
					v-model="comment.comment"
					:disabled="loading"
					outlined
					:label="$t('product.comment')"
					hide-details="auto"
				/>
			</div>
			<div class="formBtnWrapper">
				<div class="buttonsInner">
					<TimezoneSelector
						v-if="selectableTimezone"
						:disabled="loading"
						:hide-details="true"
						:init-value="timezone"
						:dense="true"
						@onchange="onChangeTimezone"
					/>

					<Button :disabled="loading" :text="true" color="primary" :fontsize="14" @click="onClickCancel">
						{{ customCancelBtnText || $t('common.cancel') }}
					</Button>
					<Button
						:loading="loading"
						:disabled="loading"
						fontcolor="white"
						:fontsize="14"
						:rounded="true"
						color="primary"
						@click="onSubmitForm"
					>
						{{ $t('common.save') }}
					</Button>
				</div>
			</div>
		</v-form>
	</div>
</template>

<script lang="ts">
/* eslint-disable no-case-declarations */
import { Component, Getter, Prop, State, Vue, Watch } from 'nuxt-property-decorator';
import _ from 'lodash';
import Button from '../button/Button.vue';
import { DATETIME_FORMAT_OUR_APP } from '~/utils/constants';
import {
	ETransactionCategory,
	ETransactionType,
	IFlattenTransactionType,
	ITransactionRecord,
} from '~/types/transaction/types';
import { IPlatform, ITransactionRecordProvider } from '~/types/provider/types';
import AssetSelector from '~/components/select/AssetSelector.vue';
import { ITransactionRecordComment, TransactionRecordComment } from '~/types/transaction-comment/types';
import AlertCard from '~/components/card/AlertCard.vue';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import DatetimePicker from '~/components/select/DatetimePicker.vue';
import { EDatetimeInput, ITimeZone } from '~/types/common/types';
import TimezoneSelector from '~/components/select/TimezoneSelector.vue';
import { natureNumberRule, requiredRule } from '~/utils/rules';
import { firstCharUppercase } from '~/utils/string';
import { futureTimeChecker, tzAddedDate } from '~/utils/date';
import { getIconImage } from '~/utils/application';
import PlatformSelector from '~/components/select/PlatformSelector.vue';

export enum EManualSubmitType {
	IMPORT = 'IMPORT',
	CREATE = 'CREATE',
}

export enum EFeeType {
	IN = 'IN',
	OUT = 'OUT',
	NO = 'NO',
	BOTH = 'BOTH',
}

@Component({
	components: {
		DatetimePicker,
		AssetSelector,
		AlertCard,
		TimezoneSelector,
		PlatformSelector,
		Button,
	},
})
export default class ManualImportForm extends Vue {
	$refs!: {
		manualFormWrapper: HTMLElement;
		form: any;
		platformAutocomplete: any;
		typeAutocomplete: any;
	};

	@Prop({ required: true }) injectedTransaction!: ITransactionRecord;
	@Prop({ required: true }) utc!: boolean;
	@Prop({ required: true }) checkFuture!: boolean;
	@Prop({ required: true }) checkTimezone!: boolean;
	@Prop({ required: true }) watchFee!: boolean;
	@Prop({ required: true }) initSwitch!: boolean;
	@Prop({ required: true }) makeNew!: boolean;
	@Prop() provider!: ITransactionRecordProvider;
	@Prop() selectableTimezone!: boolean;
	@Prop() editableProvider!: boolean;
	@Prop() getProviderFromTransaction!: boolean;
	@Prop() customCancelBtnText!: string;
	@Prop() loading!: boolean;

	@State(state => state.timeZoneLists) timeZoneLists!: ITimeZone[];
	@State(({ transaction }) => transaction.transactionTypeArr) transactionTypeArr!: IFlattenTransactionType[];
	formValid: Boolean = false;
	errorMsg: string = '';
	timestamp: any = '';
	transaction: ITransactionRecord | null = null;
	disableIn: boolean = true;
	disableOut: boolean = true;
	feeType: EFeeType = EFeeType.NO;
	EManualSubmitType = EManualSubmitType;
	EFeeType = EFeeType;
	EDatetimeInput = EDatetimeInput;
	ETransactionCategory = ETransactionCategory;
	comment: ITransactionRecordComment = new TransactionRecordComment(undefined, '', null);
	requiredRules = [(v: any) => requiredRule(v)];
	assetRules = [(v: any) => requiredRule(v), (v: any) => natureNumberRule(v, this.$nuxt)];
	timezone: ITimeZone | null = null;
	selectedPlatform: IPlatform | null = null;

	@Watch('initSwitch', { immediate: true, deep: true })
	watchSwitch(newVal: boolean, oldVal: boolean) {
		if (typeof newVal !== 'boolean' || typeof oldVal !== 'boolean') return;
		this.resetAfterSubmit();
	}

	@Watch('transaction.category')
	watchTransactionCategory(category: string) {
		if (!this.transaction) return;

		if (category === ETransactionCategory.TRADE) {
			this.disableOut = false;
			this.disableIn = false;
			this.feeType = EFeeType.BOTH;
			this.setInitialValues(category, this.disableIn, this.disableOut);

			if (
				this.transaction.type !== ETransactionType.CONVERT &&
				this.transaction.type !== ETransactionType.BUY &&
				this.transaction.type !== ETransactionType.SELL &&
				this.transaction.type !== ETransactionType.SWAP
			) {
				this.transaction.type = ETransactionType.CONVERT;
			}
		} else if (category === ETransactionCategory.INCOMING) {
			this.disableOut = true;
			this.disableIn = false;
			this.feeType = EFeeType.IN;
			this.setInitialValues(category, this.disableIn, this.disableOut);
		} else if (category === ETransactionCategory.OUTGOING) {
			this.disableOut = false;
			this.disableIn = true;
			this.feeType = EFeeType.OUT;
			this.setInitialValues(category, this.disableIn, this.disableOut);
		} else {
			this.disableIn = true;
			this.disableOut = true;
			this.feeType = EFeeType.NO;
			this.setInitialValues(category, this.disableIn, this.disableOut);
		}

		this.$refs.form?.resetValidation();
	}

	@Watch('transaction.type')
	watchTransactionType(newType: string) {
		if (!this.transaction) return;

		if (this.transaction.category === ETransactionCategory.TRADE && this.watchFee) {
			this.feeType = newType === ETransactionType.BUY ? EFeeType.IN : EFeeType.OUT;
		}

		this.$refs.form?.resetValidation();
	}

	@Getter('transaction/transactionCategoryArr') transactionCategoryArr!: string[];

	get reformedCategories(): any[] {
		return this.transactionCategoryArr.map(v => ({
			value: v,
			text: firstCharUppercase(v),
		}));
	}

	get reformedTransactionTypes(): any[] {
		let tempCategory: string = '';
		const reformed = this.transactionTypeArr
			.filter(t => t.userSelectable && t.category === this.transaction?.category)
			.map(t => ({ ...t, newName: `${t.category} | ${t.label}`, group: t.category }))
			.sort((a, b) => (a.newName > b.newName ? 1 : -1));

		const headerAdded: any[] = [];
		reformed.forEach(v => {
			if (tempCategory !== v.category) {
				tempCategory = v.category;
				headerAdded.push({ divider: true });
				headerAdded.push({ header: v.category });
			}
			headerAdded.push(v);
		});

		return headerAdded;
	}

	onChangePlatform(platform: IPlatform) {
		this.selectedPlatform = platform;
	}

	onChangeType() {
		this.$refs.typeAutocomplete.blur();
	}

	onChangeTimezone(timezone: ITimeZone) {
		this.timezone = timezone;
	}

	onChangeDatetime(newDatetime: string) {
		if (this.transaction) {
			this.transaction.tempTimeStamp = newDatetime;
		}
	}

	setInitialValues(newCategory: string, disableIn: boolean, disableOut: boolean) {
		if (!this.transaction) return;

		const originCategory = this.injectedTransaction?.category || null;

		// In
		if (!disableIn) {
			this.transaction.inAsset = this.injectedTransaction?.inAsset || null;
			this.transaction.inQuantity = this.injectedTransaction?.inQuantity || null;
			this.transaction.inFeeAsset = this.injectedTransaction?.inFeeAsset || null;
			this.transaction.inFeeQuantity = this.injectedTransaction?.inFeeQuantity || null;
		} else {
			this.transaction.inAsset = null;
			this.transaction.inQuantity = null;
			this.transaction.inFeeAsset = null;
			this.transaction.inFeeQuantity = null;
		}

		// Out
		if (!disableOut) {
			this.transaction.outAsset = this.injectedTransaction?.outAsset || null;
			this.transaction.outQuantity = this.injectedTransaction?.outQuantity || null;
			this.transaction.outFeeAsset = this.injectedTransaction?.outFeeAsset || null;
			this.transaction.outFeeQuantity = this.injectedTransaction?.outFeeQuantity || null;
		} else {
			this.transaction.outAsset = null;
			this.transaction.outQuantity = null;
			this.transaction.outFeeAsset = null;
			this.transaction.outFeeQuantity = null;
		}

		// Type
		if (originCategory === newCategory) {
			this.transaction.type = this.injectedTransaction?.type;
		} else {
			this.transaction.type = undefined;
		}
	}

	tradeCategoryFilter(transaction: ITransactionRecord): ITransactionRecord {
		// if (category === trade) : type always be 'convert'
		return {
			...transaction,
			type: transaction.category === ETransactionCategory.TRADE ? ETransactionType.CONVERT : transaction.type,
		};
	}

	resetAfterSubmit() {
		const manualForm: HTMLFormElement | null = document.querySelector('form#manualForm');
		manualForm && manualForm.reset();
		this.initTransaction();
		this.errorMsg = '';
	}

	onClickCancel() {
		this.errorMsg = '';
		this.$refs.form?.resetValidation();
		this.initTransaction();
		this.$emit('cancel');
	}

	onSubmitForm() {
		// Required timestamp validation
		if (!this.transaction?.tempTimeStamp) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('rules.required', { taget: this.$t('product.date') }),
			});
			return;
		}

		let timezoneFormat = '+00:00';
		if (this.checkTimezone) {
			if (!this.timezone?.format) {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
					color: 'error',
					msg: this.$t('rules.required', { target: this.$t('product.timezone') }),
				});
				return;
			}
			timezoneFormat = this.timezone?.format || '';
		}

		const data: ITransactionRecord = {
			...this.transaction,
			inTotal: +(this.transaction.inSpotPrice || 0) * +(this.transaction.inQuantity || 0) || null,
			outTotal: +(this.transaction.outSpotPrice || 0) * +(this.transaction.outQuantity || 0) || null,
			inFeeTotal: +(this.transaction.inFeeSpotPrice || 0) * +(this.transaction.inFeeQuantity || 0) || null,
			outFeeTotal: +(this.transaction.outFeeSpotPrice || 0) * +(this.transaction.outFeeQuantity || 0) || null,
			timestamp: tzAddedDate(this.transaction?.tempTimeStamp, timezoneFormat),
			comments: [this.comment],
		};

		if (this.checkFuture) {
			// Future time validation
			const check = futureTimeChecker(this.transaction.tempTimeStamp || '', timezoneFormat);

			if (!check) {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
					color: 'error',
					msg: this.$t('rules.futureTimestamp'),
				});
				return;
			}
		}

		// Overall validation
		if (!this.formValid) {
			this.errorMsg = String(this.$t('message.submitAlert'));
			this.$refs.form?.validate();
			return;
		}

		// Same currency validation
		if (
			this.transaction?.inAsset &&
			this.transaction?.outAsset &&
			this.transaction?.inAsset === this.transaction?.outAsset
		) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('rules.sameCurrency'),
			});
			return;
		}

		this.$emit('onsubmit', data, this.selectedPlatform);
	}

	iconImage(iconImage: string) {
		return getIconImage(iconImage);
	}

	onChangeOutAsset(symbol: string) {
		if (this.transaction) {
			this.transaction.outAsset = symbol;
		}
	}

	onChangeInAsset(symbol: string) {
		if (this.transaction) {
			this.transaction.inAsset = symbol;
		}
	}

	onChangeInFeeAsset(symbol: string) {
		if (this.transaction) {
			this.transaction.inFeeAsset = symbol;
		}
	}

	onChangeOutFeeAsset(symbol: string) {
		if (this.transaction) {
			this.transaction.outFeeAsset = symbol;
		}
	}

	initTimestamp() {
		if (!this.transaction) return;
		if (!this.utc) {
			this.transaction.tempTimeStamp = this.injectedTransaction
				? this.$moment(this.injectedTransaction.timestamp).format(DATETIME_FORMAT_OUR_APP)
				: this.$moment(new Date()).format(DATETIME_FORMAT_OUR_APP);
		} else {
			this.transaction.tempTimeStamp = this.injectedTransaction
				? this.$moment.utc(this.injectedTransaction.timestamp).utc().format(DATETIME_FORMAT_OUR_APP)
				: this.$moment.utc(new Date()).utc().format(DATETIME_FORMAT_OUR_APP);
		}
	}

	initTransaction() {
		this.transaction = _.cloneDeep(this.injectedTransaction);
		if (!this.transaction) return;
		this.initTimestamp();
		this.comment =
			this.transaction.comments && this.transaction.comments.length > 0
				? this.transaction.comments[0]
				: new TransactionRecordComment(undefined, '', null);
	}

	created() {
		this.initTransaction();
		const found = this.timeZoneLists.find(v => v.name === 'UTC');
		this.timezone = found || null;
	}

	beforeDestroy() {
		this.onClickCancel();
	}
}
</script>

<style lang="scss" scoped>
#manualForm {
	padding-top: 32px;
	padding-bottom: 24px;

	.titleText {
		font-size: 15px;
		margin-bottom: 4px;
		color: $primaryLight;
		text-align: left;
	}

	.formWrapper {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(2, minmax(0, 1fr));

		.firstInner {
			display: flex;
			gap: 16px;
			flex-direction: column;
			@media (min-width: #{$breakpoint-xl}) {
				flex-direction: row;
				.datetimePicker {
					width: 208px;
				}
				.categorySelector {
					width: 170px;
				}
			}

			.providerWrapper {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-top: 4px;
				min-width: 140px;

				&.-pad {
					padding-top: 8px;
				}

				.providerName {
					font-size: 16px;
				}
			}
		}

		.secondInner {
			display: flex;
			gap: 16px;
			flex-direction: column;
			@media (min-width: #{$breakpoint-xl}) {
				flex-direction: row;
			}

			.assets {
				display: grid;
				grid-template-columns: repeat(11, minmax(0, 1fr));

				@media (min-width: #{$breakpoint-xl}) {
					width: 90%;
				}

				.assetItem {
					grid-column: span 5 / span 5;
					.assetSelector {
						margin-bottom: 8px;
					}
					.quantity {
						margin-top: 8px;
					}
				}

				.arrow {
					grid-column: span 1 / span 1;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
	}

	.detailText {
		margin-top: 20px;
		margin-bottom: 4px;
		font-size: 15px;
		color: $primaryLight;
		text-align: left;
	}

	.detailInputsWrapper {
		margin-top: 4px;
		display: grid;
		gap: 16px;
		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
	}

	.txIdWrapper {
		margin-top: 20px;
		display: grid;
		gap: 16px;
		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.buttonsInner {
		width: 100%;
		display: flex;
		gap: 8px;
		justify-content: flex-end;
	}
}
</style>
