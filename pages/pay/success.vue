<template>
	<LottieLoader v-if="loading" src="/lottie-files/concept2/arcodian.json">
		{{ $t('page.plans.waiting') }}
		<br />
		{{ $t('message.justAMoment') }}
	</LottieLoader>
	<div v-else class="successWrapper">
		<client-only>
			<div class="imageWrapper">
				<img src="/characters/success-three-characters.png" alt="illustraion of Cointelli character" />
			</div>
			<div class="titleText">Your order is complete!</div>

			<div class="buttonWrapper">
				<Button
					:block="isMobile"
					fontcolor="white"
					color="primary"
					:height="52"
					:rounded="true"
					@click="moveToSubscriptionPage"
				>
					Return to the previous page
				</Button>
			</div>
		</client-only>
	</div>
</template>

<script lang="ts">
import { Component, State, Getter, Vue } from 'nuxt-property-decorator';
import Button from '~/components/button/Button.vue';
import LottieLoader from '~/components/LottieLoader.vue';
import { ICognitoUserExt } from '~/types/auth/types';
import { FINISH_SESSION } from '~/store/pay';
import { CT_PAY_REDIRECT } from '~/utils/constants';

export const defualtReturnURL = '/tax/report';

@Component({
	layout: 'empty',
	components: {
		LottieLoader,
		Button,
	},
})
export default class PaySuccess extends Vue {
	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;

	loading: boolean = false;
	routerPath: string = defualtReturnURL;

	@Getter('auth/userEmail') userEmail!: string;

	moveToSubscriptionPage() {
		this.$router.replace(this.routerPath);
	}

	rewardful() {
		// @ts-ignore
		rewardful('ready', () => {
			// @ts-ignore
			if (Rewardful.referral) {
				// @ts-ignore
				rewardful('convert', { email: this.userEmail });
			}
		});
	}

	mounted() {
		this.loading = true;
		const sessionId = this.$route.query.session_id;
		if (typeof sessionId === 'string') {
			this.$store.dispatch(`pay/${FINISH_SESSION}`, sessionId);
			this.rewardful();
			this.loading = false;
		} else {
			alert('Session id was not found.');
			this.$router.replace(defualtReturnURL);
			this.loading = false;
		}
	}

	created() {
		const cookie: string | null = this.$cookies.get(CT_PAY_REDIRECT) || null;
		this.routerPath = cookie || defualtReturnURL;
	}
}
</script>

<style lang="scss" scoped>
.successWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	height: 100vh;
	text-align: center;

	.titleText {
		margin-top: 20px;
		margin-bottom: 20px;
		font-family: $poppins;
		font-size: 33px;
		z-index: 999;
	}
}
</style>
