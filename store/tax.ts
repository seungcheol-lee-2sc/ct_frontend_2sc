import { GetterTree, ActionTree, MutationTree } from 'vuex';
import FileSaver from 'file-saver';
import { ADD_TO_MESSAGE_QUEUE, RootState } from '.';
import { ESortOrder } from '~/types/common/types';
import {
	EAssetDataSortTarget,
	EReportType,
	IAssetGraphParams,
	IAssetGraphResponse,
	IBillboardParams,
	IBillboardResponse,
	ILineGraphParams,
	ILineGraphResponse,
	ITaxReportRequest,
	ITotalAssetSortDTO,
	IYearSummaryParams,
	IYearSummaryResponse,
} from '~/types/tax/types';
import { IJobCondition } from '~/types/common/dto';
import { EJobStatus } from '~/types/provider/types';

export const CHECK_GAIN = 'CHECK_GAIN';
export const GET_METHOD = 'GET_METHOD';
export const SET_METHOD = 'SET_METHOD';
export const UPDATE_METHOD = 'UPDATE_METHOD';
export const TAX_REPORT = 'TAX_REPORT';
export const TAX_REPORT_PUBLIC = 'TAX_REPORT_PUBLIC';
export const SET_TAX_YEAR = 'SET_TAX_YEAR';
export const SET_YEAR_SUMMARY = 'SET_YEAR_SUMMARY';
export const TRANSACTIONS_LOADING_START = 'TRANSACTIONS_LOADING_START';
export const TRANSACTIONS_LOADING_END = 'TRANSACTIONS_LOADING_END';
export const LOAD_LINE_GRAPH_DATA = 'LOAD_LINE_GRAPH_DATA';
export const LOAD_ASSET_GRAPH_DATA = 'LOAD_ASSET_GRAPH_DATA';
export const LINE_GRAPH_LOADING_START = 'LINE_GRAPH_LOADING_START';
export const LINE_GRAPH_LOADING_END = 'LINE_GRAPH_LOADING_END';
export const SUCCESS_TO_LOAD_LINE_GRAPH = 'SUCCESS_TO_LOAD_LINE_GRAPH';
export const FAIL_TO_LOAD_LINE_GRAPH = 'FAIL_TO_LOAD_LINE_GRAPH';
export const ASSET_GRAPH_LOADING_START = 'ASSET_GRAPH_LOADING_START';
export const ASSET_GRAPH_LOADING_END = 'ASSET_GRAPH_LOADING_END';
export const SUCCESS_TO_LOAD_ASSET_GRAPH = 'SUCCESS_TO_LOAD_ASSET_GRAPH';
export const FAIL_TO_LOAD_ASSET_GRAPH = 'FAIL_TO_LOAD_ASSET_GRAPH';
export const SORTING_ASSETS_DATA = 'SORTING_ASSETS_DATA';
export const LOAD_BILLBOARD_DATA = 'LOAD_BILLBOARD_DATA';
export const BILLBOARD_DATA_LOADING_START = 'BILLBOARD_DATA_LOADING_START';
export const BILLBOARD_DATA_LOADING_END = 'BILLBOARD_DATA_LOADING_END';
export const SUCCESS_TO_LOAD_BILLBOARD_DATA = 'SUCCESS_TO_LOAD_BILLBOARD_DATA';
export const FAIL_TO_LOAD_BILLBOARD_DATA = 'FAIL_TO_LOAD_BILLBOARD_DATA';
export const LOAD_TAX_YEAR_SUMMARY = 'LOAD_TAX_YEAR_SUMMARY';
export const TAX_YEAR_SUMMARY_LOADING_START = 'TAX_YEAR_SUMMARY_LOADING_START';
export const TAX_YEAR_SUMMARY_LOADING_END = 'TAX_YEAR_SUMMARY_LOADING_END';
export const SUCCESS_TO_LOAD_TAX_YEAR_SUMMARY = 'SUCCESS_TO_LOAD_TAX_YEAR_SUMMARY';
export const FAIL_TO_LOAD_TAX_YEAR_SUMMARY = 'FAIL_TO_LOAD_TAX_YEAR_SUMMARY';
export const DELETE_ALL_TAX_CASES = 'DELETE_ALL_TAX_CASES';
export const DELETE_ALL_CATEGORIZED_ITEMS = 'DELETE_ALL_CATEGORIZED_ITEMS';

