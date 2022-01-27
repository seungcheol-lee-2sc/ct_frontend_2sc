<template>
	<div>
		<!-- Intro -->
		<section class="introSectionWrapper">
			<div class="sectionWrapper" style="position: relative">
				<MovingObject
					:z-index="100"
					:size="EMovingObjSize.M"
					color="purpleLight"
					:left="isMobile ? '-10px' : '-100px'"
					top="-50px"
					:movement="EMoveType.BEAT"
				/>
				<MovingObject
					:z-index="100"
					:size="isMobile ? EMovingObjSize.L : EMovingObjSize.XXL"
					color="tertiary"
					:left="isMobile ? 'calc(100% - 30px)' : 'calc(52%)'"
					top="120px"
					:movement="EMoveType.BEAT"
				/>
				<h1 class="titleText" v-html="$t('page.main.section1.title')"></h1>
				<div class="descTextWrapper">
					<p class="descText" v-html="$t('page.main.section1.desc')"></p>
				</div>

				<WaitListForm
					form-id="topForm"
					align="left"
					:button-text="$t('page.main.section1.button')"
					button-id="main-top-waitlist-button"
					color="primary"
				/>

				<img
					class="hide-mb"
					style="position: absolute; top: 442px; left: -170px; z-index: 100"
					src="/lines/line-2.png"
				/>

				<div class="mainImageWrapper">
					<MovingObject
						:hide="!isMobile"
						:z-index="100"
						:size="0"
						left="calc(50% - 160px)"
						top="32px"
						img="/illust-item/note3-mb.png"
						:no-rounded="true"
					/>
					<MovingObject
						:hide="isMobile"
						:z-index="100"
						:size="0"
						left="300px"
						top="-140px"
						img="/illust-item/note2.png"
						:no-rounded="true"
					/>
					<MovingObject
						:hide="!isMobile"
						:z-index="100"
						:size="0"
						left="calc(50% - 100px)"
						top="-12px"
						img="/illust-item/note2-mb.png"
						:no-rounded="true"
					/>
					<MovingObject
						:hide="isMobile"
						:z-index="100"
						:size="0"
						left="160px"
						top="-40px"
						img="/illust-item/note3.png"
						:no-rounded="true"
					/>
					<MovingObject
						:hide="!isMobile"
						:z-index="100"
						:size="0"
						left="calc(50% + 20px)"
						top="-32px"
						img="/illust-item/note1-mb.png"
						:no-rounded="true"
					/>
					<MovingObject
						:hide="isMobile"
						:z-index="100"
						:size="0"
						left="420px"
						top="-60px"
						img="/illust-item/note1.png"
						:no-rounded="true"
					/>
					<img class="mainImage hide-pc" src="/illust/lying-down-woman-mb.png" />
					<img class="mainImage hide-mb" src="/illust/lying-down-woman.png" />
					<div class="hide-mb bigGreyEllipse"></div>
				</div>

				<!-- <div v-if="BUILD_ENV !== PRODUCTION" style="padding-right: 0; text-align: left">
					<span class="featuredIn">AS FEATURED IN</span>
					<div class="featuredInListWrapper noScroll">
						<div class="featuredInListInner">
							<div>
								<img src="/featured/forbes.png" />
							</div>
							<div>
								<img src="/featured/investing.png" />
							</div>
							<div>
								<img src="/featured/bitcoin.jpg" />
							</div>
							<div>
								<img src="/featured/bloomberg.png" />
							</div>
							<div>
								<img src="/featured/turbotax.jpg" />
							</div>
						</div>
					</div>
				</div> -->
			</div>
		</section>
		<!-- /Intro -->

		<!-- Merits -->
		<section class="meritSectionWrapper">
			<img class="arrow" src="/lines/arrow-line-2.png" alt="Pointing first feature image" />
			<div class="sectionWrapper">
				<h2 class="titleText">{{ $t('page.main.section2.title') }}</h2>

				<p class="descText">{{ $t('page.main.section2.desc') }}</p>

				<div class="meritsWrapper">
					<div class="meritCircle">
						<div class="number">1</div>
						<div class="desc" v-html="$t('page.main.section2.subDesc1')"></div>
					</div>
					<div class="meritCircle">
						<div class="number">2</div>
						<div class="desc" v-html="$t('page.main.section2.subDesc2')"></div>
					</div>
					<div class="meritCircle" style="position: relative">
						<MovingObject
							:hide="!isMobile"
							:size="0"
							left="calc(50% + 30px)"
							top="-30px"
							img="/illust-item/shining-1-mb.png"
							:no-rounded="true"
						/>
						<MovingObject
							:hide="isMobile"
							:size="0"
							left="calc(50% + 55px)"
							top="-30px"
							img="/illust-item/shining-1.png"
							:no-rounded="true"
						/>
						<MovingObject
							:hide="!isMobile"
							:size="0"
							left="calc(50% - 60px)"
							top="40px"
							img="/illust-item/shining-2-mb.png"
							:no-rounded="true"
						/>
						<MovingObject
							:hide="isMobile"
							:size="0"
							left="calc(50% - 136px)"
							top="116px"
							img="/illust-item/shining-2.png"
							:no-rounded="true"
						/>
						<div class="number yellow">3</div>
						<div class="desc" v-html="$t('page.main.section2.subDesc3')"></div>
					</div>
					<div class="meritCircle">
						<div class="number">4</div>
						<div class="desc" v-html="$t('page.main.section2.subDesc4')"></div>
					</div>
				</div>
			</div>
		</section>
		<!-- /Merits -->

		<!-- Features -->
		<section class="featureSectionWrapper">
			<div class="sectionWrapper">
				<h2 class="titleText">{{ $t('page.main.section3.title') }}</h2>
				<p class="descText">{{ $t('page.main.section3.desc') }}</p>

				<div class="contentWrapper">
					<div class="featureWrapper -reverse">
						<div class="featureItem -right">
							<div class="greyCircle"></div>
							<img class="auto-review" src="/captures/auto-review.png" alt="Captured auto review function" />
							<div class="text1" v-html="$t('page.main.section3.content1.imgText1')"></div>
							<img class="auto-fix" src="/captures/auto-fix.png" alt="Captured auto fix function" />
							<MovingObject
								v-show="!isMobile"
								:size="EMovingObjSize.L"
								color="purpleLight"
								left="calc(50% + 170px)"
								top="-8px"
								:movement="EMoveType.BEAT"
							/>
						</div>
						<div class="featureInfo">
							<div class="infoTitle">{{ $t('page.main.section3.content1.title') }}</div>
							<div class="infoDesc">
								{{ $t('page.main.section3.content1.desc') }}
							</div>
							<LinkText to="/features" inner-class="learnMore">
								{{ $t('page.main.section3.content1.link') }}
							</LinkText>
						</div>
					</div>
					<div class="featureWrapper -margin-bottom">
						<div class="featureItem">
							<div class="greyCircle"></div>
							<div class="text2">
								<span>$</span>
								<span>49</span>
								<br />
								<span>{{ $t('page.main.section3.content2.imgText1') }}</span>
							</div>
							<img class="no-hidden-cost" src="/texts/no-hidden-costs.png" alt="No hidden cost" />
							<!-- <img class="line-1 hide-pc" src="/lines/line-1.png" /> -->
							<img class="line-1 hide-mb" src="/lines/line-1-pc.png" />
							<MovingObject
								:size="EMovingObjSize.M"
								color="tertiary"
								:left="isMobile ? 'calc(50% - 180px)' : 'calc(50% + 50px)'"
								:top="isMobile ? '-35px' : '-90px'"
								:movement="EMoveType.BEAT"
							/>
							<img class="usd-coin hide-pc" src="/illust-item/usd-coin.png" alt="Usd coin" />
							<img class="usd-coin hide-mb" src="/illust-item/usd-coin-pc.png" alt="Usd coin" />
						</div>
						<div class="featureInfo">
							<div class="infoTitle">{{ $t('page.main.section3.content2.title') }}</div>
							<div class="infoDesc">
								{{ $t('page.main.section3.content2.desc') }}
							</div>
							<LinkText to="/pricing" inner-class="learnMore">
								{{ $t('page.main.section3.content2.link') }}
							</LinkText>
						</div>
					</div>
					<div class="featureWrapper -reverse">
						<div class="featureItem">
							<div class="greyCircle"></div>
							<div class="everyday">
								<div>
									<div>24/7</div>
									<div>{{ $t('page.main.section3.content3.imgText1') }}</div>
								</div>
							</div>
							<img class="smilingCircle" src="/characters/smile-1.png" alt="Smiling circle" />
							<div class="smallGreyCircle num1">
								<img class="hide-pc" src="/icon/message-1.png" alt="Messege icon" />
								<img class="hide-mb" src="/icon/message-1-pc.png" alt="Messege icon" />
							</div>
							<div class="smallGreyCircle num2">
								<img class="hide-pc" src="/icon/phone-1.png" alt="Phone icon" />
								<img class="hide-mb" src="/icon/phone-1-pc.png" alt="Phone icon" />
							</div>
						</div>
						<div class="featureInfo">
							<div class="infoTitle">{{ $t('page.main.section3.content3.title') }}</div>
							<div class="infoDesc">
								{{ $t('page.main.section3.content3.desc') }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- /Features -->

		<!-- <ReviewSection /> -->
		<CountMeInSection />
		<ReferSection v-if="!FINAL_PRODUCTION" />
	</div>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import { FINAL_PRODUCTION } from '~/utils/constants';
import { EStrapiImageSize, getStrapiImageSrc, metaInfo } from '~/utils/application';
import { nl2br } from '~/utils/string';
import { LOAD_REVIEWS } from '~/store/content';
import { getSingleItem } from '~/utils/func';
import MovingObject, { EMovingObjSize, EMoveType } from '~/components/item/MovingObject.vue';
import StarRating from '~/components/StarRating.vue';
import DotPagination from '~/components/pagination/DotPagination.vue';
import CountMeInSection from '~/components/section/CountMeInSection.vue';
import ReferSection from '~/components/section/ReferSection.vue';
import ReviewSection from '~/components/section/ReviewSection.vue';
import LinkText from '~/components/text/LinkText.vue';
import CountMeInButton from '~/components/button/CountMeInButton.vue';
import Button from '~/components/button/Button.vue';
import WaitListForm from '~/components/form/WailtListForm.vue';

@Component({
	components: {
		LinkText,
		ReviewSection,
		ReferSection,
		CountMeInSection,
		DotPagination,
		MovingObject,
		StarRating,
		CountMeInButton,
		Button,
		WaitListForm,
	},
	asyncData: async ({ store }) => {
		await store.dispatch(`content/${LOAD_REVIEWS}`);
	},
})
export default class Home extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'Home',
		);
	}

	FINAL_PRODUCTION = FINAL_PRODUCTION;
	@State(state => state.isMobile) isMobile!: boolean;
	EStrapiImageSize = EStrapiImageSize;
	EMovingObjSize = EMovingObjSize;
	EMoveType = EMoveType;
	checkbox: boolean = false;

	get policyText(): string | any {
		return this.$t('market.consentPolicies', {
			privacy: `<a id="privacy">${this.$t('market.privacyPolicy')}</a>`,
			tos: `<a id="tos">${this.$t('market.termsOfService')}</a>`,
			disclaimer: `<a id="disclaimer">${this.$t('market.disclaimer')}</a>`,
		});
	}

	nl2br = (str: string) => nl2br(str);
	getSingleItem = (img: string) => getSingleItem(img);
	getStrapiImageSrc = (img: object, size: EStrapiImageSize) => getStrapiImageSrc(img, size);
}
</script>

