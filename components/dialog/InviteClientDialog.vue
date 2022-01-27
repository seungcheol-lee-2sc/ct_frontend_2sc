<template>
	<v-dialog :value="dialog" persistent max-width="745" @keydown.esc="close" @click:outside="close">
		<v-card v-if="sendStatus === ESendEmailStatus.BEFORE" class="dialogCardWrapper cardWrapper">
			<v-icon class="closeBtn" color="primary" @click="close" v-text="'mdi-close'" />
			<div class="titleWrapper">
				<div class="titleText">Invite your clients!</div>
				<div class="subtitleText">Clients who sign up to Cointelli will be connected to your account.</div>
			</div>

			<v-form ref="form" v-model="formValid" @submit.prevent="addContact">
				<div class="contactAddWrapper">
					<div class="contactAddForm">
						<v-text-field
							v-model.trim="nameInput"
							background-color="white"
							maxlength="100"
							outlined
							hide-details
							autofocus
							:rules="requiredRules"
							:disabled="sending"
							label="Client name"
						/>
						<v-text-field
							v-model.trim="emailInput"
							background-color="white"
							outlined
							hide-details
							:disabled="sending"
							:rules="emailRules"
							label="Email address"
						/>
						<div class="buttonWrapper">
							<Button :width="54" :height="54" :disabled="!formValid || matching" color="primary" type="submit">
								<v-icon :color="formValid ? 'white' : 'primaryPale'">mdi-plus</v-icon>
							</Button>
						</div>
					</div>
					<div class="chipsWrapper">
						<span class="innerText">To:</span>
						<v-chip
							v-for="(contact, idx) in addedContactsNonUser"
							:key="`${idx}-addedContactsNonUser`"
							outlined
							backbround-color="white"
							color="primary"
							close
							close-icon="mdi-close"
							class="addedContactChip"
							:disabled="sending"
							@click:close="removeContact(contact.email)"
						>
							{{ contact.name }}
						</v-chip>
						<v-chip
							v-for="(contact, idx) in addedContactsExistedUser"
							:key="`${idx}-addedContactsExistedUser`"
							outlined
							backbround-color="white"
							color="primary"
							close
							close-icon="mdi-close"
							class="addedContactChip"
							:disabled="sending"
							@click:close="removeContact(contact.email)"
						>
							{{ contact.name }}
						</v-chip>
					</div>
				</div>
				<v-textarea
					v-model.trim="emailContent"
					class="textAreaWrap"
					outlined
					hide-details
					label="If you have any comment you’d like to send, then please write down on this box."
					maxlength="500"
					height="84"
					:disabled="sending"
				></v-textarea>
			</v-form>

			<div class="buttonWrapper">
				<Button
					:disabled="addedContactsNonUser.length + addedContactsExistedUser.length === 0 || sending"
					:height="52"
					:width="200"
					:loading="sending"
					fontcolor="white"
					color="secondary"
					head-icon="mdi-email-outline"
					@click="onclickSend"
				>
					Send
				</Button>
			</div>
		</v-card>
		<v-card v-else class="dialogCardWrapper cardWrapper">
			<div class="titleWrapper">
				<div v-if="sendStatus === ESendEmailStatus.SUCCESS">
					<img class="successCharacter" src="/characters/laugh-2.png" alt="character of cointelli" />
					<div class="statusText">
						Your invitation was successfully<br />
						sent to your client.
					</div>
				</div>
				<div v-if="sendStatus === ESendEmailStatus.FAIL" class="statusText">Oops, something's wrong. Try agin.</div>
			</div>
			<div class="buttonWrapper">
				<Button fontcolor="white" :height="52" :width="200" color="secondary" @click="close"> Close </Button>
			</div>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Vue, Component, State, Getter, Prop } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import MovingObject, { EMovingObjSize, EMoveType } from '~/components/item/MovingObject.vue';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { requiredRule, emailRule } from '~/utils/rules';
import { GET_INVITED_LIST, INVITE_MULTIPLE } from '~/store/accountant';
import { ESendEmailStatus, IInviteRequest } from '~/types/accountant/types';
import { CT_FRONT, EMAIL_ID_INVITE_CLIENT } from '~/utils/constants';
import { GET_USERS_BY_EMAIL } from '~/store/auth';
import { IAffiliateBody } from '~/types/affiliate/types';
import { getSingleItem } from '~/utils/func';
import { EmailService } from '~/services/EmailService';
import { ICtUser } from '~/types/common/types';

@Component({
	components: {
		MovingObject,
		Button,
	},
})
export default class InviteClientDialog extends Vue {
	$refs!: {
		form: HTMLFormElement;
	};

	@Prop({ required: true }) dialog!: boolean;

	@State(({ affiliate }) => affiliate.affiliateInfo) affiliateInfo!: IAffiliateBody;

	uploadedFiles: File[] = [];
	EMovingObjSize = EMovingObjSize;
	EMoveType = EMoveType;
	formValid = false;
	sendStatus = ESendEmailStatus.BEFORE;
	sending = false;
	matching = false;
	nameInput = '';
	emailInput = '';
	emailContent = '';
	addedContactsNonUser: IInviteRequest[] = [];
	addedContactsExistedUser: IInviteRequest[] = [];
	emailRules = [(v: any) => requiredRule(v), (v: any) => emailRule(v, this.$nuxt)];
	requiredRules = [(v: any) => requiredRule(v)];
	ESendEmailStatus = ESendEmailStatus;

	@Getter('auth/userName') userName!: string | null;
	@Getter('auth/userEmail') userEmail!: string;

	get affiliateLink() {
		return this.affiliateInfo ? getSingleItem(this.affiliateInfo.links).url : '';
	}

