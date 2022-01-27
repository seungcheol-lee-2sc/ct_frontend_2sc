<template>
	<div style="overflow: hidden">
		<section class="introSection">
			<img alt="A smiling circle character." class="smileImage hide-pc" src="/characters/look-smile-1-mb.png" />
			<img alt="A smiling circle character." class="smileImage hide-mb" src="/characters/look-smile-1-pc.png" />
			<h1 class="titleText">{{ $t('page.howCointelliWorks.section1.title') }}</h1>
			<div class="featuresSubTitle">{{ $t('page.howCointelliWorks.section1.desc') }}</div>
			<CountMeInButton :fontsize="16" :height="52" :width="147" />
		</section>
		<section class="explainSection sectionWrapper">
			<img alt="Green coin" class="greenCoin hide-pc" src="/illust-item/green-coin-mb.png" />
			<img alt="Green coin" class="greenCoin hide-mb" src="/illust-item/green-coin-pc.png" />
			<img alt="Red coin" class="redCoin hide-pc" src="/illust-item/red-coin-mb.png" />
			<img alt="Red coin" class="redCoin hide-mb" src="/illust-item/red-coin-pc.png" />

			<div class="titleTextWrapper">
				<h2 class="titleText">{{ $t('page.howCointelliWorks.section2.title') }}</h2>
				<img alt="underline" class="underlineImage" src="/lines/underline-1.png" />
			</div>
			<div class="descText" v-html="$t('page.howCointelliWorks.section2.desc')"></div>
			<LinkText to="/crypto-tax-guide" :text-size="isMobile ? 14 : 15">
				{{ $t('page.howCointelliWorks.section2.link') }}
			</LinkText>
		</section>

		<section class="howItWorksSection">
			<div class="titleText">
				<h2>{{ $t('page.howCointelliWorks.section3.title') }}</h2>

				<h3>{{ $t('page.howCointelliWorks.section3.desc') }}</h3>
			</div>
			<div class="notebookCase">
				<img class="hide-pc" alt="The laptop with the start screen of 'Cointelli'." src="/captures/notebook-1-mb.png" />
				<img class="hide-mb" alt="The laptop with the start screen of 'Cointelli'." src="/captures/notebook-1-pc.png" />
			</div>
		</section>

		<section class="roadSection">
			<img alt="A map to indicate the tax reporting level." class="roadImage hide-pc" src="/road/road-mb.png" />
			<img alt="A map to indicate the tax reporting level." class="roadImage hide-mb" src="/road/road-pc.png" />
			<div class="part -top">
				<div class="stepItem">
					<h4 class="category">{{ $t('page.howCointelliWorks.roadSection.title1') }}</h4>
					<h5 class="titleText">{{ $t('page.howCointelliWorks.roadSection.subTitle1') }}</h5>
					<p class="descText">{{ $t('page.howCointelliWorks.roadSection.desc1') }}</p>
				</div>
				<div class="stepItem -right -second">
					<h4 class="category">{{ $t('page.howCointelliWorks.roadSection.title2') }}</h4>
					<h5 class="titleText">{{ $t('page.howCointelliWorks.roadSection.subTitle2') }}</h5>
					<p class="descText">
						{{ $t('page.howCointelliWorks.roadSection.desc2') }}
					</p>
				</div>
			</div>
			<div class="part -middle">
				<img alt="Pig tail line." class="lineImage" src="/lines/line-4.png" />
				<div class="stepItem -black -third">
					<img alt="Three lines to emphasize." class="effectImage hide-pc" src="/effects/effect-1-mb.png" />
					<img alt="Three lines to emphasize." class="effectImage hide-mb" src="/effects/effect-1-pc.png" />
					<span class="numberCircle"> 3 </span>
					<h4 class="category">{{ $t('page.howCointelliWorks.roadSection.title3') }}</h4>
					<h5 class="titleText" v-html="$t('page.howCointelliWorks.roadSection.subTitle3')"></h5>
					<p class="descText" v-html="$t('page.howCointelliWorks.roadSection.desc3')"></p>
					<div class="imageWrapper">
						<img class="hide-pc" alt="bubbling" src="/illust-item/shine-bubble-mb.png" />
						<img class="hide-mb" alt="bubbling" src="/illust-item/shine-bubble-pc.png" />
						<br />
						<img class="hide-pc" alt="Cointelli tax report page." src="/captures/tax-report-mb.png" />
						<img class="hide-mb" alt="Cointelli tax report page." src="/captures/tax-report-pc.png" />
					</div>
				</div>
			</div>
			<div class="part -bottom">
				<div class="stepItem -forth">
					<h4 class="category">{{ $t('page.howCointelliWorks.roadSection.title4') }}</h4>
					<h5 class="titleText">{{ $t('page.howCointelliWorks.roadSection.subTitle4') }}</h5>
					<div class="descText">
						<p v-html="$t('page.howCointelliWorks.roadSection.desc4')"></p>
					</div>
					<div class="imageWrapper">
						<img
							class="hide-pc"
							alt="Capture clicking on the button to send the report."
							src="/captures/send-report-mb.png"
						/>
						<img
							class="hide-mb"
							alt="Capture clicking on the button to send the report."
							src="/captures/send-report-pc.png"
						/>
						<img
							alt="Firecrackers and a smiling circle character."
							class="hide-pc"
							style="display: block; margin-left: auto"
							src="/characters/congratulation-mb.png"
						/>
					</div>
				</div>
			</div>
		</section>

		<CountMeInSection />
	</div>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import CountMeInButton from '~/components/button/CountMeInButton.vue';
