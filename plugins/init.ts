import { Plugin } from '@nuxt/types';
import { MB, PC } from '~/store';
import { MIN_WIDTH } from '~/utils/constants';

const init: Plugin = ({ store }) => {
	/**
	 * App setting
	 */
	deviceSizeChecker(store);
	window.addEventListener('resize', (): void => deviceSizeChecker(store));
};

export function deviceSizeChecker(store: any) {
	const width = window.innerWidth;
	width >= MIN_WIDTH ? store.commit(PC) : store.commit(MB);
}

export default init;
