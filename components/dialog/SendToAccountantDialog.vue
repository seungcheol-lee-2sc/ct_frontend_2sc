<template>
	<v-dialog v-model="dialog" max-width="745" persistent content-class="ct-scroll" @keydown.esc="close">
		<template v-if="!loading && isSuccessToLoad">
			<v-card v-if="sendStatus === ESendEmailStatus.BEFORE" class="dialogCardWrapper -large overHidden">
				<v-icon class="closeBtn -hoverIcon" color="primaryLight" @click="close" v-text="'mdi-close'" />
				<div class="dialogTitle">Send to accountant</div>
				<div class="text-center">
					<MovingObject
						:size="154"
						left="-16px"
						top="10px"
						:movement="EMoveType.SHAKE"
						img="/illust-item/cloud01.png"
					/>
					<MovingObject
						:size="249"
						left="calc(100% - 190px)"
						top="54px"
						:movement="EMoveType.SHAKE"
						img="/illust-item/cloud02.png"
					/>
				</div>
				<div class="dialogInnerForm">
					<v-form ref="form" v-model="formValid" @submit.prevent="onClickSend">
						<div class="formSubtitle">Select report year</div>
						<div class="yearButtonWrapper">
							<template v-for="year in purchasedYearList">
								<Button
									:key="`purchasedYear-${year}`"
									color="primary"
									:fontsize="22"
									:height="64"
									:outlined="true"
									:disabled="sending"
									@click="selectYear(year)"
								>
									<span class="yearButtonInner">
										<Checkbox color="secondary" :value="selectedYears.includes(year)" :disabled="sending" />

										{{ year }}
										<span></span>
									</span>
								</Button>
							</template>
						</div>
						<div class="formSubtitle">Input your accountant mail</div>
						<div class="accountantEmail">
							<v-text-field
								v-model.trim="accountantEmail"
								label="Accountant email"
								outlined
								background-color="white"
								:disabled="isExistRelatedAccountant || newInvitations.length > 0 || invitedList.length > 0 || sending"
								:rules="emailRules"
								hide-details="auto"
							></v-text-field>
							<div v-if="!isExistRelatedAccountant && newInvitations.length > 0">
								<span class="alertInvitationText">
									You have {{ newInvitations.length }} invitations from accountant. Please check invitation first.</span
								>
								<a @click="$router.push('/user/profile')"> go to profile page</a>
							</div>
							<div v-if="!isExistRelatedAccountant && invitedList.length > 0">
								<span class="alertInvitationText">
									You've already invited accountant. If you want to send report to other accountant, please cancel
									invitation on profile page.
								</span>
								<a @click="$router.push('/user/profile')"> go to profile page</a>
							</div>
						</div>
						<v-textarea
							v-model.trim="emailContent"
							maxlength="500"
							outlined
							hide-details
							:disabled="sending"
						></v-textarea>
						<div class="yourEmailText">Your email: {{ user.attributes.email }}</div>

						<div class="buttonsWrapper">
							<Button
								fontcolor="white"
								color="secondary"
								:fontsize="16"
								:height="52"
								:width="isMobile ? '' : '280'"
								:block="isMobile"
								:rounded="true"
								:disabled="!formValid || selectedYears.length === 0 || sending || matching"
								:loading="sending"
								type="submit"
							>
								Send
							</Button>
						</div>
					</v-form>
				</div>
			</v-card>
			<v-card v-else class="dialogCardWrapper overHidden">
				<img class="successLine" src="/lines/line-5.png" />
				<v-icon class="closeBtn -hoverIcon" color="primaryLight" @click="close" v-text="'mdi-close'" />
				<div v-if="!sending" class="successWrapper">
					<template v-if="sendStatus === ESendEmailStatus.SUCCESS">
						<img class="successCharacter" src="/characters/laugh-2.png" alt="character of cointelli" />
						<div class="successText">
							<div class="titleText">We’ve sent your tax report to {{ accountantEmail }}.</div>
							<div class="descText">
								You’ll receive a confirmation email when the recipient downloads your report. If you do not receive a
								confirmation email, please check with your recipient directly.
							</div>
						</div>
					</template>
					<div v-else-if="sendStatus === ESendEmailStatus.FAIL" class="failText">
						Oops, something's wrong. Try agin.
					</div>
					<div class="buttonWrapper">
						<Button
							color="secondary"
							fontcolor="white"
							:fontsize="16"
							:height="52"
							:width="192"
							:rounded="true"
							@click="close"
						>
							Close
						</Button>
					</div>
				</div>
				<img class="leftCloud" src="/illust-item/cloud02.png" alt="illust of cloud" />
				<img class="rightCloud" src="/illust-item/cloud01.png" alt="illust of cloud" />
			</v-card>
		</template>
		<template v-else>
			<v-card class="dialogCardWrapper overHidden">
				<v-icon class="closeBtn -hoverIcon" color="primaryLight" @click="close" v-text="'mdi-close'" />
				<FailedAndRefreshCard @refresh="retrieve" />
			</v-card>
		</template>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, State, Getter, Vue } from 'nuxt-property-decorator';
