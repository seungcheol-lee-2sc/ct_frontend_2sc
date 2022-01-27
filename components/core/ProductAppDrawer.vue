<template>
	<div id="productDrawer" :class="drawerClass">
		<Button id="drawerButton" :icon="true" color="primaryLight" head-icon="mdi-menu" @click="openDrawer"></Button>
		<div class="drawerInner" @mouseenter="onEnter" @mouseleave="onLeave">
			<div head>
				<div class="logoWrapper">
					<img class="smallLogo" src="/logo/logo-c-mint.png" alt="Logo of Cointelli" @click="onClickLogo" />
					<img class="fullLogo" src="/logo/logo-mint.png" alt="Logo of Cointelli" @click="onClickLogo" />
				</div>
			</div>

			<div body>
				<nav>
					<nuxt-link
						v-for="menuItem in targetMenu"
						:key="menuItem.path"
						:to="menuItem.path"
						class="linkItem"
						:class="menuItemClass(menuItem)"
						@click.native="closeDrawer"
					>
						<v-icon>{{ menuItem.icon }}</v-icon>
						<span>
							{{ menuItem.title }}
						</span>
					</nuxt-link>
				</nav>
			</div>

			<div tail>
				<span v-if="!isAccountant">
					<v-menu right :min-width="180">
						<template #activator="{ on, attrs }">
							<span v-bind="attrs" class="avatarWrapper" v-on="on">
								<UserAvatar :size="34" />
								<span :class="isMobile || hover ? '-show' : ''" class="rightLabel">{{ fullName }}</span>
							</span>
						</template>

						<ProductMenuList :product-menu-list="userMenu" />
					</v-menu>
				</span>
			</div>
		</div>
		<div class="drawerBackground" @click="closeDrawer"></div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, State, Getter } from 'nuxt-property-decorator';
import UserAvatar from '../avatar/UserAvatar.vue';
import ProductMenuList, { IProductMenuList } from '../list/ProductMenuList.vue';
import Button from '../button/Button.vue';
import { MIN_WIDTH } from '~/utils/constants';
import { MENU_ITEMS_PRODUCT, MENU_ITEMS_ACCOUNTANT, USER_MENU } from '~/utils/menu';
import { OPEN_DRAWER, CLOSE_DRAWER, CLOSE_GUIDE_MAP } from '~/store';
import { IMenuItem } from '~/types/common/types';

@Component({
	components: {
		ProductMenuList,
		UserAvatar,
		Button,
	},
})
export default class ProductAppDrawer extends Vue {
	@State(state => state.isMobile) isMobile!: boolean;
	@State(state => state.appDrawer) appDrawer!: boolean;
	MENU_ITEMS_PRODUCT = MENU_ITEMS_PRODUCT;
	MIN_WIDTH = MIN_WIDTH;
	hover: boolean = false;

	@Getter('auth/isAccountant') isAccountant!: boolean;
	@Getter('auth/fullName') fullName!: boolean;

	get userMenu(): IProductMenuList[] {
		const result: IProductMenuList[] = USER_MENU.subMenus.map(v => ({
			color: 'primaryLight',
			text: String(this.$t(v.title)),
			newTab: v.newTab || false,
			icon: v.icon,
			onclick: () => {
				this.onClickLink(v.path, v.newTab || false);
			},
		}));

		const logoutMenu: IProductMenuList = {
			color: 'primaryLight',
			text: String(this.$t('common.signOut')),
			icon: 'mdi-logout',
			onclick: () => {
				this.$router.push('/callback/sign-out');
			},
		};
		result.push(logoutMenu);

		return result;
	}

	get targetMenu(): any {
		return this.isAccountant ? MENU_ITEMS_ACCOUNTANT : MENU_ITEMS_PRODUCT;
	}

	menuItemClass(menuItem: IMenuItem) {
		let result = '';

		result += this.isAccountant ? '-vertical' : '';
		result += menuItem.wrapper ? ` ${menuItem.wrapper} ` : '';

		return result;
	}

	closeDrawer() {
		this.$store.commit(CLOSE_DRAWER);
	}

	onEnter() {
		this.hover = true;
	}

	onLeave() {
		this.hover = false;
	}

	get drawerClass(): string {
		let result = '';

		if (this.isMobile) {
			result += this.appDrawer ? '-open' : '-close';
		} else {
			result += this.hover && !this.isAccountant ? '-open' : '';
		}

		result += this.isAccountant ? ' -pro ' : ' -individual ';

		return result;
	}

