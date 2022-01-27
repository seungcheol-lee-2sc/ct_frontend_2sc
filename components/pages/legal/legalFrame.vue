<template>
	<div class="topBodyWrapper">
		<div class="sectionWrapper" style="margin-bottom: 120px">
			<TopSection
				:title="title"
				:desc="
					targetContent && targetContent.updatedAt
						? `Last Updated ${$moment(targetContent.updatedAt).format(DATEFORMAT_CONTENT)}`
						: ''
				"
			/>

			<div v-if="targetContent && targetContent.content">
				<ContentBody :post="targetContent.content" />
			</div>
			<div v-else>No Content</div>
		</div>
		<CountMeInSection />
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, State } from 'nuxt-property-decorator';
import CountMeInSection from '~/components/section/CountMeInSection.vue';
import ContentBody from '~/components/text/ContentBody.vue';
import TopSection from '~/components/section/TopSection.vue';
import { ICommonLegal, ILegal } from '~/types/content/types';
import { DATEFORMAT_CONTENT } from '~/utils/constants';

@Component({
	components: {
		ContentBody,
		CountMeInSection,
		TopSection,
	},
})
export default class LegalFrame extends Vue {
	@Prop({ required: true }) title!: string;
	@Prop({ required: true }) contentKey!: string;

	@State(({ content }) => content.legal) legal!: ILegal | null;

	DATEFORMAT_CONTENT = DATEFORMAT_CONTENT;

	get targetContent(): ICommonLegal | null {
		// @ts-ignore
		return (this.legal && this.legal[`${this.contentKey}`]) || null;
	}
}
</script>
