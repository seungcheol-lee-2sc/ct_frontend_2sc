<template>
	<span></span>
</template>

<script lang="ts">
import introJs from 'intro.js';
import { Vue, Component, State } from 'nuxt-property-decorator';
import { UPDATE_ATTRIBUTES } from '~/store/auth';
import { ICognitoUserExt, EBoolean } from '~/types/auth/types';
import { tourContent } from '~/utils/application';

export interface ITourItem {
	selector: string | any;
	src: string | any;
	title: string | any;
	content: string | any;
	skipBtn: string | any;
	nextBtn: string | any;
	position?: string;
}

@Component
export default class WelcomeDefault extends Vue {
	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;

	async callback() {
		await this.$store.dispatch(`auth/${UPDATE_ATTRIBUTES}`, { 'custom:tour': EBoolean.TRUE });
	}

	startTour() {
		this.$emit('close');

		const temp = introJs()
			.setOptions({
				scrollToElement: true,
				exitOnOverlayClick: false,
				showButtons: false,
				showBullets: false,
				// @ts-ignore
				steps: this.targetContents.map(v => ({
					element: document.querySelector(v.selector),
					intro: tourContent(v.src, v.title, v.content, v.skipBtn, v.nextBtn),
					position: v.position || '',
				})),
			})
			// @ts-ignore
			.onbeforeexit(() => {
				// @ts-ignore
				// return window['tour']._currentStep !== this.targetContents.length ? confirm('Are you sure to skip?') : true;
				return true;
			})
			.onexit(() => {
				this.callback();
			})
			.oncomplete(() => {})
			.start();

		// @ts-ignore
		window.tour = temp;
	}
}
</script>
