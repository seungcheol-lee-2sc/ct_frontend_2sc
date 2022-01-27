/* eslint-disable no-useless-constructor */
import { ICtUser } from '../common/types';
import { IAsset } from '../asset/types';
import { ITransactionRecordBatch } from '../transaction/types';

export enum EProviderTypeFilter {
	ALL = 'ALL',
	WALLET = 'WALLET',
	EXCHANGE = 'EXCHANGE',
	BLOCK_CHAIN = 'BLOCK_CHAIN',
	TAX = 'TAX',
	SERVICE = 'SERVICE',
	CUSTOM = 'CUSTOM', // custom
}

export interface INumbersOfProviders {
	all: number;
	exchange: number;
	wallet: number;
	service: number;
	blockChain: number;
	custom: number;
}

export enum EProviderSortItem {
	POPULARITY = 'Popularity',
	NAME = 'A to Z',
}

export enum EAccountSortItem {
	UPDATED = 'Last updated',
	NAME = 'Account name',
}

export enum EPlatformType {
	EXCHANGE = 'EXCHANGE',
	WALLET = 'WALLET',
	BLOCKCHAIN = 'BLOCKCHAIN',
	SERVICE = 'SERVICE',
	CUSTOM = 'CUSTOM',
}

export interface IAddedAsset extends IAsset {
	added: boolean;
}

export enum EJobStatus {
	ENQUEUED = 'ENQUEUED',
	PROCESSING = 'PROCESSING',
	SUCCEEDED = 'SUCCEEDED',
	FAILED = 'FAILED',
	DELETED = 'DELETED',
}

export enum SourceType {
	CSV = 'CSV',
	TEMPLATE = 'TEMPLATE',
	API_KEY = 'API_KEY',
	OAUTH2 = 'OAUTH2',
	PUBLIC_ADDRESS = 'PUBLIC_ADDRESS',
	MANUAL = 'MANUAL',
	CUSTOM = 'CUSTOM',
}

export enum TransactionRecordProviderType {
	EXCHANGE = 'EXCHANGE',
	PORTFOLIO = 'PORTFOLIO',
	SERVICE = 'SERVICE',
	TAX = 'TAX',
	DEFI = 'DEFI',
	WALLET = 'WALLET',
	CUSTOM = 'CUSTOM',
}

export interface IWallet {
	id: number;
	name?: string | null;
	publicAddress?: string;
	asset?: IAsset | null;
	user?: ICtUser | null;
}

export enum ERecommandedImportMethod {
	OAUTH2 = 'OAUTH2', // used
	API_KEY = 'API_KEY', // used
	CSV = 'CSV', // used
	MANUAL = 'MANUAL',
	PUBLIC_ADDRESS = 'PUBLIC_ADDRESS',
	CUSTOM = 'CUSTOM',
	TEMPLATE = 'TEMPLATE',
}

export interface ITransactionRecordProvider {
	id: number;
	name?: string;
	slug?: string | null;
	ranking?: number | null;
	type?: TransactionRecordProviderType | null;
	isEnabled?: boolean | null;
	isCSVImportEnabled?: boolean | null;
	isAPIImportEnabled?: boolean | null;
	isLoginImportEnabled?: boolean | null;
	timestampTimeZone?: string | null;
	iconImage?: string | null;
	url?: string;
	description?: string | null;
	countries?: string | null;
	launchedDate?: Date | null;
	twitter?: string | null;
	blog?: string | null;
	label?: string | null;
	recommendedImportMethod?: ERecommandedImportMethod | null;
}

export interface IUserTransactionRecordSource {
	accessToken?: string;
	accessTokenExpire?: Date | null;
	accountId?: string;
	apiKey?: string;
	apiSecret?: string;
	asset?: IAsset | null;
	count?: number | null;
	createdDate?: Date | null;
	ctToken?: string | null;
	ctTokenTime?: Date | null;
	fromDate?: Date | null;
	id?: number;
	lastModifiedDate?: string | null;
	lastImportDate?: string | null;
	name?: string;
	passphrase?: string;
	provider?: ITransactionRecordProvider | null;
	publicAddress?: string;
	refreshToken?: string;
	refreshTokenTime?: Date | null;
	sourceType?: SourceType;
	toDate?: Date | null;
	user?: ICtUser;
	platformName?: string;
	dateForSort?: string; // custom
	jobId?: string;
	jobStatus?: EJobStatus | null;
}

export enum EImportGuideType {
	ADDRESS = 'ADDRESS',
	LOGIN = 'LOGIN',
	API = 'API',
	FILE = 'FILE',
	MANUAL = 'MANUAL',
}

export interface IAddedProvider extends ITransactionRecordProvider {
	added: boolean;
}

export interface IPlatform {
	id: string;
	img: string | null;
	name: string;
	count: number;
	lastImportDate: string;
	lastModifiedDate: string;
	createdDate: string | Date;
	provider: ITransactionRecordProvider | null;
	asset: IAsset | null;
	providerSources: IUserTransactionRecordSource[];
	type: EPlatformType;
	subname?: string;
	fromDate: string | Date;
	toDate: string | Date;
}

export interface IJob {
	jobId: string;
	progress: number | null;
	sourceId: number;
	status: EJobStatus;
	userId: number | null;
	batches: null | ITransactionRecordBatch[];
}

export interface IReformedJob extends IJob {
	source: IUserTransactionRecordSource | null;
}
