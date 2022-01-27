import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { RootState } from '.';
import { IAsset } from '~/types/asset/types';

export const LOAD_ASSETS_ACTION = 'LOAD_ASSETS_ACTION';
export const LOAD_COINS_PUBLIC = 'LOAD_COINS_PUBLIC';
export const LOADING_START = 'LOADING_START';
export const LOADING_END = 'LOADING_END';
//
export const SUCCESS_TO_LOAD_COINS = 'SUCCESS_TO_LOAD_COINS';
export const SUCCESS_TO_LOAD_FIATS = 'SUCCESS_TO_LOAD_FIATS';
export const SUCCESS_TO_LOAD_DISABLED_COINS = 'SUCCESS_TO_LOAD_DISABLED_COINS';
export const SUCCESS_TO_LOAD_DISABLED_FIATS = 'SUCCESS_TO_LOAD_DISABLED_FIATS';
export const FAIL_TO_LOAD_COINS = 'FAIL_TO_LOAD_COINS';
export const FAIL_TO_LOAD_FIATS = 'FAIL_TO_LOAD_FIATS';
export const FAIL_TO_LOAD_DISABLED_COINS = 'FAIL_TO_LOAD_DISABLED_COINS';
export const FAIL_TO_LOAD_DISABLED_FIATS = 'FAIL_TO_LOAD_DISABLED_FIATS';
//
export const LOADING_COINS = 'LOADING_COINS';
export const LOADING_FIATS = 'LOADING_FIATS';
export const LOADING_DISABLED_COINS = 'LOADING_DISABLED_COINS';
export const LOADING_DISABLED_FIATS = 'LOADING_DISABLED_FIATS';
export const LOAD_COINS = 'LOAD_COINS';
export const LOAD_FIATS = 'LOAD_FIATS';
export const LOAD_DISABLED_FIATS = 'LOAD_DISABLED_FIATS';
export const LOAD_DISABLED_COINS = 'LOAD_DISABLED_COINS';
export const INTEGRATE_ASSETS = 'INTEGRATE_ASSETS';
export const INTEGRATE_COINS = 'INTEGRATE_';
export const INTEGRATE_FIATS = 'INTEGRATE_FIATS';

export const LOAD_USED_ASSETS = 'LOAD_USED_ASSETS';

export const state = () => ({
	publicCoins: [] as IAsset[],
	loading: false as boolean,
	//
	successToLoadEnabledFiats: false as boolean,
	successToLoadEnabledCoins: false as boolean,
	successToLoadDisabledFiats: false as boolean,
	successToLoadDisabledCoins: false as boolean,
	failToLoadEnabledFiats: false as boolean,
	failToLoadEnabledCoins: false as boolean,
	failToLoadDisabledFiats: false as boolean,
	failToLoadDisabledCoins: false as boolean,
	completeToLoadEnabledFiats: false as boolean,
	completeToLoadEnabledCoins: false as boolean,
	completeToLoadDisabledFiats: false as boolean,
	completeToLoadDisabledCoins: false as boolean,
	loadingEnabledFiats: false as boolean,
	loadingEnabledCoins: false as boolean,
	loadingDisabledFiats: false as boolean,
	loadingDisabledCoins: false as boolean,
	enabledFiats: [] as IAsset[],
	enabledCoins: [] as IAsset[],
	disabledFiats: [] as IAsset[],
	disabledCoins: [] as IAsset[],
	// enabledFiatsMap: new Map() as Map<string, IAsset>,
	// enabledCoinsMap: new Map() as Map<string, IAsset>,
	// disabledFiatsMap: new Map() as Map<string, IAsset>,
	// disabledCoinsMap: new Map() as Map<string, IAsset>,
	usedAssets: [] as string[],
	assetsMap: new Map() as Map<string, IAsset[]>,
	mapExisted: false as boolean,
	fiats: [] as IAsset[],
	coins: [] as IAsset[],
});

export type AssetState = ReturnType<typeof state>;

export const getters: GetterTree<AssetState, RootState> = {};

