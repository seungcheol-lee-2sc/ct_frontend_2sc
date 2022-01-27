<template>
	<v-btn
		depressed
		rounded
		class="filterButton"
		:height="btnHeight"
		:class="active ? '-activate' : '-inactivate'"
		:color="active ? 'secondaryPale' : 'transparent'"
		:disabled="disabled"
		:small="small"
		@click.stop="onClickButton"
	>
		<v-icon v-if="active" class="leftIcon" color="primary">mdi-check</v-icon>
		<span class="buttonText"> {{ name }}</span>
	</v-btn>
</template>

<script lang="ts">
import { Vue, Component, State, Prop } from 'nuxt-property-decorator';

@Component
export default class FilterButton extends Vue {
	@Prop({ required: true }) active!: boolean;
	@Prop({ required: true }) name!: string;
	@Prop() disabled!: boolean;
	@Prop() small!: boolean;

	@State(state => state.isMobile) isMobile!: boolean;

	get btnHeight(): string {
		return this.isMobile ? '28' : '32';
	}

	onClickButton() {
		!this.disabled && this.$emit('click');
	}
}
</script>

<style lang="scss" scoped>
.filterButton {
	border: 1px solid $outline !important;

	&.-activate {
		border: 1px solid $primary !important;
	}

	.leftIcon {
		margin-right: 4px;
	}

	.buttonText {
		font-weight: $font-normal;
	}
}
</style>
