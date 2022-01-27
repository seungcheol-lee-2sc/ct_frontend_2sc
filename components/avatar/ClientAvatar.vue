<template>
	<div class="userAvatar" :class="`bg-${color}`" :style="{ width: `${size}px`, height: `${size}px` }">
		<v-img v-if="client.imageUrl" :src="client.imageUrl" alt="profile-image" class="clientImage"></v-img>
		<v-icon v-else-if="!name" color="secondary">mdi-account-outline</v-icon>
		<span v-else class="clientName">
			{{ name || '' }}
		</span>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { IInvitedObject } from '~/types/accountant/types';

@Component
export default class ClientAvatar extends Vue {
	@Prop({ required: true }) client!: IInvitedObject;
	@Prop({ required: true }) size!: number;
	@Prop() index!: number;
	color: string = '';
	paleColors = ['secondaryDarkPale', 'secondaryPale', 'tertiaryDarkPale', 'orangeDarkPale', 'purpleDarkPale'];

	get name() {
		return this.client.name ? this.client.name[0].toUpperCase() : null;
	}

	created() {
		this.color = this.paleColors[this.index % 5] || 'secondaryDarkPale';
	}
}
</script>

<style lang="scss" scoped>
.userAvatar {
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 100%;

	.clientImage {
		border-radius: $round-full;
	}

	.clientName {
		font-size: 15px;
		font-family: $poppins;
		font-weight: $font-medium;
		color: $white;
		user-select: none;
	}
}
</style>
