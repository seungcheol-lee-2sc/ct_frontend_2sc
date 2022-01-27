<template>
	<v-text-field
		v-model="phone"
		v-mask="'####################'"
		:disabled="disabled"
		hide-details="auto"
		outlined
		:background-color="backgroundColor"
		:label="label"
		:rules="phoneRules"
	/>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator';
import { onlyNumberRule } from '~/utils/rules';

@Component
export default class PhoneInput extends Vue {
	@Prop({ required: true }) value!: string;
	@Prop() disabled!: boolean;
	@Prop() backgroundColor!: string;
	@Prop() label!: string;

	phone: string = '';
	phoneRules = [(v: any) => onlyNumberRule(v, this.$nuxt)];

	@Watch('phone')
	watchPhone(newVal: string) {
		if (typeof newVal === 'string') {
			this.onChangePhone(newVal);
		}
	}

	onChangePhone(v: string) {
		this.$emit('change', v);
	}

	created() {
		this.phone = this.value || '';
	}
}
</script>
