<template>
	<v-main id="product">
		<div id="productInner" :class="extraClass">
			<div v-if="currentImportStep > 0 && !IMPORT_ONLY" class="wrapper600">
				<ImportStepper :step="currentImportStep" />
			</div>
			<nuxt />
		</div>
	</v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import ImportStepper from '../ImportStepper.vue';
import { IMPORT_ONLY } from '~/utils/constants';

@Component({
	components: {
		ImportStepper,
	},
})
export default class ProductAppContent extends Vue {
	IMPORT_ONLY = IMPORT_ONLY;

	get extraClass() {
		return this.$route.path.includes('/accountant/') ? '-professional' : '';
	}

	get currentImportStep(): number {
		const path = this.$route.path;
		if (path === '/tax/import') {
			return 1;
		} else if (path === '/tax/overview') {
			return 2;
		} else if (path === '/tax/review' || path === '/tax/review/manual') {
			return 3;
		} else if (path === '/tax/report') {
			return 4;
		} else {
			return -1;
		}
	}
}
</script>

<style lang="scss" scoped>
#product {
	padding-top: 0 !important;
	background-color: $offWhite;

	#productInner {
		width: 100%;
		max-width: 1056px;
		margin: 0 auto;
		padding-left: 16px;
		padding-right: 16px;

		@media (min-width: #{$breakpoint-xl}) {
			padding-left: 0;
			padding-right: 0;
		}
		padding-top: 50px;
		padding-bottom: 80px;

		&.-large {
			max-width: 1440px;
		}
		&.-professional {
			max-width: 1254px;
		}
	}
}
</style>
