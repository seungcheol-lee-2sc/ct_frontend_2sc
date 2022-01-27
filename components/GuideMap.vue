<template>
	<div class="guideWrapper" :class="guidMapOpen ? '-open' : '-close'">
		<div class="guideInner -shadow">
			<!-- <div class="tabWrapper">
				<div
					v-for="(tabItem, idx) in tabItems"
					:key="`guidmap-tab-${idx}`"
					:class="idx === tab ? '-active' : ''"
					@click="onClickTab(idx)"
				>
					{{ tabItem }}
				</div>
			</div> -->

			<div class="contentWrapper ct-scroll">
				<div :class="tab === 0 ? '-active' : ''" class="mapWrapper">
					<img style="height: fit-content" src="/road/product-roadmap.png" />
					<div class="innerTexts">
						<div class="step -left">
							<div class="titleText">Import Data</div>
							<div class="descText">Connect your wallets and exchanges.</div>
							<img class="smile" :class="path === '/tax/import' ? '-active' : ''" src="/characters/guide-smile-1.png" />
						</div>
						<div class="step -right">
							<div class="titleText">Overview</div>
							<div class="descText">See your transaction history.</div>
							<img
								class="smile"
								:class="path === '/tax/overview' ? '-active' : ''"
								src="/characters/guide-smile-1.png"
							/>
						</div>
						<div class="step -left">
							<div class="titleText">Review</div>
							<div class="descText">Increase the accuracy of your tax report.</div>
							<img class="smile" :class="path === '/tax/review' ? '-active' : ''" src="/characters/guide-smile-1.png" />
						</div>
						<div class="step -left">
							<div class="titleText">Tax Report</div>
							<div class="descText">Preview, download, or send to your accountant.</div>
							<img class="smile" :class="path === '/tax/report' ? '-active' : ''" src="/characters/guide-smile-2.png" />
						</div>
					</div>
				</div>
				<div :class="tab === 1 ? '-active' : ''">Coming soon...</div>
				<div :class="tab === 2 ? '-active' : ''">Coming soon...</div>
				<div :class="tab === 3 ? '-active' : ''">Coming soon...</div>
				<div :class="tab === 4 ? '-active' : ''">Coming soon...</div>
			</div>

			<div class="bottomWrapper">
				<div class="titleText">Get 10% credit for every referral!</div>
				<Button
					fontcolor="white"
					:rounded="true"
					:fontsize="14"
					color="secondary"
					:height="44"
					@click="$router.push('/user/rewards')"
				>
					Invite friends
				</Button>
				<img src="/characters/coin-stack-smiles.png" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import Button from './button/Button.vue';

@Component({
	components: {
		Button,
	},
})
export default class GuideMap extends Vue {
	@State(state => state.guidMapOpen) guidMapOpen!: boolean;

	tabItems: string[] = ['GUIDE', '1', '2', '3', '4'];
	tab: number = 0;

	get path(): string {
		return this.$route.path;
	}

	onClickTab(index: number) {
		this.tab = index;
	}
}
</script>

<style lang="scss" scoped>
$tabs-item-max-width: 120px;

@mixin emphText {
	font-family: $poppins;
	font-size: 23px;
	line-height: 1.55;
}

.guideWrapper {
	position: relative;
	overflow: hidden;
	position: fixed;
	top: 50px;
	right: 0;
	margin-right: 8px;
	min-width: 300px;
	z-index: 300;
	transition: all 0.3s ease-in-out;

	@media (min-width: #{$breakpoint-xl}) {
		width: 392px;
		margin-right: 16px;
	}

	&.-open {
		margin-bottom: 10px;
		max-height: 100%;
		opacity: 1;
	}

	&.-close {
		max-height: 0;
		opacity: 0.2;
	}

	.guideInner {
		position: relative;
		background-color: white;
		height: 100%;
		border-radius: $round-md;
		border: 1px solid $outline;

		.tabWrapper {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid $outline;
			padding: 0 8px;

			@media (min-width: #{$breakpoint-xl}) {
				padding: 0 18px;
			}

			> div {
				height: 48px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 14px;
				color: $disabled;
				padding: 0 8px;
				flex-grow: 1;
				cursor: pointer;
				font-weight: $font-medium;

				&.-active {
					color: $primary;
					border-bottom: 2px solid $primary;
				}
			}
		}

		.contentWrapper {
			height: calc(67vh);
			max-height: 540px;
			overflow-y: scroll;
			position: relative;
			padding-top: 28px;
			padding-bottom: 28px;

			> div {
				padding-left: 16px;
				padding-right: 16px;
				width: 100%;
				display: none;
				transition: all 0.3s ease-in-out;
				max-height: 0;
				@media (min-width: #{$breakpoint-xl}) {
					padding-left: 64px;
					padding-right: 64px;
				}

				&.-active {
					display: block;

					&.mapWrapper {
						position: relative;
						display: flex;
						justify-content: center;
						text-align: center;

						.innerTexts {
							position: absolute;
							height: 100%;
							width: 100%;
							max-width: 296px;

							.step {
								position: absolute;
								line-height: 1.54;
								font-size: 13px;
								text-align: left;
								max-width: 150px;

								.smile {
									position: absolute;
									transition: all 0.3s ease-in-out;
									top: 20px;
									left: 20px;
									max-width: 0;
									max-height: 0;
									opacity: 0;

									&.-active {
										top: 0;
										left: 0;
										max-width: 100%;
										max-height: 100%;
										opacity: 1;
									}
								}

								.titleText {
									letter-spacing: 0.1px;
									margin-bottom: 4px;
									font-weight: $font-bold;
									font-family: $poppins;
									color: $primary;
								}
								.descText {
									letter-spacing: 0.25px;
									color: $primaryLight;
								}

								&.-left {
									left: 76px;
								}
								&.-right {
									right: 10px;
								}

								&:nth-child(1) {
									top: 24px;
									.smile {
										transform: translate(-60px, 21px);
									}
								}
								&:nth-child(2) {
									top: 164px;
									.smile {
										transform: translate(22px, -61px);
									}
								}
								&:nth-child(3) {
									top: 306px;
									.smile {
										transform: translate(-12px, -60px);
									}
								}
								&:nth-child(4) {
									top: 404px;
									.smile {
										transform: translate(-66px, -28px);
									}
								}
							}
						}
					}
				}
			}
		}

		.bottomWrapper {
			position: relative;
			overflow: hidden;
			padding: 28px;
			padding-top: 20px;
			padding-bottom: 48px;
			background-color: $secondaryPale;
			border-bottom-left-radius: $round-md;
			border-bottom-right-radius: $round-md;

			.titleText {
				font-family: $poppins;
				font-size: 16px;
				color: $primary;
				margin-bottom: 36px;
				color: $primary;
				font-weight: $font-medium;
			}

			> img {
				position: absolute;
				bottom: 0;
				right: 0;
			}
			display: none;
			@media (min-width: #{$breakpoint-xl}) {
				display: block;
			}
		}
	}
}
</style>
