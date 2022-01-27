<template>
	<v-dialog :value="dialog" width="1440" persistent content-class="ct-scroll" @keydown.esc="closeDialog">
		<div>
			<div class="dialogCardWrapper manualReviewCard" :class="scrollable ? '-scroll ct-scroll' : ''">
				<v-icon class="closeBtn" color="primaryLight" @click="closeDialog"> mdi-close </v-icon>
				<div class="topSection">
					<div class="titleText">{{ title }}</div>
					<div class="descText" v-html="desc"></div>
					<LinkText v-if="href" :to="href">{{ link }}</LinkText>
				</div>

				<div class="mainSection">
					<slot></slot>
				</div>
			</div>
		</div>
	</v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import LinkText from '~/components/text/LinkText.vue';

@Component({
	components: {
		LinkText,
	},
})
export default class MatchInternalDialog extends Vue {
	@Prop({ required: true }) dialog!: boolean;
	@Prop({ required: true }) title!: string;
	@Prop({ required: true }) desc!: string;
	@Prop({ required: true }) link!: string;
	@Prop() scrollable!: boolean;
	@Prop() href!: string;

	closeDialog() {
		this.$emit('close');
	}
}
</script>

<style lang="scss" scoped>
.manualReviewCard {
	background-color: $white;
	height: 90vh;

	&.-scroll {
		overflow-y: scroll;
	}

	.topSection {
		padding-bottom: 32px;

		.titleText {
			font-size: 33px;
			font-family: $poppins;
			letter-spacing: 0.25px;
			line-height: 1.2;
			margin-bottom: 12px;
		}

		.descText {
			font-size: 18px;
			letter-spacing: 0.25px;
			line-height: 1.66;
			margin-bottom: 4px;
			color: $primaryLight;
		}
	}

	.mainSeciton {
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
