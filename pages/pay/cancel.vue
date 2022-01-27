<template>
	<div>Payment is canceled</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { CT_PAY_REDIRECT } from '~/utils/constants';

@Component({
	layout: 'empty',
	asyncData: ({ redirect, $cookies }) => {
		const getCookie: string | null = $cookies.get(CT_PAY_REDIRECT) || null;
		redirect(getCookie || '/user/plans');
	},
})
export default class PayCancel extends Vue {}
</script>
