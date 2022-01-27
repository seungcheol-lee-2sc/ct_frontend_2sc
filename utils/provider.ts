import { IAsset } from '~/types/asset/types';
import {
	EPlatformType,
	EProviderSortItem,
	EProviderTypeFilter,
	INumbersOfProviders,
	IPlatform,
	ITransactionRecordProvider,
	IUserTransactionRecordSource,
	SourceType,
	TransactionRecordProviderType,
} from '~/types/provider/types';

export const isThisAsset = (obj: any): boolean => 'symbol' in obj;

export const makeSourceToPlatform = <T extends IUserTransactionRecordSource, P extends IPlatform>(
	sources: T[],
): P[] => {
	const platforms: P[] = [];
	sources.forEach(source => {
		const DPlatform: IPlatform = {
			name: '',
			provider: null,
			providerSources: [source],
			lastImportDate: source.lastImportDate || '',
			lastModifiedDate: source.lastModifiedDate || '',
			createdDate: source.createdDate || '',
			asset: null,
			img: '/icon/custom-exchange.png',
			id: '',
			count: source.count || 0,
			type: EPlatformType.CUSTOM,
			subname: '',
			fromDate: source.fromDate || '',
			toDate: source.toDate || '',
		};
		let foundIndex = -1;
		if (!source.provider && !source.asset) {
			foundIndex = platforms.findIndex(v => v?.name === source?.platformName);
			if (foundIndex === -1) {
				const platform: any = {
					...DPlatform,
					name: source.platformName || '',
					id: `custom-${source.platformName}`,
					type: EPlatformType.CUSTOM,
					subname: 'Custom',
				};
				platforms.push(platform);
			}
		} else if (source?.provider?.id) {
			let platformType: any = null;
			if (source.provider.type === TransactionRecordProviderType.EXCHANGE) {
				platformType = EPlatformType.EXCHANGE;
			} else if (source.provider.type === TransactionRecordProviderType.WALLET) {
				platformType = EPlatformType.WALLET;
			} else if (source.provider.type === TransactionRecordProviderType.SERVICE) {
				platformType = EPlatformType.SERVICE;
			} else if (!source.provider || !source.asset) {
				platformType = EPlatformType.CUSTOM;
			}

			foundIndex = platforms.findIndex(v => v?.provider?.id === source?.provider?.id);
			if (foundIndex === -1) {
				const platform: any = {
					...DPlatform,
					name: source.provider?.name || '',
					provider: source.provider,
					img: source.provider.iconImage || '',
					id: `provider-${source.provider.id}`,
					type: platformType,
				};
				platformType && platforms.push(platform);
			}
		} else {
			foundIndex = platforms.findIndex(v => v?.asset?.id === source?.asset?.id);
			if (foundIndex === -1) {
				const platform: any = {
					...DPlatform,
					name: source.asset?.name || '',
					providerSources: [source],
					asset: source.asset || null,
					img: source.asset?.iconImage || '',
					id: `asset-${source.asset?.id}`,
					type: EPlatformType.BLOCKCHAIN,
				};
				platforms.push(platform);
			}
		}

		if (foundIndex !== -1) {
			platforms[foundIndex].providerSources.push(source);
			platforms[foundIndex].count += source.count || 0;

			/**
			 * Lastest import date
			 */
			if (platforms[foundIndex].lastImportDate < (source.lastImportDate || '')) {
				platforms[foundIndex].lastImportDate = source.lastImportDate || '';
			}

			/**
			 * Lastest modified date
			 */
			if (platforms[foundIndex].lastModifiedDate < (source.lastModifiedDate || '')) {
				platforms[foundIndex].lastModifiedDate = source.lastModifiedDate || '';
			}

			/**
			 * Lastest created date
			 */
			if (platforms[foundIndex].createdDate < (source.createdDate || '')) {
				platforms[foundIndex].createdDate = source.createdDate || '';
			}

			/**
			 * The most past "from date"
			 */
			if (
				!platforms[foundIndex].fromDate ||
				(source.fromDate && platforms[foundIndex].fromDate > (source.fromDate || ''))
			) {
				platforms[foundIndex].fromDate = source.fromDate || '';
			}

			/**
			 * The most recent "to date"
			 */
			if (!platforms[foundIndex].toDate || (source.toDate && platforms[foundIndex].toDate < (source.toDate || ''))) {
				platforms[foundIndex].toDate = source.toDate || '';
			}
		}
	});
	console.log('platforms : ', platforms);
	return platforms.sort((a, b) => {
		const sortDateA = a.lastImportDate || a.createdDate;
		const sortDateB = b.lastImportDate || b.createdDate;
		return sortDateA < sortDateB ? 1 : -1;
	});
};

