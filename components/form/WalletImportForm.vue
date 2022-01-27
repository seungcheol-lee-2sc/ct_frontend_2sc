<template>
	<v-form v-if="selectedProvider" ref="form" v-model="formValid" @submit.prevent="onSubmitForm">
		<AlertCard v-if="errorMsg && !formValid" :msg="errorMsg" color="error" icon="mdi-alert-circle-outline" />

		<div class="formContentWrapper">
			<div
				v-for="(walletImportData, idx) in tempDatas"
				:key="`${walletImportData.symbol}-${idx}`"
				class="inputsWrapper"
			>
				<div class="assetInput">
					<AssetSelector
						v-model="walletImportData.symbol"
						:label="$t('product.currency')"
						:required="true"
						:only-coins="true"
						:disabled="Boolean(isThisAsset && walletImportData.symbol)"
						@onchange="symbol => onChangeAsset(symbol, idx)"
					/>
				</div>
				<v-text-field
					v-model.trim="walletImportData.address"
					class="addressInput"
					:class="hideMinus ? '-hideButton' : ''"
					outlined
					:label="$t('product.address')"
					hide-details
				/>

				<span v-if="!hideMinus" style="display: flex; align-items: center">
					<span style="cursor: pointer" @click="removeLine(idx)">
						<v-icon> mdi-minus-circle-outline </v-icon>
					</span>
				</span>
			</div>
		</div>

		<slot name="addButton"></slot>

		<div class="formBtnWrapper" style="margin-top: 20px">
			<Button
				:disabled="!formValid || loading || tempDatas.length === 0"
				:loading="loading"
				:rounded="true"
				:block="true"
				fontcolor="white"
				color="primary"
				:height="52"
				type="submit"
				:fontsize="16"
			>
				{{ $t('product.import') }}
			</Button>
		</div>
	</v-form>
</template>

<script lang="ts">
import { Component, Prop, State, Vue, Watch } from 'nuxt-property-decorator';
import _ from 'lodash';
import Button from '../button/Button.vue';
import { LOAD_PROVIDER_SOURCES } from '~/store/provider';
import { WALLETS_IMPORT } from '~/store/import';
import { ITransactionRecordProvider, IUserTransactionRecordSource } from '~/types/provider/types';
import { SYMBOL_REPLACED_COINS } from '~/utils/constants';
import AssetSelector from '~/components/select/AssetSelector.vue';
import AlertCard from '~/components/card/AlertCard.vue';
import { CONFIRM_ERROR, ADD_TO_MESSAGE_QUEUE } from '~/store';
import { requiredRule } from '~/utils/rules';
import { IAsset } from '~/types/asset/types';
import { IWalletImportDTO } from '~/types/import/dto';
import { isThisAsset } from '~/utils/provider';

@Component({
	components: {
		AssetSelector,
		AlertCard,
		Button,
	},
})
export default class WalletImportForm extends Vue {
	$refs!: {
		form: HTMLFormElement;
		empty: HTMLElement;
	};

	@Prop({ required: true }) datas!: IWalletImportDTO[];
	@Prop({ required: true }) selectedProvider!: ITransactionRecordProvider;
	@Prop() hideAppendButton!: boolean;

	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ provider }) => provider.providerSources) providerSources!: IUserTransactionRecordSource[];
	formValid: boolean = false;
	errorMsg: string = '';
	tempDatas: IWalletImportDTO[] = [];
	requiredRules = [(v: any) => requiredRule(v)];
	loading: boolean = false;

	@Watch('datas')
	watchDatas(newVal: any) {
		if (newVal.length > this.tempDatas.length) {
			const data: IWalletImportDTO = {
				symbol: '',
				address: '',
			};
			this.tempDatas.push(data);
		}
		this.isThisAsset && this.fixAsset();
	}

	get hideMinus(): boolean {
		return this.hideAppendButton || this.tempDatas.length <= 1;
	}

	get isThisAsset(): boolean {
		return isThisAsset(this.selectedProvider);
	}

	onChangeAsset(symbol: string, idx: number) {
		this.tempDatas[idx].symbol = symbol;
	}

	removeLine(idx: number) {
		this.tempDatas.splice(idx, 1);
		this.$emit('removeLine', idx);
	}

	async onSubmitForm() {
		if (!this.formValid) {
			this.errorMsg = String(this.$t('message.submitAlert'));
			this.$refs.form.validate();
			return;
		}

		const publicAddressNotFound = this.tempDatas.find(v => !v.address);
		if (publicAddressNotFound) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('rules.required', { target: this.$t('product.publicAddress') }),
			});
			return;
		}

		const symbolIsNotSelected = this.tempDatas.find(v => !v.symbol);
		if (symbolIsNotSelected) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('rules.required', { target: this.$t('product.symbol') }),
			});
			return;
		}

		if (this.tempDatas.length === 0) {
			this.$store.commit(CONFIRM_ERROR, { title: this.$t('common.error'), text: this.$t('message.noData') });
			return;
		}

		this.$emit('callback');

		this.errorMsg = '';
		const data = this.tempDatas.map(d => {
			return { assetSymbol: d.symbol, publicAddress: d.address };
		});

		this.loading = true;
		await this.$store.dispatch(`import/${WALLETS_IMPORT}`, {
			data,
		});
		this.loading = false;
		this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
	}

	fixAsset() {
		const propProvider: IAsset = this.selectedProvider;

		this.tempDatas = this.tempDatas.map(d => {
			const needToBeReplaced = SYMBOL_REPLACED_COINS.find(v => v.symbol === propProvider.symbol);
			if (needToBeReplaced) {
				return { ...d, symbol: needToBeReplaced.newSymbol || '' };
			} else {
				return { ...d, symbol: propProvider.symbol || '' };
			}
		});
	}

	created() {
		this.tempDatas = _.cloneDeep(this.datas);
		this.isThisAsset && this.fixAsset();
		if (this.tempDatas.length === 0) {
			this.$emit('init');
		}
	}
}
</script>

<style lang="scss" scoped>
.inputsWrapper {
	display: grid;
	gap: 16px;
	margin-bottom: 12px;
	grid-template-columns: repeat(12, minmax(0, 1fr));

	.assetInput {
		grid-column: span 4 / span 4;
	}

	.addressInput {
		grid-column: span 7 / span 7;

		&.-hideButton {
			grid-column: span 8 / span 8;
		}
	}
}
</style>
