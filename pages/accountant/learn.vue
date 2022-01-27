<template>
	<div></div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { EAuthRole } from '~/types/common/types';

@Component({
	layout: 'product',
	meta: { auth: true, roles: [EAuthRole.PROFESSIONAL] },
})
export default class Learn extends Vue {}
</script>
