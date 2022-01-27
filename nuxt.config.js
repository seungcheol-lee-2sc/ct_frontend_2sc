/* eslint-disable nuxt/no-cjs-in-config */
const PRODUCTION = 'production';
const STAGING = 'staging';
const DEVELOPMENT = 'development';
const QA = 'qa';
const BUILD_ENV = process.env.NODE_ENV;
const BUILD_ENV_ALIAS = process.env.NODE_ENV === PRODUCTION ? 'prod' : process.env.NODE_ENV;
require('dotenv').config({ path: `ct-frontend-${BUILD_ENV_ALIAS}.env` });
const axios = require('axios');
const i18n = require('./i18n/index.ts');
const { PALETTE, BREAK_POINT } = require('./config.style.js');
const { LOCALES } = require('./config.app.js');

const CT_FRONT = process.env.CT_FRONT;

console.log('ENV : ', BUILD_ENV);
console.log('CT_FRONT : ', CT_FRONT);

const DISALLOW_PATH = [
	{
		UserAgent: '*',
		Disallow: [
			'/dashboard',
			'/tax',
			'/pay',
			'/callback',
			'/accountant',
			'/user/profile',
			'/user/forgot-password',
			'/user/rewards',
			'/auth',
		],
	},
];
const ROBOTS = BUILD_ENV === PRODUCTION ? DISALLOW_PATH : { UserAgent: '*', Disallow: '/' };

const SITEMAP_PATHES = [
	'/terms-of-service',
	'/security',
	'/privacy-policy',
	'/disclaimer',
	'/pricing',
	'/how-cointelli-works',
	'/crypto-tax-guide',
	'/about-us',
	'/user/sign-in',
	'/user/sign-up',
	'/contact-us',
	'/blog',
	'/features',
	'/features/blockchain',
	'/features/exchanges',
];
const strapiAxios = axios.create({ baseURL: process.env.STRAPI_BASE });
const ctAxios = axios.create({ baseURL: process.env.CT_BACK });

let gtmId = '';
if (BUILD_ENV === PRODUCTION) {
	gtmId = 'GTM-W48V576';
} else if (BUILD_ENV === STAGING || BUILD_ENV === DEVELOPMENT) {
	gtmId = 'GTM-P75GWPD';
} else if (BUILD_ENV === QA) {
	gtmId = 'GTM-W2NMZHC';
}

const env = {
	BUILD_ENV,
	COGNITO_BASE_URL: process.env.COGNITO_BASE_URL,
	COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
	COGNITO_POOL_ID: process.env.COGNITO_POOL_ID,
	COGNITO_REGION: process.env.COGNITO_REGION,
	COGNITO_RESPONSE_TYPE: process.env.COGNITO_RESPONSE_TYPE || '',
	COGNITO_SCOPE: process.env.COGNITO_SCOPE || '',
	STRAPI_BASE: process.env.STRAPI_BASE,
	CT_BACK: process.env.CT_BACK,
	CT_FRONT,
	PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
	PAYPAL_URL: process.env.PAYPAL_URL,
	REWARDFUL_KEY: process.env.REWARDFUL_KEY,
	REWARDFUL_CAMPAIGN_ID: process.env.REWARDFUL_CAMPAIGN_ID,
	GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
	RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
	HUB_SPOT_ID: process.env.HUB_SPOT_ID,
};

