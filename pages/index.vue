<template>
	<div>
		<IntroSection />
		<MeritsSection />
		<FeaturesSection />
		<!-- <ReviewSection /> -->
		<CountMeInSection />
		<ReferSection v-if="!FINAL_PRODUCTION" />
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { FINAL_PRODUCTION } from '~/utils/constants';
import { LOAD_REVIEWS } from '~/store/content';
import { metaInfo } from '~/utils/application';

import IntroSection from '~/components/section/IntroSection.vue';
import MeritsSection from '~/components/section/MeritsSection.vue';
import FeaturesSection from '~/components/section/FeaturesSection.vue';
import ReviewSection from '~/components/section/ReviewSection.vue';
import CountMeInSection from '~/components/section/CountMeInSection.vue';
import ReferSection from '~/components/section/ReferSection.vue';

@Component({
	components: {
		IntroSection,
		MeritsSection,
		FeaturesSection,
		ReviewSection,
		CountMeInSection,
		ReferSection,
	},
	asyncData: async ({ store }) => {
		await store.dispatch(`content/${LOAD_REVIEWS}`);
	},
})
export default class Home extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'Home',
		);
	}

	FINAL_PRODUCTION = FINAL_PRODUCTION;
}
</script>
