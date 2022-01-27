/* eslint-disable no-case-declarations */
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { ADD_TO_MESSAGE_QUEUE, RootState } from '.';
import {
	EJobStatus,
	EPlatformType,
	EProviderSortItem,
	EProviderTypeFilter,
	IAddedAsset,
	IAddedProvider,
	IJob,
	INumbersOfProviders,
	IPlatform,
	IReformedJob,
	ITransactionRecordProvider,
	IUserTransactionRecordSource,
	TransactionRecordProviderType,
} from '~/types/provider/types';
import { IAsset } from '~/types/asset/types';
import { ITransactionCSVSchema } from '~/types/csv-schema/types';

import { isThisAsset, makeSourceToPlatform, providerNumbers, reforming, searching } from '~/utils/provider';
import { IStopImportingDTO } from '~/types/provider/dto';

export const LOAD_PROVIDERS = 'LOAD_PROVIDERS';
export const LOAD_PROVIDERS_PUBLIC = 'LOAD_PROVIDERS_PUBLIC';
export const LOAD_PROVIDER_SOURCES = 'LOAD_PROVIDER_SOURCES';
export const LOAD_PLATFORMS = 'LOAD_PLATFORMS';
export const UPDATE_PROVIDER_SOURCE = 'UPDATE_PROVIDER_SOURCE';
export const DELETE_PROVIDER_SOURCE = 'DELETE_PROVIDER_SOURCE';
export const START_TO_DELETE_SOURCE = 'START_TO_DELETE_SOURCE';
export const END_DELETING_SOURCE = 'END_DELETING_SOURCE';
export const FILTERING_PROVIDERS = 'FILTERING_PROVIDERS';
export const SET_SORT_ITEM = 'SET_SORT_ITEM';
export const ON_CHANGE_SEARCH_TEXT = 'ON_CHANGE_SEARCH_TEXT';
export const GET_PROVIDER_SCHEMAS = 'GET_PROVIDER_SCHEMAS';
export const RENEW_IMPORT_JOB = 'RENEW_IMPORT_JOB';
export const DELETE_IMPORT_JOB = 'DELETE_IMPORT_JOB';
export const TOGGLE_IMPORT_SWITCH = 'TOGGLE_IMPORT_SWITCH';
export const TOGGLE_SHOW_UNSUPPORTED = 'TOGGLE_SHOW_UNSUPPORTED';
export const STOP_IMPORTING_JOB = 'STOP_IMPORTING_JOB';
export const COMPLETE_STOPPING_JOB = 'COMPLETE_STOPPING_JOB';
export const ADD_PENDING = 'ADD_PENDING';
export const DELETE_PENDING = 'DELETE_PENDING';

export const state = () => ({
	importSwitch: false as boolean,
	providers: [] as ITransactionRecordProvider[],
	publicProviders: [] as ITransactionRecordProvider[],
	providerTypeFilter: EProviderTypeFilter.ALL as EProviderTypeFilter,
	providerSources: [] as IUserTransactionRecordSource[],
	failToLoadAccounts: true as boolean,
	providerSortItems: [EProviderSortItem.POPULARITY, EProviderSortItem.NAME] as EProviderSortItem[],
	providerSortItem: EProviderSortItem.POPULARITY,
	updateProviderDialog: false as boolean,
	showUnsupported: false as boolean,
	platforms: [] as IPlatform[],
	searchText: '' as string,
	importJobs: [] as IJob[],
	pendingSources: [] as IUserTransactionRecordSource[],
	stoppingJobIds: [] as string[],
	deletingSourceIds: [] as number[],
});

export type ProviderState = ReturnType<typeof state>;

