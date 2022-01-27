<template>
	<OutlinedCard :bolder="true" :color="color" :pad-x="24" :pad-y="24">
		<div class="innerWrapper">
			<img v-if="src" :src="src" />

			<div class="contentWrapper">
				<span class="titleText">
					{{ title }}
				</span>
				<div class="descText" v-html="desc"></div>
			</div>
		</div>
	</OutlinedCard>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import OutlinedCard from '~/components/card/OutlinedCard.vue';

@Component({
	components: {
		OutlinedCard,
	},
})
export default class InfoWithCharacterCard extends Vue {
	@Prop({ required: true }) title!: string;
	@Prop({ required: true }) desc!: string;
	@Prop() src!: string;
	@Prop() color!: string;
}
</script>

<style lang="scss" scoped>
.innerWrapper {
	display: flex;
	gap: 16px;
	align-items: center;

	.titleText {
		font-size: 19px;
		font-weight: $font-medium;
		font-family: $poppins;
		line-height: 1.6;
	}

	.descText {
		font-size: 16px;
		line-height: 1.4;
		color: $primaryLight;
	}
}
</style>
