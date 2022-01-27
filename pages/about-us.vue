<template>
	<div>
		<section class="sectionWrapper introSection">
			<h1 class="titleText">{{ $t('page.aboutUs.section1.title') }}</h1>
			<p class="descText">{{ $t('page.aboutUs.section1.desc') }}</p>
			<p class="descText -italic" v-html="$t('page.aboutUs.section1.italicDesc')"></p>
			<img alt="Purple and red circle characters" class="hide-mb" src="/characters/purple-orange.png" />
			<img alt="Purple and red circle characters" class="hide-pc" src="/characters/purple-orange-mb.png" />
		</section>
		<section class="missionWrapper">
			<div class="sectionWrapper">
				<h2 class="titleText">{{ $t('page.aboutUs.section2.title') }}</h2>
				<p class="descText" v-html="$t('page.aboutUs.section2.desc')"></p>
			</div>
		</section>
		<section class="sectionWrapper creatorSection">
			<h2 class="titleText">{{ $t('page.aboutUs.section3.title') }}</h2>
			<div class="creators">
				<div class="creator">
					<div class="imageWrapper">
						<img class="hide-pc" src="/people/mark-mb.png" alt="Mark's illustration" />
						<img class="hide-mb" src="/people/mark.png" alt="Mark's illustration" />
					</div>
					<h3>{{ $t('page.aboutUs.section3.desc1.desc1Title') }}</h3>
					<h4 v-html="$t('page.aboutUs.section3.desc1.desc1SubTitle')"></h4>
					<div class="previously" v-html="$t('page.aboutUs.section3.desc1.previously')"></div>
					<p v-html="$t('page.aboutUs.section3.desc1.desc1Desc')"></p>
				</div>
				<div class="creator">
					<div class="imageWrapper">
						<img class="hide-pc" src="/people/kb-mb.png" alt="Byun's illustration" />
						<img class="hide-mb" src="/people/kb.png" alt="Byun's illustration" />
					</div>
					<h3>{{ $t('page.aboutUs.section3.desc2.desc2Title') }}</h3>
					<h4 v-html="$t('page.aboutUs.section3.desc2.desc2SubTitle')"></h4>
					<div class="previously" v-html="$t('page.aboutUs.section3.desc1.previously')"></div>
					<p v-html="$t('page.aboutUs.section3.desc2.desc2Desc')"></p>
				</div>
				<div class="creator">
					<div class="imageWrapper">
						<img class="hide-pc" src="/people/andrew-mb.png" alt="Andrew's illustration" />
						<img class="hide-mb" src="/people/andrew.png" alt="Andrew's illustration" />
					</div>
					<h3>{{ $t('page.aboutUs.section3.desc3.desc3Title') }}</h3>
					<h4 v-html="$t('page.aboutUs.section3.desc3.desc3SubTitle')"></h4>
					<div class="previously" v-html="$t('page.aboutUs.section3.desc1.previously')"></div>
					<p v-html="$t('page.aboutUs.section3.desc3.desc3Desc')"></p>
				</div>
			</div>
		</section>
		<section class="markSection">
			<div class="sectionWrapper">
				<h3 class="titleText">{{ $t('page.aboutUs.section4.title') }}</h3>
				<div class="contentWrapper">
					<div>
						<p class="descText" v-html="$t('page.aboutUs.section4.desc')"></p>
					</div>

					<div>
						<img class="-shadow hide-pc" src="/people/thinking-mark-mb.png" alt="Thinking mark's picture" />
						<img class="-shadow hide-mb" src="/people/thinking-mark.png" alt="Thinking mark's picture" />
					</div>
				</div>
			</div>
		</section>
		<section class="sectionWrapper teamSection">
			<MovingObject
				:z-index="3"
				:size="isMobile ? EMovingObjSize.XXL : 240"
				color="secondary"
				:left="isMobile ? 0 : '60px'"
				:top="isMobile ? '48px' : '240px'"
				:opacity="0.15"
				:movement="EMoveType.BEAT"
			/>
			<h3 class="titleText">{{ $t('page.aboutUs.section5.title') }}</h3>

			<div class="teamMembers">
				<div class="teamMember">
					<div class="imageWrapper">
						<img class="hide-pc" src="/people/jake-mb.png" alt="Jake's illustration" />
						<img class="hide-mb" src="/people/jake.png" alt="Jake's illustration" />
					</div>
					<div class="textWrapper">
						<q>
							{{ $t('page.aboutUs.section5.desc1.text1') }}
						</q>
						<div class="name">{{ $t('page.aboutUs.section5.desc1.name1') }}</div>
					</div>
				</div>
				<div class="teamMember">
					<div class="imageWrapper">
						<img alt="yellow circle character" class="smileImage hide-pc" src="/characters/rotated-smile-1-mb.png" />
						<img alt="yellow circle character" class="smileImage hide-mb" src="/characters/rotated-smile-1.png" />

						<img class="hide-pc" src="/people/sunny-mb.png" alt="Sunny's illustration" />
						<img class="hide-mb" src="/people/sunny.png" alt="Sunny's illustration" />
					</div>
					<div class="textWrapper">
						<q>{{ $t('page.aboutUs.section5.desc2.text2') }}</q>
						<div class="name">{{ $t('page.aboutUs.section5.desc2.name2') }}</div>
					</div>
				</div>
				<div class="teamMember">
					<div class="imageWrapper">
						<MovingObject
							:hide="!isMobile"
							:z-index="3"
							:size="EMovingObjSize.XXXXXL"
							color="purpleDarkPale"
							left="-40px"
							top="120px"
							:movement="EMoveType.BEAT"
							:opacity="0.4"
						/>
						<img class="hide-pc" src="/people/daniel-mb.png" alt="Daniel's illustration" />
						<img class="hide-mb" src="/people/daniel.png" alt="Daniel's illustration" />
					</div>
					<div class="textWrapper">
						<MovingObject
							:hide="isMobile"
							:z-index="1"
							:size="180"
							color="purpleDarkPale"
							left="calc(50% - 100px)"
							top="20px"
							:movement="EMoveType.BEAT"
							:opacity="0.4"
						/>
						<q>
							{{ $t('page.aboutUs.section5.desc3.text3') }}
						</q>
						<div class="name">{{ $t('page.aboutUs.section5.desc3.name3') }}</div>
					</div>
				</div>
			</div>
		</section>

		<section class="workspaceSection">
			<div class="workspaceInner">
				<v-img alt="staff's photos" class="imageItem" src="/people/workspace-1.png" />
				<v-img alt="staff's photos" class="imageItem" src="/people/workspace-2.png" />
				<v-img alt="staff's photos" class="imageItem" src="/people/workspace-3.png" />
				<v-img alt="staff's photos" class="imageItem" src="/people/workspace-7.png" />
				<v-img alt="staff's photos" class="imageItem" src="/people/workspace-5.png" />

				<v-img alt="staff's photos" class="imageItem" src="/people/workspace-6.png" />
				<v-img alt="staff's photos" class="imageItem" src="/people/workspace-4.png" />
				<v-img alt="staff's photos" class="imageItem" src="/people/workspace-8.png" />
				<v-img alt="staff's photos" class="imageItem" src="/people/workspace-9.png" />
				<v-img alt="staff's photos" class="imageItem" src="/people/workspace-10.png" />
			</div>
		</section>
		<CountMeInSection />
	</div>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import MovingObject, { EMoveType, EMovingObjSize } from '~/components/item/MovingObject.vue';
