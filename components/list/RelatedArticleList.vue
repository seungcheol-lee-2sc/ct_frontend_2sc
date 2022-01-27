<template>
	<div>
		<div v-for="(relatedPost, idx) in relatedPosts" :key="`related-post-${idx}`">
			<nuxt-link :to="`/blog/${relatedPost.slug}`" class="relatedPostLink">
				{{ relatedPost && relatedPost.title }}
			</nuxt-link>

			<v-divider></v-divider>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { IPost } from '~/types/content/types';

@Component({})
export default class RelatedArticleList extends Vue {
	@Prop({ required: true }) relatedPosts!: IPost[];
}
</script>

<style lang="scss" scoped>
.relatedPostLink {
	padding-top: 12px;
	padding-bottom: 12px;
	font-family: $roboto;
	font-size: 16px;
	display: inline-block;
}
</style>
