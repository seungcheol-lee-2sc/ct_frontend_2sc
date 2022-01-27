<template>
	<div>
		<header id="appBar">
			<div class="appBarWrapper">
				<img class="logo hide-pc" src="/logo/logo-mint-mb.png" alt="Logo of Cointelli" @click="$router.push('/')" />
				<div class="mainMenuWrapper">
					<img class="logo hide-mb" src="/logo/logo-mint.png" alt="Logo of Cointelli" @click="$router.push('/')" />
				</div>

				<div class="menuButtonsWrapper">
					<client-only>
						<span class="pc">
							<template v-if="!loggedIn">
								<Button color="primary" :text="true" :height="48" :fontsize="15" @click="onClickSignInBtn">
									{{ $t('common.signIn') }}
								</Button>
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
					<div class="buttonsWrapperMB">
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
import Button from '../button/Button.vue';

@Component({
	components: {
		Button,
	},
})
export default class EventAppHeader extends Vue {
	drawer: boolean = false;

	@State(state => state.isMobile) isMobile!: boolean;
	@Getter('auth/loggedIn') loggedIn!: boolean;

	onClickSignInBtn() {
		this.$router.push('/user/sign-in');
	}

	onClickApp() {
		this.$router.push('/tax/import');
	}
}
</script>