export const providerFilter = (
	providerDatas: any[], // IUserTransactionRecordSource[] | ITransactionRecordProvider[] | IAsset[]
	filter: EProviderTypeFilter,
	coins: any[] = [],
	providerSource: boolean = false,
) => {
	const temp = providerDatas.filter(v => v.type !== TransactionRecordProviderType.TAX); // TAX === Competitor

	if (providerSource) {
		switch (filter) {
			case EProviderTypeFilter.BLOCK_CHAIN:
				return temp.filter((providerData: IUserTransactionRecordSource) => providerData.asset);
			case EProviderTypeFilter.EXCHANGE:
				return temp.filter(
					(providerData: any) => providerData.provider?.type === TransactionRecordProviderType.EXCHANGE,
				);
			case EProviderTypeFilter.SERVICE:
				return temp.filter(
					(providerData: any) => providerData.provider?.type === TransactionRecordProviderType.SERVICE,
				);
			case EProviderTypeFilter.WALLET:
				return temp.filter(
					(providerData: IUserTransactionRecordSource) =>
						providerData.provider?.type === TransactionRecordProviderType.WALLET,
				);
			default:
				return temp.concat(coins);
		}
	} else {
		switch (filter) {
			case EProviderTypeFilter.WALLET:
				return temp.filter((providerData: any) => providerData?.type === TransactionRecordProviderType.WALLET);
			case EProviderTypeFilter.EXCHANGE:
				return temp.filter((providerData: any) => providerData?.type === TransactionRecordProviderType.EXCHANGE);
			case EProviderTypeFilter.SERVICE:
				return temp.filter((providerData: any) => providerData?.type === TransactionRecordProviderType.SERVICE);
			case EProviderTypeFilter.BLOCK_CHAIN:
				return coins;
			case EProviderTypeFilter.CUSTOM:
				return temp.filter((providerData: any) => providerData?.type === TransactionRecordProviderType.CUSTOM);

			default:
				return temp.concat(coins);
		}
	}
};

export const providerNumbers = (
	datas: IUserTransactionRecordSource[] | ITransactionRecordProvider[] | IAsset[],
	providerSource: boolean = false,
): INumbersOfProviders => {
	const result: INumbersOfProviders = {
		all: 0,
		exchange: 0,
		wallet: 0,
		service: 0,
		blockChain: 0,
		custom: 0,
	};

	if (providerSource) {
		datas.forEach((data: IUserTransactionRecordSource) => {
			if (data.provider) {
				if (data.provider.type === TransactionRecordProviderType.EXCHANGE) {
					result.exchange += 1;
					result.all += 1;
				} else if (data.provider.type === TransactionRecordProviderType.SERVICE) {
					result.service += 1;
					result.all += 1;
				} else if (data.provider.type === TransactionRecordProviderType.WALLET) {
					result.wallet += 1;
					result.all += 1;
				}
			} else {
				result.all += 1;
				result.blockChain += 1;
			}
		});
	} else {
		// @ts-ignore
		datas.forEach((data: ITransactionRecordProvider | IAsset) => {
			if (isThisAsset(data)) {
				result.all += 1;
				result.blockChain += 1;
			} else {
				const target: ITransactionRecordProvider = data;

				if (target?.type === TransactionRecordProviderType.WALLET) {
					result.wallet += 1;
					result.all += 1;
				} else if (target?.type === TransactionRecordProviderType.EXCHANGE) {
					result.exchange += 1;
					result.all += 1;
				} else if (target?.type === TransactionRecordProviderType.SERVICE) {
					result.service += 1;
					result.all += 1;
				} else if (target?.type === TransactionRecordProviderType.CUSTOM) {
					result.custom += 1;
					result.all += 1;
				}
			}
		});
	}

	return result;
};