import FailedAndRefreshCard from '../card/FailedAndRefreshCard.vue';
import Checkbox from '../input/Checkbox.vue';
import Button from '~/components/button/Button.vue';
import MovingObject, { EMovingObjSize, EMoveType } from '~/components/item/MovingObject.vue';
import { ADD_TO_MESSAGE_QUEUE, CONFIRM_ERROR } from '~/store';
import {
	GENERATE_TOKEN,
	GET_INVITATIONS_BY_EMAIL,
	GET_INVITED_LIST,
	GET_RELATED_ACCOUNTANTS,
	INVITE,
	UPDATE_RELATED_OBJECT,
} from '~/store/accountant';
import { ICognitoUserExt } from '~/types/auth/types';
import { ESendEmailStatus, IInvitedObject, IRelatedObject } from '~/types/accountant/types';
import { requiredRule, emailRule } from '~/utils/rules';
import { GET_USERS_BY_EMAIL } from '~/store/auth';
import {
	CT_FRONT,
	EMAIL_ID_ALERT_ARRIVED,
	EMAIL_ID_SEND_TO_ACCOUNTANT,
	INVITE_HASH_EXPIRE_DAYS,
} from '~/utils/constants';
import { EmailService } from '~/services/EmailService';
import { ICtUser } from '~/types/common/types';

@Component({
	components: { MovingObject, Button, FailedAndRefreshCard, Checkbox },
})
export default class SendToAccountantDialog extends Vue {
	$refs!: {
		form: HTMLFormElement;
	};

	@Prop({ required: true }) dialog!: boolean;

