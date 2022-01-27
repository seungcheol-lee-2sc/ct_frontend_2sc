<template>
	<v-card color="offWhite" class="signUpSelectorWrapper" :class="selected ? 'selected' : ''" elevation="0">
		<template v-if="type === 1">
			<MovingObject :size="EMovingObjSize.M" color="tertiary" left="90px" top="80px" :movement="EMoveType.BEAT" />
			<MovingObject
				:size="EMovingObjSize.S"
				color="secondaryLight"
				left="calc(50% + 65px)"
				top="calc(50% + 50px)"
				:movement="EMoveType.BEAT"
			/>
		</template>
		<template v-else-if="type === 2">
			<MovingObject
				:size="EMovingObjSize.M"
				color="purpleLight"
				left="calc(50% + 100px)"
				top="110px"
				:movement="EMoveType.BEAT"
			/>
			<MovingObject
				:size="EMovingObjSize.S"
				color="orangeLight"
				left="110px"
				top="calc(50% + 80px)"
				:movement="EMoveType.BEAT"
			/>
		</template>
		<div class="titleText">
			{{ title }}
		</div>

		<div class="information" v-html="nl2br(desc)" />

		<div v-if="addtional" class="addtionalInfo">
			{{ addtional }}
		</div>

		<div>
			<Button
				:rounded="true"
				:block="true"
				:disabled="disabled"
				:loading="loading"
				:height="52"
				:color="btnColor || 'primary'"
				fontcolor="white"
				@click="$emit('click')"
			>
				{{ btnDesc }}
			</Button>
		</div>
	</v-card>
</template>

<script lang="ts">
import { Component, Prop, State, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import { nl2br } from '~/utils/string';
import MovingObject, { EMoveType, EMovingObjSize } from '~/components/item/MovingObject.vue';

@Component({
	components: {
		MovingObject,
		Button,
	},
})
export default class SignUpTypeSelector extends Vue {
	@Prop({ required: true }) type!: number;
	@Prop({ required: true }) title!: string;
	@Prop({ required: true }) desc!: string;
	@Prop() addtional!: string;
	@Prop({ required: true }) btnDesc!: string;
	@Prop() loading!: boolean;
	@Prop() disabled!: boolean;
	@Prop() selected!: boolean;
	@Prop() btnColor!: string;

	@State(state => state.isMobile) isMobile!: boolean;

	EMoveType = EMoveType;
	EMovingObjSize = EMovingObjSize;

	nl2br(str: string) {
		return nl2br(str);
	}
}
</script>

<style lang="scss" scoped>
.signUpSelectorWrapper {
	padding: 24px 16px;
	text-align: center;
	@media (min-width: #{$breakpoint-xl}) {
		padding: 24px 28px;
	}
	font-family: $poppins;

	&.selected {
		border: 1px solid $primary !important;
	}

	.titleText {
		margin-top: 124px;
		font-size: 23px;
	}

	.information {
		font-size: 14px;
		margin-top: 10px;
		margin-bottom: 100px;
		color: $disabled;
		font-weight: $font-medium;
		letter-spacing: 0.15px;
		line-height: 1.7;
	}
	.addtionalInfo {
		font-weight: $font-semibold;
		font-size: 12px;

		position: absolute;
		display: flex;
		width: 100%;
		left: 0;
		justify-content: center;
		bottom: 140px;
	}
}
</style>