export const mutations: MutationTree<AssetState> = {
	[LOAD_USED_ASSETS]: (state, payload: string[]) => {
		state.usedAssets = payload;
	},
	[SUCCESS_TO_LOAD_COINS]: state => {
		state.failToLoadEnabledCoins = false;
		state.successToLoadEnabledCoins = true;
	},
	[SUCCESS_TO_LOAD_FIATS]: state => {
		state.failToLoadEnabledFiats = false;
		state.successToLoadEnabledFiats = true;
	},
	[SUCCESS_TO_LOAD_DISABLED_FIATS]: state => {
		state.failToLoadDisabledFiats = false;
		state.successToLoadDisabledFiats = true;
	},
	[SUCCESS_TO_LOAD_DISABLED_COINS]: state => {
		state.failToLoadDisabledCoins = false;
		state.successToLoadDisabledCoins = true;
	},
	[FAIL_TO_LOAD_COINS]: state => {
		state.successToLoadEnabledCoins = false;
		state.failToLoadEnabledCoins = true;
	},
	[FAIL_TO_LOAD_FIATS]: state => {
		state.successToLoadEnabledFiats = false;
		state.failToLoadEnabledFiats = true;
	},
	[FAIL_TO_LOAD_DISABLED_FIATS]: state => {
		state.successToLoadDisabledFiats = false;
		state.failToLoadDisabledFiats = true;
	},
	[FAIL_TO_LOAD_DISABLED_COINS]: state => {
		state.successToLoadDisabledCoins = false;
		state.failToLoadDisabledCoins = true;
	},
	[LOADING_COINS]: (state, payload: boolean) => {
		state.loadingEnabledCoins = payload;
	},
	[LOADING_FIATS]: (state, payload: boolean) => {
		state.loadingEnabledFiats = payload;
	},
	[LOADING_DISABLED_FIATS]: (state, payload: boolean) => {
		state.loadingDisabledFiats = payload;
	},
	[LOADING_DISABLED_COINS]: (state, payload: boolean) => {
		state.loadingDisabledCoins = payload;
	},
	[LOADING_START]: state => {
		state.loading = true;
	},
	[LOADING_END]: state => {
		state.loading = false;
	},
	[LOAD_COINS_PUBLIC]: (state, payload: IAsset[]) => {
		state.publicCoins = payload;
	},
	[LOAD_FIATS]: (state, payload: IAsset[]) => {
		state.enabledFiats = payload.map(v => {
			const lowerSymbol = v.symbol?.toLowerCase();
			const lowerName = v.name?.toLowerCase();
			return {
				...v,
				lowerSymbol,
				searchText: `${lowerName} | ${lowerSymbol}`,
			};
		});
		state.completeToLoadEnabledFiats = true;
	},
	[LOAD_COINS]: (state, payload: IAsset[]) => {
		state.enabledCoins = payload.map(v => {
			const lowerSymbol = v.symbol?.toLowerCase();
			const lowerName = v.name?.toLowerCase();
			return {
				...v,
				lowerSymbol,
				searchText: `${lowerName} | ${lowerSymbol}`,
			};
		});
		state.completeToLoadEnabledCoins = true;
	},
	[LOAD_DISABLED_FIATS]: (state, payload: IAsset[]) => {
		state.disabledFiats = payload.map(v => {
			const lowerSymbol = v.symbol?.toLowerCase();
			const lowerName = v.name?.toLowerCase();
			return {
				...v,
				lowerSymbol,
				searchText: `${lowerName} | ${lowerSymbol}`,
			};
		});
		state.completeToLoadDisabledFiats = true;
	},
	[LOAD_DISABLED_COINS]: (state, payload: IAsset[]) => {
		state.disabledCoins = payload.map(v => {
			const lowerSymbol = v.symbol?.toLowerCase();
			const lowerName = v.name?.toLowerCase();
			return {
				...v,
				lowerSymbol,
				searchText: `${lowerName} | ${lowerSymbol}`,
			};
		});
		state.completeToLoadDisabledCoins = true;
	},
	[INTEGRATE_ASSETS]: state => {
		if (state.mapExisted) return;
		if (
			!state.completeToLoadDisabledCoins ||
			!state.completeToLoadDisabledFiats ||
			!state.completeToLoadEnabledCoins ||
			!state.completeToLoadEnabledFiats
		) {
			return;
		}

		const assets: IAsset[] = [...state.fiats, ...state.coins];
		for (let i = 0; i < assets.length; i++) {
			const asset = assets[i];
			const lowerSymbol = asset.lowerSymbol || '';
			if (Array.isArray(state.assetsMap.get(lowerSymbol))) {
				state.assetsMap.get(lowerSymbol)?.push(asset);
			} else {
				state.assetsMap.set(lowerSymbol, [asset]);
			}
		}
		state.mapExisted = true;
	},
	[INTEGRATE_FIATS]: state => {
		if (!state.completeToLoadDisabledFiats || !state.completeToLoadEnabledFiats) return;

		state.fiats = state.enabledFiats
			.concat(state.disabledFiats)
			.sort((a, b) => ((a.ranking || 99999) > (b.ranking || 99999) ? 1 : -1));
	},
	[INTEGRATE_COINS]: state => {
		if (!state.completeToLoadDisabledCoins || !state.completeToLoadEnabledCoins) return;

		state.coins = state.enabledCoins
			.concat(state.disabledCoins)
			.sort((a, b) => ((a.ranking || 99999) > (b.ranking || 99999) ? 1 : -1));
	},
};

