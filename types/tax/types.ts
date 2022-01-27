import { ESortOrder } from '../common/types';

export enum EReportType {
	PDF_8949 = 'pdf8949',
	SCHEDULE_D = 'scheduled',
	AUDIT_TRIAL = 'audittrail',
	INCOME_TAX = 'incometax',
	TURBO_TAX_ONLINE = 'turbotaxonline',
	TURBO_TAX_DESKTOP = 'turbotaxdesktop',
	TAX_ACT = 'taxact',
	TRANSACTION = 'transaction',
	CCH = 'cch',
	DRAKE = 'drake',
	ATX = 'atx',
}

export enum ETaxStrategy {
	FIFO = 'FIFO',
	LIFO = 'LIFO',
	HIFO = 'HIFO',
}

export interface ITaxReportRequest {
	type: EReportType;
	taxYear: number;
	loginId?: string;
	inviteId?: string | any;
}

export interface ITaxInfoRequest {
	taxYear: number;
	strategy: ETaxStrategy;
}

export interface ICapitalGainResponse {
	id: number;
	caseopen: string;
	taxyear: number;
	method: string;
	user: any;
}

export interface IYearSummaryResponse {
	giftReceived: number;
	giftSent: number;
	longterm: number;
	shortterm: number;
	ordinaryIncome: number;
	tradingFee: number;
}

export interface ITaxStrategyObject {
	value: string;
	text: string;
}

export interface ILineGraphParams {
	range: string;
	pixels: number;
	asset: string;
}

export interface ILineGraphResponse {
	totalValue: number;
	costBasis: number;
	timestamp: string;
}

export interface IAssetGraphParams {
	page?: number;
	size?: number;
	sort?: string;
}

export interface IAssetGraphResponse {
	asset: string;
	costBasis: number;
	quantity: number;
	marketValue: number;
	spotPrice: number;
	change24H: number;
	unrealizedGain: number;
	roi: number;
}

export enum EAssetDataSortTarget {
	ASSET = 'asset',
	MARKET_VALUE = 'marketValue',
	UNREALIZED_GAIN = 'unrealizedGain',
}

export interface ITotalAssetSortDTO {
	target: EAssetDataSortTarget;
	order: ESortOrder;
}

export interface IBillboardParams {
	asset?: string;
}

export interface IBillboardResponse {
	totalValue: number;
	change24H: number;
	costBasis: number;
	unrealizedGain: number;
}

export interface IYearTaxSummary extends IYearSummaryResponse {
	taxyear: number;
	count: number;
}

export interface IYearSummaryParams {
	taxYear: number;
}
