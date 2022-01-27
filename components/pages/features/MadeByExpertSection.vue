<template>
	<section class="madeByExpertWrapper bg-offWhite">
		<div class="madeByExpertContent sectionWrapper">
			<h1 class="titleText boldTitle">{{ $t('page.features.section5.title') }}</h1>
			<div class="descTextWrapper">
				<p class="descText">
					{{ $t('page.features.section5.desc') }}
				</p>
			</div>
			<div class="contentWrapper">
				<div class="frame hide-mb">
					<img alt="Expert review screen" src="/captures/review-2.png" />
				</div>
				<div class="contentBody">
					<ul class="itemBox">
						<li class="content">{{ $t('page.features.section5.subDesc1') }}</li>
						<li class="content">
							{{ $t('page.features.section5.subDesc2') }}
						</li>
					</ul>
					<img alt="Expert review screen" class="hide-pc" src="/captures/review.png" />
				</div>
			</div>
		</div>
	</section>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
@Component
export default class MadeByExpert extends Vue {}
</script>

<style lang="scss" scoped>
// madeByExpert wrapper
.madeByExpertWrapper {
	.madeByExpertContent {
		width: 100%;
		position: relative;
		padding-top: 86px;
		padding-bottom: 240px;
		@media (min-width: #{$breakpoint-xl}) {
			padding-top: 120px;
			padding-bottom: 0;
		}
		.titleText {
			font-family: $poppins;
			font-weight: $font-semibold;
			font-size: 26px;
			line-height: 1.3;
			text-align: center;
			color: black;
			@media (min-width: #{$breakpoint-xl}) {
				font-size: 46px;
				line-height: 1.1;
			}
		}
		.contentWrapper {
			display: grid;
			grid-template-columns: repeat(1, minmax(0, 2fr));
			@media (min-width: #{$breakpoint-xl}) {
				grid-template-columns: repeat(3, minmax(0, 1fr));
			}
			.contentBody {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-top: 52px;
				@media (min-width: #{$breakpoint-xl}) {
					justify-content: flex-start;
				}

				img {
					position: absolute;
					bottom: 0;
					width: 100%;
					left: 50%;
					transform: translateX(-50%);
					max-width: fit-content;
					margin: 0 auto;
					@media (min-width: #{$breakpoint-xl}) {
						position: relative;
					}
				}
				&:nth-child(2) {
					@media (min-width: #{$breakpoint-xl}) {
						margin-top: 156px;
					}
				}
			}

			.itemBox li:nth-child(2) {
				margin-bottom: 20px;
			}
			.frame {
				@media (min-width: #{$breakpoint-xl}) {
					margin-top: 80px;
					grid-column: span 2 / span 2;
				}
			}
		}
		.descTextWrapper {
			margin-top: 17px;

			.descText {
				line-height: 1.4;
				font-size: 14px;
				text-align: center;
				color: rgba(0, 0, 0, 0.6);
				letter-spacing: 0.25px;
				font-family: $roboto;
				font-weight: $font-normal;
				@media (min-width: #{$breakpoint-xl}) {
					font-size: 18px;
					line-height: 1.6;
					max-width: 520px;
					margin: 0 auto;
				}
			}
		}
		.madeByExpertFrame {
			margin-top: 52px;
			@media (min-width: #{$breakpoint-xl}) {
				margin-left: 50%;
				margin-top: 82px;
			}
		}
		.contentTitle {
			font-size: 33px;
			line-height: 1.2;
			letter-spacing: 0.25px;
		}
		.content {
			line-height: 2;
			font-size: 14px;
			color: black;
			letter-spacing: 0.25px;
			font-family: $roboto;
			font-weight: $font-normal;
			margin-bottom: 32px;
			@media (min-width: #{$breakpoint-xl}) {
				margin-bottom: 56px;
			}
			.content:nth-child(2) {
				margin-bottom: 20px;
			}
		}
	}
}
</style>
