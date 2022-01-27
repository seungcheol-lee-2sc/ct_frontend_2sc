<template>
	<div class="pageWrapper bottomBodyWrapper">
		<section class="sectionWrapper introSection">
			<h1>
				Grow your business <br />
				with Cointelli!
			</h1>
			<p class="descText -mb">B2B add on crypto tax software, Enterprise 1099b, Inquiries about crypto tax NFT.</p>
			<p class="descText -pc">
				Our services include Enterprise solutions for crypto tax, NFT tax calculations, and 1099b forms
			</p>
		</section>

		<section class="formSection">
			<v-form ref="form" v-model="formValid" @submit.prevent="onSubmitForm">
				<div class="formInner">
					<v-text-field
						v-model="firstname"
						hide-details="auto"
						label="First name*"
						:rules="requiredRules"
						outlined
						background-color="white"
					/>
					<v-text-field
						v-model="lastname"
						hide-details="auto"
						label="Last name*"
						:rules="requiredRules"
						outlined
						background-color="white"
					/>
					<v-text-field
						v-model="email"
						hide-details="auto"
						label="Email*"
						:rules="emailRules"
						outlined
						background-color="white"
						class="-block"
					/>
					<v-text-field
						v-model="jobtitle"
						hide-details="auto"
						label="Job title"
						outlined
						background-color="white"
						class="-block"
					/>
					<div class="phoneWrapper -block">
						<CountrySelector
							v-model="countryPhone"
							class="country"
							text-key="name"
							shown-key="phone"
							value-key="phone"
							background-color="white"
							@change="v => (countryPhone = v)"
						/>
						<PhoneInput
							v-model="phoneNumber"
							background-color="white"
							label="Phone number"
							@change="v => (phoneNumber = v)"
						/>
					</div>
					<v-text-field
						v-model="company"
						hide-details="auto"
						label="Company name*"
						:rules="requiredRules"
						outlined
						background-color="white"
					/>
					<v-select
						v-model="companySize"
						hide-details="auto"
						label="Company size*"
						:rules="requiredRules"
						outlined
						background-color="white"
						:items="companySizeArr"
					/>
					<v-textarea
						v-model="helpdesc"
						hide-details="auto"
						placeholder="How can we help you?"
						outlined
						background-color="white"
						class="-block"
					></v-textarea>
				</div>
				<div class="policyText" v-html="agreementsText"></div>
				<div class="checkboxText">
					<Checkbox v-model="subscribe" color="secondary" @click="subscribe = !subscribe" />
					<span>
						Yes, I would like to receive marketing communications regarding Cointelli products, services, and events. I
						can unsubscribe at any time.
					</span>
				</div>
				<Button
					:disabled="loading || !formValid"
					type="submit"
					:block="true"
					color="primary"
					:fontsize="16"
					:rounded="true"
					fontcolor="white"
					:height="52"
				>
					Submission
				</Button>

				<div class="smallTailText">Please agree to our Terms and Privacy policy in order to sign up.</div>
			</v-form>
		</section>

		<section class="sectionWrapper featuresSection">
			<div>
				<span class="greyCircle">
					<img src="/icon/people.png" alt="People icon" />
				</span>
				<div class="featureText">
					Handle more clients <br />
					and their trades with ease
				</div>
			</div>
			<div>
				<span class="greyCircle">
					<img src="/icon/notebook.png" alt="Notebook icon" />
				</span>
				<div class="featureText">
					Manage your clients <br />
					within a single dashboard
				</div>
			</div>
			<div>
				<span class="greyCircle">
					<img src="/icon/stair.png" alt="Stair icon" />
				</span>
				<div class="featureText">
					Generate tax forms in <br />
					just 3 simple steps
				</div>
			</div>
			<div>
				<span class="greyCircle">
					<img src="/icon/arrow-paper.png" alt="Paper and arrow icon" />
				</span>
				<div class="featureText">
					Export to your favorite <br />
					tax software
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import Button from '~/components/button/Button.vue';
import Checkbox from '~/components/input/Checkbox.vue';
import PhoneInput from '~/components/input/PhoneInput.vue';
import CountrySelector from '~/components/select/CountrySelector.vue';
import { ADD_TO_MESSAGE_QUEUE, CUSTOM_CONFIRM_ACTION } from '~/store';
import { CREATE_ENTERPRISE_CONTACT } from '~/store/etc';
import { IConfirmation } from '~/types/common/types';
import { generateAgreementText } from '~/utils/application';
import { emailRule, requiredRule } from '~/utils/rules';

@Component({
	components: {
		Checkbox,
		Button,
		CountrySelector,
		PhoneInput,
	},
})
export default class ContactUsEnterprise extends Vue {
	$refs!: {
		form: HTMLFormElement;
	};

	firstname: string = '';
	lastname: string = '';
	email: string = '';
	jobtitle: string = '';
	company: string = '';
	companySizeArr: string[] = ['1-9', '10-19', '20-49', '50-100', '100+'];

	companySize: string = '';
	phoneNumber: string = '';
	countryPhone: string = '1';
	helpdesc: string = '';
	subscribe: boolean = false;

