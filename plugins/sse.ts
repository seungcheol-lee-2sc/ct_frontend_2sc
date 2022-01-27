import { Plugin } from '@nuxt/types';
import Vue from 'vue';
import VueSSE, { SSEManager } from 'vue-sse';

declare module 'vue/types/vue' {
	interface Vue {
		$sse: SSEManager;
	}
}

const init: Plugin = () => {
	Vue.use(VueSSE, {
		format: 'json',
		withCredentials: false, // false === Cookie isn't sent to server
		forcePolyfill: true,
	});
};

export default init;
