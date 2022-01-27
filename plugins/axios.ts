import { Plugin } from '@nuxt/types';
import { getAccessToken } from '~/utils/application';

const axios: Plugin = ({ $axios, $cookies }) => {
	delete $axios.defaults.headers?.common?.cookie; // For preventing 413 error

	$axios.onRequest(() => {
		const token = getAccessToken($cookies);
		$axios.setToken(token, 'Bearer');
	});
};

export default axios;
