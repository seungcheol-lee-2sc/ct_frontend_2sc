<template>
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
				src="/static/lines/line-2.png"
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
				<img class="mainImage hide-pc" src="/static/illust/lying-down-woman-mb.png" />
				<img class="mainImage hide-mb" src="/static/illust/lying-down-woman.png" />
				<div class="hide-mb bigGreyEllipse"></div>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import MovingObject, { EMovingObjSize, EMoveType } from '~/components/item/MovingObject.vue';
import WaitListForm from '~/components/form/WailtListForm.vue';

@Component({
	components: {
		MovingObject,
		WaitListForm,
	},
})
export default class IntroSection extends Vue {
	@State(state => state.isMobile) isMobile!: boolean;
	EMovingObjSize = EMovingObjSize;
	EMoveType = EMoveType;
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
</style>
