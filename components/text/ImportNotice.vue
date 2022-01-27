<template>
	<div class="smallNotice">
		<v-icon v-if="icon" size="20" color="disabled">{{ icon }}</v-icon>
		<div>
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class ImportNotice extends Vue {
	@Prop() icon!: string;
}
</script>

<style lang="scss" scoped>
.smallNotice {
	font-family: $roboto;
	// max-width: 420px;
	margin: 0 auto;
	text-align: center;
	font-size: 12px;
	color: $disabled;
	letter-spacing: 0.4px;
	display: flex;
	align-items: flex-start;
	text-align: left;
	gap: 4px;
	padding: 0 4px;
}
</style>
