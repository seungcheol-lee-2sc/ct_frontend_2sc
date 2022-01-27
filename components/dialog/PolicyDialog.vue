<template>
	<v-dialog v-model="dialog" persistent max-width="800" scrollable @keydown.esc="close" @click:outside="close">
		<v-card class="dialogCardWrapper policyDialog" height="100%">
			<div class="titleText">{{ getTitle }}</div>
			<div style="backgroudn-color: white">
				<ContentBody v-if="targetContent" :post="targetContent.content" />
			</div>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, State } from 'nuxt-property-decorator';
import ContentBody from '../text/ContentBody.vue';
import { ICommonLegal, ILegal } from '~/types/content/types';

export enum EPolicyType {
	tos = 'Terms of service',
	privacy = 'Privacy policy',
	security = 'Security',
	disclaimer = 'Disclaimer',
}

@Component({
	components: {
		ContentBody,
	},
})
export default class PolicyDialog extends Vue {
	@Prop({ required: true }) dialog!: boolean;
	@Prop({ required: true }) policyType!: EPolicyType;

	@State(({ content }) => content.legal) legal!: ILegal | null;

	get getTitle(): string {
		if (this.policyType === EPolicyType.tos) {
			return 'Terms of Service';
		} else if (this.policyType === EPolicyType.privacy) {
			return 'Privacy Policy';
		} else if (this.policyType === EPolicyType.security) {
			return 'Security';
		} else if (this.policyType === EPolicyType.disclaimer) {
			return 'Disclaimer';
		} else {
			return '';
		}
	}

	get targetContent(): ICommonLegal | null {
		if (this.policyType === EPolicyType.tos) {
			return this.tos;
		} else if (this.policyType === EPolicyType.privacy) {
			return this.privacy;
		} else if (this.policyType === EPolicyType.security) {
			return this.security;
		} else if (this.policyType === EPolicyType.disclaimer) {
			return this.disclaimer;
		} else {
			return null;
		}
	}

	get tos(): ICommonLegal | null {
		return this.legal?.tos || null;
	}

	get privacy(): ICommonLegal | null {
		return this.legal?.privacy || null;
	}

	get security(): ICommonLegal | null {
		return this.legal?.security || null;
	}

	get disclaimer(): ICommonLegal | null {
		return this.legal?.disclaimer || null;
	}

	close() {
		this.$emit('close');
	}
}
</script>

<style lang="scss" scoped>
.policyDialog {
	.titleText {
		// text-transform: capitalize;
		font-size: 24px;
		text-align: center;
		margin-bottom: 24px;
		font-family: $poppins;
		font-weight: $font-medium;
	}
}
</style>
