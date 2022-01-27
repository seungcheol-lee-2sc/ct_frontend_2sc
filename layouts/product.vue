<template>
	<v-app>
		<client-only>
			<ProfessionalAppHeader v-if="isAccountant" />
			<ProductAppHeader v-else-if="!runTour" />
			<ProductAppDrawer />
			<ProductAppContent />
			<SigningErrorDialog />
			<ConfirmDialog />
			<PageLoadingBar />
			<ImportWatcher />
			<BugReportDialog />
			<MessageQueue />
			<template v-if="!IMPORT_ONLY">
				<template v-if="user">
					<AgreeDialog v-if="runAgree" :dialog="agreeDialog" @close="closeAgreeDialog" />
					<CountryDialog v-if="runCountrySelector" :dialog="countryDialog" @close="closeCountryDialog" />
					<template v-if="runTour">
						<ProfessionalTourDialog v-if="isAccountant" :dialog="tourDialog" @close="closeTourDialog" />
						<WelcomeOverlay v-else :value="tourDialog" @close="closeTourDialog" />
					</template>
				</template>

				<GuideMap />
			</template>
			<HubspotChat />
		</client-only>
	</v-app>
</template>

<script lang="ts">
import { Component, Getter, State, Vue } from 'nuxt-property-decorator';
import ProductAppContent from '~/components/core/ProductAppContent.vue';
import ProductAppDrawer from '~/components/core/ProductAppDrawer.vue';
import ProductAppHeader from '~/components/core/ProductAppHeader.vue';
import ProfessionalAppHeader from '~/components/core/ProfessionalAppHeader.vue';
import CountryDialog from '~/components/dialog/CountryDialog.vue';
import ConfirmDialog from '~/components/dialog/ConfirmDialog.vue';
import AgreeDialog from '~/components/dialog/AgreeDialog.vue';
import PageLoadingBar from '~/components/bar/PageLoadingBar.vue';
import ImportWatcher from '~/components/ImportWatcher.vue';
import BugReportDialog from '~/components/dialog/BugReportDialog.vue';
import ProfessionalTourDialog from '~/components/dialog/ProfessionalTourDialog.vue';
import GuideMap from '~/components/GuideMap.vue';
import WelcomeOverlay from '~/components/overlay/WelcomeOverlay.vue';
import MessageQueue from '~/components/bar/MessageQueue.vue';
import HubspotChat from '~/components/chat/HubspotChat.vue';
import { ICognitoUserExt, EBoolean } from '~/types/auth/types';
import { EAuthRole } from '~/types/common/types';
import { CT_SIGN_UP_TYPE, IMPORT_ONLY } from '~/utils/constants';
import { UPDATE_ATTRIBUTES, UPDATE_GEO_LOCATION } from '~/store/auth';
import SigningErrorDialog from '~/components/dialog/SigningErrorDialog.vue';

@Component({
	components: {
		HubspotChat,
		MessageQueue,
		ProfessionalTourDialog,
		ProductAppDrawer,
		ProductAppContent,
		ProductAppHeader,
		ProfessionalAppHeader,
		CountryDialog,
		ConfirmDialog,
		AgreeDialog,
		PageLoadingBar,
		ImportWatcher,
		BugReportDialog,
		GuideMap,
		WelcomeOverlay,
		SigningErrorDialog,
	},
})
export default class Product extends Vue {
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;
	countryDialog: boolean = true;
	tourDialog: boolean = true;
	agreeDialog: boolean = true;
	IMPORT_ONLY = IMPORT_ONLY;

	@Getter('auth/thereIsCountry') thereIsCountry!: boolean;
	@Getter('auth/missingAgreementInfo') missingAgreementInfo!: boolean;
	@Getter('auth/isAccountant') isAccountant!: boolean;

	get runAgree(): boolean {
		return this.missingAgreementInfo;
	}

	get runCountrySelector(): boolean {
		return !this.missingAgreementInfo && !this.thereIsCountry;
	}

	get runTour(): boolean {
		const isThisTargetPage: boolean = this.isAccountant
			? this.$route.path.includes('/accountant/manage-clients')
			: true;
		return isThisTargetPage && !this.tourIsDone && this.thereIsCountry;
	}

	get tourIsDone(): boolean {
		const attributes = this.user?.attributes;
		// @ts-ignore
		return attributes && attributes['custom:tour'] && attributes['custom:tour'] === EBoolean.TRUE;
	}

	closeTourDialog() {
		this.tourDialog = false;
	}

	closeCountryDialog() {
		this.countryDialog = false;
	}

	closeAgreeDialog() {
		this.agreeDialog = false;
	}

	mounted() {
		this.$store.dispatch(`auth/${UPDATE_GEO_LOCATION}`);
		const accountantAttr = this.user && this.user?.attributes['custom:is_accountant'];

		if (accountantAttr === undefined || accountantAttr === null) {
			let attributes = { 'custom:is_accountant': EBoolean.FALSE };
			const res = this.$cookies.get(CT_SIGN_UP_TYPE);
			if (res && res === EAuthRole.PROFESSIONAL) {
				attributes = { 'custom:is_accountant': EBoolean.TRUE };
			}
			this.$store.dispatch(`auth/${UPDATE_ATTRIBUTES}`, attributes);
		}

		this.$cookies.remove(CT_SIGN_UP_TYPE);
	}
}
</script>

<style lang="scss">
* {
	letter-spacing: 0.25px;
}
</style>
