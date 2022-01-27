<template>
	<span></span>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { SIGN_OUT } from '~/store/auth';
import { EAuthRole } from '~/types/common/types';
import { clearWidgetCookies } from '~/utils/chat';

@Component({
	layout: 'empty',
	meta: { auth: true, roles: [EAuthRole.INDIVIDUAL, EAuthRole.PROFESSIONAL] },
})
export default class SignOut extends Vue {
	fetchOnServer() {
		return false;
	}

	async fetch() {
		try {
			clearWidgetCookies(true);
		} catch (error) {
			console.error(error);
		}
		await this.$store.dispatch(`auth/${SIGN_OUT}`);
		this.$router.push('/');
	}
}
</script>
