/* eslint-disable no-case-declarations */
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { ADD_PENDING } from './provider';
import { CONFIRM_ERROR, ADD_TO_MESSAGE_QUEUE, RootState } from '.';
import { IUserTransactionRecordSource, SourceType } from '~/types/provider/types';
import {
	IFileDetail,
	IFileImportActionDTO,
	IFileImportDTO,
	ILoginImportDTO,
	IManualFormImportDTO,
	ITemplateImportActionDTO,
	ITemplateImportDTO,
	IWalletSyncDTO,
} from '~/types/import/dto';
import { UploadFileService } from '~/services/UploadFileService';

export const WALLETS_IMPORT = 'WALLETS_IMPORT';
export const API_IMPORT = 'API_IMPORT';
export const LOGIN_IMPORT = 'LOGIN_IMPORT';
export const SYNC_API_IMPORT = 'SYNC_API_IMPORT';
export const LOGIN_IMPORT_POST_CALLBACK = 'LOGIN_IMPORT_POST_CALLBACK';
export const SYNC_SOURCE = 'SYNC_SOURCE';
export const MANUAL_FORM_IMPORT = 'MANUAL_FORM_IMPORT';
export const MANUAL_FORM_IMPORT_CUSTOM = 'MANUAL_FORM_IMPORT_CUSTOM';
export const FILE_IMPORT_S3 = 'FILE_IMPORT_S3';
export const TEMPLATE_IMPORT_S3 = 'TEMPLATE_IMPORT_S3';
export const CUSTOM_TEMPLATE_IMPORT_S3 = 'CUSTOM_TEMPLATE_IMPORT_S3';

export const state = () => ({});

export type ImportState = ReturnType<typeof state>;

export const getters: GetterTree<ImportState, RootState> = {};

export const mutations: MutationTree<ImportState> = {};

