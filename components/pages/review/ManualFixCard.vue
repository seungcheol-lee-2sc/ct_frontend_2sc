<template>
	<div class="reviewCard -shadow" :class="addtionalClass">
		<lottie-player class="shiningStars" loop autoplay mode="normal" src="/lottie-files/effects/shining-stars.json" />
		<img class="smile -left" src="/characters/from-left-smile.png" />
		<!-- <img class="smile -right" src="/characters/from-right-smile.png" /> -->
		<div class="titleText">
			<slot></slot>
		</div>
		<div class="progressWrapper">
			<div class="progress">{{ fixRate }}<span>%</span></div>
			<div class="reviewCount" v-html="countText"></div>
		</div>
		<div class="buttonsWrapper">
			<Button
				:height="52"
				:width="192"
				:rounded="true"
				:fontsize="16"
				fontcolor="white"
				:outlined="fixRate > 0"
				:color="fixRate > 0 ? 'white' : 'primary'"
				@click="$emit('onFix')"
			>
				{{ $t('common.fix') }}
			</Button>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import Button from '~/components/button/Button.vue';

@Component({
	components: {
		Button,
	},
})
export default class ManualFixCard extends Vue {
	@Prop({ required: true }) totalCount!: number;
	@Prop({ required: true }) doneCount!: number;
	@Prop({ required: true }) loading!: boolean;

	get countText(): string {
		if (this.totalCount) {
			if (this.doneCount === this.totalCount) {
				return 'Complete';
			} else {
				return `${this.doneCount} / ${this.totalCount}`;
			}
		} else {
			return 'Complete';
		}
	}

	get addtionalClass(): string {
		let result = '';

		if (this.loading) {
			result += ' -loading ';
		} else {
			result += this.fixRate === 0 ? ' -zero ' : '';
			result += this.fixRate > 0 ? ' -progress ' : '';
			result += this.fixRate >= 100 ? ' -complete ' : '';
		}

		return result;
	}

	get fixRate(): number {
		if (this.totalCount <= this.doneCount) {
			return 100;
		} else {
			return Math.floor((this.doneCount / this.totalCount) * 100);
		}
	}
}
</script>

<style lang="scss" scoped>
@import '~/assets/mixins/common.scss';

@mixin transition {
	transition: all 1s ease-in-out;
}

@mixin transition-fast {
	transition: all 0.3s ease-in-out;
}

.reviewCard {
	position: relative;
	border-radius: $round-md;
	border: 1px solid $primary;
	padding-top: 60px;
	padding-bottom: 44px;
	text-align: center;
	background-color: $white;
	overflow: hidden;
	@include transition();

	.shiningStars {
		opacity: 0;
		position: absolute;
		top: 0;
		@include transition();
	}

	.smile {
		position: absolute;
		transition: all 0.3s ease-in-out;
		z-index: 1;
		opacity: 0;
		@include transition-fast();

		&.-left {
			top: calc(50% - 50px);
			left: -28px;
		}

		&.-right {
			top: calc(50%);
			right: 0;
			transform: translateX(200%);
		}
	}

	&:hover {
		.smile {
			&.-left {
				left: 0;
			}
		}
	}

	.titleText {
		position: relative;
		z-index: 10;
		font-family: $poppins;
		font-size: 19px;
		letter-spacing: 0.15px;
		line-height: 1.6;
		margin-bottom: 32px;
		color: $primary;
		font-weight: $font-semibold;
		@include transition();
		> div {
			color: $successDark;
			font-weight: $font-medium;
		}
	}

	.progressWrapper {
		position: relative;
		line-height: 1;
		margin-bottom: 60px;

		.progress {
			font-family: $poppins;
			font-size: 72px;
			font-weight: $font-medium;
			margin-bottom: 6px;

			> span {
				font-weight: $font-light;
				font-size: 19px;
				letter-spacing: 0.15px;
			}
		}
		.reviewCount {
			font-size: 16px;
			letter-spacing: 0.5px;
			color: $disabled;
			@include transition();
		}
	}

	&.-progress {
		color: $white;
		background-color: $secondary;

		.titleText {
			color: $white;
			> div {
				color: $white;
			}
		}
		.progressWrapper {
			.reviewCount {
				color: $white;
			}
		}

		& + div.-zero {
			.smile {
				opacity: 1;
			}
		}
	}

	&.-complete {
		.shiningStars {
			opacity: 1;
		}
	}

	&.-loading {
		overflow: hidden;
		background-color: $secondary;

		.titleText {
			color: $secondary;
		}

		.progressWrapper {
			position: relative;
			z-index: 10;
			.progress {
				color: $secondary;
			}
			.reviewCount {
				color: $secondary;
			}
		}

		.buttonsWrapper {
			opacity: 0;
		}
		&::after {
			@include shimmer-base(rgba($white, 0.3));
			animation: shimmer 3s infinite;
		}
	}
}
</style>
