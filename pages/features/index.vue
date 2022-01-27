<template>
	<div>
		<section class="introWrapper">
			<div class="introInner sectionWrapper">
				<h1 class="titleText">{{ $t('page.features.section1.title') }}</h1>
				<div class="descTextWrapper">
					<p class="descText" v-html="$t('page.features.section1.desc')"></p>
				</div>
				<div class="startButton">
					<CountMeInButton :width="150" :height="52" :fontsize="16" />
				</div>
				<img class="hide-pc" alt="A smiling circle character." src="/characters/smile-7-mb.png" />
				<img class="hide-mb" alt="A smiling circle character." src="/characters/smile-7.png" />
			</div>
		</section>

		<section class="promiseWrapper sectionWrapper">
			<h1 class="titleText">{{ $t('page.features.section2.title') }}</h1>
			<div class="promiseCircleWrapper">
				<div class="promiseCircle">
					<div>
						<img alt="features1" class="circle" src="/illust-item/easy-usability.png" />
					</div>
					<div class="circleText -large">
						<p v-html="$t('page.features.section2.desc1')"></p>
					</div>
				</div>

				<div class="promiseCircle">
					<div>
						<img alt="features2" class="circle" src="/illust-item/no-transaction.png" />
					</div>
					<div class="circleText -large">
						<p>{{ $t('page.features.section2.desc2') }}</p>
					</div>
				</div>

				<div class="promiseCircle">
					<div>
						<img alt="features3" class="circle" src="/illust-item/accurate-algorithms.png" />
					</div>
					<div class="circleText">
						<p>{{ $t('page.features.section2.desc3') }}</p>
					</div>
				</div>
				<div class="promiseCircle">
					<div>
						<img alt="features4" class="circle" src="/illust-item/money-saving.png" />
					</div>
					<div class="circleText">
						<p>{{ $t('page.features.section2.desc4') }}</p>
					</div>
				</div>

				<div class="promiseCircle">
					<div>
						<img alt="features5" class="circle lockCircle" src="/illust-item/high-security.png" />
					</div>
					<div class="circleText">
						<p>{{ $t('page.features.section2.desc5') }}</p>
					</div>
				</div>
			</div>
		</section>
		<div class="bg-offWhite">
			<section class="hustleWrapper sectionWrapper">
				<div class="hustleContent">
					<h1 class="titleText">{{ $t('page.features.section3.title') }}</h1>
					<div class="descTextWrapper">
						<p v-html="$t('page.features.section3.desc')"></p>
					</div>
					<div class="hustleFrame">
						<img
							alt="screen indicating the processing of data processing."
							class="analyze hide-pc"
							src="/illust-item/data-analyze.png"
						/>
						<img
							alt="screen indicating the processing of data processing."
							class="analyze hide-mb"
							src="/illust-item/data-analyze.png"
						/>
						<img alt="A screen that shows success." src="/illust-item/report.png" class="report" />
						<img alt="Pig tail line." src="/lines/line-3.png" class="line" />
					</div>
				</div>
			</section>
		</div>

		<NoHiddenSection />
		<MadeByExpert />
		<GuaranteeSection />
		<SafetySection />
		<CountMeInSection />
		<!-- <ReferSection /> -->
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import NoHiddenSection from '~/components/pages/features/NoHiddenSection.vue';
import MadeByExpert from '~/components/pages/features/MadeByExpertSection.vue';
import GuaranteeSection from '~/components/pages/features/GuaranteeSection.vue';
import SafetySection from '~/components/pages/features/SafetySection.vue';
import ReferSection from '~/components/section/ReferSection.vue';
import CountMeInSection from '~/components/section/CountMeInSection.vue';

