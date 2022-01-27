<template>
	<v-autocomplete
		ref="platformAutocomplete"
		v-model="selectedPlatform"
		:items="reformedPlatforms"
		return-object
		item-text="name"
		outlined
		:label="hideLabel ? '' : $t('product.platform')"
		hide-details="auto"
		:rules="rules"
		:disabled="disabled"
		@change="onChangePlatform"
	>
		<template #selection="{ item }">
			<v-avatar v-if="item.img" class="platformAvatar" size="24">
				<v-img :src="iconImage(item.img)" />
			</v-avatar>
			{{ item.name }}
		</template>
		<template #item="{ item }">
			<v-avatar v-if="item.img" class="platformAvatar" size="24">
				<v-img :src="iconImage(item.img)" />
			</v-avatar>
			{{ item.name }}
		</template>
	</v-autocomplete>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, State } from 'nuxt-property-decorator';
import { IPlatform } from '~/types/provider/types';
import { getIconImage } from '~/utils/application';

@Component
export default class PlatformSelector extends Vue {
	$refs!: {
		platformAutocomplete: any;
	};

	@Prop({ required: true }) rules!: any[];
	@Prop({ required: true }) value!: IPlatform | null;
	@Prop() hideLabel!: boolean;
	@Prop() exchangeOnly!: boolean;
	@Prop() disabled!: boolean;

	selectedPlatform: IPlatform | null = null;
	@State(({ provider }) => provider.platforms) platforms!: IPlatform[];

	get reformedPlatforms(): IPlatform[] {
		return _.cloneDeep(this.platforms)
			.filter(v => {
				return this.exchangeOnly ? v.provider?.id : true;
			})
			.sort((a, b) => ((a?.name || '') > (b.name || '') ? 1 : -1));
	}

	iconImage(iconImage: string) {
		return getIconImage(iconImage, 16);
	}

	onChangePlatform() {
		this.$refs.platformAutocomplete.blur();
		this.$emit('onchange', this.selectedPlatform);
	}

	created() {
		this.selectedPlatform = this.value;
	}
}
</script>

<style lang="scss" scoped>
.platformAvatar {
	margin-right: 8px;
}
</style>
