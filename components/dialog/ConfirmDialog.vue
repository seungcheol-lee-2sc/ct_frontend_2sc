<template>
	<v-dialog
		id="confirmDialog"
		:value="confirmation.dialog"
		persistent
		max-width="500"
		@keydown.esc="
			() => {
				if (confirmation.lock) {
					closeConfirmation;
				}
			}
		"
	>
		<div class="confirmWrapper" :class="confirmation.borderColor ? `border-${confirmation.borderColor}` : ''">
			<v-card class="dialogInner" color="white" elevation="0">
				<div class="titleText">{{ confirmation.title }}</div>
				<div class="descText">
					<div v-html="reformedText"></div>
				</div>
				<div class="buttonsWrapper -right">
					<Button v-if="confirmation.cancelBtn" :fontsize="14" :text="true" color="secondary" @click="onClickCancel">
						{{ $t('common.cancel') }}
					</Button>
					<Button
						:id="confirmation.id || 'okBtn'"
						:fontsize="14"
						:rounded="true"
						color="secondary"
						fontcolor="white"
						@click="onClickAction"
					>
						{{ confirmation.btnText }}
					</Button>
				</div>
			</v-card>
		</div>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Mutation, State, Vue, Watch } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import { CLOSE_CONFIRMATION } from '~/store';
import { ICognitoUserExt } from '~/types/auth/types';
import { nl2br } from '~/utils/string';
import { IConfirmation } from '~/types/common/types';

@Component({
	components: {
		Button,
	},
})
export default class ConfirmDialog extends Vue {
	@State(state => state.confirmation) confirmation!: IConfirmation;
	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;

	@Watch('confirmation.dialog')
	watchDialog(newVal: boolean) {
		if (newVal) {
			setTimeout(() => {
				document.getElementById('okBtn')?.focus();
			});
		}
	}

	get descTextArr(): string[] {
		return this.confirmation.text.split('\n');
	}

	get reformedText(): string {
		return nl2br(this.confirmation.text);
	}

	@Mutation(CLOSE_CONFIRMATION) closeConfirmation!: any;

	onClickCancel() {
		this.closeConfirmation();
	}

	onClickOutside() {
		this.closeConfirmation();
	}

	onClickAction() {
		this.confirmation.pending();
		this.closeConfirmation();
	}
}
</script>

<style lang="scss" scoped>
.confirmWrapper {
	font-family: $poppins;
	text-align: left;

	.dialogInner {
		padding: 24px;
		overflow: hidden;
		border-radius: $round-lg;
		border-width: 2px;

		.titleText {
			color: $primary;
			font-size: 23px;
			// text-transform: capitalize;
		}
		.descText {
			font-weight: $font-medium;
			color: $primary;
			font-size: 13px;
			margin-top: 17px;
			margin-bottom: 64px;
		}
	}
}
</style>