export const PRIME_YEAR = 2017;

export const state = () => ({
	taxYear: new Date().getFullYear() as number,
	currentMethod: '' as string,
	capitalGainCondition: null as IJobCondition | null,
	capitalGainStatus: null as EJobStatus | null,
	transactionLoading: false as boolean,
	lineGraphLoading: false as boolean,
	successToLoadLineGraph: false as boolean,
	assetGraphLoading: false as boolean,
	successToLoadAssetGraph: false as boolean,
	yearSummary: null as IYearSummaryResponse | null,
	yearSummaryLoading: false as boolean,
	successToLoadYearSummary: false as boolean,
	lineGraphData: [] as ILineGraphResponse[],
	assetGraphData: [] as IAssetGraphResponse[],
	billboardData: null as IBillboardResponse | null,
	totalAssetSortTarget: EAssetDataSortTarget.MARKET_VALUE as EAssetDataSortTarget,
	totalAssetSortOrder: ESortOrder.ASC as ESortOrder,
	successToLoadBillboardData: true as boolean,
	loadingBillboardData: false as boolean,
});

export type TaxState = ReturnType<typeof state>;

export const getters: GetterTree<TaxState, RootState> = {
	taxYears: (): number[] => {
		const thisYear = Number(new Date().getFullYear());
		const years: number[] = [];
		for (let y = PRIME_YEAR; y < thisYear; y++) {
			years.push(y);
		}
		return [...new Set(years)];
	},
};

export const mutations: MutationTree<TaxState> = {
	[SET_METHOD]: (state, payload: string) => {
		state.currentMethod = payload;
	},
	[CHECK_GAIN]: (state, payload: IJobCondition) => {
		state.capitalGainCondition = payload;
		state.capitalGainStatus = payload.status;
	},
	[BILLBOARD_DATA_LOADING_START]: state => {
		state.loadingBillboardData = true;
	},
	[BILLBOARD_DATA_LOADING_END]: state => {
		state.loadingBillboardData = false;
	},
	[SUCCESS_TO_LOAD_BILLBOARD_DATA]: state => {
		state.successToLoadBillboardData = true;
	},
	[FAIL_TO_LOAD_BILLBOARD_DATA]: state => {
		state.successToLoadBillboardData = false;
	},
	[LINE_GRAPH_LOADING_START]: state => {
		state.lineGraphLoading = true;
	},
	[LINE_GRAPH_LOADING_END]: state => {
		state.lineGraphLoading = false;
	},
	[SUCCESS_TO_LOAD_LINE_GRAPH]: state => {
		state.successToLoadLineGraph = true;
	},
	[FAIL_TO_LOAD_LINE_GRAPH]: state => {
		state.successToLoadLineGraph = false;
	},
	[ASSET_GRAPH_LOADING_START]: state => {
		state.assetGraphLoading = true;
	},
	[ASSET_GRAPH_LOADING_END]: state => {
		state.assetGraphLoading = false;
	},
	[SUCCESS_TO_LOAD_ASSET_GRAPH]: state => {
		state.successToLoadAssetGraph = true;
	},
	[FAIL_TO_LOAD_ASSET_GRAPH]: state => {
		state.successToLoadAssetGraph = false;
	},
	[TRANSACTIONS_LOADING_START]: state => {
		state.transactionLoading = true;
	},
	[TRANSACTIONS_LOADING_END]: state => {
		state.transactionLoading = false;
	},
	[SET_TAX_YEAR]: (state, payload: number) => {
		state.taxYear = payload;
	},
	[SET_YEAR_SUMMARY]: (state, payload: IYearSummaryResponse | null) => {
		state.yearSummary = payload;
	},
	[TAX_YEAR_SUMMARY_LOADING_START]: state => {
		state.yearSummaryLoading = true;
	},
	[TAX_YEAR_SUMMARY_LOADING_END]: state => {
		state.yearSummaryLoading = false;
	},
	[SUCCESS_TO_LOAD_TAX_YEAR_SUMMARY]: state => {
		state.successToLoadYearSummary = true;
	},
	[FAIL_TO_LOAD_TAX_YEAR_SUMMARY]: state => {
		state.successToLoadYearSummary = false;
	},
	[LOAD_LINE_GRAPH_DATA]: (state, payload: ILineGraphResponse[]) => {
		state.lineGraphData = payload;
	},
	[LOAD_ASSET_GRAPH_DATA]: (state, payload: IAssetGraphResponse[]) => {
		state.assetGraphData = payload;
	},
	[LOAD_BILLBOARD_DATA]: (state, payload: IBillboardResponse | null) => {
		state.billboardData = payload;
	},
	[SORTING_ASSETS_DATA]: (state, payload: ITotalAssetSortDTO) => {
		state.totalAssetSortOrder = payload.order;
		state.totalAssetSortTarget = payload.target;
		if (payload.target === EAssetDataSortTarget.MARKET_VALUE) {
			state.assetGraphData.sort((a, b) => {
				if (payload.order === ESortOrder.DESC) {
					return a.marketValue > b.marketValue ? 1 : -1;
				} else {
					return a.marketValue < b.marketValue ? 1 : -1;
				}
			});
		} else if (payload.target === EAssetDataSortTarget.ASSET) {
			state.assetGraphData.sort((a, b) => {
				if (payload.order === ESortOrder.DESC) {
					return a.asset > b.asset ? 1 : -1;
				} else {
					return a.asset < b.asset ? 1 : -1;
				}
			});
		} else if (payload.target === EAssetDataSortTarget.UNREALIZED_GAIN) {
			state.assetGraphData.sort((a, b) => {
				if (payload.order === ESortOrder.DESC) {
					return a.unrealizedGain > b.unrealizedGain ? 1 : -1;
				} else {
					return a.unrealizedGain < b.unrealizedGain ? 1 : -1;
				}
			});
		}
	},
};

