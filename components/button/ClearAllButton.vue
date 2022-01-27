<template>
	<span text color="primary" class="clearAllButton" @click.stop="$emit('click')"> Clear all </span>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class ClearAllbutton extends Vue {}
</script>

<style lang="scss" scoped>
.clearAllButton {
	padding: 1px;
	white-space: nowrap;
	color: $primary;
	display: inline-block;
	font-family: $poppins;
	cursor: pointer;
}
</style>
