<template>
	<v-app>
		<client-only>
			<div>
				<Button :rect="true" fontcolor="white" :block="true" color="primary" @click="onClickSignOut"> Sign out </Button>
			</div>
			<ProductAppContent />
			<ConfirmDialog></ConfirmDialog>
			<HubspotChat></HubspotChat>
			<MessageQueue />
			<PageLoadingBar />
			<ImportWatcher />
			<BugReportDialog />
			<SigningErrorDialog />
		</client-only>
	</v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import MessageQueue from '~/components/bar/MessageQueue.vue';
import PageLoadingBar from '~/components/bar/PageLoadingBar.vue';
import Button from '~/components/button/Button.vue';
import HubspotChat from '~/components/chat/HubspotChat.vue';
import ProductAppContent from '~/components/core/ProductAppContent.vue';
import BugReportDialog from '~/components/dialog/BugReportDialog.vue';
import ConfirmDialog from '~/components/dialog/ConfirmDialog.vue';
import SigningErrorDialog from '~/components/dialog/SigningErrorDialog.vue';
import ImportWatcher from '~/components/ImportWatcher.vue';

@Component({
	components: {
		SigningErrorDialog,
		ConfirmDialog,
		HubspotChat,
		MessageQueue,
		PageLoadingBar,
		BugReportDialog,
		ImportWatcher,
		ProductAppContent,
		Button,
	},
})
export default class EmptyLoggedIn extends Vue {
	onClickSignOut() {
		this.$router.push('/callback/sign-out');
	}
}
</script>
