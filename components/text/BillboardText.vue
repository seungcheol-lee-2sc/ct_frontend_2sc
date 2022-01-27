<template>
	<div style="text-align: left">
		<div class="labelTitle">{{ title }}</div>
		<div class="valueText" :class="bold ? '-bold' : ''">{{ reformedAmountValue(amount, 0) }}</div>
		<div v-if="percent" class="upAndDown">
			<v-icon small style="padding: 0" :color="upDownColor">
				{{ upDownIcon }}
			</v-icon>
			<span :class="`text-${upDownColor}`">{{ round(percent) }}%</span>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { reformedAmountValue } from '~/utils/application';
import { roundingNumber } from '~/utils/number';

@Component
export default class BillBoardText extends Vue {
	@Prop({ type: String, required: true }) title!: string;
	@Prop({ type: Number, required: true }) amount!: number;
	@Prop() icon!: boolean;
	@Prop() percent!: number;
	@Prop() bold!: boolean;

	reformedAmountValue = reformedAmountValue;

	get upDownIcon() {
		return this.icon === true ? 'mdi-arrow-up' : 'mdi-arrow-down';
	}

	get upDownColor() {
		return this.icon === false ? 'error' : 'successDark';
	}

	round(inputNumber: string | number, pow: number = 2) {
		return roundingNumber(inputNumber, pow);
	}
}
</script>

<style lang="scss" scoped>
.upAndDown {
	font-size: 12px;
	color: $primary;
}
.labelTitle {
	font-family: $poppins;
	font-size: 13px;
	color: $primaryLight;
	margin-bottom: 8px;
}
.valueText {
	font-family: $poppins;
	font-size: 33px;
	color: $primary;
	&.-bold {
		font-weight: $font-semibold;
	}
}
</style>
