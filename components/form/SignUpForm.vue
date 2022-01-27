<template>
	<v-form ref="form" v-model="formValid" @submit.prevent="onSubmitForm">
		<div class="wrapper540" style="text-align: center">
			<div style="position: relative">
				<h2 class="signingTitle" style="position: relative; z-index: 10">
					{{ $t('page.signUp.title3') }}
				</h2>
				<MovingObject :size="EMovingObjSize.XL" left="30px" top="-20px" :movement="EMoveType.BEAT" />
				<MovingObject :size="EMovingObjSize.S" left="5px" top="30px" :movement="EMoveType.BEAT" />
			</div>
		</div>
		<div class="wrapper540 formWrapper">
			<AlertCard v-if="errorMsg && !formValid" :msg="errorMsg" color="error" icon="mdi-alert-circle-outline" />

			<div v-if="isAccountant" class="twoColumns">
				<div>
					<v-text-field
						v-model.trim="signUpInfo.givenName"
						outlined
						:rules="requiredRules"
						required
						:label="$t('page.signUp.form.label5')"
						height="54"
						:disabled="signingLoading"
					/>
				</div>
				<div>
					<v-text-field
						v-model.trim="signUpInfo.familyName"
						outlined
						:rules="requiredRules"
						required
						:label="$t('page.signUp.form.label6')"
						height="54"
						:disabled="signingLoading"
					/>
				</div>
			</div>

			<div class="inputsWrapper">
				<div>
					<v-text-field
						v-model.trim="signUpInfo.username"
						outlined
						:rules="emailRules"
						required
						:label="$t('page.signUp.form.label1')"
						height="54"
						:disabled="signingLoading"
					/>
				</div>

				<div>
					<v-text-field
						v-model="signUpInfo.password"
						:rules="passwordRules"
						hide-details
						outlined
						:label="$t('page.signUp.form.label3')"
						height="54"
						required
						:append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
						:type="showPw ? 'text' : 'password'"
						:disabled="signingLoading"
						@keydown.tab.prevent="onTabPassword"
						@click:append="showPw = !showPw"
					/>

					<PasswordMessage :password="signUpInfo.password" :rules="passwordRules" :rule-messages="passwordRulesMsg" />
				</div>

				<div>
					<v-text-field
						id="passwordConfirm"
						v-model.trim="passwordConfirm"
						outlined
						:rules="[v => signUpInfo.password === passwordConfirm || 'The password and its confirmation do not match']"
						:label="$t('page.signUp.form.label4')"
						height="54"
						required
						:disabled="signingLoading"
						type="password"
					/>
				</div>

				<template v-if="isAccountant">
					<div>
						<v-text-field
							v-model="signUpInfo.company"
							:disabled="signingLoading"
							outlined
							:label="$t('page.signUp.form.label2')"
							height="54"
						/>
					</div>

					<div>
						<v-select
							v-model="signUpInfo.professionalType"
							:rules="requiredRules"
							:items="professionalTypes"
							outlined
							height="54"
							:disabled="signingLoading"
						/>
					</div>

					<div class="twoColumns" :class="signUpInfo.professionalType !== EProfessionalType.EA ? '' : '-merge'">
						<v-autocomplete
							v-if="signUpInfo.professionalType !== EProfessionalType.EA"
							v-model="signUpInfo.licenseState"
							:rules="requiredRules"
							:label="$t('page.signUp.form.label7')"
							:items="states"
							item-text="name"
							item-value="abbr"
							outlined
							clearable
							hide-no-data
							height="54"
							:disabled="signingLoading"
						/>

						<v-text-field
							v-model="signUpInfo.licenseNumber"
							:disabled="signingLoading"
							outlined
							:rules="requiredRules"
							:label="$t('page.signUp.form.label8')"
							height="54"
						/>
					</div>
				</template>

				<div class="checkboxWrapper">
					<span v-html="agreementText"></span>
				</div>
				<div class="checkboxWrapper">
					<Checkbox
						v-model="signUpInfo.subscribe"
						:disabled="signingLoading"
						color="secondary"
						@click="signUpInfo.subscribe = !signUpInfo.subscribe"
					/>
					{{ $t('page.signUp.form.check2') }}
				</div>
				<Button
					:rounded="true"
					:loading="signingLoading"
					:disabled="signingLoading"
					:block="true"
					color="primary"
					:height="52"
					type="submit"
					fontcolor="white"
				>
					{{ $t('page.signUp.form.btn') }}
				</Button>
			</div>
		</div>
	</v-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import Checkbox from '../input/Checkbox.vue';
