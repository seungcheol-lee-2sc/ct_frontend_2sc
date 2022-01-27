<template>
	<v-dialog v-model="dialog" width="650" persistent @keydown.esc="close">
		<v-card class="dialogCardWrapper cardWrapper">
			<v-icon class="closeBtn" color="primaryLight" @click="close">mdi-close</v-icon>
			<div class="titleWrapper">
				<div class="titleText">{{ $t('page.profile.deleteAccount.title') }}</div>
				<div class="askingText">
					{{ $t('page.profile.deleteAccount.ask') }}
				</div>
			</div>

			<v-form ref="form" v-model="formValid" @submit.prevent="onSubmitForm">
				<AlertCard v-if="errorMsg && selectedReasons" :msg="errorMsg" color="error" icon="mdi-alert-circle-outline" />

				<div>
					<div v-for="reason in reasons" :key="`reason-${reason.origin}`" class="checkboxLine">
						<Checkbox v-model="reason.checked" color="secondary" @click="reason.checked = !reason.checked" />
						<span class="checkboxLabel">{{ reason.translate }}</span>
					</div>
				</div>
				<div style="margin-top: 32px">
					<v-textarea
						v-model.trim="detail"
						:counter="500"
						maxlength="500"
						outlined
						:disabled="loading"
						:placeholder="$t('page.profile.deleteAccount.placeholder')"
					/>
				</div>

				<div class="buttonsWrapper -right">
					<Button
						:height="44"
						:rounded="true"
						:block="true"
						:disabled="loading"
						:loading="loading"
						fontcolor="white"
						color="primary"
						type="submit"
					>
						{{ loading ? deletingText : $t('common.send') }}
					</Button>
				</div>
			</v-form>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Getter, State, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import Checkbox from '../input/Checkbox.vue';
import { CONFIRM_ACTION, CONFIRM_ERROR, ADD_TO_MESSAGE_QUEUE, CUSTOM_CONFIRM_ACTION } from '~/store';
import AlertCard from '~/components/card/AlertCard.vue';
import { DELETE_ACCOUNT_FROM_DB, WITHDRAWAL_CONTACT } from '~/store/auth';
import { IAffiliateBody } from '~/types/affiliate/types';
import { UPDATE_AFFILIATE } from '~/store/affiliate';
import { IAffiliateReq } from '~/types/affiliate/dto';
import { DELETE_INVITED_OBJECT, GET_INVITATIONS_BY_EMAIL } from '~/store/accountant';
import { IInvitedObject } from '~/types/accountant/types';
import { ICognitoUserExt } from '~/types/auth/types';
import { returnErrorMsg } from '~/utils/application';
import { IConfirmation } from '~/types/common/types';

interface IReason {
	translate: string | any;
	origin: string;
	checked: boolean;
}

@Component({
	components: {
		AlertCard,
		Button,
		Checkbox,
	},
})
export default class DeleteAccountDialog extends Vue {
	$refs!: {
		form: HTMLFormElement;
	};

	@Prop({ required: true }) dialog!: boolean;

	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt | null;
	@State(({ affiliate }) => affiliate.affiliateInfo) affiliateInfo!: IAffiliateBody;
	@State(({ accountant }) => accountant.invitations) invitations!: IInvitedObject[];

	MAX = 500;
	formValid: boolean = false;
	errorMsg: string = '';
	loading: boolean = false;
	deletingText: string = '';

	detail: string = ' ';
	reasons: IReason[] = [
		{
			origin: "I'm getting too many emails",
			translate: this.$t('page.profile.deleteAccount.selectList.reason1'),
			checked: false,
		},
		{
			origin: "I'm not getting any value from my membership",
			translate: this.$t('page.profile.deleteAccount.selectList.reason2'),
			checked: false,
		},
		{
			origin: 'I have a privacy concern',
			translate: this.$t('page.profile.deleteAccount.selectList.reason3'),
			checked: false,
		},
		{
			origin: "It's difficult to collaborate with my tax professionals",
			translate: this.$t('page.profile.deleteAccount.selectList.reason4'),
			checked: false,
		},
		{
			origin: 'Other',
			translate: this.$t('common.other'),
			checked: false,
		},
	];

	@Getter('auth/userEmail') userEmail!: string;

