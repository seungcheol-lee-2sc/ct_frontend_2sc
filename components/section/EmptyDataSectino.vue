<template>
	<div class="emptySection" :class="noGap ? '-noGap' : ''">
		<img v-if="src" :src="src" />
		<div>
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class EmptyDataSection extends Vue {
	@Prop() src!: string;
	@Prop() noGap!: boolean;
}
</script>

<style lang="scss" scoped>
.emptySection {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 36px;
	width: 100%;
	height: 100%;
	min-height: 400px;
	flex-direction: column;
	> div {
		font-size: 16px;
		letter-spacing: 0.5px;
	}

	&.-noGap {
		gap: 0;

		img {
			margin-bottom: -8px;
		}
	}
}
</style>
