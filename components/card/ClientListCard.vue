<template>
	<v-card tile outlined class="clientListWrapper ct-scroll">
		<template v-if="isSuccessToLoad">
			<div class="subtitle">
				<slot></slot>
			</div>
			<template v-if="clientList.length > 0">
				<div class="listTopWrapper">
					<div class="actionWrapper">
						<v-checkbox
							:input-value="checkAllStatus"
							hide-details
							class="checkbox"
							:indeterminate="indeterminate"
							@change="selectAll"
						/>

						<template v-for="action in actions">
							<div v-if="action.enabled" :key="action.name" class="topIconWrap">
								<v-btn icon :disabled="fetching" @click="action.action">
									<v-icon>{{ action.icon }}</v-icon>
								</v-btn>
							</div>
						</template>
					</div>
					<div v-if="status === EClientStatus.REVIEW" class="softwareWrap">
						<span class="text">Select your tax software</span>
						<v-menu offset-y min-width="250">
							<template #activator="{ on, attrs }">
								<v-card
									:disabled="fetching"
									width="250"
									height="52"
									outlined
									v-bind="attrs"
									class="selectFormWrap"
									v-on="on"
								>
									<span v-if="!fetching">{{ selectedSoftware ? selectedSoftware : 'Select...' }}</span>
									<span v-else>Changing...</span>
									<v-icon>mdi-menu-down</v-icon>
								</v-card>
							</template>
							<v-list>
								<v-list-item v-for="(item, index) in softwareList" :key="index" @click="changeSoftware(item)">
									<span>{{ item }}</span>
								</v-list-item>
							</v-list>
						</v-menu>
					</div>
				</div>
				<v-data-table
					:headers="headers"
					:items="clientList"
					:height="clientList.length > 10 ? maxHeight : ''"
					:loading="loading"
					loading-text="Loading... Please wait"
					item-key="email"
					fixed-header
					hide-default-footer
					hide-default-header
					:items-per-page="-1"
					class="elevation-0"
				>
					<template #header="{ props: { headers } }">
						<thead>
							<tr>
								<th v-for="(header, idx) in headers" :key="`${header}-${idx}`" :class="header.class">
									<span>{{ header.text }}</span>
								</th>
							</tr>
						</thead>
					</template>

					<template #[`item.checkbox`]="{ item }">
						<v-checkbox v-model="selectedClients" multiple :value="item"></v-checkbox>
					</template>
					<template #[`item.lastActionTaken`]="{ item }">
						{{ reminderSentDays(item) }}
					</template>
					<template #[`item.dateCompleted`]="{ item }">
						{{ $moment(item.lastModifiedDate).format('MM/DD/YYYY') }}
					</template>
					<template #[`item.dateReceived`]="{ item }">
						{{ $moment(item.lastModifiedDate).format('MM/DD/YYYY') }}
					</template>
					<template #[`item.reminded`]="{ item }">
						<div class="centerFlex">
							{{ reminderSentDays(item) }}
						</div>
					</template>
					<template #[`item.name`]="{ item, index }">
						<div class="leftFlex">
							<ClientAvatar :client="item" :size="28" :index="index" class="avatar" />
							<span class="clientName">
								{{ item.name }}
							</span>
						</div>
					</template>
					<template #[`item.email`]="{ item }">
						<div class="leftFlex">
							<span class="clientEmail">
								{{ status === EClientStatus.PENDING ? item.email : item.relatedUser.email }}
							</span>
						</div>
					</template>
					<template #[`item.delete`]="{ item }">
						<v-btn icon :disabled="fetching" @click="onclickDelete(item)">
							<v-icon>mdi-trash-can-outline</v-icon>
						</v-btn>
					</template>
					<template #[`item.undo`]="{ item }">
						<v-btn icon :disabled="fetching" @click="onclickUndo(item)">
							<v-icon>mdi-arrow-u-left-bottom</v-icon>
						</v-btn>
					</template>
					<template #[`item.download`]="{ item }">
						<Button
							:outlined="true"
							:rounded="true"
							background="white"
							color="outline"
							:disabled="fetching"
							:fontsize="14"
							height="44"
							fontcolor="primary"
							tail-icon="mdi-tray-arrow-down"
							@click="openDownloadDialog(item)"
						>
							Download
						</Button>
					</template>
					<template #[`item.memo`]="{ item, index }">
						<v-btn
							v-if="status === EClientStatus.REVIEW"
							icon
							:disabled="fetching"
							@click="openMemoDialog(item, index)"
						>
							<v-icon v-if="item.memo">mdi-text-box-outline</v-icon>
							<v-icon v-else>mdi-plus</v-icon>
						</v-btn>
					</template>
					<template #[`item.sendEmail`]="{ item }">
						<v-btn icon :disabled="fetching" @click="openSendReminderDialog(item)">
							<v-icon>mdi-email-outline</v-icon>
						</v-btn>
					</template>
					<template #[`item.complete`]="{ item }">
						<v-btn icon :disabled="fetching" @click="onclickComplete(item)">
							<v-icon>mdi-checkbox-marked-circle-outline</v-icon>
						</v-btn>
					</template>
				</v-data-table>
			</template>
			<template v-else> <NothingText>There's no client</NothingText> </template>
		</template>
		<template v-else>
			<FailedAndRefreshCard @refresh="getConnectedAccountant" />
		</template>

		<ClientMemoDialog
			v-if="memoDialog"
			:dialog="memoDialog"
			:client="selectedClient"
			:index="selectedClientIndex"
			:init-memo="selectedClient.memo"
			@close="closeMemoDialog"
			@retrieve="retrieve"
		/>
		<DownloadClientReportDialog
			v-if="downloadDialog"
			:dialog="downloadDialog"
			:client="selectedClient"
			:selected-software="selectedSoftware"
			@close="closeDownloadDialog"
		/>
		<SendReminderToClientDialog
			v-if="sendReminderDialog"
			:dialog="sendReminderDialog"
			:client="selectedClient"
			:clients="selectedClients"
			:status="status"
			@close="closeSendReminderDialog"
			@retrieve="retrieve"
		/>
	</v-card>
