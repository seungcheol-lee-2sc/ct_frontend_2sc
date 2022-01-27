import { Middleware } from '@nuxt/types';
import { ICognitoUserExt } from '~/types/auth/types';
import { getUserData } from '~/utils/application';
import { CT_FRONT } from '~/utils/constants';

const injectReferral: Middleware = ({ store, redirect, $cookies, route }) => {
	const referralInCookie = $cookies.get('rewardful.referral');
	if (referralInCookie) return;
	if ('referral' in route.query) return;

	if (process.server) {
		const userData: any | undefined = getUserData($cookies);
		if (!userData) return;

		const referralIdAttr: any | undefined = userData?.UserAttributes?.find((v: any) => v.Name === 'custom:referral_id');
		const savedReferralId = referralIdAttr?.Value || '';
		if (savedReferralId) {
			return redirect(`${CT_FRONT}${route.path}`, { ...route.query, referral: savedReferralId });
		}
	}

	if (process.client && route.path === '/tax/report') {
		const user: ICognitoUserExt | null = store.state.auth.user;
		if (!user) return;

		const savedReferralId = user.attributes['custom:referral_id'] || '';
		if (savedReferralId) {
			return redirect(`${CT_FRONT}${route.path}`, { ...route.query, referral: savedReferralId });
		}
	}
};

export default injectReferral;
