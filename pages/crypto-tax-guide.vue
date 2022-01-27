<template>
	<div class>
		<div v-if="taxGuide" class="" style="margin-bottom: 100px">
			<div class="topsectionWrapper">
				<TopSection
					style="max-width: 780px"
					title-color="text-primary"
					desc-color="text-primaryLight"
					:title="taxGuide.title"
					:desc="taxGuide.description"
				/>

				<img class="greenCoin hide-mb" src="/illust/greenCoin.png" alt="green coin" />
				<img class="mobileGreenCoin hide-pc" src="/illust/mobileGreenCoin.png" alt="green coin" />
				<img class="taxPapper" src="/illust/taxPaper.png" alt="tax paper" />
				<img class="redCoin hide-mb" src="/illust/redCoin.png" alt="red coin" />
				<img class="mobileRedCoin hide-pc" src="/illust/mobileRedCoin.png" alt="red coin" />
			</div>

			<div class="totalWrapper sectionWrapper">
				<div class="contentsWrapper">
					<!-- Contents loop -->
					<section v-for="taxGuideContent in taxGuide.contents" :key="taxGuideContent.id">
						<ContentBody :post="taxGuideContent.content" />

						<template v-if="taxGuideContent.tax_subjects && taxGuideContent.tax_subjects.length > 0">
							<h3 v-if="taxGuideContent.subjectsTitle" class="subjectTitle">{{ taxGuideContent.subjectsTitle }}</h3>
							<div v-else class="subjectTitle"></div>
							<div class="subjectCardWrapper">
								<SubjectTaxCard
									v-for="subject in taxGuideContent.tax_subjects"
									:key="subject.id"
									:title="subject.title"
									:content="subject.content"
									:example="subject.example"
									:src="getStrapiImageSrc(subject.img, EStrapiImageSize.SMALL)"
								/>
							</div>
						</template>
					</section>
					<!-- /Contents loop -->

					<div style="margin-top: 20px">
						<DisclaimerSection :content="taxGuide.disclaimer ? taxGuide.disclaimer.disclaimer : ''" />
					</div>
				</div>
				<div class="taxGuideNavWrapper">
					<ContentNavigator root-class="tax-guide" :hide-numbering="true" :calculate-each="true" />
				</div>
			</div>
		</div>
		<div v-else class="sectionWrapper">No Content</div>
		<CountMeInSection />
	</div>
</template>

<script lang="ts">
import { Component, Vue, State } from 'nuxt-property-decorator';
import { LOAD_TAX_GUIDE } from '~/store/content';
import { ITaxGuide } from '~/types/content/types';
import ContentBody from '~/components/text/ContentBody.vue';
import ContentNavigator from '~/components/ContentNavigator.vue';
import TopSection from '~/components/section/TopSection.vue';
import SubjectTaxCard from '~/components/card/SubjectTaxCard.vue';
import { EStrapiImageSize, getStrapiImageSrc, metaInfo } from '~/utils/application';
import DisclaimerSection from '~/components/section/DisclaimerSection.vue';
import CountMeInSection from '~/components/section/CountMeInSection.vue';

@Component({
	components: {
		SubjectTaxCard,
		TopSection,
		ContentBody,
		ContentNavigator,
		CountMeInSection,
		DisclaimerSection,
	},
	asyncData: async ({ store }) => {
		await store.dispatch(`content/${LOAD_TAX_GUIDE}`);
	},
})
export default class CryptoTaxGuide extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'Crypto tax guide',
		);
	}

	EStrapiImageSize = EStrapiImageSize;
	@State(({ content }) => content.taxGuide) taxGuide!: ITaxGuide | null;
	loading: boolean = false;

	getStrapiImageSrc = (img: any, size: EStrapiImageSize) => getStrapiImageSrc(img, size);
}
</script>

<style lang="scss" scoped>
.topsectionWrapper {
	position: relative;
	background-color: $outline;
	padding-top: 76px;
	padding-bottom: 60px;
	@media (min-width: #{$breakpoint-xl}) {
		padding-bottom: 98px;
	}
	.greenCoin {
		position: absolute;
		top: 120px;
		right: 0px;
		display: none;
		@media (min-width: #{$breakpoint-xl}) {
			display: block;
		}
	}
	.mobileGreenCoin {
		position: absolute;
		top: 36px;
		right: 0px;
	}

	.taxPapper {
		position: absolute;
		bottom: 47px;
		right: 319px;
		display: none;
		@media (min-width: #{$breakpoint-xl}) {
			display: block;
			left: 50%;
			top: 50%;
			transform: translate(197%, -23%);
		}
	}
	.redCoin {
		position: absolute;
		bottom: 0px;
		left: 322px;
		display: none;
		@media (min-width: #{$breakpoint-xl}) {
			display: block;
			top: 50%;
			left: 50%;
			transform: translate(-310%, 69%);
		}
	}
	.mobileRedCoin {
		position: absolute;
		bottom: 0px;
		left: 8px;
	}
}

.totalWrapper {
	display: grid;
	margin-top: 44px;
	padding-top: 70px;
	gap: 20px;
	grid-template-columns: repeat(12, minmax(0, 1fr));

	.contentsWrapper {
		grid-column: span 12 / span 12;
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 9 / span 9;
		}

		.subjectTitle {
			margin-top: 100px;
			margin-bottom: 40px;
			font-size: 30px;
			font-weight: $font-semibold;
			font-family: $poppins;
			letter-spacing: -0.5px;
			line-height: 1.4;
			color: $primary;
			@media (min-width: #{$breakpoint-xl}) {
				font-size: 33px;
				margin-top: 72px;
				margin-bottom: 44px;
			}
		}
		.subjectCardWrapper {
			margin-bottom: 48px;
			@media (min-width: #{$breakpoint-xl}) {
				margin-bottom: 108px;
			}
		}
	}
	.taxGuideNavWrapper {
		display: none;
		@media (min-width: #{$breakpoint-xl}) {
			display: block;
			grid-column: span 3 / span 3;
		}
	}
}
</style>