</template>

<script lang="ts">
import { Vue, Component, Getter, State, Prop } from 'nuxt-property-decorator';
import ClientMemoDialog from '../dialog/ClientMemoDialog.vue';
import Button from '../button/Button.vue';
import DownloadClientReportDialog from '../dialog/DownloadClientReportDialog.vue';
import SendReminderToClientDialog from '../dialog/SendReminderToClientDialog.vue';
import NothingText from '../text/NothingText.vue';
import Checkbox from '../input/Checkbox.vue';
import FailedAndRefreshCard from './FailedAndRefreshCard.vue';
import ClientAvatar from '~/components/avatar/ClientAvatar.vue';
import { EClientStatus } from '~/pages/accountant/manage-clients.vue';
import { ESoftware } from '~/types/auth/types';
import { DELETE_INVITED_OBJECT, DELETE_RELATED_OBJECT, FETCHING, UPDATE_RELATED_OBJECT } from '~/store/accountant';
import { ADD_TO_MESSAGE_QUEUE, CONFIRM_ACTION, CONFIRM_ERROR } from '~/store';
import { IInvitedObject, IRelatedObject } from '~/types/accountant/types';
import { UPDATE_ATTRIBUTES } from '~/store/auth';

@Component({
	components: {
		ClientAvatar,
		ClientMemoDialog,
		SendReminderToClientDialog,
		DownloadClientReportDialog,
		Button,
		NothingText,
		FailedAndRefreshCard,
		Checkbox,
	},
})
export default class ClientListCard extends Vue {
	@Prop({ required: true }) clientList!: IInvitedObject[] | IRelatedObject[];
	@Prop({ required: true }) status!: EClientStatus;
	@Prop() maxHeight!: number;
	@Prop() fetching!: boolean;
	@Prop() isSuccessToLoad!: boolean;

