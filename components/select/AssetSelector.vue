<template>
	<div v-click-outside="onClickOutside" autocomplete>
		<v-text-field
			ref="searchField"
			v-model="symbol"
			:label="finalLabel"
			:placeholder="placeholder"
			outlined
			:readonly="readonly"
			:disabled="disabled || loadingAssets"
			append-icon="mdi-menu-down"
			:loading="loadingAssets"
			:error="errorStatus"
			hide-details="auto"
			:rules="required && !disabled ? requiredRules : [true]"
			:filled="filled"
			:style="maxWidth ? { maxWidth: `${maxWidth}px` } : {}"
			@keypress.enter="onEnter"
			@focus="onFocus"
		>
			<template #prepend-inner>
				<div v-if="asset && asset.symbol !== MANUAL_ASSET" class="assetAvatar">
					<img :src="selectedIcon" />
				</div>
			</template>
		</v-text-field>

		<div v-if="focused" ref="autoLists" class="auto-lists -shadow" @scroll="onScrollList">
			<div v-for="(asset, index) in filteredAssets" :key="asset.id" class="auto-list-item">
				<div v-if="asset.header" class="auto-list-head">{{ asset.header }}</div>
				<v-divider v-else-if="asset.divider"></v-divider>
				<AssetSelection
					v-else-if="shownIndex + 10 > index"
					:asset="asset"
					:height="selectionHeight"
					@click="onChangeAsset(asset, true)"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, State, Vue, Watch } from 'nuxt-property-decorator';
import AssetSelection from './AssetSelection.vue';
import { AssetCategory, IAsset } from '~/types/asset/types';
import { requiredRule } from '~/utils/rules';
import { getIconImage } from '~/utils/application';

export const MANUAL_ASSET = 'Manual input';

@Component({
	components: {
		AssetSelection,
	},
})
export default class AssetSelector extends Vue {
	$refs!: {
		autocomplete: any;
		autoLists: HTMLElement;
		searchField: any;
	};

	@Prop({ required: true }) value!: string;
	@Prop() label!: string;
	@Prop() placeholder!: string;
	@Prop() disabled!: boolean;
	@Prop() readonly!: boolean;
	@Prop() filled!: boolean;
	@Prop() required!: boolean;
	@Prop() onlyCoins!: boolean;
	@Prop() dense!: boolean;
	@Prop() maxWidth!: number;

	@State(({ asset }) => asset.enabledCoins) enabledCoins!: IAsset[];
	@State(({ asset }) => asset.successToLoadEnabledFiats) successToLoadEnabledFiats!: boolean;
	@State(({ asset }) => asset.successToLoadDisabledFiats) successToLoadDisabledFiats!: boolean;
	@State(({ asset }) => asset.successToLoadEnabledCoins) successToLoadEnabledCoins!: boolean;
	@State(({ asset }) => asset.successToLoadDisabledCoins) successToLoadDisabledCoins!: boolean;
	@State(({ asset }) => asset.loadingEnabledFiats) loadingEnabledFiats!: boolean;
	@State(({ asset }) => asset.loadingDisabledFiats) loadingDisabledFiats!: boolean;
	@State(({ asset }) => asset.loadingEnabledCoins) loadingEnabledCoins!: boolean;
	@State(({ asset }) => asset.loadingDisabledCoins) loadingDisabledCoins!: boolean;
	@State(({ asset }) => asset.assetsMap) assetsMap!: Map<string, IAsset[]>;
	@State(({ asset }) => asset.fiats) fiats!: IAsset[];
	@State(({ asset }) => asset.coins) coins!: IAsset[];
	AssetCategory = AssetCategory;
	asset: IAsset | null = null;
	symbol: string = '';
	searchText: string = '';
	requiredRules = [(v: any) => requiredRule(v)];
	focused: boolean = false;
	shownIndex: number = 0;
	selectionHeight: number = 42;
	searchingKeys: string[] = ['name', 'symbol'];
	MANUAL_ASSET = MANUAL_ASSET;
	accessed: boolean = false;

	@Watch('disabled', { immediate: true, deep: true })
	watchDisabled(newVal: boolean) {
		if (!this.accessed) return;

		if (newVal === true) {
			this.symbol = '';
			this.asset = null;
		} else {
			this.symbol = this.value;
		}
	}

	@Watch('symbol')
	watchSymbol() {
		this.$refs.autoLists && this.$refs.autoLists?.scrollTo(0, 0);
	}

	@Watch('focused')
	watchFocused(newVal: boolean) {
		if (newVal === false) {
			this.closeAssetsList();
		}
	}

