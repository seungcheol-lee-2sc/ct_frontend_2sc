import { HELP_CENTER_URL } from './constants';
import { IMenuItem } from '~/types/common/types';

/**
 * Individual
 */
export const ABOUTUS_MENU: IMenuItem = {
	title: 'menu.aboutUs',
	path: '/about-us',
	icon: 'mdi-post-outline',
	subMenus: [],
};
export const EXCHANGES_MENU: IMenuItem = {
	title: 'menu.exchanges',
	path: '/exchanges',
	icon: 'mdi-post-outline',
	subMenus: [],
};
export const PRICING_MENU: IMenuItem = {
	title: 'menu.pricing',
	path: '/pricing',
	icon: 'mdi-post-outline',
	subMenus: [],
};
export const FEATURES_MENU: IMenuItem = {
	title: 'menu.features',
	path: '',
	icon: '',
	desc: 'Do it, learn what our software has to offer.',
	subMenus: [
		{ title: 'menu.whycointelli', path: '/features', icon: '', imageUrl: '/characters/smile-half.png' },
		{
			title: 'menu.howItWorks',
			path: '/how-cointelli-works',
			icon: '',
			imageUrl: '/characters/smile-half-rightside.png',
		},
		// { title: 'Real human support', path: '/', icon: '', imageUrl: '/characters/smile-half-02.png' },
		// { title: 'Tax Professional', path: '/', icon: '', imageUrl: '/characters/with-glasses.png' },
	],
};

export const SERVICE_MENU: IMenuItem = {
	title: 'menu.service',
	path: '',
	icon: '',
	subMenus: [FEATURES_MENU.subMenus[0], ...FEATURES_MENU.subMenus.slice(1, FEATURES_MENU.subMenus.length)],
};

export const SUPPORT_MENU: IMenuItem = {
	title: 'menu.support',
	path: '',
	icon: 'mdi-post-outline',
	desc: 'What kind of help are you looking for?',
	subMenus: [
		{ title: 'menu.taxGuide', path: '/crypto-tax-guide', icon: '', imageUrl: '/characters/smile-half.png' },
		{ title: 'menu.blog', path: '/blog', icon: '', imageUrl: '/characters/smile-half-rightside.png' },
		{
			title: 'menu.helpCenter',
			path: HELP_CENTER_URL,
			icon: '',
			external: true,
			imageUrl: '/characters/smile-half-02.png',
		},
	],
};

export const FOOTER_SUPPORT_MENU: IMenuItem = {
	title: 'menu.support',
	path: '',
	icon: '',
	subMenus: [...SUPPORT_MENU.subMenus, { title: 'menu.contactUs', path: '/contact-us', icon: '', newTab: true }],
};

export const LEGAL_MENU: IMenuItem = {
	title: 'menu.legal',
	path: '',
	icon: '',
	subMenus: [
		{ title: 'menu.termsOfService', path: '/terms-of-service', icon: '' },
		{ title: 'menu.privacyPolicy', path: '/privacy-policy', icon: '' },
		{ title: 'menu.disclaimer', path: '/disclaimer', icon: '' },
		{ title: 'menu.security', path: '/security', icon: '' },
	],
};

export const USER_MENU: IMenuItem = {
	title: 'menu.user',
	path: '',
	icon: '',
	subMenus: [
		{ title: 'menu.profile', path: '/user/profile', icon: 'mdi-account-outline' },
		{ title: 'menu.rewards', path: '/user/rewards', icon: 'mdi-currency-usd' },
	],
};

export const PROFESSIONAL_USER_MENU: IMenuItem = {
	title: 'menu.user',
	path: '',
	icon: '',
	subMenus: [{ title: 'menu.profile', path: '/accountant/profile', icon: 'mdi-account-outline' }],
};

export const DASHBOARD_MENU: IMenuItem = {
	title: 'menu.dashboard',
	path: '/dashboard',
	icon: 'mdi-chart-box-outline',
	wrapper: 'tourStep3',
	subMenus: [],
};

export const TAX_MENU_1: IMenuItem = {
	title: 'Import data',
	path: '/tax/import',
	icon: 'mdi-numeric-1-circle',
	iconColor: 'secondary',
	alias: 'product.step1',
	subMenus: [],
};

export const TAX_MENU_2: IMenuItem = {
	title: 'Overview',
	path: '/tax/overview',
	icon: 'mdi-numeric-2-circle',
	iconColor: 'secondary',
	alias: 'product.step2',
	subMenus: [],
};

export const TAX_MENU_3: IMenuItem = {
	title: 'Review',
	path: '/tax/review',
	icon: 'mdi-numeric-3-circle',
	iconColor: 'secondary',
	alias: 'product.step3',
	subMenus: [],
};

export const TAX_MENU_4: IMenuItem = {
	title: 'Get report',
	path: '/tax/report',
	icon: 'mdi-numeric-4-circle',
	iconColor: 'secondary',
	alias: 'product.step4',
	subMenus: [],
};

export const MENU_ITEMS_MARKETING: IMenuItem[] = [
	ABOUTUS_MENU,
	FEATURES_MENU,
	EXCHANGES_MENU,
	PRICING_MENU,
	SUPPORT_MENU,
];
export const MENU_ITEMS_PRODUCT: IMenuItem[] = [TAX_MENU_1, TAX_MENU_2, TAX_MENU_3, TAX_MENU_4];

/**
 * Professional
 */
export const ACCOUNTANT_MANAGE_MENU: IMenuItem = {
	title: 'Manage',
	path: '/accountant/manage-clients',
	icon: 'mdi-account-multiple-outline',
	wrapper: 'tourStep2_pro',
	subMenus: [],
};

export const ACCOUNTANT_INVITE_MENU: IMenuItem = {
	title: 'Incentive',
	path: '/accountant/rewards',
	icon: 'mdi-currency-usd',
	subMenus: [],
};

export const MENU_ITEMS_ACCOUNTANT: IMenuItem[] = [ACCOUNTANT_MANAGE_MENU, ACCOUNTANT_INVITE_MENU];
