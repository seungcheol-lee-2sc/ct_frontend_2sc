<template>
	<div class="nothingText">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class NothingText extends Vue {}
</script>

<style lang="scss" scoped>
.nothingText {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 18px;
	padding: 20px;
	background-color: white;
	color: $primaryPale;
}
</style>
