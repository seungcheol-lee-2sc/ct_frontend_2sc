<template>
	<v-dialog v-model="dialog" max-width="600" @keydown.esc="close" @click:outside="close">
		<v-card class="dialogCard">
			<div class="titleText">
				{{ status === EClientStatus.REVIEW ? 'Do you want to send email?' : 'Do you want to send reminder?' }}
			</div>
			<v-textarea
				v-if="status === EClientStatus.REVIEW"
				v-model="emailContent"
				hide-details
				outlined
				height="84"
				placeholder="Please leave the contents for the clients you want to send."
				class="contentInput"
				maxlength="200"
			></v-textarea>
			<div v-else class="subtext">
				{{ client ? 'This client will get the reminder email.' : 'These clients will get the reminder email.' }}
			</div>
			<div class="buttonsWrapper -right">
				<Button color="secondary" :text="true" :fontsize="14" :rounded="true" @click="close">Cancel</Button>
				<Button
					color="secondary"
					:disabled="sending"
					fontcolor="white"
					:width="122"
					:height="44"
					:rounded="true"
					:fontsize="14"
					@click="onclickSend"
				>
					Yes
				</Button>
			</div>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, State, Getter, Vue } from 'nuxt-property-decorator';
import ClientAvatar from '../avatar/ClientAvatar.vue';
import Button from '../button/Button.vue';
import { IInvitedObject, IRelatedObject } from '~/types/accountant/types';
import { EClientStatus } from '~/pages/accountant/manage-clients.vue';
import { UPDATE_INVITED_OBJECT, UPDATE_RELATED_OBJECT } from '~/store/accountant';
import {
	CT_FRONT,
	DATETIME_FORMAT_CLASSIC,
	EMAIL_ID_REMINDER_IN_PROGRESS,
	EMAIL_ID_REMINDER_PENDING,
	EMAIL_ID_REMINDER_REVIEW,
} from '~/utils/constants';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { EmailService } from '~/services/EmailService';
import { IAffiliateBody } from '~/types/affiliate/types';
import { getSingleItem } from '~/utils/func';
import { GET_USERS_BY_EMAIL } from '~/store/auth';

@Component({
	components: { ClientAvatar, Button },
})
export default class SendReminderToClientDialog extends Vue {
	@Prop({ required: true }) dialog!: boolean;
	@Prop({ required: true }) client!: IInvitedObject | IRelatedObject;
	@Prop({ required: true }) status!: EClientStatus;
	@Prop() clients!: IInvitedObject[] | IRelatedObject[];

	@State(({ affiliate }) => affiliate.affiliateInfo) affiliateInfo!: IAffiliateBody;

	emailContent: string = '';
	sending: boolean = false;
	EClientStatus = EClientStatus;
	sendEmailResults: boolean[] = [];

	@Getter('auth/userName') userName!: string | null;
	@Getter('auth/userEmail') userEmail!: string;

	get affiliateLink() {
		return this.affiliateInfo ? getSingleItem(this.affiliateInfo.links).url : '';
	}

	get emailId(): number {
		switch (this.status) {
			case EClientStatus.PENDING:
				return EMAIL_ID_REMINDER_PENDING;
			case EClientStatus.PROGRESS:
				return EMAIL_ID_REMINDER_IN_PROGRESS;
			case EClientStatus.REVIEW:
				return EMAIL_ID_REMINDER_REVIEW;
			default:
				return EMAIL_ID_REMINDER_PENDING;
		}
	}

	async updateReminderSentDate(client: IInvitedObject | IRelatedObject) {
		const updatedObject = { ...client, reminderSentDate: `${this.$moment().format(DATETIME_FORMAT_CLASSIC)}Z` };
		const result =
			this.status === EClientStatus.PENDING
				? await this.$store.dispatch(`accountant/${UPDATE_INVITED_OBJECT}`, updatedObject)
				: await this.$store.dispatch(`accountant/${UPDATE_RELATED_OBJECT}`, updatedObject);
		return result;
	}

	async isExistedUser(email: string): Promise<boolean> {
		const emailMatchedUsers = await this.$store.dispatch(`auth/${GET_USERS_BY_EMAIL}`, email);
		return emailMatchedUsers.length > 0;
	}

	async sendEmail(clientEmail: string) {
		const isExistedUser: boolean = await this.isExistedUser(clientEmail);
		console.log(isExistedUser);
		const buttonLink = isExistedUser ? CT_FRONT : this.affiliateLink;
		return await new EmailService(
			this.$store,
			this.emailId,
			clientEmail,
			this.userEmail,
			buttonLink,
			this.emailContent,
		).sendEmail();
	}

	async onclickSend() {
		this.sending = true;
		const sendApiArr = [];
		const clientApiArr = [];

		if (this.client) {
			const clientEmail = 'email' in this.client ? this.client.email : this.client.relatedUser.email || '';
			sendApiArr.push(this.sendEmail(clientEmail));
			clientApiArr.push(this.updateReminderSentDate(this.client));
		}

		if (this.clients.length > 0) {
			this.clients.forEach((client: IInvitedObject | IRelatedObject) => {
				const clientEmail = 'email' in client ? client.email : client.relatedUser.email || '';
				sendApiArr.push(this.sendEmail(clientEmail));
				clientApiArr.push(this.updateReminderSentDate(client));
			});
		}

		const resultOfSendEmail = await Promise.all(sendApiArr);

		if (resultOfSendEmail.includes(false)) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Sent failed' });
			return;
		}

		const resultOfUpdateClient = await Promise.all(clientApiArr);

		if (resultOfUpdateClient.includes(false)) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$t('message.fail.update') });
			return;
		}

		this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: 'Sent successfully' });
		this.sending = false;
		this.close();
	}

	close() {
		this.$emit('close');
		this.$emit('retrieve');
	}
}
</script>

<style lang="scss" scoped>
.dialogCard {
	padding: 28px;
	.titleText {
		color: $primary;
		font-family: $poppins;
		font-weight: $font-normal;
		font-size: 23px;
		letter-spacing: 0;
		margin-bottom: 24px;
	}
	.contentInput {
		margin-bottom: 28px;
	}
	.subtext {
		font-family: $poppins;
		font-size: 14px;
		margin-bottom: 64px;
	}
}
</style>