export const getters: GetterTree<ProviderState, RootState> = {
	numbersOfPlatforms: (state): INumbersOfProviders => {
		const result: INumbersOfProviders = {
			all: state.platforms.length,
			exchange: 0,
			wallet: 0,
			service: 0,
			blockChain: 0,
			custom: 0,
		};

		state.platforms.forEach(v => {
			if (v.type === EPlatformType.EXCHANGE) {
				result.exchange += 1;
			} else if (v.type === EPlatformType.WALLET) {
				result.wallet += 1;
			} else if (v.type === EPlatformType.SERVICE) {
				result.service += 1;
			} else if (v.type === EPlatformType.BLOCKCHAIN) {
				result.blockChain += 1;
			} else if (v.type === EPlatformType.CUSTOM) {
				result.custom += 1;
			}
		});

		return result;
	},
	searchedProviders: (state, getter, rootState: RootState): (ITransactionRecordProvider | IAsset)[] => {
		// @ts-ignore
		const targetCoins = state.showUnsupported ? rootState.asset.enabledCoins : rootState.asset.enabledCoins;
		const targetProviders = state.providers.filter(provider => provider.isEnabled || state.showUnsupported);
		return searching(targetProviders, targetCoins, state.searchText, getter.addedCustomProviders);
	},
	numbersOfProviders: (_, getters): INumbersOfProviders => {
		return providerNumbers(getters.searchedProviders);
	},
	addedCustomProviders: state => {
		return state.platforms
			.filter(platform => platform.type === EPlatformType.CUSTOM)
			.map(platform => {
				return {
					id: `custom-${platform.id}`,
					iconImage: '/icon/custom-exchange.png',
					name: platform.name,
					type: TransactionRecordProviderType.CUSTOM,
					timestampTimeZone: 'USER_TIMEZONE',
					added: true,
				};
			});
	},
	searchedCustomProviders: (state, getter) => {
		const realSearchText = state.searchText ? state.searchText.toLowerCase() : '';
		return getter.addedCustomProviders.filter((provider: IAddedProvider) => {
			return Boolean(provider?.name && provider.name.toLowerCase().includes(realSearchText));
		});
	},
	reformedProviders: (state, getter, rootState: RootState): (IAddedProvider | IAddedAsset)[] => {
		// @ts-ignore
		const targetCoins = state.showUnsupported ? rootState.asset.enabledCoins : rootState.asset.enabledCoins;
		let targetProviders = state.providers.filter(provider => provider.isEnabled || state.showUnsupported);
		targetProviders = targetProviders.map(provider => ({
			...provider,
			isAPIImportEnabled: provider.isEnabled ? provider.isAPIImportEnabled : false,
			isCSVImportEnabled: provider.isEnabled ? provider.isCSVImportEnabled : false,
			isLoginImportEnabled: provider.isEnabled ? provider.isLoginImportEnabled : false,
		}));
		const reformed = reforming(
			targetProviders,
			state.providerTypeFilter,
			targetCoins,
			state.searchText,
			state.providerSortItem,
		);

		const addedOrNot = reformed.map(reformedProvider => {
			let providerType = 'BLOCKCHAIN';
			if (!isThisAsset(reformedProvider)) {
				const provider: ITransactionRecordProvider = reformedProvider;
				providerType = provider.type || '';
			}
			const added: boolean =
				providerType === 'BLOCKCHAIN'
					? Boolean(getter.addedAssetIds.find((assetId: number) => assetId === reformedProvider.id))
					: Boolean(getter.addedProviderIds.find((providerId: number) => providerId === reformedProvider.id));
			return { ...reformedProvider, added };
		});

		const added = addedOrNot.filter(v => v.added);
		const notAdded = addedOrNot.filter(v => !v.added);

		const result: (IAddedProvider | IAddedAsset)[] = [...added, ...getter.searchedCustomProviders, ...notAdded].filter(
			v => v !== null,
		);

		const sameNameProvider = result.find(v => v.name?.toLowerCase() === state.searchText?.toLocaleLowerCase());
		!sameNameProvider && getter.customProvider && result.push(getter.customProvider);

		return result;
	},
	addedAssetIds: (state): number[] => {
		const ids: any[] = state.providerSources.filter(v => v.asset?.id && v.asset?.id).map(v => v.asset?.id);
		const set = new Set(ids);
		return [...set];
	},
	addedProviderIds: (state): number[] => {
		const ids = state.providerSources.filter(v => v.provider).map(v => v.provider?.id || 0);
		const set = new Set(ids);
		return [...set];
	},
	customProvider: (state): ITransactionRecordProvider | null => {
		return state.searchText
			? {
					id: 999999,
					iconImage: '/icon/custom-exchange.png',
					name: state.searchText.substring(0, 20),
					type: TransactionRecordProviderType.CUSTOM,
					timestampTimeZone: 'USER_TIMEZONE',
			  }
			: null;
	},
	processingSourceIds: (_state, getter): number[] => {
		const sourceIds: number[] = getter.reformedJobs.map((v: IReformedJob) => v.sourceId);
		const set = new Set(sourceIds);
		return [...set];
	},
	reformedJobs: (state): IReformedJob[] => {
		const sourceAdded = state.importJobs.map(job => ({
			...job,
			source: state.providerSources.find(source => source.id === job.sourceId) || null,
		}));
		const jobsWithPendingSource: IReformedJob[] = state.pendingSources.map(source => ({
			jobId: source.jobId || '',
			source,
			sourceId: source.id || 0,
			status: EJobStatus.ENQUEUED,
			batches: null,
			progress: null,
			userId: null,
		}));
		return [...sourceAdded, ...jobsWithPendingSource]
			.sort((a, b) => ((a.source?.name || '') > (b.source?.name || '') ? 1 : -1))
			.filter(v => v?.source && v.status !== EJobStatus.DELETED);
	},
};

