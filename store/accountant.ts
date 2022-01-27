import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { RootState } from '.';
import { IInvitedObject, IRelatedObject } from '~/types/accountant/types';
import { IGenerateHashReq, IRelatedReq } from '~/types/accountant/dto';

export const SEND_INVITE_EMAIL = 'SEND_INVITE_EMAIL';
export const GET_INVITED_LIST = 'GET_INVITED_LIST';
export const GET_RELATED_LIST = 'GET_RELATED_LIST';
export const INVITE = 'INVITE';
export const INVITE_MULTIPLE = 'INVITE_MULTIPLE';
export const GET_INVITED_OBJECT = 'GET_INVITED_OBJECT';
export const DELETE_INVITED_OBJECT = 'DELETE_INVITED_OBJECT';
export const DELETE_RELATED_OBJECT = 'DELETE_RELATED_OBJECT';
export const GET_RELATED_ACCOUNTANTS = 'GET_RELATED_ACCOUNTANTS';
export const UPDATE_RELATED_OBJECT = 'UPDATE_RELATED_OBJECT';
export const UPDATE_INVITED_OBJECT = 'UPDATE_INVITED_OBJECT';
export const GET_INVITATIONS_BY_EMAIL = 'GET_INVITATIONS_BY_EMAIL';
export const GET_NAME = 'GET_NAME';
export const ACCEPT_INVITATION = 'ACCEPT_INVITATION';
export const RESULT_ERROR = 'RESULT_ERROR';
export const FETCHING = 'FETCHING';
export const GENERATE_TOKEN = 'GENERATE_TOKEN';
export const GET_INFO_OF_CLIENT_SELECTED = 'GET_INFO_OF_CLIENT_SELECTED';

export const state = () => ({
	invitedList: [] as IInvitedObject[],
	relatedList: [] as IRelatedObject[],
	relatedObject: null as IRelatedObject | null,
	invitedObject: null as IInvitedObject | null,
	invitations: [] as IInvitedObject[],
	fetching: false as boolean,
});

export type AcountantState = ReturnType<typeof state>;

export const mutations: MutationTree<AcountantState> = {
	[GET_INVITED_LIST]: (state, payload) => {
		state.invitedList = payload;
	},
	[GET_RELATED_LIST]: (state, payload) => {
		state.relatedList = payload;
	},
	[GET_INVITED_OBJECT]: (state, payload) => {
		state.invitedObject = payload;
	},
	[GET_RELATED_ACCOUNTANTS]: (state, payload) => {
		state.relatedObject = payload.length > 0 ? payload[0] : null; // always return 1 element
	},
	[GET_INVITATIONS_BY_EMAIL]: (state, payload) => {
		state.invitations = payload;
	},
	[FETCHING]: (state, payload) => {
		state.fetching = payload;
	},
};

export const getters: GetterTree<AcountantState, RootState> = {
	isExistRelatedAccountant: (state): boolean => {
		return state.relatedObject !== null;
	},
	relatedAccountantEmail: (state): string => {
		return state.relatedObject ? state.relatedObject.user.email || '' : '';
	},
	newInvitations: (state): IInvitedObject[] => {
		return state.invitations.filter(v => v.status === 'INVITED');
	},
};

