<template>
	<div class="stepperWrapper">
		<div class="lineWrapper">
			<hr class="dotted" />
			<hr class="solid" :style="{ width: activeProgress }" />
		</div>

		<span
			v-for="(menu, idx) in taxMenu"
			:key="`taxMenu-${idx}`"
			class="stepWrapper"
			:class="addtionalClass(idx)"
			@click="onClickStepper(menu, idx)"
		>
			<span class="number">
				{{ idx + 1 }}
				<span class="activator ani-heart-beat"></span>
			</span>
			<span class="stepText">
				{{ $t(menu.alias) }}
			</span>
		</span>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { IMenuItem, ISimpleMenuItem } from '~/types/common/types';
import { TAX_MENU_1, TAX_MENU_2, TAX_MENU_3, TAX_MENU_4 } from '~/utils/menu';

@Component
export default class ImportStepper extends Vue {
	@Prop({ required: true }) step!: number;
	taxMenu: IMenuItem[] = [];

	onClickStepper(menu: ISimpleMenuItem, idx: number) {
		if (idx + 1 === this.step) {
			this.$router.push(this.$route.path);
		} else {
			this.$router.push(menu.path);
		}
	}

	addtionalClass(idx: number): string {
		if (this.step > idx + 1) {
			return '-prev';
		} else if (this.step === idx + 1) {
			return '-active';
		}
		return '';
	}

	get activeProgress(): string {
		if (this.step === 2) {
			return '35%';
		} else if (this.step === 3) {
			return '70%';
		} else if (this.step === 4) {
			return '100%';
		}
		return '0%';
	}

	created() {
		this.taxMenu = [TAX_MENU_1, TAX_MENU_2, TAX_MENU_3, TAX_MENU_4];
	}
}
</script>

<style lang="scss" scoped>
@import '~/assets/mixins/common.scss';
@import '~/assets/globals/animations.scss';

$size: 32px;
$line-width: 2px;

@mixin transition {
	transition: all 0.3s ease-in-out;
}

@mixin activatedNumber {
	color: $white;
	background-color: $secondary;
	border-color: $secondary;
}

@mixin activatedText {
	color: $primary;
}

.stepperWrapper {
	user-select: none;
	display: flex;
	justify-content: space-between;
	position: relative;

	.lineWrapper {
		position: absolute;
		z-index: 1;
		left: 50%;
		width: calc(100% - 70px);
		top: 50%;
		transform: translateX(-50%);
		@media (min-width: #{$breakpoint-xl}) {
			width: calc(100% - 120px);
			top: calc(50% - 15px);
		}

		hr {
			position: absolute;
			border: $line-width solid transparent;

			&.dotted {
				width: 100%;
				border-color: $primaryPale;
				border-style: none none dashed;
				z-index: 2;
			}

			&.solid {
				transition: all 0.6s ease-out;
				border-color: $secondary;
				background-color: $secondary;
				z-index: 3;
			}
		}
	}

	.stepWrapper {
		font-family: $poppins;
		position: relative;
		z-index: 10;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 8px 12px;
		border-radius: 10px;
		@include transition();

		&:hover {
			.number {
				color: $primaryLight;
				border: $line-width solid $primaryLight;
			}
			.stepText {
				color: $primaryLight;
			}
		}

		.number {
			z-index: 10;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			width: $size;
			height: $size;
			color: $primaryPale;
			background-color: $offWhite;
			border: $line-width solid $primaryPale;
			border-radius: $round-full;
			font-weight: $font-bold;
			font-size: 18px;
			font-family: $roboto;
			@include transition();

			.activator {
				display: none;
			}
		}
		.stepText {
			@include transition();
			display: none;
			@media (min-width: #{$breakpoint-xl}) {
				display: inline;
				font-size: 15px;
				font-weight: $font-medium;
				color: $primaryPale;
			}
		}

		&.-active {
			.number {
				@include activatedNumber();

				.activator {
					display: inline;
					position: absolute;
					z-index: 5;
					width: $size + 6px;
					height: $size + 6px;
					border-radius: $round-full;
					background-color: transparent;
					border: $line-width + 3px solid $offWhite;
					outline: $line-width solid $secondary;
					// @include shine($secondary);
				}
			}

			.stepText {
				@include activatedText();
			}
		}
		&.-prev {
			.number {
				@include activatedNumber();
			}
			.stepText {
				@include activatedText();
			}
		}
	}
}
</style>