export const actions: ActionTree<ImportState, RootState> = {
	async [FILE_IMPORT_S3](
		{ commit },
		{ providerId, timezone, files }: IFileImportDTO,
	): Promise<IUserTransactionRecordSource | null> {
		try {
			const details: IFileDetail[] | false = await new UploadFileService(this.$axios, files, 1).uploadToS3();
			if (details === false) return null;

			const DTO: IFileImportActionDTO = {
				providerId,
				timezone,
				fileUploadResultDetails: details,
			};

			const res = await this.$axios({
				method: 'POST',
				url: '/services/ct/api/import/csv/template/provider/update-result',
				data: DTO,
			});
			commit(`provider/${ADD_PENDING}`, [res.data], { root: true });
			return res.data;
		} catch (error) {
			console.error(error);
			return null;
		}
	},
	async [TEMPLATE_IMPORT_S3](
		{ commit },
		{ files, providerId, assetSymbol, timezone }: ITemplateImportDTO,
	): Promise<boolean> {
		try {
			const details: IFileDetail[] | false = await new UploadFileService(this.$axios, files, 2).uploadToS3();
			if (details === false) return false;

			const DTO: ITemplateImportActionDTO = {
				providerId,
				timezone,
				assetSymbol,
				fileUploadResultDetails: details,
			};

			providerId ? delete DTO.assetSymbol : delete DTO.providerId;

			const res = await this.$axios({
				method: 'POST',
				url: '/services/ct/api/import/csv/template/platform/update-result',
				data: DTO,
			});
			commit(`provider/${ADD_PENDING}`, [res.data], { root: true });
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [CUSTOM_TEMPLATE_IMPORT_S3](
		{ commit },
		{ files, providerId, assetSymbol, timezone, sourceName }: ITemplateImportDTO,
	): Promise<boolean> {
		try {
			const details: IFileDetail[] | false = await new UploadFileService(this.$axios, files, 3).uploadToS3();
			if (details === false) return false;

			const DTO: ITemplateImportActionDTO = {
				providerId,
				timezone,
				assetSymbol,
				sourceName,
				fileUploadResultDetails: details,
			};

			providerId ? delete DTO.assetSymbol : delete DTO.providerId;

			const res = await this.$axios({
				method: 'POST',
				url: '/services/ct/api/import/csv/template/custom/update-result',
				data: DTO,
			});
			commit(`provider/${ADD_PENDING}`, [res.data], { root: true });
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [MANUAL_FORM_IMPORT](_, payload: IManualFormImportDTO): Promise<boolean> {
		const { data, ...params } = payload;

		try {
			await this.$axios({
				method: 'POST',
				url: '/services/ct/api/transaction-records/manual-input',
				params,
				data,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [MANUAL_FORM_IMPORT_CUSTOM](_, payload: IManualFormImportDTO): Promise<boolean> {
		const { data, ...params } = payload;
		try {
			await this.$axios({
				method: 'POST',
				url: '/services/ct/api/transaction-records/custom/manual-input',
				data,
				params: { ...params, sourceName: payload.sourceName },
			});

			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [API_IMPORT]({ commit }, { id, data }: { id: number; data: any }): Promise<boolean> {
		try {
			const res = await this.$axios({
				method: 'POST',
				url: `/services/ct/api/import/apikey/provider/${id}`,
				data,
			});
			commit(`provider/${ADD_PENDING}`, [res.data], { root: true });
			return true;
		} catch (error) {
			console.error(error);
			commit(
				ADD_TO_MESSAGE_QUEUE,
				{ color: 'error', msg: this.$i18n.t('message.fail.importTarget', { target: 'API' }) },
				{ root: true },
			);
			return false;
		}
	},
	async [LOGIN_IMPORT]({ commit }, payload: ILoginImportDTO): Promise<string | IUserTransactionRecordSource> {
		try {
			const res = await this.$axios({
				method: 'POST',
				url: `/services/ct/api/import/oauth/provider/${payload.providerId}`,
			});

			if (res.data.redirect) {
				// Not linked yet
				return res.data.redirect;
			}
			res.data?.source && commit(`provider/${ADD_PENDING}`, [res.data?.source], { root: true });
			return res.data;
		} catch (error) {
			console.error(error);
			commit(
				ADD_TO_MESSAGE_QUEUE,
				{ color: 'error', msg: this.$i18n.t('message.fail.importTarget', { target: 'Login' }) },
				{ root: true },
			);
			return 'fail';
		}
	},
	async [LOGIN_IMPORT_POST_CALLBACK]({ dispatch }, payload: any): Promise<boolean> {
		try {
			await this.$axios({
				method: 'POST',
				url: `/services/ct/api/oauth-callback`,
				data: payload,
			});

			return true;
		} catch ({ response }) {
			console.error(response);
			dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$i18n.t('message.fail.import') }, { root: true });
			return false;
		}
	},
	async [WALLETS_IMPORT]({ commit }, payload: IWalletSyncDTO): Promise<boolean> {
		/**
		 * payload is set of key and value (object)
		 * payload's key === Symbol (ex. BTC)
		 * payload's value === Public address
		 */

		try {
			const res = await this.$axios({
				method: 'POST',
				url: `/services/ct/api/import/wallet/asset/multiple`,
				data: payload.data,
			});
			const sources: IUserTransactionRecordSource[] = res.data;
			commit(`provider/${ADD_PENDING}`, sources, { root: true });
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [SYNC_API_IMPORT]({ commit }, sourceId: number): Promise<boolean> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/import/apikey/source/${sourceId}`,
			});
			commit(`provider/${ADD_PENDING}`, [res.data], { root: true });

			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [SYNC_SOURCE]({ dispatch, commit }, source: IUserTransactionRecordSource): Promise<string> {
		switch (source.sourceType) {
			case SourceType.API_KEY:
				await dispatch(SYNC_API_IMPORT, source.id);
				return '';
			case SourceType.OAUTH2:
				if (source.provider?.id) {
					const DTO: ILoginImportDTO = {
						providerId: source.provider?.id,
						sourceId: source.id,
					};
					return await dispatch(LOGIN_IMPORT, DTO);
				}
				return '';
			case SourceType.PUBLIC_ADDRESS:
				if (!source.publicAddress) {
					commit(
						CONFIRM_ERROR,
						{
							title: this.$i18n.t('common.error'),
							text: this.$i18n.t('message.notFound', { target: this.$i18n.t('product.publicAddressInfo') }),
						},
						{ root: true },
					);
					return '';
				}

				const DTO: IWalletSyncDTO = {
					sourceId: source.id,
					data: [{ assetSymbol: source.asset?.symbol, publicAddress: source.publicAddress }],
				};

				await dispatch(WALLETS_IMPORT, DTO);
				return '';
			default:
				return '';
		}
	},
};
