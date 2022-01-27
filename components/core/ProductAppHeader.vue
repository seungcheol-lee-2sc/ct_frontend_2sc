<template>
	<div>
		<div class="addtionalMenuWrapper">
			<div class="q-buttonWrapper">
				<span id="q-button" class="tour-item" @click="toggleGuideMap">
					<v-icon v-if="!guidMapOpen" size="36" color="primary">mdi-help-circle</v-icon>
					<v-icon v-else size="36" color="primary">mdi-close-circle</v-icon>
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import { ICognitoUserExt } from '~/types/auth/types';
import { OPEN_BUG_REPORTER, OPEN_GUIDE_MAP, CLOSE_GUIDE_MAP } from '~/store';
import { SUPPORT_MENU } from '~/utils/menu';
import ProductMenuList, { IProductMenuList } from '~/components/list/ProductMenuList.vue';
import BugReportDialog from '~/components/dialog/BugReportDialog.vue';

@Component({
	components: {
		BugReportDialog,
		ProductMenuList,
		Button,
	},
})
export default class ProductAppHeader extends Vue {
	@State(state => state.guidMapOpen) guidMapOpen!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;

	SUPPORT_MENU = SUPPORT_MENU;

	get supportMenu(): IProductMenuList[] {
		const result = SUPPORT_MENU.subMenus.map(v => ({
			color: 'primaryLight',
			text: String(this.$t(v.title)),
			newTab: v.newTab || false,
			onclick: () => {
				v.newTab ? window.open(v.path, '_blank') : this.$router.push(v.path);
			},
		}));

		result.push({
			color: 'primaryLight',
			text: 'Help',
			newTab: false,
			onclick: () => {
				this.$store.commit(OPEN_BUG_REPORTER);
			},
		});

		return result;
	}

	toggleGuideMap() {
		this.guidMapOpen ? this.$store.commit(CLOSE_GUIDE_MAP) : this.$store.commit(OPEN_GUIDE_MAP);
	}
}
</script>

<style lang="scss" scoped>
.addtionalMenuWrapper {
	position: fixed;
	z-index: 999;
	width: 100%;
	text-align: center;
	.q-buttonWrapper {
		display: flex;
		gap: 12px;
		align-items: center;
		position: absolute;
		top: 8px;
		right: 8px;
		z-index: 2000;

		#q-button {
			display: inline-block;
			cursor: pointer;
		}
	}
}
</style>