	clearInputs() {
		this.emailInput = '';
		this.nameInput = '';
		this.sendStatus = ESendEmailStatus.BEFORE;
		this.$refs.form?.resetValidation();
	}

	onclickAdd() {}

	async emailMatchedUsers(email: string): Promise<ICtUser[]> {
		const emailMatchedUsers = await this.$store.dispatch(`auth/${GET_USERS_BY_EMAIL}`, email);
		return emailMatchedUsers;
	}

	async addContact() {
		this.matching = true;
		const emailMatchedUsers = await this.emailMatchedUsers(this.emailInput);
		setTimeout(() => {
			this.matching = false;
		}, 2000);

		const isExistedUser: boolean = emailMatchedUsers.length > 0;
		const isAccountant: boolean = emailMatchedUsers.filter(v => v.isAccountant === true).length > 0;

		if (this.emailInput === this.userEmail) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Please enter an email other than your own' });
			return;
		}
		if (isAccountant) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: 'This email is signed up as an accountant.',
			});
			return;
		}
		if (!this.formValid) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$t('message.submitAlert') });
			return;
		}
		if (!this.nameInput) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Name required' });
			return;
		}
		if (!this.emailInput) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Email required' });
			return;
		}
		if (this.emailInput in this.addedContactsNonUser || this.emailInput in this.addedContactsExistedUser) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Email already added' });
			return;
		}

		if (isExistedUser) {
			this.addedContactsExistedUser.push({
				name: this.nameInput,
				email: this.emailInput,
			});
		} else {
			this.addedContactsNonUser.push({
				name: this.nameInput,
				email: this.emailInput,
			});
		}

		this.clearInputs();
	}

	removeContact(email: string) {
		this.addedContactsExistedUser = this.addedContactsExistedUser.filter(v => v.email !== email);
		this.addedContactsNonUser = this.addedContactsNonUser.filter(v => v.email !== email);
		this.clearInputs();
	}

	async updateDBInivitedObjects(contactList: IInviteRequest[]): Promise<boolean> {
		const inviteResult: boolean = await this.$store.dispatch(`accountant/${INVITE_MULTIPLE}`, {
			params: { type: 'CLIENT' },
			userName: this.userName,
			data: contactList,
		});
		return inviteResult;
	}

	async sendEmail(contact: IInviteRequest, isExistedUser: boolean): Promise<boolean> {
		const buttonLink = isExistedUser ? CT_FRONT : this.affiliateLink;
		return await new EmailService(
			this.$store,
			EMAIL_ID_INVITE_CLIENT,
			contact.email,
			this.userEmail,
			buttonLink,
			this.emailContent,
		).sendEmail();
	}

	async onclickSend() {
		if (this.addedContactsExistedUser.length + this.addedContactsNonUser.length === 0) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: `You should add emails` });
			return;
		}

		this.sending = true;
		const nonUserWithMemo: IInviteRequest[] = this.addedContactsNonUser.map(v => {
			return { ...v, memo: this.emailContent };
		});
		const existedUserWithMemo: IInviteRequest[] = this.addedContactsExistedUser.map(v => {
			return { ...v, memo: this.emailContent };
		});
		const resultOfUpdateDB = await this.updateDBInivitedObjects([...nonUserWithMemo, ...existedUserWithMemo]);
		if (!resultOfUpdateDB) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Invite failed' });
			this.sendStatus = ESendEmailStatus.FAIL;
			return;
		}

		const resultOfSendEmail = await Promise.all([
			...this.addedContactsNonUser.map(async contact => {
				return await this.sendEmail(contact, false);
			}),
			...this.addedContactsExistedUser.map(async contact => {
				return await this.sendEmail(contact, true);
			}),
		]);

		if (resultOfSendEmail.includes(false)) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Sent email failed' });
			this.sendStatus = ESendEmailStatus.FAIL;
			return;
		}
		this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: 'Sent email successfully' });
		this.sendStatus = ESendEmailStatus.SUCCESS;

		this.sending = false;
		await this.getInvitedLists();
	}

	async getInvitedLists() {
		const params = { type: 'CLIENT' };
		await this.$store.dispatch(`accountant/${GET_INVITED_LIST}`, { params, userName: this.userName });
	}

	close() {
		this.clearInputs();
		this.addedContactsExistedUser = [];
		this.addedContactsNonUser = [];
		this.$emit('close');
	}

	created() {
		this.clearInputs();
		this.addedContactsExistedUser = [];
		this.addedContactsNonUser = [];
	}
}
</script>

<style lang="scss" scoped>
.cardWrapper {
	text-align: center;
	overflow: hidden;

	.titleWrapper {
		font-family: $poppins;
		margin-bottom: 48px;

		.titleText {
			font-weight: $font-medium;
			font-size: 33px;
			color: $primary;
			margin-bottom: 8px;
		}

		.subtitleText {
			color: $primaryLight;
			font-family: $roboto;
			font-size: 18px;
		}

		.statusText {
			color: $primaryLight;
			font-size: 24px;
		}
	}
	.contactAddWrapper {
		background-color: $offWhite;
		padding: 20px;
		margin-bottom: 32px;
		.contactAddForm {
			display: flex;
			gap: 12px;
			margin-bottom: 16px;
		}

		.chipsWrapper {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 12px;
			text-align: left;
			margin-bottom: 12px;
			.innerText {
				color: $disabled;
			}
			.addedContactChip {
				background-color: $white !important;
			}
		}
	}
	.buttonWrapper {
		display: flex;
		justify-content: center;
	}
	.textAreaWrap {
		margin-bottom: 32px;
	}

	.successCharacter {
		width: 150px;
		margin: 40px 0;
	}
}
</style>
