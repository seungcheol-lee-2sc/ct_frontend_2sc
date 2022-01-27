<template>
	<div>
		<v-data-table
			class="productTable"
			item-key="id"
			:items="unknownCurrencyDatas"
			:headers="headers"
			hide-default-footer
			:items-per-page="5"
			:page="page + 1"
			:loading="loading || actionLoading"
			loading-text="Loading..."
		>
			<template #[`item.mappedAssetSymbol`]="{ item }">
				<template v-if="item.mappedAssetSymbol">
					<span class="mappedText">
						{{ item.mappedAssetSymbol }}
						<v-icon color="secondary" small>mdi-checkbox-marked-circle-outline</v-icon>
					</span>
				</template>
				<template v-else-if="item.isIgnored">
					<span class="mappedText -ignore">
						Ignored
						<v-icon color="disabled" small>mdi-close-circle-outline</v-icon>
					</span>
				</template>
				<div v-else :style="item.mappedAssetSymbol === MANUAL_ASSET ? { maxWidth: '540px' } : { maxWidth: '270px' }">
					<AssetSelector
						v-model="item.tempMappedSymbol"
						:label="$t('page.review.review1.assetSelectorPlaceholder')"
						@onchange="symbol => onChangeSymbol(item, symbol)"
					/>
					<!-- <v-text-field
					v-if="item.tempMappedSymbol === MANUAL_ASSET"
					v-model="item.tempMappedSymbol"
					placeholder="ex)BTC"
					outlined
					hide-details
					:disabled="false"
					@keypress.enter="onMatch(item)"
				/> -->
				</div>
			</template>
			<template #[`item.numTransactionsWithOriginalAsset`]="{ item }">
				{{
					item.numTransactionsWithOriginalAsset === 1
						? `${item.numTransactionsWithOriginalAsset} transaction`
						: `${item.numTransactionsWithOriginalAsset} transactions`
				}}
			</template>

			<template #[`item.actions`]="{ item }">
				<div class="buttonsWrapper">
					<template v-if="item.isIgnored">
						<Button
							:disabled="actionLoading || loading"
							color="primary"
							:text="true"
							head-icon="mdi-undo"
							@click="onUndoIgnoring(item)"
						>
							{{ $t('common.undo') }}
						</Button>
					</template>
					<template v-else-if="!item.mappedAssetSymbol">
						<Button
							:disabled="!item.tempMappedSymbol || actionLoading || loading"
							:rounded="true"
							fontcolor="white"
							color="secondary"
							:height="36"
							:fontsize="14"
							@click="onMatch(item)"
						>
							{{ $t('common.match') }}
						</Button>
						<Button
							:disabled="actionLoading || loading"
							:rounded="true"
							:outlined="true"
							fontcolor="primary"
							color="outline"
							:height="36"
							:fontsize="14"
							@click="onIgnore(item)"
						>
							{{ $t('common.ignore') }}
						</Button>
					</template>

					<template v-else>
						<Button
							head-icon="mdi-undo"
							:disabled="actionLoading || loading"
							:text="true"
							color="primary"
							@click="onUndoMatching(item)"
						>
							{{ $t('common.undo') }}
						</Button>
					</template>
				</div>
			</template>

			<template #footer>
				<div class="paginationWrapper">
					<ArrowPagination
						v-if="pageLength !== 1"
						:page="page"
						:page-length="pageLength"
						@next="page += 1"
						@prev="page -= 1"
					>
						<span class="paginationText"> {{ page + 1 }} / {{ pageLength }} </span>
					</ArrowPagination>
				</div>
			</template>
		</v-data-table>
	</div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator';
import AssetSelector, { MANUAL_ASSET } from '../select/AssetSelector.vue';
import ArrowPagination from '../pagination/ArrowPagination.vue';
import Button from '../button/Button.vue';
import { IUserAssetMap } from '~/types/asset/types';
import { pageLength } from '~/utils/application';
import {
	IGNORING_MATCH,
	LOAD_IGNORED_MATCHING_DATA,
	LOAD_MATCHED_DATA,
	LOAD_UNMATCHED_DATA,
	MATCH_CURRENCY,
	UNDO_MATCH_CURRENCY,
	UN_IGNORING_MATCH,
} from '~/store/review';
import { ICognitoUserExt } from '~/types/auth/types';
import { ADD_TO_MESSAGE_QUEUE, CONFIRM_ERROR } from '~/store';

