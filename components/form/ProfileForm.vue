<template>
	<div>
		<v-form ref="form" v-model="formValid" @submit.prevent="onSubmitForm">
			<AlertCard v-if="errorMsg && !formValid" :msg="errorMsg" color="error" icon="mdi-alert-circle-outline" />

			<div class="formContentWrapper -sixLines">
				<v-text-field
					v-model.trim="firstName"
					:disabled="!editMode || loading"
					maxlength="40"
					hide-details="auto"
					outlined
					:label="$t('page.profile.firstName')"
					class="grid-col-3"
					required
				/>
				<v-text-field
					v-model.trim="lastName"
					:disabled="!editMode || loading"
					maxlength="40"
					hide-details="auto"
					outlined
					:label="$t('page.profile.lastName')"
					class="grid-col-3"
					required
				/>

				<v-text-field v-model.trim="email" hide-details="auto" outlined label="Email" class="grid-col-6" disabled>
					<template #append>
						<span class="verifyingChip">
							<Chip v-if="verified" icon="mdi-check" color="successLight" fontcolor="successDark">
								{{ $t('page.profile.verified') }}
							</Chip>
							<Chip v-else icon="mdi-alert" color="successLight" fontcolor="successDark">
								{{ $t('page.profile.verified') }}
							</Chip>
						</span>
					</template>
				</v-text-field>

				<CountrySelector
					v-model="phoneCountry"
					:clearable="true"
					:disabled="!editMode || loading"
					text-key="name"
					shown-key="phone"
					value-key="code"
					class="grid-col-2"
					@change="v => (phoneCountry = v)"
				/>

				<PhoneInput
					v-model="phoneNumber"
					:label="`${$t('page.profile.myPhone')} (optional)`"
					:disabled="!editMode || loading"
					class="grid-col-4"
					@change="v => (phoneNumber = v)"
				/>

				<!-- for Accountant -->
				<div v-if="isAccountant" class="grid-col-6 formContentWrapper -sixLines">
					<v-text-field
						v-model="companyName"
						:disabled="!editMode || loading"
						maxlength="100"
						hide-details="auto"
						outlined
						:label="`${$t('page.profile.companyName')} (optional)`"
						class="grid-col-6"
					/>
					<v-select
						v-model="profession"
						hide-details="auto"
						outlined
						:disabled="!editMode || loading"
						clearable
						:items="professionOptions"
						:label="`${$t('page.profile.profession')} (optional)`"
						class="grid-col-6"
						@change="initProfessionInput"
					/>
					<v-autocomplete
						v-if="profession === EProfession.CPA || profession === EProfession.LAWYER"
						v-model="licenseState"
						maxlength="100"
						:items="states"
						item-text="name"
						item-value="abbr"
						outlined
						clearable
						hide-details="auto"
						:disabled="!editMode || loading"
						hide-no-data
						:label="$t('page.profile.state')"
						class="grid-col-3"
					/>
					<v-text-field
						v-if="profession === EProfession.CPA || profession === EProfession.LAWYER"
						v-model="licenseNumber"
						:disabled="!editMode || loading"
						maxlength="100"
						hide-details="auto"
						outlined
						:label="$t('page.profile.licenseNumber')"
						class="grid-col-3"
					/>
					<v-text-field
						v-if="profession === EProfession.EA"
						v-model="eaNumber"
						:disabled="!editMode || loading"
						maxlength="100"
						hide-details="auto"
						outlined
						:label="$t('page.profile.eaNumber')"
						class="grid-col-6"
					/>
					<v-text-field
						v-if="profession === EProfession.OTHER"
						v-model="professionOther"
						:disabled="!editMode || loading"
						maxlength="100"
						hide-details="auto"
						outlined
						class="grid-col-6"
					/>
				</div>
				<!-- /for Accountant -->
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
				&nbsp;
				<Button
					:rounded="true"
					fontcolor="white"
					:loading="loading"
					:disabled="loading || !editMode"
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
	</div>
</template>

<script lang="ts">
import { Component, State, Mutation, Vue, Getter } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import Chip from '../chip/Chip.vue';
import CountrySelector from '../select/CountrySelector.vue';
import PhoneInput from '../input/PhoneInput.vue';
import CardButton from '~/components/button/CardButton.vue';
import { ICognitoUserExt, EIdentityType, IAttributes } from '~/types/auth/types';
import { RETRIEVE_ME, UPDATE_ATTRIBUTES } from '~/store/auth';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import AlertCard from '~/components/card/AlertCard.vue';
import { NUMBER_ONLY_PATTERN, onlyNumberRule } from '~/utils/rules';
import { blurEveryInputs } from '~/utils/dom';
const us = require('us');

