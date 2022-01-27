<template>
	<div></div>
</template>

<script lang="ts">
import { Component, Getter, Vue, State } from 'nuxt-property-decorator';
import { EmailService } from '~/services/EmailService';
import { CT_FRONT, EMAIL_ID_PAYPAL_CONNECTED } from '~/utils/constants';
import { UPDATE_ATTRIBUTES } from '~/store/auth';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { PAYPAL_LOGIN } from '~/store/pay';

@Component({
	layout: 'empty',
})
export default class Paypal extends Vue {
	fetchOnServer() {
		return false;
	}

	@State(({ pay }) => pay.paypalResponseEmail) paypalResponseEmail!: string;

	@Getter('auth/userEmail') userEmail!: string | null;
	@Getter('auth/isAccountant') isAccountant!: boolean;

	async sendEmailOfSuccess() {
		if (!this.userEmail) return;
		await new EmailService(this.$store, EMAIL_ID_PAYPAL_CONNECTED, this.userEmail).sendEmail();
	}

	async updateCognitoPaypal(paypalEmail: string) {
		const result = await this.$store.dispatch(`auth/${UPDATE_ATTRIBUTES}`, {
			'custom:paypal_email': paypalEmail,
		});
		console.log(result);
		if (!result) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: `${this.$i18n.t('message.fail.update')}` });
		}
	}

	async fetch() {
		let URL = this.isAccountant ? `${CT_FRONT}/accountant/profile` : `${CT_FRONT}/user/profile`;
		const code = this.$route.query.code;

		if (code) {
			const sucessEmail = await this.$store.dispatch(`pay/${PAYPAL_LOGIN}`, code);
			if (!sucessEmail) {
				URL += '?paypal=fail';
			} else {
				this.updateCognitoPaypal(sucessEmail);
				this.sendEmailOfSuccess();
				URL += '?paypal=success';
			}
		} else {
			URL += '?paypal=fail';
		}
		location.href = URL;
	}
}
</script>
