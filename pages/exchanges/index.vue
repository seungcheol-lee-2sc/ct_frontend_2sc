<template>
	<div class="topBodyWrapper">
		<section class="sectionWrapper">
			<div class="topSectionInner">
				<h1 class="titleText">Exchanges</h1>
				<h6 class="descText">See what kind of exchanges we support.</h6>
			</div>
		</section>

		<section class="sectionWrapper exchanges">
			<div class="wrapper792">
				<div class="searchInputWrapper">
					<v-text-field
						v-model="inputForSearch"
						hide-details
						outlined
						:placeholder="isMobile ? 'Search..' : 'What are you searching for?'"
						prepend-inner-icon="mdi-magnify"
					/>
				</div>
			</div>
			<div class="filterButtons" :class="reformedProviders.length === 0 ? '-no-margin' : ''">
				<FilterButton
					:active="providerTypeFilter === EProviderTypeFilter.ALL"
					:name="isMobile ? 'All' : `All (${numbersOfProviders.all})`"
					@click="filteringProviders(EProviderTypeFilter.ALL)"
				/>
				<FilterButton
					:active="providerTypeFilter === EProviderTypeFilter.EXCHANGE"
					:name="isMobile ? 'Exchange' : `Exchange (${numbersOfProviders.exchange})`"
					@click="filteringProviders(EProviderTypeFilter.EXCHANGE)"
				/>
				<FilterButton
					:active="providerTypeFilter === EProviderTypeFilter.WALLET"
					:name="isMobile ? 'Wallet' : `Wallet (${numbersOfProviders.wallet})`"
					@click="filteringProviders(EProviderTypeFilter.WALLET)"
				/>
				<FilterButton
					:active="providerTypeFilter === EProviderTypeFilter.BLOCK_CHAIN"
					:name="isMobile ? 'Blockchain' : `Blockchain (${numbersOfProviders.blockChain})`"
					@click="filteringProviders(EProviderTypeFilter.BLOCK_CHAIN)"
				/>
				<FilterButton
					:active="providerTypeFilter === EProviderTypeFilter.SERVICE"
					:name="isMobile ? 'Service' : `Service (${numbersOfProviders.service})`"
					@click="filteringProviders(EProviderTypeFilter.SERVICE)"
				/>
			</div>

			<EmptyDataSection v-if="reformedProviders.length === 0" src="/characters/big-smile-question.png">
				<template v-if="inputForSearch"> Woops! Not supported yet. </template>
			</EmptyDataSection>

			<div v-else class="providerIconsWrap">
				<div v-for="provider in reformedProviders" :key="`${provider.id}${provider.name}`">
					<ViewProviderCard :provider="provider" />
				</div>
			</div>
		</section>
		<CountMeInSection />
	</div>
</template>

<script lang="ts">
import { Component, Vue, State, Mutation } from 'nuxt-property-decorator';
import { LOAD_PROVIDERS_PUBLIC, FILTERING_PROVIDERS, SET_SORT_ITEM } from '~/store/provider';
import {
	EProviderSortItem,
	EProviderTypeFilter,
	INumbersOfProviders,
	ITransactionRecordProvider,
} from '~/types/provider/types';
import FilterButton from '~/components/button/FilterButton.vue';
import ViewProviderCard from '~/components/card/ViewProviderCard.vue';
import { LOAD_COINS_PUBLIC } from '~/store/asset';
import { metaInfo } from '~/utils/application';
import CountMeInSection from '~/components/section/CountMeInSection.vue';
import { IAsset } from '~/types/asset/types';
import { providerNumbers, reforming, searching } from '~/utils/provider';
import EmptyDataSection from '~/components/section/EmptyDataSectino.vue';

@Component({
	components: {
		FilterButton,
		ViewProviderCard,
		CountMeInSection,
		EmptyDataSection,
	},
	asyncData: async ({ store }) => {
		store.commit(`provider/${SET_SORT_ITEM}`, EProviderSortItem.POPULARITY);
		await Promise.all([
			store.dispatch(`provider/${LOAD_PROVIDERS_PUBLIC}`),
			store.dispatch(`asset/${LOAD_COINS_PUBLIC}`),
		]);
	},
})
export default class Exchanges extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'Exchanges',
		);
	}

	@State(({ provider }) => provider.publicProviders) publicProviders!: ITransactionRecordProvider[];
	@State(({ provider }) => provider.providerTypeFilter) providerTypeFilter!: EProviderTypeFilter;
	@State(({ provider }) => provider.providerSortItem) providerSortItem!: EProviderSortItem;
	@State(({ asset }) => asset.loading) assetLoading!: boolean;
	@State(({ asset }) => asset.publicCoins) publicCoins!: IAsset[];
	@State(state => state.isMobile) isMobile!: boolean;

	EProviderTypeFilter = EProviderTypeFilter;
	EProviderSortItem = EProviderSortItem;
	inputForSearch: string = '';

	get numbersOfProviders(): INumbersOfProviders {
		return providerNumbers(searching(this.publicProviders, this.publicCoins, this.inputForSearch.trim()));
	}

	get reformedProviders(): (ITransactionRecordProvider | IAsset)[] {
		const enabledCoins = this.publicCoins;
		return reforming(
			this.publicProviders,
			this.providerTypeFilter,
			enabledCoins,
			this.inputForSearch.trim(),
			this.providerSortItem,
		).slice(0, 100);
	}

	@Mutation(`provider/${FILTERING_PROVIDERS}`) filteringProviders!: any;
}
</script>

<style lang="scss" scoped>
.topSectionInner {
	padding-bottom: 52px;
	text-align: center;

	.titleText {
		font-size: 26px;
		line-height: 1.38;
		font-weight: $font-semibold;
		font-family: $poppins;
		color: $primary;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 48px;
			line-height: 1.25;
			letter-spacing: -0.5px;
		}

		&.-white {
			color: $white;
		}
	}

	.descText {
		padding-top: 16px;
		font-size: 14px;
		letter-spacing: 0.15px;
		line-height: 1.71;
		font-weight: $font-medium;
		color: $primaryLight;
		font-family: $poppins;
		min-width: 270px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 19px;
			color: $primary;
			line-height: 1.58;
			letter-spacing: 0.15px;
		}

		&.-white {
			color: $white;
		}
	}
}

.exchanges {
	padding-bottom: 100px;

	.searchInputWrapper {
		margin-bottom: 30px;
	}

	.filterButtons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		margin-bottom: 60px;
		@media (min-width: #{$breakpoint-xl}) {
			margin-bottom: 91px;
		}

		&.-no-margin {
			margin: 0;
		}
	}

	.providerIconsWrap {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
}
</style>
