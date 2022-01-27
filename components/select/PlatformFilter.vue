<template>
	<v-menu offset-y close-on-content-click close-on-click>
		<template #activator="{ on, attrs }">
			<FilterAndValueButton
				:attrs="attrs"
				:on="on"
				:filtered-text="finalFilter"
				:activate="finalFilter"
				init-text="Account"
				:not-used="notUsed"
			/>
		</template>
		<ProductMenuList :product-menu-list="platformMenuList" :dense="true" :value="finalFilter" :two-depth="true" />
	</v-menu>
</template>

<script lang="ts">
import { Component, Prop, State, Vue } from 'nuxt-property-decorator';
import FilterAndValueButton from '~/components/button/FilterAndValueButton.vue';
import ProductMenuList, { IProductMenuList } from '~/components/list/ProductMenuList.vue';
import { IPlatform, IUserTransactionRecordSource } from '~/types/provider/types';

@Component({
	components: {
		FilterAndValueButton,
		ProductMenuList,
	},
})
export default class PlatformFilter extends Vue {
	@Prop({ required: true }) finalFilter!: string | null;
	@Prop() notUsed!: boolean;

	@State(({ provider }) => provider.providerSources) providerSources!: IUserTransactionRecordSource[];
	@State(({ provider }) => provider.platforms) platforms!: IPlatform[];

	get platformMenuList(): IProductMenuList[] {
		const clearItem: IProductMenuList[] = this.finalFilter
			? [
					{
						color: 'error',
						fixStyle: true,
						text: 'Clear',
						onclick: () => {
							this.$emit('parentSelector', null);
							this.$emit('selector', null);
						},
						clickOnly: true,
					},
			  ]
			: [];

		const result: IProductMenuList[] = [...this.platforms]
			.map(v => ({
				color: 'primaryLight',
				text: String(v.name),
				onclick: () => {
					if (v.provider) {
						this.$emit('parentSelector', v.provider.id);
					} else if (v.asset) {
						this.$emit('parentSelector', v.asset.symbol);
					} else {
						// custom
						this.$emit('selector', v.name || null);
					}
				},
				subList: v.providerSources
					.map(v => ({
						color: 'primaryLight',
						text: String(v.name),
						onclick: () => {
							this.$emit('selector', v.name || null);
						},
					}))
					.sort((a, b) => (a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1)),
			}))
			.sort((a, b) => (a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1));

		return clearItem.concat(result);
	}
}
</script>