export const actions: ActionTree<AssetState, RootState> = {
	async [LOAD_COINS_PUBLIC]({ state, commit }) {
		if (state.publicCoins && state.publicCoins.length > 0) return;
		commit(LOADING_START);

		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/resources/assets/non-fiat',
			});
			commit(LOAD_COINS_PUBLIC, res.data);
		} catch (error) {
			console.error(error);
		}
		commit(LOADING_END);
	},
	async [LOAD_FIATS]({ state, commit }) {
		if (state.successToLoadEnabledFiats) return;

		commit(LOADING_FIATS, true);
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/assets/brief/fiat',
				params: {
					isEnabled: true,
				},
			});
			commit(LOAD_FIATS, res.data);
			commit(SUCCESS_TO_LOAD_FIATS);
		} catch (error) {
			console.error(error);
			commit(FAIL_TO_LOAD_FIATS);
		} finally {
			commit(LOADING_FIATS, false);
			commit(INTEGRATE_FIATS);
			commit(INTEGRATE_ASSETS);
		}
	},
	async [LOAD_COINS]({ state, commit }): Promise<boolean> {
		if (state.successToLoadEnabledCoins) return true;

		commit(LOADING_COINS, true);
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/assets/brief/non-fiat',
				params: {
					isEnabled: true,
				},
			});

			commit(LOAD_COINS, res.data);
			commit(SUCCESS_TO_LOAD_COINS);
			return true;
		} catch (error) {
			console.error(error);
			commit(FAIL_TO_LOAD_COINS);
			return false;
		} finally {
			commit(LOADING_COINS, false);
			commit(INTEGRATE_COINS);
			commit(INTEGRATE_ASSETS);
		}
	},
	async [LOAD_DISABLED_FIATS]({ state, commit }) {
		if (state.successToLoadDisabledFiats) return;

		commit(LOADING_DISABLED_FIATS, true);
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/assets/brief/fiat',
				params: {
					isEnabled: false,
				},
			});
			commit(LOAD_DISABLED_FIATS, res.data);
			commit(SUCCESS_TO_LOAD_DISABLED_FIATS);
		} catch (error) {
			console.error(error);
			commit(FAIL_TO_LOAD_DISABLED_FIATS);
		} finally {
			commit(LOADING_DISABLED_FIATS, false);
			commit(INTEGRATE_FIATS);
			commit(INTEGRATE_ASSETS);
		}
	},
	async [LOAD_DISABLED_COINS]({ state, commit }) {
		if (state.successToLoadDisabledCoins) return;

		commit(LOADING_DISABLED_COINS, true);
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/assets/brief/non-fiat',
				params: {
					isEnabled: false,
				},
			});
			commit(LOAD_DISABLED_COINS, res.data);
			commit(SUCCESS_TO_LOAD_DISABLED_COINS);
		} catch (error) {
			console.error(error);
			commit(FAIL_TO_LOAD_DISABLED_COINS);
		} finally {
			commit(LOADING_DISABLED_COINS, false);
			commit(INTEGRATE_COINS);
			commit(INTEGRATE_ASSETS);
		}
	},
	async [LOAD_USED_ASSETS]({ commit }, username: string): Promise<string[] | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/transaction-records/assets/login/${username}`,
			});

			commit(LOAD_USED_ASSETS, res.data);
			return res.data;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
};
