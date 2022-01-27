<template>
	<div class="failCardWrapper">
		<v-img src="/characters/with-glasses.png" alt="Sad face image" width="100%" max-width="80" />
		<div class="texts">
			{{ $t('message.failToLoadData') }} <br />
			{{ $t('message.refreshSection') }}
		</div>
		<v-btn icon @click="onClickRefresh">
			<v-icon>mdi-refresh</v-icon>
		</v-btn>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class FailedAndRefreshCard extends Vue {
	onClickRefresh() {
		this.$emit('refresh');
	}
}
</script>

<style lang="scss" scoped>
.failCardWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 8px;
	.texts {
		font-family: $poppins;
		text-align: center;
		font-size: 14px;
		color: $error;
		font-weight: $font-medium;
		line-height: 1.4;
	}
}
</style>
