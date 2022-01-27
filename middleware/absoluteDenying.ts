import { Middleware } from '@nuxt/types';

const absoluteDenying: Middleware = ({ redirect }) => {
	redirect('/');
};

export default absoluteDenying;