	loading: boolean = false;
	formValid: boolean = false;
	requiredRules = [(v: string) => requiredRule(v)];
	emailRules = [(v: any) => requiredRule(v), (v: any) => emailRule(v, this.$nuxt)];

	get submitData(): any {
		return {
			firstname: this.firstname,
			lastname: this.lastname,
			email: this.email,
			jobtitle: this.jobtitle,
			company: this.company,
			company_size: this.companySize,
			phone: `+${this.countryPhone} ${this.phoneNumber}`,
			helpdesc: this.helpdesc,
			subscribe: this.subscribe,
		};
	}

	get agreementsText(): string {
		return generateAgreementText(this, 'page.enterprise.agreements', 'link', true);
	}

	init() {
		this.firstname = '';
		this.lastname = '';
		this.email = '';
		this.jobtitle = '';
		this.company = '';
		this.companySize = '';
		this.phoneNumber = '1';
		this.countryPhone = '';
		this.helpdesc = '';
		this.subscribe = false;
	}

	async onSubmitForm() {
		if (!this.formValid) return;

		this.loading = true;
		const success: boolean = await this.$store.dispatch(`etc/${CREATE_ENTERPRISE_CONTACT}`, this.submitData);
		if (success) {
			const data: IConfirmation = {
				dialog: true,
				title: 'Thank you',
				text: 'Thank you!<br/>One of our experts will reach out to you shortly. 😊',
				btnText: 'Ok',
				cancelBtn: false,
				pending: () => new Promise(resolve => resolve(true)),
			};
			this.$store.commit(CUSTOM_CONFIRM_ACTION, data);
			this.init();
			this.$refs.form?.reset();
		} else {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Submission failed' });
		}
		this.loading = false;
	}
}
</script>

<style lang="scss" scoped>
.pageWrapper {
	@media (min-width: #{$breakpoint-xl}) {
		width: 100%;
		max-width: 1100px;
		margin: auto;
		position: relative;
	}
}

.introSection {
	padding-top: 72px;
	padding-bottom: 58px;
	text-align: center;
	@media (min-width: #{$breakpoint-xl}) {
		text-align: left;
		grid-column: span 5 / span 5;
		padding-top: 120px;
	}

	h1 {
		color: $primary;
		font-family: $poppins;
		font-size: 26px;
		font-weight: $font-semibold;
		line-height: 1.38;
		margin-bottom: 18px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 36px;
			margin-bottom: 24px;
		}
	}

	.descText {
		color: $primaryLight;
		font-weight: $font-medium;
		font-size: 14px;
		line-height: 1.7;
		max-width: 270px;
		margin: auto;

		@media (min-width: #{$breakpoint-xl}) {
			margin-left: 0;
			font-size: 19px;
			font-weight: $font-normal;
			max-width: 430px;
		}

		&.-mb {
			display: block;
			@media (min-width: #{$breakpoint-xl}) {
				display: none;
			}
		}

		&.-pc {
			display: none;
			@media (min-width: #{$breakpoint-xl}) {
				display: block;
			}
		}
	}
}

.formSection {
	padding: 16px;
	padding-top: 48px;
	padding-bottom: 60px;
	background-color: $offWhite;
	margin-bottom: 28px;

	@media (min-width: #{$breakpoint-xl}) {
		position: absolute;
		top: 64px;
		right: 0;
		max-width: 600px;
		padding: 48px;
		padding-top: 64px;
		padding-bottom: 64px;
		border: 1px solid $primary;
		box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
		border-radius: $round-xl;
	}

	.formInner {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 40px 16px;
		margin-bottom: 24px;

		.-block {
			grid-column: span 2 / span 2;
		}

		.phoneWrapper {
			display: flex;
			gap: 16px;
			.country {
				flex: 1;
			}
		}
	}

	.policyText {
		font-size: 14px;
		color: $primaryLight;
		line-height: 1.625;
		margin-bottom: 28px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 16px;
		}
	}

	.checkboxText {
		font-size: 14px;
		color: $primaryLight;
		line-height: 1.625;
		margin-bottom: 32px;
		display: flex;
		gap: 8px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 16px;
		}
	}

	.smallTailText {
		margin: auto;
		margin-top: 20px;
		font-size: 14px;
		color: $disabled;
		max-width: 280px;
		text-align: center;
	}
}

.featuresSection {
	@media (min-width: #{$breakpoint-xl}) {
		grid-column: span 5 / span 5;
		margin-bottom: 320px;
	}

	> div {
		display: flex;
		align-items: center;
		gap: 20px;
		margin-bottom: 24px;
		@media (min-width: #{$breakpoint-xl}) {
			gap: 24px;
		}

		.greyCircle {
			align-items: center;
			justify-content: center;
			display: flex;
			width: 72px;
			height: 72px;
			background-color: $offWhite;
			border-radius: $round-full;
			@media (min-width: #{$breakpoint-xl}) {
				width: 80px;
				height: 80px;
			}
		}

		.featureText {
			color: $primaryLight;
			font-size: 16px;
			font-family: $poppins;
			line-height: 1.4;
		}
	}
}
</style>