import CountMeInSection from '~/components/section/CountMeInSection.vue';
import LinkText from '~/components/text/LinkText.vue';
import { metaInfo } from '~/utils/application';

@Component({
	components: {
		CountMeInButton,
		LinkText,
		CountMeInSection,
	},
})
export default class HowCointelliWorks extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'How cointelli works',
		);
	}

	@State(state => state.isMobile) isMobile!: boolean;
}
</script>

<style lang="scss">
.explainSection {
	.descText {
		> span {
			font-weight: $font-bold;
		}

		@media (min-width: #{$breakpoint-xl}) {
			> span {
				display: block;
			}
		}
	}
}
</style>

<style lang="scss" scoped>
.introSection {
	position: relative;
	padding-top: 120px;
	padding-bottom: 68px;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 84px;
	}
	background-color: $purpleDarkPale;
	display: flex;
	flex-direction: column;
	align-items: center;

	.smileImage {
		position: absolute;
		right: 0;
		top: 0;
		z-index: 1;
	}

	.titleText {
		z-index: 2;
		margin-bottom: 14px;
		font-family: $poppins;
		font-size: 26px;
		font-weight: $font-semibold;
		line-height: 1.4;
		text-align: center;
		max-width: 300px;
		@media (min-width: #{$breakpoint-xl}) {
			max-width: initial;
			font-size: 48px;
		}
	}

	.featuresSubTitle {
		z-index: 2;
		margin-bottom: 30px;
		text-align: center;
		font-family: $poppins;
		font-size: 19px;
		line-height: 30px;
		letter-spacing: 0.15px;
		color: $primaryLight;
		max-width: 267px;
		@media (min-width: #{$breakpoint-xl}) {
			margin-bottom: 45px;
			max-width: none;
		}
	}
}

.explainSection {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	padding-top: 81px;
	padding-bottom: 131px;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 120px;
		padding-bottom: 191px;
	}
	.greenCoin {
		position: absolute;
		right: 0px;
		top: 28px;
		@media (min-width: #{$breakpoint-xl}) {
			position: absolute;
			top: 120px;

			width: 75.32px;
			height: 75.32px;
		}
	}
	.titleTextWrapper {
		margin-bottom: 18px;
		@media (min-width: #{$breakpoint-xl}) {
			margin-bottom: 30px;
		}
		.titleText {
			font-family: $poppins;
			font-size: 24px;
			font-weight: 600;
			line-height: 1.4;
			text-align: center;
			max-width: 240px;
			@media (min-width: #{$breakpoint-xl}) {
				font-size: 46px;
				line-height: 60px;
				max-width: initial;
			}
		}
		.underlineImage {
			display: none;
			@media (min-width: #{$breakpoint-xl}) {
				display: block;
			}
		}
	}

	.descText {
		display: block;
		text-align: center;
		color: $disabled;
		font-size: 14px;
		line-height: 1.43;
		letter-spacing: 0.25px;
		margin-bottom: 38px;
		max-width: 262px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 16px;
			max-width: 519px;
		}
	}

	.redCoin {
		position: absolute;
		left: 0px;
		top: 402px;
		@media (min-width: #{$breakpoint-xl}) {
			position: absolute;
			left: 90px;
			top: 375px;
			width: 110.92px;
			height: 110.92px;
		}
	}
}
.howItWorksSection {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	padding-bottom: 76px;
	@media (min-width: #{$breakpoint-xl}) {
		padding-bottom: 182px;
	}

	.titleText {
		text-align: center;
		font-family: $poppins;
		font-size: 24px;
		line-height: 1.67;
		@media (min-width: #{$breakpoint-xl}) {
		}

		> h2 {
			font-weight: 600;

			@media (min-width: #{$breakpoint-xl}) {
				font-weight: 600;
				font-size: 46px;
			}
		}
		> h3 {
			font-weight: 400;
			@media (min-width: #{$breakpoint-xl}) {
				font-size: 33px;
				font-weight: 400;
			}
		}

		margin-bottom: 38px;
		@media (min-width: #{$breakpoint-xl}) {
			margin-bottom: 60px;
		}
	}

	.notebookCase {
		text-align: center;
		img {
			width: 100%;
			max-width: fit-content;
		}
	}
}