<style lang="scss" scoped>
.introSectionWrapper {
	font-family: $poppins;
	text-align: center;
	padding-top: 56px;
	padding-bottom: 56px;
	overflow: hidden;

	@media (min-width: #{$breakpoint-xl}) {
		text-align: left;
		padding-top: 116px;
		padding-bottom: 247px;
		overflow: visible;
	}

	.titleText {
		font-size: 26px;
		font-weight: $font-semibold;
		margin-bottom: 12px;
		line-height: 1.3;
		position: relative;
		z-index: 50;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 72px;
			font-weight: $font-bold;
			margin-bottom: 30px;
		}
		> div {
			color: $mint;
		}
	}

	.descTextWrapper {
		margin-bottom: 34px;
		@media (min-width: #{$breakpoint-xl}) {
			margin-bottom: 40px;
		}

		.descText {
			line-height: 1.6;
			font-size: 14px;
			font-weight: $font-medium;
			@media (min-width: #{$breakpoint-xl}) {
				font-size: 18px;
			}
		}

		.descText2 {
			line-height: 1.6;
			font-size: 14px;
			font-weight: $font-semibold;
			@media (min-width: #{$breakpoint-xl}) {
				font-size: 18px;
				margin-top: 8px;
			}
		}
	}
	.emailForm {
		@media (min-width: #{$breakpoint-xl}) {
			display: flex;
			// justify-content: center;
			gap: 20px;
		}
		.fieldWrapper {
			// margin-bottom: 20px;
			@media (min-width: #{$breakpoint-xl}) {
				width: 334px;
			}
		}
	}

	// .policyWrapper {
	// 	display: grid;
	// 	grid-template-columns: repeat(12, minmax(0, 1fr));

	// 	> div {
	// 		grid-column: span 11 / span 11;
	// 	}

	// 	width: 100%;
	// 	max-width: 545px;
	// 	// margin: 0 auto;
	// 	margin-bottom: 12px;
	// 	@media (max-width: #{$breakpoint-xl}) {
	// 		margin-top: 10px;
	// 	}
	// }

	.startButton {
		margin-bottom: 80px;
		@media (min-width: #{$breakpoint-xl}) {
			// margin-bottom: 192px;
			margin-bottom: 150px;
		}
	}

	.mainImageWrapper {
		position: relative;
		margin-top: 50px;
		margin-bottom: 40px;
		@media (min-width: #{$breakpoint-xl}) {
			position: absolute;
			margin-bottom: 0;
			top: 120px;
			left: calc(100% - 480px);
			width: 100%;
			height: 100%;
		}

		.mainImage {
			width: 100%;
			max-width: fit-content;
			z-index: 100;
			margin: 0 auto;
			@media (min-width: #{$breakpoint-xl}) {
				position: absolute;
				right: 430px;
			}
		}
	}

	.bigGreyEllipse {
		position: absolute;
		width: 2000px;
		height: 700px;
		border-radius: $round-max;
		background-color: $offWhite;
		transform: rotate(-45deg) translate(286px, -652px);
	}

	.featuredIn {
		font-family: $roboto;
		font-weight: $font-bold;
		font-size: 12px;
	}

	.featuredInListWrapper {
		overflow-y: scroll;
		margin-top: 20px;
		.featuredInListInner {
			display: flex;
			gap: 32px;
			@media (min-width: #{$breakpoint-xl}) {
				gap: 72px;
			}
		}
	}
}

