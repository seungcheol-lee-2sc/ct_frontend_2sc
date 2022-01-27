<template>
	<span class="platformItemWrapper">
		<v-avatar v-if="iconImage" style="margin-rigth: 8px" size="24">
			<v-img :src="iconImage" />
		</v-avatar>
		<span>
			{{ platform.name }}
		</span>
	</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { IPlatform } from '~/types/provider/types';
import { getIconImage } from '~/utils/application';

@Component
export default class PlatformItem extends Vue {
	@Prop({ required: true }) platform!: IPlatform;

	get iconImage(): string {
		return this.platform?.img ? getIconImage(this.platform?.img, 16) || '' : '';
	}
}
</script>

<style lang="scss" scoped>
.platformItemWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 16px;
	color: $primary;
	font-weight: $font-medium;
	font-size: 16px;
	letter-spacing: 0.15px;
	font-family: $poppins;
}
</style>