	@State(({ accountant }) => accountant.invitedList) invitedList!: IInvitedObject[];
	@State(({ accountant }) => accountant.invitations) invitations!: IInvitedObject[];

	ESoftware = ESoftware;
	EClientStatus = EClientStatus;
	selectedClients: any[] = [];
	selectedSoftware: string | null = null;
	loading = false;
	// fetching = false;
	memoDialog = false;
	downloadDialog = false;
	sendReminderDialog = false;
	selectedClient: IInvitedObject | IRelatedObject | null = null;
	selectedClientIndex: number | null = null;

	actions: any[] = [
		{
			name: 'email',
			icon: 'mdi-email-outline',
			action: () => {
				this.openReminderDialogForBulk();
			},
			enabled: this.status !== EClientStatus.COMPLETE,
		},
		{
			name: 'undo',
			icon: 'mdi-arrow-u-left-bottom',
			action: () => {
				this.undoClientsBulk();
			},
			enabled: this.status === EClientStatus.COMPLETE,
		},
		{
			name: 'delete',
			icon: 'mdi-trash-can-outline',
			action: () => {
				this.deleteClientsBulk();
			},
			enabled: this.status !== EClientStatus.REVIEW,
		},
		{
			name: 'complete',
			icon: 'mdi-checkbox-marked-circle-outline',
			action: () => {
				this.completeClientsBulk();
			},
			enabled: this.status === EClientStatus.REVIEW,
		},
	];

	headers: any[] = [
		{
			text: '',
			align: 'center',
			sortable: false,
			value: 'checkbox',
			class: '',
			cellClass: '',
		},
		{
			text: 'Last action taken',
			align: 'center',
			sortable: false,
			value: 'lastActionTaken',
			class: this.status === EClientStatus.PROGRESS ? 'text-center' : 'hide',
			cellClass: this.status === EClientStatus.PROGRESS ? '' : 'hide',
		},
		{
			text: 'Date Completed',
			align: 'center',
			sortable: true,
			value: 'dateCompleted',
			class: this.status === EClientStatus.COMPLETE ? 'text-center' : 'hide',
			cellClass: this.status === EClientStatus.COMPLETE ? '' : 'hide',
		},
		{
			text: 'Date Received',
			align: 'center',
			sortable: true,
			value: 'dateReceived',
			class: this.status === EClientStatus.REVIEW ? 'text-center' : 'hide',
			cellClass: this.status === EClientStatus.REVIEW ? '' : 'hide',
		},
		{
			text: 'Name',
			align: 'left',
			sortable: false,
			value: 'name',
		},
		{
			text: 'Email',
			align: 'left',
			sortable: false,
			value: 'email',
		},

		{
			text: 'Reminder sent',
			align: 'center',
			sortable: false,
			value: 'reminded',
			class: this.status === EClientStatus.PENDING || this.status === EClientStatus.PROGRESS ? 'text-center' : 'hide',
			cellClass: this.status === EClientStatus.PENDING || this.status === EClientStatus.PROGRESS ? '' : 'hide',
		},
		{
			text: 'Undo',
			align: 'center',
			sortable: false,
			value: 'undo',
			class: this.status === EClientStatus.COMPLETE ? 'text-center' : 'hide',
			cellClass: this.status === EClientStatus.COMPLETE ? '' : 'hide',
		},
		{
			text: 'Report Download',
			align: 'center',
			sortable: false,
			value: 'download',
			class: this.status === EClientStatus.REVIEW ? 'text-center' : 'hide',
			cellClass: this.status === EClientStatus.REVIEW ? '' : 'hide',
		},
		{
			text: 'Memo',
			align: 'center',
			sortable: false,
			value: 'memo',
			class: this.status === EClientStatus.REVIEW ? 'text-center' : 'hide',
			cellClass: this.status === EClientStatus.REVIEW ? '' : 'hide',
		},

		{
			text: this.status === EClientStatus.REVIEW ? 'Send Email' : 'Send Reminder',
			align: 'center',
			sortable: false,
			value: 'sendEmail',
			class: this.status === EClientStatus.COMPLETE ? 'hide' : 'text-center',
			cellClass: this.status === EClientStatus.COMPLETE ? 'hide' : '',
		},
		{
			text: 'Delete',
			align: 'center',
			sortable: false,
			value: 'delete',
			class: this.status === EClientStatus.REVIEW ? 'hide' : 'text-center',
			cellClass: this.status === EClientStatus.REVIEW ? 'hide' : '',
		},
		{
			text: 'Review Complete',
			align: 'center',
			sortable: false,
			value: 'complete',
			class: this.status === EClientStatus.REVIEW ? 'text-center' : 'hide',
			cellClass: this.status === EClientStatus.REVIEW ? '' : 'hide',
		},
	];