export const actions: ActionTree<TaxState, RootState> = {
	async [CHECK_GAIN]({ commit }, loginId = null): Promise<IJobCondition | null | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/tax-review/okgain',
				data: { login: loginId },
			});
			commit(CHECK_GAIN, res.data);
			return res.data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				commit(CHECK_GAIN, null);
				return null;
			} else {
				console.error(error);
				return false;
			}
		}
	},
	async [UPDATE_METHOD]({ commit }, selectedMethod: string): Promise<boolean> {
		try {
			const res = await this.$axios({
				method: 'PUT',
				url: '/services/ct/api/tax-review/gainmethod',
				headers: {
					'Content-Type': 'application/json',
				},
				data: selectedMethod,
			});
			commit(SET_METHOD, res.data.gainMethod);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [GET_METHOD]({ commit }) {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/tax-review/gainmethod',
			});
			commit(SET_METHOD, res.data);
		} catch (error) {
			console.error(error);
		}
	},
	async [LOAD_TAX_YEAR_SUMMARY]({ commit }, params: IYearSummaryParams): Promise<IYearSummaryResponse | false> {
		commit(TAX_YEAR_SUMMARY_LOADING_START);
		commit(SUCCESS_TO_LOAD_TAX_YEAR_SUMMARY);
		commit(SET_YEAR_SUMMARY, null);
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/tax-review/yearsummary',
				params,
			});
			commit(SET_YEAR_SUMMARY, res.data);
			return res.data;
		} catch (error) {
			console.error(error);
			commit(SET_YEAR_SUMMARY, null);
			commit(FAIL_TO_LOAD_TAX_YEAR_SUMMARY);
			return false;
		} finally {
			commit(TAX_YEAR_SUMMARY_LOADING_END);
		}
	},
	async [TAX_REPORT]({ dispatch }, payload: ITaxReportRequest): Promise<boolean> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/tax-review/report/${payload.type}`,
				params: {
					taxYear: payload.taxYear,
					login: payload.loginId,
				},
				responseType: 'blob',
			});

			const file: Blob = res.data;
			const headerLine = res.headers['content-type'];
			const startFileNameIndex = headerLine.indexOf('/') + 1;
			const endFileNameIndex = headerLine.length;
			const ext =
				payload.type === EReportType.TURBO_TAX_DESKTOP
					? 'txf'
					: headerLine.substring(startFileNameIndex, endFileNameIndex);

			FileSaver.saveAs(file, `${payload.type}_${payload.taxYear}.${ext}`);
			return true;
		} catch (error) {
			console.error(error);
			dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$i18n.t('message.fail.download') }, { root: true });
			return false;
		}
	},
	async [TAX_REPORT_PUBLIC]({ dispatch }, payload: ITaxReportRequest): Promise<boolean> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/resources/report/${payload.type}`,
				params: {
					taxYear: payload.taxYear,
					inviteId: payload.inviteId,
				},
				responseType: 'blob',
			});

			console.log(res);

			const file: Blob = res.data;
			const headerLine = res.headers['content-type'];
			const startFileNameIndex = headerLine.indexOf('/') + 1;
			const endFileNameIndex = headerLine.length;
			const ext =
				payload.type === EReportType.TURBO_TAX_DESKTOP
					? 'txf'
					: headerLine.substring(startFileNameIndex, endFileNameIndex);

			FileSaver.saveAs(file, `${payload.type}_${payload.taxYear}.${ext}`);
			return true;
		} catch (error) {
			console.error(error);
			dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$i18n.t('message.fail.download') }, { root: true });
			return false;
		}
	},
	async [LOAD_LINE_GRAPH_DATA]({ commit }, params: ILineGraphParams) {
		commit(LINE_GRAPH_LOADING_START);
		commit(SUCCESS_TO_LOAD_LINE_GRAPH);
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/tax-review/value_history',
				params,
			});
			commit(LOAD_LINE_GRAPH_DATA, res.data);
		} catch (error) {
			console.error(error);
			commit(FAIL_TO_LOAD_LINE_GRAPH);
		}
		commit(LINE_GRAPH_LOADING_END);
	},
	async [LOAD_ASSET_GRAPH_DATA]({ state, commit }, params: IAssetGraphParams) {
		commit(ASSET_GRAPH_LOADING_START);
		commit(SUCCESS_TO_LOAD_ASSET_GRAPH);
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/tax-review/recent_assets',
				params,
			});
			commit(LOAD_ASSET_GRAPH_DATA, res.data);
			const sortData: ITotalAssetSortDTO = {
				target: state.totalAssetSortTarget,
				order: state.totalAssetSortOrder,
			};
			commit(SORTING_ASSETS_DATA, sortData);
		} catch (error) {
			console.error(error);
			commit(FAIL_TO_LOAD_ASSET_GRAPH);
		}
		commit(ASSET_GRAPH_LOADING_END);
	},
	async [LOAD_BILLBOARD_DATA]({ commit }, params: IBillboardParams): Promise<boolean> {
		commit(LOAD_BILLBOARD_DATA, null);
		commit(SUCCESS_TO_LOAD_BILLBOARD_DATA);
		commit(BILLBOARD_DATA_LOADING_START);

		try {
			const result = (
				await this.$axios({
					method: 'GET',
					url: '/services/ct/api/tax-review/totalvalue',
					params,
				})
			).data;
			commit(LOAD_BILLBOARD_DATA, result);
			commit(BILLBOARD_DATA_LOADING_END);
			return true;
		} catch (error) {
			console.error(error);
			commit(LOAD_BILLBOARD_DATA, null);
			commit(FAIL_TO_LOAD_BILLBOARD_DATA);
			commit(BILLBOARD_DATA_LOADING_END);
			return false;
		}
	},
	async [DELETE_ALL_TAX_CASES](_, username: string) {
		try {
			await this.$axios({
				method: 'DELETE',
				url: `/services/ct/api/tax-cases/user/login/${username}`,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [DELETE_ALL_CATEGORIZED_ITEMS](_, username: string) {
		try {
			await this.$axios({
				method: 'DELETE',
				url: `/services/ct/api//manual-categorizes/user/login/${username}`,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
};
