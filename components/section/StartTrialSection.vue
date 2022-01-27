<template>
	<section class="bg-primary">
		<div class="sectionWrapper startTrialSectionWrapper">
			<h3 class="titleText">
				<span style="position: relative">
					<MovingObject
						:size="EMovingObjSize.L"
						color="orangeLight"
						left="-80px"
						top="8px"
						:movement="EMoveType.BEAT"
					/>
					Ready for your report?
				</span>
			</h3>

			<div class="descText">
				<p>
					🚫 No fuss, screw ups, or ridiculous pricing. <br />
					✅ Just accurate, straightforward, and affordable.
				</p>
				<br class="brMb" />
				<div class="bold">And remember, 100% refund, no questions asked.</div>
			</div>

			<!-- <Button :width-mb="200" :width-pc="280" text="Start free trial" color="mint" @click="onClickButton" /> -->

			<img class="halfCircle" src="/characters/smile-2.png" alt="Smiling half circle" />
		</div>
	</section>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import MovingObject, { EMoveType, EMovingObjSize } from '~/components/item/MovingObject.vue';
import Button from '~/components/button/Button.vue';

@Component({
	components: {
		Button,
		MovingObject,
	},
})
export default class StartTrialSection extends Vue {
	EMovingObjSize = EMovingObjSize;
	EMoveType = EMoveType;

	onClickButton() {}
}
</script>

<style lang="scss" scoped>
.startTrialSectionWrapper {
	padding-top: 80px;
	padding-bottom: 108px;
	color: $white;
	text-align: center;
	position: relative;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 132px;
		padding-bottom: 192px;
	}

	.titleText {
		line-height: 1.7;
		font-family: $poppins;
		font-weight: $font-semibold;
		font-size: 20px;
		margin-bottom: 20px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 46px;
			margin-bottom: 40px;
		}
	}

	.descText {
		line-height: 1.5;
		margin-bottom: 40px;
		font-size: 14px;

		@media (min-width: #{$breakpoint-xl}) {
			margin-bottom: 52px;
			font-size: 18px;
		}

		.bold {
			font-weight: $font-bold;
		}
	}
}

.halfCircle {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	@media (min-width: #{$breakpoint-xl}) {
		transform: translateX(-50%) scale(1.3);
	}
}
</style>
