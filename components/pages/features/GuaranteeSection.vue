<template>
	<section class="guaranteeWrapper sectionWrapper">
		<div class="guaranteeContent">
			<h1 class="titleText boldTitle">{{ $t('page.features.section6.title') }}</h1>
			<div class="contentWrapper">
				<div class="contentBody frame">
					<div class="auto-thumb">
						<img alt="Thumbs up icon" src="/illust-item/thumb.png" class="auto-thumb-content hide-pc" />
						<img alt="Thumbs up icon" src="/illust-item/thumb-pc.png" class="auto-thumb-content hide-mb" />
					</div>
				</div>
				<div class="contentBody text">
					<div class="descTextWrapper">
						<div class="container">
							<img alt="Check icon" class="auto-check" src="/icon/check-2.png" />
							<p class="descText">{{ $t('page.features.section6.desc1') }}</p>
						</div>
						<div class="container">
							<img alt="Check icon" class="auto-check" src="/icon/check-2.png" />
							<div class="descText">
								<p>
									{{ $t('page.features.section6.desc2') }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
@Component
export default class GuaranteeSection extends Vue {}
</script>

<style lang="scss" scoped>
// guarantee wrapper
.guaranteeWrapper {
	.guaranteeContent {
		width: 100%;
		padding-top: 80px;
		padding-bottom: 96px;
		@media (min-width: #{$breakpoint-xl}) {
			padding-top: 120px;
			padding-bottom: 125px;
		}
		.titleText {
			font-family: $poppins;
			font-weight: $font-medium;
			font-size: 26px;
			line-height: 1.3;
			text-align: center;
			color: black;

			@media (min-width: #{$breakpoint-xl}) {
				font-size: 46px;
				line-height: 1.1;
			}
		}
		.boldTitle {
			font-weight: $font-semibold;
		}
		.contentWrapper {
			margin-top: 36px;
			display: grid;
			grid-template-columns: repeat(1, minmax(0, 2fr));
			@media (min-width: #{$breakpoint-xl}) {
				grid-template-columns: repeat(12, minmax(0, 2fr));
				margin-top: 80px;
			}
			.contentBody {
				display: flex;
				flex-direction: column;
				align-items: center;
				&.frame {
					@media (min-width: #{$breakpoint-xl}) {
						display: block;
						text-align: right;
						grid-column: span 3 / span 3;
						margin-right: 55px;
					}
				}
				&.text {
					@media (min-width: #{$breakpoint-xl}) {
						display: block;
						gap: 8px;
						grid-column: span 8 / span 8;
					}
				}
			}
		}
		.descTextWrapper {
			margin-top: 36px;
			@media (min-width: #{$breakpoint-xl}) {
				margin-top: 10px;
			}
			.container {
				display: grid;
				grid-template-columns: 20px 1fr;
				gap: 11px;
				margin-bottom: 27px;
				@media (min-width: #{$breakpoint-xl}) {
					margin-bottom: 21px;
					gap: 8px;
				}
			}

			.auto-check {
				width: 20px;
				height: 20px;
			}
			.descText {
				line-height: 1.4;
				font-size: 14px;
				color: rgba(0, 0, 0, 0.6);
				letter-spacing: 0.25px;
				font-family: $roboto;
				font-weight: $font-normal;
				text-align: left;
				@media (min-width: #{$breakpoint-xl}) {
					font-size: 18px;
					line-height: 1.6;
					margin-top: -5px;
				}
			}
		}
	}
}
</style>
