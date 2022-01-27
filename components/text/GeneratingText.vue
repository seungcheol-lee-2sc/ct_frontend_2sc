<template>
	<div class="generatingWrapper" :style="{ height: height }">
		<span class="titleText"> <slot></slot>{{ dotdotdot }} </span>
		<ProgressBar :height="18" :hide-texts="true" :progress="progress" />
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import ProgressBar from '../bar/ProgressBar.vue';

@Component({
	components: {
		ProgressBar,
	},
})
export default class GeneratingText extends Vue {
	@Prop({ required: true }) progress!: number;
	@Prop({ required: true }) height!: string;

	dotInterval: any = null;
	dotCount: number = 0;

	get dotdotdot(): string {
		let result = '';
		for (let i = 0; i < this.dotCount; i++) {
			result += '.';
		}
		return result;
	}

	dotLoop() {
		if (this.dotCount >= 5) {
			this.dotCount = 0;
		} else {
			this.dotCount += 1;
		}
	}

	mounted() {
		this.dotLoop();
		this.dotInterval = window.setInterval(() => {
			this.dotLoop();
		}, 1000);
	}

	destroyed() {
		clearInterval(this.dotInterval);
	}
}
</script>

<style lang="scss" scoped>
.generatingWrapper {
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	gap: 12px;
	width: 100vh;
	max-width: 300px;
	margin: 0 auto;

	.titleText {
		font-family: $poppins;
		font-weight: $font-medium;
		font-size: 16px;
	}
}
</style>