	@Watch('loadingAssets')
	watchLoading(newVal: boolean) {
		if (newVal === false && !this.asset) {
			this.onChangeSymbol(this.value);
		}
	}

	get basicAssets(): any[] {
		return [{ header: 'Fiat' }, ...this.fiats, { divider: true }, { header: 'Crypto' }, ...this.coins];
	}

	get errorStatus(): boolean {
		return !this.loadingAssets && !this.successToLoad;
	}

	get finalLabel(): string {
		return this.errorStatus ? 'Err: Refresh this page' : this.label || '';
	}

	get loadingAssets(): boolean {
		return (
			this.loadingEnabledFiats || this.loadingDisabledFiats || this.loadingEnabledCoins || this.loadingDisabledCoins
		);
	}

	get successToLoad(): boolean {
		return (
			this.successToLoadEnabledFiats &&
			this.successToLoadDisabledFiats &&
			this.successToLoadEnabledCoins &&
			this.successToLoadDisabledCoins
		);
	}

	get targetAssets(): any[] {
		return this.onlyCoins ? this.enabledCoins : this.basicAssets;
	}

	get filteredAssets(): any[] {
		const trimedSymbol = this.symbol?.trim() || '';

		if (trimedSymbol) {
			const found = this.assetsMap.get(trimedSymbol.toLowerCase());
			const searched = this.targetAssets.filter(
				asset => asset.header || asset.divider || asset.searchText.includes(this.symbol.toLowerCase()),
			);
			if (found) {
				return searched;
			} else {
				const injected = {
					id: 0,
					iconImage: '',
					name: trimedSymbol,
					symbol: trimedSymbol,
					lowerSymbol: trimedSymbol,
					searchText: trimedSymbol,
					category: AssetCategory.MANUAL,
				};
				return [{ header: 'Manual' }, { divider: true }, injected, ...searched];
			}
		} else {
			return this.targetAssets;
		}
	}

	get selectedIcon(): string {
		return this.asset && this.asset.iconImage ? getIconImage(this.asset.iconImage, 16) : '';
	}

	onClickOutside() {
		if (this.value !== this.symbol) {
			this.onChangeSymbol(this.value);
		}
		this.closeAssetsList();
	}

	iconImage(iconImage: string) {
		return getIconImage(iconImage, 16);
	}

	onFocus() {
		this.focused = true;
	}

	onEnter() {
		if (this.symbol && this.symbol.trim()) {
			const realAssets = this.filteredAssets.filter(v => v.symbol);
			if (realAssets.length > 0) {
				const exact: IAsset | undefined = realAssets.find(v => v.lowerSymbol === this.symbol.trim().toLowerCase());
				this.onChangeAsset(exact || realAssets[0]);
			} else {
				this.onChangeSymbol(this.symbol.trim());
			}
		} else {
			this.onChangeSymbol(this.value);
		}
		this.closeAssetsList();
	}

	closeAssetsList() {
		this.focused = false;
		this.$refs.searchField && this.$refs.searchField.blur();
	}

	onScrollList() {
		const scroll: number = this.$refs?.autoLists?.scrollTop || 0;
		this.shownIndex = Math.ceil(scroll / this.selectionHeight);
	}

	onChangeSymbol(newSymbol: string) {
		this.symbol = newSymbol || '';
		if (this.symbol) {
			const found = this.assetsMap.get(this.symbol.toLowerCase());
			if (found) {
				this.asset = found[0];
			}
			this.$emit('onchange', this.symbol);
		} else {
			this.asset = null;
		}
	}

	onChangeAsset(newAsset: IAsset | null, close: boolean = false) {
		this.symbol = newAsset?.symbol || '';
		this.asset = newAsset;
		this.$emit('onchange', newAsset?.symbol);
		if (close) {
			this.closeAssetsList();
		}
	}

	created() {
		this.onChangeSymbol(this.value);
		this.accessed = true;
	}
}
</script>

<style lang="scss" scoped>
.assetAvatar {
	width: 20px;
	height: 20px;

	> img {
		width: 100%;
	}
}

[autocomplete] {
	position: relative;

	.auto-lists {
		max-height: 200px;
		overflow-y: scroll;
		background: white;
		position: absolute;
		z-index: 2;
		width: 180%;
		max-width: 300px;
		text-align: left;

		.auto-list-head {
			color: $disabled;
			font-family: $poppins;
			padding: 4px;
			padding-left: 8px;
		}
	}
}
</style>
