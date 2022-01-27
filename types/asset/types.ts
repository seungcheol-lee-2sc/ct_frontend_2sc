import { ICtUser } from '../common/types';
import { ITransactionRecordProvider } from '../provider/types';

export enum AssetCategory {
	COIN = 'COIN',
	TOKEN = 'TOKEN',
	FIAT = 'FIAT',
	MANUAL = 'MANUAL', // frontend only
}

export interface IAsset {
	id: number;
	name?: string;
	symbol?: string;
	lowerSymbol?: string; // custom
	slug?: string | null;
	ranking?: number | null;
	category?: AssetCategory | null;
	platform?: string | null;
	isEnabled?: boolean | null;
	iconImage?: string | null;
	description?: string | null;
	addedDate?: Date | null;
	website?: string | null;
	twitter?: string | null;
	technicalDoc?: string | null;
	reddit?: string | null;
	messageBoard?: string | null;
	announcement?: string | null;
	chat?: string | null;
	explorer?: string | null;
	sourceCode?: string | null;
	searchText?: string | null; // custom
}

export interface IUserAssetMap {
	id: null;
	tempId: string | null; // custom
	originalAssetSymbol: string;
	tempMappedSymbol: string | null; // custom
	mappedAssetSymbol: string | null;
	user: ICtUser;
	createdDate: Date | null;
	lastModifiedDate: Date | null;
	isIgnored: boolean | null;
	provider: ITransactionRecordProvider | null;
	numTransactionsWithOriginalAsset: number;
}