	@State(({ auth }) => auth.user) user!: ICognitoUserExt;
	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ accountant }) => accountant.relatedObject) relatedObject!: IRelatedObject;
	@State(({ accountant }) => accountant.invitedList) invitedList!: IInvitedObject[];

	loading = false;
	isSuccessToLoad: boolean | null = null;
	formValid = false;
	sending = false;
	matching = false;
	accountantEmail = '';
	buttonLink = CT_FRONT;
	emailContent = 'Hello. Attachment is my crypto tax report for you viewing. Thank you.';
	sendStatus = ESendEmailStatus.BEFORE;
	newInvitedObject: IInvitedObject | null = null;
	selectedYears: number[] = [];
	EMovingObjSize = EMovingObjSize;
	EMoveType = EMoveType;
	ESendEmailStatus = ESendEmailStatus;
	emailRules = [(v: any) => requiredRule(v), (v: any) => emailRule(v, this.$nuxt)];

	@Getter('auth/userName') userName!: string | null;
	@Getter('auth/userEmail') userEmail!: string;
	@Getter('pay/purchasedYearList') purchasedYearList!: number[];
	@Getter('accountant/relatedAccountantEmail') relatedAccountantEmail!: string | null;
	@Getter('accountant/isExistRelatedAccountant') isExistRelatedAccountant!: boolean;
	@Getter('accountant/newInvitations') newInvitations!: IInvitedObject[];

	// @Watch('dialog')
	// watchDialog(newVal: boolean) {
	// 	if (newVal) {
	// 		this.selectedYears = this.purchasedYearList;
	// 	}
	// }

	selectYear(year: number) {
		if (this.selectedYears.includes(year)) {
			this.selectedYears = this.selectedYears.filter(v => v !== year);
			return;
		}
		this.selectedYears.push(year);
	}

	async emailMatchedUsers(email: string): Promise<ICtUser[]> {
		const emailMatchedUsers = await this.$store.dispatch(`auth/${GET_USERS_BY_EMAIL}`, email);
		return emailMatchedUsers;
	}

	async sendEmailToAccountant(): Promise<boolean> {
		return await new EmailService(
			this.$store,
			EMAIL_ID_SEND_TO_ACCOUNTANT,
			this.accountantEmail,
			this.userEmail,
			this.buttonLink,
			this.emailContent,
		).sendEmail();
	}

	async sendEmailToAlertArrival() {
		if (!this.userEmail) return;
		await new EmailService(this.$store, EMAIL_ID_ALERT_ARRIVED, this.userEmail).sendEmail();
	}

	async onClickSend() {
		if (this.selectedYears.length === 0) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Select tax year' });
			return;
		}

		if (this.accountantEmail === this.userEmail) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: 'Please enter an email other than your own',
			});
			return;
		}

		/**
		 * RelatedAccountant O =>
		 *    1. change RelatedUser Status
		 *    2. send Email
		 */
		if (this.isExistRelatedAccountant) {
			this.sending = true;
			const resultOfUpdateDB = await this.$store.dispatch(`accountant/${UPDATE_RELATED_OBJECT}`, {
				...this.relatedObject,
				status: 'IN_REVIEW',
				taxYearList: this.selectedYears.join(','),
			});

			if (!resultOfUpdateDB) {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$t('message.fail.update') });
				this.sendStatus = ESendEmailStatus.FAIL;
				this.sending = false;
				return;
			}
			const resultOfSendEmail = await this.sendEmailToAccountant();
			if (!resultOfSendEmail) {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Sent email failed' });
				this.sendStatus = ESendEmailStatus.FAIL;
				this.sending = false;
				return;
			}

			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: 'Sent email successfully' });
			this.sendEmailToAlertArrival();
			this.sendStatus = ESendEmailStatus.SUCCESS;
			this.sending = false;
			return;
		}

		/**
		 * RelatedAccountant X =>
		 *    1. make invitedUser Object
		 *    2. send Email
		 */
		this.matching = true;
		const emailMatchedUsers = await this.emailMatchedUsers(this.accountantEmail);
		setTimeout(() => {
			this.matching = false;
		}, 2000);
		const isExistedUser: boolean = emailMatchedUsers.length > 0;
		const isNotAccountant: boolean = emailMatchedUsers.filter(v => v.isAccountant === false).length > 0;

		if (isNotAccountant) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: 'This email is not an accountant account.',
			});
			return;
		}
		if (!this.accountantEmail) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Email required' });
			return;
		}
		if (!this.accountantEmail && this.invitedList.length > 0) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: 'You have already invited accountant',
			});
			return;
		}

		this.sending = true;
		const newInvitedObject = await this.$store.dispatch(`accountant/${INVITE}`, {
			params: {
				type: 'ACCOUNTANT',
				email: this.accountantEmail,
				name: this.accountantEmail.split('@')[0],
				taxYearList: this.selectedYears.join(','),
			},
			userName: this.userName,
		});
		if (newInvitedObject === false) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Invite failed' });
			this.sendStatus = ESendEmailStatus.FAIL;
			this.sending = false;
			return;
		}

		const newInviteHash = await this.$store.dispatch(`accountant/${GENERATE_TOKEN}`, {
			expireDays: INVITE_HASH_EXPIRE_DAYS,
			inviteId: newInvitedObject.id,
		});
		if (newInviteHash === false) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Generate Hash failed' });
			this.sendStatus = ESendEmailStatus.FAIL;
			this.sending = false;
			return;
		}

		this.buttonLink = isExistedUser ? CT_FRONT : `${CT_FRONT}/invitation/for-accountant?inviteId=${newInviteHash}`;
		const resultOfSendEmail = await this.sendEmailToAccountant();
		if (!resultOfSendEmail) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Sent email failed' });
			this.sendStatus = ESendEmailStatus.FAIL;
			this.sending = false;
			return;
		}

		this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: 'Sent email successfully' });
		this.sendEmailToAlertArrival();
		this.sendStatus = ESendEmailStatus.SUCCESS;
		this.sending = false;
		this.getInvitedAccountants();
	}

	clearInputs() {
		this.$refs.form?.resetValidation();
		this.accountantEmail = this.relatedAccountantEmail ? this.relatedAccountantEmail : '';
		this.emailContent = '';
		this.sendStatus = ESendEmailStatus.BEFORE;
	}

	close() {
		this.$emit('close');
		this.clearInputs();
	}

	async getConnectedAccountant() {
		const params = { type: 'CLIENT' };
		const result = await this.$store.dispatch(`accountant/${GET_RELATED_ACCOUNTANTS}`, {
			params,
			userName: this.userName,
		});
		return result;
	}

	async getInvitations() {
		const params = { type: 'CLIENT' };
		const result = await this.$store.dispatch(`accountant/${GET_INVITATIONS_BY_EMAIL}`, {
			params,
			userEmail: this.userEmail,
		});
		return result;
	}

	async getInvitedAccountants() {
		const result = await this.$store.dispatch(`accountant/${GET_INVITED_LIST}`, {
			params: { type: 'ACCOUNTANT' },
			userName: this.userName,
		});
		return result;
	}

	// mounted() {
	// 	this.selectedYears = this.purchasedYearList;
	// }

	async retrieve() {
		this.loading = true;
		const apiArr = [this.getConnectedAccountant(), this.getInvitations(), this.getInvitedAccountants()];
		const results = await Promise.all(apiArr);
		this.isSuccessToLoad = !results.includes(false);
		this.loading = false;
	}

	fetchOnServer() {
		return false;
	}

	async fetch() {
		await this.retrieve();
		this.accountantEmail = this.relatedAccountantEmail ? this.relatedAccountantEmail : '';
	}
}
</script>