import { metaInfo } from '~/utils/application';
import CountMeInButton from '~/components/button/CountMeInButton.vue';
@Component({
	components: {
		CountMeInButton,
		NoHiddenSection,
		GuaranteeSection,
		SafetySection,
		MadeByExpert,
		CountMeInSection,
		ReferSection,
	},
})
export default class Features extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'Why Cointelli',
		);
	}
}
</script>
<style lang="scss" scoped>
// intro wrapper
.introWrapper {
	background-color: $purpleDarkPale;
	text-align: center;

	.introInner {
		padding-top: 120px;
		padding-bottom: 194px;
		@media (min-width: #{$breakpoint-xl}) {
			padding-top: 68px;
			padding-bottom: 68px;
		}
		position: relative;
		font-family: $poppins;

		.titleText {
			font-size: 26px;
			font-weight: $font-semibold;
			text-align: center;
			color: $primary;
			line-height: 1.4;
			// margin-bottom: 10px;
			@media (min-width: #{$breakpoint-xl}) {
				font-size: 48px;
				line-height: 1.9;
			}
		}
		.descTextWrapper {
			.descText {
				line-height: 1.7;
				font-size: 14px;
				font-weight: $font-medium;
				text-align: center;
				color: $primaryLight;
				letter-spacing: 0.15px;

				@media (min-width: #{$breakpoint-xl}) {
					font-size: 19px;
					line-height: 1.5;
					letter-spacing: 0.25px;
				}
			}
		}
		.startButton {
			margin-top: 25px;
			display: flex;
			justify-content: center;
		}

		img {
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			@media (min-width: #{$breakpoint-xl}) {
				left: calc(25% - 150px);
			}
		}
	}
}
//promise wrapper
.promiseWrapper {
	font-family: $poppins;
	padding-top: 62px;
	padding-bottom: 120px;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 120px;
	}

	.titleText {
		text-align: center;
		font-size: 26px;
		font-weight: $font-semibold;
		line-height: 1.3;
		color: $primary;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 46px;
			line-height: 1.1;
		}
	}

	.promiseCircleWrapper {
		display: grid;
		padding-top: 49px;
		gap: 50px 32px;
		grid-template-columns: repeat(2, minmax(0, 2fr));
		@media (min-width: #{$breakpoint-xl}) {
			gap: 18px;
			padding-top: 50px;
			grid-template-columns: repeat(5, minmax(0, 2fr));
		}
		.promiseCircle {
			display: flex;
			flex-direction: column;
			align-items: center;

			&:last-child {
				grid-column: span 2 / span 2;
				margin-bottom: 0px;
				@media (min-width: #{$breakpoint-xl}) {
					grid-column: span 1 / span 1;
				}
			}
			.circle {
				width: 100%;
				max-width: fit-content;
				border-radius: $round-full;
				font-family: $poppins;
				margin-bottom: 22px;
			}
			.circleText {
				font-size: 17px;
				line-height: 1.5;
				text-align: center;
				font-family: $poppins;
				font-weight: $font-medium;
				width: 100%;
				max-width: 120px;
				@media (min-width: #{$breakpoint-xl}) {
					&.-large {
						max-width: 220px;
					}
					font-size: 19px;
				}
			}
		}
	}
}
// hustle wrapper
.hustleWrapper {
	// padding-top: 120px;
	padding-bottom: 61px;
	@media (min-width: #{$breakpoint-xl}) {
		padding-bottom: 580px;
	}
	.hustleContent {
		.titleText {
			font-family: $poppins;
			font-weight: $font-semibold;
			font-size: 26px;
			line-height: 1.4;
			text-align: center;
			color: black;
			padding-top: 86px;
			margin-bottom: 12px;
			@media (min-width: #{$breakpoint-xl}) {
				margin-bottom: 21px;
				padding-top: 120px;
				font-size: 46px;
				line-height: 1;
				font-weight: $font-semibold;
			}
		}
		.descTextWrapper {
			margin-bottom: 30px;
			@media (min-width: #{$breakpoint-xl}) {
			}
			p {
				line-height: 1.4;
				font-size: 14px;
				text-align: center;
				color: $primaryLight;
				letter-spacing: 0.25px;
				font-family: $roboto;
				font-weight: $font-normal;
				@media (min-width: #{$breakpoint-xl}) {
					font-size: 18px;
					line-height: 1.6;
				}
			}
		}
		.hustleFrame {
			text-align: center;
			position: relative;
			img {
				width: 100%;
				max-width: fit-content;
				@media (min-width: #{$breakpoint-xl}) {
					position: absolute;
				}

				&.analyze {
					@media (min-width: #{$breakpoint-xl}) {
						top: 0;
						left: calc(50% - 200px);
						transform: translateX(-50%);
					}
				}

				&.report {
					display: none;
					@media (min-width: #{$breakpoint-xl}) {
						display: block;
						top: 70px;
						left: calc(50% - 140px);
					}
				}
				&.line {
					display: none;
					@media (min-width: #{$breakpoint-xl}) {
						display: block;
						top: 190px;
						left: calc(50% + 280px);
					}
				}
			}
		}
	}
}
</style>
