import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { AuthState } from './auth';
import { RootState } from '.';
import { IAffiliateBody, IAffliliateReq, ICommissionObject, IReferralObject } from '~/types/affiliate/types';
import { IAffiliateReq } from '~/types/affiliate/dto';
import { REWARDFUL_CAMPAIGN_ID } from '~/utils/constants';
import { ICognitoUserExt } from '~/types/auth/types';

export const CREATE_AFFILIATE = 'CREATE_AFFILIATE';
export const GET_AFFILIATE = 'GET_AFFILIATE';
export const UPDATE_AFFILIATE = 'UPDATE_AFFILIATE';
export const GET_REFERRALS = 'GET_REFERRALS';
export const GET_COMMISSIONS = 'GET_COMMISSIONS';

export const state = () => ({});

export type AffiliateState = ReturnType<typeof state>;

export const getters: GetterTree<AffiliateState, RootState> = {};

export const mutations: MutationTree<AffiliateState> = {};

export const actions: ActionTree<AffiliateState, AuthState> = {
	async [CREATE_AFFILIATE](_, currentUser: ICognitoUserExt): Promise<IAffiliateBody | string> {
		try {
			const email = currentUser.attributes.email || '';
			const firstName = currentUser.attributes.given_name || email.split('@')[0];
			const lastName = currentUser.attributes.family_name || email.split('@')[0];
			const payload: IAffliliateReq = {
				email,
				first_name: firstName,
				last_name: lastName,
				state: 'active',
				campaign_id: REWARDFUL_CAMPAIGN_ID,
				receive_new_commission_notifications: false,
			};

			const res = await this.$axios({
				method: 'POST',
				url: '/services/ct/api/reward/affiliates/',
				data: payload,
			});
			return res.data;
		} catch (error: any) {
			const errorMsg = error.response ? error.response.data.detail : error.toString();
			if (errorMsg.includes('Email has already been taken')) {
				return 'Email has already been taken.';
			} else {
				return 'Unknown error.';
			}
		}
	},
	async [GET_AFFILIATE](_, affiliateId: string): Promise<IAffiliateBody | string> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/reward/affiliates/',
				params: { affiliateId },
			});

			if (res.data.state === 'disabled') {
				return 'Affiliate was disabled.';
			}
			return res.data;
		} catch (error: any) {
			const errorMsg = error.response ? error.response.data.detail : error.toString();
			if (errorMsg.includes('Affiliate not found')) {
				return 'Affiliate not found.';
			}
			return 'Unknown error.';
		}
	},
	async [UPDATE_AFFILIATE](
		_,
		{ payload, params }: { payload: IAffiliateBody; params: IAffiliateReq },
	): Promise<IAffiliateBody | string> {
		try {
			const res = await this.$axios({
				method: 'PUT',
				url: '/services/ct/api/reward/affiliates/',
				params,
				data: payload,
			});
			return res.data;
		} catch (error: any) {
			let errorMsg = '';
			if (error.response) {
				errorMsg = error.response.data.detail;
			}
			return errorMsg;
		}
	},

	async [GET_REFERRALS](_, affiliateId: string): Promise<IReferralObject | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/reward/referrals',
				params: {
					affiliateId,
				},
			});
			return res.data.data;
		} catch (error: any) {
			console.error(error);
			return false;
		}
	},

	async [GET_COMMISSIONS](_, affiliateId: string): Promise<ICommissionObject[] | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: 'services/ct/api/reward/commissions',
				params: { affiliateId },
			});
			return res.data.data;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
};