import CountMeInSection from '~/components/section/CountMeInSection.vue';
import { metaInfo } from '~/utils/application';

@Component({
	components: {
		CountMeInSection,
		MovingObject,
	},
})
export default class AboutUs extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'About us',
		);
	}

	@State(state => state.isMobile) isMobile!: boolean;
	EMovingObjSize = EMovingObjSize;
	EMoveType = EMoveType;
}
</script>
<style lang="scss">
.markSection {
	.descText {
		> span {
			font-weight: $font-bold;
		}
	}
}
</style>

<style lang="scss" scoped>
.introSection {
	padding-top: 70px;
	padding-bottom: 155px;
	font-family: $poppins;
	text-align: center;
	position: relative;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 52px;
		padding-bottom: 170px;
	}

	.titleText {
		font-size: 26px;
		font-weight: $font-semibold;
		line-height: 1.4;
		margin-bottom: 22px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 48px;
			margin-bottom: 16px;
		}
	}

	.descText {
		font-size: 14px;
		line-height: 1.7;
		letter-spacing: 0.15px;
		color: $primaryLight;

		@media (min-width: #{$breakpoint-xl}) {
			font-size: 19px;
		}

		&.-italic {
			font-style: italic;
		}
	}

	img {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
}

.missionWrapper {
	padding-top: 74px;
	padding-bottom: 100px;
	background-color: $secondaryLight;
	text-align: center;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 68px;
		padding-bottom: 94px;
	}

	.titleText {
		font-size: 26px;
		font-weight: $font-semibold;
		line-height: 1.4;
		margin-bottom: 22px;
		font-family: $poppins;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 46px;
			margin-bottom: 32px;
		}
	}

	.descText {
		font-size: 14px;
		line-height: 1.4;
		letter-spacing: 0.25px;
		color: $primary;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 18px;
		}
	}
}