export const mutations: MutationTree<ProviderState> = {
	[COMPLETE_STOPPING_JOB]: (state, payload: string[]) => {
		state.stoppingJobIds = state.stoppingJobIds.filter(v => !payload.includes(v));
	},
	[STOP_IMPORTING_JOB]: (state, payload: IStopImportingDTO) => {
		state.stoppingJobIds.push(payload.jobId);

		const foundIndex = state.importJobs.findIndex(job => job.jobId === payload.jobId);
		foundIndex !== -1 && state.importJobs.splice(foundIndex, 1);

		const foundIndex2 = state.pendingSources.findIndex(job => job.jobId === payload.jobId);
		foundIndex2 !== -1 && state.pendingSources.splice(foundIndex2, 1);
	},
	[DELETE_PENDING]: (state, sourceIds: number[]) => {
		state.pendingSources = state.pendingSources.filter(source => source.id && !sourceIds.includes(source.id));
	},
	[ADD_PENDING]: (state, payload: IUserTransactionRecordSource[] = []) => {
		const result: IUserTransactionRecordSource[] = [];
		[...state.pendingSources, ...payload].forEach(source => {
			const found = result.find(v => v.id === source.id);
			!found && result.push(source);
		});

		state.pendingSources = result;
	},
	[START_TO_DELETE_SOURCE]: (state, sourceId: number) => {
		const found = state.deletingSourceIds.find(id => id === sourceId);
		if (!found) {
			state.deletingSourceIds.push(sourceId);
		}
	},
	[END_DELETING_SOURCE]: (state, sourceId: number) => {
		const foundIndex = state.deletingSourceIds.findIndex(id => id === sourceId);
		if (foundIndex) {
			state.deletingSourceIds.splice(foundIndex, 1);
		}
	},
	[TOGGLE_SHOW_UNSUPPORTED]: state => {
		state.showUnsupported = !state.showUnsupported;
	},
	[TOGGLE_IMPORT_SWITCH]: state => {
		state.importSwitch = !state.importSwitch;
	},
	[RENEW_IMPORT_JOB]: (state, payload: IJob[] = []) => {
		state.importJobs = payload;
	},
	[DELETE_IMPORT_JOB]: (state, jobIds: string[] = []) => {
		state.importJobs = state.importJobs.filter(job => !jobIds.includes(job.jobId));
	},
	[ON_CHANGE_SEARCH_TEXT]: (state, payload: string) => {
		state.searchText = payload;
	},
	[FILTERING_PROVIDERS]: (state, payload: EProviderTypeFilter) => {
		state.providerTypeFilter = payload;
	},
	[SET_SORT_ITEM]: (state, payload: EProviderSortItem) => {
		state.providerSortItem = payload;
	},
	[LOAD_PROVIDERS]: (state, payload: ITransactionRecordProvider[]) => {
		state.providers = payload;
	},
	[LOAD_PROVIDERS_PUBLIC]: (state, payload: ITransactionRecordProvider[]) => {
		state.publicProviders = payload;
	},
	[LOAD_PLATFORMS]: (state, payload: IUserTransactionRecordSource[]) => {
		state.platforms = makeSourceToPlatform(payload);
	},
	[LOAD_PROVIDER_SOURCES]: (state, payload: IUserTransactionRecordSource[] | false) => {
		if (payload !== false) {
			state.providerSources = payload.sort((a, b) => {
				const sortDateA = a.lastImportDate || a.createdDate || '';
				const sortDateB = b.lastImportDate || b.createdDate || '';
				return sortDateA < sortDateB ? 1 : -1;
			});
			state.failToLoadAccounts = false;
		} else {
			state.pendingSources = [];
			state.failToLoadAccounts = true;
		}
	},
	[UPDATE_PROVIDER_SOURCE]: (state, payload: IUserTransactionRecordSource) => {
		if (!payload || !payload.id) return;

		const foundIndex = state.providerSources.findIndex(v => v.id === payload.id);
		if (foundIndex >= 0) {
			state.providerSources[foundIndex] = payload;
		}
	},
};