export enum EUnknownCurrencyStatus {
	CLOSE = 'CLOSE',
	WIDE_OPEN = 'WIDE_OPEN',
	OPEN = 'OPEN',
	ERROR = 'ERROR',
}

@Component({
	components: {
		AssetSelector,
		ArrowPagination,
		Button,
	},
})
export default class UnknownCurrenciesTable extends Vue {
	@State(({ auth }) => auth.user) user!: ICognitoUserExt | null;
	@State(({ asset }) => asset.loadingEnabledFiats) loadingEnabledFiats!: boolean;
	@State(({ asset }) => asset.loadingDisabledFiats) loadingDisabledFiats!: boolean;
	@State(({ asset }) => asset.loadingEnabledCoins) loadingEnabledCoins!: boolean;
	@State(({ asset }) => asset.loadingDisabledCoins) loadingDisabledCoins!: boolean;

	matchedDatas: IUserAssetMap[] = [];
	unmatchedDatas: IUserAssetMap[] = [];
	ignoredDatas: IUserAssetMap[] = [];
	MANUAL_ASSET = MANUAL_ASSET;
	headers: any[] = [
		{ text: 'Exchange', value: 'provider.name', align: 'center', sortable: false },
		{ text: 'Unknown currency', value: 'originalAssetSymbol', align: 'center', sortable: false },
		{ text: 'Matching currency', value: 'mappedAssetSymbol', align: 'center', sortable: false },
		{ text: 'Total transactions', value: 'numTransactionsWithOriginalAsset', align: 'center', sortable: false },
		{ text: 'Action', value: 'actions', align: 'center', sortable: false },
	];

	page: number = 0;
	perPage: number = 5;
	actionLoading: boolean = false;
	loading: boolean = true;

	get loadingAssets(): boolean {
		return (
			this.loadingEnabledFiats || this.loadingDisabledFiats || this.loadingEnabledCoins || this.loadingDisabledCoins
		);
	}

	get username(): string {
		return this.user?.username || '';
	}

	get unknownExisted(): boolean {
		return Boolean(this.unmatchedDatas.length + this.matchedDatas.length + this.ignoredDatas.length > 0);
	}

	get noUnknownError(): boolean {
		return this.unmatchedDatas.length === 0;
	}

	get unknownCurrencyDatas(): IUserAssetMap[] {
		return this.unmatchedDatas.concat(this.matchedDatas).concat(this.ignoredDatas);
	}

	get pageLength(): number {
		return pageLength(this.unknownCurrencyDatas.length, this.perPage);
	}

	onChangeSymbol(item: IUserAssetMap, symbol: string) {
		let foundIndex = this.unmatchedDatas.findIndex(v => v.id === item.id);
		if (foundIndex !== -1) {
			this.unmatchedDatas[foundIndex].tempMappedSymbol = symbol;
			return;
		}
		foundIndex = this.matchedDatas.findIndex(v => v.id === item.id);
		if (foundIndex !== -1) {
			this.matchedDatas[foundIndex].tempMappedSymbol = symbol;
			return;
		}
		foundIndex = this.ignoredDatas.findIndex(v => v.id === item.id);
		if (foundIndex !== -1) {
			this.ignoredDatas[foundIndex].tempMappedSymbol = symbol;
		}
	}

	async loadUnmatched() {
		this.unmatchedDatas = await this.$store.dispatch(`review/${LOAD_UNMATCHED_DATA}`, this.username);
		return this.unmatchedDatas || false;
	}

	async loadMatched() {
		this.matchedDatas = await this.$store.dispatch(`review/${LOAD_MATCHED_DATA}`, this.username);
		return this.matchedDatas || false;
	}

