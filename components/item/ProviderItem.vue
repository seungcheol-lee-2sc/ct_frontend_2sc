<template>
	<div v-if="provider" class="singleProvider" :class="addtionalClasses" @click.stop="$emit('click', provider)">
		<div class="providerIcon">
			<img :src="iconImage(provider.iconImage) || ''" />
		</div>
		<div class="textWrapper">
			<div>
				<div class="providerName">
					{{ provider.name }}
				</div>
			</div>
			<Chip v-if="provider && provider.added" icon="mdi-check" color="successLight" fontcolor="successDark">
				Added
			</Chip>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import Chip from '../chip/Chip.vue';
import { ITransactionRecordProvider } from '~/types/provider/types';
import { isThisAsset } from '~/utils/provider';
import { getIconImage } from '~/utils/application';
import { IAsset } from '~/types/asset/types';

@Component({
	components: {
		Chip,
	},
})
export default class ProviderItem extends Vue {
	@Prop({ required: true }) provider!: ITransactionRecordProvider | IAsset;
	@Prop() topPos!: boolean;
	@Prop() lastPos!: boolean;
	@Prop() rightPos!: boolean;

	get providerType(): string {
		// @ts-ignore
		return isThisAsset(this.provider) ? 'BLOCKCHAIN' : this.provider.type;
	}

	get addtionalClasses(): string {
		let result = '';
		result += this.topPos ? '-top ' : '';
		result += this.lastPos ? '-right ' : '';
		result += this.rightPos ? '-right ' : '';
		return result;
	}

	iconImage(iconImage: string): string {
		return getIconImage(iconImage, 64);
	}
}
</script>

<style lang="scss" scoped>
.singleProvider {
	transition: all 0.2s ease-in-out;
	cursor: pointer;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding-left: 24px;
	padding-right: 24px;
	height: 80px;
	border-color: $outline;
	border-style: solid;

	border-width: 0 1px 1px 1px;
	@media (min-width: #{$breakpoint-xl}) {
		border-width: 0 0 1px 1px;
	}
	&.-top {
		border-top-width: 1px;
	}
	&.-right {
		@media (min-width: #{$breakpoint-xl}) {
			border-right-width: 1px !important;
		}
	}
	&:hover {
		background-color: $offWhite;
	}

	.providerIcon {
		margin-right: 16px;
		overflow: hidden;
		max-width: 40px;
		display: flex;
		align-items: center;

		> img {
			border-radius: $round-sm;
			width: 100%;
		}
	}

	.textWrapper {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;

		.providerName {
			font-size: 16px;
			font-weight: $font-medium;
			font-family: $poppins;
			letter-spacing: 0.15;
		}
	}
}
</style>
