<template>
	<div class="loaderWrapper" :class="outlined ? '-outlined' : ''">
		<div>
			<lottie-player autoplay loop mode="normal" :src="src" class="player" />
		</div>
		<span>
			<slot></slot>
		</span>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class LottieLoader extends Vue {
	@Prop({ required: true }) src!: string;
	@Prop() outlined!: boolean;
}
</script>

<style lang="scss" scoped>
.loaderWrapper {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100px;
	font-family: $poppins;
	flex-direction: column;
	padding: 24px;

	&.-outlined {
		border: 1px solid $outline;
		border-radius: $round-md;
	}

	.player {
		width: 100%;
		max-width: 200px;
	}

	> span {
		text-align: center;
		font-size: 14px;
	}
}
</style>
