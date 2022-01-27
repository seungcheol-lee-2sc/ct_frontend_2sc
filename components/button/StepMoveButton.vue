<template>
	<div class="stepButtonWrapper">
		<div class="stepButtonInner" :class="nextStep ? '-next' : '-prev'" @click.stop="$emit('click')">
			<div>
				<img :src="nextStep ? '/icon/next-step.png' : '/icon/prev-step.png'" />
				<img :src="nextStep ? '/icon/next-step.png' : '/icon/prev-step.png'" />
			</div>
			<span v-if="nextStep" class="-next">next step</span>
			<span v-else class="-prev">back step</span>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class StepMoveButton extends Vue {
	@Prop({ required: true }) nextStep!: boolean;
}
</script>

<style lang="scss" scoped>
@mixin transtion {
	transition: all 0.3s ease-in-out;
}

$img-width: 22px;

.stepButtonWrapper {
	.stepButtonInner {
		cursor: pointer;
		display: flex;
		flex-direction: column;
		width: 100px;
		align-items: center;
		gap: 8px;

		img {
			width: fit-content;
			display: inline-block;
			@include transtion();
		}

		> span {
			text-transform: uppercase;
			font-weight: bold;
			font-size: 14px;
		}

		> div {
			display: flex;
		}

		&.-next {
			float: right;

			> span {
				color: $primary;
			}

			img {
				transform: translateX(-($img-width/2));
				&:first-child {
					margin-right: -4px;
					opacity: 0;
				}
			}

			&:hover {
				img {
					transform: translateX(0);
					&:first-child {
						opacity: 1;
					}
				}
			}
		}
		&.-prev {
			> span {
				color: $secondaryDarkPale;
			}

			img {
				transform: translateX($img-width/2);
				&:last-child {
					margin-left: -4px;
					opacity: 0;
				}
			}

			&:hover {
				img {
					transform: translateX(0);
					&:last-child {
						opacity: 1;
					}
				}
			}
		}
	}
}
</style>
