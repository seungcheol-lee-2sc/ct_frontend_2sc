import { ITransactionRecord } from '../transaction/types';

export interface IWalletImportDTO {
	symbol: string;
	address: string;
}

export interface IWalletSyncDTO {
	sourceId?: number;
	data: any[]; // object : { symbol : public_address }
}

export interface ILoginImportDTO {
	providerId: number;
	sourceId?: number;
}

// export interface ITemplateImportDTO {
// 	providerId?: number;
// 	assetSymbol?: string;
// 	timezone: string;
// 	formData: FormData;
// 	sourceName?: string;
// }

export interface IManualFormImportDTO {
	providerId?: number;
	assetSymbol?: string;
	data: ITransactionRecord[];
	sourceName?: string;
}

/// ///

export interface IGenerateUrlReq {
	index: number;
	filename: string;
}

export interface IGenerateUrlRes {
	index: number;
	filename: string;
	uniqueFilename: string;
	presignedUrl: string;
}

export interface IFileImportDTO {
	providerId: number;
	timezone: string;
	files: File[];
}

export interface IFileDetail {
	index: number;
	filename: string;
	uniqueFilename: string;
	presignedUrl: string;
	result: true;
	size: number;
}

export interface IFileImportActionDTO {
	providerId: number;
	timezone: string;
	fileUploadResultDetails: IFileDetail[];
}

export interface ITemplateImportDTO {
	providerId?: number;
	assetSymbol?: string;
	timezone: string;
	sourceName?: string;
	files: File[];
}

export interface ITemplateImportActionDTO {
	providerId?: number;
	assetSymbol?: string;
	sourceName?: string;
	timezone: string;
	fileUploadResultDetails: IFileDetail[];
}
