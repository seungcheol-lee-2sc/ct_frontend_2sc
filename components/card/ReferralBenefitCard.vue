<template>
	<div class="referralCardWrapper">
		<img class="coinsImg" src="/illust/coins-with-characters.png" alt="illust of coins with characters" />
		<div class="titleText">Referral Benefits</div>
		<div class="descText" :class="buttonPadding ? '-dashboard' : ''">Get 10% credit for every referral</div>
		<div class="textButton" @click="$router.push('/user/rewards')">
			<span> Invite Friends</span>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import OutlinedCard from './OutlinedCard.vue';

@Component({
	components: { OutlinedCard },
})
export default class ReferralBenefitCard extends Vue {
	@Prop() buttonPadding!: boolean;
}
</script>

<style lang="scss" scoped>
@mixin textDefault {
	font-family: $poppins;
	font-weight: $font-medium;
}

.referralCardWrapper {
	.coinsImg {
		position: absolute;
		bottom: 0px;
		right: 0px;
		mix-blend-mode: multiply;
	}
	.titleText {
		font-family: $poppins;
		font-weight: $font-semibold;
		font-size: 16px;
		color: $primary;
		margin-bottom: 8px;
	}
	.descText {
		@include textDefault();
		font-size: 13px;
		color: $primaryLight;
		margin-bottom: 20px;
		&.-dashboard {
			margin-bottom: 110px;
		}
	}
	.textButton {
		@include textDefault();
		color: $link;
		font-size: 14px;
		top: 100px;
		cursor: pointer;
	}
}
</style>
