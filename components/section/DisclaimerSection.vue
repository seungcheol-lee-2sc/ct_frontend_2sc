<template>
	<section v-if="content" class="disclaimerSection">
		<div>{{ content }}</div>
	</section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class DisclaimerSection extends Vue {
	@Prop({ required: true }) content!: string;
}
</script>

<style lang="scss" scoped>
.disclaimerSection {
	font-size: 12px;
	font-family: $roboto;
	color: $disabled;
	@media (min-width: #{$breakpoint-xl}) {
		font-size: 14px;
		margin-bottom: 64px;
	}
}
</style>
