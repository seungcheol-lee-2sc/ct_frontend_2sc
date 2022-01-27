<template>
	<div class="topBodyWrapper bottomBodyWrapper">
		<div class="sectionWrapper wrapper792">
			<article v-if="targetContent" class="exchangeArticle">
				<!-- title -->
				<section class="titleSection">
					<h1 class="titleText">{{ targetContent.title }}</h1>
					<span class="subtitleText">{{ targetContent.subtitle }}</span>
				</section>

				<!-- Body Content -->
				<ContentBody :post="targetContent.content || ''" />
			</article>
			<div v-else>no content</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import ContentBody from '~/components/text/ContentBody.vue';
import { LOAD_DEFAULT_EXCHANGES, LOAD_EXCHANGES } from '~/store/content';
import { ICommonContent, IDefaultExchanges, IExchanges, IMeta } from '~/types/content/types';
import { dynamicMetaInfo } from '~/utils/application';

@Component({
	components: { ContentBody },
	asyncData: async ({ store, route }) => {
		await Promise.all([
			store.dispatch(`content/${LOAD_EXCHANGES}`, route.params.slug),
			store.dispatch(`content/${LOAD_DEFAULT_EXCHANGES}`),
		]);
	},
})
export default class ExchangeView extends Vue {
	head() {
		return dynamicMetaInfo(this.metaTag, this.targetContent?.title || '', this.targetContent?.content || '');
	}

	@State(({ content }) => content.exchanges) exchanges!: IExchanges | null;
	@State(({ content }) => content.defaultExchanges) defaultExchanges!: IDefaultExchanges | null;

	get targetContent(): ICommonContent | null {
		return this.exchanges?.content || this.defaultExchanges?.blockchain || null;
	}

	get metaTag(): IMeta {
		const emptyMeta: IMeta = { id: null, title: '', description: '', ogTitle: '', ogDescription: '', ogImage: '' };
		return (this.exchanges && this.exchanges.meta) || emptyMeta;
	}
}
</script>
<style lang="scss">
.exchangeArticle {
	padding-bottom: 72px;

	.titleSection {
		margin-bottom: 96px;
		.titleText {
			font-size: 33px;
			font-weight: $font-medium;
			font-family: $ibm;
			margin-bottom: 16px;
			@media (min-width: #{$breakpoint-xl}) {
				font-size: 72px;
			}
		}
		.subtitleText {
			font-size: 16px;
			margin-top: 16px;
		}
	}
}
</style>
