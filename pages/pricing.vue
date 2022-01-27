<template>
	<div>
		<section class="introSection">
			<div class="introInner sectionWrapper">
				<h1 class="titleText" v-html="$t('page.pricing.section1.title')"></h1>
				<p class="descText" v-html="$t('page.pricing.section1.desc')"></p>
				<img class="bottomImage" src="/illust-item/dollar-coins.png" alt="Stack of dollar coins" />
			</div>
		</section>

		<section class="sectionWrapper priceSection">
			<div class="cardsWrapper -mb">
				<v-carousel v-model="cardPage" height="fit-content" hide-delimiters :next-icon="false" :prev-icon="false">
					<v-carousel-item :key="1">
						<PricingCard
							:white="true"
							:title="$t('page.pricing.section2.card1.cardInnerTitle')"
							:img="false"
							:money="0"
							:desc="$t('page.pricing.section2.card1.cardInnerDesc')"
						/>
					</v-carousel-item>
					<v-carousel-item :key="2">
						<PricingCard
							:title="$t('page.pricing.section2.card2.cardInnerTitle')"
							:img="true"
							:money="49"
							:desc="$t('page.pricing.section2.card2.cardInnerDesc')"
						/>
					</v-carousel-item>
					<v-carousel-item :key="3">
						<PricingCard
							:white="true"
							:title="$t('page.pricing.section2.card3.cardInnerTitle')"
							:img="false"
							:desc="$t('page.pricing.section2.card3.cardInnerDesc')"
						/>
					</v-carousel-item>
				</v-carousel>
			</div>
			<div class="hide-pc paginationWrapper">
				<DotPagination :from-zero="true" :size="1" :page="cardPage" :total="3" @onchange="onChangePage" />
			</div>

			<div class="cardsWrapper -pc">
				<PricingCard
					:white="true"
					:title="$t('page.pricing.section2.card1.cardInnerTitle')"
					:img="false"
					:money="0"
					:desc="$t('page.pricing.section2.card1.cardInnerDesc')"
				/>
				<PricingCard
					:title="$t('page.pricing.section2.card2.cardInnerTitle')"
					:img="true"
					:money="49"
					:desc="$t('page.pricing.section2.card2.cardInnerDesc')"
				/>
				<PricingCard
					:white="true"
					:title="$t('page.pricing.section2.card3.cardInnerTitle')"
					:img="false"
					:desc="$t('page.pricing.section2.card3.cardInnerDesc')"
				/>
			</div>

			<div class="comment">
				<div class="hide-pc">
					<img alt="smiling circle character" src="/characters/laugh-1.png" />
				</div>
				<div>
					<p>{{ $t('page.pricing.section2.desc') }}</p>
				</div>
			</div>
		</section>

		<section class="sectionWrapper featuresSection">
			<h2 class="titleText">{{ $t('page.pricing.section3.title') }}</h2>
			<div class="wrapperContainer">
				<div class="cardsWrapper">
					<div class="featureCard -mint">
						<h3 class="feature">{{ $t('page.pricing.section3.card1.title') }}</h3>
						<p class="featureDesc">
							{{ $t('page.pricing.section3.card1.desc') }}
						</p>
					</div>
					<div class="featureCard">
						<h3 class="feature">{{ $t('page.pricing.section3.card2.title') }}</h3>
						<ul class="featureDesc">
							<li>{{ $t('page.pricing.section3.card2.desc1') }}</li>
							<li>{{ $t('page.pricing.section3.card2.desc2') }}</li>
						</ul>
					</div>
					<div class="featureCard -mint">
						<h3 class="feature">{{ $t('page.pricing.section3.card3.title') }}</h3>
						<p class="featureDesc">{{ $t('page.pricing.section3.card3.desc') }}</p>
					</div>
				</div>
				<div class="cardsWrapper">
					<div class="featureCard">
						<h3 class="feature">{{ $t('page.pricing.section3.card4.title') }}</h3>
						<p class="featureDesc" v-html="$t('page.pricing.section3.card4.desc')"></p>
					</div>
					<div class="featureCard -mint">
						<h3 class="feature">{{ $t('page.pricing.section3.card5.title') }}</h3>
						<ul class="featureDesc">
							<li>{{ $t('page.pricing.section3.card5.desc1') }}</li>
							<li>{{ $t('page.pricing.section3.card5.desc2') }}</li>
						</ul>
					</div>
					<div class="featureCard">
						<h3 class="feature">{{ $t('page.pricing.section3.card6.title') }}</h3>
						<p class="featureDesc">
							{{ $t('page.pricing.section3.card6.desc') }}
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- <section class="sectionWrapper vipSection">
			<div class="vipCard">
				<div class="imageWrapper hide-mb">
					<img alt="The circle character wearing headphones" src="/characters/smile-headphone.png" />
				</div>
				<div class="contentWrapper">
					<div class="titleText">VIP treatment</div>
					<div class="descText">
						Want something more personal? We’ll get on the phone to guide you step by step, from start to finish.
					</div>
					<div>
						<Button :height="44" :width="128"  :rounded="true" color="primary" :fontsize="14"
							>Join waitlist</Button
						>
					</div>
				</div>
				<div class="moneyWrapper">
					<span class="dollar text-white">$</span>
					<span class="money text-white">249</span>
					<br class="hide-pc" />
					<span class="per">per tax year</span>
				</div>

				<img class="hide-pc" alt="The circle character wearing headphones" src="/characters/smile-headphone-mb.png" />
			</div>
		</section> -->

		<CountMeInSection />
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import Button from '~/components/button/Button.vue';
import DotPagination from '~/components/pagination/DotPagination.vue';
import { metaInfo } from '~/utils/application';
import CountMeInSection from '~/components/section/CountMeInSection.vue';
import PricingCard from '~/components/pages/pricing/pricingCard.vue';

