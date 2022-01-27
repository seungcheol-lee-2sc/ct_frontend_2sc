import { Middleware } from '@nuxt/types';
import { CONFIRM_ERROR } from '~/store';
import { LOAD_PROVIDER_SOURCES } from '~/store/provider';
import { IUserTransactionRecordSource } from '~/types/provider/types';

const loadSources: Middleware = async ({ store, redirect, from }) => {
	const sources: IUserTransactionRecordSource[] | false = await store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
	if (sources !== false && sources?.length > 0 && sources.filter(v => v.count && v.count > 0).length > 0) return;

	const fromProduct = Boolean(from && from.meta && from.meta[0] && from.meta[0].auth);
	if (process.client && fromProduct) {
		store.commit(CONFIRM_ERROR, { title: 'Woops!', text: 'You have to import your transactions first.' });
	}
	redirect('/tax/import');
};

export default loadSources;
