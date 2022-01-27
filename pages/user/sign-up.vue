<template>
	<div class="topBodyWrapper bottomBodyWrapper" style="text-align: center">
		<v-fade-transition leave-absolute>
			<div v-if="signUpStep == 1" class="wrapper728">
				<h2 class="signingTitle" v-html="$t('page.signUp.title2')"></h2>

				<div class="signUpTypeWrapper">
					<div class="signUpTypeInner">
						<SignUpTypeSelector
							:type="1"
							:title="$t('page.signUp.signUpType1.title')"
							:desc="$t('page.signUp.signUpType1.desc')"
							:btn-desc="$t('page.signUp.signUpType1.btn')"
							@click="selectType(false)"
						/>
						<SignUpTypeSelector
							:disabled="IMPORT_ONLY"
							:type="2"
							:title="$t('page.signUp.signUpType2.title')"
							:desc="$t('page.signUp.signUpType2.desc')"
							:btn-desc="$t('page.signUp.signUpType2.btn')"
							addtional="US only"
							@click="selectType(true)"
						/>
					</div>
					<div>
						<CardButton :msg="$t('page.signUp.alreadySignUp')" @click="$router.push('/user/sign-in')" />
					</div>
				</div>
			</div>
		</v-fade-transition>

		<v-fade-transition leave-absolute>
			<div v-if="signUpStep == 2 && !isAccountant">
				<div class="wrapper728">
					<h2 class="signingTitle">{{ $t('page.signUp.title1') }}</h2>
				</div>
				<div class="wrapper352">
					<div class="accountsWrapper">
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
						<AccountSelectCard
							:disabled="!policyCheck && IMPORT_ONLY"
							img="/icon/email.png"
							:title="$t('page.signUp.continueEmail')"
							@click="nextStep()"
						/>
						<div v-if="IMPORT_ONLY" class="policyTextWrapper">
							<small v-html="agreementText"></small>
							<Checkbox v-model="policyCheck" color="secondary" @click="policyCheck = !policyCheck" />
						</div>
					</div>
				</div>
			</div>
			<div v-if="signUpStep == 2 && isAccountant" class="wrapper728">
				<h2 class="signingTitle">
					We customize our services for tax professionals. Which software do you use for your practice?
				</h2>
				<div class="softwaresWrapper">
					<div
						v-for="softwareItem in SOFTWARES"
						:key="softwareItem.value"
						class="software"
						:class="selectedSoftware && selectedSoftware.value === softwareItem.value ? 'active' : ''"
						@click="onClickSoftware(softwareItem)"
					>
						<span
							v-if="selectedSoftware && selectedSoftware.value === softwareItem.value"
							style="position: absolute; left: 12px"
						>
							<v-icon color="primary"> mdi-check-circle </v-icon>
						</span>
						<img :src="softwareItem.img" :alt="softwareItem.name" />
					</div>
				</div>

				<div style="margin-top: 28px">
					<Button
						:disabled="!selectedSoftware"
						:block="true"
						color="primary"
						:height="52"
						fontcolor="white"
						:fontsize="16"
						:rounded="true"
						@click="nextStep"
					>
						{{ $t('common.save') }}
					</Button>
				</div>

				<div style="margin-top: 24px" class="text-align-right">
					<CardButton :msg="`${$t('page.signUp.differentSoftware')} ›`" @click="onClickEtcSoftware()" />
				</div>
			</div>
		</v-fade-transition>

		<v-fade-transition leave-absolute>
			<div v-if="signUpStep == 3">
				<SignUpForm :is-accountant="isAccountant" :software="selectedSoftware" @callback="nextStep()" />
			</div>
		</v-fade-transition>

		<v-fade-transition leave-absolute>
			<div v-if="signUpStep == 4">
				<div>
					<template v-if="signUpResult">
						<h2 class="wrapper540 signingTitle">{{ $t('page.signUp.title4') }}</h2>
						<p class="wrapper720 signInText">
							<span v-html="reformedDesc1"></span>
							<br />
							{{ $t('page.signUp.finalTab.desc2') }}
						</p>
					</template>
					<h2 v-else class="wrapper540 signingTitle">{{ $t('page.signUp.finalTab.desc3') }}</h2>
				</div>
				<div class="wrapper728 visualWrapper">
					<MovingObject
						:size="EMovingObjSize.L"
						:left="isMobile ? 'calc(50% + 125px)' : 'calc(50% + 180px)'"
						top="0px"
						color="tertiary"
						:opacity="0.8"
						:z-index="1"
						:movement="EMoveType.BEAT"
					/>
					<v-img src="/lines/line-seding-ball.png" :max-width="isMobile ? '240' : '345'" contain />
				</div>
				<div v-if="signUpResult" class="wrapper540 signUpResult">
					<div v-if="!confirmLoading && !signingLoading" class="signUpResultInner">
						{{ $t('page.signUp.finalTab.noReceive') }}
						<CardButton :loading="resendLoading" :msg="$t('common.resend')" @click="resendConfirmation" />
					</div>
					<DataLoader v-else />
				</div>
			</div>
		</v-fade-transition>
	</div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator';