	async loadIgnored() {
		this.ignoredDatas = await this.$store.dispatch(`review/${LOAD_IGNORED_MATCHING_DATA}`, this.username);
		return this.ignoredDatas || false;
	}

	async onIgnore(userAssetMap: IUserAssetMap) {
		this.actionLoading = true;

		const res: boolean = await this.$store.dispatch(`review/${IGNORING_MATCH}`, {
			...userAssetMap,
			id: null,
		});

		if (res) {
			// this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
			// 	msg: 'Matched successful',
			// 	color: 'primary',
			// 	actionText: this.$t('common.undo'),
			// 	action: () => this.onUndoMatching(res[0]),
			// });
		} else {
			this.$store.commit(CONFIRM_ERROR, { title: this.$t('common.error'), text: 'Please try again' });
		}

		this.$emit('refresh');
		await this.loadUnmatched();
		await this.loadIgnored();
		this.actionLoading = false;
	}

	async onUndoIgnoring(userAssetMap: IUserAssetMap) {
		this.actionLoading = true;

		const res: boolean = await this.$store.dispatch(`review/${UN_IGNORING_MATCH}`, {
			...userAssetMap,
			tempMappedSymbol: null,
		});
		if (res) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { msg: 'Undo successful', color: 'successDark' });
		} else {
			this.$store.commit(CONFIRM_ERROR, { title: this.$t('common.error'), text: 'Please try again' });
		}

		this.$emit('refresh');
		await this.loadUnmatched();
		await this.loadIgnored();
		this.actionLoading = false;
	}

	async onMatch(userAssetMap: IUserAssetMap) {
		this.actionLoading = true;

		const data: IUserAssetMap = {
			...userAssetMap,
			mappedAssetSymbol: userAssetMap.tempMappedSymbol,
			id: null,
		};

		const res: IUserAssetMap[] | false = await this.$store.dispatch(`review/${MATCH_CURRENCY}`, data);

		if (res) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				msg: 'Matched successful',
				color: 'primary',
				actionText: this.$t('common.undo'),
				action: () => this.onUndoMatching(res[0]),
			});
		} else {
			this.$store.commit(CONFIRM_ERROR, { title: this.$t('common.error'), text: 'Please try again' });
		}

		this.$emit('refresh');
		await this.loadUnmatched();
		await this.loadMatched();
		this.actionLoading = false;
	}

	async onUndoMatching(userAssetMap: IUserAssetMap) {
		this.actionLoading = true;

		const data: IUserAssetMap = {
			...userAssetMap,
			tempMappedSymbol: null,
		};

		const res: boolean = await this.$store.dispatch(`review/${UNDO_MATCH_CURRENCY}`, data);
		if (res) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { msg: 'Undo successful', color: 'successDark' });
		} else {
			this.$store.commit(CONFIRM_ERROR, { title: this.$t('common.error'), text: 'Please try again' });
		}

		this.$emit('refresh');
		await this.loadUnmatched();
		await this.loadMatched();
		this.actionLoading = false;
	}

	async mounted() {
		this.loading = true;
		const res: (IUserAssetMap[] | false)[] = await Promise.all([
			this.loadUnmatched(),
			this.loadMatched(),
			this.loadIgnored(),
		]);
		this.loading = false;
		if (res.includes(false)) {
			this.$emit('status', EUnknownCurrencyStatus.ERROR);
		} else if (res[0] && res[1] && res[2] && [...res[0], ...res[1], ...res[2]].length === 0) {
			this.$emit('status', EUnknownCurrencyStatus.ERROR);
		} else if (res[0] && res[0].length > 0) {
			this.$emit('status', EUnknownCurrencyStatus.WIDE_OPEN);
		} else {
			this.$emit('status', EUnknownCurrencyStatus.OPEN);
		}
	}
}
</script>

<style lang="scss" scoped>
.currencySelector {
	display: flex;
	gap: 8px;
	margin: 0 auto;
}

.paginationWrapper {
	display: flex;
	gap: 4px;
	align-items: center;
	justify-content: center;

	.paginationText {
		font-family: $poppins;
	}
}

.mappedText {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;

	&.-ignored {
		color: $disabled;
	}
}
</style>
