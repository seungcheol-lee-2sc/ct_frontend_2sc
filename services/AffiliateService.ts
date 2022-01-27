/* eslint-disable no-new */
/* eslint-disable no-use-before-define */
import { Store } from 'vuex/types/index';
import moment from 'moment';
import { CREATE_AFFILIATE, GET_AFFILIATE, GET_COMMISSIONS, GET_REFERRALS, UPDATE_AFFILIATE } from '~/store/affiliate';
import { UPDATE_ATTRIBUTES } from '~/store/auth';
import { IAffiliateReq } from '~/types/affiliate/dto';
import { IAffiliateBody, ICommissionObject, IReferralObject } from '~/types/affiliate/types';
import { ICognitoUserExt } from '~/types/auth/types';
import { DATEFORMAT_GRAPH } from '~/utils/constants';
import { getSingleItem } from '~/utils/func';

export enum EConversionState {
	CONVERSION = 'conversion',
	LEAD = 'lead',
	VISITOR = 'visitor',
}

export class AffiliateService {
	private static instance: AffiliateService;
	private id: number;
	private info: IAffiliateBody | null = null;
	private store: Store<any>;
	private affiliateId: string = '';
	private errMessage: string;
	private user: ICognitoUserExt;
	private commissions: ICommissionObject[] = [];
	private referrals: IReferralObject[] | null = null;
	private loading: any = {
		affiliate: false,
	};

	private loadingProxy: any = null;

	private success = {
		commissions: false,
		referrals: false,
	};

	constructor(store: Store<any>, user: ICognitoUserExt) {
		this.store = store;
		if (user?.attributes && 'custom:affiliate_id' in user.attributes) {
			this.affiliateId = user?.attributes['custom:affiliate_id'] || '';
		}
		this.user = user;
		this.errMessage = '';
		this.id = new Date().valueOf();
	}

	public static getInstance(store: Store<any>, user: ICognitoUserExt) {
		return this.instance || (this.instance = new this(store, user));
	}

	watchAffiliate(): Promise<IAffiliateBody | string> {
		return new Promise(resolve => {
			this.loadingProxy = new Proxy(this.loading, {
				set: (target, property, value) => {
					target[property] = value;
					resolve(this.info || this.errMessage);
					return true;
				},
			});
		});
	}

	async getAffiliateInfo(): Promise<IAffiliateBody | string> {
		if (this.info) return this.info;

		if (this.loading.affiliate === true) {
			return await this.watchAffiliate();
		}

		console.log('API : Get affiliate info');
		this.loading.affiliate = true;
		const res: IAffiliateBody | string = this.affiliateId
			? await this.store.dispatch(`affiliate/${GET_AFFILIATE}`, this.affiliateId)
			: await this.store.dispatch(`affiliate/${CREATE_AFFILIATE}`, this.user);

		if (typeof res === 'string') {
			// Error case
			this.info = null;
			this.errMessage = res;
			if (this.loadingProxy) {
				this.loadingProxy.affiliate = false;
			} else {
				this.loading.affiliate = false;
			}
			return this.errMessage;
		} else {
			// Correct case
			this.info = res;
			this.errMessage = '';
			this.store.dispatch(`auth/${UPDATE_ATTRIBUTES}`, { 'custom:affiliate_id': this.info.id });
			if (this.loadingProxy) {
				this.loadingProxy.affiliate = false;
			} else {
				this.loading.affiliate = false;
			}
			return res;
		}
	}

	async getCommissions(id: string): Promise<ICommissionObject[]> {
		if (this.success.commissions) return this.commissions;

		const res: ICommissionObject[] | false = await this.store.dispatch(`affiliate/${GET_COMMISSIONS}`, id);
		if (res === false) {
			this.commissions = [];
			this.success.commissions = false;
		} else {
			this.commissions = res;
			this.success.commissions = true;
		}
		return this.commissions;
	}

	async getReferrals(id: string) {
		const res: IReferralObject[] | false = await this.store.dispatch(`affiliate/${GET_REFERRALS}`, id);
		if (res === false) {
			this.referrals = [];
			this.success.referrals = false;
		} else {
			this.referrals = res;
			this.success.referrals = true;
		}
		return this.referrals;
	}

	updatePaypal(email: string) {
		if (!this.info?.id || !email) return;

		const payload: IAffiliateBody = { paypal_email: email };
		const params: IAffiliateReq = { affiliateId: this.info?.id || '' };
		this.store.dispatch(`affiliate/${UPDATE_AFFILIATE}`, { payload, params });
	}

	getRewardHistory(): any[] {
		return (this.referrals || [])
			.filter(v => v.conversion_state !== 'visitor')
			.map(v => {
				const state =
					v.conversion_state === EConversionState.CONVERSION
						? 'Purchased '
						: v.conversion_state === EConversionState.LEAD
						? 'Joined'
						: 'Visits';
				return {
					email: v.customer?.email || '',
					name: v.customer?.name || '',
					state: `${state} (${moment(v.updated_at).format(DATEFORMAT_GRAPH) || ''})`,
				};
			});
	}

	getPaidHistory(): any[] {
		return (this.commissions || [])
			.filter(v => v.paid_at !== null)
			.map(v => {
				return {
					date: v.paid_at ? moment(v.paid_at).format(DATEFORMAT_GRAPH) : '',
					amount: v.amount ? v.amount / 100 : 0,
				};
			});
	}

	getLink(): string {
		return this.info ? getSingleItem(this.info?.links).url : '';
	}
}