	openDrawer() {
		this.$store.commit(CLOSE_GUIDE_MAP);
		this.appDrawer ? this.$store.commit(`${CLOSE_DRAWER}`) : this.$store.commit(`${OPEN_DRAWER}`);
	}

	onClickLogo() {
		this.isAccountant ? this.$router.push('/accountant/manage-clients') : this.$router.push('/tax/import');
	}

	onClickLink(path: string, newTab: boolean) {
		if (newTab) {
			const routeData = this.$router.resolve({ path });
			window.open(routeData.href, '_blank');
		} else {
			this.$router.push(path);
		}
		this.closeDrawer();
	}

	created() {
		this.isMobile ? this.$store.commit(CLOSE_DRAWER) : this.$store.commit(OPEN_DRAWER);
	}
}
</script>

<style lang="scss">
@mixin defaultPadding {
	padding: 12px;
}

$init-width: 56px;
$init-width-pro: 90px;

#productDrawer {
	position: fixed;
	width: 100vw;
	top: 0;
	height: 100vh;
	z-index: 100;

	#drawerButton {
		position: absolute;
		left: 100%;
		top: 10px;
		@media (min-width: #{$breakpoint-xl}) {
			display: none;
		}
	}

	&.-individual {
		@media (min-width: #{$breakpoint-xl}) {
			max-width: $init-width;
			.drawerInner {
				max-width: $init-width;
			}
		}

		.drawerInner {
			[body] {
				nav {
					padding-top: 24px;
					@media (min-width: #{$breakpoint-xl}) {
						padding-top: 100px;
					}
				}
			}
		}
	}

	&.-pro {
		@media (min-width: #{$breakpoint-xl}) {
			max-width: $init-width-pro;
			.drawerInner {
				max-width: $init-width-pro;
			}
		}
		.drawerInner {
			[body] {
				nav {
					padding-top: 24px;
					@media (min-width: #{$breakpoint-xl}) {
						padding-top: 48px;
					}
				}
			}
		}
	}

	&.-close {
		max-width: 0px;
		.drawerInner {
			max-width: 0px;
		}
	}

	&.-open {
		max-width: 100vw;
		@media (min-width: #{$breakpoint-xl}) {
			max-width: 240px;
		}

		.drawerBackground {
			display: block;
			@media (min-width: #{$breakpoint-xl}) {
				display: none;
			}
		}

		.drawerInner {
			max-width: 240px;
			[head] {
				.logoWrapper {
					.smallLogo {
						display: none;
					}

					.fullLogo {
						display: block;
					}
				}
			}
		}
	}

	.drawerBackground {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(black, 0.2);
		z-index: 99;
		@media (min-width: #{$breakpoint-xl}) {
			display: none;
		}
	}

	.drawerInner {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 100;
		overflow: hidden;
		background-color: $primary;
		transition: max-width 0.1s ease-in;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		[head] {
			text-align: center;
			@include defaultPadding();
			.logoWrapper {
				height: 25px;
				margin-top: 36px;
				> img {
					height: 100%;
					cursor: pointer;

					&.fullLogo {
						display: none;
					}
				}
			}
		}

		[body] {
			flex: 1;
			nav {
				.linkItem {
					height: 48px;
					padding: 12px 16px;
					display: flex;
					gap: 20px;
					justify-content: flex-start;
					color: $white;
					font-weight: $font-medium;
					font-size: 14px;
					letter-spacing: 0.1px;
					align-items: center;
					overflow: hidden;
					margin-bottom: 16px;

					i {
						color: $secondary;
					}

					&.nuxt-link-active {
						background-color: $white;
						color: $primary;
					}

					> span {
						white-space: nowrap;
					}

					@media (min-width: #{$breakpoint-xl}) {
						&.-vertical {
							gap: 4px;
							padding: 20px;
							flex-direction: column;
							height: 80px;

							i {
								color: $white;
							}

							&.nuxt-link-active {
								background-color: $white;
								color: $secondary;

								i {
									color: $secondary;
								}
							}
						}
					}
				}
			}
		}

		[tail] {
			@include defaultPadding();

			.avatarWrapper {
				display: flex;
				gap: 10px;
				align-items: center;
				.rightLabel {
					display: inline-block;
					padding-left: 4px;
					overflow: hidden;
					height: 0;
					font-weight: $font-medium;
					color: $white;
					width: 0;
					white-space: nowrap;
					font-size: 14px;
					&.-show {
						transition: all 0.2s ease-in;
						height: 100%;
						width: 100%;
					}
				}
			}
		}
	}
}
</style>
