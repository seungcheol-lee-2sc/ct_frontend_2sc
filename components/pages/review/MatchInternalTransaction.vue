<template>
	<div class="transactionWrapper">
		<div class="timestamp">
			<div class="date">{{ reformatDate[0] }}</div>
			<div class="time">{{ reformatDate[1] }}</div>
		</div>
		<div class="transaction">
			<span>
				<v-img width="32" :src="symbolIconImage(symbol)"></v-img>
			</span>
			<span>
				<div class="qty">{{ quantity }} {{ symbol }}</div>
				<div class="source">
					{{ sourceName }}
				</div>
			</span>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, State } from 'nuxt-property-decorator';
import { IAsset } from '~/types/asset/types';
import { getIconImage } from '~/utils/application';
import { DATETIME_FORMAT_PRODUCT } from '~/utils/constants';

@Component
export default class MatchInternalTransaction extends Vue {
	@Prop({ required: true }) symbol!: string;
	@Prop({ required: true }) quantity!: string;
	@Prop({ required: true }) sourceName!: string;
	@Prop({ required: true }) timestamp!: string;

	@State(({ asset }) => asset.assetsMap) assetsMap!: Map<string, IAsset[]>;

	get reformatDate(): string[] {
		return this.timestamp ? this.$moment(this.timestamp).utc().format(DATETIME_FORMAT_PRODUCT).split(' ') : ['', ''];
	}

	symbolIconImage(symbol: string) {
		const found = this.assetsMap.get(symbol.toLowerCase());
		return found ? getIconImage(found[0]?.iconImage || '', 32) : '';
	}
}
</script>

<style lang="scss" scoped>
.transactionWrapper {
	display: flex;
	align-items: center;
	justify-content: space-around;

	.timestamp {
		.date {
			color: $primary;
			font-size: 16px;
		}
		.time {
			color: $primaryLight;
			font-size: 14px;
		}
	}

	.transaction {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		text-align: left;

		> span {
			letter-spacing: 0.15px;
			.qty {
				font-size: 16px;
				line-height: 1.4;
				color: $primaryLight;
			}

			.source {
				font-size: 14px;
				color: $disabled;
			}
		}
	}
}
</style>
