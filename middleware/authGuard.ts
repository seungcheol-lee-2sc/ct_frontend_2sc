import { Middleware } from '@nuxt/types';
import { Auth } from 'aws-amplify';
import { PAGE_LOADER } from '~/store';
import { isAccountant, SET_ME } from '~/store/auth';
import { EBoolean } from '~/types/auth/types';
import { EAuthRole } from '~/types/common/types';
import { getAccessToken, getUserData } from '~/utils/application';
import { CT_FRONT, IMPORT_ONLY } from '~/utils/constants';

const includingPath = (pathes: string[], path: string): boolean => {
	let result: boolean = false;
	for (let i = 0; i < pathes.length; i++) {
		if (path.includes(pathes[i])) {
			result = true;
			break;
		}
	}
	return result;
};

const authGuard: Middleware = async ({ store, $cookies, route, redirect }) => {
	store.commit(PAGE_LOADER, false);

	let authenticated = false;
	const authMeta: boolean | undefined = route.meta?.find(
		(metaItem: any) => metaItem.auth === true || metaItem.auth === false,
	)?.auth;
	const rolesMeta: EAuthRole[] | undefined = route.meta?.find((metaItem: any) => metaItem.roles)?.roles;

	let user = null;
	let professional: boolean | undefined;
	if (process.server) {
		authenticated = Boolean(getAccessToken($cookies));
		const userData: any | undefined = getUserData($cookies);
		const accountantAttr: any | undefined = userData?.UserAttributes?.find(
			(v: any) => v.Name === 'custom:is_accountant',
		);
		// const username = userData?.UserAttributes?.find((v: any) => v.Name === 'username');
		professional = accountantAttr?.Value === EBoolean.TRUE;
	} else {
		try {
			user = await Auth.currentAuthenticatedUser();
			authenticated = true;
			professional = isAccountant(user);
		} catch (error) {
			professional = false;
			authenticated = false;
		}
		!user && store.commit(`auth/${SET_ME}`, user);
	}

	/**
	 * Env guard (QA)
	 */
	if (IMPORT_ONLY) {
		const allowedMarketingPages = [
			'/user/sign-in',
			'/user/sign-up',
			'/user/forgot-password',
			'/auth',
			'/auth/',
			'/disclaimer',
			'/privacy-policy',
			'/security',
			'/terms-of-service',
			'/callback/sign-out',
			'/callback/login-import',
			'/callback/paypal',
			'/event',
		];
		const allowedProductPages = ['/tax/import', '/callback/sign-out', '/callback/login-import', '/callback/paypal'];

		if (authMeta === false && authenticated) {
			redirect(`${CT_FRONT}/tax/import`);
		} else if (authMeta === false && !authenticated) {
			!includingPath(allowedMarketingPages, route.path) && redirect(`${CT_FRONT}/event`);
		} else if (authMeta === true && authenticated) {
			!includingPath(allowedProductPages, route.path) && redirect(`${CT_FRONT}/tax/import`);
		} else if (authMeta === true && !authenticated) {
			redirect(`${CT_FRONT}/event`);
		} else {
			!includingPath(allowedMarketingPages, route.path) && redirect(`${CT_FRONT}/event`);
		}
	}

	if (authMeta === true) {
		/**
		 * Role guard
		 */
		// if (user && process.client && BUILD_ENV !== PRODUCTION && BUILD_ENV !== DEVELOPMENT && BUILD_ENV !== QA) {
		// 	const groups = user.signInUserSession?.accessToken?.payload['cognito:groups'];
		// 	if (!groups.includes('ROLE_ADMIN')) {
		// 		window.alert('Use only for admin');
		// 		redirect(`${CT_FRONT}`);
		// 	}
		// }

		if (!authenticated) {
			redirect(`${CT_FRONT}`);
		} else if (!rolesMeta?.includes(EAuthRole.INDIVIDUAL) && !professional) {
			redirect(`${CT_FRONT}/tax/import`);
		} else if (!rolesMeta?.includes(EAuthRole.PROFESSIONAL) && professional) {
			redirect(`${CT_FRONT}/accountant/manage-clients`);
		}
	} else if (authMeta === false && authenticated) {
		redirect(`${CT_FRONT}/tax/import`);
	}
};

export default authGuard;
