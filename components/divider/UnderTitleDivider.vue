<template>
	<div>
		<span class="dividerText">{{ text }}</span>
		<v-divider class="dividerItem" :class="bottomZero ? '' : '-add-bottom'"></v-divider>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class UnderTitleDivider extends Vue {
	@Prop({ required: true }) text!: string;
	@Prop() bottomZero!: boolean;
}
</script>

<style lang="scss" scoped>
.dividerText {
	font-size: 15px;
	font-family: $poppins;
	color: $secondaryLight;
}

.dividerItem {
	margin-top: 12px;
	&.-add-bottom {
		margin-bottom: 20px;
	}
}
</style>
