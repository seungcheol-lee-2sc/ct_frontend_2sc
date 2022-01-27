<template>
	<div class="paginationArrows">
		<v-btn :small="isMobile" icon :disabled="disabledPrev" color="primary" @click="onClickPrev">
			<v-icon>mdi-chevron-left</v-icon>
		</v-btn>

		<slot></slot>

		<v-btn :small="isMobile" icon :disabled="disabledNext" color="primary" @click="onClickNext">
			<v-icon>mdi-chevron-right</v-icon>
		</v-btn>
	</div>
</template>

<script lang="ts">
import { Component, Prop, State, Vue } from 'nuxt-property-decorator';

@Component
export default class ArrowPagination extends Vue {
	@Prop() scrollTop!: boolean;
	@Prop({ required: true }) page!: number;
	@Prop({ required: true }) pageLength!: number;
	@Prop() loading!: boolean;

	@State(state => state.isMobile) isMobile!: boolean;

	get disabledNext(): boolean {
		return Boolean(this.pageLength - 1 <= this.page) || this.loading;
	}

	get disabledPrev(): boolean {
		return Boolean(this.page <= 0) || this.loading;
	}

	onClickNext() {
		this.scrollTop ? this.$emit('nextTop') : this.$emit('next');
	}

	onClickPrev() {
		this.scrollTop ? this.$emit('prevTop') : this.$emit('prev');
	}
}
</script>

<style lang="scss" scoped>
.paginationArrows {
	user-select: none;
}
</style>
