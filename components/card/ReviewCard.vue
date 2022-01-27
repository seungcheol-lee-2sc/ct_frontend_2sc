<template>
	<v-card class="reviewCard" elevation="5">
		<div class="reviewCardInner">
			<div class="descText">
				<q v-html="text"></q>
			</div>
			<div class="writerWrapper">
				<v-avatar size="66">
					<img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
				</v-avatar>
				<div>
					<div class="writer">Emily Jones</div>
					<StarRating :rating="5" :sizie="16" />
				</div>
			</div>
		</div>
	</v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import StarRating from '~/components/StarRating.vue';

@Component({
	components: {
		StarRating,
	},
})
export default class ReviewCard extends Vue {
	@Prop({ required: true }) text!: string;
}
</script>

<style lang="scss" scoped>
.reviewCard {
	border-radius: $round-lg;

	.reviewCardInner {
		padding: 36px;
		text-align: left;
		font-size: 16px;
		color: $primaryLight;
		line-height: 1.6;

		.descText {
			margin-bottom: 64px;
		}

		.writerWrapper {
			display: flex;
			gap: 16px;
			align-items: center;

			.writer {
				font-weight: $font-bold;
				font-size: 16px;
			}
		}
	}
}
</style>
