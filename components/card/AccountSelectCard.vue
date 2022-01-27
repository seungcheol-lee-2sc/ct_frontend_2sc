<template>
	<v-card outlined class="selectCard" height="52" :disabled="disabled" @click.stop="$emit('click')">
		<div class="cardInner">
			<v-icon v-if="icon" class="cardIcon" v-text="icon" />
			<v-img v-else width="24" height="24" :src="img" class="cardIcon" />
			{{ title }}
		</div>
	</v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class AccountSelectCard extends Vue {
	@Prop({ required: true }) title!: string;
	@Prop() icon!: string;
	@Prop() img!: string;
	@Prop() disabled!: boolean;
}
</script>

<style lang="scss" scoped>
.selectCard {
	padding-left: 16px;
	padding-right: 16px;
	margin-bottom: 24px;
	display: flex;
	align-items: center;

	.cardInner {
		width: 100%;
		font-size: 14px;
		text-align: center;

		.cardIcon {
			float: left;
		}
	}
}
</style>