.meritSectionWrapper {
	position: relative;
	text-align: center;
	background-color: $mint;
	padding-top: 56px;
	padding-bottom: 72px;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 120px;
		padding-bottom: 156px;
	}

	.arrow {
		display: none;
		@media (min-width: #{$breakpoint-xl}) {
			display: block;
			position: absolute;
			left: 0;
			top: 50%;
		}
	}

	.titleText {
		line-height: 1.7;
		font-size: 20px;
		font-weight: $font-semibold;
		font-family: $poppins;
		margin-bottom: 6px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 46px;
			margin-bottom: 18px;
		}
	}

	.descText {
		line-height: 1.4;
		color: $primary;
		font-size: 14px;
		font-weight: $font-medium;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 18px;
		}
	}

	.meritsWrapper {
		margin-top: 60px;
		gap: 20px;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));

		@media (min-width: #{$breakpoint-xl}) {
			margin-top: 68px;
			gap: 0;
		}

		.meritCircle {
			display: flex;
			flex-direction: column;
			align-items: center;

			.number {
				width: 66px;
				height: 66px;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				font-family: $poppins;
				font-size: 33px;
				font-weight: $font-semibold;
				background-color: $white;
				&.yellow {
					background-color: $tertiary;
				}
				@media (min-width: #{$breakpoint-xl}) {
					width: 160px;
					height: 160px;
					font-size: 72px;
				}
			}

			.desc {
				margin-top: 8px;
				font-size: 8px;
				line-height: 1.2;
				font-family: $poppins;
				font-weight: $font-semibold;
				@media (min-width: #{$breakpoint-xl}) {
					font-size: 18px;
					margin-top: 20px;
					line-height: 1.2;
				}
			}
		}
	}
}

