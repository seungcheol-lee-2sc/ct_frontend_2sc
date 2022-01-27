<template>
	<div>
		<div class="tableGrid tableGridWrapper">
			<span :draggable="false" class="assetIconWrapper unselectable" @click="onClickFilter(EAssetDataSortTarget.ASSET)">
				Asset
				<v-icon small>
					{{
						target === EAssetDataSortTarget.ASSET && order === ESortOrder.DESC
							? 'mdi-menu-down'
							: target === EAssetDataSortTarget.ASSET && order === ESortOrder.ASC
							? 'mdi-menu-up'
							: 'mdi-menu-down'
					}}
				</v-icon>
			</span>
			<span class="tableGridQuantity">Quantity</span>
			<span class="tableGridCostBasis">Cost basis</span>
			<span class="marketValueIcon unselectable" @click="onClickFilter(EAssetDataSortTarget.MARKET_VALUE)">
				Market value
				<v-icon small>
					{{
						target === EAssetDataSortTarget.MARKET_VALUE && order === ESortOrder.DESC
							? 'mdi-menu-down'
							: target === EAssetDataSortTarget.MARKET_VALUE && order === ESortOrder.ASC
							? 'mdi-menu-up'
							: 'mdi-menu-down'
					}}
				</v-icon>
			</span>
			<span class="valueChange"> 24h value change </span>
			<span class="unrealizedWrapper unselectable" @click="onClickFilter(EAssetDataSortTarget.UNREALIZED_GAIN)">
				Unrealized gain
				<v-icon small>
					{{
						target === EAssetDataSortTarget.UNREALIZED_GAIN && order === ESortOrder.DESC
							? 'mdi-menu-down'
							: target === EAssetDataSortTarget.UNREALIZED_GAIN && order === ESortOrder.ASC
							? 'mdi-menu-up'
							: 'mdi-menu-down'
					}}
				</v-icon>
			</span>
			<span class="roiWrapper">ROI</span>
		</div>

		<v-divider class="assetListDivider"></v-divider>

		<v-card elevation="0" color="white" class="assetList">
			<div :class="unlockOverlay ? 'scrollBox' : 'scrollInvisible'">
				<div v-for="(data, idx) in assetGraphData" :key="`${idx}${data.asset}`">
					<div class="tableGrid mainSideWrapper">
						<div class="mainSubTextWrapper">
							<v-avatar class="marginRight" size="24" color="outline">
								<v-img :src="iconImage(assetStrings(data.asset).iconImage)" />
							</v-avatar>
							<div class="mainSubTextContainer">
								<p class="mainText">{{ data.asset }}</p>
								<p class="subText">{{ assetStrings(data.asset).name }}</p>
							</div>
						</div>
						<div>
							<p class="mainText">{{ addComma(round(data.quantity, 8)) }}</p>
						</div>
						<div>
							<p class="mainText">{{ reformedAmountValue(data.costBasis) }}</p>
							<p class="subText">{{ reformedAmountValue(data.costBasis / data.quantity) }} / unit</p>
						</div>
						<div>
							<p class="mainText">{{ reformedAmountValue(data.marketValue) }}</p>
							<p class="subText">{{ reformedAmountValue(data.spotPrice) }} / unit</p>
						</div>
						<div>
							<v-icon small :color="sideColor(data.change24H)">{{ sideIcon(data.change24H) }}</v-icon>
							<span class="sideText" :class="`text-${sideColor(data.change24H)}`">
								${{ addComma(Math.abs(round(data.change24H))) }}
							</span>
						</div>
						<div>
							<v-icon small :color="sideColor(data.unrealizedGain)">{{ sideIcon(data.unrealizedGain) }}</v-icon>
							<span class="sideText" :class="`text-${sideColor(data.unrealizedGain)}`">
								${{ addComma(Math.abs(round(data.unrealizedGain))) }}
							</span>
						</div>
						<div class="iconSideText">
							<v-icon small :color="sideColor(data.roi)">{{ sideIcon(data.roi) }}</v-icon>
							<span class="sideText" :class="`text-${sideColor(data.roi)}`">
								{{ addComma(Math.abs(round(data.roi))) }}%
							</span>
						</div>
					</div>
				</div>
			</div>
		</v-card>
		<div v-if="!assetGraphLoading && !unlockOverlay && !isBelowTen" class="overlay">
			<div class="moreAsset">
				<img src="/icon/arrow-down-in-circle.png" class="moreAssetImg" @click="scrollClick" />
				<span class="moreAssetText"> There are more assets you can see, click. </span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import { SORTING_ASSETS_DATA } from '~/store/tax';
import { ESortOrder } from '~/types/common/types';
import { IAsset } from '~/types/asset/types';
import { EAssetDataSortTarget, IAssetGraphResponse, ITotalAssetSortDTO } from '~/types/tax/types';
import { getIconImage, reformedAmountValue } from '~/utils/application';
import { roundingNumber } from '~/utils/number';
import { addComma } from '~/utils/string';

interface IAssetString {
	name: string;
	iconImage: string;
}

