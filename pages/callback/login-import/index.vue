<template>
	<div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { EAuthRole } from '~/types/common/types';

@Component({
	layout: 'empty',
	meta: { auth: true, roles: [EAuthRole.INDIVIDUAL, EAuthRole.PROFESSIONAL] },
})
export default class CallbackIndex extends Vue {}
</script>
