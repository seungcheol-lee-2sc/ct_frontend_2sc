<template>
	<div class="progressBar" :style="{ height: `${height}px` }" :class="addtionalClasses">
		<span class="progressText" :style="{ fontSize: fontsize }">
			<slot></slot>
		</span>
		<span class="progress" :style="{ width: reformedProgress, borderRadius: `${height}px` }"> </span>

		<div v-if="!hideTexts" class="bottomInfo">
			<span class="leftTime">
				<v-icon color="disabled" small>mdi-alarm</v-icon>
				-
			</span>
			<span class="bottomProgress">{{ reformedProgress === '100%' ? 'Almost' : reformedProgress }}</span>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class ProgressBar extends Vue {
	@Prop() color!: string; // secondary, warning, error
	@Prop({ required: true }) progress!: number;
	@Prop({ required: true }) height!: number;
	@Prop() hideTexts!: boolean;

	get addtionalClasses(): string {
		let result = '';
		result += !this.progress ? ' -zero ' : '';
		result += ` -${this.color} `;
		return result;
	}

	get fontsize(): string {
		return this.height - 4 > 16 ? '16px' : `${this.height - 4}px`;
	}

	get reformedProgress(): string {
		if (!this.progress || this.progress === 0) {
			return '0%';
		} else if (this.progress > 0 && this.progress < 4) {
			return '4%';
		} else if (this.progress >= 100) {
			return '100%';
		} else {
			return `${this.progress}%`;
		}
	}
}
</script>

<style lang="scss" scoped>
@import '~/assets/mixins/common.scss';

.progressBar {
	position: relative;
	width: 100%;
	background-color: $offWhite;
	border: 1px solid $secondary;
	border-radius: $round-max;
	display: flex;

	&.-zero {
		overflow: hidden;
		&::after {
			@include shimmer-base(rgba($secondary, 0.5));
			animation: shimmer 3s infinite;
		}

		.progress {
			background-color: transparent;
		}
	}

	&.-warning {
		overflow: hidden;
		border: 1px solid $warning;

		&::after {
			@include shimmer-base(rgba($warning, 0.5));
			animation: shimmer 3s infinite;
		}
		.progress {
			background-color: transparent;
		}
	}

	&.-error {
		overflow: hidden;
		border: 1px solid $error;

		&::after {
			@include shimmer-base(rgba($error, 0.5));
			animation: shimmer 3s infinite;
		}
		.progress {
			background-color: transparent;
		}
	}

	.progressText {
		position: absolute;
		z-index: 1;
		width: 100%;
		text-align: center;
		left: 0;
		transform: translateY(-50%);
		top: 50%;
		color: $offWhite;
		font-family: $poppins;
	}

	.progress {
		display: flex;
		// border-radius: $round-max;
		height: 100%;
		position: relative;
		transition: all 0.5s ease-in-out;
		overflow: hidden;
		background-color: $secondary;

		img {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 8px;
		}
		&::after {
			@include shimmer-base(rgba($white, 0.5));
			animation: shimmer 3s infinite;
		}
	}

	.bottomInfo {
		position: absolute;
		width: 100%;
		bottom: 0;
		transform: translateY(calc(100% + 4px));
		margin-top: 4px;
		display: flex;
		justify-content: space-between;
		padding: 0 8px;
		font-family: $poppins;
		letter-spacing: 0.1px;

		.leftTime {
			color: $disabled;
			font-size: 12px;
			font-weight: $font-medium;
			display: flex;
			align-items: center;
			gap: 2px;
		}

		.bottomProgress {
			color: $secondary;
			font-weight: $font-bold;
		}
	}
}
</style>
