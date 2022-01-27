<template>
	<div>
		<div class="downloadListWrapper">
			<div class="downloadListText">
				<v-icon large color="black" style="margin-right: 16px">{{ icon }}</v-icon>
				<div>
					<div class="titleText">{{ title }}</div>
					<div v-if="subtitle" class="subtitleText">{{ subtitle }}</div>
				</div>
			</div>
			<Button
				color="secondary"
				:fontsize="14"
				:height="48"
				:width="122"
				fontcolor="white"
				:rounded="true"
				:disabled="disabled"
				class="downloadListButton"
				@click="$emit('click')"
			>
				Download
			</Button>
		</div>
		<v-divider class="downloadListDivider" :class="hideLine ? '-hidden' : ''"></v-divider>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import Button from '@/components/button/Button.vue';
import { EReportType } from '~/types/tax/types';

@Component({
	components: { Button },
})
export default class DownloadList extends Vue {
	@Prop({ required: true }) title!: string;
	@Prop({ required: true }) icon!: string;
	@Prop({ required: true }) docType!: EReportType;
	@Prop() subtitle!: string;
	@Prop() btnColor!: string;
	@Prop() hideLine!: boolean;
	@Prop() disabled!: boolean;
}
</script>

<style lang="scss" scoped>
.downloadListWrapper {
	padding: 4px 0;
	@media (min-width: #{$breakpoint-xl}) {
		display: flex;
		justify-content: space-between;
	}
	.downloadListText {
		display: flex;
		align-items: center;

		.titleText {
			font-size: 16px;
			line-height: 20px;
		}
		.subtitleText {
			font-size: 14px;
		}
	}

	.downloadListButton {
		width: 25%;
	}
}
.downloadListDivider {
	margin-top: 8px;
	margin-bottom: 8px;

	&.-hidden {
		display: none;
	}
}
</style>
