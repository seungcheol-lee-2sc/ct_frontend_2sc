<template>
	<div class="paginationWrapper">
		<v-pagination v-model="insidePage" :length="length" total-visible="9" color="primary" />
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator';

@Component
export default class Pagination extends Vue {
	@Prop({ required: true }) total!: number;
	@Prop({ required: true }) page!: number;
	@Prop({ required: true }) size!: number;

	insidePage: number = 1;

	@Watch('insidePage')
	watchInsidePage() {
		this.$emit('onChangePage', this.insidePage);
	}

	get length() {
		return this.total > 0 ? Math.ceil(this.total / this.size) : 0;
	}

	created() {
		this.insidePage = this.page;
	}
}
</script>

<style lang="scss" scoped>
.paginationWrapper {
	display: flex;
	align-items: center;
	gap: 10px;
	justify-content: center;
}
</style>
