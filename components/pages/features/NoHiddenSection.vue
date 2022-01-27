<template>
	<section class="noHiddenWrapper sectionWrapper">
		<div class="noHiddenContent">
			<h1 class="titleText">{{ $t('page.features.section4.title') }}</h1>
			<div class="descTextWrapper">
				<p class="descText" v-html="$t('page.features.section4.desc')"></p>
			</div>

			<div class="noHiddenFrame">
				<div class="ellipse">
					<div class="imageWrapper">
						<img class="star" src="/illust-item/star.png" />
						<img class="smile" src="/characters/smile-8.png" />
						<img class="wink" src="/characters/smile-wink.png" />
					</div>
					<div>
						<p class="text">{{ $t('page.features.section4.question1') }}</p>
						<p class="text">{{ $t('page.features.section4.hideDesc1') }}</p>
					</div>
				</div>
				<div class="ellipse">
					<div class="imageWrapper">
						<img class="star" src="/illust-item/star.png" />
						<img class="smile" src="/characters/smile-8.png" />
						<img class="wink" src="/characters/smile-wink.png" />
					</div>
					<div>
						<p class="text">{{ $t('page.features.section4.question2') }}</p>
						<p class="text">
							{{ $t('page.features.section4.hideDesc2') }}
						</p>
					</div>
				</div>
				<div class="ellipse">
					<div class="imageWrapper">
						<img class="star" src="/illust-item/star.png" />
						<img class="smile" src="/characters/smile-8.png" />
						<img class="wink" src="/characters/smile-wink.png" />
					</div>
					<div>
						<p class="text">{{ $t('page.features.section4.question3') }}</p>
						<p class="text">
							{{ $t('page.features.section4.hideDesc3') }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
@Component
export default class NoHiddenSection extends Vue {}
</script>

<style lang="scss" scoped>
@mixin transition {
	transition: all 0.2s ease-in-out;
}

.noHiddenWrapper {
	// background-color: $offWhite;
	padding-top: 86px;
	padding-bottom: 120px;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 120px;
		padding-bottom: 100px;
	}
	.noHiddenContent {
		width: 100%;
		.titleText {
			font-family: $poppins;
			font-weight: $font-semibold;
			font-size: 26px;
			line-height: 1.3;
			text-align: center;
			color: $primary;
			@media (min-width: #{$breakpoint-xl}) {
				font-size: 46px;
				line-height: 1.1;
				font-weight: $font-semibold;
			}
		}
		.descTextWrapper {
			margin-top: 12px;
			@media (min-width: #{$breakpoint-xl}) {
				margin-top: 20px;
			}
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
					line-height: 1.1;
				}
			}
		}
		.noHiddenFrame {
			overflow: hidden;
			margin-top: 50px;

			@media (min-width: #{$breakpoint-xl}) {
				display: flex;
				justify-content: center;
				margin-top: 80px;
				margin-bottom: 60px;
			}
		}
		.ellipse {
			@include transition();
			width: 100vw;
			height: 100vh;
			max-width: 280px;
			max-height: 280px;
			border-radius: $round-xxl;
			border: 1px solid $primary;
			box-sizing: border-box;
			display: flex;
			gap: 8px;
			flex-direction: column;
			margin: 0 auto;
			justify-content: center;
			align-items: center;
			text-align: center;
			&:first-child {
				margin-bottom: -30px;
			}
			&:last-child {
				margin-top: -30px;
			}
			@media (min-width: #{$breakpoint-xl}) {
				max-width: 400px;
				max-height: 400px;
				margin: 0;
				&:first-child {
					margin: 0;
					margin-right: -40px;
				}
				&:last-child {
					margin: 0;
					margin-left: -40px;
				}
			}

			p {
				display: flex;
				justify-content: center;
				align-items: center;
				letter-spacing: 0.25px;

				&:first-child {
					font-family: $poppins;
					font-size: 24px;
					line-height: 1.5;
					font-weight: $font-semibold;
					display: block;
					max-width: 200px;
					margin: 0 auto;
				}

				&:last-child {
					font-family: $roboto;
					font-style: normal;
					font-weight: normal;
					font-size: 16px;
					line-height: 1.6;
					max-width: calc(100% - 40px);
					margin: 0 auto;
					@media (min-width: #{$breakpoint-xl}) {
						font-size: 18px;
					}
					padding-bottom: 12px;
					display: none;
				}
			}

			&:hover {
				background: black;
				color: white;

				p {
					&:first-child {
						display: none;
					}

					&:last-child {
						display: block;
					}
				}

				.imageWrapper {
					.star {
						opacity: 1;
						max-width: 100%;
						max-height: 100%;
						left: -20px;
						top: -10px;
					}
					.smile {
						display: none;
					}
					.wink {
						display: block;
					}
				}
			}

			.imageWrapper {
				position: relative;
				.star {
					@include transition();
					position: absolute;
					opacity: 0;
					max-height: 0;
					max-width: 0;
					left: 0;
					top: 0;
				}
				.smile {
					display: block;
				}
				.wink {
					display: none;
				}
			}
		}
	}
}
</style>
