<template>
	<v-form v-if="selectedProvider" ref="form" v-model="formValid" @submit.prevent="onSubmitForm">
		<AlertCard v-if="errorMsg && !formValid" :msg="errorMsg" color="error" icon="mdi-alert-circle-outline"></AlertCard>

		<div class="formContentWrapper -wide">
			<v-text-field v-model.trim="apiKey" outlined label="API Key" :rules="requiredRules" hide-details />
			<v-text-field
				v-if="selectedProvider.takeSecretKey === true"
				v-model.trim="apiSecret"
				outlined
				label="API Secret"
				:rules="requiredRules"
				hide-details
			/>
			<v-text-field
				v-if="selectedProvider.takePassphrase === true"
				v-model.trim="passphrase"
				outlined
				:label="label"
				:rules="requiredRules"
				hide-details
			/>

			<ImportNotice icon="mdi-shield-half-full">
				Please always use read-only keys. Importing read-only API keys ensures Cointelli cannot manage or transfer
				assets in your account.
			</ImportNotice>

			<TimezoneSelector
				v-if="selectedProvider.timestampTimeZone === 'USER_TIMEZONE'"
				:tooltip="$t('product.tooltip.timezone1')"
				:init-value="timeZoneInput"
				:is-user-timezone="true"
				@onchange="onChangeTimezone"
			/>
		</div>
		<div style="margin-top: 20px">
			<Button
				fontcolor="white"
				:disabled="!formValid || loading"
				:loading="loading"
				:block="true"
				:rounded="true"
				:height="52"
				color="primary"
				type="submit"
			>
				{{ $t('product.import') }}
			</Button>
		</div>
	</v-form>
</template>

<script lang="ts">
import { Component, State, Prop, Vue } from 'nuxt-property-decorator';
import ImportNotice from '../text/ImportNotice.vue';
import { LABEL_EXCEPTION_PROVIDERS } from '~/utils/constants';
import { ITransactionRecordProvider, IUserTransactionRecordSource } from '~/types/provider/types';
import { ITimeZone } from '~/types/common/types';
import { LOAD_PROVIDER_SOURCES } from '~/store/provider';
import { API_IMPORT } from '~/store/import';
import AlertCard from '~/components/card/AlertCard.vue';
import { requiredRule } from '~/utils/rules';
import Button from '~/components/button/Button.vue';

@Component({
	components: {
		AlertCard,
		Button,
		ImportNotice,
	},
})
export default class ApiSyncform extends Vue {
	$refs!: {
		form: HTMLFormElement;
	};

	@Prop({ required: true }) selectedProvider!: ITransactionRecordProvider;

	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ provider }) => provider.providerSources) providerSources!: IUserTransactionRecordSource[];
	@State(state => state.timeZoneLists) timeZoneLists!: ITimeZone;
	formValid: boolean = false;
	errorMsg: string = '';
	apiKey: string = '';
	apiSecret: string = '';
	passphrase: string = '';
	timeZoneInput: ITimeZone | null = null; // timeZone select
	requiredRules = [(v: any) => requiredRule(v)];
	loading: boolean = false;

	get label() {
		const slug: string = this.selectedProvider?.slug || '';
		const found = LABEL_EXCEPTION_PROVIDERS.find(v => v.slug === slug);
		return found ? found.label : 'Passphrase';
	}

	get timeZone(): string | null {
		if (this.selectedProvider && this.selectedProvider.timestampTimeZone) {
			if (this.selectedProvider.timestampTimeZone === 'USER_TIMEZONE') {
				return this.timeZoneInput?.format || null;
			}
			return this.selectedProvider.timestampTimeZone;
		}
		return null;
	}

	onChangeTimezone(timezone: ITimeZone) {
		this.timeZoneInput = timezone;
	}

	async onSubmitForm() {
		if (!this.formValid) {
			this.errorMsg = String(this.$t('message.submitAlert'));
			this.$refs.form.validate();
			return;
		}
		this.loading = true;
		this.$emit('callback');

		this.errorMsg = '';
		const data = {
			apiKey: this.apiKey,
			apiSecret: this.apiSecret,
			passphrase: this.passphrase,
			timestampTimeZone: this.timeZone,
		};

		await this.$store.dispatch(`import/${API_IMPORT}`, {
			id: this.selectedProvider.id,
			data,
		});
		this.loading = false;
		this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
	}
}
</script>
