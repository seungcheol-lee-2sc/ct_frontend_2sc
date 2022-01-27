<template>
	<v-card v-if="!loading" class="cardButton" elevation="0" @click.stop="onClickCard">
		<span class="buttonText" :class="addtionalClass"> {{ msg }} </span>
	</v-card>
	<span v-else class="loadingText"> Loading... </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class CardButton extends Vue {
	@Prop({ required: true }) msg!: string;
	@Prop() loading!: boolean;
	@Prop() bold!: boolean;
	@Prop() color!: string;

	onClickCard() {
		!this.loading && this.$emit('click');
	}

	get addtionalClass(): string {
		return this.color ? `text-${this.color}` : 'text-link';
	}
}
</script>

<style lang="scss" scoped>
.cardButton {
	display: inline-block !important;
	padding: 4px;
	cursor: pointer;
	color: $link;
}

.loadingText {
	display: inline-block;
	padding: 4px;
	user-select: none;
	color: $disabled;
}
</style>
