<template>
	<div class="wrapper728 topBodyWrapper bottomBodyWrapper">
		<div
			v-if="status === EForgotPwStatus.READY || status === EForgotPwStatus.SENDED"
			class="forgotPasswordWrapper"
			style="padding: 16px"
		>
			<v-form ref="form" v-model="formValid" @submit.prevent="onSubmit">
				<h1 class="titleText">{{ $t('page.forgotPassword.title') }}</h1>
				<AlertCard
					v-if="errorMsg && !formValid"
					style="margin-top: 36px"
					:msg="errorMsg"
					color="error"
					icon="mdi-alert-circle-outline"
				/>

				<div style="margin-top: 36px" class="inputRow">
					<v-text-field
						id="forgot-password-email"
						v-model.trim="email"
						name="forgot-password-email"
						:disabled="status === EForgotPwStatus.SENDED"
						hide-details="auto"
						outlined
						:placeholder="$t('page.forgotPassword.placeholder1')"
						:rules="emailRules"
					/>
				</div>
				<div v-if="status === EForgotPwStatus.SENDED" class="inputRow">
					<v-text-field
						id="forgot-password-code"
						v-model.trim="code"
						name="forgot-password-code"
						hide-details="auto"
						outlined
						:label="$t('page.forgotPassword.placeholder2')"
						:rules="requiredRules"
					/>
				</div>
				<div v-if="status === EForgotPwStatus.SENDED">
					<div class="inputRow">
						<v-text-field
							id="forgot-password-newpassword"
							v-model="newPassword"
							name="forgot-password-newpassword"
							hide-details
							outlined
							:label="$t('page.forgotPassword.placeholder3')"
							:rules="passwordRules"
							:append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
							:type="showPw ? 'text' : 'password'"
							@click:append="showPw = !showPw"
							@keydown.tab.prevent="onTabPassword"
						/>
						<PasswordMessage :password="newPassword" :rules="passwordRules" :rule-messages="passwordRulesMsg" />
					</div>
					<div class="inputRow">
						<v-text-field
							id="forgot-password-passwordConfirm"
							v-model="newPassowrdConfirm"
							name="forgot-password-passwordConfirm"
							hide-details="auto"
							outlined
							:rules="[v => newPassword === newPassowrdConfirm || 'The password and its confirmation do not match']"
							:label="$t('page.forgotPassword.placeholder4')"
							height="54"
							required
							type="password"
						/>
					</div>
				</div>
				<div class="text-align-right">
					<Button
						:block="true"
						fontcolor="white"
						color="primary"
						:height="52"
						:rounded="true"
						:fontsize="16"
						type="submit"
						:disabled="checking"
						:loading="checking"
					>
						{{ status === EForgotPwStatus.READY ? 'Send reset password email' : 'Submit new password' }}
					</Button>

					<div v-if="status === EForgotPwStatus.SENDED" class="sendedWrapper">
						<span style="margin-right: 8px"> {{ $t('page.forgotPassword.resend') }} </span>
						<a :class="loading ? '-disabled' : ''" @click="sendCode">{{ $t('common.resend') }}</a>
					</div>
				</div>
			</v-form>
		</div>

		<div v-else-if="status === EForgotPwStatus.DONE" class="text-align-center">
			<img src="/characters/big-smile-4.png" />
			<h1 class="updatedWrapper">{{ $t('page.forgotPassword.updated') }}</h1>
			<CardButton :msg="$t('page.forgotPassword.lego')" @click="$router.push('/user/sign-in')" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, State } from 'nuxt-property-decorator';
import { throttle } from 'lodash';
import {
	EXECUTE_RECAPTCHA,
	FORGOT_PASSWORD,
	FORGOT_PASSWORD_SUBMIT,
	INIT_RECAPTCHA,
	SET_FORGOT_PASSWORD_STATUS,
} from '~/store/auth';
import { IMPORT_ONLY, MIN_PASSWORD } from '~/utils/constants';
import CardButton from '~/components/button/CardButton.vue';
import AlertCard from '~/components/card/AlertCard.vue';
import { metaInfo } from '~/utils/application';
import {
	emailRule,
	EMAIL_PATTERN,
	pwLowercase,
	pwMin,
	pwNumeric,
	pwSpecialChar,
	pwUppercase,
	requiredRule,
} from '~/utils/rules';
import PasswordMessage from '~/components/text/PasswordMessage.vue';
import Button from '~/components/button/Button.vue';
import { EForgotPwStatus } from '~/types/auth/types';
import { ISubmitForgotPwDTO } from '~/types/auth/dto';
import { CONFIRM_ACTION } from '~/store';

