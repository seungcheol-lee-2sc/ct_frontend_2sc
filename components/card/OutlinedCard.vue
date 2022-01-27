<template>
	<div class="cardWrapper" :class="additionalClass" :style="addtionalStyles">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class OutlinedCard extends Vue {
	@Prop() padX!: number;
	@Prop() padY!: number;
	@Prop() color!: string;
	@Prop() outlineColor!: string;
	@Prop() shadow!: boolean;
	@Prop() smallRounding!: boolean;
	@Prop() bolder!: boolean;

	get additionalClass(): string {
		let additionalClass = '';
		additionalClass += this.color ? `bg-${this.color}` : 'bg-white';
		additionalClass += this.outlineColor ? ` border-${this.outlineColor}` : ' border-primaryLight';
		additionalClass += this.shadow ? ' -shadow ' : '';
		return additionalClass;
	}

	get addtionalStyles(): any {
		return {
			padding: `${this.padX}px ${this.padY}px`,
			borderRadius: this.smallRound,
			borderWidth: this.bolder ? '2px' : '1px',
		};
	}

	get smallRound(): string {
		return this.smallRounding ? '8px' : '16px';
	}
}
</script>

<style lang="scss" scoped>
.cardWrapper {
	position: relative;
	overflow: hidden;
	text-align: left;
	border-style: solid;
	// border: 1px solid $primaryLight;
	// border-radius: $round-lg;
}
</style>