@Component({
	components: {
		Button,
		DotPagination,
		PricingCard,
		CountMeInSection,
	},
})
export default class Pricing extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'Pricing',
		);
	}

	cardPage: number = 1;

	onChangePage(num: number) {
		this.cardPage = num;
	}
}
</script>

<style lang="scss" scoped>
.introSection {
	background-color: $outline;
	font-family: $poppins;
	text-align: center;
	position: relative;
	overflow: hidden;
	margin-bottom: 35px;
	@media (min-width: #{$breakpoint-xl}) {
		margin-bottom: 102px;
	}

	.introInner {
		padding-top: 70px;
		padding-bottom: 124px;
		@media (min-width: #{$breakpoint-xl}) {
			padding-top: 100px;
			padding-bottom: 128px;
		}
		.titleText {
			font-weight: $font-semibold;
			font-size: 26px;
			line-height: 1.4;
			margin-bottom: 14px;
			@media (min-width: #{$breakpoint-xl}) {
				font-size: 48px;
				letter-spacing: -0.5px;
			}
		}

		.descText {
			color: $primaryLight;
			font-size: 14px;
			letter-spacing: 0.15px;
			line-height: 1.7;
			font-weight: $font-medium;
			@media (min-width: #{$breakpoint-xl}) {
				font-weight: $font-normal;
				font-size: 19px;
			}
		}

		.bottomImage {
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			width: calc(100vw - 100px);
			max-width: fit-content;
		}
	}
}

.priceSection {
	margin-bottom: 90px;
	@media (min-width: #{$breakpoint-xl}) {
		margin-bottom: 143px;
	}

	.cardsWrapper {
		position: relative;

		&.-pc {
			display: none;
			@media (min-width: #{$breakpoint-xl}) {
				display: grid;
				gap: 20px;
				grid-template-columns: repeat(3, minmax(0, 1fr));
			}
		}
		&.-mb {
			@media (min-width: #{$breakpoint-xl}) {
				display: none;
			}
		}
	}

	.paginationWrapper {
		margin-top: 24px;
	}

	.comment {
		margin-top: 52px;
		display: flex;
		gap: 20px;
		font-size: 14px;
		letter-spacing: 0.25px;
		color: $primaryLight;
		line-height: 1.4;
		@media (min-width: #{$breakpoint-xl}) {
			justify-content: center;
			align-items: center;
			font-size: 18px;
		}
	}
}

