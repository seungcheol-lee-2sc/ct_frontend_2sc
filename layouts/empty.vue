<template>
	<v-app>
		<v-main>
			<nuxt />
		</v-main>
		<client-only>
			<ConfirmDialog></ConfirmDialog>
			<HubspotChat></HubspotChat>
			<MessageQueue />
			<SigningErrorDialog />
		</client-only>
	</v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import MessageQueue from '~/components/bar/MessageQueue.vue';
import HubspotChat from '~/components/chat/HubspotChat.vue';
import ConfirmDialog from '~/components/dialog/ConfirmDialog.vue';
import SigningErrorDialog from '~/components/dialog/SigningErrorDialog.vue';

@Component({
	components: {
		SigningErrorDialog,
		ConfirmDialog,
		HubspotChat,
		MessageQueue,
	},
})
export default class Empty extends Vue {}
</script>
