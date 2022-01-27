import { Plugin } from '@nuxt/types';
import { Auth } from 'aws-amplify';
import { BUILD_ENV, CT_FRONT, DEVELOPMENT, PRODUCTION, QA } from '~/utils/constants';

const roleGuard: Plugin = async ({ route, redirect }) => {
	const authMeta: boolean | undefined = route.meta?.find(
		(metaItem: any) => metaItem.auth === true || metaItem.auth === false,
	)?.auth;

	/**
	 * Role guard
	 */
	if (authMeta && process.client && BUILD_ENV !== PRODUCTION && BUILD_ENV !== DEVELOPMENT && BUILD_ENV !== QA) {
		const user = await Auth.currentAuthenticatedUser();
		if (!user) {
			window.alert('Uesr not found');
			redirect(`${CT_FRONT}`);
			return;
		}
		const groups = user.signInUserSession.accessToken.payload['cognito:groups'];
		if (!groups.includes('ROLE_ADMIN')) {
			window.alert('Use only for admin');
			redirect(`${CT_FRONT}`);
		}
	}
};

export default roleGuard;
