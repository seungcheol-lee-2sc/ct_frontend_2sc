<template>
	<div asset-item :style="{ height: `${height}px` }" @click.stop="$emit('click')">
		<div v-if="asset.symbol !== MANUAL_ASSET" class="assetAvatar">
			<img :src="icon" />
		</div>
		<div class="assetInfo">
			<div class="assetName">
				<template v-if="!hideName">
					{{ asset.name }}
				</template>
				<span :class="hideName ? '-solo' : ''">
					{{ asset.symbol }}
				</span>
			</div>
			<small v-if="asset.category && !hideType" class="text-disabled">
				{{ assetType }}
			</small>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { MANUAL_ASSET } from './AssetSelector.vue';
import { AssetCategory, IAsset } from '~/types/asset/types';
import { getIconImage } from '~/utils/application';

@Component
export default class AssetSelection extends Vue {
	@Prop({ required: true }) asset!: IAsset;
	@Prop({ required: true }) height!: number;
	@Prop() hideType!: boolean;
	@Prop() hideName!: boolean;

	MANUAL_ASSET = MANUAL_ASSET;

	iconImage(iconImage: string) {
		return getIconImage(iconImage, 16);
	}

	get icon(): string {
		return this.asset.iconImage ? getIconImage(this.asset.iconImage, 16) : '';
	}

	get assetType(): string {
		if (this.asset.category === AssetCategory.MANUAL) {
			return 'Manual';
		} else if (this.asset.category === AssetCategory.FIAT) {
			return 'Fiat';
		} else {
			return 'Crypto';
		}
	}
}
</script>

<style lang="scss" scoped>
[asset-item] {
	padding: 4px 8px;
	display: flex;
	align-items: center;
	gap: 12px;
	cursor: pointer;

	&:focus,
	&:hover {
		background-color: $offWhite;
	}

	.assetAvatar {
		width: 20px;
		height: 20px;

		> img {
			width: 100%;
		}
	}

	.assetInfo {
		line-height: 1.2;
		color: $primaryLight;

		.assetName {
			> span {
				color: $secondaryLight;
				font-size: 14px;
				font-weight: $font-bold;
				&.-solo {
					color: $primaryLight;
				}
			}
		}
	}
}
</style>
