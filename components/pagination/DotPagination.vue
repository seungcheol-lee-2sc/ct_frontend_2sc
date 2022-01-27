<template>
	<div class="paginationWrapper">
		<template v-for="page in pageArr">
			<v-icon
				:key="`pagination-${page}`"
				size="14"
				:color="activePage(page) ? 'primary' : 'disabled'"
				@click="onChangePage(page)"
			>
				mdi-circle
			</v-icon>
		</template>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator';

@Component
export default class DotPagination extends Vue {
	@Prop({ required: true }) total!: number;
	@Prop({ required: true }) page!: number;
	@Prop({ required: true }) size!: number;
	@Prop() fromZero!: boolean;

	insidePage: number = 1;

	@Watch('page')
	watchPage(newVal: number) {
		this.insidePage = newVal;
	}

	get pageArr(): number[] {
		return Array(this.length)
			.fill(0)
			.map((_, idx) => (this.fromZero ? idx : idx + 1));
	}

	get length() {
		return this.total > 0 ? Math.ceil(this.total / this.size) : 0;
	}

	activePage(page: number): boolean {
		return this.insidePage === page;
	}

	onChangePage(page: number) {
		this.$emit('onchange', page);
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
