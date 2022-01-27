<template>
	<div class="topBodyWrapper bottomBodyWrapper" style="text-align: center">
		<h2 class="signingTitle" style="position: relative">
			<MovingObject :size="58" color="tertiary" left="calc(50% - 150px)" top="-32px" :movement="EMoveType.BEAT" />
			<span style="position: relative">
				{{ $t('page.signIn.title') }}
			</span>
		</h2>

		<div class="wrapper440 tabsWrapper">
			<Tabs v-model="signInTab" :tabs="['Individuals', 'Tax professional']" @change="onChangeTab"></Tabs>
		</div>

		<div v-if="signInTab === 0" class="accountsWrapper wrapper352">
			<AccountSelectCard
				:disabled="!policyCheck && IMPORT_ONLY"
				img="/icon/google.png"
				:title="$t('page.signIn.continueGoogle')"
				@click="socialSignIn(EIdentityType.GOOGLE)"
			/>
			<AccountSelectCard
				:disabled="!policyCheck && IMPORT_ONLY"
				img="/icon/apple.png"
				:title="$t('page.signIn.continueApple')"
				@click="socialSignIn(EIdentityType.APPLE)"
			/>
			<AccountSelectCard
				:disabled="!policyCheck && IMPORT_ONLY"
				img="/icon/facebook.png"
				:title="$t('page.signIn.continueFacebook')"
				@click="socialSignIn(EIdentityType.FACEBOOK)"
			/>

			<div v-if="IMPORT_ONLY" class="policyTextWrapper">
				<small v-html="agreementText"></small>
				<Checkbox v-model="policyCheck" color="secondary" @click="policyCheck = !policyCheck" />
			</div>

			<div style="margin-top: 40px; margin-bottom: 40px">
				<FloatingTextDivider text="or" />
			</div>
		</div>

		<v-form ref="loginForm" v-model="formValid" @submit.prevent="onSubmitForm">
			<div class="inputsWrapper wrapper352">
				<div v-if="errorMsg && !formValid">
					<v-alert text color="error" v-text="errorMsg" />
				</div>
				<div>
					<v-text-field
						ref="username"
						v-model.trim="signInInfo.username"
						:disabled="loading"
						outlined
						:rules="emailRules"
						:placeholder="$t('page.signIn.placeholder.email')"
						height="54"
					/>
				</div>
				<div>
					<v-text-field
						ref="password"
						v-model.trim="signInInfo.password"
						:disabled="loading"
						outlined
						hide-details
						:placeholder="$t('page.signIn.placeholder.password')"
						height="54"
						:rules="requiredRules"
						:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
						:type="show ? 'text' : 'password'"
						@click:append="show = !show"
					/>
				</div>
				<div class="text-align-right">
					<CardButton msg="Forgot password" @click="$router.push('/user/forgot-password')" />
				</div>
			</div>

			<div class="wrapper352">
				<Button
					:height="52"
					:rounded="true"
					:loading="loading"
					:disabled="loading"
					:block="true"
					fontcolor="white"
					color="primary"
					type="submit"
				>
					{{ $t('common.signIn') }}
				</Button>
				<CardButton
					style="margin-top: 8px"
					:msg="$t('page.signIn.signUpFirst')"
					@click="$router.push('/user/sign-up')"
				/>
			</div>
		</v-form>

		<NotConfirmedDialog v-if="notConfirmed" :sign-in-info="signInInfo" :code-type="false" @close="closeConfirmDialog" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { CT_SIGN_IN_TAB, CT_SIGN_UP_TYPE, FINAL_PRODUCTION, IMPORT_ONLY } from '~/utils/constants';
import FloatingTextDivider from '~/components/divider/FloatingTextDivider.vue';
import AccountSelectCard from '~/components/card/AccountSelectCard.vue';
import CardButton from '~/components/button/CardButton.vue';
import {
	APPLE_SIGN_IN,
	EXECUTE_RECAPTCHA,
	FACEBOOK_SIGN_IN,
	GOOGLE_SIGN_IN,
	INIT_RECAPTCHA,
	SIGN_IN,
} from '~/store/auth';
import { EIdentityType, ISignIn, SignIn } from '~/types/auth/types';
import { generateAgreementText, metaInfo } from '~/utils/application';
import { emailRule, EMAIL_PATTERN, requiredRule } from '~/utils/rules';
import NotConfirmedDialog from '~/components/dialog/NotConfirmedDialog.vue';
import Button from '~/components/button/Button.vue';
import Tabs from '~/components/tab/Tabs.vue';
import MovingObject, { EMoveType } from '~/components/item/MovingObject.vue';
import Checkbox from '~/components/input/Checkbox.vue';

