<template>
	<div id="pageLoadingBar" :class="pageLoading ? '-active' : ''">
		<span></span>
		<span></span>
		<span></span>
	</div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator';

@Component
export default class PageLoadingBar extends Vue {
	@State(state => state.pageLoading) pageLoading!: boolean;
}
</script>

<style lang="scss" scoped>
#pageLoadingBar {
	width: 100vw;
	position: fixed;
	bottom: -40px;
	display: flex;
	justify-content: center;
	gap: 12px;
	height: 0;
	transition: all 1s ease-in-out;

	&.-active {
		bottom: 0;
		transform: translateY(-24px);
	}

	> span {
		display: inline-block;
		width: 16px;
		height: 16px;
		border-radius: $round-full;

		&:nth-child(1) {
			background-color: $tertiaryLight;
			animation: jump-1 2s infinite;
		}
		&:nth-child(2) {
			background-color: $orangeLight;
			animation: jump-2 2s infinite;
		}
		&:nth-child(3) {
			background-color: $purpleLight;
			animation: jump-3 2s infinite;
		}
	}
}
</style>
