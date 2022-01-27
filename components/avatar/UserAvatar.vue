<template>
	<div
		class="userAvatar"
		:class="`bg-${background}`"
		:style="{ width: `${size}px`, minWidth: `${size}px`, height: `${size}px`, minHeight: `${size}px` }"
	>
		<v-img v-if="avatarImageUrl" :src="avatarImageUrl"></v-img>
		<v-icon v-else-if="!avatarName" color="primary">mdi-account-outline</v-icon>
		<span v-else class="userName">
			{{ avatarName || '' }}
		</span>
	</div>
</template>

<script lang="ts">
import { Component, Getter, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class UserAvatar extends Vue {
	@Prop({ required: true }) size!: number;
	@Prop() background!: string;

	@Getter('auth/avatarName') avatarName!: string;
	@Getter('auth/avatarImageUrl') avatarImageUrl!: string;
}
</script>

<style lang="scss" scoped>
.userAvatar {
	background-color: $primaryLight;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 100%;

	.userName {
		font-size: 14px;
		line-height: 26px;
		letter-spacing: 0.25px;
		font-family: $poppins;
		font-weight: 500;
		color: $white;
	}
}
</style>
