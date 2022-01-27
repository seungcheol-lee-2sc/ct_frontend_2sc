<template>
	<v-dialog v-if="newInvitations.length > 0" v-model="dialog" persistent max-width="600" @keydown.esc="close">
		<div class="connectWrapper">
			<v-card class="dialogCard" color="white" elevation="0">
				<v-icon class="closeBtn" color="primaryLight" @click="close" v-text="'mdi-close'" />
				<div>
					<div class="titleText">Someone send you tax report</div>
					<div class="descText">
						Would you like to accept these tax report and be these client’s accountant? If so, please check and click
						“Accept”
					</div>
					<v-data-table
						v-model="selectedInvitations"
						:headers="headers"
						:items="newInvitations"
						:max-height="400"
						item-key="email"
						fixed-header
						hide-default-footer
						show-select
						:items-per-page="-1"
						class="elevation-0 invitationInfoBox"
					>
						<template #[`item.name`]="{ item, index }">
							<div class="innerGrid">
								<ClientAvatar :client="item" :size="28" :index="index" />
								<div class="clientName">{{ getFullname(item.user) }}</div>
							</div>
						</template>
						<template #[`item.email`]="{ item }">
							<div class="clientEmail">
								{{ item ? item.user.email : 'no email' }}
							</div>
						</template>
					</v-data-table>

					<div class="buttonsWrapper -right">
						<Button
							color="secondary"
							:text="true"
							:width="104"
							:height="44"
							:fontsize="14"
							:rounded="true"
							:disabled="selectedInvitations.length === 0"
							:loading="loading"
							@click="onclickRefuse"
						>
							Refuse
						</Button>
						<Button
							color="secondary"
							fontcolor="white"
							:width="104"
							:height="44"
							:fontsize="14"
							:rounded="true"
							:disabled="selectedInvitations.length === 0"
							:loading="loading"
							@click="onclickAccept"
						>
							Accept
						</Button>
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
import { ACCEPT_INVITATION, DELETE_INVITED_OBJECT } from '~/store/accountant';
import { ADD_TO_MESSAGE_QUEUE, CONFIRM_ERROR } from '~/store';
import { getFullname } from '~/utils/application';

@Component({
	components: { Button, ClientAvatar },
})
export default class AcceptInvitations extends Vue {
	@Prop({ required: true }) dialog!: boolean;

	@State(({ accountant }) => accountant.relatedObject) relatedObject!: IRelatedObject;

	loading: boolean = false;

	@Getter('auth/userName') userName!: string | null;
	@Getter('accountant/newInvitations') newInvitations!: IInvitedObject[];

	headers = [
		{
			text: 'Name',
			align: 'center',
			sortable: false,
			value: 'name',
		},
		{
			text: 'Email',
			align: 'left',
			sortable: false,
			value: 'email',
		},
	];

	selectedInvitations = [];

	getFullname(user: ICtUser) {
		return getFullname(user);
	}

	getInitial(name: string) {
		return name[0].toUpperCase();
	}

	async acceptInvitation(invitation: IInvitedObject): Promise<boolean> {
		const req: any = {
			params: { invitedUserId: invitation.id },
			userName: this.userName,
		};
		const result = await this.$store.dispatch(`accountant/${ACCEPT_INVITATION}`, req);
		return result;
	}

	async deleteInvitation(invitation: IInvitedObject) {
		const result = await this.$store.dispatch(`accountant/${DELETE_INVITED_OBJECT}`, invitation.id);
		return result;
	}

	async onclickAccept() {
		if (this.selectedInvitations.length === 0) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: this.$t('message.select', { target: 'invitation' }),
			});
			return;
		}

		this.loading = true;
		const resultOfAccept = await Promise.all(
			this.selectedInvitations.map(async invitation => {
				return await this.acceptInvitation(invitation);
			}),
		);

		if (resultOfAccept.includes(false)) {
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

	async onclickRefuse() {
		if (this.selectedInvitations.length === 0) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: this.$t('message.select', { target: 'invitation' }),
			});
			return;
		}

		this.loading = true;
		const resultOfDelete = await Promise.all(
			this.selectedInvitations.map(async invitation => {
				return await this.deleteInvitation(invitation);
			}),
		);

		if (resultOfDelete.includes(false)) {
			this.$store.dispatch(
				ADD_TO_MESSAGE_QUEUE,
				{ color: 'error', msg: `${this.$i18n.t('message.fail.update')}` },
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
			letter-spacing: 0;
		}
		.invitationInfoBox {
			text-align: center;
			margin: 28px 0;
			.innerGrid {
				display: flex;
				justify-content: center;
				align-items: center;
				gap: 12px;

				.clientName {
					font-size: 18px;
				}
			}
			.clientEmail {
				font-size: 18px;
			}
		}
		.descText {
			font-weight: $font-medium;
			font-family: $poppins;
			line-height: 1.7;
			color: $primaryLight;
			font-size: 13px;
			margin-top: 16px;
			&.-mb {
				margin-bottom: 64px;
			}
		}
	}
}
</style>
