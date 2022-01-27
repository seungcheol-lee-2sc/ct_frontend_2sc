<template>
	<section class="meritSectionWrapper">
		<img class="arrow" src="/static/lines/arrow-line-2.png" alt="Pointing first feature image" />
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
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import MovingObject from '~/components/item/MovingObject.vue';

@Component({
	components: {
		MovingObject,
	},
})
export default class MeritsSection extends Vue {
	@State(state => state.isMobile) isMobile!: boolean;
}
</script>

<style lang="scss" scoped>
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
</style>
