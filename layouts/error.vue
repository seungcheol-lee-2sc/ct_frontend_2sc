<template>
	<div class="topBodyWrapper bottomBodyWrapper">
		<div class="sectionWrapper">
			<h2 style="font-size: 58px" v-text="title" />
			<p style="font-size: 15px; margin-top: 40px" v-text="msg" />
			<nuxt-link to="/" v-text="'Home'" />
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { BASE_SITE_TITLE } from '~/utils/constants';

@Component
export default class Error extends Vue {
	head = () => ({
		title: `${BASE_SITE_TITLE} | Error`,
	});

	@Prop(Object) readonly error: any;

	get title(): string {
		if (!this.error) return '';

		if (this.error.statusCode === 400) {
			return '400 | Functional Error';
		} else if (this.error.statusCode === 404) {
			return '404 | Not Found';
		} else if (this.error.statusCode === 403) {
			return '403 | Error';
		} else {
			return 'An Error occurred';
		}
	}

	get msg(): string {
		if (!this.error) return '';

		if (this.error.statusCode === 400) {
			return 'Sorry, Please Try again';
		} else if (this.error.statusCode === 404) {
			return 'Sorry, but the page you are looking for is not found. Please make sure you have typed the current URL.';
		} else if (this.error.statusCode === 403) {
			return "Sorry, you don't have access to view this page.";
		} else {
			return '';
		}
	}
}
</script>
