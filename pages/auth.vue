<template>
	<LottieLoader src="/lottie-files/concept2/arcodian.json">
		{{ $t('message.loggingIn') }}
		<br />
		{{ $t('message.justAMoment') }}
	</LottieLoader>
</template>

<script lang="ts">
import { Component, State, Getter, Vue } from 'nuxt-property-decorator';
import { GET_OR_CREATE_USER, SYNC_CONTACT_COGNITO_TO_HUBSPOT, UPDATE_ATTRIBUTES, UPDATE_USER } from '~/store/auth';
import { removeTokens } from '~/utils/application';
import { CUSTOM_CONFIRM_ACTION } from '~/store';
import LottieLoader from '~/components/LottieLoader.vue';
import { DUPLICATED_EMAIL_CRITERIA } from '~/utils/constants';
import { IConfirmation } from '~/types/common/types';
import { ICognitoUserExt, EBoolean } from '~/types/auth/types';

@Component({
	layout: 'empty',
	components: {
		LottieLoader,
	},
})
export default class Auth extends Vue {
	@State(({ auth }) => auth.user) user!: ICognitoUserExt | null;

	@Getter('auth/userName') userName!: string;
	@Getter('auth/isAccountant') isAccountant!: boolean;

	updateReferralId(user: ICognitoUserExt) {
		if ('Rewardful' in window && user.attributes && !user.attributes['custom:referral_id']) {
			// @ts-ignore
			const referralId: string | undefined = window.Rewardful.referral;
			referralId && this.$store.dispatch(`auth/${UPDATE_ATTRIBUTES}`, { 'custom:referral_id': referralId });
		}
	}

	updateAccountantAttribute(id: number) {
		const req = { id, data: { id, isAccountant: this.isAccountant } };
		this.$store.dispatch(`auth/${UPDATE_USER}`, req);
	}

	async mounted() {
		if (this.$route.query.error) {
			let text = this.$route.query.error_description || '';
			let path = '/';
			if (text && text.includes(DUPLICATED_EMAIL_CRITERIA)) {
				/**
				 * Duplicated sign up check
				 */
				text = 'Your email has been already signed up. Please sign in by submitting the form.';
				path = '/user/sign-in';
			}

			const data: IConfirmation = {
				dialog: true,
				title: 'Error',
				text,
				btnText: this.$t('common.ok'),
				cancelBtn: false,
				pending: () => this.$router.push(path),
			};
			this.$store.commit(CUSTOM_CONFIRM_ACTION, data);
			return;
		}

		if (this.user) {
			const ctUser = await this.$store.dispatch(`auth/${GET_OR_CREATE_USER}`, this.userName);

			/**
			 * if ctUser.isAccountant === null, this means NEW USER
			 */
			if (ctUser && ctUser.id && ctUser.isAccountant === null) {
				this.updateReferralId(this.user);
				this.updateAccountantAttribute(ctUser.id);
			}

			this.$store.dispatch(`auth/${SYNC_CONTACT_COGNITO_TO_HUBSPOT}`, this.user.attributes);
			window.location.href =
				this.user.attributes['custom:is_accountant'] === EBoolean.TRUE ? '/accountant/manage-clients' : '/tax/import';
		} else {
			removeTokens(this.$cookies);
			this.$router.push('/');
		}
	}
}
</script>