import { EXECUTE_RECAPTCHA, SIGN_UP } from '~/store/auth';
import { DUPLICATED_EMAIL_CRITERIA, ISoftwareItem, MIN_PASSWORD } from '~/utils/constants';
import { EProfessionalType, ISignUp, SignUp } from '~/types/auth/types';
import AlertCard from '~/components/card/AlertCard.vue';
import { emailRule, pwLowercase, pwMin, pwNumeric, pwSpecialChar, pwUppercase, requiredRule } from '~/utils/rules';
import PasswordMessage from '~/components/text/PasswordMessage.vue';
import MovingObject, { EMovingObjSize, EMoveType } from '~/components/item/MovingObject.vue';
import { generateAgreementText, returnErrorMsg } from '~/utils/application';
import { OPEN_SIGNING_ERROR } from '~/store';

const us = require('us');

export const pwErrorMessages = (rules: any[], passwordText: string) => {
	return rules
		.map(v => v(passwordText))
		.filter(v => v !== true)
		.join(', ');
};

@Component({
	components: {
		PasswordMessage,
		AlertCard,
		MovingObject,
		Button,
		Checkbox,
	},
})
export default class SignUpForm extends Vue {
	$refs!: {
		form: HTMLFormElement;
		passwordConfirm: any;
	};

	@Prop({ required: true }) software!: ISoftwareItem | null;
	@Prop({ required: true }) isAccountant!: boolean;
	signUpInfo: ISignUp = new SignUp('', '', '', '', false, false, '', EProfessionalType.LAWYER, '', '', '');

	signingLoading: boolean = false;
	passwordConfirm: string = '';
	errorMsg: string = '';
	formValid: boolean = false;
	showPw: boolean = false;
	passwordRules = [
		(v: any) => pwMin(v, this.$nuxt),
		(v: any) => pwUppercase(v, this.$nuxt),
		(v: any) => pwLowercase(v, this.$nuxt),
		(v: any) => pwNumeric(v, this.$nuxt),
		(v: any) => pwSpecialChar(v, this.$nuxt),
	];

	passwordRulesMsg = [
		this.$t('rules.pwMin', { min: MIN_PASSWORD }),
		this.$t('rules.pwUppercase'),
		this.$t('rules.pwLowercase'),
		this.$t('rules.pwNumeric'),
		this.$t('rules.pwSpecialChar'),
	];

	requiredRules = [(v: any) => requiredRule(v)];
	emailRules = [(v: any) => requiredRule(v), (v: any) => emailRule(v, this.$nuxt)];
	EMovingObjSize = EMovingObjSize;
	EMoveType = EMoveType;
	EProfessionalType = EProfessionalType;
	professionalTypes: EProfessionalType[] = [EProfessionalType.LAWYER, EProfessionalType.EA, EProfessionalType.CPA];

	states = us.STATES;

	get agreementText(): any {
		return generateAgreementText(this, 'page.signUp.form.check1', 'link');
	}

	onSubmitForm() {
		if (this.formValid) {
			this.errorMsg = '';
			this.signUp();
		} else {
			this.errorMsg = String(this.$t('message.submitAlert'));
			this.$refs.form.validate();
		}
	}

	onTabPassword() {
		document.getElementById('passwordConfirm')?.focus();
	}

	async signUp() {
		this.signingLoading = true;
		this.signUpInfo.isAccountant = this.isAccountant;
		this.signUpInfo.software = this.software?.value || '';
		const recaptcha: boolean = await this.$store.dispatch(`auth/${EXECUTE_RECAPTCHA}`);
		if (!recaptcha) {
			this.signingLoading = false;
			return;
		}
		const res: string | boolean = await this.$store.dispatch(`auth/${SIGN_UP}`, this.signUpInfo);

		if (res === true) {
			this.signUpInfo = new SignUp('', '', '', '', true, false, '', EProfessionalType.LAWYER, '', '', '');
			this.passwordConfirm = '';
			this.$refs.form.reset();
			this.$emit('callback');
		} else {
			let text = returnErrorMsg(res);
			if (res && res.includes(DUPLICATED_EMAIL_CRITERIA)) {
				/** Duplicated sign up check */
				text = 'Your email has been already signed up. Please sign in by clicking social media buttons';
				this.$store.commit(OPEN_SIGNING_ERROR, { text, linkPath: '/user/sign-in', linkText: 'Go to sign in' });
			}
			this.$store.commit(OPEN_SIGNING_ERROR, { text, linkPath: '', linkText: '' });
		}
		this.signingLoading = false;
	}
}
</script>

<style lang="scss" scoped>
.formWrapper {
	margin-top: 56px;
	margin-bottom: 56px;

	.twoColumns {
		display: grid;
		gap: 12px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		@media (min-width: #{$breakpoint-xl}) {
			gap: 24px;
		}

		.-merge {
			grid-template-columns: repeat(1, minmax(0, 1fr));
		}
	}

	.inputsWrapper {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));

		@media (min-width: #{$breakpoint-xl}) {
			gap: 4px;
		}
	}
}
</style>
