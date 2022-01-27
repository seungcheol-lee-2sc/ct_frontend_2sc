<template>
	<v-dialog id="signingErrorDialog" key="signingErrorDialog" :value="dialog" persistent max-width="500">
		<div class="dialogInner">
			<MovingObject :size="12" color="orangeLight" left="calc(50% - 100px)" top="22px" :movement="EMoveType.BEAT" />
			<MovingObject :size="24" color="orangePale" left="calc(50% + 100px)" top="54px" :movement="EMoveType.BEAT" />
			<img class="smile" src="/characters/surprised-smile-1.png" />

			<div class="descText" v-html="signingError.text"></div>
			<div class="buttonsWrapper">
				<Button
					id="confirmButton"
					:fontsize="14"
					:width="182"
					:height="44"
					:rounded="true"
					color="secondary"
					fontcolor="white"
					@click="closeDialog"
				>
					Confirm
				</Button>
			</div>
			<div v-if="signingError.linkText && signingError.linkPath" class="linkTextWrapper">
				<LinkText to="" @click="onClickLinkText">{{ signingError.linkText }}</LinkText>
			</div>
		</div>
	</v-dialog>
</template>

<script lang="ts">
import { Component, State, Vue, Watch } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import MovingObject, { EMoveType } from '../item/MovingObject.vue';
import LinkText from '../text/LinkText.vue';
import { ISigningError } from '~/types/common/types';
import { CLOSE_SIGNING_ERROR } from '~/store';

@Component({
	components: {
		Button,
		MovingObject,
		LinkText,
	},
})
export default class SigningErrorDialog extends Vue {
	EMoveType = EMoveType;
	@State(state => state.signingError) signingError!: ISigningError;

	@Watch('dialog')
	watchDialog(newVal: boolean) {
		if (newVal) {
			setTimeout(() => {
				document.getElementById('confirmButton')?.focus();
			});
		}
	}

	get dialog(): boolean {
		return this.signingError.dialog;
	}

	closeDialog() {
		this.$store.commit(CLOSE_SIGNING_ERROR);
	}

	onClickLinkText() {
		this.$router.push(this.signingError.linkPath);
		this.closeDialog();
	}
}
</script>

<style lang="scss" scoped>
.dialogInner {
	position: relative;
	padding: 24px;
	padding-top: 48px;
	padding-bottom: 54px;
	background-color: $white;
	text-align: center;

	.smile {
		margin-bottom: 36px;
	}

	.descText {
		font-size: 19px;
		letter-spacing: 0.15px;
		color: $primary;
		font-weight: $font-medium;
		font-family: $poppins;
		margin-bottom: 16px;
	}

	.linkTextWrapper {
		margin-top: 8px;
	}
}
</style>