@Component
export default class PortfolioAssetsList extends Vue {
	EAssetDataSortTarget = EAssetDataSortTarget;
	ESortOrder = ESortOrder;
	isUserScrolling: boolean = false;
	unlockOverlay: boolean = false;
	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ tax }) => tax.assetGraphData) assetGraphData!: IAssetGraphResponse[];
	@State(({ tax }) => tax.assetGraphLoading) assetGraphLoading!: boolean;
	@State(({ tax }) => tax.totalAssetSortOrder) order!: ESortOrder;
	@State(({ tax }) => tax.totalAssetSortTarget) target!: EAssetDataSortTarget;
	@State(({ asset }) => asset.assetsMap) assetsMap!: Map<string, IAsset[]>;

	assetLabels: any[] = [
		{ name: 'Asset', alignRight: false },
		{ name: 'Cost basis', alignRight: true },
		{ name: 'Quantity', alignRight: true },
		{ name: 'Market value', alignRight: true },
		{ name: '24h value change', alignRight: true },
		{ name: 'Unrealized gain', alignRight: true },
		{ name: 'ROI', alignRight: false },
	];

	get isBelowTen() {
		return this.assetGraphData && this.assetGraphData.length < 11;
	}

	reformedAmountValue = reformedAmountValue;
	addComma = addComma;

	assetStrings(symbol: string): IAssetString {
		const obj: IAsset[] | undefined = this.assetsMap.get(symbol.toLowerCase());
		return {
			name: (obj && obj[0]?.name) || '',
			iconImage: (obj && obj[0]?.iconImage) || '',
		};
	}

	iconImage(iconImage: string) {
		return getIconImage(iconImage, 16);
	}

	sideColor(inputNum: number) {
		if (Math.sign(inputNum) > 0 || Math.sign(inputNum) === 0) {
			return 'successDark';
		} else {
			return 'error';
		}
	}

	sideIcon(inputNum: number) {
		if (Math.sign(inputNum) > 0 || Math.sign(inputNum) === 0) {
			return 'mdi-plus';
		} else {
			return 'mdi-minus';
		}
	}

	round(inputNumber: string | number, pow: number = 2) {
		return roundingNumber(inputNumber, pow);
	}

	scrollClick() {
		this.unlockOverlay = true;
	}

	onClickFilter(seletectedTarget: EAssetDataSortTarget) {
		const changedTarget = seletectedTarget;
		let changedOrder = null;
		if (this.target === seletectedTarget) {
			changedOrder = this.order === ESortOrder.DESC ? ESortOrder.ASC : ESortOrder.DESC;
		} else {
			changedOrder = ESortOrder.ASC;
		}

		const sortData: ITotalAssetSortDTO = {
			target: changedTarget,
			order: changedOrder,
		};

		this.$store.commit(`tax/${SORTING_ASSETS_DATA}`, sortData);
	}
}
</script>
<style lang="scss" scoped>
.tableGridWrapper {
	color: $secondary;
}
.tableGrid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 8px;

	.assetIconWrapper {
		font-size: 12px;
		text-align: center;
		cursor: pointer;
	}
	.tableGridQuantity {
		font-size: 12px;
		text-align: right;
	}

	.tableGridCostBasis {
		font-size: 12px;
		text-align: right;
	}
	.marketValueIcon {
		font-size: 12px;
		text-align: right;
		cursor: pointer;
	}
	.valueChange {
		font-size: 12px;
		text-align: right;
	}
	.unrealizedWrapper {
		font-size: 12px;
		text-align: right;
		cursor: pointer;
	}
	.roiWrapper {
		font-size: 12px;
		text-align: center;
	}
	.assetListDivider {
		background-color: $disabled;
		margin-top: 16px;
	}
}
.mainSideWrapper {
	margin-top: 16px;
	text-align: right;

	.mainSubTextWrapper {
		display: flex;
		align-items: center;

		.marginRight {
			margin-right: 8px;
		}
		.mainSubTextContainer {
			text-align: left;
		}
	}
	.iconSideText {
		margin-right: 4px;
	}
}
.moreAsset {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	height: 100%;
	padding-bottom: 24px;

	.moreAssetImg {
		margin-left: auto;
		margin-right: auto;
		cursor: pointer;
	}
	.moreAssetText {
		font-family: $poppins;
		font-weight: 500;
		font-size: 14px;
		color: $secondaryDarkPale;
		margin-top: 16px;
	}
}

.assetList .mainText {
	font-family: $poppins;
	font-size: 14px;
	font-weight: 500;
	color: $secondary;
}
.assetList .sideText {
	font-family: $poppins;
	font-size: 14px;
	font-weight: 500;
}
.assetList .subText {
	font-family: $roboto;
	font-size: 12px;
	font-weight: 400;
	color: $secondaryLight;
}
.overlay {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgb(2, 0, 36);
	background: linear-gradient(187deg, rgba(2, 0, 36, 0) 0%, rgba(9, 9, 121, 0) 19%, rgba(255, 255, 255, 1) 100%);
}
.scrollInvisible {
	position: relative;
	max-height: 600px;
	overflow-y: auto;
	scrollbar-gutter: stable;
}
.scrollInvisible::-webkit-scrollbar {
	width: 5px;
}
.scrollInvisible::-webkit-scrollbar-track {
	background: #fff;
}
.scrollInvisible::-webkit-scrollbar-thumb {
	background: #fff;
}
.scrollBox {
	max-height: 600px;
	overflow-y: auto;
	scrollbar-gutter: stable;
	position: relative;
}
/* scroll */
.scrollBox::-webkit-scrollbar {
	width: 5px;
}

.scrollBox::-webkit-scrollbar-track {
	background: #fff;
	border-radius: 200px;
}

.scrollBox::-webkit-scrollbar-thumb {
	background: #e5e5e5;
	border-radius: 200px;
}

.scrollBox::-webkit-scrollbar-thumb:hover {
	background: #9e9e9e;
}
.unselectable {
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
</style>
