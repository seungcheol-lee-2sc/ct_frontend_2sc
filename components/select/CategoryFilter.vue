<template>
	<v-menu offset-y>
		<template #activator="{ on, attrs }">
			<FilterAndValueButton
				:attrs="attrs"
				:on="on"
				:filtered-text="firstCharUppercase(finalFilter)"
				:activate="finalFilter"
				init-text="Category"
				:not-used="notUsed"
			/>
		</template>
		<ProductMenuList :product-menu-list="categoryMenuList" :dense="true" :value="finalFilter" />
	</v-menu>
</template>

<script lang="ts">
import { Component, Getter, Prop, Vue } from 'nuxt-property-decorator';
import FilterAndValueButton from '~/components/button/FilterAndValueButton.vue';
import ProductMenuList, { IProductMenuList } from '~/components/list/ProductMenuList.vue';
import { firstCharUppercase } from '~/utils/string';

@Component({
	components: {
		FilterAndValueButton,
		ProductMenuList,
	},
})
export default class CategoryFilter extends Vue {
	@Prop({ required: true }) finalFilter!: string | null;
	@Prop() notUsed!: boolean;

	@Getter(`transaction/transactionCategoryArr`) transactionCategoryArr!: string[];

	get categoryMenuList(): IProductMenuList[] {
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

		const result = this.transactionCategoryArr.map(t => ({
			color: 'primaryLight',
			text: firstCharUppercase(t),
			onclick: () => {
				this.$emit('selector', t);
			},
		}));

		return clearItem.concat(result);
	}

	firstCharUppercase = (str: string) => firstCharUppercase(str);
}
</script>
