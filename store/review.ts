import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { AxiosResponse } from 'axios';
import { ADD_TO_MESSAGE_QUEUE, RootState } from '.';
import { IUserAssetMap } from '~/types/asset/types';
import {
	IManualCategorize,
	IMatchCandidate,
	IMissingTransactionPlatform,
	IMissingTransactionSource,
	IMissingAsset,
	IReviewApiParams,
	IMissingDate,
	IMissingTransactionRes,
} from '~/types/review/types';
import { IUserTransactionRecordSource } from '~/types/provider/types';
import { ILoadAssetInProviderDTO, ILoadClassifyTransfersRes, ILoadMissingTransactionDTO } from '~/types/review/dto';
import { IJobCondition } from '~/types/common/dto';
import { makeSourceToPlatform } from '~/utils/provider';

// overview
export const AUTO_FIX = 'AUTO_FIX';
export const MATCH_CURRENCY = 'MATCH_CURRENCY';
export const UNDO_MATCH_CURRENCY = 'UNDO_MATCH_CURRENCY';
export const IGNORING_MATCH = 'IGNORING_MATCH';
export const UN_IGNORING_MATCH = 'UN_IGNORING_MATCH';
export const LOAD_MATCHED_DATA = 'LOAD_MATCHED_DATA';
export const LOAD_UNMATCHED_DATA = 'LOAD_UNMATCHED_DATA';
export const LOAD_IGNORED_MATCHING_DATA = 'LOAD_IGNORED_MATCHING_DATA';
export const AUTO_FIX_PROGRESS = 'AUTO_FIX_PROGRESS';
export const AUTO_FIX_AVAILABLE = 'AUTO_FIX_AVAILABLE';
export const LOAD_ASSETS_IN_PROVIDER = 'LOAD_ASSETS_IN_PROVIDER';

// Manual review step3
export const STEP3_COUNT = 'STEP3_COUNT';
export const LOAD_UNCLASSFIED_TRANSFERS = 'LOAD_UNCLASSFIED_TRANSFERS';
export const LOAD_CLASSFIED_TRANSFERS = 'LOAD_CLASSFIED_TRANSFERS';
export const UNDO_CATEGORIZE = 'UNDO_CATEGORIZE';

// Manual review step2
export const LOAD_MISSING_PLATFORMS = 'LOAD_MISSING_PLATFORMS';
export const GET_MISSING_DATE = 'GET_MISSING_DATE';
export const GET_MISSING_TRANSACITONS = 'GET_MISSING_TRANSACITONS';

// Manual review step1
export const STEP1_COUNT = 'STEP1_COUNT';
export const LOAD_UNMATCHED_INTERNALS = 'LOAD_UNMATCHED_INTERNALS';
export const LOAD_MATCHED_INTERNALS = 'LOAD_MATCHED_INTERNALS';
export const LOAD_IGNORED_INTERNALS = 'LOAD_IGNORED_INTERNALS';
export const MATCH_INTERNAL = 'MATCH_INTERNAL';
export const UNDO_MATCH_INTERNAL = 'UNDO_MATCH_INTERNAL';
export const EXCLUDE_MATCH_INTERNAL = 'EXCLUDE_MATCH_INTERNAL';
export const AUTO_MATCH = 'AUTO_MATCH';

export const CALL_INITIAL_AUTO_FIXING = 'CALL_INITIAL_AUTO_FIXING';

export const REVIEW_PER_PAGE = 10;

export const state = () => ({
	missingPlatforms: [] as IMissingTransactionPlatform[],
	step1ErrorsCount: 0 as number,
	step1FinesCount: 0 as number,
	step1ExcludedCount: 0 as number,
	step3ErrorsCount: 0 as number,
	step3FinesCount: 0 as number,
});

export type ReviewState = ReturnType<typeof state>;

export const getters: GetterTree<ReviewState, RootState> = {};

export const mutations: MutationTree<ReviewState> = {
	[STEP1_COUNT]: (state, payload: number[]) => {
		state.step1ErrorsCount = payload[0] || 0;
		state.step1FinesCount = payload[1] || 0;
		state.step1ExcludedCount = payload[2] || 0;
	},
	[STEP3_COUNT]: (state, payload: number[]) => {
		state.step3ErrorsCount = payload[0] || 0;
		state.step3FinesCount = payload[1] || 0;
	},
	[LOAD_MISSING_PLATFORMS]: (state, payload: IMissingTransactionPlatform[]) => {
		state.missingPlatforms = payload;
	},
};