.featuresSection {
	// margin-bottom: 35px;
	margin-bottom: 120px;
	@media (min-width: #{$breakpoint-xl}) {
		// margin-bottom: 48px;
		margin-bottom: 140px;
	}

	.titleText {
		margin-bottom: 24px;
		font-size: 26px;
		text-align: center;
		font-weight: $font-semibold;
		line-height: 1.4;
		font-family: $poppins;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 46px;
			margin-bottom: 76px;
		}
	}

	.wrapperContainer {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: 12px;
		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 20px;
		}
		.cardsWrapper {
			display: grid;
			grid-template-columns: repeat(1, minmax(0, 1fr));
			gap: 12px;
			@media (min-width: #{$breakpoint-xl}) {
				gap: 20px;
			}

			.featureCard {
				padding: 20px;
				padding-bottom: 24px;
				background-color: $offWhite;
				border-radius: $round-lg;
				@media (min-width: #{$breakpoint-xl}) {
					padding-top: 28px;
					padding-left: 40px;
					padding-right: 40px;
					padding-bottom: 40px;
				}

				@media (min-width: #{$breakpoint-xl}) {
					height: 196px;

					&:first-child {
						height: 186px;
					}
					&:last-child {
						height: 186px;
					}
				}

				&.-mint {
					background-color: $secondaryPale;
				}

				.feature {
					font-family: $poppins;
					font-weight: $font-semibold;
					font-size: 19px;
					letter-spacing: 0.15px;
					line-height: 1.55;
					color: $primary;
					margin-bottom: 4px;
					@media (min-width: #{$breakpoint-xl}) {
						margin-bottom: 8px;
						font-size: 23px;
					}
				}

				.featureDesc {
					font-size: 13px;
					letter-spacing: 0.25px;
					line-height: 1.5;
					color: $primaryLight;
					@media (min-width: #{$breakpoint-xl}) {
						font-size: 18px;
					}
				}
			}
		}
	}
}

// .vipSection {
// 	.vipCard {
// 		color: $white;
// 		padding: 56px 32px;
// 		padding-bottom: 200px;
// 		background-color: $purple;
// 		border-radius: $round-lg;
// 		text-align: center;
// 		font-family: $poppins;
// 		position: relative;

// 		.contentWrapper {
// 			.titleText {
// 				font-size: 33px;
// 				font-weight: $font-medium;
// 				line-height: 1;
// 				margin-bottom: 20px;
// 				@media (min-width: #{$breakpoint-xl}) {
// 					font-size: 46px;
// 					line-height: 1.1;
// 					margin-bottom: 14px;
// 				}
// 			}

// 			.descText {
// 				font-size: 13px;
// 				letter-spacing: 0.15px;
// 				line-height: 1.6;
// 				margin-bottom: 24px;
// 				@media (min-width: #{$breakpoint-xl}) {
// 					margin-bottom: 32px;
// 					font-size: 19px;
// 				}
// 			}
// 		}

// 		.moneyWrapper {
// 			position: absolute;
// 			right: 40px;
// 			bottom: 56px;
// 			z-index: 2;

// 			.per {
// 				padding-left: 24px;
// 				padding-top: 8px;
// 				display: inline-block;
// 			}
// 		}

// 		img {
// 			position: absolute;
// 			left: 0;
// 			bottom: 40px;
// 			z-index: 1;
// 		}

// 		@media (min-width: #{$breakpoint-xl}) {
// 			display: grid;
// 			gap: 24px;
// 			grid-template-columns: repeat(12, minmax(0, 1fr));
// 			padding: 0;
// 			padding-top: 52px;
// 			padding-bottom: 34px;
// 			text-align: left;

// 			.imageWrapper {
// 				grid-column: span 2 / span 2;
// 			}

// 			.contentWrapper {
// 				grid-column: span 6 / span 6;
// 			}

// 			.moneyWrapper {
// 				top: calc(50% + 10px);
// 				right: 60px;
// 				transform: translateY(-50%);
// 				.per {
// 					padding-left: 0;
// 				}
// 			}
// 		}
// 	}
// }
</style>
