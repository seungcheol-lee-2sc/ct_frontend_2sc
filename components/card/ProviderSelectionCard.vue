<template>
	<v-card class="dialogCardWrapper" :min-height="isMobile ? 300 : 730">
		<v-icon class="closeBtn" color="primary" @click="close">mdi-close</v-icon>

		<div class="titleText">{{ $t('page.import.dialogTitle') }}</div>

		<div style="margin-bottom: 28px">
			<v-text-field
				v-model.trim="searchText"
				maxlength="40"
				outlined
				hide-details
				placeholder="Search wallets, exchanges..."
				prepend-inner-icon="mdi-magnify"
				clearable
				@keypress.enter="onChangeSearchText(searchText)"
			/>
		</div>

		<div class="filtersWarpper">
			<div class="filters">
				<FilterButton
					:active="providerTypeFilter === EProviderTypeFilter.ALL"
					:name="`All (${numbersOfProviders.all})`"
					@click="onClickFilter(EProviderTypeFilter.ALL)"
				/>
				<FilterButton
					:active="providerTypeFilter === EProviderTypeFilter.EXCHANGE"
					:name="`${$t('product.exchange')} (${numbersOfProviders.exchange})`"
					@click="onClickFilter(EProviderTypeFilter.EXCHANGE)"
				/>
				<FilterButton
					:active="providerTypeFilter === EProviderTypeFilter.WALLET"
					:name="`${$t('product.wallet')} (${numbersOfProviders.wallet})`"
					@click="onClickFilter(EProviderTypeFilter.WALLET)"
				/>
				<FilterButton
					:active="providerTypeFilter === EProviderTypeFilter.BLOCK_CHAIN"
					:name="`${$t('product.blockchain')} (${numbersOfProviders.blockChain})`"
					@click="onClickFilter(EProviderTypeFilter.BLOCK_CHAIN)"
				/>
				<FilterButton
					:active="providerTypeFilter === EProviderTypeFilter.SERVICE"
					:name="`${$t('product.service')} (${numbersOfProviders.service})`"
					@click="onClickFilter(EProviderTypeFilter.SERVICE)"
				/>
				<FilterButton
					:active="providerTypeFilter === EProviderTypeFilter.CUSTOM"
					:name="`${$t('product.custom')} (${numbersOfPlatforms.custom})`"
					@click="onClickFilter(EProviderTypeFilter.CUSTOM)"
				/>
			</div>
			<div>
				<v-menu offset-y>
					<template #activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on">
							Sort by: {{ providerSortItem }} <v-icon color="primary">mdi-menu-down</v-icon>
						</span>
					</template>
					<ProductMenuList :product-menu-list="sortMenuList" :value="providerSortItem" />
				</v-menu>
			</div>
		</div>

		<v-card v-if="reformedProviders.length === 0" elevation="0" height="350" width="100%">
			<div class="providerWrapper">
				<ProviderItem
					:top-pos="true"
					:last-pos="true"
					:provider="customProvider"
					@callback="close"
					@click="selectProvider"
				/>
			</div>
		</v-card>
		<template v-else>
			<v-virtual-scroll
				:items="isMobile ? reformedProviders : groupedProviders"
				:height="isMobile ? 300 : 400"
				item-height="80"
				width="100%"
				class="ct-scroll"
			>
				<template #default="{ item, index }">
					<div class="providerWrapper">
						<template v-if="isMobile">
							<ProviderItem
								:top-pos="index === 0"
								:last-pos="index === reformedProviders.length - 1"
								:provider="item"
								@callback="close"
								@click="selectProvider"
							/>
						</template>
						<template v-else>
							<ProviderItem
								v-if="item[0]"
								:top-pos="index === 0"
								:last-pos="!item[1] && index === groupedProviders.length - 1"
								:provider="item[0]"
								@callback="close"
								@click="selectProvider"
							/>
							<ProviderItem
								v-if="item[1]"
								:top-pos="index === 0"
								:last-pos="!item[2] && index === groupedProviders.length - 1"
								:provider="item[1]"
								@callback="close"
								@click="selectProvider"
							/>
							<ProviderItem
								v-if="item[2]"
								:top-pos="index === 0"
								:last-pos="!item[3] && index === groupedProviders.length - 1"
								:provider="item[2]"
								@callback="close"
								@click="selectProvider"
							/>
							<ProviderItem
								v-if="item[3]"
								:top-pos="index === 0"
								:right-pos="true"
								:last-pos="index === groupedProviders.length - 1"
								:provider="item[3]"
								@callback="close"
								@click="selectProvider"
							/>
						</template>
					</div>
				</template>
			</v-virtual-scroll>
		</template>

		<div class="showMoreWrapper">
			<span v-if="!showUnsupported" @click="toggleShowingUnsupported">
				Show all exchanges <v-icon color="primary">mdi-chevron-down</v-icon>
			</span>
			<span v-else @click="toggleShowingUnsupported">
				Hide additional exchanges <v-icon color="primary">mdi-chevron-up</v-icon>
			</span>
		</div>
	</v-card>