@Component({
	components: {
		CardButton,
		AlertCard,
		PasswordMessage,
		Button,
	},
	layout: IMPORT_ONLY ? 'event' : '',
	meta: { auth: false },
})
export default class SignIn extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'Forgot password',
		);
	}

	@State(state => state.isMobile) isMobile!: Boolean;
	@State(({ auth }) => auth.forgotPwStatus) status!: EForgotPwStatus;

	EForgotPwStatus = EForgotPwStatus;
	EMAIL_PATTERN = EMAIL_PATTERN;
	email: string = '';
	loading: boolean = false;
	checking: boolean = false;
	code: string = '';
	newPassword: string = '';
	newPassowrdConfirm: string = '';
	formValid: boolean = false;
	errorMsg: string = '';
	showPw: boolean = false;
	emailRules = [(v: any) => requiredRule(v), (v: any) => emailRule(v, this.$nuxt)];
	requiredRules = [(v: any) => requiredRule(v)];
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

	sendCodeAction = throttle(async (email: string) => {
		this.loading = true;
		await this.$store.dispatch(`auth/${FORGOT_PASSWORD}`, email);
		this.loading = false;
	}, 1000);

	sendCode() {
		if (this.loading) return;
		this.sendCodeAction(this.email);
	}

	onTabPassword() {
		document.getElementById('forgot-password-passwordConfirm')?.focus();
	}

	intiChecking() {
		setTimeout(() => {
			this.checking = false;
		}, 1000);
	}

	async onSubmit() {
		if (this.formValid) {
			this.errorMsg = '';
		} else {
			this.errorMsg = String(this.$t('message.submitAlert'));
			return;
		}

		this.checking = true;

		const recaptcha: boolean = await this.$store.dispatch(`auth/${EXECUTE_RECAPTCHA}`);
		if (!recaptcha) {
			return;
		}

		if (this.status === EForgotPwStatus.SENDED) {
			this.submitAction();
		} else {
			this.$store.commit(CONFIRM_ACTION, {
				title: 'Check',
				text: 'If you signed up with your social media accounts, you will not receive a verification email in your inbox.',
				pending: () => {
					this.submitAction();
				},
			});
		}
	}

	submitAction() {
		this.intiChecking();

		if (this.status === EForgotPwStatus.READY) {
			this.sendCodeAction(this.email);
			this.errorMsg = '';
		} else if (this.status === EForgotPwStatus.SENDED) {
			const data: ISubmitForgotPwDTO = {
				username: this.email,
				code: this.code,
				newPassword: this.newPassword,
			};
			this.$store.dispatch(`auth/${FORGOT_PASSWORD_SUBMIT}`, data);
			this.errorMsg = '';
		}
	}

	async mounted() {
		this.$store.commit(`auth/${SET_FORGOT_PASSWORD_STATUS}`, EForgotPwStatus.READY);
		await this.$store.dispatch(`auth/${INIT_RECAPTCHA}`);
	}

	beforeDestroy() {
		// @ts-ignore
		this.$recaptcha.destroy();
	}
}
</script>

<style lang="scss" scoped>
.forgotPasswordWrapper {
	.titleText {
		font-size: 33px;
		font-family: $poppins;
		font-weight: $font-normal;
		letter-spacing: 0.25px;
		text-align: center;
		margin-bottom: 56px;
	}

	.inputRow {
		margin-bottom: 40px;
	}

	.sendedWrapper {
		display: flex;
		justify-content: center;
		margin-top: 16px;
		gap: 16px;

		a.-disabled {
			color: $disabled !important;
		}
	}

	.updatedWrapper {
		margin-top: 16px;
		margin-bottom: 16px;
		font-size: 33px;
		font-family: $poppins;
	}
}
</style>