$padding-lg: 60px;
$padding-sm: 10px;
$padding-lg-pc: 180px;
$padding-sm-pc: 10px;
$gap-minus: calc(-50vw + 160px);
$gap: calc(50vw - 160px);
$extra-space: 326px;
$extra-space-minus: -326px;
$extra-space-pc: 490px;
$extra-space-minus-pc: -620px;

$part-top: 415px;
$part-top-pc: 800px;
$part-middle: 448px;
$part-middle-pc: 611px;
$part-bottom: 90px;
$part-bottom-pc: 154px;

.roadSection {
	margin: 0 auto;
	max-width: 320px;
	position: relative;
	padding-bottom: $extra-space;
	margin-bottom: 120px;

	@media (min-width: #{$breakpoint-xl}) {
		padding-bottom: 508px;
		max-width: $content-size;
	}

	.roadImage {
		top: 0;
		position: absolute;
		mix-blend-mode: multiply;
		z-index: 10;
	}

	.part {
		position: relative;
		&.-top {
			height: $part-top;
			@media (min-width: #{$breakpoint-xl}) {
				height: $part-top-pc;
			}
		}
		&.-middle {
			height: $part-middle;
			background-color: $tertiaryLight;
			margin-left: $gap-minus;
			padding-right: 100vw;
			@media (min-width: #{$breakpoint-xl}) {
				padding-left: 100vw;
				height: $part-middle-pc;
			}
			.lineImage {
				display: none;
				@media (min-width: #{$breakpoint-xl}) {
					display: block;
					position: absolute;
					bottom: -228px;
				}
			}
		}
		&.-bottom {
			height: $part-bottom;
			@media (min-width: #{$breakpoint-xl}) {
				height: $part-bottom-pc;
			}
		}

		.stepItem {
			position: absolute;
			padding-left: $padding-lg;
			padding-right: $padding-sm;
			@media (min-width: #{$breakpoint-xl}) {
				padding-left: $padding-lg-pc;
				padding-right: $padding-sm-pc;
			}
			&.-right {
				padding-left: $padding-sm;
				padding-right: $padding-lg;
				text-align: right;
				@media (min-width: #{$breakpoint-xl}) {
					padding-left: 0;
					padding-right: 0;
				}
			}
			&.-black {
				.category {
					color: $primary;
				}
			}

			@mixin bigText {
				font-family: $poppins;
				font-size: 18px;
				font-weight: $font-semibold;
			}

			.category {
				@include bigText();
				line-height: 2;
				color: $secondary;
				@media (min-width: #{$breakpoint-xl}) {
					font-size: 46px;
					line-height: 1.1;
					margin-bottom: 24px;
				}
			}
			.titleText {
				@include bigText();
				line-height: 1.33;
				letter-spacing: 0.15px;
				margin-bottom: 10px;
				color: $primary;
				@media (min-width: #{$breakpoint-xl}) {
					font-size: 46px;
					line-height: 1.1;
					margin-bottom: 12px;
					font-weight: $font-normal;
				}
			}
			.descText {
				font-size: 13px;
				letter-spacing: 0.25px;
				line-height: 1.54;
				color: $primaryLight;
				text-align: left;
				margin-bottom: 15px;
				@media (min-width: #{$breakpoint-xl}) {
					font-size: 18px;
					line-height: 1.67;
					max-width: 545px;
					margin-bottom: 44px;
				}
			}
			.imageWrapper {
				img:first-child {
					padding-left: 8px;
				}
			}

			&.-second {
				bottom: 60px;
				@media (min-width: #{$breakpoint-xl}) {
					.category {
						margin-bottom: 65px;
					}
					.titleText {
						margin-bottom: 20px;
					}
					.descText {
						text-align: right;
						margin-left: auto;
					}
					bottom: 120px;
					right: 76px;
				}
			}

			&.-third {
				top: 53px;
				left: $gap;
				@media (min-width: #{$breakpoint-xl}) {
					top: 200px;
					$raised-height: -36px;
					$pushed-height: 36px;
					.imageWrapper {
						position: absolute;
						top: -124px;
						right: -500px;

						> img:first-child {
							margin-top: $raised-height;
							margin-bottom: $pushed-height;
						}
					}
				}

				.effectImage {
					position: absolute;
					left: -10px;
					top: -25px;
					@media (min-width: #{$breakpoint-xl}) {
						left: -20px;
						top: -70px;
					}
				}

				.numberCircle {
					position: absolute;
					background-color: $primary;
					left: 5px;
					width: 36px;
					height: 36px;
					border-radius: $round-full;
					color: $white;
					font-weight: $font-bold;
					display: flex;
					align-items: center;
					justify-content: center;

					@media (min-width: #{$breakpoint-xl}) {
						font-size: 44px;
						width: 72px;
						height: 72px;
						left: 40px;
						top: -14px;
					}
				}
			}

			&.-forth {
				bottom: 0;
				margin-bottom: $extra-space-minus;
				@media (min-width: #{$breakpoint-xl}) {
					margin-bottom: $extra-space-minus-pc;
				}
			}
		}
	}
}
</style>
