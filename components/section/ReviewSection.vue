<template>
	<div class="reviewSection">
		<section class="sectionWrapper" style="position: relative">
			<h3 class="titleText line20">Join the club</h3>
			<p class="descText line20">What our happy customers say</p>

			<div class="reviewCardWrapper">
				<ReviewCard
					text="Used Cointelli.Tax after unsuccessfully trying a competitor's site. Cointelli software imported transactions
					easier and the reconciliation resulted in just a few warnings to be resolved. The team the quickly help me
					navigate through resolving those warnings! TOP NOTCH!!!"
				/>
				<ReviewCard
					v-show="!isMobile"
					text="Used Cointelli.Tax after unsuccessfully trying a competitor's site. Cointelli software imported transactions
					easier and the reconciliation resulted in just a few warnings to be resolved. The team the quickly help me
					navigate through resolving those warnings! TOP NOTCH!!!"
				/>
				<ReviewCard
					v-show="!isMobile"
					text="Used Cointelli.Tax after unsuccessfully trying a competitor's site. Cointelli software imported transactions
					easier and the reconciliation resulted in just a few warnings to be resolved. The team the quickly help me
					navigate through resolving those warnings! TOP NOTCH!!!"
				/>
			</div>

			<div style="margin-top: 36px" class="hide-pc">
				<DotPagination :total="5" :page="reviewPage" :size="1" @onchange="onChangePage" />
			</div>

			<MovingObject
				:hide="isMobile"
				:size="EMovingObjSize.XL"
				color="tertiary"
				left="calc(100% - 70px)"
				top="calc(100% + 50px)"
				:movement="EMoveType.BEAT"
			/>
		</section>
	</div>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import ReviewCard from '~/components/card/ReviewCard.vue';
import DotPagination from '~/components/pagination/DotPagination.vue';
import { IReview } from '~/types/content/types';
import MovingObject, { EMoveType, EMovingObjSize } from '~/components/item/MovingObject.vue';

@Component({
	components: {
		ReviewCard,
		DotPagination,
		MovingObject,
	},
})
export default class ReviewSection extends Vue {
	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ content }) => content.reviews) reviews!: IReview[];
	reviewPage: number = 1;
	EMovingObjSize = EMovingObjSize;
	EMoveType = EMoveType;

	onChangePage(page: number) {
		this.reviewPage = page;
	}
}
</script>

<style lang="scss" scoped>
.reviewSection {
	background-color: $offWhite;
	text-align: center;
	padding-top: 52px;
	padding-bottom: 80px;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 120px;
		padding-bottom: 176px;
	}

	.titleText {
		font-size: 20px;
		font-family: $poppins;
		font-weight: $font-semibold;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 46px;
			margin-bottom: 15px;
		}
	}

	.descText {
		font-size: 14px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 18px;
			margin-bottom: 44px;
		}
	}

	.reviewCardWrapper {
		display: grid;
		margin-top: 32px;
		gap: 24px;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
}
</style>
