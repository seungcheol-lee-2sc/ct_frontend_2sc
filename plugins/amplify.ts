import { Plugin } from '@nuxt/types';
import Amplify, { Hub } from 'aws-amplify';
import awsConfig from './amplify.config';
import { COOKIE_STORAGE } from '~/utils/constants';
import { REFRESH_SESSION, RETRIEVE_ME } from '~/store/auth';
import { getRefreshToken, removeTokens } from '~/utils/application';
import { CUSTOM_CONFIRM_ACTION } from '~/store';

const INTERVAL_DELAY: number = 1000 * 60 * 30;
let interval: any = null;
const EXCLUDE_PATH = ['/callback/login-import', '/callback/paypal'];

const amplify: Plugin = async ({ store, route, $cookies, redirect }) => {
	/**
	 * Amplify
	 */
	if (!EXCLUDE_PATH.includes(route.path)) {
		const cookieStorage = {
			domain: COOKIE_STORAGE,
			secure: true,
			path: '/',
			expires: 365,
			// sameSite: 'strict',
		};
		Amplify.configure({ ...awsConfig, cookieStorage });
		// console.log(Auth.configure());
	}

	const listener = (data: any) => {
		switch (data.payload.event) {
			case 'tokenRefresh_failure':
				console.error('Token refreshing failed : ', data);
				store.commit(CUSTOM_CONFIRM_ACTION, {
					dialog: true,
					title: 'Session expired',
					text: 'Your login session was expired.<br/> Please sign in again. 🙂',
					btnText: 'Ok',
					cancelBtn: false,
					pending: () => {
						removeTokens($cookies);
						redirect('/user/sign-in');
						return new Promise(_resolve => {});
					},
				});
				break;
		}
	};

	Hub.listen('auth', listener);

	/**
	 * Token guard
	 */
	const authMeta = route.meta?.find((metaItem: any) => metaItem.auth === true || metaItem.auth === false)?.auth;
	const refreshToken = getRefreshToken($cookies);

	if (authMeta === true) {
		if (!refreshToken) {
			redirect('/user/sign-in');
			return;
		}
	}

	/**
	 * Refresh user periodically
	 */
	await store.dispatch(`auth/${REFRESH_SESSION}`);
	await store.dispatch(`auth/${RETRIEVE_ME}`);
	interval !== null && window?.clearInterval(interval);
	interval = window?.setInterval(async () => {
		await store.dispatch(`auth/${REFRESH_SESSION}`);
		store.dispatch(`auth/${RETRIEVE_ME}`);
	}, INTERVAL_DELAY);
};

export default amplify;
