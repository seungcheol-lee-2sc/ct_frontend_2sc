<template>
	<div class="transactionWrapper" :class="addtionalClasses">
		<div v-if="!hideOut" class="transaction -out">
			<div v-if="outAsset" class="dataWrapper">
				<div class="transactionInner">
					<div class="providerIcon">
						<img :src="outIcon" />
					</div>
					<span class="currency">{{ outAsset }}</span>
					<div v-show="finalOut.length < LINE_BREAK">{{ finalOut }}</div>
				</div>
				<div v-show="finalOut.length >= LINE_BREAK" class="quantity">{{ finalOut }}</div>
			</div>
		</div>

		<v-icon v-if="!hideArrow" v-show="outAsset || inAsset">mdi-arrow-right</v-icon>

		<div v-if="!hideIn" class="transaction -in">
			<div v-if="inAsset" class="dataWrapper">
				<div class="transactionInner">
					<div class="providerIcon">
						<img :src="inIcon" />
					</div>
					<span class="currency">{{ inAsset }}</span>
					<div v-show="finalIn.length < LINE_BREAK">{{ finalIn }}</div>
				</div>
				<div v-show="finalIn.length >= LINE_BREAK" class="quantity">{{ finalIn }}</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, State, Vue, Watch } from 'nuxt-property-decorator';
import { AssetCategory, IAsset } from '~/types/asset/types';
import { getIconImage } from '~/utils/application';
import { roundingNumber } from '~/utils/number';
import { addComma } from '~/utils/string';

@Component
export default class TransactionItem extends Vue {
	@Prop({ required: true }) inNumber!: string | null;
	@Prop({ required: true }) inAsset!: string | null;
	@Prop({ required: true }) outNumber!: string | null;
	@Prop({ required: true }) outAsset!: string | null;
	@Prop() hideIn!: boolean;
	@Prop() hideOut!: boolean;
	@Prop() hideArrow!: boolean;
	@Prop() reverse!: boolean;
	@Prop() flex!: boolean;

	LINE_BREAK = 14;

	@State(({ asset }) => asset.loadingEnabledFiats) loadingEnabledFiats!: boolean;
	@State(({ asset }) => asset.loadingDisabledFiats) loadingDisabledFiats!: boolean;
	@State(({ asset }) => asset.loadingEnabledCoins) loadingEnabledCoins!: boolean;
	@State(({ asset }) => asset.loadingDisabledCoins) loadingDisabledCoins!: boolean;
	@State(({ asset }) => asset.assetsMap) assetsMap!: Map<string, IAsset[]>;

	inIcon: string = '';
	outIcon: string = '';

	@Watch('loadingAssets')
	watchLoading(newVal: boolean) {
		if (newVal === false) {
			this.generateInIcon();
			this.generateOutIcon();
		}
	}

	get loadingAssets(): boolean {
		return (
			this.loadingEnabledFiats || this.loadingDisabledFiats || this.loadingEnabledCoins || this.loadingDisabledCoins
		);
	}

	get addtionalClasses(): string {
		return `${this.flex ? ' -flex ' : ''} ${this.reverse ? ' -reverse ' : ''}`;
	}

	get finalOut(): string {
		return (this.outNumber && this.outAsset && this.reform(this.outNumber, this.outAsset)) || '';
	}

	get finalIn(): string {
		return (this.inNumber && this.inAsset && this.reform(this.inNumber, this.inAsset)) || '';
	}

	generateInIcon() {
		if (!this.inAsset || this.inIcon) return;
		return new Promise(resolve => {
			const found = this.inAsset && this.assetsMap.get(this.inAsset.toLowerCase());
			this.inIcon = found && found[0] ? getIconImage(found[0].iconImage || '', 16) : '';
			resolve(true);
		});
	}

	generateOutIcon() {
		if (!this.outAsset || this.outIcon) return;
		return new Promise(resolve => {
			const found = this.outAsset && this.assetsMap.get(this.outAsset.toLowerCase());
			this.outIcon = found && found[0] ? getIconImage(found[0].iconImage || '', 16) : '';
			resolve(true);
		});
	}

	reform(inputNumber: string | number, symbol: string | null): string {
		if (!symbol) return '';
		if (typeof inputNumber === 'number' && inputNumber === 0) return '0';

		const foundAsset = this.assetsMap.get(symbol);
		const pow = foundAsset && foundAsset[0]?.category === AssetCategory.FIAT ? 2 : 8;
		const rounded = roundingNumber(inputNumber, pow);
		return rounded !== 0 ? addComma(rounded) : '0';
	}

	created() {
		this.generateInIcon();
		this.generateOutIcon();
	}
}
</script>

<style lang="scss" scoped>
.transactionWrapper {
	display: grid;
	align-items: center;
	grid-template-columns: repeat(11, minmax(0, 1fr));
	gap: 8px;

	&.-flex {
		display: flex;
		justify-content: center;
	}

	&.-reverse {
		direction: rtl;
	}

	.providerIcon {
		display: flex;
		width: 16px;
		min-width: 16px;
		// height: 16px;
		overflow: hidden;
		img {
			border-radius: $round-full;
			width: 100%;
		}
	}
	.currency {
		font-weight: $font-bold;
	}

	.transaction {
		display: flex;
		grid-column: span 5 / span 5;
		justify-content: flex-start;
		.dataWrapper {
			width: 100%;
			text-align: left;
			.transactionInner {
				display: flex;
				gap: 8px;
				align-items: center;
			}

			.quantity {
				display: flex;
				justify-content: flex-start;
			}
		}

		&.-out {
			.dataWrapper {
				.transactionInner {
					flex-direction: row-reverse;
				}

				.quantity {
					justify-content: flex-end;
				}
			}
		}
	}
}
</style>