$feature-height: 224px;
$feature-height-pc: 338px;

@mixin greyCircle {
	position: absolute;
	width: $feature-height - 4px;
	height: $feature-height - 4px;
	border-radius: $round-full;
	background-color: $offWhite;
	@media (min-width: #{$breakpoint-xl}) {
		width: $feature-height-pc - 4px;
		height: $feature-height-pc - 4px;
	}
}

.featureSectionWrapper {
	position: relative;
	padding-top: 70px;
	// padding-bottom: 56px;
	text-align: center;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 148px;

		text-align: left;
	}

	.titleText {
		line-height: 1.2;
		text-align: center;
		font-size: 23px;
		font-family: $poppins;
		font-weight: $font-semibold;
		margin-bottom: 4px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 46px;
			margin-bottom: 20px;
		}
	}

	.descText {
		line-height: 1.4;
		font-size: 14px;
		text-align: center;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 18px;
		}
	}

	.contentWrapper {
		margin-top: 80px;
		@media (min-width: #{$breakpoint-xl}) {
			margin-top: 132px;
		}

		.featureWrapper {
			margin-bottom: 80px;
			display: grid;
			grid-template-columns: repeat(1, minmax(0, 1fr));

			&.-margin-bottom {
				margin-bottom: 125px;
			}

			@media (min-width: #{$breakpoint-xl}) {
				margin-bottom: 200px;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				&.-reverse {
					.featureItem {
						@media (min-width: #{$breakpoint-xl}) {
							transform: translateX(100px);
						}
					}
					.featureInfo {
						@media (min-width: #{$breakpoint-xl}) {
							grid-column-start: 1;
							grid-row-start: 1;
						}
					}
				}
			}

			.featureItem {
				display: flex;
				justify-content: center;
				position: relative;
				height: $feature-height;
				@media (min-width: #{$breakpoint-xl}) {
					height: $feature-height-pc;
				}

				> div,
				> img {
					transition: all 0.3s ease-in-out;
				}

				.greyCircle {
					@include greyCircle();
				}
				.text1 {
					position: absolute;
					font-size: 23px;
					font-family: $poppins;
					color: $secondary;
					line-height: 1.1;
					top: calc(50% - 50px);
					transform: translate(calc(50% + 15px), -50%);
					@media (min-width: #{$breakpoint-xl}) {
						font-size: 36px;
						top: calc(50% - 10px);
						left: calc(50% + 34px);
						transform: translate(-50%, -50%);
					}
				}
				.auto-review {
					position: absolute;
					max-width: $feature-height * 0.7;
					left: calc(50% - 72px);
					top: 0;
					transform: translateX(-50%);
					@media (min-width: #{$breakpoint-xl}) {
						top: 90px;
						left: 48px;
						max-width: 100%;
					}
				}
				.auto-fix {
					position: absolute;
					bottom: 12px;
					max-width: $feature-height + 20px;
					@media (min-width: #{$breakpoint-xl}) {
						bottom: -65px;
						max-width: 100%;
					}
				}
				.text2 {
					position: absolute;
					color: $secondary;
					font-family: $poppins;
					text-align: center;
					top: calc(50%);
					transform: translateY(-50%);

					> span {
						&:nth-child(1) {
							font-size: 33px;
							line-height: 1;
							@media (min-width: #{$breakpoint-xl}) {
								font-size: 46px;
							}
						}
						&:nth-child(2) {
							font-size: 64px;
							line-height: 1;
							@media (min-width: #{$breakpoint-xl}) {
								font-size: 93px;
							}
						}
						&:nth-child(4) {
							font-size: 13px;
							line-height: 1;
							@media (min-width: #{$breakpoint-xl}) {
								font-size: 20px;
							}
						}
					}
				}
				.no-hidden-cost {
					max-width: 200px;
					position: absolute;
					left: calc(50% - 150px);
					top: 10px;
					@media (min-width: #{$breakpoint-xl}) {
						top: 0px;
						left: calc(50% - 230px);
						max-width: 304px;
					}
				}
				.line-1 {
					position: absolute;
					top: -120px;
					left: calc(50% - 80px);
					@media (min-width: #{$breakpoint-xl}) {
						top: -190px;
						left: calc(100% - 160px);
					}
				}
				.usd-coin {
					position: absolute;
					top: calc(50% + 60px);
					left: calc(50% - 110px);
					@media (min-width: #{$breakpoint-xl}) {
						top: calc(50% + 220px);
						left: calc(50% - 310px);
					}
				}
				.everyday {
					$width: 32px;
					$width-pc: 48px;
					color: $secondary;
					text-align: center;
					border: $width/2 solid $secondary;
					border-radius: 50%;
					position: absolute;
					width: $feature-height - $width;
					height: $feature-height - $width;
					display: flex;
					justify-content: center;
					align-items: center;
					top: 50%;
					transform: translateY(-50%);
					@media (min-width: #{$breakpoint-xl}) {
						width: $feature-height-pc - $width;
						height: $feature-height-pc - $width;
						border: $width-pc/2 solid $secondary;
					}

					> div > div {
						&:nth-child(1) {
							line-height: 1;
							margin-bottom: 8px;
							font-size: 46px;
							@media (min-width: #{$breakpoint-xl}) {
								font-size: 72px;
							}
						}
						&:nth-child(2) {
							font-size: 13px;
							@media (min-width: #{$breakpoint-xl}) {
								font-size: 20px;
							}
						}
					}
				}
				.smilingCircle {
					position: absolute;
					width: 100px;
					bottom: -10px;
					left: calc(50% + 50px);
					@media (min-width: #{$breakpoint-xl}) {
						left: calc(50% + 80px);
						bottom: -10px;
						width: 150px;
					}
				}
				.smallGreyCircle {
					width: 60px;
					height: 60px;
					border-radius: 50%;
					position: absolute;
					background-color: $offWhite;
					display: flex;
					justify-content: center;
					align-items: center;
					&.num1 {
						left: calc(50% - 75px);
						top: -50px;
						transform: translateX(-50%);
						@media (min-width: #{$breakpoint-xl}) {
							left: calc(50% - 170px);
							top: -40px;
						}
					}
					&.num2 {
						left: calc(50% - 125px);
						transform: translateX(-50%);
						@media (min-width: #{$breakpoint-xl}) {
							left: calc(50% - 220px);
							top: 55px;
						}
					}
					@media (min-width: #{$breakpoint-xl}) {
						width: 92px;
						height: 92px;
					}
				}
			}

			.featureInfo {
				margin-top: 30px;

				.infoTitle {
					font-family: $poppins;
					font-weight: $font-semibold;
					font-size: 18px;
					color: $primary;
					line-height: 2;
					@media (min-width: #{$breakpoint-xl}) {
						font-size: 33px;
						margin-bottom: 28px;
					}
				}
				.infoDesc {
					font-size: 14px;
					color: $primaryLight;
					line-height: 1.4;
					margin-bottom: 18px;
					letter-spacing: 0.25px;
					@media (min-width: #{$breakpoint-xl}) {
						font-size: 18px;
						margin-bottom: 28px;
						max-width: 500px;
					}
				}
				.learnMore {
					color: $link;
					font-size: 14px;
					line-height: 1.4;
				}
			}
		}
	}
}
</style>