</template>

<script lang="ts">
import { Component, Getter, Mutation, Prop, State, Vue, Watch } from 'nuxt-property-decorator';
import { debounce } from 'lodash';
import { FILTERING_PROVIDERS, ON_CHANGE_SEARCH_TEXT, SET_SORT_ITEM, TOGGLE_SHOW_UNSUPPORTED } from '~/store/provider';
import {
	EProviderTypeFilter,
	IAddedAsset,
	IAddedProvider,
	INumbersOfProviders,
	ITransactionRecordProvider,
	TransactionRecordProviderType,
} from '~/types/provider/types';
import ProviderItem from '~/components/item/ProviderItem.vue';
import FilterButton from '~/components/button/FilterButton.vue';
import ProductMenuList, { IProductMenuList } from '~/components/list/ProductMenuList.vue';
import { IAsset } from '~/types/asset/types';
import InfoWithCharacterCard from '~/components/card/InfoWithCharacterCard.vue';

@Component({
	components: {
		ProviderItem,
		FilterButton,
		ProductMenuList,
		InfoWithCharacterCard,
	},
})
export default class ProviderSelectionCard extends Vue {
	@Prop({ required: true }) initTrigger!: boolean;

	searchText: string = '';
	EProviderTypeFilter = EProviderTypeFilter;
	TransactionRecordProviderType = TransactionRecordProviderType;

	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ provider }) => provider.providerSortItems) providerSortItems!: string[];
	@State(({ provider }) => provider.providerSortItem) providerSortItem!: string;
	@State(({ provider }) => provider.providerTypeFilter) providerTypeFilter!: EProviderTypeFilter;
	@State(({ provider }) => provider.updateProviderDialog) updateProviderDialog!: boolean;
	@State(({ provider }) => provider.showUnsupported) showUnsupported!: boolean;

	@Getter('provider/reformedProviders') reformedProviders!: (IAddedProvider | IAddedAsset)[];
	@Getter('provider/numbersOfProviders') numbersOfProviders!: INumbersOfProviders;
	@Getter('provider/numbersOfPlatforms') numbersOfPlatforms!: INumbersOfProviders;
	@Getter('provider/customProvider') customProvider!: ITransactionRecordProvider | null;

	get sortMenuList(): IProductMenuList[] {
		return this.providerSortItems.map(v => ({
			color: 'primaryLight',
			text: v,
			onclick: () => {
				this.$store.commit(`provider/${SET_SORT_ITEM}`, v);
			},
		}));
	}

	get groupedProviders(): (IAddedProvider | IAddedAsset)[][] {
		const result = [];

		const num = Math.floor(this.reformedProviders.length / 4);
		for (let i = 0; i < num + 1; i++) {
			const temp = [];
			for (let j = 0; j < 4; j++) {
				this.reformedProviders[4 * i + j] && temp.push(this.reformedProviders[4 * i + j]);
			}
			result.push(temp);
		}

		return result;
	}

	@Watch('updateProviderDialog')
	watchDialog(newVal: boolean) {
		if (!newVal) {
			this.searchText = '';
		}
	}

	@Watch('initTrigger', { immediate: true, deep: true })
	watchIntiTrigger(newVal: boolean, oldVal: boolean) {
		if (typeof newVal === 'boolean' && typeof oldVal === 'boolean') {
			this.searchText = '';
		}
	}

	@Watch('searchText')
	watchSearchText = debounce((newVal: string | null) => {
		this.onChangeSearchText(newVal || '');
	}, 500);

	@Mutation(`provider/${FILTERING_PROVIDERS}`) onClickFilter!: any;
	@Mutation(`provider/${ON_CHANGE_SEARCH_TEXT}`) onChangeSearchText!: any;

	toggleShowingUnsupported() {
		this.$store.commit(`provider/${TOGGLE_SHOW_UNSUPPORTED}`);
	}

	selectProvider(provider: ITransactionRecordProvider | IAsset) {
		this.$emit('selectProvider', provider);
	}

	close() {
		this.searchText = '';
		this.$emit('close');
	}
}
</script>

<style lang="scss" scoped>
.titleText {
	margin-bottom: 40px;
	font-size: 18px;
	font-family: $poppins;
	line-height: 1.2;
	@media (min-width: #{$breakpoint-xl}) {
		font-size: 33px;
	}
}

.filtersWarpper {
	display: flex;
	justify-content: space-between;
	margin-bottom: 24px;
	.filters {
		display: flex;
		gap: 12px;
		flex-direction: column;
		@media (min-width: #{$breakpoint-xl}) {
			flex-direction: row;
		}
	}
}

.providerWrapper {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	@media (min-width: #{$breakpoint-xl}) {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

.showMoreWrapper {
	text-align: center;
	margin-top: 16px;
	font-weight: $font-semibold;
	font-size: 14px;
	color: $primary;
	font-family: $poppins;
	user-select: none;
	> span {
		cursor: pointer;
		color: $primary;
		padding: 1px;
		&:hover {
			font-weight: $font-bold;
		}
	}
}
</style>
