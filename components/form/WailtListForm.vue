<template>
	<v-form :id="formId" ref="form" v-model="formValid" class="wailListForm" @submit.prevent="onSubmitEmail">
		<div class="emailForm" :class="align">
			<div class="fieldWrapper">
				<v-text-field
					v-model.trim="email"
					outlined
					background-color="white"
					:rules="emailRules"
					required
					placeholder="Email address..."
					height="54"
					class="rounded-lg"
					hide-details
				/>
			</div>

			<div class="buttonWrapper">
				<Button
					:id="buttonId"
					:height="54"
					:block="true"
					:outlined="loading"
					:color="color"
					:fontsize="20"
					fontcolor="white"
					type="submit"
					:disabled="loading"
					:loading="loading"
					class="emailSubmitButton"
				>
					{{ buttonText }}
				</Button>
			</div>
		</div>

		<div class="policyWrapper" :class="align">
			<div class="policyContent" v-html="policyText"></div>
			<Checkbox v-model="checkbox" color="secondary" style="margin-top: 8px" @click="checkbox = !checkbox" />
		</div>
		<PolicyDialog :dialog="dialog" :policy-type="policyType" @close="closePolicyDialog" />
	</v-form>
</template>

<script lang="ts">
import { Vue, Component, State, Prop } from 'nuxt-property-decorator';
import PolicyDialog, { EPolicyType } from '../dialog/PolicyDialog.vue';
import Button from '../button/Button.vue';
import Checkbox from '../input/Checkbox.vue';
import { CONFIRM_ERROR, CUSTOM_CONFIRM_ACTION } from '~/store';
import { emailRule, requiredRule } from '~/utils/rules';
import { LOAD_LEGAL } from '~/store/content';
import { SUBMIT_EMAIL_TO_CAMPAIGN } from '~/store/etc';
import { IConfirmation } from '~/types/common/types';

export type TAlign = 'left' | 'center';

@Component({
	components: {
		PolicyDialog,
		Button,
		Checkbox,
	},
})
export default class WaitListForm extends Vue {
	$refs!: {
		form: HTMLFormElement;
	};

	@Prop() dark!: boolean;
	@Prop() align!: TAlign;
	@Prop({ required: true }) formId!: string;
	@Prop({ required: true }) buttonText!: string;
	@Prop() buttonId!: string;
	@Prop() color!: string;

	@State(state => state.isMobile) isMobile!: boolean;
	email: string = '';
	emailRules = [(v: any) => requiredRule(v), (v: any) => emailRule(v, this.$nuxt)];
	loading: boolean = false;
	formValid: boolean = false;
	checkbox: boolean = false;
	policyType: EPolicyType = EPolicyType.tos;
	dialog: boolean = false;
	EPolicyType = EPolicyType;

	get policyText(): string | any {
		return this.$t('market.consentPolicies', {
			privacy: `<a class="privacyText">${this.$t('market.privacyPolicy')}</a>`,
			tos: `<a class="tosText">${this.$t('market.termsOfService')}</a>`,
			disclaimer: `<a class="disclaimerText">${this.$t('market.disclaimer')}</a>`,
		});
	}

	async onSubmitEmail() {
		if (!this.checkbox) {
			this.$store.commit(CONFIRM_ERROR, { title: 'Checkbox', text: 'Please check the checkbox' });
			return;
		}
		if (!this.formValid) return;

		this.loading = true;
		const success: boolean = await this.$store.dispatch(`etc/${SUBMIT_EMAIL_TO_CAMPAIGN}`, this.email);
		this.loading = false;
		if (success) {
			this.email = '';

			const data: IConfirmation = {
				dialog: true,
				title: 'Thank you',
				text: 'Thank you for joining our waitlist!</br>Be on the lookout for more exciting news! 🙂',
				btnText: 'Ok',
				id: 'thank-you-button',
				cancelBtn: false,
				pending: () => new Promise(resolve => resolve(true)),
			};
			this.$store.commit(CUSTOM_CONFIRM_ACTION, data);

			this.loading = false;
			this.$refs.form.reset();
		}
	}

	openPolicyDialog(type: EPolicyType) {
		this.policyType = type;
		this.dialog = true;
	}

	closePolicyDialog() {
		this.dialog = false;
	}

	mounted() {
		this.$store.dispatch(`content/${LOAD_LEGAL}`);

		document.querySelector(`#${this.formId} .privacyText`)?.addEventListener('click', () => {
			this.openPolicyDialog(EPolicyType.privacy);
		});
		document.querySelector(`#${this.formId} .tosText`)?.addEventListener('click', () => {
			this.openPolicyDialog(EPolicyType.tos);
		});
		document.querySelector(`#${this.formId} .disclaimerText`)?.addEventListener('click', () => {
			this.openPolicyDialog(EPolicyType.disclaimer);
		});
	}
}
</script>

<style lang="scss" scoped>
$form-width: 600px;
$button-width: 200px;

.wailListForm {
	position: relative;
	z-index: 111;

	.emailForm {
		@media (min-width: #{$breakpoint-xl}) {
			width: $form-width;
			display: flex;
			gap: 20px;

			&.left {
				justify-content: flex-start;
			}

			&.center {
				justify-content: center;
				margin: 0 auto;
			}
		}

		.fieldWrapper {
			margin-bottom: 20px;
			@media (min-width: #{$breakpoint-xl}) {
				width: $form-width - $button-width;
			}
		}

		.buttonWrapper {
			width: 100%;
			@media (min-width: #{$breakpoint-xl}) {
				max-width: $button-width;
			}
		}
	}
	.policyWrapper {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		margin-top: 10px;

		> div {
			grid-column: span 11 / span 11;
		}

		> span {
			justify-self: end;
			position: relative;

			.checkbox {
				position: absolute;
				right: 0;
				transform: translateX(-24px);
			}
		}

		.policyContent {
			font-size: 14px;
			line-height: 1.625;
			text-align: left;
			@media (min-width: #{$breakpoint-xl}) {
				font-size: 16px;
			}
		}

		margin-bottom: 12px;

		@media (min-width: #{$breakpoint-xl}) {
			&.center {
				margin: 0 auto;
				justify-content: center;
			}
			margin-top: 10px;
			max-width: $form-width;
		}
	}
}
</style>
