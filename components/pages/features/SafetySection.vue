<template>
	<section class="safetyWrapper">
		<div class="safetyContent sectionWrapper">
			<h1 class="titleText">{{ $t('page.features.section7.title') }}</h1>
			<div class="contentWrapper">
				<div class="contentBody">
					<p class="content">{{ $t('page.features.section7.desc1') }}</p>
				</div>
				<div class="contentBody">
					<p class="content">
						{{ $t('page.features.section7.desc2') }}
					</p>
				</div>
				<div class="contentBody">
					<p class="content">{{ $t('page.features.section7.desc3') }}</p>
				</div>
				<div class="contentBody frame">
					<img alt="Abstract maze image" src="/illust-item/maze.png" class="maze hide-pc" />
					<img alt="Abstract maze image" src="/illust-item/maze-2.png" class="maze hide-mb" />
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class SafetySection extends Vue {}
</script>

<style lang="scss" scoped>
// safety wrapper
.safetyWrapper {
	background-color: #3d3d3d;
}
.safetyContent {
	width: 100%;
	color: white;
	font-family: $poppins;
	padding-top: 71px;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 120px;
	}
	.titleText {
		font-weight: $font-semibold;
		font-size: 26px;
		line-height: 1.3;
		text-align: center;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 46px;
			line-height: 1.1;
		}
	}
	.contentWrapper {
		position: relative;
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 2fr));
		margin-top: 17px;
		overflow: hidden;
		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(3, minmax(0, 2fr));
			margin-top: 69px;
			padding-bottom: 280px;
			gap: 0 66px;
		}
		.contentBody {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 10px;
			@media (min-width: #{$breakpoint-xl}) {
				margin-bottom: 0;
			}

			&:nth-child(2) {
				margin-bottom: 10px;
				@media (min-width: #{$breakpoint-xl}) {
					margin-bottom: 0px;
				}
			}
			&:nth-child(3) {
				margin-bottom: 43px;
				@media (min-width: #{$breakpoint-xl}) {
					margin-bottom: 0px;
				}
			}
			&:last-child {
				margin-bottom: 0;
			}

			.content {
				line-height: 1.4;
				font-size: 14px;
				letter-spacing: 0.25px;
				font-family: $roboto;
				font-weight: $font-normal;
				padding: 10px;
				@media (min-width: #{$breakpoint-xl}) {
					font-size: 18px;
					line-height: 1.6;
				}
			}
			.maze {
				width: 100%;
				max-width: fit-content;
				grid-column: span 1 / span 1;
				@media (min-width: #{$breakpoint-xl}) {
					width: fit-content;
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					margin-bottom: -150px;
				}
			}
		}
	}
}
</style>
