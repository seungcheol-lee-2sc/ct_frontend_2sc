<template>
	<section class="productTitleSection" :class="noMargin ? '-no-margin' : ''">
		<div>
			<div class="titleText">
				<slot name="title"></slot>
			</div>
			<div class="subtitle">
				<slot name="desc"></slot>
			</div>
		</div>
		<slot name="button"></slot>
	</section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class ProductTitleSection extends Vue {
	@Prop() noMargin!: boolean;
}
</script>

<style lang="scss" scoped>
.productTitleSection {
	margin-top: 72px;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;

	&.-no-margin {
		margin-top: 0;
	}

	.titleText {
		font-family: $poppins;
		font-size: 23px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 46px;
		}
	}
	.subtitle {
		font-size: 14px;
		letter-spacing: 0.25px;
		color: $primaryLight;
	}
}
</style>