module.exports = {
	env,
	loading: true,
	components: false,
	telemetry: false,
	debug: BUILD_ENV === DEVELOPMENT,
	ssr: true,
	target: 'server',
	server: {
		host: BUILD_ENV === DEVELOPMENT ? 'localhost' : '0.0.0.0',
		port: process.env.PORT || 3000,
	},

	head: {
		titleTemplate: '%s',
		title: 'Cointelli',
		htmlAttrs: { lang: 'en' },
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ name: 'facebook-domain-verification', content: 'qmrzksbqjx5v7lm1ubtcgy5ufxxtcq' },
			{ hid: 'description', name: 'description', content: '' },
			{ 'http-equiv': 'Content-Security-Policy', content: 'upgrade-insecure-requests' },
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
		script: [
			{ src: '/js/rewardful.js', type: 'text/javascript' },
			{
				src: '/js/rewardful-core.js',
				async: true,
				'data-rewardful': process.env.REWARDFUL_KEY,
				type: 'text/javascript',
			},
			{ src: BUILD_ENV === STAGING ? '/js/smartlook.js' : '', type: 'text/javascript' },
			{ src: '/js/init-chat.js', type: 'text/javascript' },
			{
				src: `//js.hs-scripts.com/${process.env.HUB_SPOT_ID}.js`,
				async: true,
				defer: true,
				id: 'hs-script-loader',
				type: 'text/javascript',
				body: true,
			},
		],
	},

	css: [
		'@/assets/globals/animations.scss',
		'@/assets/globals/font-classes.scss',
		'@/assets/globals/color-classes.scss',
		'@/assets/globals/wrapper.scss',
		'@/assets/globals/dialog.scss',
		'@/assets/globals/font-family.scss',
		'@/assets/globals/marketingApp.scss',
		'@/assets/globals/productApp.scss',
		'@/assets/globals/main.scss',
		'@/assets/globals/introjs-custom.scss',
	],

	plugins: [
		'~/plugins/axios',
		{ src: '~/plugins/amplify', mode: 'client' },
		{ src: '~/plugins/init', mode: 'client' },
		{ src: '~/plugins/mask.js', mode: 'client' },
		{ src: '~/plugins/sse', mode: 'client' },
		{ src: '~/plugins/pwa', mode: 'client' },
		{ src: '~/plugins/lottie.js', mode: 'client' },
		// { src: '~/plugins/role-guard', mode: 'client' },
	],

	buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify', '@nuxtjs/moment'],

	modules: [
		'@nuxtjs/pwa',
		'@nuxtjs/axios',
		'@nuxtjs/gtm',
		'@nuxtjs/style-resources',
		'@nuxtjs/robots',
		'@nuxtjs/recaptcha',
		'nuxt-i18n',
		'nuxt-helmet',
		'nuxt-facebook-pixel-module',
		'cookie-universal-nuxt',
		'@nuxtjs/sitemap',
	],

	helmet: {
		frameguard: false,
		crossOriginOpenerPolicy: false,
		crossOriginResourcePolicy: false,
		crossOriginEmbedderPolicy: false,
		hsts: {
			maxAge: 31536000,
		},
	},

	sitemap: {
		hostname: process.env.CT_FRONT,
		gzip: true,
		exclude: [
			'/user/profile',
			'/user/rewards',
			'/user/forgot-password',
			'/tax/**',
			'/auth/**',
			'/callback/**',
			'/accountant/**',
			'/dashboard',
			'/pay/**',
		],
		routes: async () => {
			/**
			 * Blog
			 */
			let postDatas = [];
			try {
				const postRes = await strapiAxios({
					method: 'GET',
					url: '/posts',
				});
				postDatas = postRes.data;
			} catch (error) {
				console.error(error);
			}
			const postPathes = postDatas.map(data => `/blog/${data.slug}`);

			/**
			 * Exchange
			 */
			let exchangeDatas = [];
			try {
				const exchangeRes = await ctAxios({
					method: 'GET',
					url: '/services/ct/api/resources/transaction-record-providers/enabled',
				});
				exchangeDatas = exchangeRes.data;
			} catch (error) {
				console.error(error);
			}
			const exchangePathes = exchangeDatas.map(data => `/exchanges/${data.slug}`);

			/**
			 * Blockchain
			 */
			let blockchainDatas = [];
			try {
				const blockchainRes = await ctAxios({
					method: 'GET',
					url: '/services/ct/api/resources/assets/non-fiat',
				});
				blockchainDatas = blockchainRes.data;
			} catch (error) {
				console.error(error);
			}
			const blockchainPathes = blockchainDatas.map(data => `/exchanges/${data.slug}`);

			return SITEMAP_PATHES.concat(postPathes).concat(exchangePathes).concat(blockchainPathes);
		},
	},

	robots: ROBOTS,

	vuetify: {
		customVariables: ['~/assets/vuetify.scss'],
		treeShake: true,
		theme: {
			dark: false,
			themes: { dark: PALETTE, light: PALETTE },
		},
		breakpoint: BREAK_POINT, // default xl : 1280
	},

	styleResources: {
		scss: ['~/assets/variables/color.scss', '~/assets/variables/font.scss', '~/assets/variables/common.scss'],
	},

	strapi: {},

	recaptcha: {
		hideBadge: true,
		siteKey: process.env.RECAPTCHA_SITE_KEY,
		version: 3,
	},

	axios: {
		baseURL: process.env.CT_BACK,
		// retry: { retries: 2 },
	},

	i18n: {
		defaultLocale: 'en',
		locales: LOCALES.map(l => l.value),
		vueI18n: {
			fallbackLocale: 'en',
			messages: { en: i18n.en, ko: i18n.ko, es: i18n.es },
		},
		strategy: 'no_prefix',
		detectBrowserLanguage: false,
	},

	gtm: {
		enabled: Boolean(gtmId),
		id: gtmId,
	},

	facebook: {
		disabled: BUILD_ENV !== PRODUCTION,
		track: 'PageView',
		pixelId: '3015219862085446',
		autoPageView: true,
	},

	pwa: {
		meta: {
			title: 'Cointelli',
		},
		manifest: {
			name: 'Cointelli',
			short_name: 'Cointelli',
			description: 'Crypto tax software for beginners',
			lang: 'en',
		},
		workbox: {
			enabled: BUILD_ENV !== DEVELOPMENT,
			cacheAssets: false,
			offline: false,
		},
		icon: {
			// source: '/logo/icon.png',
			// fileName: 'icon.png',
			// cacheDir: '/node_modules/.cache/pwa/icon',
		},
	},

	build: {
		analyze: false,
		extractCSS: false,
		terser: {
			terserOptions: {
				compress: {
					drop_console: BUILD_ENV === PRODUCTION,
				},
			},
		},
	},

	router: {
		middleware: ['authGuard', 'injectReferral'],
		extendRoutes(routes, resolve) {
			routes.push(
				{
					name: 'Reward page for accountant',
					path: '/accountant/rewards',
					component: resolve(__dirname, 'pages/user/rewards.vue'),
				},
				{
					name: 'Profile page for accountant',
					path: '/accountant/profile',
					component: resolve(__dirname, 'pages/user/profile.vue'),
				},
			);
		},
	},

	publicRuntimeConfig: {
		recaptcha: {
			siteKey: process.env.RECAPTCHA_SITE_KEY,
		},
	},
};
