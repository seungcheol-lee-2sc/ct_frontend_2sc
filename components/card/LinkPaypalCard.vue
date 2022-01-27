<template>
	<div>
		<div class="information">
			{{ $t('page.profile.paypal.desc') }}
		</div>
		<div v-if="userPaypalEmail" class="connectedWrapper">
			<span class="text-disabled" style="word-break: break-all"> {{ userPaypalEmail }} </span>

			<Chip style="margin-left: 8px" icon="mdi-check" color="successLight" fontcolor="successDark">
				{{ $t('page.profile.paypal.chip') }}
			</Chip>
		</div>
		<div v-else class="formBtnWrapper -dense">
			<Button :outlined="true" color="primary" :height="44" :fontsize="14" @click="onClickPaypal">
				<v-img max-width="18" src="/icon/paypal.png" style="margin-right: 8px" />
				<span class="text-primary"> {{ $t('page.profile.paypal.button') }} </span>
			</Button>
			<span style="display: none">
				<span id="paypalLoginButton" ref="paypalLoginButton"></span>
			</span>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Getter, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import Chip from '../chip/Chip.vue';
import { CT_FRONT, BUILD_ENV, DEVELOPMENT, PAYPAL_CLIENT_ID, PRODUCTION, RC, TEST } from '~/utils/constants';

@Component({
	components: {
		Button,
		Chip,
	},
})
export default class LinkPaypalCard extends Vue {
	$refs!: {
		paypalLoginButton: HTMLElement;
	};

	@Getter('auth/userPaypalEmail') userPaypalEmail!: string | null;

	onClickPaypal() {
		const linkElement: HTMLLinkElement | null = document.querySelector('#paypalLoginButton a');
		linkElement && linkElement.click();
	}

	addPaypalLoginScript(): Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				const scripttagElement = document.createElement('script');
				scripttagElement.src = 'https://www.paypalobjects.com/js/external/api.js';
				scripttagElement.onload = resolve;
				const html = document.querySelector('html');
				html?.appendChild(scripttagElement);
			} catch (error) {
				reject(error);
			}
		});
	}

	usePaypal() {
		const base = BUILD_ENV === DEVELOPMENT ? 'http://127.0.0.1:3000' : CT_FRONT;
		const returnUri = `${base}/callback/paypal/`;

		const paypalConfig = {
			appid: PAYPAL_CLIENT_ID,
			scopes: 'email',
			containerid: 'paypalLoginButton',
			responseType: 'code',
			locale: 'en-us',
			buttonType: 'LWP',
			buttonShape: 'pill',
			buttonSize: 'lg',
			fullPage: false,
			returnurl: returnUri,
		};

		const paypalConfigDev = { ...paypalConfig, authend: 'sandbox' };

		// @ts-ignore
		window.paypal?.use(['login'], function (login) {
			login.render(BUILD_ENV === PRODUCTION || BUILD_ENV === RC || BUILD_ENV === TEST ? paypalConfig : paypalConfigDev);
		});
	}

	async mounted() {
		await this.addPaypalLoginScript();
		this.usePaypal();
	}
}
</script>

<style lang="scss" scoped>
.information {
	color: $primary;
	font-size: 16px;
	font-family: $roboto;
	line-height: 1.5;
}

.connectedWrapper {
	margin-top: 24px;
	border-radius: $round-md;
	border: 1px solid $outline;
	padding: 12px 24px;
	width: fit-content;
	margin-left: auto;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
}
</style>
