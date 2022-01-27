<template>
	<div>
		<v-alert text :color="customBgColor || color" :style="customStyle">
			<div class="alertContent" :class="dense ? '-dense' : ''">
				<div v-if="icon" style="max-width: 24px">
					<v-icon size="24" :color="customColor || color">{{ icon }}</v-icon>
				</div>

				<div class="alertText" :class="customColor ? `text-${customColor}` : ''" v-html="reformedMsg"></div>
			</div>
		</v-alert>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { filteringHTML, nl2br } from '~/utils/string';

@Component
export default class AlertCard extends Vue {
	@Prop({ required: true }) msg!: string;
	@Prop({ required: true }) color!: string;
	@Prop() icon!: string;
	@Prop() customColor!: string;
	@Prop() customBgColor!: string;
	@Prop() noMargin!: boolean;
	@Prop() dense!: boolean;

	get reformedMsg(): string {
		return filteringHTML(nl2br(this.msg || ''));
	}

	get customStyle(): any {
		const result: any = {};
		if (this.noMargin) {
			result.margin = 0;
		}
		if (this.dense) {
			result.padding = '8px';
		}
		return result;
	}
}
</script>

<style lang="scss" scoped>
.alertContent {
	display: flex;
	align-items: flex-start;
	gap: 12px;

	&.-dense {
		gap: 8px;
	}

	.alertText {
		font-size: 13px;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 16px;
		}
		line-height: 1.5;
	}
}
</style>
