<template>
	<LottieLoader src="/lottie-files/concept2/arcodian.json">
		Import is in progress.
		<br />
		{{ $t('message.justAMoment') }}
	</LottieLoader>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import LottieLoader from '~/components/LottieLoader.vue';
import { LOGIN_IMPORT_POST_CALLBACK } from '~/store/import';
import { CT_FRONT } from '~/utils/constants';

@Component({
	layout: 'empty',
	components: {
		LottieLoader,
	},
})
export default class LoginImportCallback extends Vue {
	async mounted() {
		const exchange = this.$route.params.exchange;
		const success: boolean = await this.$store.dispatch(`import/${LOGIN_IMPORT_POST_CALLBACK}`, {
			...this.$route.query,
			'ct-exchange': exchange,
		});
		location.href = `${CT_FRONT}/tax/import?login-import=${success ? exchange : 'fail'}`;
	}
}
</script>
