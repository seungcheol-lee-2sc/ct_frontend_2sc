<template>
	<v-dialog v-model="dialog" persistent max-width="700">
		<v-card class="dialogCardWrapper -large cardWrapper">
			<div class="titleText">
				{{ $t('welcome.greetingPro.title') }}
			</div>

			<div class="tourFeatures">
				<div class="tourItem">
					<div class="circle">1</div>
					<div class="tourInfo">
						<span> {{ $t('welcome.greetingPro.feature1.title') }} </span>
						{{ $t('welcome.greetingPro.feature1.desc') }}
					</div>
				</div>
				<div class="tourItem">
					<div class="circle">2</div>
					<div class="tourInfo">
						<span> {{ $t('welcome.greetingPro.feature2.title') }} </span>
						{{ $t('welcome.greetingPro.feature2.desc') }}
					</div>
				</div>
				<div class="tourItem">
					<div class="circle">3</div>
					<div class="tourInfo">
						<span> {{ $t('welcome.greetingPro.feature3.title') }} </span>
						{{ $t('welcome.greetingPro.feature3.desc') }}
					</div>
				</div>
			</div>

			<div class="buttonsWrapper">
				<Button
					fontcolor="white"
					color="primary"
					:width="142"
					:height="44"
					:block="isMobile"
					:rounded="true"
					@click="startTour()"
				>
					{{ $t('common.next') }}
				</Button>
			</div>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import WelcomeDefault, { ITourItem } from '../mixins/WelcomeDefault.vue';

@Component({
	components: {
		Button,
	},
})
export default class WelcomeDialog extends WelcomeDefault {
	@Prop({ required: true }) dialog!: boolean;

	targetContents: ITourItem[] = [
		{
			selector: '.tourStep1_pro',
			src: '',
			title: this.$t('welcome.tour.step1Pro.title'),
			content: this.$t('welcome.tour.step1Pro.desc'),
			skipBtn: this.$t('welcome.tour.skip'),
			nextBtn: this.$t('common.next'),
		},
		{
			selector: '.tourStep2_pro',
			src: '',
			title: this.$t('welcome.tour.step2Pro.title'),
			content: this.$t('welcome.tour.step2Pro.desc'),
			skipBtn: '',
			nextBtn: this.$t('common.done'),
			position: 'right',
		},
	];
}
</script>

<style lang="scss" scoped>
.cardWrapper {
	font-family: $poppins;
	padding: 24px;
	text-align: center;

	.titleText {
		margin-bottom: 44px;
		font-family: $poppins;
		font-size: 33px;
	}

	.tourFeatures {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 40px;
		margin-bottom: 48px;

		.tourItem {
			.circle {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 50px;
				height: 50px;
				margin: 0 auto;
				margin-bottom: 16px;
				font-family: $poppins;
				font-size: 23px;
				font-weight: $font-bold;
				border-radius: $round-full;
			}

			.tourInfo {
				line-height: 1.7;
				font-weight: $font-medium;
				span {
					display: block;
					font-weight: $font-bold;
				}
			}

			&:nth-child(1) {
				.circle {
					background-color: $tertiaryLight;
				}
			}

			&:nth-child(2) {
				.circle {
					background-color: $secondaryLight;
				}
			}

			&:nth-child(3) {
				.circle {
					background-color: $purpleLight;
				}
			}
		}
	}
}
</style>
