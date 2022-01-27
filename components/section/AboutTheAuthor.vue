<template>
	<div v-if="author">
		<UnderTitleDivider text="About the Author" />
		<div class="authorNameWrapper">
			<div class="imageWrapper">
				<v-img :src="avatar" width="75" height="75" contain class="authorAvatar" />
			</div>
			<div v-if="author.name">
				<span class="name">{{ author.name }}</span>
				<br />
				<span v-if="author.role" class="authorRole">{{ author.role }}</span>
			</div>
		</div>
		<div v-if="author.introduce" class="authorIntro">
			{{ author.introduce }}
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import { IAuthor, IPost } from '~/types/content/types';
import UnderTitleDivider from '~/components/divider/UnderTitleDivider.vue';
import { EStrapiImageSize, getStrapiImageSrc } from '~/utils/application';
import { getSingleItem } from '~/utils/func';

@Component({
	components: {
		UnderTitleDivider,
	},
})
export default class AboutTheAuthor extends Vue {
	@State(({ content }) => content.post) post!: IPost | null;

	EStrapiImageSize = EStrapiImageSize;

	get author(): IAuthor | null {
		if (this.post && this.post.author && this.post.author.id) {
			return this.post.author;
		} else {
			return null;
		}
	}

	get avatar(): string {
		if (this.author) {
			const avatarItem = getSingleItem(this.author.avatar);
			if (avatarItem) {
				return `${getStrapiImageSrc(avatarItem, EStrapiImageSize.SMALL)}`;
			}
		}
		return '';
	}
}
</script>

<style lang="scss" scoped>
.authorNameWrapper {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin-bottom: 24px;

	.imageWrapper {
		margin-right: 16px;
		.authorAvatar {
			border-radius: $round-full;
			background-color: $outline;
		}
	}

	.name {
		color: $primary;
	}

	.authorRole {
		color: $disabled;
	}
}

.authorIntro {
	font-size: 15px;
	font-family: $poppins;
	color: $primaryLight;
}
</style>
