<template>
	<div id="bugReportDialog">
		<v-card v-if="bugReportDialog" class="dialogCardWrapper" color="tertiaryLight" max-width="500">
			<BugReportCard @cancel="close"></BugReportCard>
		</v-card>
	</div>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import BugReportCard from '~/components/card/BugReportCard.vue';
import { CLOSE_BUG_REPORTER } from '~/store';

@Component({
	components: {
		BugReportCard,
	},
})
export default class BugReportDialog extends Vue {
	@State(state => state.bugReportDialog) bugReportDialog!: boolean;

	close() {
		this.$store.commit(CLOSE_BUG_REPORTER);
	}
}
</script>

<style lang="scss" scoped>
#bugReportDialog {
	position: absolute;
	top: 0;
	right: 0;
	z-index: 10;
	margin: 0 20px;
	margin-top: 52px;
}
</style>
