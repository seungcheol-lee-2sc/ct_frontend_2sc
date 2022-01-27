<template>
	<v-form ref="form" v-model="formValid" @submit.prevent="onSubmitForm">
		<AlertCard v-if="errorMsg && !formValid" :msg="errorMsg" color="error" icon="mdi-alert-circle-outline" />

		<div class="formContentWrapper">
			<div>
				<v-text-field
					v-model.trim="address"
					:disabled="!editMode || loading"
					maxlength="100"
					outlined
					:label="$t('page.profile.address')"
					hide-details="auto"
				/>
			</div>
			<div>
				<v-text-field
					v-model.trim="etc"
					:disabled="!editMode || loading"
					maxlength="100"
					outlined
					:label="$t('page.profile.aptEtc')"
					hide-details="auto"
				/>
			</div>
			<div>
				<v-text-field
					v-model.trim="city"
					:disabled="!editMode || loading"
					maxlength="100"
					outlined
					:label="$t('page.profile.city')"
					hide-details="auto"
				/>
			</div>
			<div>
				<v-text-field
					v-model.trim="state"
					:disabled="!editMode || loading"
					maxlength="100"
					outlined
					:label="$t('page.profile.state')"
					hide-details="auto"
				/>
			</div>

			<div>
				<CountrySelector
					v-model="country"
					:clearable="true"
					:disabled="!editMode || loading"
					:label="$t('page.profile.country')"
					text-key="name"
					shown-key="name"
					value-key="code"
					@change="
						v => {
							country = v;
						}
					"
				/>
			</div>
			<div>
				<v-text-field
					v-model.trim="zip"
					v-mask="'####################'"
					:disabled="!editMode || loading"
					outlined
					:label="$t('page.profile.zipPostal')"
					hide-details="auto"
				/>
			</div>
		</div>
		<div class="formBtnWrapper -wide">
			<Button
				:rounded="true"
				:color="editMode ? 'disabled' : 'primary'"
				:disabled="loading"
				:text="true"
				:height="44"
				:fontsize="14"
				@click="editMode = !editMode"
			>
				{{ $t('common.edit') }}
			</Button>
			<Button
				:rounded="true"
				fontcolor="white"
				:loading="loading"
				:disabled="!editMode || loading"
				color="primary"
				:width="122"
				:height="44"
				:fontsize="14"
				type="submit"
			>
				{{ $t('common.save') }}
			</Button>
		</div>
	</v-form>
</template>

<script lang="ts">
import { Component, State, Getter, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import CountrySelector from '../select/CountrySelector.vue';
import { UPDATE_ATTRIBUTES } from '~/store/auth';
import { ICognitoUserExt, IAttributes } from '~/types/auth/types';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import AlertCard from '~/components/card/AlertCard.vue';
import { blurEveryInputs } from '~/utils/dom';

@Component({
	components: {
		AlertCard,
		Button,
		CountrySelector,
	},
})
export default class AddressForm extends Vue {
	$refs!: {
		form: HTMLFormElement;
	};

	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;

	formValid: boolean = false;
	errorMsg: string | any = '';
	loading: boolean = false;
	editMode: boolean = false;

	address: string = '';
	etc: string = '';
	city: string = '';
	state: string = '';
	country: string = '';
	zip: string = '';

	@Getter('auth/isAccountant') isAccountant!: boolean;

	get submitData() {
		const data = {
			address: this.address,
			etc: this.etc,
			city: this.city,
			state: this.state,
			country: this.country,
			zip: this.zip,
		};

		return this.isAccountant
			? {
					'custom:address_accountant': JSON.stringify(data),
			  }
			: {
					address: JSON.stringify(data),
			  };
	}

	async onSubmitForm() {
		if (this.formValid) {
			this.loading = true;
			this.errorMsg = '';
			const res = await this.$store.dispatch(`auth/${UPDATE_ATTRIBUTES}`, this.submitData);
			res &&
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.update') });
			blurEveryInputs();
			this.loading = false;
			this.editMode = false;
		} else {
			this.errorMsg = String(this.$t('message.submitAlert'));
			this.$refs.form.validate();
		}
	}

	init() {
		// @ts-ignore
		const attributes: IAttributes = this.user.attributes;

		if (attributes) {
			let address = null;
			if (this.isAccountant && attributes['custom:address_accountant']) {
				address = JSON.parse(attributes['custom:address_accountant']);
			} else if (!this.isAccountant && attributes.address) {
				address = JSON.parse(attributes.address);
			}

			this.address = address?.address || '';
			this.etc = address?.etc || '';
			this.city = address?.city || '';
			this.state = address?.state || '';
			this.country = address?.country || '';
			this.zip = address?.zip || '';
		} else {
			this.errorMsg = this.$t('message.fail.fetch');
		}
	}

	created() {
		this.init();
	}
}
</script>

<style lang="scss" scoped>
.countrySelector {
	grid-column: span 2 / span 2;
}
</style>
