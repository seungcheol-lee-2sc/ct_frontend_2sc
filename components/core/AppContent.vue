<template>
	<v-main id="market" :path="path">
		<nuxt id="main-inner" />
	</v-main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class AppContent extends Vue {
	get path(): string {
		return this.$route.path;
	}
}
</script>

<style lang="scss">
[path='/'] {
	overflow: hidden;
}
</style>
