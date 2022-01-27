<template>
	<div>
		<div class="importNavTabsWrapper" :class="!contents.youtube ? '-single' : ''">
			<v-tabs v-model="tab" grow color="primary">
				<v-tab>QUICK GUIDE</v-tab>
				<v-tab v-if="contents.youtube">VIDEO GUIDE</v-tab>
			</v-tabs>
		</div>

		<v-card v-if="provider" class="importNavCardWrapper" color="offWhite" elevation="0">
			<div class="titleText">
				<!-- <img src="/characters/smile-4-sm.png" /> -->
				<div>
					{{ contents.title }}
				</div>
			</div>

			<div class="navCardInner ct-scroll">
				<div v-if="contents.warning && contents.positionTop" style="margin-bottom: 12px">
					<AlertCard :msg="contents.warning" color="error" />
				</div>

				<div class="navContent">
					<div v-if="tab === 0" class="navContentInner" v-html="contents.content || $t('message.noInstruction')"></div>
					<div v-if="contents.youtube && tab === 1" class="videoWrapper">
						<client-only>
							<iframe
								width="100%"
								:height="isMobile ? '240' : '360'"
								:src="`https://www.youtube.com/embed/${contents.youtube}`"
								title="YouTube video player"
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen
							/>
						</client-only>
					</div>
				</div>

				<div v-if="contents.warning && !contents.positionTop" class="bottomAlert">
					<AlertCard custom-color="primary" :msg="contents.warning" color="error" />
				</div>

				<div class="navDetail">
					<a
						v-if="contents.detailLink"
						class="detailLink"
						:href="contents.detailLink"
						target="_blank"
						rel="noopener noreferer"
					>
						<v-icon color="link" small style="margin-right: 2px">mdi-book-outline</v-icon>
						View screenshot
					</a>
					<span v-if="!request" class="detailLink" @click="openBugReporter">
						<v-icon color="link" small style="margin-right: 2px">mdi-message-reply-text-outline</v-icon>
						{{ $t('page.import.doesNotWork') }}
					</span>
					<Button
						v-else
						:height="44"
						:rounded="true"
						:fontsize="14"
						fontcolor="white"
						color="secondary"
						@click="openBugReporter"
					>
						Request exchange
					</Button>
				</div>
			</div>
		</v-card>
	</div>
</template>

<script lang="ts">
import { Component, Prop, State, Vue } from 'nuxt-property-decorator';
import { EImport } from '../dialog/ImportDialog.vue';
import Button from '../button/Button.vue';
import { LOAD_IMPORT_GUIDE } from '~/store/content';
import { ICommonImportGuide, IImportGuide } from '~/types/content/types';
import { EImportGuideType, ITransactionRecordProvider, TransactionRecordProviderType } from '~/types/provider/types';
import AlertCard from '~/components/card/AlertCard.vue';
import { IAsset } from '~/types/asset/types';
import { isThisAsset } from '~/utils/provider';

export interface IImportContent {
	title: string | any;
	content: string;
	detailLink: string | null;
	youtube: string | null;
	warning: string | null;
	positionTop: boolean | null;
}