export const syncable = (sources: IUserTransactionRecordSource[]) => {
	return sources.filter(
		v =>
			v.sourceType === SourceType.API_KEY ||
			v.sourceType === SourceType.OAUTH2 ||
			v.sourceType === SourceType.PUBLIC_ADDRESS,
	);
};

export const providerSearchResult = (target: ITransactionRecordProvider | IAsset, searchText: string): boolean => {
	const realSearchText = searchText ? searchText.toLowerCase() : '';
	const condition1: boolean = Boolean(target?.name && target.name.toLowerCase().includes(realSearchText));
	if ('symbol' in target) {
		const asset: IAsset = target;
		const condition2: boolean = Boolean(asset.symbol && asset.symbol.toLowerCase().includes(realSearchText));
		return condition1 || condition2;
	}
	return condition1;
};

export const searching = (
	providers: ITransactionRecordProvider[],
	coins: IAsset[],
	searchText: string,
	customProviders: ITransactionRecordProvider[] = [],
) => {
	const targets = providers.concat(coins).concat(customProviders);
	return targets.filter(target => providerSearchResult(target, searchText));
};

export const reforming = (
	providers: ITransactionRecordProvider[],
	typeFilter: EProviderTypeFilter,
	coins: IAsset[],
	searchText: string,
	sortItem: EProviderSortItem,
) => {
	const filtered: ITransactionRecordProvider[] | IAsset[] = providerFilter(providers, typeFilter, coins);

	if (sortItem === EProviderSortItem.POPULARITY && typeFilter === EProviderTypeFilter.ALL) {
		// order : exchange > service > wallet > blockchain
		const exchanges: ITransactionRecordProvider[] = [];
		const services: ITransactionRecordProvider[] = [];
		const wallets: ITransactionRecordProvider[] = [];
		const bloackchains: IAsset[] = [];
		filtered.forEach((v: ITransactionRecordProvider | IAsset) => {
			if (isThisAsset(v)) {
				bloackchains.push(v);
			} else {
				const target: ITransactionRecordProvider = v;

				if (target?.type === TransactionRecordProviderType.WALLET) {
					wallets.push(v);
				} else if (target?.type === TransactionRecordProviderType.EXCHANGE) {
					exchanges.push(v);
				} else if (target?.type === TransactionRecordProviderType.SERVICE) {
					services.push(v);
				}
			}
		});

		// @ts-ignore
		exchanges.sort((a, b) => ((+a.ranking || 9999) > (+b.ranking || 9999) ? 1 : -1));
		// @ts-ignore
		services.sort((a, b) => ((+a.ranking || 9999) > (+b.ranking || 9999) ? 1 : -1));
		// @ts-ignore
		wallets.sort((a, b) => ((+a.ranking || 9999) > (+b.ranking || 9999) ? 1 : -1));
		// @ts-ignore
		bloackchains.sort((a, b) => ((+a.ranking || 9999) > (+b.ranking || 9999) ? 1 : -1));

		return [...exchanges, ...services, ...wallets, ...bloackchains].filter(provider =>
			providerSearchResult(provider, searchText),
		);
	} else {
		return [...filtered]
			.filter(provider => providerSearchResult(provider, searchText))
			.sort((a: any, b: any) => {
				if (sortItem === EProviderSortItem.POPULARITY) {
					return +a?.ranking > +b.ranking ? 1 : -1;
				} else if (sortItem === EProviderSortItem.NAME) {
					return String(a.name).toLowerCase() > String(b.name).toLowerCase() ? 1 : -1;
				} else {
					return a.id > b.id ? 1 : -1;
				}
			});
	}
};
