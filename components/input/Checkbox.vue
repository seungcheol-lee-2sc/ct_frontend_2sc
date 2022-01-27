<template>
	<span class="chkItem">
		<input id="chk" type="checkbox" :checked="value" readonly />
		<label for="chk" :class="classes" @click="onClickChk">
			<span class="mark"></span>
		</label>
	</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class Checkbox extends Vue {
	@Prop({ required: true }) value!: boolean;
	@Prop() disabled!: boolean;
	@Prop() color!: string;

	get classes(): string {
		if (this.value) {
			if (this.disabled) {
				return `-disabled -checked bg-outline border-outline`;
			} else {
				const color = this.color || 'primaryLight';
				return `-checked bg-${color} border-${color}`;
			}
		} else if (this.disabled) {
			return '-disabled border-outline bg-outline';
		} else {
			return 'border-disabled';
		}
	}

	onClickChk() {
		!this.disabled && this.$emit('click');
	}
}
</script>

<style lang="scss" scoped>
.chkItem {
	display: flex;
	user-select: none;
	padding: 2px;

	input[type='checkbox'] {
		display: none;
	}

	label {
		cursor: pointer;
		display: inline-block;
		width: 20px;
		height: 20px;
		border-radius: $round-xs;
		position: relative;
		overflow: hidden;
		border-width: 2px;
		border-style: solid;
		border-color: transparent;

		.mark {
			display: none;
		}

		&.-checked {
			.mark {
				display: block;
				position: absolute;
				width: 50%;
				height: 80%;
				left: 0;
				top: 0;
				border-right: 3px solid white;
				border-bottom: 3px solid white;
				transform: rotate(45deg) translate(30%, -30%);
			}
		}

		&.-disabled {
			cursor: not-allowed;
		}
	}
}
</style>
