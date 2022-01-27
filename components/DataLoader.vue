<template>
	<div class="loaderWrapper" :class="outlined ? '-outlined' : ''">
		<lottie-player autoplay loop mode="normal" src="/lottie-files/concept2/arcodian.json" class="player" />
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class DataLoader extends Vue {
	@Prop() outlined!: boolean;
}
</script>

<style lang="scss" scoped>
.loaderWrapper {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100px;
	transition: all 0.5s ease-in-out;

	&.-outlined {
		border: 1px solid $outline;
		border-radius: $round-md;
	}

	.player {
		width: 100%;
		max-width: 200px;
	}
}
</style>
