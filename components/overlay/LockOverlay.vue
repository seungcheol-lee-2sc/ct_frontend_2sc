<template>
	<v-overlay absolute :value="lock" color="white" opacity="0.7" z-index="0">
		<div class="text-center">
			<v-hover v-slot="{ hover }">
				<v-avatar id="lockAvatar" :color="mintButton ? 'successDark' : 'primary'" size="72" @click="onClickButton">
					<v-icon large color="white">
						<template v-if="clickable && hover">mdi-lock-open-outline</template>
						<template v-else>mdi-lock-outline</template>
					</v-icon>
				</v-avatar>
			</v-hover>

			<div class="lockMessage">
				{{ msg }}
			</div>
		</div>
	</v-overlay>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class LockOverlay extends Vue {
	@Prop({ required: true }) lock!: boolean;
	@Prop() msg!: string;
	@Prop() clickable!: boolean;
	@Prop() mintButton!: boolean;

	onClickButton() {
		if (!this.clickable) return;
		this.$emit('onclick');
	}
}
</script>

<style lang="scss" scoped>
.text-center {
	text-align: center;
}
.lockMessage {
	margin-top: 20px;
	font-size: 14px;
	line-height: 26px;
	letter-spacing: 0.25px;
	font-family: $poppins;
	font-weight: 500;
	color: $primary;
	padding: 0 20px;
}
</style>