export const actions: ActionTree<AcountantState, RootState> = {
	async [SEND_INVITE_EMAIL](_, data): Promise<boolean> {
		try {
			await this.$axios({
				method: 'POST',
				url: `/services/ct/api/marketing/transactional/single-email`,
				data,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [INVITE](
		_,
		{ params, userName }: { params: IRelatedReq; userName: string },
	): Promise<IInvitedObject | boolean> {
		try {
			const res = await this.$axios({
				method: 'PUT',
				url: `/services/ct/api/invited-users/invite/login/${userName}`,
				params,
			});
			return res.data;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [INVITE_MULTIPLE](
		_,
		{ params, userName, data }: { params: IRelatedReq; userName: string; data: any },
	): Promise<boolean> {
		try {
			await this.$axios({
				method: 'POST',
				url: `/services/ct/api/invited-users/invite/multiple/login/${userName}`,
				params,
				data,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	// 안쓸 예정
	// async [GET_INVITED_OBJECT]({ commit }, objectId): Promise<IInvitedObject | any> {
	// 	try {
	// 		const res = await this.$axios({
	// 			method: 'GET',
	// 			url: `/services/ct/api/resources/invited-users/${objectId}`,
	// 		});
	// 		commit(GET_INVITED_OBJECT, res.data);
	// 		return res.data;
	// 	} catch (error: any) {
	// 		console.error(error);
	// 		return { error: true, ...error.response.data };
	// 	}
	// },
	async [DELETE_INVITED_OBJECT](_, objectId): Promise<boolean> {
		try {
			await this.$axios({
				method: 'DELETE',
				url: `/services/ct/api/invited-users/${objectId}`,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [DELETE_RELATED_OBJECT](_, objectId): Promise<boolean> {
		try {
			await this.$axios({
				method: 'DELETE',
				url: `/services/ct/api/related-users/${objectId}`,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [GET_INVITED_LIST](
		{ commit },
		{ params, userName }: { params: IRelatedReq; userName: string },
	): Promise<boolean> {
		try {
			const result = (
				await this.$axios({
					method: 'GET',
					url: `/services/ct/api/invited-users/login/${userName}`,
					params,
				})
			).data;
			commit(GET_INVITED_LIST, result);
			return true;
		} catch (error) {
			console.error(error);
			// dispatch(
			// 	ADD_TO_MESSAGE_QUEUE,
			// 	{ color: 'error', msg: `${this.$i18n.t('message.fail.loadTarget', { target: 'invited users' })}` },
			// 	{ root: true },
			// );
			return false;
		}
	},
	async [GET_INVITATIONS_BY_EMAIL](
		{ commit },
		{ params, userEmail }: { params: IRelatedReq; userEmail: string },
	): Promise<boolean> {
		try {
			const result = (
				await this.$axios({
					method: 'GET',
					url: `/services/ct/api/invited-users/email/${userEmail}`,
					params,
				})
			).data;
			commit(GET_INVITATIONS_BY_EMAIL, result);
			return true;
		} catch (error) {
			console.error(error);
			// dispatch(
			// 	ADD_TO_MESSAGE_QUEUE,
			// 	{ color: 'error', msg: `${this.$i18n.t('message.fail.loadTarget', { target: 'invitations' })}` },
			// 	{ root: true },
			// );
			return false;
		}
	},
	async [GET_RELATED_LIST]({ commit }, { params, userName }: { params: IRelatedReq; userName: string }) {
		try {
			const result = (
				await this.$axios({
					method: 'GET',
					url: `/services/ct/api/related-users/login/${userName}`,
					params,
				})
			).data;
			commit(GET_RELATED_LIST, result);
			return true;
		} catch (error) {
			console.error(error);
			// dispatch(
			// 	ADD_TO_MESSAGE_QUEUE,
			// 	{ color: 'error', msg: `${this.$i18n.t('message.fail.loadTarget', { target: 'related users' })}` },
			// 	{ root: true },
			// );
			return false;
		}
	},
	async [GET_RELATED_ACCOUNTANTS](
		{ commit },
		{ params, userName }: { params: IRelatedReq; userName: string },
	): Promise<boolean> {
		try {
			const result = (
				await this.$axios({
					method: 'GET',
					url: `/services/ct/api/related-users/related-user/login/${userName}`,
					params,
				})
			).data; // will always return 1 element or 0
			commit(GET_RELATED_ACCOUNTANTS, result);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [UPDATE_INVITED_OBJECT](_, invitedObject: IInvitedObject): Promise<boolean> {
		try {
			await this.$axios({
				method: 'PUT',
				url: `/services/ct/api/invited-users/${invitedObject.id}`,
				data: invitedObject,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [UPDATE_RELATED_OBJECT](_, relatedObject: IRelatedObject) {
		try {
			await this.$axios({
				method: 'PUT',
				url: `/services/ct/api/related-users/${relatedObject.id}`,
				data: relatedObject,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [ACCEPT_INVITATION](_, { params, userName }: { params: IRelatedReq; userName: string }): Promise<boolean> {
		try {
			await this.$axios({
				method: 'GET',
				url: `/services/ct/api/related-users/accept-invitation/login/${userName}`,
				params,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [GENERATE_TOKEN](_, params: IGenerateHashReq): Promise<string | false> {
		try {
			const res = await this.$axios({
				method: 'POST',
				url: '/services/ct/api/tax-review/inviteToken',
				data: params,
			});
			return res.data;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [GET_INFO_OF_CLIENT_SELECTED](_, inviteHash: string): Promise<number[]> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/resources/report/info',
				params: { inviteId: inviteHash },
			});
			return res.data;
		} catch (error) {
			console.error(error);
			return [];
		}
	},
};
