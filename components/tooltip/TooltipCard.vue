<template>
	<v-menu :open-on-hover="true" :bottom="bottom" :top="top" :left="left" :right="right" offset-y max-width="300">
		<template #activator="{ on, attrs }">
			<v-hover v-slot="{ hover }">
				<span style="padding: 1px; cursor: default" v-bind="attrs" v-on="on">
					<v-icon :color="hover ? 'secondaryLight' : 'disabled'" small>mdi-help-circle</v-icon>
				</span>
			</v-hover>
		</template>

		<v-card outlined elevation="0" class="tooltipCard">
			<div style="margin-bottom: 4px">
				<slot></slot>
			</div>
		</v-card>
	</v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class TooltipCard extends Vue {
	@Prop() bottom!: boolean;
	@Prop() top!: boolean;
	@Prop() left!: boolean;
	@Prop() right!: boolean;
}
</script>

<style lang="scss" scoped>
.tooltipCard {
	padding: 12px;
	font-size: 12px;
	font-family: $poppins;
	line-height: 1.4;

	.orderList {
		margin-top: 16px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
}
</style>
