<template>
	<v-dialog v-model="dialog" persistent max-width="500" @keydown.esc="closeDialog" @click:outside="closeDialog">
		<div class="dialogCardWrapper dialogInner">
			<div v-if="!done" class="analyzingWrapper">
				<img src="/characters/computing.png" />

				<div class="titleText">Analyzing {{ progress }}%</div>
				<div class="barWrapper">
					<ProgressBar :height="18" :hide-texts="true" :progress="progress" />
				</div>

				<Button style="margin: auto" color="secondary" :text="true" :fontsize="14" @click="$emit('cancel')">
					{{ $t('common.cancel') }}
				</Button>
			</div>
			<div v-else class="doneWrapper">
				<div class="imageWrapper">
					<span>
						<lottie-player
							v-if="dialog"
							class="sprinkles"
							autoplay
							mode="normal"
							src="/lottie-files/effects/sprinkles.json"
						/>
					</span>
					<img class="smile" src="/characters/big-smile.png" />
				</div>

				<div class="titleText">Congratulation!</div>
				<div class="descText">Auto matching was completed.</div>

				<div class="buttonsWrapper">
					<Button
						fontcolor="white"
						:rounded="true"
						:width="180"
						:height="44"
						:fontsize="14"
						color="secondary"
						@click="$router.push('/tax/report')"
					>
						Go to get report
					</Button>
				</div>
			</div>
		</div>
	</v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import ProgressBar from '../bar/ProgressBar.vue';
import Button from '../button/Button.vue';

@Component({
	components: {
		Button,
		ProgressBar,
	},
})
export default class AutoFixDialog extends Vue {
	@Prop({ required: true }) dialog!: boolean;
	@Prop({ required: true }) done!: boolean;
	@Prop({ required: true }) progress!: number;

	closeDialog() {
		this.$emit('close');
	}
}
</script>

<style lang="scss" scoped>
@mixin title {
	font-family: $poppins;
	font-size: 19px;
	letter-spacing: 0.15px;
	font-weight: $font-medium;
	line-height: 1.58;
}

.dialogInner {
	background-color: $white;
	border-radius: $round-lg;
	overflow: hidden;
	text-align: center;

	.analyzingWrapper {
		max-width: 252px;
		margin: 0 auto;

		.titleText {
			margin-bottom: 12px;
			@include title();
		}

		.barWrapper {
			margin-bottom: 24px;
		}
	}

	.doneWrapper {
		padding-bottom: 18px;
		.imageWrapper {
			position: relative;
			margin-top: 48px;
			img {
				position: relative;
				z-index: 2;
			}

			> span {
				width: 80%;
				position: absolute;
				z-index: 1;
				top: 0;
				left: 50%;
				transform: translate(-50%, -30%);

				.sprinkles {
					position: relative;
					z-index: 1;
				}
			}
		}

		.titleText {
			margin-bottom: 4px;
			@include title();
		}

		.descText {
			font-size: 14px;
			color: $primaryLight;
			letter-spacing: 0.25px;
			margin-bottom: 14px;
		}
	}
}
</style>