	@Getter('auth/userName') userName!: string | null;
	@Getter('auth/accountantTaxSoftware') accountantTaxSoftware!: string | null;

	get softwareList() {
		// @ts-ignore
		return Object.keys(ESoftware).map(v => ESoftware[v]);
	}

	get indeterminate(): boolean {
		if (this.clientList.length > this.selectedClients.length && this.selectedClients.length > 0) {
			return true;
		}
		return false;
	}

	get checkAllStatus(): boolean {
		if (this.clientList.length > 0 && this.selectedClients.length === this.clientList.length) {
			return true;
		}
		return false;
	}

	reminderSentDays(client: IInvitedObject | IRelatedObject): string {
		if (!client.reminderSentDate) return '-';
		const diffDays = this.$moment(new Date()).diff(this.$moment(client.reminderSentDate), 'days');
		if (diffDays === 0) return 'Today';
		return `${diffDays} days ago`;
	}

	changeSoftware(software: string) {
		if (this.accountantTaxSoftware === software) return;
		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.change'),
			text: 'Do you want to change your default tax software?',
			pending: async () => {
				this.$store.commit(`accountant/${FETCHING}`, true);
				const result = await this.$store.dispatch(`auth/${UPDATE_ATTRIBUTES}`, { 'custom:software': software });
				if (!result) {
					this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: `${this.$i18n.t('message.fail.update')}` });
					return;
				}
				this.selectedSoftware = this.accountantTaxSoftware;
				this.$store.commit(`accountant/${FETCHING}`, false);
			},
		});
	}

	selectAll() {
		if (this.selectedClients.length < this.clientList.length) {
			this.selectedClients = this.clientList;
		} else if (this.selectedClients.length === this.clientList.length) {
			this.selectedClients = [];
		}
	}

	openMemoDialog(client: IInvitedObject | IRelatedObject, index: number) {
		this.memoDialog = true;
		this.selectedClient = client;
		this.selectedClientIndex = index;
	}

	closeMemoDialog() {
		this.memoDialog = false;
		this.selectedClient = null;
		this.selectedClientIndex = null;
	}

	openSendReminderDialog(client: IInvitedObject | IRelatedObject) {
		this.selectedClients = [];
		this.selectedClient = client;
		this.sendReminderDialog = true;
	}

	closeSendReminderDialog() {
		this.sendReminderDialog = false;
		this.selectedClient = null;
		this.selectedClients = [];
		this.$emit('retrieve');
	}

	openDownloadDialog(client: IRelatedObject) {
		if (!this.selectedSoftware) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('message.select', { target: 'software' }),
			});
			return;
		}

		this.selectedClient = client;
		this.downloadDialog = true;
	}

	closeDownloadDialog() {
		this.downloadDialog = false;
		this.selectedClient = null;
	}

	// 상단 icons
	openReminderDialogForBulk() {
		this.selectedClient = null;
		if (this.selectedClients.length === 0) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: this.$t('message.select', { target: 'clients' }),
			});
			return;
		}
		this.sendReminderDialog = true;
	}

	deleteClientsBulk() {
		this.selectedClient = null;
		if (this.selectedClients.length === 0) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: this.$t('message.select', { target: 'clients' }),
			});
			return;
		}
		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.targetDelete', { target: 'these clients' }),
			text: this.$t('message.delete'),
			pending: async () => {
				const result = await Promise.all(
					this.selectedClients.map(async client => {
						return await this.deleteAllRelations(client);
					}),
				);
				if (!result) {
					this.$store.dispatch(
						ADD_TO_MESSAGE_QUEUE,
						{ color: 'error', msg: `${this.$i18n.t('message.fail.delete')}` },
						{ root: true },
					);
					return;
				}
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.delete') });
				this.retrieve();
			},
		});
	}

	async deleteAllRelations(object: IInvitedObject | IRelatedObject): Promise<boolean> {
		if ('email' in object) {
			// case:  InvitedObject
			const result = await this.$store.dispatch(`accountant/${DELETE_INVITED_OBJECT}`, object.id);
			return result;
		} else {
			// case: RelatedObject
			const previousInvitedObjects = this.invitedList.filter(v => v.email === object.relatedUser.email);
			const previousInvitationObjects = this.invitations.filter(v => v.user.email === object.relatedUser.email);
			const resultOfInvitedObject = await Promise.all(
				[...previousInvitedObjects, ...previousInvitationObjects].map(async invitation => {
					return await this.$store.dispatch(`accountant/${DELETE_INVITED_OBJECT}`, invitation.id);
				}),
			);
			if (resultOfInvitedObject.includes(false)) {
				return false;
			}
			const resultOfRelatedObject = await this.$store.dispatch(`accountant/${DELETE_RELATED_OBJECT}`, object.id);
			if (!resultOfRelatedObject) {
				return false;
			}
			return true;
		}
	}

	async completeClient(relatedObject: IRelatedObject): Promise<boolean> {
		const statusChanged = { ...relatedObject, status: 'COMPLETED' };
		const result = await this.$store.dispatch(`accountant/${UPDATE_RELATED_OBJECT}`, statusChanged);
		return result;
	}

	async undoComplete(relatedObject: IRelatedObject): Promise<boolean> {
		const statusChanged = { ...relatedObject, status: 'IN_REVIEW' };
		const result = await this.$store.dispatch(`accountant/${UPDATE_RELATED_OBJECT}`, statusChanged);
		return result;
	}

	onclickDelete(object: IInvitedObject | IRelatedObject) {
		this.selectedClients = [];
		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.targetDelete', { target: 'client' }),
			text: this.$t('message.delete'),
			pending: async () => {
				const resultOfDelete = await this.deleteAllRelations(object);
				if (!resultOfDelete) {
					this.$store.dispatch(
						ADD_TO_MESSAGE_QUEUE,
						{ color: 'error', msg: `${this.$i18n.t('message.fail.delete')}` },
						{ root: true },
					);
					return;
				}
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.delete') });
				this.retrieve();
			},
		});
	}

	onclickComplete(relatedObject: IRelatedObject) {
		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.confirm'),
			text: 'Are you sure you want to confirm?',
			pending: async () => {
				const resultOfAccept = await this.completeClient(relatedObject);
				if (!resultOfAccept) {
					this.$store.dispatch(
						ADD_TO_MESSAGE_QUEUE,
						{ color: 'error', msg: `${this.$i18n.t('message.fail.update')}` },
						{ root: true },
					);
					return;
				}
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.update') });
				this.retrieve();
			},
		});
	}

	onclickUndo(relatedObject: IRelatedObject) {
		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.confirm'),
			text: 'Are you sure you want to undo?',
			pending: async () => {
				const resultOfUndo = await this.undoComplete(relatedObject);
				if (!resultOfUndo) {
					this.$store.dispatch(
						ADD_TO_MESSAGE_QUEUE,
						{ color: 'error', msg: `${this.$i18n.t('message.fail.undo')}` },
						{ root: true },
					);
					return;
				}
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.undo') });
				this.retrieve();
			},
		});
	}

	completeClientsBulk() {
		this.selectedClient = null;
		if (this.selectedClients.length === 0) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: this.$t('message.select', { target: 'clients' }),
			});
			return;
		}
		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.confirm'),
			text: 'Are you sure you want to confirm?',
			pending: async () => {
				const resultOfComplete = await Promise.all(
					this.selectedClients.map(async client => {
						return await this.completeClient(client);
					}),
				);

				if (resultOfComplete.includes(false)) {
					this.$store.dispatch(
						ADD_TO_MESSAGE_QUEUE,
						{ color: 'error', msg: `${this.$i18n.t('message.fail.update')}` },
						{ root: true },
					);
					return;
				}
				this.retrieve();
			},
		});
	}

	undoClientsBulk() {
		this.selectedClient = null;
		if (this.selectedClients.length === 0) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: this.$t('message.select', { target: 'clients' }),
			});
			return;
		}
		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.confirm'),
			text: 'Are you sure you want to undo?',
			pending: async () => {
				const resultOfUndo = await Promise.all(
					this.selectedClients.map(async client => {
						return await this.undoComplete(client);
					}),
				);

				if (resultOfUndo.includes(false)) {
					this.$store.dispatch(
						ADD_TO_MESSAGE_QUEUE,
						{ color: 'error', msg: `${this.$i18n.t('message.fail.update')}` },
						{ root: true },
					);
					return;
				}
				this.retrieve();
			},
		});
	}

	retrieve() {
		this.$emit('retrieve');
		this.init();
	}

	init() {
		this.selectedClients = [];
		this.selectedSoftware = this.accountantTaxSoftware || '';
	}

	created() {
		this.init();
	}
}
</script>
<style lang="scss" scoped>
.clientListWrapper {
	padding: 36px 32px;
	margin-bottom: 24px;
	overflow-y: auto;
	.subtitle {
		font-family: $poppins;
		font-weight: $font-semibold;
		font-size: 18px;
		color: $orange;
		margin-left: 16px;
		margin-bottom: 25px;
	}

	.listTopWrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;

		.actionWrapper {
			display: flex;
			align-items: center;
			margin-left: 16px;

			.checkbox {
				margin-top: 0;
				padding-top: 0;
				padding-right: 8px;
			}
			.topIconWrap {
				padding-right: 8px;
			}
		}
		.softwareWrap {
			display: flex;
			justify-content: center;
			align-items: center;
			.selectFormWrap {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 12px;
			}
			.text {
				font-family: $poppins;
				font-size: 14px;
				line-height: 26px;
				letter-spacing: 0.25px;
				font-weight: 500;
				margin-right: 12px;
			}
		}
	}

	table {
		// thead {
		// tr {
		th {
			font-family: $poppins;
			font-weight: $font-medium;
			background-color: $offWhite !important;
			height: 41px !important;
			border-top: 1px solid $outline;
			border-bottom: 1px solid $outline;
		}
		// }
		// }

		.avatar {
			margin-right: 8px;
		}

		.clientName {
			font-size: 16px;
			font-weight: $font-medium;
		}

		.clientEmail {
			font-size: 16px;
		}
	}
}

.centerFlex {
	display: flex;
	align-items: center;
	justify-content: center;
}
.leftFlex {
	display: flex;
	align-items: center;
	justify-content: left;
}
.text-left {
	text-align: left !important;
}
.text-center {
	text-align: center !important;
}
</style>
