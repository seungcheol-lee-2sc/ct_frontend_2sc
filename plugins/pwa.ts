import { Plugin } from '@nuxt/types';

const init: Plugin = async () => {
	// @ts-ignore
	const workbox = await window.$workbox;

	if (!workbox) {
		console.debug("Workbox couldn't be loaded.");
		return;
	}

	console.log('Workbox is ready');

	workbox.addEventListener('installed', (event: any) => {
		if (!event.isUpdate) {
			console.debug('The PWA is on the latest version.');
			return;
		}

		console.debug('There is an update for the PWA, reloading...');
		// window.location.reload();
	});

	workbox.addEventListener('activated', (event: any) => {
		console.log('activate : ', event);
	});
};

export default init;
