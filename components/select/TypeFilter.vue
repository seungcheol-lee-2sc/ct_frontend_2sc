<template>
	<v-menu v-model="typeFilterMenu" offset-y>
		<template #activator="{ on, attrs }">
			<FilterAndValueButton
				:attrs="attrs"
				:on="on"
				:filtered-text="finalFilter && finalFilter.label"
				:activate="finalFilter"
				init-text="Type"
			/>
		</template>
		<ProductMenuList :product-menu-list="typeMenuList" :dense="true" :value="finalFilter && finalFilter.label" />
	</v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop, State } from 'nuxt-property-decorator';
import FilterAndValueButton from '~/components/button/FilterAndValueButton.vue';
import ProductMenuList, { IProductMenuList } from '~/components/list/ProductMenuList.vue';
import { IFlattenTransactionType } from '~/types/transaction/types';
import { firstCharUppercase } from '~/utils/string';

@Component({
	components: {
		FilterAndValueButton,
		ProductMenuList,
	},
})
export default class TypeFilter extends Vue {
	@Prop({ required: true }) finalFilter!: string | null;
	@Prop({ required: true }) parentFilter!: string | null;

	@State(({ transaction }) => transaction.transactionTypeArr) transactionTypeArr!: IFlattenTransactionType[];
	typeFilterMenu: boolean = false;

	get typeMenuList(): IProductMenuList[] {
		const clearItem: IProductMenuList[] = this.finalFilter
			? [
					{
						color: 'error',
						fixStyle: true,
						text: 'Clear',
						onclick: () => {
							this.$emit('selector', null);
						},
					},
			  ]
			: [];

		const result: IProductMenuList[] = this.transactionTypeArr
			.filter(v => v.userSelectable)
			.filter(v => (this.parentFilter ? v.category === this.parentFilter : true))
			.map((t: IFlattenTransactionType) => ({
				color: 'primaryLight',
				text: t.label,
				origin: t,
				onclick: () => {
					this.$emit('selector', t);
				},
			}));

		let currentCategory: string = '';
		const newResult: IProductMenuList[] = [];

		result.forEach(v => {
			if (v.origin.category !== currentCategory) {
				currentCategory = v.origin.category;
				newResult.push({
					text: firstCharUppercase(v.origin.category),
					color: 'disabled',
					disabled: true,
					onclick: () => null,
					border: true,
				});
			}
			newResult.push(v);
		});

		return clearItem.concat(newResult);
	}

	firstCharUppercase = (t: string) => firstCharUppercase(t);
}
</script>
