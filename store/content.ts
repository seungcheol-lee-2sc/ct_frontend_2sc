/* eslint-disable camelcase */
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import axios from 'axios';
import { RootState } from '.';
import {
	IBlogCategory,
	IContact,
	IExchanges,
	ITaxGuide,
	IPost,
	IDefaultExchanges,
	IImportGuide,
	IDefaultImportGuide,
	ILegal,
	IFaq,
	ISeo,
	INotice,
	INoticeAlert,
	IReview,
	ISharePostIcon,
} from '~/types/content/types';
import { getSingleItem } from '~/utils/func';
import { STRAPI_BASE } from '~/utils/constants';

const strapiAxios = axios.create({ baseURL: STRAPI_BASE });
const CONTACT_ARR = ['twitter', 'facebook', 'reddit', 'linkedIn', 'email'];
const FOOTER_CONTANCT_ARR = ['facebook', 'twitter', 'instagram', 'linkedIn'];

export const LOAD_CATEGORIES = 'LOAD_CATEGORIES';
export const LOAD_POSTS = 'LOAD_POSTS';
export const GET_POST = 'GET_POST';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const LOAD_FAQ_CONTENT = 'LOAD_FAQ_CONTENT';
export const LOAD_TAX_GUIDE = 'LOAD_TAX_GUIDE';
export const LOAD_CONTACT = 'LOAD_CONTACT';
export const LOAD_LEGAL = 'LOAD_LEGAL';
export const LOAD_EXCHANGES = 'LOAD_EXCHANGES';
export const LOAD_IMPORT_GUIDE = 'LOAD_IMPORT_GUIDE';
export const LOAD_NOTICE_ALERT = 'LOAD_NOTICE_ALERT';
export const LOAD_DEFAULT_EXCHANGES = 'LOAD_DEFAULT_EXCHANGES';
export const LOAD_DEFAULT_IMPORT_GUIDE = 'LOAD_DEFAULT_IMPORT_GUIDE';
export const LOAD_SEO = 'LOAD_SEO';
export const LOAD_NOTICE = 'LOAD_NOTICE';
export const LOAD_REVIEWS = 'LOAD_REVIEWS';

export const state = () => ({
	selectedCategory: null as IBlogCategory | null,
	categories: [] as IBlogCategory[],
	posts: [] as IPost[],
	post: null as IPost | null,
	faqContents: [] as IFaq[],
	legal: null as ILegal | null,
	taxGuide: null as ITaxGuide | null,
	contact: {
		id: 0,
		twitter: null,
		facebook: null,
		youtube: null,
		linkedIn: null,
		instagram: null,
		reddit: null,
		googleMyBuisiness: null,
		email: null,
		phone: null,
		created_at: '',
		updated_at: '',
	} as IContact,
	exchanges: null as IExchanges | null,
	importGuide: null as IImportGuide | null,
	noticeAlerts: [] as INoticeAlert[],
	defaultExchanges: null as IDefaultExchanges | null,
	defaultImportGuide: null as IDefaultImportGuide | null,
	seo: null as ISeo | null,
	notice: null as INotice | null,
	reviews: [] as IReview[],
});

export type ContentState = ReturnType<typeof state>;

export const mutations: MutationTree<ContentState> = {
	[LOAD_TAX_GUIDE]: (state, payload: ITaxGuide) => {
		state.taxGuide = payload;
		state.taxGuide.contents.forEach(content => {
			if (content?.tax_subjects && content?.tax_subjects.length > 0) {
				// @ts-ignore
				return content?.tax_subjects.sort((a, b) => (a.order > b.order ? 1 : -1));
			}
		});
	},
	[LOAD_CATEGORIES]: (state, payload) => {
		state.categories = payload;
	},
	[LOAD_POSTS]: (state, payload: IPost[]) => {
		state.posts = payload.sort((a, b) => {
			return new Date(a.created_at) < new Date(b.created_at) ? 1 : -1;
		});
	},
	[GET_POST]: (state, payload) => {
		state.post = payload;
	},
	[LOAD_EXCHANGES]: (state, payload: IExchanges | null) => {
		state.exchanges = payload;
	},
	[LOAD_IMPORT_GUIDE]: (state, payload: IImportGuide | null) => {
		state.importGuide = payload;
	},
	[LOAD_NOTICE_ALERT]: (state, payload: INoticeAlert[]) => {
		state.noticeAlerts = payload.sort((a, b) => (a.order > b.order ? 1 : -1));
	},
	[LOAD_DEFAULT_EXCHANGES]: (state, payload: IDefaultExchanges | null) => {
		state.defaultExchanges = payload;
	},
	[LOAD_DEFAULT_IMPORT_GUIDE]: (state, payload: IDefaultImportGuide | null) => {
		state.defaultImportGuide = payload;
	},
	[SELECT_CATEGORY]: (state, payload) => {
		state.selectedCategory = payload;
	},
	[LOAD_FAQ_CONTENT]: (state, payload) => {
		state.faqContents = payload;
	},
	[LOAD_CONTACT]: (state, payload: IContact) => {
		state.contact = payload;
	},
	[LOAD_LEGAL]: (state, payload: ILegal | null) => {
		state.legal = payload;
	},
	[LOAD_SEO]: (state, payload: ISeo | null) => {
		state.seo = payload;
	},
	[LOAD_NOTICE]: (state, payload: INotice | null) => {
		state.notice = payload;
	},
	[LOAD_REVIEWS]: (state, payload: IReview[]) => {
		state.reviews = payload;
	},
};

