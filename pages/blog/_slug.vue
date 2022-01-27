<template>
	<div>
		<div class="topBodyWrapper bottomBodyWrapper">
			<div class="sectionWrapper postSection">
				<!-- title -->
				<section class="titleSection">
					<div class="updated hide-pc">
						{{ $moment(post.updated_at).format(DATEFORMAT_CONTENT) }}
					</div>
					<h1 class="titleText">
						{{ post.title }}
					</h1>
					<div style="margin-top: 64px" class="hide-mb">
						<span v-if="post && post.author && post.author.name" class="author">
							Written by {{ post.author.name }}
						</span>
						<span class="updated"> Updated {{ $moment(post.updated_at).format(DATEFORMAT_CONTENT) }} </span>
					</div>
				</section>

				<section class="contentSection">
					<div class="contentIntro">
						<!-- Comment Intro -->
						<div v-if="post.intro" class="comment">
							<div class="commentText" v-html="reformedIntro"></div>
						</div>

						<!-- Thumbnail (Cover Image) -->
						<v-img
							:src="
								getSingleItem(post.thumbnail)
									? `${getStrapiImageSrc(getSingleItem(post.thumbnail), EStrapiImageSize.SMALL)}`
									: ''
							"
							class="thumbnail"
						/>
					</div>

					<!-- Body Content -->
					<ContentBody :post="post ? post.content : ''"></ContentBody>

					<!-- Disclaimer -->
					<DisclaimerSection :content="post && post.disclaimer ? post.disclaimer.disclaimer : ''" />
				</section>

				<!-- Navigation -->
				<div class="hide-mb" style="margin-left: 40px">
					<div class="rightNavWrap">
						<!-- About Author -->
						<AboutTheAuthor />

						<div v-if="relatedPosts.length > 0">
							<UnderTitleDivider :bottom-zero="true" text="Featured Articles" />
							<RelatedArticleList :related-posts="relatedPosts" />
						</div>

						<!-- SNS ICON -->
						<div v-if="existedShareIcons.length > 0" style="display: flex">
							<SharePostIcons />
						</div>
					</div>
				</div>
			</div>

			<div class="sectionWrapper postSection">
				<div class="bottomSectionInner">
					<div class="hide-mb">
						<v-divider style="margin-bottom: 32px"></v-divider>
						<div class="anotherPostWrapper">
							<div class="anotherPost">
								<template v-if="prevPost">
									<span class="direction">Previous<br /></span>
									<span class="postTitle" @click="onClickAnotherPost(prevPost)">
										{{ prevPost.title }}
									</span>
								</template>
							</div>
							<div class="anotherPost -right">
								<template v-if="nextPost">
									<span class="direction">Next<br /></span>
									<span class="postTitle" @click="onClickAnotherPost(nextPost)">
										{{ nextPost.title }}
									</span>
								</template>
							</div>
						</div>
					</div>

					<!-- About Author For Mobile -->
					<div style="margin-top: 40px; margin-bottom: 72px" class="hide-pc">
						<AboutTheAuthor />
					</div>

					<!-- click to Other Content -->
					<div v-if="relatedPosts.length > 0" class="hide-pc">
						<UnderTitleDivider :bottom-zero="true" text="Featured Articles" />
						<RelatedArticleList :related-posts="relatedPosts" />
					</div>

					<!-- SNS ICON for Mobile -->
					<div style="margin-top: 72px" class="hide-pc">
						<UnderTitleDivider text="Share" />

						<div style="display: flex">
							<SharePostIcons />
						</div>
					</div>
				</div>
			</div>
		</div>
		<CountMeInSection />
	</div>
</template>

<script lang="ts">
import { Component, Vue, State, Getter } from 'nuxt-property-decorator';
import { DATEFORMAT_CONTENT } from '~/utils/constants';
import SharePostIcons from '~/components/SharePostIcons.vue';
import ContentBody from '~/components/text/ContentBody.vue';
import { GET_POST, LOAD_POSTS } from '~/store/content';
import AboutTheAuthor from '~/components/section/AboutTheAuthor.vue';
import { IContact, IMeta, IPost } from '~/types/content/types';
import UnderTitleDivider from '~/components/divider/UnderTitleDivider.vue';
import RelatedArticleList from '~/components/list/RelatedArticleList.vue';
import { filteringHTML, nl2br } from '~/utils/string';
import { dynamicMetaInfo, EStrapiImageSize, getStrapiImageSrc } from '~/utils/application';
import { getSingleItem } from '~/utils/func';
import DisclaimerSection from '~/components/section/DisclaimerSection.vue';
import CountMeInSection from '~/components/section/CountMeInSection.vue';

@Component({
	components: {
		DisclaimerSection,
		RelatedArticleList,
		SharePostIcons,
		ContentBody,
		AboutTheAuthor,
		UnderTitleDivider,
		CountMeInSection,
	},
	asyncData: async ({ store, route }) => {
		await Promise.all([
			store.dispatch(`content/${GET_POST}`, route.params.slug),
			store.dispatch(`content/${LOAD_POSTS}`),
		]);
	},
})
export default class BlogSingle extends Vue {
	head() {
		return dynamicMetaInfo(this.metaTag, this.post?.title || '', this.post?.content || '');
	}

