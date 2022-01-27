<template>
	<v-dialog :value="dialog" width="1280" persistent scrollable @keydown.esc="close" @click:outside="close">
		<v-card :min-height="isMobile ? 'auto' : 700" height="100%">
			<div class="dialogCardWrapper noPadBottom">
				<v-icon class="closeBtn" color="secondary" @click="close" v-text="'mdi-close'" />

				<div class="alertTitle">
					{{ noticeAlert.title }}
				</div>

				<div class="alertContent">
					<div class="contentBody">
						<ContentBody :post="noticeAlert.content || ''"></ContentBody>
					</div>
					<div class="contentImage">
						<v-img
							:src="
								getSingleItem(noticeAlert.img)
									? `${getStrapiImageSrc(getSingleItem(noticeAlert.img), EStrapiImageSize.LARGE)}`
									: ''
							"
							width="fit-content"
						/>
					</div>
				</div>

				<div class="alertButtons">
					<Button
						:width="isMobile ? 'auto' : 200"
						:height="52"
						color="secondary"
						:block="isMobile"
						fontcolor="white"
						class="okButton"
						@click="onClickOkButton"
					>
						{{ $t('common.ok').toUpperCase() }}
					</Button>

					<span v-if="noticeAlert.linkLabel && noticeAlert.linkUrl">
						<span class="hide-mb">
							<v-btn height="52" color="secondary" outlined @click="close">
								{{ noticeAlert.linkLabel }}
							</v-btn>
						</span>
						<span class="hide-pc">
							<CardButton :msg="noticeAlert.linkLabel" @click="onClickDetailButton"></CardButton>
						</span>
					</span>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, State, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import { INoticeAlert } from '~/types/content/types';
import ContentBody from '~/components/text/ContentBody.vue';
import CardButton from '~/components/button/CardButton.vue';
import { EStrapiImageSize, getStrapiImageSrc } from '~/utils/application';
import { getSingleItem } from '~/utils/func';

@Component({
	components: {
		ContentBody,
		CardButton,
		Button,
	},
})
export default class NoticeAlertDialog extends Vue {
	@Prop({ required: true }) dialog!: boolean;
	@Prop({ required: true }) noticeAlert!: INoticeAlert;

	@State(state => state.isMobile) isMobile!: boolean;

	EStrapiImageSize = EStrapiImageSize;

	getSingleItem = (img: string) => getSingleItem(img);
	getStrapiImageSrc = (img: object, size: EStrapiImageSize) => getStrapiImageSrc(img, size);

	close() {
		this.$emit('close');
	}

	onClickOkButton() {
		this.$emit('complete');
	}

	onClickDetailButton() {
		this.noticeAlert.linkUrl && window.open(this.noticeAlert.linkUrl, '_blank', 'noopener,noreferer');
	}
}
</script>

<style lang="scss" scoped>
.alertTitle {
	font-size: 20px;
	font-family: $poppins;
	margin-bottom: 20px;
	@media (min-width: #{$breakpoint-xl}) {
		font-size: 33px;
		margin-bottom: 36px;
	}
}

.alertContent {
	display: grid;
	grid-template-columns: repeat(5, minmax(0, 1fr));
	gap: 48px;
	padding-bottom: 120px;
	@media (min-width: #{$breakpoint-xl}) {
		padding-bottom: 140px;
	}

	.contentBody {
		grid-column: span 5 / span 5;
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 3 / span 3;
		}
	}

	.contentImage {
		display: none;
		@media (min-width: #{$breakpoint-xl}) {
			display: block;
			grid-column: span 2 / span 2;
		}
	}
}

.alertButtons {
	position: absolute;
	bottom: 24px;
	@media (min-width: #{$breakpoint-xl}) {
		bottom: 36px;
	}

	.okButton {
		@media (min-width: #{$breakpoint-xl}) {
			margin-right: 16px;
		}
	}
}
</style>