<style lang="scss" scoped>
.text-center {
	text-align: center;
}
.mx-auto {
	margin: inherit auto;
}
.overHidden {
	overflow: hidden;
}
.successLine {
	position: absolute;
	left: 0;
	top: 170px;
}
.successWrapper {
	position: relative;
	text-align: center;
	margin-bottom: 24px;
	.clouds {
		margin-top: 50px;
		margin-bottom: 84px;
	}

	.successCharacter {
		width: 220px;
		margin: 40px 0;
	}
	.successText {
		.titleText {
			font-size: 23px;
			font-family: $poppins;
			color: $primary;
			margin-bottom: 16px;
		}

		.descText {
			margin: 0 auto;
			font-size: 18px;
			letter-spacing: 0.25px;
			color: $primaryLight;
			margin-bottom: 44px;
			max-width: 570px;
		}
	}
	.failText {
		font-family: 'Poppins';
		color: $primaryLight;
		font-size: 24px;
		margin-top: 24px;
		margin-bottom: 60px;
	}
	.buttonWrapper {
		display: flex;
		justify-content: center;
	}
}
.leftCloud {
	width: 253px;
	position: absolute;
	bottom: -55px;
	left: -70px;
}
.rightCloud {
	width: 162px;
	position: absolute;
	bottom: -30px;
	right: -40px;
}
.smilingBallImg {
	padding-top: 36px;
}
.dialogTitle {
	font-family: $poppins;
	font-weight: $font-medium;
	font-size: 33px;
	text-align: center;
}
.dialogInnerForm {
	margin-top: 36px;
	.yearButtonWrapper {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin-bottom: 36px;

		.yearButtonInner {
			width: 100%;
			display: flex;
			justify-content: space-between;
		}
	}
	.formSubtitle {
		font-size: 16px;
		letter-spacing: 0.15px;
		color: $primary;
		font-family: $poppins;
		margin-bottom: 20px;
		font-weight: $font-medium;
	}
	.userEmailInput {
		margin-top: 24px;
	}
	.accountantEmail {
		margin-bottom: 20px;
		.alertInvitationText {
			color: $errorDark;
		}
	}
	.yourEmailText {
		color: $primaryPale;
		font-size: 14px;
		margin-top: 12px;
		margin-bottom: 48px;
	}
}
</style>
