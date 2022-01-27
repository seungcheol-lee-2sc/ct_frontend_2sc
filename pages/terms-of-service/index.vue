<template>
	<LegalFrame title="Terms of service" content-key="tos"></LegalFrame>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { IMPORT_ONLY } from '~/utils/constants';
import { metaInfo } from '~/utils/application';
import LegalFrame from '~/components/pages/legal/legalFrame.vue';
import { LOAD_LEGAL } from '~/store/content';

@Component({
	components: {
		LegalFrame,
	},
	layout: IMPORT_ONLY ? 'event' : '',
	asyncData: async ({ store }) => {
		await store.dispatch(`content/${LOAD_LEGAL}`);
	},
})
export default class TermsOfService extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'Terms of service',
		);
	}
}
</script>
