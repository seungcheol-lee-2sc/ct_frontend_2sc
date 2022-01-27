<template>
	<v-card class="productCard" :class="noPad ? '' : '-pad'" :color="bgColor || 'white'" elevation="0">
		<!-- title -->
		<div class="topWrap">
			<div>
				<span class="titleText" :class="largeTitle ? '-large' : ''">
					<v-icon v-if="prependedIcon" size="22" style="margin-bottom: 4px" color="black">{{ prependedIcon }}</v-icon>
					{{ title }}
				</span>

				<v-icon v-if="explain" size="16" class="helpIcon" color="disabled">mdi-help-circle</v-icon>
				<template v-else>
					<slot name="explain"></slot>
				</template>

				<span v-if="chip" style="margin-left: 30px">
					<Chip style="margin-left: 8px" icon="mdi-check" color="successLight" fontcolor="successDark">
						{{ chip.text }}
					</Chip>
				</span>
				<br /><span v-if="subtitle" class="subtitle">{{ subtitle }}</span>
			</div>
		</div>

		<!-- content slot -->
		<div :style="!noContentTopPadding ? 'padding-top: 24px' : ''" :class="flexColumn ? 'flexColumnWrap' : ''">
			<slot></slot>
		</div>
	</v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import Chip from '../chip/Chip.vue';

export interface IProductCardChip {
	text: string;
	icon: string;
}

@Component({
	components: {
		Button,
		Chip,
	},
})
export default class ProductCard extends Vue {
	@Prop({ required: true }) title!: string;
	@Prop() explain!: string;
	@Prop() subtitle!: string;
	@Prop() chip!: IProductCardChip;
	@Prop() url!: string;
	@Prop() noPad!: boolean;
	@Prop() bgColor!: string;
	@Prop() largeTitle!: boolean;
	@Prop() prependedIcon!: string;
	@(Prop()!) noContentTopPadding!: boolean;
	@Prop() flexColumn!: boolean;

	onClickTextButton() {
		this.$emit('onClick');
	}
}
</script>

<style lang="scss" scoped>
.productCard {
	&.-pad {
		padding: 24px;
	}

	.topWrap {
		@media (min-width: #{$breakpoint-xl}) {
			display: flex;
			justify-content: space-between;
		}

		.helpIcon {
			margin-left: 4px;
			cursor: pointer;
		}

		.subtitle {
			font-size: 14px;
			color: $secondaryLight;
		}

		.addtionalButton {
			color: $primary;
			font-size: 14px;
			cursor: pointer;
			font-family: $poppins;
		}
	}
	.titleText {
		font-size: 16px;
		font-weight: $font-bold;
		letter-spacing: 0.15px;
		font-family: $poppins;
		&.-large {
			font-size: 19px;
			font-weight: $font-semibold;
		}
	}
	.flexColumnWrap {
		display: flex;
		flex-flow: column;
		height: 100%;
	}
}
</style>
