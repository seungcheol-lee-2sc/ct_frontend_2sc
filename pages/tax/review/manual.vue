<template>
	<div>
		<ProductTitleSection>
			<template slot="title">
				<span class="topTitle">
					<Button color="primary" head-icon="mdi-chevron-left" :fontsize="36" :icon="true" @click="onClickBack" />
					Manual Review
				</span>
			</template>
			<template slot="desc"> Increase the accuracy of your tax report in 3 steps. </template>
		</ProductTitleSection>

		<div class="reviewCardsWrapper">
			<ManualFixCard :loading="step1Loading" :done-count="step1Done" :total-count="step1Total" @onFix="onClickFix(1)">
				<div>STEP 1</div>
				Match Internals
			</ManualFixCard>
			<ManualFixCard
				:loading="step2Loading"
				:done-count="0"
				:total-count="missingPlatforms.length"
				@onFix="onClickFix(2)"
			>
				<div>STEP 2</div>
				Add Missing Transactions
			</ManualFixCard>
			<ManualFixCard
				:loading="step3Loading"
				:done-count="step3FinesCount"
				:total-count="step3Total"
				@onFix="onClickFix(3)"
			>
				<div>STEP 3</div>
				Classify Transfers
			</ManualFixCard>
		</div>

		<div class="stepButtonsWrapper">
			<StepMoveButton :next-step="false" @click="$router.push('/tax/overview')" />
			<StepMoveButton :next-step="true" @click="$router.push('/tax/report')" />
		</div>

		<ManualReviewDialog
			v-if="step1Dialog"
			title="Match Internals"
			:desc="desc1"
			href=""
			link=""
			:dialog="step1Dialog"
			@close="closeDialog(1)"
		>
			<MatchInternalTable @refresh="refresh" />
		</ManualReviewDialog>
		<ManualReviewDialog
			v-if="step2Dialog"
			:scrollable="true"
			title="Add Missing Transactions"
			:desc="desc2"
			href=""
			link=""
			:dialog="step2Dialog"
			@close="closeDialog(2)"
		>
			<MissingTransactionTable :platforms="missingPlatforms" @refresh="refresh" />
		</ManualReviewDialog>
		<ManualReviewDialog
			v-if="step3Dialog"
			title="Classify Transfers"
			desc="For an accurate tax report, please specify your uncategorized data."
			href=""
			link=""
			:dialog="step3Dialog"
			@close="closeDialog(3)"
		>
			<ClassifyTable @refresh="refresh" />
		</ManualReviewDialog>
	</div>
</template>

<script lang="ts">
import { Component, State } from 'nuxt-property-decorator';
import { debounce } from 'lodash';
import Button from '~/components/button/Button.vue';
import StepMoveButton from '~/components/button/StepMoveButton.vue';
import LottieLoader from '~/components/LottieLoader.vue';
import ManualReviewDefault from '~/components/mixins/ManualReviewDefault.vue';
import ManualFixCard from '~/components/pages/review/ManualFixCard.vue';
import ProductTitleSection from '~/components/section/ProductTitleSection.vue';
import { CALL_INITIAL_AUTO_FIXING, LOAD_MISSING_PLATFORMS, STEP1_COUNT, STEP3_COUNT } from '~/store/review';
import { EAuthRole } from '~/types/common/types';
import ManualReviewDialog from '~/components/pages/review/ManualReviewDialog.vue';
import ClassifyTable from '~/components/pages/review/ClassifyTable.vue';
import { LOAD_ALL_TYPES } from '~/store/transaction';
import { IMissingTransactionPlatform } from '~/types/review/types';
import { LOAD_COINS, LOAD_DISABLED_COINS, LOAD_DISABLED_FIATS, LOAD_FIATS } from '~/store/asset';
import MissingTransactionTable from '~/components/pages/review/MissingTransactionTable.vue';
import MatchInternalTable from '~/components/pages/review/MatchInternalTable.vue';

