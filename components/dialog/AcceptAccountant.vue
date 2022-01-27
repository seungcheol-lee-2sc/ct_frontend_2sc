<template>
	<v-dialog
		v-if="newInvitations.length > 0"
		v-model="dialog"
		content-class="ct-scroll"
		persistent
		max-width="660"
		@keydown.esc="close"
	>
		<div class="connectWrapper">
			<v-card class="dialogCard" color="white" elevation="0">
				<v-icon class="closeBtn" color="primaryLight" @click="close">mdi-close</v-icon>
				<div>
					<div class="titleText">You have invitations!</div>

					<div class="illustWrapper">
						<img src="/characters/got-email.png" alt="illustration of cointelli character" />
					</div>
					<div class="dividerWrapper">
						<v-divider></v-divider>
						<span>Pending invitations ({{ newInvitations.length }})</span>
						<v-divider></v-divider>
					</div>
					<div v-for="invitation in newInvitations" :key="invitation.id" class="accountantInfoBox">
						<div class="accountantInfoInner">
							<div class="avatarGrid">
								<ClientAvatar :client="invitation" :size="56" color="secondaryDarkPale" />
								<div>
									<div class="accountantName">{{ getFullname(invitation.user) }}</div>
									<span class="email"> {{ invitation.user ? invitation.user.email : 'no email' }}</span>
								</div>
							</div>
							<div class="buttonsWrapper">
								<Button
									color="secondary"
									:text="true"
									:height="44"
									:fontsize="14"
									:rounded="true"
									:disabled="loading"
									@click="onclickReject(invitation)"
								>
									Refuse
								</Button>
								<Button
									color="secondary"
									:width="120"
									:height="44"
									:fontsize="14"
									fontcolor="white"
									:rounded="true"
									:disabled="loading"
									@click="onclickConnect(invitation)"
								>
									Accept
								</Button>
							</div>
						</div>
						<div v-if="invitation.memo" class="accountantMemoWrap">{{ invitation.memo }}</div>
					</div>
					<div v-if="isExistRelatedAccountant" class="descText">
						<div class="text-errorDark">You can’t connect with more than 1 accountant.</div>
					</div>
				</div>
			</v-card>
		</div>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, State, Getter, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import ClientAvatar from '../avatar/ClientAvatar.vue';
import { IInvitedObject, IRelatedObject } from '~/types/accountant/types';
import { ICtUser } from '~/types/common/types';
import { ACCEPT_INVITATION, DELETE_INVITED_OBJECT, DELETE_RELATED_OBJECT } from '~/store/accountant';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { getFullname } from '~/utils/application';

@Component({
	components: { Button, ClientAvatar },
})
export default class AcceptAccountant extends Vue {
	@Prop({ required: true }) dialog!: boolean;

	loading = false;

	@State(({ accountant }) => accountant.relatedObject) relatedObject!: IRelatedObject;
	@State(({ accountant }) => accountant.invitedList) invitedList!: IInvitedObject[];
	@State(({ accountant }) => accountant.invitations) invitations!: IInvitedObject[];

	@Getter('auth/userName') userName!: string | null;
	@Getter('auth/userEmail') userEmail!: string;
	@Getter('accountant/isExistRelatedAccountant') isExistRelatedAccountant!: boolean;
	@Getter('accountant/newInvitations') newInvitations!: IInvitedObject[];

	getFullname(user: ICtUser) {
		return getFullname(user);
	}

	async deleteAllRelations(relatedObject: IRelatedObject): Promise<boolean> {
		const previousInvitedObjects = this.invitedList.filter(v => v.email === relatedObject.user.email);
		const previousInvitationObjects = this.invitations.filter(v => v.user.email === relatedObject.user.email);
		const resultOfInvitedObject = await Promise.all(
			[...previousInvitedObjects, ...previousInvitationObjects].map(async invitation => {
				return await this.$store.dispatch(`accountant/${DELETE_INVITED_OBJECT}`, invitation.id);
			}),
		);
		if (!resultOfInvitedObject) {
			return false;
		}
		const resultOfRelatedObject = await this.$store.dispatch(`accountant/${DELETE_RELATED_OBJECT}`, relatedObject.id);
		if (!resultOfRelatedObject) {
			return false;
		}
		return true;
	}

	async acceptInvitation(invitation: IInvitedObject): Promise<boolean> {
		const result = await this.$store.dispatch(`accountant/${ACCEPT_INVITATION}`, {
			params: { invitedUserId: invitation.id },
			userName: this.userName,
		});
		return result;
	}

	async deleteInvitations(invitedObjectId: number): Promise<boolean> {
		const result = await this.$store.dispatch(`accountant/${DELETE_INVITED_OBJECT}`, invitedObjectId);
		return result;
	}

	async onclickConnect(invitation: IInvitedObject) {
		this.loading = true;
		if (this.relatedObject) {
			const resultOfDelete = await this.deleteAllRelations(this.relatedObject);
			if (!resultOfDelete) {
				this.$store.dispatch(
					ADD_TO_MESSAGE_QUEUE,
					{ color: 'error', msg: `${this.$i18n.t('message.fail.delete')}` },
					{ root: true },
				);
				return;
			}
		}
		const resultOfAccept = await this.acceptInvitation(invitation);
		if (!resultOfAccept) {
			this.$store.dispatch(
				ADD_TO_MESSAGE_QUEUE,
				{ color: 'error', msg: `${this.$i18n.t('message.fail.update')}` },
				{ root: true },
			);
			return;
		}
		this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.update') });
		this.$emit('retrieve');
		this.loading = false;
	}

	async onclickReject(invitation: IInvitedObject) {
		this.loading = true;
		const resultOfDelete = await this.deleteInvitations(invitation.id);
		if (!resultOfDelete) {
			this.$store.dispatch(
				ADD_TO_MESSAGE_QUEUE,
				{ color: 'error', msg: `${this.$i18n.t('message.fail.delete')}` },
				{ root: true },
			);
			return;
		}
		this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.delete') });
		this.$emit('retrieve');
		this.loading = false;
	}

	close() {
		this.$emit('close');
	}
}
</script>

<style lang="scss" scoped>
.connectWrapper {
	text-align: left;

	.dialogCard {
		padding: 24px;
		overflow: hidden;
		border-width: 2px;
		.closeBtn {
			position: absolute !important;
			top: 28px;
			right: 28px;
		}

		.titleText {
			color: $primary;
			font-family: $poppins;
			font-weight: $font-normal;
			font-size: 23px;
			text-align: center;
			letter-spacing: 0;
		}
		.accountantInfoBox {
			border: 1px solid $outline;
			border-radius: 10px;
			padding: 24px;
			margin: 24px 0;
			.accountantInfoInner {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.avatarGrid {
					display: flex;
					justify-content: center;
					align-items: center;
					gap: 12px;
					margin-bottom: 8px;
					.accountantName {
						font-family: $poppins;
						font-weight: $font-medium;
						font-size: 19px;
					}
				}
				.email {
					font-size: 16px;
					color: $primaryLight;
				}
			}
			.accountantMemoWrap {
				background-color: $offWhite;
				border-radius: $round-sm;
				margin-top: 16px;
				padding: 8px 30px;
			}
		}
		.dividerWrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			font-family: $poppins;
			font-weight: $font-medium;
			font-size: 14px;
		}
		.illustWrapper {
			text-align: center;
			margin-top: 28px;
			margin-bottom: 30px;
		}
		.descText {
			font-weight: $font-medium;
			font-family: $poppins;
			line-height: 1.7;
			color: $primaryLight;
			font-size: 13px;
			margin-top: 16px;
		}
	}
}
</style>