	@State(({ content }) => content.post) post!: IPost | null;
	@State(({ content }) => content.posts) posts!: IPost[];
	@State(({ content }) => content.contact) contact!: IContact | null;
	DATEFORMAT_CONTENT = DATEFORMAT_CONTENT;
	EStrapiImageSize = EStrapiImageSize;

	@Getter('content/existedShareIcons') existedShareIcons!: any[];

	get metaTag(): IMeta {
		const emptyMeta: IMeta = { id: null, title: '', description: '', ogTitle: '', ogDescription: '', ogImage: '' };
		console.log(this.post && this.post.meta);
		return (this.post && this.post.meta) || emptyMeta;
	}

	get reformedIntro(): string {
		return filteringHTML(nl2br(this.post?.intro || ''));
	}

	get currentPostIndex(): number {
		return this.posts.findIndex(v => v.id === this.post?.id);
	}

	get prevPost(): IPost | null {
		// newer
		if (this.currentPostIndex !== -1) {
			return this.posts[this.currentPostIndex - 1] || null;
		}
		return null;
	}

	get nextPost(): IPost | null {
		// older
		if (this.currentPostIndex !== -1) {
			return this.posts[this.currentPostIndex + 1] || null;
		}
		return null;
	}

	get relatedPosts(): IPost[] {
		if (this.post && this.post.posts && this.post.posts.length > 0) {
			return this.post.posts.filter(v => v.id !== this.post?.id).sort((a, b) => (a.updated_at > b.updated_at ? 1 : -1));
		}
		return [];
	}

	getSingleItem = (img: string) => getSingleItem(img);
	getStrapiImageSrc = (img: object, size: EStrapiImageSize) => getStrapiImageSrc(img, size);

	onClickAnotherPost(post: IPost) {
		this.$router.push(`/blog/${post.slug}`);
	}
}
</script>

<style lang="scss" scoped>
.postSection {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
}

.titleSection {
	margin-bottom: 60px;
	padding-bottom: 16px;
	grid-column: span 3 / span 3;
	@media (min-width: #{$breakpoint-xl}) {
		margin-bottom: 0;
		grid-column: span 2 / span 2;
	}

	.titleText {
		line-height: 1.4;
		font-size: 23px;
		font-weight: $font-medium;
		font-family: $ibm;
		text-align: center;

		@media (min-width: #{$breakpoint-xl}) {
			text-align: left;
			font-size: 46px;
		}
	}

	.author {
		font-size: 15px;
		font-family: $poppins;
		font-weight: $font-normal;
		color: $primaryLight;
	}

	.updated {
		text-align: center;
		margin-bottom: 16px;
		font-size: 13px;
		font-family: $poppins;
		font-weight: $font-normal;

		@media (min-width: #{$breakpoint-xl}) {
			text-align: left;
			margin-bottom: 0;
			font-size: 15px;
			color: $disabled;
		}
	}
}

.contentSection {
	grid-column: span 3 / span 3;
	@media (min-width: #{$breakpoint-xl}) {
		grid-column: span 2 / span 2;
	}

	.contentIntro {
		@media (min-width: #{$breakpoint-xl}) {
			display: flex;
			flex-direction: column-reverse;
		}

		.comment {
			text-align: center;
			margin-bottom: 40px;
			@media (min-width: #{$breakpoint-xl}) {
				text-align: left;
				display: flex;
				margin-bottom: 120px;
			}

			.commentor {
				margin-bottom: 24px;
				@media (min-width: #{$breakpoint-xl}) {
					margin-bottom: 0;
					margin-top: 4px;
					margin-left: 12px;
				}
			}

			.commentText {
				font-size: 16px;
				color: $primary;
				@media (min-width: #{$breakpoint-xl}) {
					font-size: 18px;
				}
			}
		}

		.thumbnail {
			margin-bottom: 24px;
			background-color: $outline;
		}
	}
}

.rightNavWrap {
	display: flex;
	gap: 64px;
	flex-direction: column;
	position: sticky;
	top: 20px;
}

.bottomSectionInner {
	grid-column: span 3 / span 3;

	@media (min-width: #{$breakpoint-xl}) {
		grid-column: span 2 / span 2;
	}
	.anotherPostWrapper {
		display: flex;
		justify-content: space-between;

		.anotherPost {
			&.-right {
				text-align: right;
			}

			.direction {
				font-size: 15px;
				font-family: $poppins;
				color: $secondaryLight;
				display: none;
				@media (min-width: #{$breakpoint-xl}) {
					display: inline;
				}
			}
			.postTitle {
				font-size: 15px;
				font-family: $poppins;
				color: $primary;
				cursor: pointer;
				&:hover {
					text-decoration: underline;
				}
			}
			.postDivider {
				margin-top: 12px;
				margin-bottom: 12px;
				@media (min-width: #{$breakpoint-xl}) {
					display: none;
				}
			}
		}
	}
}
</style>