@Component({
	layout: 'product',
	components: {
		Button,
		ProductTitleSection,
		StepMoveButton,
		LottieLoader,
		ManualFixCard,
		ManualReviewDialog,
		ClassifyTable,
		MissingTransactionTable,
		MatchInternalTable,
	},
	meta: { auth: true, roles: [EAuthRole.INDIVIDUAL] },
	middleware: 'loadSources',
	asyncData: async ({ store }) => {
		await Promise.all([
			store.dispatch(`asset/${LOAD_COINS}`),
			store.dispatch(`asset/${LOAD_DISABLED_COINS}`),
			store.dispatch(`asset/${LOAD_FIATS}`),
			store.dispatch(`asset/${LOAD_DISABLED_FIATS}`),
			store.dispatch(`transaction/${LOAD_ALL_TYPES}`),
			store.dispatch(`review/${CALL_INITIAL_AUTO_FIXING}`),
		]);
	},
})
export default class Manual extends ManualReviewDefault {
	@State(({ review }) => review.step1ErrorsCount) step1ErrorsCount!: number;
	@State(({ review }) => review.step1FinesCount) step1FinesCount!: number;
	@State(({ review }) => review.step1ExcludedCount) step1ExcludedCount!: number;
	@State(({ review }) => review.missingPlatforms) missingPlatforms!: IMissingTransactionPlatform[];
	@State(({ review }) => review.step3ErrorsCount) step3ErrorsCount!: number;
	@State(({ review }) => review.step3FinesCount) step3FinesCount!: number;

	renderingKey: number = 0;
	step1Dialog: boolean = false;
	step2Dialog: boolean = false;
	step3Dialog: boolean = false;
	step1Loading: boolean = true;
	step2Loading: boolean = true;
	step3Loading: boolean = true;
	desc1: string =
		'Internal transfer is a transaction between your wallets or exchanges. <br />Match them internally to avoid overpaying on taxes.';

	desc2: string =
		'Are there any transactions that weren’t imported? We’re missing info on how you gained some of your holdings.<br />This could cause negative balances due to withdrawing more than what you acquired.';

	get step1Done(): number {
		return this.step1FinesCount + this.step1ExcludedCount;
	}

	get step1Total(): number {
		return this.step1Done + this.step1ErrorsCount;
	}

	get step3Total(): number {
		return this.step3FinesCount + this.step3ErrorsCount;
	}

	refresh = debounce(() => {
		this.$store.dispatch(`review/${STEP1_COUNT}`);
		this.$store.dispatch(`review/${STEP3_COUNT}`);
		this.$store.dispatch(`review/${LOAD_MISSING_PLATFORMS}`);
	}, 500);

	onClickFix(step: number) {
		if (step === 1) {
			this.step1Dialog = true;
		} else if (step === 2) {
			this.step2Dialog = true;
		} else if (step === 3) {
			this.step3Dialog = true;
		}
	}

	closeDialog(step: number) {
		if (step === 1) {
			this.step1Dialog = false;
		} else if (step === 2) {
			this.step2Dialog = false;
		} else if (step === 3) {
			this.step3Dialog = false;
		}
		this.refresh();
	}

	onClickBack() {
		this.$router.push('/tax/review');
	}

	async loadStep1Count() {
		this.step1Loading = true;
		await this.$store.dispatch(`review/${STEP1_COUNT}`);
		this.step1Loading = false;
	}

	async loadStep2Count() {
		this.step2Loading = true;
		await this.$store.dispatch(`review/${LOAD_MISSING_PLATFORMS}`);
		this.step2Loading = false;
	}

	async loadStep3Count() {
		this.step3Loading = true;
		await this.$store.dispatch(`review/${STEP3_COUNT}`);
		this.step3Loading = false;
	}

	fetchOnServer() {
		return false;
	}

	fetch() {
		this.loadStep1Count();
		this.loadStep2Count();
		this.loadStep3Count();
	}
}
</script>

<style lang="scss" scoped>
.topTitle {
	margin-left: -50px;
	display: flex;
}
.reviewCardsWrapper {
	padding-top: 52px;
	padding-bottom: 30px;
	display: grid;
	gap: 24px;
	@media (min-width: #{$breakpoint-xl}) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}
</style>
