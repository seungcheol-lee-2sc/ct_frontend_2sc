<template>
	<div class="expandPanel">
		<div class="panelWrapper">
			<div class="panel">
				<slot name="panel"> </slot>
			</div>
			<Button
				:head-icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
				:icon="true"
				color="primaryLight"
				@click="toggleExpand"
			></Button>
		</div>

		<v-expand-transition>
			<div v-if="expanded">
				<v-divider class="divider"></v-divider>
				<slot name="expand"> </slot>
			</div>
		</v-expand-transition>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';

@Component({
	components: {
		Button,
	},
})
export default class ExpandPanel extends Vue {
	@Prop() forceExpand!: boolean;

	expanded = false;

	toggleExpand() {
		this.expanded = !this.expanded;
	}

	created() {
		if (this.forceExpand) {
			this.expanded = true;
		}
	}
}
</script>
<style lang="scss" scoped>
.expandPanel {
	padding: 16px;
	padding-top: 24px;
	padding-bottom: 24px;
	border-width: 1px;
	border-style: solid;
	border-color: $primaryPale;
	border-radius: $round-md;

	&.-mint-border {
		border-color: $secondary;
	}

	.panelWrapper {
		display: grid;
		gap: 8px;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		align-items: center;

		.panel {
			grid-column: span 11 / span 11;
		}

		.expandButton {
			grid-column: span 1 / span 1;
		}
	}

	.divider {
		margin-top: 16px;
		border-top: 1px solid $outline;
	}
}
</style>