export enum EProfession {
	CPA = 'CPA', // State, license number
	EA = 'EA', // EA number
	LAWYER = 'Lawyer', // State, license number
	OTHER = 'other', // Blank
}

@Component({
	components: {
		CardButton,
		AlertCard,
		Button,
		Chip,
		CountrySelector,
		PhoneInput,
	},
})
export default class ProfileForm extends Vue {
	$refs!: {
		form: HTMLFormElement;
		autocomplete: any;
	};

	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;

	states = us.STATES;
	NUMBER_ONLY_PATTERN = NUMBER_ONLY_PATTERN;
	professionOptions = [EProfession.CPA, EProfession.EA, EProfession.LAWYER, EProfession.OTHER];
	EProfession = EProfession;
	EIdentityType = EIdentityType;

	errorMsg: string | any = '';
	formValid: boolean = false;
	// form
	email: string = '';
	firstName: string = '';
	lastName: string = '';
	phoneNumber: string = '';
	companyName: string = '';
	profession: string = '';
	licenseState: string = '';
	licenseNumber: string = '';
	eaNumber: string = '';
	professionOther: string = '';
	verified: boolean = true;
	loading: boolean = false;
	// form
	phoneRules = [(v: any) => onlyNumberRule(v, this.$nuxt)];
	phoneCountry: string = '';
	editMode: boolean = false;

	@Getter('auth/identityType') identityType!: EIdentityType;
	@Getter('auth/isAccountant') isAccountant!: boolean;
	@Getter('auth/userEmail') userEmail!: string | null;

	get submitData(): any {
		return {
			family_name: this.lastName,
			given_name: this.firstName,
			phone_number: this.phoneNumber ? `+${this.phoneNumber}` : null,
			'custom:phone_country': this.phoneCountry || null,
			'custom:company': this.companyName,
			'custom:professional_type': this.profession,
			'custom:license_state': this.licenseState,
			'custom:license_number': this.licenseNumber,
			'custom:ea_number': this.eaNumber,
			'custom:profession_other': this.professionOther,
		};
	}

	@Mutation(`${ADD_TO_MESSAGE_QUEUE}`) popSnack!: any;

	initProfessionInput() {
		this.licenseState = '';
		this.licenseNumber = '';
		this.eaNumber = '';
		this.professionOther = '';
	}

	onChangePhoneCountry() {
		this.$refs.autocomplete.blur();
	}

	// async sendEmailAlertOfUpdated() {
	// 	if (!this.userEmail) return;
	// 	await new EmailService(this.$store, EMAIL_ID_PROFILE_UPDATED, this.userEmail).sendEmail();
	// }

	async onSubmitForm() {
		if (this.formValid) {
			this.loading = true;
			this.errorMsg = '';
			const success: boolean = await this.$store.dispatch(`auth/${UPDATE_ATTRIBUTES}`, this.submitData);
			if (success) {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.update') });
				// this.sendEmailAlertOfUpdated();
			} else {
				await this.$store.dispatch(`auth/${RETRIEVE_ME}`);
				this.getCurrentCountry();
			}
			this.init();
			blurEveryInputs();
			this.loading = false;
		} else {
			this.errorMsg = String(this.$t('message.submitAlert'));
			this.$refs.form.validate();
		}
		this.editMode = false;
	}

	init() {
		// @ts-ignore
		const attributes: IAttributes = this.user.attributes;

		if (attributes) {
			this.email = attributes.email || '';
			this.verified = attributes.email_verified || this.identityType !== EIdentityType.COGNITO;
			this.firstName = attributes.given_name || '';
			this.lastName = attributes.family_name || '';
			this.phoneNumber = attributes.phone_number ? attributes.phone_number.replace('+', '') : '';
			this.companyName = attributes['custom:company'] || '';
			this.profession = attributes['custom:professional_type'] || '';
			this.licenseState = attributes['custom:license_state'] || '';
			this.licenseNumber = attributes['custom:license_number'] || '';
			this.eaNumber = attributes['custom:ea_number'] || '';
			this.professionOther = attributes['custom:profession_other'] || '';
		} else {
			this.errorMsg = this.$t('message.fail.fetch');
		}
	}

	getCurrentCountry() {
		this.phoneCountry = this.user?.attributes['custom:phone_country'] || '';
	}

	created() {
		this.init();
		this.getCurrentCountry();
	}
}
</script>

<style lang="scss" scoped>
.verifyingChip {
	position: absolute;
	right: 16px;
	top: 50%;
	transform: translateY(-50%);
}
</style>
