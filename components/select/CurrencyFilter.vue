<template>
	<v-menu offset-y>
		<template #activator="{ on, attrs }">
			<FilterAndValueButton
				:attrs="attrs"
				:on="on"
				:filtered-text="finalFilter"
				:activate="finalFilter"
				init-text="Currency"
			/>
		</template>
		<ProductMenuList :product-menu-list="currencyMenuList" :dense="true" :value="finalFilter" />
	</v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop, State } from 'nuxt-property-decorator';
import ProductMenuList, { IProductMenuList } from '../list/ProductMenuList.vue';
import FilterAndValueButton from '~/components/button/FilterAndValueButton.vue';

@Component({
	components: {
		ProductMenuList,
		FilterAndValueButton,
	},
})
export default class CurrencyFilter extends Vue {
	@Prop({ required: true }) finalFilter!: string | null;

	@State(({ asset }) => asset.usedAssets) usedAssets!: string[];

	get currencyMenuList(): IProductMenuList[] {
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

		const result: IProductMenuList[] = this.usedAssets.map(v => ({
			color: 'primaryLight',
			text: v,
			onclick: () => {
				this.$emit('selector', v);
			},
		}));

		return clearItem.concat(result);
	}
}
</script>
