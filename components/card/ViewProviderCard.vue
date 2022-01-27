<template>
	<v-hover v-slot="{ hover }">
		<div class="iconWrapper" :class="hover ? 'bg-primary' : ''" @click="onClickProvider(provider)">
			<v-img
				v-if="!hover"
				class="providerIcon"
				:src="iconImage(provider.iconImage)"
				:alt="`${provider.name} logo for exchange search`"
				:max-width="40"
			/>
			<span v-if="!hover" class="providerName">
				{{ provider.name }}
			</span>
			<span v-else class="hoverText">
				{{ importMessage }}
			</span>
		</div>
	</v-hover>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { ITransactionRecordProvider } from '~/types/provider/types';
import { isThisAsset } from '~/utils/provider';
import { getIconImage } from '~/utils/application';
import { IAsset } from '~/types/asset/types';

@Component
export default class ViewProviderCard extends Vue {
	@Prop({ required: true }) provider!: ITransactionRecordProvider | IAsset;

	get importMessage(): string {
		if (isThisAsset(this.provider)) {
			return 'Import via Public Address';
		}

		const result: string[] = [];
		const target: ITransactionRecordProvider = this.provider;

		if (target?.isCSVImportEnabled) {
			result.push('CSV');
		}

		if (target.isLoginImportEnabled) {
			result.push('Login');
		} else if (target.isAPIImportEnabled) {
			result.push('API');
		}

		return result ? `Import via ${result.join(' or ')}` : '';
	}

	onClickProvider(provider: ITransactionRecordProvider | IAsset) {
		this.$router.push(`/exchanges/${provider.slug}`);
	}

	iconImage(iconImage: string) {
		return getIconImage(iconImage, 32);
	}
}
</script>

<style lang="scss" scoped>
.iconWrapper {
	border: 1px solid $outline;
	cursor: pointer;
	border-radius: $round-xs;
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	align-items: center;
	gap: 8px;
	padding: 12px;
	height: 88px;
	@media (min-width: #{$breakpoint-xl}) {
		padding: 20px;
		height: 100px;
	}
}
.providerIcon {
	grid-column: span 1 / span 1;
	border-radius: $round-sm;
	@media (min-width: #{$breakpoint-xl}) {
		width: 40px;
	}
}
.providerName {
	overflow-wrap: break-word;
	font-weight: $font-medium;
	font-family: $poppins;
	grid-column: span 3 / span 3;

	@media (min-width: #{$breakpoint-xl}) {
		font-size: 19px;
	}
}
.hoverText {
	font-family: $poppins;
	font-size: 15px;
	font-weight: $font-medium;
	text-align: center;
	grid-column: span 4 / span 4;
	color: $white;
	@media (min-width: #{$breakpoint-xl}) {
		font-size: 19px;
	}
}
</style>