export const actions: ActionTree<ProviderState, RootState> = {
	async [GET_PROVIDER_SCHEMAS](_, providerId: number): Promise<ITransactionCSVSchema[]> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/transaction-csv-schemas/provider/${providerId}`,
			});
			const schemas: ITransactionCSVSchema[] = res.data;
			return schemas;
		} catch (error) {
			console.error(error);
			return [];
		}
	},
	async [LOAD_PROVIDERS]({ state, commit }): Promise<boolean> {
		if (state.providers.length > 0) return true;

		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/transaction-record-providers',
				params: { size: 9999 },
			});
			commit(LOAD_PROVIDERS, res.data);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_PROVIDERS_PUBLIC]({ commit }): Promise<ITransactionRecordProvider[] | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/resources/transaction-record-providers/enabled',
			});
			commit(LOAD_PROVIDERS_PUBLIC, res.data);
			return res.data;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_PROVIDER_SOURCES]({ commit }): Promise<IUserTransactionRecordSource[] | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/user-transaction-record-sources/user/current',
				params: { size: 9999 },
			});
			console.log('provider sources : ', res.data);
			commit(LOAD_PROVIDER_SOURCES, res.data);
			commit(LOAD_PLATFORMS, res.data);
			return res.data;
		} catch (error) {
			commit(LOAD_PROVIDER_SOURCES, false);
			commit(LOAD_PLATFORMS, []);
			console.error(error);
			return false;
		}
	},
	async [UPDATE_PROVIDER_SOURCE]({ dispatch }, data: IUserTransactionRecordSource) {
		try {
			await this.$axios({
				method: 'PUT',
				url: `/services/ct/api/user-transaction-record-sources/${data.id}`,
				data,
			});
			dispatch(
				ADD_TO_MESSAGE_QUEUE,
				{ color: 'successDark', msg: this.$i18n.t('message.success.update') },
				{ root: true },
			);
		} catch (error) {
			console.error(error);
			dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$i18n.t('message.fail.update') }, { root: true });
		}
	},
	async [DELETE_PROVIDER_SOURCE](
		{ commit, dispatch },
		{ source, username }: { source: IUserTransactionRecordSource; username: string },
	) {
		commit(START_TO_DELETE_SOURCE, source.id);
		if (source.jobStatus === EJobStatus.FAILED && username) {
			const DTO: IStopImportingDTO = {
				username,
				jobId: source.jobId || '',
			};
			await dispatch(`provider/${STOP_IMPORTING_JOB}`, DTO);
		}
		try {
			await this.$axios({
				method: 'DELETE',
				url: `/services/ct/api/user-transaction-record-sources/${source.id}`,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		} finally {
			commit(END_DELETING_SOURCE, source.id);
		}
	},
	async [STOP_IMPORTING_JOB]({ commit }, payload: IStopImportingDTO): Promise<boolean> {
		try {
			await this.$axios({
				method: 'DELETE',
				url: `/services/ct/api/jobs/user/login/${payload.username}/jobId/${payload.jobId}`,
			});
			commit(STOP_IMPORTING_JOB, payload);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
};
