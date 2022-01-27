<template>
	<div>
		<header id="appBar" :style="{ backgroundColor: barColor }" @mouseleave="closeDropdown">
			<div class="appBarWrapper">
				<img class="logo hide-pc" src="/logo/logo-mint-mb.png" alt="Logo of Cointelli" @click="$router.push('/')" />
				<div class="mainMenuWrapper">
					<img class="logo hide-mb" src="/logo/logo-mint.png" alt="Logo of Cointelli" @click="$router.push('/')" />
					<nav>
						<div v-for="menuItem in MENU_ITEMS_MARKETING" :key="`top-${menuItem.title}`" class="pcMenuItem">
							<span v-if="menuItem.subMenus.length > 0" class="submenuWrap">
								<a @mouseover="dropdownMenu">
									{{ $t(menuItem.title) }}
									<v-icon color="primary" style="margin-left: 2px" small>mdi-chevron-down</v-icon>
								</a>
								<div class="dropdownMenuWrapper">
									<ul class="dropdownInner">
										<div class="description">
											<span>{{ $t(menuItem.title) }}</span>
											<div class="desc">
												{{ menuItem.desc }}
											</div>
										</div>
										<li
											v-for="(submenu, idx) in menuItem.subMenus"
											:key="`${idx}-${submenu.title}`"
											class="roundedMenu"
											:class="`-card-${idx + 1}`"
										>
											<a
												v-if="submenu.external === true"
												:href="submenu.path"
												target="_blank"
												rel="noopener noreferrer"
											>
												<span v-html="$t(submenu.title)"></span>
												<img :src="submenu.imageUrl" />
											</a>
											<a
												v-else
												@click="
													() => {
														$router.push(submenu.path);
														closeDropdown();
													}
												"
											>
												<span v-html="$t(submenu.title)"></span>
												<img :src="submenu.imageUrl" />
											</a>
										</li>
									</ul>
								</div>
							</span>
							<nuxt-link v-else :to="menuItem.path" @mouseover.native="closeDropdown">
								{{ $t(menuItem.title) }}
							</nuxt-link>
						</div>
					</nav>
				</div>

				<div class="menuButtonsWrapper">
					<client-only>
						<span class="pc">
							<CountMeInButton
								v-if="FINAL_PRODUCTION"
								:width="150"
								:height="48"
								:fontsize="15"
								:green="true"
								button-id="header-waitlist-button"
							/>
							<template v-else>
								<template v-if="!loggedIn">
									<nuxt-link to="/contact-us/enterprise" class="text-secondary"> Enterprise </nuxt-link>
									<nuxt-link to="/user/sign-in">
										{{ $t('common.signIn') }}
									</nuxt-link>
									<Button
										fontcolor="white"
										:height="48"
										:rounded="true"
										color="secondary"
										:fontsize="15"
										@click="$router.push('/user/sign-up')"
									>
										{{ $t('common.signUpForFree') }}
									</Button>
								</template>
								<Button
									v-else
									:height="48"
									fontcolor="white"
									:rounded="true"
									color="secondary"
									:fontsize="15"
									@click="onClickApp"
								>
									App
								</Button>
							</template>
						</span>
					</client-only>

					<span class="mb">
						<Button color="primaryLight" :icon="true" head-icon="mdi-menu" @click="drawer = !drawer" />
					</span>
				</div>
			</div>
		</header>

		<client-only>
			<v-navigation-drawer
				v-show="isMobile"
				id="appDrawer"
				v-model="drawer"
				temporary
				fixed
				right
				color="white"
				width="100%"
				style="z-index: 999"
			>
				<div class="appDrawerLogoWrapper">
					<img class="logo" src="/logo/logo-mint-mb.png" alt="Logo of Cointelli" />
					<Button :icon="true" color="primaryLight" head-icon="mdi-window-close" @click="drawer = !drawer"> </Button>
				</div>
				<div class="appDrawerLists">
					<div
						v-for="(menuItem, idx) in MENU_ITEMS_MARKETING"
						:key="`right-${menuItem.title}`"
						class="marketDrawerListWrapper"
						:class="menuItem.subMenus.length > 0 && activeMenuIdx === idx ? '-active' : ''"
						@click="onClickDrawerMenu(menuItem, idx)"
					>
						<div class="drawerListInner">
							{{ $t(menuItem.title) }}
							<v-icon v-if="menuItem.subMenus.length > 0" class="chevron" color="primary"> mdi-chevron-down </v-icon>
						</div>
						<div v-if="menuItem.subMenus.length > 0" class="subMenusWrapper">
							<div v-for="(submenu, subIndex) in menuItem.subMenus" :key="`mb-${submenu.title}`">
								<a v-if="submenu.external === true" :href="submenu.path" target="_blank" rel="noopener noreferrer">
									<div
										class="drawerSubCard"
										:class="`bg-${SubCardColors[subIndex % 4]}`"
										v-html="$t(submenu.title)"
									></div>
								</a>
								<nuxt-link v-else :to="submenu.path">
									<div
										class="drawerSubCard"
										:class="`bg-${SubCardColors[subIndex % 4]}`"
										v-html="$t(submenu.title)"
									></div>
								</nuxt-link>
							</div>
						</div>
					</div>
					<div v-if="!FINAL_PRODUCTION" class="buttonsWrapperMB">
						<template v-if="!loggedIn">
							<Button
								fontcolor="white"
								color="secondary"
								:rounded="true"
								:block="true"
								:height="48"
								@click="$router.push('/user/sign-up')"
							>
								Start now
							</Button>
							<Button
								fontcolor="white"
								color="primary"
								:rounded="true"
								:block="true"
								:height="48"
								@click="onClickSignInBtn"
							>
								Sign in
							</Button>

							<Button
								color="secondary"
								:text="true"
								:block="true"
								:height="48"
								@click="$router.push('/contact-us/enterprise')"
							>
								Enterprise
							</Button>
						</template>
						<template v-else>
							<Button
								color="secondary"
								fontcolor="white"
								:rounded="true"
								:block="true"
								:height="48"
								@click="$router.push('/tax/import')"
							>
								App
							</Button>
						</template>
					</div>
				</div>
			</v-navigation-drawer>
		</client-only>
	</div>