	async disableAffiliateState(): Promise<boolean> {
		const payload: IAffiliateBody = { state: 'disabled' };
		if (!this.affiliateInfo) return true;
		const id = this.affiliateInfo.id || '';
		const params: IAffiliateReq = { affiliateId: id };
		if (!id) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('message.notFoundTarget', { target: 'Affiliated id' }),
			});
			return false;
		}
		const result: string = await this.$store.dispatch(`affiliate/${UPDATE_AFFILIATE}`, { payload, params });
		return result === 'success';
	}

	async getInvitations() {
		const params = { type: 'CLIENT' };
		const result = await this.$store.dispatch(`accountant/${GET_INVITATIONS_BY_EMAIL}`, {
			params,
			userEmail: this.userEmail,
		});
		return result;
	}

	async deleteInvitation(invitedObject: IInvitedObject) {
		const result = await this.$store.dispatch(`accountant/${DELETE_INVITED_OBJECT}`, invitedObject.id);
		return result;
	}

	async deletePreviousInvitations() {
		const resultOfInvitation = await this.getInvitations();
		if (!resultOfInvitation) return false;
		if (this.invitations.length === 0) return true;
		const result = await Promise.all(
			this.invitations.map(async invitation => {
				return await this.deleteInvitation(invitation);
			}),
		);
		if (result.includes(false)) return false;
		return true;
	}

	onSubmitForm() {
		if (this.reasons.filter(v => v.checked).length === 0) {
			this.errorMsg = String(this.$t('page.profile.deleteAccount.validation1'));
			return;
		}

		if (!this.formValid) {
			this.errorMsg = String(this.$t('message.submitAlert'));
			return;
		}

		if (!this.userEmail) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: `${this.$t('message.fail.loadTarget', { target: 'user email' })}. ${this.$t('message.refreshPage')}`,
			});
			return;
		}

		if (!this.user) {
			this.$store.commit(CONFIRM_ERROR, {
				title: 'User not found',
				text: `${this.$t('message.refreshPage')}`,
			});
			return;
		}

		this.errorMsg = '';

		this.$store.commit(CONFIRM_ACTION, {
			title: 'Are you sure?',
			text: this.$t('page.profile.deleteAccount.checkAgain'),
			pending: async () => {
				if (this.user) {
					this.deletingText = 'Deleting your activities...';
					this.loading = true;
					const res: boolean[] = await Promise.all([this.deletePreviousInvitations(), this.disableAffiliateState()]);
					if (res.includes(false)) {
						this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
							color: 'error',
							msg: `${this.$t('message.fail.delete')}. ${this.$t('message.tryAgain')}`,
						});
						this.loading = false;
						return;
					}

					this.$store.dispatch(`auth/${WITHDRAWAL_CONTACT}`);

					this.deletingText = 'Deleting your transactions...';
					const success: boolean = await this.$store.dispatch(`auth/${DELETE_ACCOUNT_FROM_DB}`);

					if (!success) {
						this.$store.commit(ADD_TO_MESSAGE_QUEUE, {
							color: 'error',
							msg: `${this.$t('message.fail.delete')}. ${this.$t('message.tryAgain')}`,
						});
						this.loading = false;
						return;
					}

					this.user.deleteUser((error, _) => {
						if (error) {
							console.error(error);
							this.$store.commit(ADD_TO_MESSAGE_QUEUE, {
								color: 'error',
								msg: `${returnErrorMsg(error.message)}. ${this.$t('message.tryAgain')}`,
							});
							this.loading = false;
							return;
						}

						const data: IConfirmation = {
							dialog: true,
							title: 'Good bye 🙂',
							text: `${this.$t('message.goodBye')}`,
							btnText: 'Ok',
							cancelBtn: false,
							lock: true,
							pending: () => {
								this.$router.push('/callback/sign-out');
								return new Promise(_resolve => {});
							},
						};

						this.$store.commit(CUSTOM_CONFIRM_ACTION, data);
					});
				}
			},
		});
	}

	close() {
		if (this.loading) return;
		this.errorMsg = '';
		this.$refs.form?.reset();
		this.$emit('close');
	}
}
</script>

<style lang="scss" scoped>
.cardWrapper {
	font-family: $poppins;
	padding: 24px;

	.titleWrapper {
		margin-bottom: 48px;

		.titleText {
			margin-bottom: 16px;
			font-size: 23px;
		}

		.askingText {
			font-size: 13px;
			font-weight: $font-medium;
			color: $primaryLight;
		}
	}

	.checkboxLine {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 16px;

		.checkboxLabel {
			font-family: $roboto;
			font-size: 16px;
			color: $primary;
		}
	}
}
</style>
