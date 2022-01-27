<template>
	<v-btn
		v-bind="notUsed ? null : attrs"
		rounded
		small
		depressed
		:disabled="disabled ? disabled : false"
		:height="btnHeight"
		class="filterBtn"
		:class="classes"
		v-on="notUsed ? null : on"
	>
		<span class="btnText" :class="disabled ? '-disabled' : ''">
			<span v-if="activate">{{ filteredText }}</span>
			<span v-else>{{ initText }}</span>
		</span>
		<v-icon color="primary" :small="isMobile">mdi-chevron-down</v-icon>
	</v-btn>
</template>

<script lang="ts">
import { Component, Prop, State, Vue } from 'nuxt-property-decorator';
import Button from './Button.vue';
import { firstCharUppercase } from '~/utils/string';

@Component({
	components: {
		Button,
	},
})
export default class FilterAndValueButton extends Vue {
	@Prop({ required: true }) initText!: string;
	@Prop({ required: true }) filteredText!: string;
	@Prop({ required: true }) activate!: boolean;
	@Prop() disabled!: boolean;
	@Prop() attrs!: any;
	@Prop() on!: any;
	@Prop() notUsed!: boolean;

	@State(state => state.isMobile) isMobile!: boolean;

	get classes(): string {
		let result = ' filterBtn ';
		result += this.activate ? ' -border ' : '';
		result += this.notUsed ? ' -not-used ' : '';
		return result;
	}

	get btnHeight(): string {
		return this.isMobile ? '28' : '32';
	}

	firstCharUppercase = (t: string) => firstCharUppercase(t);
}
</script>

<style lang="scss" scoped>
.filterBtn {
	background-color: transparent !important;
	border: 1px solid $outline;
	font-family: $poppins;
	font-size: 10px;
	@media (min-width: #{$breakpoint-xl}) {
		margin-bottom: 0;
		font-size: 14px;
	}

	&.-border {
		background-color: $secondaryPale !important;
		cursor: auto;
	}
	.btnText {
		color: $primary;
		font-weight: $font-normal;

		&.-disabled {
			color: $disabled;
		}
	}
}
</style>
