<template>
	<div>
		<div class="topBodyWrapper bottomBodyWrapper">
			<div class="sectionWrapper postListWrapper">
				<TopSection title="Crypto Tax Insights" desc="Provided by CPA and crypto experts." />

				<div class="searchWrap">
					<v-text-field
						v-model.trim="inputForSearch"
						outlined
						placeholder="What are you searching for?"
						prepend-inner-icon="mdi-magnify"
					></v-text-field>
				</div>

				<div v-if="loading" class="loadingWrapper">
					<v-progress-linear indeterminate color="primary" />
				</div>
				<template v-else>
					<div class="filterButtons">
						<FilterButton
							:active="selectedCategory === null"
							:name="`All (${categories.length})`"
							@click="selectCategory(null)"
						/>
						<FilterButton
							v-for="category in categories"
							:key="category.id"
							:active="selectedCategory && selectedCategory.categoryName === category.categoryName"
							:name="firstCharUppercase(category.categoryName || '')"
							@click="selectCategory(category)"
						/>
					</div>

					<div v-if="filteredPostsByInput.length > 0" class="postLoop">
						<div v-for="post in filteredPostsByInput" :key="post.id" style="padding: 12px">
							<BlogPostCard :post="post" @click="onClickPost" />
						</div>
					</div>
					<div v-else style="text-align: center">
						<v-sheet style="margin-top: 128px; padding: 32px"> There's no content </v-sheet>
					</div>
					<div class="paginationWrapper">
						<Pagination :total="totalOfFilteredPosts" :size="size" :page="currentPage" @onChangePage="onChangePage" />
					</div>
				</template>
			</div>
		</div>
		<CountMeInSection />
	</div>
</template>

<script lang="ts">
import { Vue, Component, State, Getter, Mutation } from 'nuxt-property-decorator';
import { LOAD_POSTS, LOAD_CATEGORIES, SELECT_CATEGORY } from '~/store/content';
import { IBlogCategory } from '~/types/content/types';
import { PER_PAGE } from '~/utils/constants';
import FilterButton from '~/components/button/FilterButton.vue';
import TopSection from '~/components/section/TopSection.vue';
import BlogPostCard from '~/components/card/BlogPostCard.vue';
import Pagination from '~/components/pagination/Pagination.vue';
import { metaInfo } from '~/utils/application';
import { getSingleItem } from '~/utils/func';
import { firstCharUppercase, omitText } from '~/utils/string';
import CountMeInSection from '~/components/section/CountMeInSection.vue';
import CountMeInButton from '~/components/button/CountMeInButton.vue';

@Component({
	components: {
		TopSection,
		FilterButton,
		BlogPostCard,
		Pagination,
		CountMeInSection,
		CountMeInButton,
	},
	asyncData: async ({ store }) => {
		await store.dispatch(`content/${LOAD_CATEGORIES}`);
		await store.dispatch(`content/${LOAD_POSTS}`);
	},
})
export default class Blog extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'Blog',
		);
	}

	@State(({ content }) => content.categories) categories!: IBlogCategory[];
	@State(({ content }) => content.selectedCategory) selectedCategory!: IBlogCategory;
	currentPage: number = 1;
	size: number = PER_PAGE;
	inputForSearch: string = '';
	loading: boolean = false;

	@Getter('content/filteredPosts') filteredPosts!: any[];

	get filteredPostsByInput() {
		return this.filteredPosts.filter(post => {
			return (
				(post.desc && post.desc.toLowerCase().includes(this.inputForSearch.toLowerCase())) ||
				(post.title && post.title.toLowerCase().includes(this.inputForSearch.toLowerCase()))
			);
		});
	}

	get totalOfFilteredPosts() {
		return this.filteredPostsByInput.length;
	}

	@Mutation(`content/${SELECT_CATEGORY}`) selectCategory: any;

	getSingleItem = (img: any) => getSingleItem(img);
	omitText = (str: string) => omitText(str, 100);
	firstCharUppercase = (str: string) => firstCharUppercase(str);

	onClickPost(slug: string) {
		this.$router.push(`/blog/${slug}`);
	}

	onChangePage(page: number) {
		this.currentPage = page;
	}
}
</script>
<style lang="scss" scoped>
.postListWrapper {
	.searchWrap {
		width: 100%;
		margin: 0 auto;
		max-width: 720px;
	}

	.v-card__title {
		padding: 0 16px 32px 16px;
	}
	.v-card__subtitle {
		padding: 16px;
	}

	.loadingWrapper {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		height: 100vh;
	}

	.filterButtons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}

	.postLoop {
		margin-top: 128px;
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.paginationWrapper {
		margin-top: 32px;
		@media (min-width: #{$breakpoint-xl}) {
			margin-top: 80px;
		}
	}
}
</style>
