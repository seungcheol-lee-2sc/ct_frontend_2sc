<template>
	<div class="passwordMessage" v-html="passwordErrorMessagesWithColor"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

export const pwErrorMessagesWithColor = (rules: any[], msgArr: any[], passwordText: string) => {
	const checkArr = rules.map(v => v(passwordText));
	return checkArr
		.map((v, idx) => {
			let textClass = 'text-disabled';
			if (passwordText && v === true) {
				textClass = 'text-successDark';
			} else if (passwordText && v !== true) {
				textClass = 'text-error';
			}
			let str = v === true ? `<span class="${textClass}">${msgArr[idx]}` : `<span class="${textClass}">${v}`;
			str += idx < rules.length - 1 ? ', </span>' : '</span>';
			return str;
		})
		.filter(v => v)
		.join('');
};

@Component
export default class PasswordMessage extends Vue {
	@Prop({ required: true }) password!: string;
	@Prop({ required: true }) rules!: any[];
	@Prop({ required: true }) ruleMessages!: any[];

	get passwordErrorMessagesWithColor(): string {
		return pwErrorMessagesWithColor(this.rules, this.ruleMessages, this.password || '');
	}
}
</script>

<style lang="scss" scoped>
.passwordMessage {
	font-size: 12px;
	padding: 0 12px;
	margin: 8px 0;
	line-height: 1.2;
	text-align: left;
}
</style>
