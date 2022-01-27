<template>
	<div class="subjectTaxWrapper">
		<div class="firstCol">
			<img style="width: 100%" :src="src" />
		</div>
		<div class="secondCol">
			<h4 class="titleText">{{ title }}</h4>
			<p class="contentText">{{ content }}</p>
			<p v-if="example" class="exampleText">
				<span class="example">example</span> <br />
				{{ example }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class SubjectTaxCard extends Vue {
	@Prop({ required: true }) title!: string;
	@Prop({ required: true }) content!: string;
	@Prop() example!: string;
	@Prop() src!: string;
}
</script>

<style lang="scss" scoped>
.subjectTaxWrapper {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 28px;
	margin-bottom: 40px;

	@media (min-width: #{$breakpoint-xl}) {
		margin-bottom: 108px;
		grid-template-columns: repeat(8, minmax(0, 1fr));
	}

	.firstCol {
		margin: 0 auto;
		max-width: 512px;
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 2 / span 2;
		}
	}

	.secondCol {
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 6 / span 6;
		}

		.titleText {
			font-family: $poppins;
			color: $primary;
			font-size: 24px;
			font-weight: $font-medium;
			margin-bottom: 9px;
			@media (min-width: #{$breakpoint-xl}) {
				font-size: 23px;
			}
		}
		.contentText {
			font-family: $roboto;
			color: $primaryLight;
			font-size: 18px;
			font-weight: $font-normal;
			padding-bottom: 16px;
			letter-spacing: 0.25px;
			line-height: 2.22;
			@media (min-width: #{$breakpoint-xl}) {
				font-size: 18px;
				padding-bottom: 28px;
			}
		}
		.exampleText {
			font-family: $roboto;
			color: $primaryLight;
			font-size: 15px;
			line-height: 1.75;
			letter-spacing: 0.54px;
			font-weight: $font-normal;
			padding: 16px;
			background-color: $offWhite;
			border-radius: $round-md;
			@media (min-width: #{$breakpoint-xl}) {
				padding: 24px;
				font-size: 16px;
			}

			.example {
				color: $primary;

				font-weight: $font-medium;

				font-family: $poppins;
				line-height: 1.39;
				letter-spacing: 0.16px;
				margin-bottom: 10px;
				@media (min-width: #{$breakpoint-xl}) {
					font-size: 18px;
				}
			}
		}
	}
}
</style>
