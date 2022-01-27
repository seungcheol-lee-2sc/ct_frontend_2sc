<template>
	<v-tooltip bottom>
		<template #activator="{ on, attrs }">
			<v-btn
				:loading="loading"
				:disabled="disabled"
				depressed
				large
				color="white"
				class="refreshButton"
				:class="innerClass"
				width="44"
				height="44"
				min-width="auto"
				v-bind="attrs"
				@click="onClickButton"
				v-on="tooltip ? on : null"
			>
				<v-icon color="primary">mdi-refresh</v-icon>
			</v-btn>
		</template>
		<span v-if="tooltip">{{ tooltip }}</span>
	</v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class RefreshButton extends Vue {
	@Prop() disabled!: boolean;
	@Prop() loading!: boolean;
	@Prop() innerClass!: string;
	@Prop() tooltip!: string;

	onClickButton() {
		this.$emit('onclick');
	}
}
</script>

<style lang="scss" scoped>
.refreshButton {
	$border-radius: $round-xs;
	border: 1px solid $outline !important;
}
</style>
