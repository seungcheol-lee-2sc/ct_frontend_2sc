<template>
	<div class="extraTransactionWrapper">
		<div class="secondLineWrapper">
			<div class="secondLine">
				<span>
					<label> {{ $t('product.fee') }} :</label> {{ feeSummary }}
				</span>
			</div>
			<div class="secondLine">
				<span><label> Tx ID:</label> {{ hashSummary || '-' }}</span>
				<span>
					<label> {{ $t('product.comment') }}:</label> {{ commentItem ? commentItem.comment : '-' }}
				</span>
			</div>
		</div>
		<div class="buttonsWrapper -right">
			<Button :fontsize="14" color="primary" :text="true" @click="$emit('cancel')">
				{{ $t('common.cancel') }}
			</Button>
			<Button :fontsize="14" :rounded="true" color="primary" fontcolor="white" @click="$emit('setUpdate')">
				{{ $t('common.edit') }}
			</Button>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, State } from 'nuxt-property-decorator';
import { AssetCategory, IAsset } from '~/types/asset/types';
import { ITransactionRecord } from '~/types/transaction/types';
import { ITransactionRecordComment } from '~/types/transaction-comment/types';
import { getSingleItem } from '~/utils/func';
import { roundingNumber } from '~/utils/number';
import { addComma } from '~/utils/string';
import Button from '~/components/button/Button.vue';

@Component({
	components: {
		Button,
	},
})
export default class ExtraTransaction extends Vue {
	@Prop({ required: true }) transaction!: ITransactionRecord;

	@State(({ asset }) => asset.assetsMap) assetsMap!: Map<string, IAsset[]>;

	get commentItem(): ITransactionRecordComment | null {
		return getSingleItem(this.transaction.comments);
	}

	get hashSummary(): string {
		let result = '';

		result += this.transaction.outTransactionHash || '';
		result += result !== '' && this.transaction.inTransactionHash ? ' / ' : '';
		result += this.transaction.inTransactionHash || '';
		result += result !== '' && this.transaction.orderId ? ' / ' : '';
		result += this.transaction.orderId || '';

		return result;
	}

	get feeSummary(): string {
		let result = '';

		if (this.transaction.outFeeAsset && this.transaction.outFeeQuantity) {
			const foundAsset = this.assetsMap.get(this.transaction.outFeeAsset?.toLowerCase());
			const pow = foundAsset && foundAsset[0]?.category === AssetCategory.FIAT ? 2 : 8;
			const rounded: number | string = roundingNumber(this.transaction.outFeeQuantity, pow);
			result += `${addComma(rounded)} ${this.transaction.outFeeAsset}`;
		}

		if (this.transaction.inFeeAsset && this.transaction.inFeeQuantity) {
			result += result !== '' ? ' / ' : '';
			const foundAsset = this.assetsMap.get(this.transaction.inFeeAsset?.toLowerCase());
			const pow = foundAsset && foundAsset[0]?.category === AssetCategory.FIAT ? 2 : 8;
			const rounded: number | string = roundingNumber(this.transaction.inFeeQuantity, pow);
			result += `${addComma(rounded)} ${this.transaction.inFeeAsset}`;
		}

		return result || '-';
	}
}
</script>

<style lang="scss" scoped>
.extraTransactionWrapper {
	padding-top: 28px;
	padding-bottom: 16px;

	.secondLineWrapper {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));

		.secondLine {
			grid-column: span 10 / span 10;
			gap: 24px;
			grid-column-start: 2;
			display: flex;
			color: $primaryLight;
			@media (min-width: #{$breakpoint-xl}) {
				gap: 64px;
			}

			label {
				color: $disabled;
			}
		}
	}
}
</style>
