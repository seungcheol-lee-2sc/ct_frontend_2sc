<template>
	<v-footer padless color="offWhite">
		<div class="footerWarpper">
			<div class="mainInner">
				<div class="brandWrapper">
					<nuxt-link to="/">
						<img src="/logo/logo-grey.png" alt="Logo of Cointelli" />
					</nuxt-link>

					<div class="brandDesc">
						Crypto tax software for beginners. <br />
						Get your report in no time.
					</div>
				</div>
				<div>
					<ul>
						<li class="menuCategory"><nuxt-link :to="ABOUTUS_MENU.path">About us</nuxt-link></li>
						<li class="menuCategory"><nuxt-link :to="EXCHANGES_MENU.path">Exchanges</nuxt-link></li>
						<li class="menuCategory"><nuxt-link :to="PRICING_MENU.path">Pricing</nuxt-link></li>
					</ul>
				</div>
				<div>
					<ul>
						<li class="menuCategory">{{ $t(FEATURES_MENU.title) }}</li>
						<li v-for="menu in FEATURES_MENU.subMenus" :key="menu.title">
							<nuxt-link :to="menu.path"> <span v-html="sanitizeEveryTags($t(menu.title))"></span></nuxt-link>
						</li>
					</ul>
				</div>
				<div>
					<ul>
						<li class="menuCategory">{{ $t(FOOTER_SUPPORT_MENU.title) }}</li>
						<li v-for="menu in FOOTER_SUPPORT_MENU.subMenus" :key="menu.title">
							<a v-if="menu.external" :href="menu.path" target="_blank" rel="noopener noreferer">
								<span v-html="sanitizeEveryTags($t(menu.title))"></span>
								<v-icon small color="disabled">mdi-open-in-new</v-icon>
							</a>

							<nuxt-link v-else :to="menu.path">
								<span v-html="sanitizeEveryTags($t(menu.title))"></span>
							</nuxt-link>
						</li>
					</ul>
				</div>
				<div>
					<ul>
						<li class="menuCategory">{{ $t(LEGAL_MENU.title) }}</li>
						<li v-for="menu in LEGAL_MENU.subMenus" :key="menu.title">
							<nuxt-link :to="menu.path"><span v-html="sanitizeEveryTags($t(menu.title))"></span></nuxt-link>
						</li>
					</ul>
				</div>
			</div>
			<div class="footerContancIconsWrap">
				<template v-for="icon in footerContactIcons">
					<div v-if="Boolean(icon.href)" :key="icon.name" class="contactIcon">
						<a :href="icon.href" rel="noopener noreferrer" target="_blank" class="tooltipLink">
							<v-img :src="icon.src" :alt="`${icon.name}-icon`" class="shareIconImage" width="fit-content" />
						</a>
					</div>
				</template>
			</div>
			<div class="brandTitle">
				{{ brandTitle }}
			</div>
		</div>
	</v-footer>
</template>

<script lang="ts">
import { Vue, Getter, Component } from 'nuxt-property-decorator';
import { BASE_SITE_TITLE } from '~/utils/constants';
import {
	ABOUTUS_MENU,
	EXCHANGES_MENU,
	FEATURES_MENU,
	FOOTER_SUPPORT_MENU,
	LEGAL_MENU,
	PRICING_MENU,
} from '~/utils/menu';
import { sanitizeEveryTags } from '~/utils/string';

@Component
export default class AppFooter extends Vue {
	BASE_SITE_TITLE = BASE_SITE_TITLE;
	ABOUTUS_MENU = ABOUTUS_MENU;
	EXCHANGES_MENU = EXCHANGES_MENU;
	PRICING_MENU = PRICING_MENU;
	FEATURES_MENU = FEATURES_MENU;
	LEGAL_MENU = LEGAL_MENU;
	FOOTER_SUPPORT_MENU = FOOTER_SUPPORT_MENU;

	sanitizeEveryTags = (html: string) => sanitizeEveryTags(html);

	@Getter('content/footerContactIcons') footerContactIcons!: any[];

	get brandTitle() {
		return `© ${BASE_SITE_TITLE} - ${new Date().getFullYear()}`;
	}
}
</script>

<style lang="scss" scoped>
@import '~/assets/mixins/wrapper.scss';

.footerWarpper {
	@include wrapperMixin();
	display: flex;
	flex-direction: column;
	padding-top: 56px;
	padding-bottom: 56px;

	.mainInner {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px;
		width: 100%;
		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}

		ul,
		ol {
			padding-left: 0 !important;
			list-style: none;

			li {
				font-size: 15px;
				margin-bottom: 20px;
				font-family: $poppins;
			}
		}

		a {
			text-decoration: none;
			font-weight: $font-medium;
			color: $disabled !important;
			&:hover {
				color: $outline;
			}
		}
		.brandWrapper {
			grid-column: span 2 / span 2;
			@media (min-width: #{$breakpoint-xl}) {
				grid-column: span 2 / span 2;
			}

			.brandDesc {
				font-size: 14px;
				font-weight: $font-normal;
				color: $primaryLight;
				line-height: 1.4;
				width: 100%;
				margin-top: 13px;
				@media (min-width: #{$breakpoint-xl}) {
					width: 288px;
				}
			}
		}

		.brandTitle {
			margin-top: 96px;
			width: 100%;
			font-size: 15px;
			font-family: $poppins;
			font-weight: $font-normal;
		}

		.menuCategory {
			font-weight: $font-semibold;
			color: $primaryLight !important;
			a {
				font-weight: $font-semibold !important;
				color: $primaryLight !important;
				&:hover {
					color: $outline;
				}
			}
		}
	}

	.footerContancIconsWrap {
		display: flex;
		align-items: center;
		padding: 28px 5px;
		.contactIcon {
			margin-right: 40px;
		}
	}
}
</style>