@Component({
	components: {
		FloatingTextDivider,
		AccountSelectCard,
		CardButton,
		NotConfirmedDialog,
		Button,
		Tabs,
		MovingObject,
		Checkbox,
	},
	layout: IMPORT_ONLY ? 'event' : '',
	meta: { auth: false },
	middleware: FINAL_PRODUCTION ? 'absoluteDenying' : '',
})
export default class SignInPage extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'Sign in',
		);
	}

	$refs!: {
		loginForm: HTMLFormElement;
		username: HTMLInputElement;
		password: HTMLInputElement;
	};

	EMoveType = EMoveType;
	IMPORT_ONLY = IMPORT_ONLY;
	EIdentityType = EIdentityType;
	EMAIL_PATTERN = EMAIL_PATTERN;
	policyCheck: boolean = false;
	formValid: boolean = false;
	errorMsg: string = '';
	show: boolean = false;
	signInInfo: ISignIn = new SignIn('', '');
	notConfirmed: boolean = false;
	requiredRules = [(v: string) => requiredRule(v)];
	emailRules = [(v: any) => requiredRule(v), (v: any) => emailRule(v, this.$nuxt)];
	loading: boolean = false;
	signInTab: number = 0;

	get agreementText(): any {
		return generateAgreementText(this, 'page.signUp.form.check1');
	}

	onChangeTab(v: number) {
		this.signInTab = v;
		this.$cookies.set(CT_SIGN_IN_TAB, v);
	}

	closeConfirmDialog() {
		this.notConfirmed = false;
	}

	ruleFunction(str: string, msg: string): boolean {
		return Boolean(!!str || msg);
	}

	async onSubmitForm() {
		if (this.formValid) {
			this.errorMsg = '';
			this.loading = true;
			const success: boolean = await this.$store.dispatch(`auth/${EXECUTE_RECAPTCHA}`);
			if (!success) {
				this.loading = false;
				return;
			}

			const res: string = await this.$store.dispatch(`auth/${SIGN_IN}`, this.signInInfo);
			if (res === 'notConfirmed') {
				this.notConfirmed = true;
				this.loading = false;
			} else if (res === 'fail') {
				this.loading = false;
			}
		} else {
			this.errorMsg = String(this.$t('message.submitAlert'));
		}
	}

	socialSignIn(type: EIdentityType) {
		if (type === EIdentityType.GOOGLE) {
			this.$store.dispatch(`auth/${GOOGLE_SIGN_IN}`);
		} else if (type === EIdentityType.FACEBOOK) {
			this.$store.dispatch(`auth/${FACEBOOK_SIGN_IN}`);
		} else if (type === EIdentityType.APPLE) {
			this.$store.dispatch(`auth/${APPLE_SIGN_IN}`);
		}
	}

	async mounted() {
		await this.$store.dispatch(`auth/${INIT_RECAPTCHA}`);
	}

	created() {
		this.$cookies.remove(CT_SIGN_UP_TYPE);
		const tab = Number(this.$cookies.get(CT_SIGN_IN_TAB));
		if (tab === 0 || tab === 1) {
			this.signInTab = tab;
		}
	}

	destroyed() {
		this.notConfirmed = false;
	}

	beforeDestroy() {
		// @ts-ignore
		this.$recaptcha.destroy();
	}
}
</script>

<style lang="scss" scoped>
.tabsWrapper {
	margin-top: 52px;
	margin-bottom: 44px;
}

.accountsWrapper {
	margin-top: 28px;
	margin-bottom: 36px;

	.policyTextWrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
	}
}

.inputsWrapper {
	margin-top: 36px;
	margin-bottom: 48px;

	> div {
		&:nth-child(1) {
			margin-bottom: 16px;
		}
		&:nth-child(2) {
			margin-bottom: 4px;
		}
		&:nth-child(3) {
			margin-bottom: 24px;
		}
	}
}
</style>
