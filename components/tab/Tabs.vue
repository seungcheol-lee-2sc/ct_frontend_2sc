<template>
	<div class="tabs">
		<div
			v-for="(tab, idx) in tabs"
			:key="`tab-${idx}`"
			class="tabItem"
			:class="value === idx ? '-active' : ''"
			@click="onClickTab(idx)"
		>
			{{ tab }}
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
@Component
export default class Tabs extends Vue {
	@Prop({ required: true }) tabs!: string[];
	@Prop({ required: true }) value!: number;

	onClickTab(index: number) {
		this.$emit('change', index);
	}
}
</script>

<style lang="scss" scoped>
.tabs {
	display: flex;
	color: $primaryLight;
	font-weight: $font-medium;
	line-height: 1.1;
	font-family: $poppins;
	letter-spacing: 1.25px;
	font-size: 12px;

	@media (min-width: #{$breakpoint-xl}) {
		font-size: 14px;
	}

	.tabItem {
		text-align: center;
		padding: 16px 4px;
		flex: 1;
		border-bottom: 1px solid $outline;
		cursor: pointer;
		user-select: none;

		&.-active {
			border-bottom: 2px solid $primaryLight;
		}
	}
}
</style>
