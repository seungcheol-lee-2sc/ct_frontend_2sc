<template>
	<div>
		<ProductTitleSection>
			<template slot="title">
				{{ $t('page.import.greeting') }}
			</template>
			<template slot="button">
				<Button
					class="tourStep1"
					color="primary"
					fontcolor="white"
					:rounded="true"
					:width="132"
					:height="52"
					:disabled="failToLoadAccounts"
					@click="openUpdateDialog"
				>
					<v-icon color="white">mdi-plus</v-icon>
					Import
				</Button>
			</template>
		</ProductTitleSection>

		<template v-if="!failToLoadAccounts && providerSources && providerSources.length > 0">
			<div style="margin: 24px 0">
				<InfoWithCharacterCard
					v-if="!IMPORT_ONLY"
					title="Import all data on your crypto transactions."
					desc="1. Add all the wallets and exchanges you've traded with. <br/>2. Just follow the guides for each exchange."
					src="/characters/laugh-1.png"
				/>
			</div>

			<div>
				<v-expansion-panels :value="openAll" flat elevation="0" style="gap: 24px" accordion readonly multiple>
					<template v-for="platform in filteredPlatforms">
						<PlatformPanel :key="platform.id" :platform="platform" />
					</template>
				</v-expansion-panels>
			</div>
		</template>

		<!-- Zero state -->
		<div v-else style="margin-top: 24px">
			<OutlinedCard v-if="!failToLoadAccounts" :bolder="true" :pad-x="16" :pad-y="24" :shadow="true">
				<img class="laughSmilingImg" src="/characters/laugh-1-big.png" />
				<img class="arrowImg" src="/lines/arrow-line-1.png" />
				<div class="zeroStateCard">
					<div class="textWrapper">
						<div class="titleText">Your first mission!</div>
						<div class="subtitleText">Import all data on your crypto transactions.</div>
						<p class="descText">
							1. Add all the wallets and exchanges you’ve traded with.
							<br />
							2. Just follow the guides for each exchange.
						</p>
					</div>
				</div>
			</OutlinedCard>
			<NoticeCard v-else src="/characters/surprised-smile-1.png">
				Woops. Fail to load accounts list. <br />
				Please, refresh this page.
			</NoticeCard>
		</div>
		<!-- /Zero state -->

		<div v-if="providerSources && providerSources.length > 0 && !IMPORT_ONLY" class="stepButtonsWrapper one">
			<StepMoveButton :next-step="true" @click="$router.push('/tax/overview')" />
		</div>
		<ImportDialog :dialog="providerDialog" @close="providerDialog = false" />
	</div>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import ImportDialog from '~/components/dialog/ImportDialog.vue';
import { LOAD_PROVIDERS, LOAD_PROVIDER_SOURCES } from '~/store/provider';
import { CT_LOGIN_IMPORT, IMPORT_ONLY } from '~/utils/constants';
import {
	EPlatformType,
	EProviderTypeFilter,
	IPlatform,
	IUserTransactionRecordSource,
	SourceType,
} from '~/types/provider/types';
import { LOAD_ALL_TYPES } from '~/store/transaction';
import { SYNC_SOURCE } from '~/store/import';
import { LOAD_COINS, LOAD_DISABLED_COINS, LOAD_DISABLED_FIATS, LOAD_FIATS } from '~/store/asset';
import StepMoveButton from '~/components/button/StepMoveButton.vue';
import ProductTitleSection from '~/components/section/ProductTitleSection.vue';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { cancelLoginImportReservation } from '~/utils/application';
import PlatformPanel from '~/components/panel/PlatformPanel.vue';
import { EAuthRole } from '~/types/common/types';
import Button from '~/components/button/Button.vue';
import InfoWithCharacterCard from '~/components/card/InfoWithCharacterCard.vue';
import OutlinedCard from '~/components/card/OutlinedCard.vue';
import NoticeCard from '~/components/card/NoticeCard.vue';

@Component({
	layout: IMPORT_ONLY ? 'empty-logged-in' : 'product',
	components: {
		Button,
		StepMoveButton,
		ImportDialog,
		ProductTitleSection,
		PlatformPanel,
		InfoWithCharacterCard,
		OutlinedCard,
		NoticeCard,
	},
	meta: { auth: true, roles: [EAuthRole.INDIVIDUAL] },
	asyncData: async ({ store }) => {
		await Promise.all([
			store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`),
			store.dispatch(`transaction/${LOAD_ALL_TYPES}`),
			store.dispatch(`provider/${LOAD_PROVIDERS}`),
			store.dispatch(`asset/${LOAD_COINS}`),
		]);
	},
})
export default class Import extends Vue {
	@State(({ provider }) => provider.providerSources) providerSources!: IUserTransactionRecordSource[];
	@State(({ provider }) => provider.platforms) platforms!: IPlatform[];
	@State(({ provider }) => provider.failToLoadAccounts) failToLoadAccounts!: boolean;

	EProviderTypeFilter = EProviderTypeFilter;
	EPlatformType = EPlatformType;
	providerDialog: boolean = false;
	IMPORT_ONLY = IMPORT_ONLY;

	get openAll(): number[] {
		return this.filteredPlatforms.map((_, idx) => idx);
	}

	get filteredPlatforms(): IPlatform[] {
		const filter = this.$store.state.provider.platformTypeFilter;
		return this.platforms.filter(v => (filter ? v.type === filter : v));
	}

	openUpdateDialog() {
		this.providerDialog = true;
	}

	autoLoginImporting() {
		const loginImportProviderId = this.$cookies.get(CT_LOGIN_IMPORT);
		if (loginImportProviderId && !isNaN(+loginImportProviderId)) {
			const foundSource: IUserTransactionRecordSource | undefined = this.providerSources.find(
				v => v.provider?.id === +loginImportProviderId && v.sourceType === SourceType.OAUTH2,
			);
			if (!foundSource) return;
			this.$store.dispatch(`import/${SYNC_SOURCE}`, foundSource);
			cancelLoginImportReservation(this.$cookies);
		}
	}

	mounted() {
		if (!('login-import' in this.$route.query)) return;

		const result = this.$route.query['login-import'];
		if (result === 'fail') {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$t('message.fail.connect') });
		} else {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'successDark',
				msg: `${this.$t('message.success.connect')} : ${result}`,
			});
		}
		this.$router.replace('/tax/import');

		this.autoLoginImporting();
	}

	fetchOnServer() {
		return false;
	}

	async fetch() {
		await Promise.all([
			this.$store.dispatch(`asset/${LOAD_DISABLED_COINS}`),
			this.$store.dispatch(`asset/${LOAD_FIATS}`),
			this.$store.dispatch(`asset/${LOAD_DISABLED_FIATS}`),
		]);
	}
}
</script>

<style lang="scss" scoped>
.laughSmilingImg {
	position: absolute;
	left: 0;
	bottom: 0;
}

.arrowImg {
	position: absolute;
	right: 80px;
	top: 10px;
}

.zeroStateCard {
	height: 450px;

	.textWrapper {
		position: absolute;
		left: 36%;
		top: 50%;
		width: 100%;
		max-width: 520px;
		transform: translateY(-50%);
		color: $primary;

		.titleText {
			line-height: 1.2;
			font-family: $poppins;
			font-weight: $font-semibold;
			font-size: 33px;
			margin-bottom: 4px;
		}

		.subtitleText {
			line-height: 1.6;
			margin-bottom: 24px;
			font-family: $poppins;
			font-size: 23px;
		}

		.descText {
			color: $primaryLight;
			font-size: 16px;
			line-height: 1.4;
		}
	}
}
</style>
