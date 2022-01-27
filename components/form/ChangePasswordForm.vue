<template>
	<v-form v-if="!noCognitoUser" ref="form" v-model="formValid" @submit.prevent="onSubmitForm">
		<AlertCard v-if="errorMsg && !formValid" :msg="errorMsg" color="error" icon="mdi-alert-circle-outline" />

		<div class="formContentWrapper">
			<div>
				<v-text-field
					v-model="oldPassword"
					outlined
					:label="$t('page.profile.changePassword.current')"
					hide-details
					:rules="[v => requiredRule(v), ...passwordRules]"
					required
					:append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
					:type="showOldPassword ? 'text' : 'password'"
					@click:append="showOldPassword = !showOldPassword"
				/>
				<PasswordMessage :password="oldPassword" :rules="passwordRules" :rule-messages="passwordRulesMsg" />
			</div>

			<div>
				<v-text-field
					v-model="newPassword"
					outlined
					:label="$t('page.profile.changePassword.newPassword')"
					hide-details
					:rules="[v => requiredRule(v), ...passwordRules]"
					required
					:append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
					:type="showNewPassword ? 'text' : 'password'"
					@click:append="showNewPassword = !showNewPassword"
				/>
				<PasswordMessage :password="newPassword" :rules="passwordRules" :rule-messages="passwordRulesMsg" />
			</div>

			<v-text-field
				v-model="passwordConfirm"
				outlined
				:label="$t('page.profile.changePassword.newPasswordConfirm')"
				hide-details="auto"
				:rules="[v => requiredRule(v), v => newPassword === passwordConfirm || $t('message.pwConfirmation')]"
				required
				type="password"
			/>
		</div>
		<div class="formBtnWrapper -wide">
			<Button
				:rounded="true"
				fontcolor="white"
				:disabled="noCognitoUser || loading"
				:loading="loading"
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

	<div v-else style="height: 300px"></div>
</template>

<script lang="ts">
import { Component, Getter, State, Mutation, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import { MIN_PASSWORD } from '~/utils/constants';
import { CHANGE_PASSWORD, RETRIEVE_ME } from '~/store/auth';
import { ADD_TO_MESSAGE_QUEUE, CONFIRM_ERROR } from '~/store';
import AlertCard from '~/components/card/AlertCard.vue';
import { pwLowercase, pwMin, pwNumeric, pwSpecialChar, pwUppercase, requiredRule } from '~/utils/rules';
import { blurEveryInputs } from '~/utils/dom';
import PasswordMessage from '~/components/text/PasswordMessage.vue';
import { ICognitoUserExt, EIdentityType } from '~/types/auth/types';
import { IChangePasswordDTO } from '~/types/auth/dto';

@Component({
	components: {
		AlertCard,
		PasswordMessage,
		Button,
	},
})
export default class ChangePasswordForm extends Vue {
	$refs!: {
		form: HTMLFormElement;
	};

	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;
	@Getter('auth/identityType') identityType!: EIdentityType;

	formValid: Boolean = false;
	oldPassword: string = '';
	newPassword: string = '';
	passwordConfirm: string = '';
	showOldPassword: Boolean = false;
	showNewPassword: Boolean = false;
	errorMsg: string | any = '';
	loading: boolean = false;
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

	get noCognitoUser(): boolean {
		return this.identityType !== EIdentityType.COGNITO;
	}

	get submitData(): IChangePasswordDTO {
		return {
			oldPassword: this.oldPassword,
			newPassword: this.newPassword,
		};
	}

	@Mutation(`${ADD_TO_MESSAGE_QUEUE}`) popSnack!: any;

	requiredRule = requiredRule;

	async onSubmitForm() {
		if (this.formValid) {
			this.loading = true;
			const res: true | string = await this.$store.dispatch(`auth/${CHANGE_PASSWORD}`, this.submitData);
			if (res === true) {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.update') });
				this.init();
				blurEveryInputs();
				this.$store.dispatch(`auth/${RETRIEVE_ME}`);
			} else {
				console.log(res);
				if (res && res.toLowerCase().includes('incorrect username or password')) {
					this.$store.commit(CONFIRM_ERROR, { title: 'Check', text: 'Incorrect password' });
				} else {
					this.$store.commit(CONFIRM_ERROR, { title: 'Error', text: res });
				}
			}
			this.loading = false;
		} else {
			this.$refs.form.validate();
			this.errorMsg = String(this.$t('message.submitAlert'));
		}
	}

	init() {
		this.$refs.form?.reset();
		// @ts-ignore
		const attributes: IAttributes = this.user.attributes;

		if (attributes) {
			this.oldPassword = '';
			this.newPassword = '';
			this.passwordConfirm = '';
			this.formValid = false;
			this.errorMsg = '';
		} else {
			this.errorMsg = this.$t('message.fail.fetch');
		}
	}

	created() {
		this.init();
	}
}
</script>
