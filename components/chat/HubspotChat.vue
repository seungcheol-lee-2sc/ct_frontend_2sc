<template>
	<span></span>
</template>

<script lang="ts">
import { Vue, Component, State, Watch } from 'nuxt-property-decorator';
import { ICognitoUserExt } from '~/types/auth/types';
import { GET_HUBSPOT_TOKEN } from '~/store/etc';
// import { clearWidgetCookies, launchWidget, removeWidget } from '~/utils/chat';

@Component
export default class HubspotChat extends Vue {
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;

	get userEmail(): string | null {
		return this.user?.attributes?.email || null;
	}

	get getTokenDTO(): any {
		return {
			email: this.userEmail,
			firstName: this.$store.state.user?.attributes?.given_name || '',
			lastName: this.$store.state.user?.attributes?.family_name || '',
		};
	}

	@Watch('userEmail')
	watchEmail() {
		this.refreshChatbox();
	}

	async refreshChatbox() {
		// clearWidgetCookies();
		if (this.userEmail) {
			const token: string | null = await this.$store.dispatch(`etc/${GET_HUBSPOT_TOKEN}`, this.getTokenDTO);

			if (token) {
				// @ts-ignore
				window.hsConversationsSettings = {
					loadImmediately: false,
					identificationEmail: this.userEmail,
					identificationToken: token,
				};
				// @ts-ignore
				window.HubSpotConversations.widget.load();
				return;
			}
		}
		// @ts-ignore
		window.HubSpotConversations.widget.load();
	}

	mounted() {
		// @ts-ignore
		window.hsConversationsOnReady = [this.refreshChatbox()];
	}
}
</script>