export const actions: ActionTree<ReviewState, RootState> = {
	async [CALL_INITIAL_AUTO_FIXING](): Promise<boolean> {
		try {
			await this.$axios({
				method: 'POST',
				url: '/services/ct/api/transaction-review/init',
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [AUTO_FIX_AVAILABLE](_, username: string): Promise<boolean | null> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/transaction-review/auto-fix/available/login/${username}`,
			});
			return res.data;
		} catch (error) {
			console.error(error);
			return null;
		}
	},
	async [AUTO_FIX_PROGRESS](_, username: string): Promise<IJobCondition | null | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/transaction-review/auto-fix/status/login/${username}`,
			});

			return res.data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				return null;
			} else {
				console.error(error);
				return false;
			}
		}
	},
	async [AUTO_FIX](_, username): Promise<boolean> {
		try {
			await this.$axios({
				method: 'GET',
				url: `/services/ct/api/transaction-review/auto-fix/login/${username}`,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [STEP1_COUNT]({ commit }) {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/transaction-review/match/counts',
			});
			commit(STEP1_COUNT, res.data);
		} catch (error) {
			console.error(error);
		}
	},
	async [STEP3_COUNT]({ commit }) {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/transaction-review/uncategorized/counts',
			});
			commit(STEP3_COUNT, res.data);
		} catch (error) {
			console.error(error);
		}
	},

	async [MATCH_INTERNAL](_, payload: IMatchCandidate[]): Promise<boolean> {
		try {
			await this.$axios({
				method: 'POST',
				url: '/services/ct/api/transaction-review/match/manual',
				data: payload,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [UNDO_MATCH_INTERNAL](_, payload: IMatchCandidate[]): Promise<boolean> {
		try {
			await this.$axios({
				method: 'POST',
				url: '/services/ct/api/transaction-review/match/undo',
				data: payload,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [EXCLUDE_MATCH_INTERNAL](_, payload: IMatchCandidate[]): Promise<boolean> {
		try {
			await this.$axios({
				method: 'POST',
				url: '/services/ct/api/transaction-review/match/ignored',
				data: payload,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [AUTO_MATCH](): Promise<boolean> {
		try {
			const res = await this.$axios({
				method: 'POST',
				url: '/services/ct/api/transaction-review/automatch',
			});
			console.log(res.data);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},

	// overview page
	async [MATCH_CURRENCY](_, payload: IUserAssetMap): Promise<IUserAssetMap[] | boolean> {
		try {
			const res = await this.$axios({
				method: 'PUT',
				url: '/services/ct/api/user-asset-maps/bulk',
				data: [payload],
			});
			return res.data;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [UNDO_MATCH_CURRENCY](_, payload: IUserAssetMap): Promise<boolean> {
		try {
			await this.$axios({
				method: 'PUT',
				url: '/services/ct/api/user-asset-maps/undo/bulk',
				data: [payload],
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [IGNORING_MATCH](_, payload: IUserAssetMap) {
		try {
			await this.$axios({
				method: 'PUT',
				url: `/services/ct/api/user-asset-maps/ignore/bulk/true`,
				params: {
					isIgnored: true,
				},
				data: [payload],
			});

			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [UN_IGNORING_MATCH](_, payload: IUserAssetMap) {
		try {
			await this.$axios({
				method: 'PUT',
				url: `/services/ct/api/user-asset-maps/ignore/bulk/false`,
				params: {
					isIgnored: false,
				},
				data: [payload],
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_UNMATCHED_DATA](_, username: string): Promise<IUserAssetMap[] | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/user-asset-maps/unmatched/user/login/${username}`,
				params: { size: 9999 },
			});

			return res.data.map((v: any, idx: number) => ({
				...v,
				id: `${new Date().valueOf()}-${idx}-unmatched`,
				tempMappedSymbol: '',
			}));
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_MATCHED_DATA](_, username: string): Promise<IUserAssetMap[] | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/user-asset-maps/matched/user/login/${username}`,
				params: { size: 9999 },
			});

			return res.data.map((v: any) => ({
				...v,
				tempMappedSymbol: '',
			}));
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_IGNORED_MATCHING_DATA](_, username: string): Promise<IUserAssetMap[] | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/user-asset-maps/ignored/user/login/${username}`,
				params: { size: 9999 },
			});

			return res.data.map((v: any) => ({
				...v,
				tempMappedSymbol: '',
			}));
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_ASSETS_IN_PROVIDER](
		_,
		{ providerId, size, page, sort }: ILoadAssetInProviderDTO,
	): Promise<AxiosResponse | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/tax-review/recent_assets/provider/${providerId}`,
				params: { page, size, sort },
			});
			// @ts-ignore
			return res;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	// Manual review step3
	async [LOAD_UNCLASSFIED_TRANSFERS](_, params: IReviewApiParams): Promise<ILoadClassifyTransfersRes | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/transaction-records/user/current/uncategorized',
				params: { ...params, size: REVIEW_PER_PAGE },
			});

			return res.data;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_CLASSFIED_TRANSFERS](_, params: IReviewApiParams): Promise<AxiosResponse | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/manual-categorizes/user/current',
				params: { ...params, size: REVIEW_PER_PAGE },
			});
			// @ts-ignore
			return res;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [UNDO_CATEGORIZE]({ dispatch }, payload: IManualCategorize[]): Promise<boolean> {
		try {
			await this.$axios({
				method: 'POST',
				url: '/services/ct/api/manual-categorizes/undo/bulk',
				data: payload.map(v => v.id),
			});
			return true;
		} catch (error) {
			console.error(error);
			dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$i18n.t('message.fail.undo') }, { root: true });
			return false;
		}
	},
	// Manual review step2
	async [GET_MISSING_TRANSACITONS](_, params: ILoadMissingTransactionDTO): Promise<IMissingTransactionRes[] | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/tax-review/negative_transactions',
				params,
			});
			return res.data;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [GET_MISSING_DATE](_, sourceIds: number[]): Promise<IMissingDate | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/transaction-review/minmaxdate',
				params: { sourceIds: sourceIds.join(',') },
			});
			return res.data;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_MISSING_PLATFORMS]({ commit, rootState }): Promise<IMissingTransactionPlatform[] | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/tax-review/negative_count',
			});

			const tempMissingAssets: IMissingAsset[] = res.data || [];
			const sourceIdArr = [...new Set(tempMissingAssets.map(v => v.source_id))];
			const missingAssets: IMissingAsset[] = [];

			tempMissingAssets.forEach(v => {
				const foundIndex = missingAssets.findIndex(t => t.out_asset === v.out_asset && t.source_id === v.source_id);
				if (foundIndex === -1) {
					missingAssets.push(v);
				} else {
					missingAssets[foundIndex].count += v.count;
					missingAssets[foundIndex].missing_quantity += v.missing_quantity;
				}
			});

			// @ts-ignore
			const providerSources: IUserTransactionRecordSource[] = rootState?.provider?.providerSources || [];
			const filteredSources = providerSources.filter(providerSource => sourceIdArr.includes(providerSource?.id || 0));
			const missingTransactionSources: IMissingTransactionSource[] = filteredSources.map(source => {
				const missingInfos = missingAssets
					.filter(v => v.source_id === source.id)
					.sort((a, b) => (a.out_asset > b.out_asset ? 1 : -1));
				return { ...source, missingInfos };
			});
			const platforms: IMissingTransactionPlatform[] = makeSourceToPlatform<
				IMissingTransactionSource,
				IMissingTransactionPlatform
			>(missingTransactionSources).sort((a, b) => ((a?.name || '') > (b?.name || '') ? 1 : -1));
			commit(LOAD_MISSING_PLATFORMS, platforms);
			return platforms;
		} catch (error) {
			console.error(error);
			return false;
		}
	},

	// Manual review step1
	async [LOAD_UNMATCHED_INTERNALS](_, params: IReviewApiParams): Promise<AxiosResponse | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/transaction-review/matches',
				params: { ...params, size: REVIEW_PER_PAGE, type: '' },
			});

			// @ts-ignore
			return res;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_MATCHED_INTERNALS](_, params: IReviewApiParams): Promise<AxiosResponse | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/transaction-review/matches',
				params: { ...params, size: REVIEW_PER_PAGE, type: 'manual' },
			});

			// @ts-ignore
			return res;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_IGNORED_INTERNALS](_, params: IReviewApiParams): Promise<AxiosResponse | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/transaction-review/matches',
				params: { ...params, size: REVIEW_PER_PAGE, type: 'ignored' },
			});

			// @ts-ignore
			return res;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
};
