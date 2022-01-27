<template>
	<div class="textWrapper">
		<span class="name">{{ name }}</span>
		<span class="value" :class="isMinus ? '-minus' : ''">
			{{ reformedAmountValue(amount) }}
		</span>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { reformedAmountValue } from '~/utils/application';

@Component
export default class YearSummaryTextLine extends Vue {
	@Prop({ required: true }) name!: string;
	@Prop({ required: true }) amount!: number;
	@Prop() isColored!: boolean;

	get isMinus() {
		return this.amount < 0;
	}

	reformedAmountValue = reformedAmountValue;
}
</script>

<style lang="scss" scoped>
.textWrapper {
	display: flex;
	justify-content: space-between;
	font-size: 14px;
	font-weight: $font-medium;
	font-family: $poppins;
	padding: 8px 0;

	.name {
		color: $primaryLight;
	}

	.value {
		color: $primary;

		&.-minus {
			color: $error;
		}
	}
}
</style>
