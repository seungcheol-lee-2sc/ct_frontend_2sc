<template>
	<v-overlay :value="value" z-index="200" :opacity="0.8">
		<div class="overlaySpace">
			<div class="overlayInner hide-mb">
				<img class="pointing" src="/characters/pointed-smile.png" />

				<div class="titleText">
					{{ welcomeText }}
					<img class="character" src="/characters/smile-arrow.png" />
				</div>
				<div class="descText">
					We’re going to take 4 steps to generate your tax report. Check our guide map by clicking the question mark on
					the upper right-hand corner. Ready?
				</div>
				<div class="startButton">
					<Button
						:disabled="loading"
						:height="52"
						:width="200"
						:rounded="true"
						color="primary"
						fontcolor="white"
						:fontsize="16"
						@click="endTour"
					>
						{{ buttonText }}
					</Button>
				</div>
			</div>
			<span class="placeholderButton">
				<v-icon size="28" color="white">mdi-help</v-icon>
			</span>

			<div class="hide-pc placeholderButton-mb">
				<Button
					:loading="loading"
					:disabled="loading"
					:height="52"
					:width="200"
					:rounded="true"
					color="primary"
					fontcolor="white"
					:fontsize="16"
					@click="endTour"
				>
					Let’s start
				</Button>
			</div>
		</div>
	</v-overlay>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import WelcomeDefault from '../mixins/WelcomeDefault.vue';
import { CLOSE_GUIDE_MAP, OPEN_GUIDE_MAP } from '~/store';

@Component({
	components: {
		Button,
	},
})
export default class WelcomeOverlay extends WelcomeDefault {
	@Prop({ required: true }) value!: boolean;

	loading: boolean = false;

	get welcomeText(): string {
		if (this.firstName) {
			return `Welcome, ${this.firstName}!`;
		} else {
			return 'Welcome!';
		}
	}

	get firstName(): string {
		return this.user?.attributes?.given_name || '';
	}

	async endTour() {
		this.loading = true;
		await this.callback();
		this.$emit('close');
		this.$store.commit(CLOSE_GUIDE_MAP);
		this.loading = false;
	}

	mounted() {
		this.$store.commit(OPEN_GUIDE_MAP);
	}
}
</script>

<style lang="scss" scoped>
.overlaySpace {
	display: flex;
	width: 100vw;
	height: 100vh;
	align-items: center;

	.overlayInner {
		position: fixed;
		right: 560px;
		width: 100%;
		max-width: 520px;
		padding: 15px;
		margin: 0 auto;
		color: $white;
		font-family: $poppins;
		text-align: center;

		.pointing {
			position: absolute;
			top: 0;
			right: -50px;
			transform: translateY(-100%);
		}

		.titleText {
			position: relative;
			font-size: 58px;
			letter-spacing: -0.5px;
			line-height: 1.3;
			margin-bottom: 16px;
			// text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

			.character {
				position: fixed;
				top: 90px;
				right: 480px;
			}
		}

		.descText {
			text-align: left;
			font-size: 19px;
			letter-spacing: 0.15px;
			font-weight: $font-medium;
			line-height: 1.55;
			margin-bottom: 30px;
		}

		.startButton {
			display: flex;
			justify-content: center;
		}
	}
	.placeholderButton {
		border-radius: $round-full;
		background-color: $primary;
		border: 3px solid $secondary;
		position: absolute;
		top: 6px;
		right: 14px;
		padding: 4px;

		&-mb {
			position: fixed;
			bottom: 20px;
			left: 50%;
			transform: translateX(-50%);
		}
	}
}
</style>
