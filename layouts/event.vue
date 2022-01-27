<template>
	<v-app>
		<client-only>
			<EventAppHeader></EventAppHeader>
			<AppContent></AppContent>
			<SigningErrorDialog />
			<MessageQueue />
			<ConfirmDialog></ConfirmDialog>
			<HubspotChat></HubspotChat>
		</client-only>
	</v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import AppContent from '~/components/core/AppContent.vue';
import { LOAD_CONTACT, LOAD_NOTICE, LOAD_SEO } from '~/store/content';
import MessageQueue from '~/components/bar/MessageQueue.vue';
import ConfirmDialog from '~/components/dialog/ConfirmDialog.vue';
import SigningErrorDialog from '~/components/dialog/SigningErrorDialog.vue';
import HubspotChat from '~/components/chat/HubspotChat.vue';
import EventAppHeader from '~/components/core/EventAppHeader.vue';

@Component({
	components: {
		EventAppHeader,
		AppContent,
		MessageQueue,
		ConfirmDialog,
		HubspotChat,
		SigningErrorDialog,
	},
})
export default class Event extends Vue {
	async created() {
		await Promise.all([
			this.$store.dispatch(`content/${LOAD_SEO}`),
			this.$store.dispatch(`content/${LOAD_NOTICE}`),
			this.$store.dispatch(`content/${LOAD_CONTACT}`),
		]);
	}
}
</script>

<style lang="scss">
* {
	letter-spacing: -0.5px;
}
</style>
