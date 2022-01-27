<template>
	<div class="pricingCard" :class="white ? '-white' : ''">
		<img v-if="img" class="character" alt="smiling semicircle character" src="/characters/smile-5-2.png" />
		<div class="topText">{{ title }}</div>
		<template v-if="typeof money === 'number'">
			<div class="moneyWrapper">
				<span class="dollar">$</span>
				<span class="money">{{ money }}</span>
				<span class="per">{{ $t('page.pricing.section2.card1.perTaxYear') }}</span>
			</div>
		</template>
		<template v-else>
			<div class="moneyWrapper -noPad">
				<span class="money">Custom</span>
			</div>
		</template>
		<div class="descText" v-html="desc" />
		<div class="buttonWrapper">
			<CountMeInButton :fontsize="14" :height="44" />
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import CountMeInButton from '~/components/button/CountMeInButton.vue';

@Component({
	components: {
		CountMeInButton,
	},
})
export default class PricingCard extends Vue {
	@Prop({ required: true }) title!: string;
	@Prop({ required: true }) img!: boolean;
	@Prop() money!: number;
	@Prop({ required: true }) desc!: string;
	@Prop() white!: boolean;
}
</script>

<style lang="scss" scoped>
.pricingCard {
	background-color: $mint;
	border-radius: $round-lg;
	border: 1px solid $primaryPale;
	padding-top: 60px;
	padding-bottom: 42px;
	text-align: center;
	overflow: hidden;
	top: 0;
	position: relative;

	&.-white {
		background-color: $white;

		.descText {
			color: $disabled;
		}

		.moneyWrapper {
			.per {
				color: $disabled;
			}
		}
	}

	> div {
		position: relative;
		z-index: 1;
	}

	.topText {
		font-family: $poppins;
		font-size: 33px;
		letter-spacing: 0.25px;
		font-weight: $font-semibold;
		color: $primary;
		margin-bottom: 12px;
	}

	.descText {
		font-family: $poppins;
		font-size: 19px;
		letter-spacing: 0.15px;
		line-height: 1.55;
		color: $white;
		margin-top: 20px;
		margin-bottom: 74px;
		max-width: 240px;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
	}

	.buttonWrapper {
		display: flex;
		justify-content: center;
	}

	.character {
		position: absolute;
		bottom: 0;
		right: 0;
	}
}
</style>