</template>

<script lang="ts">
import { Component, Getter, State, Vue } from 'nuxt-property-decorator';
import * as amazonCognitoIdentityJs from 'amazon-cognito-identity-js';
import Button from '../button/Button.vue';
import CountMeInButton from '../button/CountMeInButton.vue';
import { EN, FINAL_PRODUCTION } from '~/utils/constants';
import { MENU_ITEMS_MARKETING, USER_MENU } from '~/utils/menu';
import { IMenuItem } from '~/types/common/types';

type SubCardColor = 'purpleDarkPale' | 'secondaryDarkPale' | 'primaryPale' | 'orangeDarkPale';

@Component({
	components: {
		Button,
		CountMeInButton,
	},
})
export default class AppHeader extends Vue {
	FINAL_PRODUCTION = FINAL_PRODUCTION;
	USER_MENU = USER_MENU;
	locale: string = EN;
	drawer: boolean = false;
	MENU_ITEMS_MARKETING = MENU_ITEMS_MARKETING;
	signOutText: any = this.$t('common.signOut');

	extraClass: string = '';
	barColor: string = 'transparent';
	SubCardColors: SubCardColor[] = ['purpleDarkPale', 'secondaryDarkPale', 'primaryPale', 'orangeDarkPale'];
	activeMenuIdx: number | null = null;

	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ auth }) => auth.user) user!: amazonCognitoIdentityJs.CognitoUser | any;
	@Getter('auth/loggedIn') loggedIn!: boolean;
	@Getter('auth/isAccountant') isAccountant!: boolean;

	onClickDrawerMenu(menuItem: IMenuItem, idx: number) {
		if (menuItem.subMenus.length > 0) {
			this.activeMenuIdx = this.activeMenuIdx === idx ? null : idx;
		} else {
			this.activeMenuIdx = null;
			this.$router.push(menuItem.path);
		}
	}

	onClickSignInBtn() {
		this.$router.push('/user/sign-in');
	}

	// onChangeLocale() {
	// 	this.$i18n.locale = this.locale;
	// }

	onClickApp() {
		this.isAccountant ? this.$router.push('/accountant/manage-clients') : this.$router.push('/tax/import');
	}

	closeDropdown() {
		this.barColor = 'transparent';
		document.querySelectorAll('.dropdownMenuWrapper').forEach(el => {
			el.classList.remove('-show');
		});
	}

	dropdownMenu(event: Event) {
		this.closeDropdown();

		const anchorElement: any = event.target;
		if (!anchorElement) return;
		const dropdown: HTMLElement = anchorElement.parentNode.querySelector('.dropdownMenuWrapper');
		if (!dropdown) return;
		dropdown.classList.add('-show');
		this.barColor = 'white';
	}
}
</script>