.creatorSection {
	padding-top: 71px;
	padding-bottom: 68px;
	text-align: center;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 120px;
		padding-bottom: 115px;
	}

	.titleText {
		font-family: $poppins;
		font-size: 26px;
		line-height: 1.4;
		font-weight: $font-semibold;
		margin-bottom: 32px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 46px;
			margin-bottom: 72px;
		}
	}

	.creators {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));

		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.creator {
			font-family: $poppins;
			margin-bottom: 76px;
			@media (min-width: #{$breakpoint-xl}) {
				margin-bottom: 0;
			}

			&:last-child {
				margin-bottom: 0;
			}

			.imageWrapper {
				margin-bottom: 20px;
				@media (min-width: #{$breakpoint-xl}) {
					height: 280px;
					margin-bottom: 46px;
				}
			}

			h3 {
				margin-bottom: 14px;
				font-size: 23px;
				font-weight: $font-semibold;
				line-height: 1.55;
				@media (min-width: #{$breakpoint-xl}) {
					margin-bottom: 36px;
				}
			}

			h4 {
				letter-spacing: 0.15px;
				line-height: 1.6;
				font-size: 19px;
				font-weight: $font-medium;
				color: $primary;
			}

			p {
				font-family: $roboto;
				letter-spacing: 0.5px;
				line-height: 1.6;
				font-size: 16px;
				color: $primaryLight;
			}
			.previously {
				margin-top: 4px;
				margin-bottom: 4px;
				font-family: $roboto;
				letter-spacing: 0.5px;
				line-height: 1.6;
				font-size: 16px;
				color: $primaryLight;
			}
		}
	}
}

.markSection {
	padding-top: 82px;
	padding-bottom: 80px;
	background-color: $lightGrey;
	text-align: center;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 120px;
	}

	.titleText {
		font-family: $poppins;
		font-weight: $font-semibold;
		font-size: 23px;
		line-height: 1.55;
		margin-bottom: 24px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 46px;
			text-align: left;
			letter-spacing: 0.25px;
			margin-bottom: 36px;
		}
	}

	.contentWrapper {
		display: grid;
		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 24px;
		}
		.descText {
			text-align: left;
			margin-bottom: 24px;
			color: $primaryLight;
			font-size: 16px;
			letter-spacing: 0.5px;
			line-height: 1.625;
			padding-bottom: 42px;

			> span {
				font-weight: $font-bold;
			}

			@media (min-width: #{$breakpoint-xl}) {
				font-size: 18px;
				letter-spacing: 0.25px;
			}
		}

		img {
			filter: grayscale(1);
			width: 100%;
			max-width: fit-content;
			border-radius: $round-xs;
			@media (min-width: #{$breakpoint-xl}) {
				border-radius: $round-sm;
			}
		}
	}
}

.teamSection {
	padding-top: 65px;
	padding-bottom: 110px;
	position: relative;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 120px;
		padding-bottom: 120px;
	}

	.titleText {
		position: relative;
		z-index: 2;
		text-align: center;
		font-family: $poppins;
		font-size: 23px;
		line-height: 1.57;
		margin-bottom: 40px;
		font-weight: $font-semibold;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 46px;
			margin-bottom: 56px;
		}
	}

	.teamMembers {
		.teamMember {
			position: relative;
			color: $primary;
			margin-bottom: 64px;
			&:last-child {
				margin-bottom: 0;
			}
			@media (min-width: #{$breakpoint-xl}) {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				&:nth-child(even) {
					.textWrapper {
						grid-column-start: 1;
						grid-row-start: 1;
						text-align: right;
					}
				}
			}

			.imageWrapper {
				position: relative;
				text-align: center;
				margin-bottom: 64px;
				img {
					position: relative;
					z-index: 2;
				}

				.smileImage {
					position: absolute;
					z-index: 1;
					left: calc(50% + 30px);
					top: calc(50% - 55px);
					@media (min-width: #{$breakpoint-xl}) {
						left: calc(50% + 50px);
						top: calc(50% - 75px);
					}
				}
			}

			.textWrapper {
				position: relative;
				@media (min-width: #{$breakpoint-xl}) {
					grid-column: span 2 / span 2;
					padding-left: 72px;
					padding-right: 72px;
					padding-top: 60px;
				}

				q {
					position: relative;
					z-index: 5;
					font-family: $ibm;
					font-weight: $font-medium;
					font-size: 23px;
					line-height: 1.6;

					@mixin quote {
						font-size: 93px;
						color: $primaryPale;
						position: absolute;
						font-weight: $font-normal;
					}

					&::before {
						@include quote();
						top: -4.2rem;
						left: 0;
						@media (min-width: #{$breakpoint-xl}) {
							top: -3rem;
							left: -60px;
						}
					}
					&::after {
						@include quote();
						right: 0;
						margin-right: -48px;
						top: 72%;
						@media (min-width: #{$breakpoint-xl}) {
							margin-right: -80px;
							top: 50%;
						}
					}
				}

				.name {
					margin-top: 24px;
					font-family: $poppins;
					font-size: 18px;
					line-height: 1.57;
					font-weight: $font-medium;
					@media (min-width: #{$breakpoint-xl}) {
						margin-top: 36px;
					}
				}
			}
		}
	}
}

.workspaceSection {
	.workspaceInner {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		.imageItem:nth-child(1),
		.imageItem:nth-child(5),
		.imageItem:nth-child(6),
		.imageItem:nth-child(10) {
			display: none;
		}
		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		@media (min-width: 1400px) {
			.imageItem:nth-child(1),
			.imageItem:nth-child(5),
			.imageItem:nth-child(6),
			.imageItem:nth-child(10) {
				display: block;
			}
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}

		.imageItem {
			filter: grayscale(1);
		}
	}
}
</style>
