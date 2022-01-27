import { ActionTree, GetterTree, MutationTree } from 'vuex';
import axios from 'axios';
import { CONFIRM_ERROR, ADD_TO_MESSAGE_QUEUE, RootState } from '.';
import { IGetHubspotTokenDTO } from '~/types/etc/dto';
import { BUG_REPORT_FORM_ID, CONTACT_US_FORM_ID, ENTERPRISE_FORM_ID, HUB_SPOT_ID } from '~/utils/constants';

export const SUBMIT_EMAIL_TO_CAMPAIGN = 'SUBMIT_EMAIL_TO_CAMPAIGN';
export const SUBMIT_EMAIL_TO_BETA_TESTER = 'SUBMIT_EMAIL_TO_BETA_TESTER';
export const UPLOAD_TO_S3 = 'UPLOAD_TO_S3';
export const UPLOAD_TO_S3_PUBLIC = 'UPLOAD_TO_S3_PUBLIC';
export const GET_HUBSPOT_TOKEN = 'GET_HUBSPOT_TOKEN';
export const CREATE_CONTACT_US = 'CREATE_CONTACT_US';
export const CREATE_BUG_REPORT = 'CREATE_BUG_REPORT';
export const CREATE_ENTERPRISE_CONTACT = 'CREATE_ENTERPRISE_CONTACT';

const hubSpotFormAxios = axios.create({
	baseURL: 'https://api.hsforms.com/submissions/v3/integration/submit',
});

export const state = () => ({});

export type EtcState = ReturnType<typeof state>;

export const mutations: MutationTree<EtcState> = {};

export const getters: GetterTree<EtcState, RootState> = {};

export const actions: ActionTree<EtcState, RootState> = {
	async [SUBMIT_EMAIL_TO_BETA_TESTER]({ commit }, payload: string): Promise<boolean> {
		try {
			await this.$axios({
				method: 'PUT',
				url: '/services/ct/api/resources/marketing/add-to-beta-tester-list',
				params: {
					email: payload,
				},
			});
			return true;
		} catch (error) {
			console.error(error);
			commit(
				CONFIRM_ERROR,
				{
					title: this.$i18n.t('common.error'),
					text: `${this.$i18n.t('message.fail.submitEmail')} ${this.$i18n.t('message.tryAgain')}`,
				},
				{ root: true },
			);
			return false;
		}
	},
	async [SUBMIT_EMAIL_TO_CAMPAIGN]({ commit }, payload: string): Promise<boolean> {
		try {
			await this.$axios({
				method: 'PUT',
				url: '/services/ct/api/resources/marketing/add-to-waiting-list',
				params: {
					email: payload,
				},
			});
			return true;
		} catch (error) {
			console.error(error);
			commit(
				CONFIRM_ERROR,
				{
					title: this.$i18n.t('common.error'),
					text: `${this.$i18n.t('message.fail.submitEmail')} ${this.$i18n.t('message.tryAgain')}`,
				},
				{ root: true },
			);
			return false;
		}
	},
	async [UPLOAD_TO_S3]({ dispatch }, payload: File[]): Promise<string[]> {
		const formData = new FormData();
		payload.forEach(v => {
			formData.append('attachmentImages', v, v.name);
		});
		try {
			const res = await this.$axios({
				method: 'POST',
				url: '/services/ct/api/ct-users/support/attachments',
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				data: formData,
			});

			return res.data;
		} catch (error) {
			console.error(error);
			dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$i18n.t('message.fail.upload') }, { root: true });
			return [];
		}
	},
	async [UPLOAD_TO_S3_PUBLIC]({ dispatch }, { data, email }: { data: File[]; email: string }) {
		const formData = new FormData();
		data.forEach(v => {
			formData.append('attachmentImages', v, v.name);
		});
		try {
			const res = await this.$axios({
				method: 'POST',
				url: '/services/ct/api/resources/email/support/attachments',
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				data: formData,
				params: {
					email,
				},
			});

			return res.data;
		} catch (error) {
			console.error(error);
			dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$i18n.t('message.fail.upload') }, { root: true });
			return [];
		}
	},
	async [GET_HUBSPOT_TOKEN](_, payload: IGetHubspotTokenDTO): Promise<string | null> {
		try {
			const res = await this.$axios({
				method: 'POST',
				url: '/services/ct/api/marketing/visitor-identification',
				params: payload,
			});
			return res.data?.token || '';
		} catch (error) {
			console.error(error);
			return null;
		}
	},
	async [CREATE_CONTACT_US](_, payload: any): Promise<boolean> {
		const fields = Object.keys(payload)
			.map(key => {
				return { objectTypeId: '0-1', name: key, value: payload[key] };
			})
			.filter(v => v.value);

		try {
			await hubSpotFormAxios({
				method: 'POST',
				url: `/${HUB_SPOT_ID}/${CONTACT_US_FORM_ID}`,
				data: { fields },
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [CREATE_BUG_REPORT](_, payload: any) {
		const fields = Object.keys(payload)
			.map(key => {
				return { objectTypeId: '0-1', name: key, value: payload[key] };
			})
			.filter(v => v.value);

		try {
			await hubSpotFormAxios({
				method: 'POST',
				url: `/${HUB_SPOT_ID}/${BUG_REPORT_FORM_ID}`,
				data: { fields },
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [CREATE_ENTERPRISE_CONTACT](_, payload: any) {
		const fields = Object.keys(payload)
			.map(key => {
				return { objectTypeId: '0-1', name: key, value: payload[key] };
			})
			.filter(v => v.value);

		try {
			await hubSpotFormAxios({
				method: 'POST',
				url: `/${HUB_SPOT_ID}/${ENTERPRISE_FORM_ID}`,
				data: { fields },
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
};
