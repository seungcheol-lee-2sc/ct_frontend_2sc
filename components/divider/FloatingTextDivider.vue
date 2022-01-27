<template>
	<div class="dividerWrapper">
		<v-divider />
		<span class="dividerText">{{ text }}</span>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class FloatingTextDivider extends Vue {
	@Prop({ required: true }) text!: string;
}
</script>

<style lang="scss" scoped>
.dividerWrapper {
	display: flex;
	align-items: center;
	justify-content: center;

	.dividerText {
		position: absolute;
		padding: 12px;
		background-color: $white;
		font-size: 16px;
	}
}
</style>
