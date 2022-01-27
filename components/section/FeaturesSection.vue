<template>
	<section class="featureSectionWrapper">
		<div class="sectionWrapper">
			<h2 class="titleText">{{ $t('page.main.section3.title') }}</h2>
			<p class="descText">{{ $t('page.main.section3.desc') }}</p>

			<div class="contentWrapper">
				<div class="featureWrapper -reverse">
					<div class="featureItem -right">
						<div class="greyCircle"></div>
						<img class="auto-review" src="/static/captures/auto-review.png" alt="Captured auto review function" />
						<div class="text1" v-html="$t('page.main.section3.content1.imgText1')"></div>
						<img class="auto-fix" src="/static/captures/auto-fix.png" alt="Captured auto fix function" />
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
						<img class="no-hidden-cost" src="/static/texts/no-hidden-costs.png" alt="No hidden cost" />
						<!-- <img class="line-1 hide-pc" src="/lines/line-1.png" /> -->
						<img class="line-1 hide-mb" src="/static/lines/line-1-pc.png" />
						<MovingObject
							:size="EMovingObjSize.M"
							color="tertiary"
							:left="isMobile ? 'calc(50% - 180px)' : 'calc(50% + 50px)'"
							:top="isMobile ? '-35px' : '-90px'"
							:movement="EMoveType.BEAT"
						/>
						<img class="usd-coin hide-pc" src="/static/illust-item/usd-coin.png" alt="Usd coin" />
						<img class="usd-coin hide-mb" src="/static/illust-item/usd-coin-pc.png" alt="Usd coin" />
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
						<img class="smilingCircle" src="/static/characters/smile-1.png" alt="Smiling circle" />
						<div class="smallGreyCircle num1">
							<img class="hide-pc" src="/static/icon/message-1.png" alt="Messege icon" />
							<img class="hide-mb" src="/static/icon/message-1-pc.png" alt="Messege icon" />
						</div>
						<div class="smallGreyCircle num2">
							<img class="hide-pc" src="/static/icon/phone-1.png" alt="Phone icon" />
							<img class="hide-mb" src="/static/icon/phone-1-pc.png" alt="Phone icon" />
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
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import MovingObject, { EMovingObjSize, EMoveType } from '~/components/item/MovingObject.vue';
import LinkText from '~/components/text/LinkText.vue';

@Component({
	components: {
		LinkText,
		MovingObject,
	},
})
export default class FeaturesSection extends Vue {
	@State(state => state.isMobile) isMobile!: boolean;
	EMovingObjSize = EMovingObjSize;
	EMoveType = EMoveType;
}
</script>

<style lang="scss" scoped>
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
