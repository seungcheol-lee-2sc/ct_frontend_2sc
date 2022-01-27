<template>
	<v-app-bar app flat color="offWhite" absolute>
		<div class="appBarInner">
			<div class="mainInner">
				<div class="align">
					<div class="titleText">{{ pageTitle }}</div>
					<span class="buttons">
						<Button
							fontcolor="white"
							color="secondary"
							class="inviteButton tourStep1_pro"
							:height="52"
							:width="240"
							:disabled="!affiliateInfo || !affiliateLink"
							@click="openInviteClientDialog"
						>
							{{ $t('product.inviteYourClient') }}
						</Button>

						<v-menu offset-y>
							<template #activator="{ on, attrs }">
								<span v-bind="attrs" style="inline-block" v-on="on">
									<UserAvatar :size="52" />
								</span>
							</template>

							<ProductMenuList :product-menu-list="userMenu" />
						</v-menu>
					</span>
				</div>
			</div>
		</div>

		<InviteClientDialog :dialog="inviteClientDialog" @close="closeInviteClientDialog" />
	</v-app-bar>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import { ICognitoUserExt } from '~/types/auth/types';
import { PROFESSIONAL_USER_MENU, SUPPORT_MENU } from '~/utils/menu';
import UserAvatar from '~/components/avatar/UserAvatar.vue';
import ProductMenuList, { IProductMenuList } from '~/components/list/ProductMenuList.vue';
import BugReportDialog from '~/components/dialog/BugReportDialog.vue';
import InviteClientDialog from '~/components/dialog/InviteClientDialog.vue';
import { IAffiliateBody } from '~/types/affiliate/types';
import { AffiliateService } from '~/services/AffiliateService';

@Component({
	components: {
		InviteClientDialog,
		BugReportDialog,
		ProductMenuList,
		Button,
		UserAvatar,
	},
})
export default class ProductAppHeader extends Vue {
	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;

	SUPPORT_MENU = SUPPORT_MENU;
	inviteClientDialog: boolean = false;
	affiliateService: AffiliateService | null = null;
	affiliateInfo: IAffiliateBody | null = null;

	get pageTitle(): string {
		if (this.$route.path === '/accountant/manage-clients') {
			return 'Manage Clients';
		} else if (this.$route.path === '/accountant/rewards') {
			return 'My Earns';
		} else if (this.$route.path === '/accountant/learn') {
			return 'Learn';
		} else if (this.$route.path === '/accountant/profile') {
			return 'My Profile';
		}
		return '';
	}

	get userMenu(): IProductMenuList[] {
		const result: IProductMenuList[] = PROFESSIONAL_USER_MENU.subMenus.map(v => ({
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

	get affiliateLink() {
		return this.affiliateService?.getLink() || '';
	}

	openInviteClientDialog() {
		this.inviteClientDialog = true;
	}

	closeInviteClientDialog() {
		this.inviteClientDialog = false;
	}

	onClickLink(path: string, newTab: boolean) {
		if (newTab) {
			const routeData = this.$router.resolve({ path });
			window.open(routeData.href, '_blank');
		} else {
			this.$router.push(path);
		}
	}

	async beforeMount() {
		this.affiliateService = AffiliateService.getInstance(this.$store, this.user);
		const info: IAffiliateBody | string = await this.affiliateService.getAffiliateInfo();
		if (typeof info === 'string') {
			this.affiliateInfo = null;
		} else {
			this.affiliateInfo = info;
		}
	}
}
</script>

<style lang="scss" scoped>
.appBarInner {
	// width: 100%;
	width: 1254px;
	margin: 0 auto;
	// padding: 0 48px;
	margin-top: 72px;

	.mainInner {
		width: 100%;
		text-align: center;

		.align {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.titleText {
			font-size: 46px;
			font-family: $poppins;
		}

		.buttons {
			display: flex;
			align-items: center;
			gap: 20px;

			.inviteButton {
				border-radius: $round-lg;
			}
		}
	}
}
</style>