export const getters: GetterTree<ContentState, RootState> = {
	filteredPosts: (state): IPost[] => {
		const selectedCategoryId: number = (state.selectedCategory && state.selectedCategory.id) || 0;
		return selectedCategoryId !== 0
			? state.posts.filter((post: IPost) => post.category && post.category.id === selectedCategoryId)
			: state.posts;
	},
	faqAtHelpPage: (state): IFaq[] => {
		return state.faqContents.filter(v => v.helpPage);
	},
	faqAtPricingPage: (state): IFaq[] => {
		return state.faqContents.filter(v => v.pricingPage);
	},
	sharePostIcons(state): ISharePostIcon[] {
		return CONTACT_ARR.map(v => {
			// @ts-ignore
			const url: string = state.contact[v];
			if (url) {
				return {
					name: v,
					src: `/icon/share/${v}.png`,
					href: v === 'email' ? `mailto:${url}` : url,
				};
			} else {
				return {
					name: v,
					src: `/icon/share/${v}.png`,
					href: null,
				};
			}
		});
	},
	existedShareIcons(_, getters): any[] {
		return getters.sharePostIcons.filter((v: ISharePostIcon) => v.href);
	},
	footerContactIcons(state): any[] {
		return FOOTER_CONTANCT_ARR.map(v => {
			// @ts-ignore
			const url: string = state.contact[v];
			if (url) {
				return {
					name: v,
					src: `/icon/share/${v}_footer.png`,
					href: url,
				};
			} else {
				return {
					name: v,
					src: `/icon/share/${v}_footer.png`,
					href: null,
				};
			}
		});
	},
};

export const actions: ActionTree<ContentState, RootState> = {
	async [LOAD_SEO]({ commit }) {
		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/seo',
			});
			commit(LOAD_SEO, res.data);
		} catch (error) {
			console.error(error);
		}
	},
	async [LOAD_NOTICE]({ commit }) {
		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/notice',
			});
			commit(LOAD_NOTICE, res.data);
		} catch (error) {
			console.error(error);
		}
	},
	async [LOAD_CATEGORIES]({ commit }) {
		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/categories',
			});
			commit(LOAD_CATEGORIES, res.data);
		} catch (error) {
			console.error(error);
		}
	},
	async [LOAD_POSTS]({ state, commit }) {
		if (state.posts.length > 0) return;

		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/posts',
			});
			commit(LOAD_POSTS, res.data);
		} catch (error) {
			console.error(error);
		}
	},
	async [GET_POST]({ commit }, param: string) {
		try {
			const res = await strapiAxios({
				method: 'GET',
				url: `/posts/${param}`,
			});
			commit(GET_POST, res.data);
		} catch (error) {
			console.error(error);
		}
	},
	async [LOAD_EXCHANGES]({ commit }, param: string) {
		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/exchanges',
				params: {
					slug: param,
				},
			});
			commit(LOAD_EXCHANGES, getSingleItem(res.data));
		} catch (error) {
			commit(LOAD_EXCHANGES, null);
			console.error(error);
		}
	},
	async [LOAD_IMPORT_GUIDE]({ commit }, param: string) {
		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/import-guides',
				params: {
					slug: param,
				},
			});
			commit(LOAD_IMPORT_GUIDE, getSingleItem(res.data));
		} catch (error) {
			commit(LOAD_IMPORT_GUIDE, null);
			console.error(error);
		}
	},
	async [LOAD_NOTICE_ALERT]({ commit }) {
		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/notice-alerts',
			});
			commit(LOAD_NOTICE_ALERT, res.data);
		} catch (error) {
			commit(LOAD_NOTICE_ALERT, []);
			console.error(error);
		}
	},
	async [LOAD_DEFAULT_EXCHANGES]({ commit }) {
		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/default-exchanges',
			});
			commit(LOAD_DEFAULT_EXCHANGES, getSingleItem(res.data));
		} catch (error) {
			commit(LOAD_DEFAULT_EXCHANGES, null);
			console.error(error);
		}
	},
	async [LOAD_DEFAULT_IMPORT_GUIDE]({ commit }) {
		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/default-import-guide',
			});
			commit(LOAD_DEFAULT_IMPORT_GUIDE, getSingleItem(res.data));
		} catch (error) {
			commit(LOAD_DEFAULT_IMPORT_GUIDE, null);
			console.error(error);
		}
	},
	async [LOAD_FAQ_CONTENT]({ commit }) {
		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/faqs',
			});

			commit(LOAD_FAQ_CONTENT, res.data);
		} catch (error) {
			console.error(error);
		}
	},
	async [LOAD_LEGAL]({ commit }) {
		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/legal',
			});
			commit(LOAD_LEGAL, getSingleItem(res.data));
		} catch (error) {
			console.error(error);
		}
	},
	async [LOAD_TAX_GUIDE]({ commit }) {
		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/tax-guide',
			});
			commit(LOAD_TAX_GUIDE, res.data);
		} catch (error) {
			console.error(error);
		}
	},
	async [LOAD_CONTACT]({ state, commit }) {
		if (state.contact.id !== 0) return;

		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/contact',
			});
			commit(LOAD_CONTACT, res.data);
		} catch (error) {
			console.error(error);
		}
	},
	async [LOAD_REVIEWS]({ commit }) {
		try {
			const res = await strapiAxios({
				method: 'GET',
				url: '/reviews',
			});
			commit(LOAD_REVIEWS, res.data);
		} catch (error) {
			console.error(error);
		}
	},
};