@Component({
	components: {
		AlertCard,
		Button,
	},
})
export default class ImportNavCard extends Vue {
	@Prop({ required: true }) currentTab!: EImport;
	@Prop({ required: true }) provider!: ITransactionRecordProvider | IAsset | null;

	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ content }) => content.importGuide) importGuide!: IImportGuide | null;
	@State(({ content }) => content.defaultImportGuide) defaultImportGuide!: IImportGuide | null;

	loading: boolean = false;
	tab: number = 0;

	get request(): boolean {
		return this.currentTab === EImport.TEMPLATE;
	}

	get importType(): EImportGuideType | null {
		if (!this.provider) return null;

		switch (this.currentTab) {
			case EImport.AUTO:
				if (isThisAsset(this.provider)) {
					return EImportGuideType.ADDRESS;
				} else {
					const provider: ITransactionRecordProvider = this.provider;
					if (provider.type === TransactionRecordProviderType.WALLET) {
						return EImportGuideType.ADDRESS;
					} else if (provider.isLoginImportEnabled) {
						return EImportGuideType.LOGIN;
					} else if (provider.isAPIImportEnabled) {
						return EImportGuideType.API;
					}
					return null;
				}
			case EImport.FILE:
				return EImportGuideType.FILE;
			case EImport.MANUAL:
			case EImport.TEMPLATE:
				return EImportGuideType.MANUAL;
			default:
				return null;
		}
	}

	get targetGuide(): ICommonImportGuide {
		const noResult: ICommonImportGuide = {
			id: null,
			summary: '',
			warning: '',
			articleUrl: '',
			youtube: '',
			positionTop: false,
		};
		if (
			this.importType === EImportGuideType.ADDRESS ||
			this.importType === EImportGuideType.LOGIN ||
			this.importType === EImportGuideType.API
		) {
			return this.importGuide?.auto || this.defaultImportGuide?.auto || noResult;
		} else if (this.importType === EImportGuideType.FILE) {
			return this.importGuide?.file || this.defaultImportGuide?.file || noResult;
		} else if (this.importType === EImportGuideType.MANUAL) {
			return this.importGuide?.manual || this.defaultImportGuide?.manual || noResult;
		}
		return noResult;
	}

	get contents(): IImportContent {
		let title: any = '';
		if (this.importType === EImportGuideType.ADDRESS) {
			title += this.$t('page.import.guideTitle.publicAddress');
		} else if (this.importType === EImportGuideType.LOGIN) {
			title += this.$t('page.import.guideTitle.login');
		} else if (this.importType === EImportGuideType.API) {
			title += this.$t('page.import.guideTitle.api');
		} else if (this.importType === EImportGuideType.FILE) {
			title += this.$t('page.import.guideTitle.file');
		} else if (this.importType === EImportGuideType.MANUAL) {
			title += this.$t('page.import.guideTitle.manual');
		}

		return {
			title,
			content: this.targetGuide.summary || '',
			detailLink: this.targetGuide.articleUrl || '',
			youtube: this.targetGuide.youtube || '',
			warning: this.targetGuide.warning || '',
			positionTop: this.targetGuide.positionTop || false,
		};
	}

	openBugReporter() {
		this.$emit('bug');
	}

	async created() {
		this.loading = true;
		this.provider && (await this.$store.dispatch(`content/${LOAD_IMPORT_GUIDE}`, this.provider?.slug));
		this.loading = false;
	}
}
</script>

<style lang="scss">
.importNavTabsWrapper {
	width: 100%;

	@media (min-width: #{$breakpoint-xl}) {
		&.-single {
			max-width: 33%;
		}
		max-width: 66%;
		margin-bottom: 14px;
	}
}

.importNavCardWrapper {
	.titleText {
		display: flex;
		gap: 12px;
		align-items: center;
		font-family: $poppins;
		font-size: 23px;
		font-weight: $font-medium;
		padding: 36px 40px 0 40px;
		margin-bottom: 26px;
	}

	.navCardInner {
		padding: 0 16px;
		padding-bottom: 16px;
		@media (min-width: #{$breakpoint-xl}) {
			padding: 0 40px;
			padding-bottom: 40px;
			overflow-y: scroll;
			max-height: 400px;
		}

		.navContent {
			color: $primary;
			margin-bottom: 20px;
			font-size: 14px;
			font-family: $roboto;
			line-height: 1.5;

			ol {
				// padding-left: 0;
				li {
					position: relative;
					list-style: none;
					font-size: 16px;
					letter-spacing: 0.25px;
					margin-bottom: 12px;
					&::before {
						position: absolute;
						top: 2px;
						left: -30px;
					}
					&:nth-child(1) {
						&::before {
							content: url(/number/1.png);
						}
					}
					&:nth-child(2) {
						&::before {
							content: url(/number/2.png);
						}
					}
					&:nth-child(3) {
						&::before {
							content: url(/number/3.png);
						}
					}
					&:nth-child(4) {
						&::before {
							content: url(/number/4.png);
						}
					}
					&:nth-child(5) {
						&::before {
							content: url(/number/5.png);
						}
					}
					&:nth-child(6) {
						&::before {
							content: url(/number/6.png);
						}
					}
					&:nth-child(7) {
						&::before {
							content: url(/number/7.png);
						}
					}
					&:nth-child(8) {
						&::before {
							content: url(/number/8.png);
						}
					}
					&:nth-child(9) {
						&::before {
							content: url(/number/8.png);
						}
					}
				}
			}

			ul {
				margin-top: 8px;
				li {
					font-size: 14px;
					list-style: disc;
					margin-bottom: 4px;
					&::marker {
						font-size: 14px;
					}
					&::before {
						content: none !important;
					}
				}
			}

			.videoWrapper {
				overflow: hidden;
				border: 1px solid $outline;
				border-radius: $round-lg;
			}
		}

		.bottomAlert {
			margin-top: 12px;
			margin-bottom: 20px;
		}

		.navDetail {
			line-height: 1;
			cursor: pointer;
			margin-top: 52px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.detailLink {
				display: inline-block;
				color: $link;
				font-weight: $font-medium;
				font-size: 12px;
				font-family: $poppins;
				padding: 1px;
				line-height: 1;
			}
		}
	}
}
</style>
