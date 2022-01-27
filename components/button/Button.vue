<template>
	<button
		:type="type || 'button'"
		role="button"
		:class="`${classes} ${textClass} ${bgClass} ${roundClass}`"
		:style="styles"
		:disabled="disabled"
		@click="onClickButton"
	>
		<v-icon v-if="headIcon" :color="finalColor" :size="iconSize">
			{{ headIcon }}
		</v-icon>
		<slot></slot>
		<v-icon v-if="tailIcon" :color="finalColor" :size="iconSize">
			{{ tailIcon }}
		</v-icon>
		<v-progress-circular v-if="loading" :size="iconSize" indeterminate :color="finalColor" />
	</button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class Button extends Vue {
	@Prop({ required: true }) color!: string;
	@Prop() minWidth!: number | string;
	@Prop() width!: number | string;
	@Prop() block!: boolean;
	@Prop() height!: number;
	@Prop() rounded!: boolean;
	@Prop() outlined!: boolean;
	@Prop() disabled!: boolean;
	@Prop() loading!: boolean;
	@Prop() text!: boolean;
	@Prop() type!: string;
	@Prop() fontsize!: number; // 16, 14, 12
	@Prop() fontcolor!: string;
	@Prop() headIcon!: string;
	@Prop() tailIcon!: string;
	@Prop() background!: string;
	@Prop() icon!: boolean;
	@Prop() zIndex!: number;
	@Prop() rect!: boolean;
	@Prop() center!: boolean;

	get iconSize(): number {
		return this.fontsize ? this.fontsize + 2 : 24;
	}

	get finalColor(): string {
		if (this.disabled) {
			return this.text ? 'disabled' : 'white';
		} else {
			return this.fontcolor || this.color;
		}
	}

	get textClass(): string {
		return `text-${this.finalColor}`;
	}

	get bgClass(): string {
		if (this.disabled) {
			return this.text ? '  -no-bg -no-color ' : ' bg-outline ';
		} else if (this.background) {
			return ` bg-${this.background} `;
		} else {
			return !this.outlined && !this.icon && !this.text ? ` bg-${this.color} ` : '';
		}
	}

	get roundClass(): string {
		if (this.rounded) {
			return '';
		} else if (this.rect) {
			return ' -rect ';
		} else {
			return ' -default-round ';
		}
	}

	get classes(): string {
		let result = '';
		result += this.fontsize && this.fontsize < 14 ? ' font-medium ' : ' font-semibold ';
		result += this.icon ? ' -icon ' : '';

		if (this.disabled) {
			result += ' -disabled ';
		} else if (this.text || this.icon) {
			result += ' -no-bg ';
		} else {
			result += ` -border border-${this.color} `;
		}
		return result;
	}

	get styles(): any {
		let width = 'auto';
		width = this.width ? `${this.width}px` : 'auto';
		width = this.block ? '100%' : width;

		const minWidth = this.minWidth ? `${this.minWidth}px` : 'auto';

		const config: any = {
			height: this.height ? `${this.height}px` : 'auto',
			fontSize: this.fontsize ? `${this.fontsize}px` : '16px',
			width,
			minWidth,
		};

		if (this.zIndex) {
			config.zIndex = this.zIndex;
		}

		if (this.center) {
			config.margin = 'auto';
		}

		return config;
	}

	onClickButton() {
		this.$emit('click');
	}
}
</script>

<style lang="scss" scoped>
button {
	position: relative;
	z-index: 1;
	font-family: $poppins;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	padding: 10px 20px;
	border-radius: $round-max;
	line-height: 1;

	&::first-letter {
		text-transform: capitalize;
	}

	&.-no-bg {
		background-color: transparent;
	}

	&.-no-color {
		color: white;
	}

	&.-default-round {
		border-radius: $round-sm;
	}

	&.-rect {
		border-radius: 0;
	}

	&.-border {
		border-width: 1px;
		border-style: solid;
	}

	&.-disabled {
		cursor: not-allowed;
	}

	&.-icon {
		padding: 6px 9px;
		border-radius: $round-full;
	}

	&:active,
	&:focus {
		outline: none;
	}
}
</style>
