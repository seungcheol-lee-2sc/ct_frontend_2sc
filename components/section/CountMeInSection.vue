<template>
	<section class="bg-primary">
		<div class="sectionWrapper startTrialSectionWrapper">
			<h3 id="count-me-in" class="titleText">
				<span>
					<MovingObject
						:hide="isMobile"
						:size="50"
						color="orangeLight"
						left="-70px"
						top="calc(50% - 25px)"
						:movement="EMoveType.BEAT"
					/>
					<span> {{ $t('market.countInMeSection.title') }} </span>
				</span>
			</h3>

			<div class="descText" style="position: relative">
				<MovingObject
					:hide="!isMobile"
					:size="40"
					color="orangeLight"
					left="-30px"
					top="calc(50% - 20px)"
					:movement="EMoveType.BEAT"
				/>
				<p style="position: relative; z-index: 2" v-html="$t('market.countInMeSection.desc')"></p>
			</div>

			<WaitListForm
				button-id="bottom-section-waitlist-button"
				form-id="countMeInSecitonForm"
				align="center"
				:dark="true"
				:button-text="$t('market.countInMeSection.button')"
				color="secondary"
			/>

			<img class="halfCircle" src="/characters/smile-2.png" alt="Smiling half circle" />
		</div>
	</section>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import WaitListForm from '../form/WailtListForm.vue';
import MovingObject, { EMoveType, EMovingObjSize } from '~/components/item/MovingObject.vue';
import Button from '~/components/button/Button.vue';

@Component({
	components: {
		Button,
		MovingObject,
		WaitListForm,
	},
})
export default class CountMeInSection extends Vue {
	@State(state => state.isMobile) isMobile!: boolean;
	EMovingObjSize = EMovingObjSize;
	EMoveType = EMoveType;

	get policyText(): string | any {
		return this.$t('market.consentPolicies', {
			privacy: `<a id="privacy">${this.$t('market.privacyPolicy')}</a>`,
			tos: `<a id="tos">${this.$t('market.termsOfService')}</a>`,
			disclaimer: `<a id="disclaimer">${this.$t('market.disclaimer')}</a>`,
		});
	}
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
		padding-top: 130px;
		padding-bottom: 192px;
	}

	.titleText {
		line-height: 1.7;
		font-family: $poppins;
		font-weight: $font-medium;
		font-size: 20px;
		margin-bottom: 20px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 46px;
			margin-bottom: 40px;
		}

		> span {
			position: relative;
		}
	}

	.descText {
		line-height: 1.5;
		margin-bottom: 40px;
		font-size: 14px;
		letter-spacing: 0.15px;
		font-weight: $font-normal;

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
