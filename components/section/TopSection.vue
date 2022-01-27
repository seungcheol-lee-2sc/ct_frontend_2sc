<template>
	<section class="sectionWrapper">
		<div class="topSectionInner">
			<h1 class="titleText" :class="titleTextClass" v-html="title" />
			<h6 class="descText" :class="descTextClass" v-html="desc" />
		</div>
	</section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class TopSection extends Vue {
	@Prop({ type: String, required: true }) title!: string;
	@Prop({ type: String, required: true }) desc!: string;
	@Prop({ type: Boolean }) isPrimaryColor!: Boolean;
	@Prop({ type: Boolean }) isWhiteColor!: Boolean;
	@Prop({ type: Boolean }) isBold!: Boolean;
	@Prop({ type: String }) descColor!: string;
	@Prop({ type: String }) titleColor!: string;

	get titleTextClass(): string {
		let addClass = '';
		addClass += this.isWhiteColor === true ? '-white ' : '';
		addClass += this.titleColor ? this.titleColor : '';
		return addClass;
	}

	get descTextClass(): string {
		let addClass = '';
		addClass += this.isWhiteColor === true ? '-white ' : '';
		addClass += this.descColor ? this.descColor : '';
		return addClass;
	}
}
</script>

<style lang="scss" scoped>
.topSectionInner {
	margin-bottom: 20px;
	text-align: center;

	.titleText {
		font-size: 26px;
		line-height: 1.38;
		font-weight: $font-semibold;
		font-family: $poppins;
		// color: $primary;
		max-width: 320px;
		margin: auto;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 48px;
			line-height: 1.43;
			letter-spacing: -0.5px;
			max-width: none;
		}

		&.-white {
			color: $white;
		}
	}

	.descText {
		padding-top: 16px;
		font-size: 14px;
		letter-spacing: 0.15px;
		line-height: 1.71;
		font-weight: $font-medium;
		// color: $primaryLight;
		font-family: $poppins;
		// min-width: 270px;
		max-width: 312px;
		margin: auto;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 19px;
			// color: $primary;
			line-height: 1.58;
			letter-spacing: 0.15px;
			max-width: none;
		}

		&.-white {
			color: $white;
		}
	}
}
</style>