import * as amazonCognitoIdentityJs from 'amazon-cognito-identity-js';
import {
	BASE_SITE_TITLE,
	CT_SIGN_UP_TYPE,
	ETC_SOFTWARE,
	ISoftwareItem,
	SOFTWARES,
	FINAL_PRODUCTION,
	IMPORT_ONLY,
} from '~/utils/constants';
import SignUpTypeSelector from '~/components/card/SignUpTypeSelectCard.vue';
import AccountSelectCard from '~/components/card/AccountSelectCard.vue';
import CardButton from '~/components/button/CardButton.vue';
import SignUpForm from '~/components/form/SignUpForm.vue';
import { APPLE_SIGN_IN, FACEBOOK_SIGN_IN, GOOGLE_SIGN_IN, INIT_RECAPTCHA, SEND_CONFIRMATION } from '~/store/auth';
import { generateAgreementText, metaInfo } from '~/utils/application';
import MovingObject, { EMovingObjSize, EMoveType } from '~/components/item/MovingObject.vue';
import Button from '~/components/button/Button.vue';
import { EAuthRole } from '~/types/common/types';
import { EIdentityType } from '~/types/auth/types';
import Checkbox from '~/components/input/Checkbox.vue';

@Component({
	components: {
		MovingObject,
		SignUpTypeSelector,
		AccountSelectCard,
		CardButton,
		SignUpForm,
		Button,
		Checkbox,
	},
	layout: IMPORT_ONLY ? 'event' : '',
	meta: { auth: false },
	middleware: FINAL_PRODUCTION ? 'absoluteDenying' : '',
})
export default class SignUp extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'Sign up',
		);
	}

	@State(({ auth }) => auth.signUpResult) signUpResult!: amazonCognitoIdentityJs.ISignUpResult | null;
	@State(({ auth }) => auth.tempPassword) tempPassword!: string;
	@State(({ auth }) => auth.signingLoading) signingLoading!: boolean;
	@State(state => state.isMobile) isMobile!: boolean;

	IMPORT_ONLY = IMPORT_ONLY;
	BASE_SITE_TITLE = BASE_SITE_TITLE;
	EIdentityType = EIdentityType;
	EMovingObjSize = EMovingObjSize;
	EMoveType = EMoveType;
	signUpStep: number = 1;
	isAccountant: boolean = false;
	code: string = '';
	confirmLoading: boolean = false;
	SOFTWARES: ISoftwareItem[] = SOFTWARES;
	selectedSoftware: ISoftwareItem | null = null;
	resendLoading: boolean = false;
	policyCheck: boolean = false;

	get reformedDesc1(): string | any {
		const name = `<span class="text-primary" style="font-weight: 500">${
			this.signUpResult?.user && this.signUpResult?.user?.getUsername()
		}.</span>`;
		return this.$t('page.signUp.finalTab.desc1', { name });
	}

	get agreementText(): any {
		return generateAgreementText(this, 'page.signUp.form.check1');
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

	onClickEtcSoftware() {
		this.selectedSoftware = ETC_SOFTWARE;
		this.nextStep();
	}

	onClickSoftware(software: ISoftwareItem) {
		this.selectedSoftware = software;
	}

	selectType(accountant: boolean) {
		this.isAccountant = accountant;
		if (accountant) {
			this.$cookies.set(CT_SIGN_UP_TYPE, EAuthRole.PROFESSIONAL);
		} else {
			this.$cookies.set(CT_SIGN_UP_TYPE, EAuthRole.INDIVIDUAL);
		}
		this.nextStep();
	}

	googleSignIn() {
		this.$store.dispatch(`auth/${GOOGLE_SIGN_IN}`);
	}

	facebookSignIn() {
		this.$store.dispatch(`auth/${FACEBOOK_SIGN_IN}`);
	}

	appleSignIn() {
		this.$store.dispatch(`auth/${APPLE_SIGN_IN}`);
	}

	nextStep() {
		this.signUpStep += 1;
	}

	async resendConfirmation() {
		if (this.signUpResult) {
			this.resendLoading = true;
			await this.$store.dispatch(`auth/${SEND_CONFIRMATION}`, this.signUpResult?.user.getUsername());
			this.resendLoading = false;
		} else {
			alert(String(this.$t('page.signUp.finalTab.noSignUpResult')));
		}
	}

	async mounted() {
		await this.$store.dispatch(`auth/${INIT_RECAPTCHA}`);
	}

	created() {
		this.$cookies.remove(CT_SIGN_UP_TYPE);
	}

	beforeDestroy() {
		// @ts-ignore
		this.$recaptcha.destroy();
	}
}
</script>

<style lang="scss" scoped>
.signInText {
	margin-top: 24px;
	font-weight: $font-normal;
	color: $primaryLight;
	font-size: 13px;
	line-height: 1.5;
	@media (min-width: #{$breakpoint-xl}) {
		font-size: 19px;
	}
}

.accountsWrapper {
	margin-top: 56px;
	margin-bottom: 56px;

	.policyTextWrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
	}
}

.signUpTypeWrapper {
	margin-top: 56px;
	margin-bottom: 86px;

	.signUpTypeInner {
		display: grid;
		gap: 24px;
		margin-bottom: 56px;
		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
}

.softwaresWrapper {
	display: grid;
	gap: 24px;
	margin-top: 56px;
	@media (min-width: #{$breakpoint-xl}) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.software {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 52px;
		background-color: $offWhite;
		border-radius: $round-md;
		cursor: pointer;
		position: relative;
		transition: 0.2s all ease-in-out;

		&:hover {
			background-color: $outline;
		}

		&.active {
			border-width: 2px;
			border-color: $primary;
		}
	}
}

.visualWrapper {
	display: flex;
	justify-content: center;
	margin-top: 24px;
	margin-bottom: 36px;
	position: relative;

	@media (min-width: #{$breakpoint-xl}) {
		margin-top: 60px;
		margin-bottom: 72px;
	}
}

.signUpResult {
	font-size: 14px;
	@media (min-width: #{$breakpoint-xl}) {
		font-size: 16px;
	}

	.signUpResultInner {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 28px;
	}
}
</style>
