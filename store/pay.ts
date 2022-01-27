import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { ADD_TO_MESSAGE_QUEUE, RootState } from '.';
import { IGetSession, IPaymentHistory, IProduct } from '~/types/pay/types';
import { ICheckoutReq, IGetConfigRes } from '~/types/pay/dto';

export const FREE_PRODUCT: IProduct = {
	description: 'Up to 25 transactions, LIFO/HIFO trading',
	productId: 'freeProduct',
	price: 'Free',
	name: 'Free',
	priceId: 'freeProduct',
	transactions: '25',
};

export const STRIPE_SET_UP = 'STRIPE_SET_UP';
export const CREATE_CHECKOUT_SESSEION = 'CREATE_CHECKOUT_SESSEION';
export const GET_PRODUCTS = 'GET_PRODUCTS';
export const FINISH_SESSION = 'FINISH_SESSION';
export const LOAD_TOTAL_TRANSACTIONS = 'LOAD_TOTAL_TRANSACTIONS';
export const SELECT_PRODUCT = 'SELECT_PRODUCT';
export const SELECT_YEAR = 'SELECT_YEAR';
export const PAYPAL_LOGIN = 'PAYPAL_LOGIN';
export const LOAD_PAYMENT_HISTORIES = 'LOAD_PAYMENT_HISTORIES';
export const LATEST_PLAN_BY_YEAR = 'LATEST_PLAN_BY_YEAR';
export const SET_PAYPAL_RESPONSE_EMAIL = 'SET_PAYPAL_RESPONSE_EMAIL';

export const state = () => ({
	selectedProductId: '' as string,
	selectedYear: null as number | null,
	coupons: [] as any[],
	products: [] as IProduct[],
	stripe: null as Stripe | null,
	publishableKey: '' as string,
	sessionId: '' as string,
	totalTransactions: 0 as number,
	paymentHistories: [] as IPaymentHistory[],
	purchasedPlanByYear: null as IPaymentHistory | null,
	paypalResponseEmail: '' as string,
});

export type PayState = ReturnType<typeof state>;

export const getters: GetterTree<PayState, RootState> = {};

export const mutations: MutationTree<PayState> = {
	[SELECT_PRODUCT]: (state, payload: string) => {
		state.selectedProductId = payload;
	},
	[SELECT_YEAR]: (state, payload: number) => {
		state.selectedYear = payload;
	},
	[STRIPE_SET_UP]: (state, payload: Stripe) => {
		state.stripe = payload;
	},
	[GET_PRODUCTS]: (state, payload: IProduct[]) => {
		state.products = payload;
	},
	[CREATE_CHECKOUT_SESSEION]: (state, payload: IGetSession) => {
		state.sessionId = payload.sessionId;
	},
	[LOAD_TOTAL_TRANSACTIONS]: (state, payload: number) => {
		state.totalTransactions = payload;
	},
	[LOAD_PAYMENT_HISTORIES]: (state, payload: IPaymentHistory[]) => {
		state.paymentHistories = payload;
	},
	[LATEST_PLAN_BY_YEAR]: (state, payload: IPaymentHistory) => {
		state.purchasedPlanByYear = payload;
	},
	[SET_PAYPAL_RESPONSE_EMAIL]: (state, payload: string) => {
		state.paypalResponseEmail = payload;
	},
};

export const actions: ActionTree<PayState, RootState> = {
	async [LOAD_TOTAL_TRANSACTIONS]({ commit, dispatch }) {
		try {
			const totalResponse = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/transaction-records/user/current/with-filter`,
			});
			const total = totalResponse.headers['x-total-count'];
			commit(LOAD_TOTAL_TRANSACTIONS, total);
		} catch (error) {
			console.error(error);
			dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: `Fail to load transactions` }, { root: true });
		}
	},
	async [STRIPE_SET_UP]({ commit, dispatch }) {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/stripe-pay/config',
			});

			const data: IGetConfigRes = res.data;
			const stripe = await loadStripe(data.publishable_key, {});
			commit(STRIPE_SET_UP, stripe);
		} catch (error) {
			console.error(error);
			dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Fail to get config' }, { root: true });
		}
	},
	async [CREATE_CHECKOUT_SESSEION]({ commit }, payload: ICheckoutReq) {
		try {
			const res = await this.$axios({
				method: 'POST',
				url: '/services/ct/api/stripe-pay/create-checkout-session',
				data: payload,
			});
			commit(CREATE_CHECKOUT_SESSEION, res.data);
		} catch (error) {
			console.error(error);
		}
	},
	async [GET_PRODUCTS]({ dispatch, commit }) {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: '/services/ct/api/stripe-pay/products',
			});
			const data: IProduct[] = res.data;
			data.sort((a, b) => (+a.price < +b.price ? 1 : -1));
			commit(GET_PRODUCTS, data);
		} catch (error) {
			console.error(error);
			dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Fail to get products' }, { root: true });
		}
	},
	async [FINISH_SESSION](_, payload: string) {
		try {
			await this.$axios({
				method: 'GET',
				url: `/services/ct/api/stripe-pay/finish-session?sessionId=${payload}`,
			});
		} catch (error) {
			console.error(error);
		}
	},
	async [PAYPAL_LOGIN](_, code: string): Promise<string | boolean> {
		try {
			const res = await this.$axios({
				method: 'POST',
				url: `/services/ct/api/oauth-paypal-account/${code}`,
			});
			console.log(res);
			if (res.data.success === false) {
				return false;
			}
			return res.data.email;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [LOAD_PAYMENT_HISTORIES]({ commit }) {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/payment-histories`,
				params: {
					size: 9999,
				},
			});
			commit(LOAD_PAYMENT_HISTORIES, res.data);
		} catch (error) {
			console.error(error);
		}
	},
	async [LATEST_PLAN_BY_YEAR]({ commit }, taxYear) {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/payment-histories/latest`,
				params: {
					taxYear,
				},
			});
			res.data === '' ? commit(LATEST_PLAN_BY_YEAR, null) : commit(LATEST_PLAN_BY_YEAR, res.data);
		} catch (error) {
			console.error(error);
		}
	},
};
