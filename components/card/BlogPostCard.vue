<template>
	<v-card v-if="post" elevation="0" outlined @click.stop="onClickPost(post.slug)">
		<v-img
			:src="
				getSingleItem(post.thumbnail)
					? `${getStrapiImageSrc(getSingleItem(post.thumbnail), EStrapiImageSize.SMALL)}`
					: ''
			"
			height="226px"
			class="thumbnail"
		/>

		<v-card-subtitle>
			<span class="blogCategory">
				{{ post.category ? firstCharUppercase(post.category.categoryName) : ' ' }}
			</span>
		</v-card-subtitle>

		<h2 class="blogTitle">{{ omitText(post.title) }}</h2>

		<v-card-text>
			<div class="bottomWrapper">
				<!-- will change to strapi user -->
				<span class="author">Mark, CPA</span>
				<span class="date"> Updated {{ $moment(post.created_at).format(DATEFORMAT_CONTENT) }} </span>
			</div>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { EStrapiImageSize, getStrapiImageSrc } from '~/utils/application';
import { DATEFORMAT_CONTENT } from '~/utils/constants';
import { getSingleItem } from '~/utils/func';
import { firstCharUppercase, omitText } from '~/utils/string';

@Component
export default class BlogPostCard extends Vue {
	@Prop({ required: true }) post!: any;
	DATEFORMAT_CONTENT = DATEFORMAT_CONTENT;

	EStrapiImageSize = EStrapiImageSize;

	getSingleItem = (img: any) => getSingleItem(img);
	omitText = (str: string) => omitText(str, 60);
	getStrapiImageSrc = (img: object, size: EStrapiImageSize) => getStrapiImageSrc(img, size);
	firstCharUppercase = (str: string) => firstCharUppercase(str);
	onClickPost(slug: string) {
		this.$emit('click', slug);
	}
}
</script>

<style lang="scss" scoped>
.thumbnail {
	padding: 0;
	background-color: $offWhite;
}

.blogTitle {
	font-size: 23px;
	padding: 0 16px 32px 16px;
	font-family: $ibm;
	font-weight: $font-medium;
	line-height: 1.5;
}
.blogCategory {
	color: $purple;
	font-size: 15px;
	font-family: $poppins;
	display: inline-block;
	font-weight: $font-medium;
	line-height: 1;
}

.bottomWrapper {
	display: flex;
	justify-content: space-between;
	font-size: 15px;

	.author {
		color: $primary;
	}

	.date {
		color: $disabled;
	}
}
</style>
