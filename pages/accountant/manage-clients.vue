<template>
	<div>
		<client-only>
			<div class="accountantBodyWrapper">
				<div class="searchTextFieldWrap">
					<v-text-field
						v-model.trim="searchClientInput"
						maxlength="40"
						outlined
						hide-details
						placeholder="Search for client’s email"
						prepend-inner-icon="mdi-magnify"
						class="textField"
					/>
				</div>

				<div v-if="!pageLoading" class="clientTapWrap">
					<div class="tabGridWrapper">
						<v-tabs v-model="tabs" background-color="offWhite" fixed-tabs class="tabsInner">
							<v-tabs-slider class="hidden"></v-tabs-slider>
							<v-tab class="clientTap">
								WAITING ({{ pendingClientList.length + inProgressClientList.length || 0 }})
							</v-tab>
							<v-tab class="clientTap">
								<v-icon small>mdi-star</v-icon>REVIEW ({{ reviewClientList.length || 0 }})
							</v-tab>
							<v-tab class="clientTap">COMPLETED ({{ completedClientList.length || 0 }})</v-tab>
						</v-tabs>
					</div>
					<v-tabs-items v-model="tabs">
						<v-tab-item :key="0" class="bg-offWhite" :transition="false">
							<ClientListCard
								:client-list="pendingClientList"
								:status="EClientStatus.PENDING"
								:max-height="510"
								:fetching="fetching"
								:is-success-to-load="isSuccessToLoad"
								@retrieve="retrieve"
							>
								Sign Up Pending ({{ pendingClientList.length || 0 }})
							</ClientListCard>
							<ClientListCard
								:client-list="inProgressClientList"
								:status="EClientStatus.PROGRESS"
								:max-height="500"
								:fetching="fetching"
								:is-success-to-load="isSuccessToLoad"
								@retrieve="retrieve"
							>
								Clients in progress ({{ inProgressClientList.length || 0 }})
							</ClientListCard>
						</v-tab-item>
						<v-tab-item :key="1" class="bg-offWhite" :transition="false">
							<ClientListCard
								:client-list="reviewClientList"
								:status="EClientStatus.REVIEW"
								:max-height="700"
								:fetching="fetching"
								:is-success-to-load="isSuccessToLoad"
								@retrieve="retrieve"
							/>
						</v-tab-item>
						<v-tab-item :key="2" class="bg-offWhite" :transition="false">
							<ClientListCard
								:client-list="completedClientList"
								:status="EClientStatus.COMPLETE"
								:max-height="700"
								:fetching="fetching"
								:is-success-to-load="isSuccessToLoad"
								@retrieve="retrieve"
							/>
						</v-tab-item>
					</v-tabs-items>
				</div>
				<AcceptInvitations
					v-if="tourIsDone"
					:dialog="showInvitationDialog"
					@close="invitationsDialog = false"
					@retrieve="retrieve"
				/>
			</div>
		</client-only>
	</div>
</template>

<script lang="ts">
import { Vue, State, Getter, Component } from 'nuxt-property-decorator';
import { EAuthRole } from '~/types/common/types';
import ClientListCard from '@/components/card/ClientListCard.vue';
import { GET_INVITATIONS_BY_EMAIL, GET_INVITED_LIST, GET_RELATED_LIST } from '~/store/accountant';
import { EBoolean, ICognitoUserExt } from '~/types/auth/types';
import { IInvitedObject, IRelatedObject } from '~/types/accountant/types';
import AcceptInvitations from '~/components/dialog/AcceptInvitations.vue';
import { RETRIEVE_ME } from '~/store/auth';
import { ADD_TO_MESSAGE_QUEUE, PAGE_LOADER } from '~/store';

export enum EClientStatus {
	PENDING = 'pending',
	PROGRESS = 'inProgress',
	REVIEW = 'review',
	COMPLETE = 'complete',
}

@Component({
	layout: 'product',
	meta: { auth: true, roles: [EAuthRole.PROFESSIONAL] },
	components: { ClientListCard, AcceptInvitations },
})
export default class ManageClients extends Vue {
	@State(state => state.pageLoading) pageLoading!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;
	@State(({ accountant }) => accountant.invitedList) invitedList!: IInvitedObject[];
	@State(({ accountant }) => accountant.relatedList) relatedList!: IRelatedObject[];
	@State(({ accountant }) => accountant.fetching) fetching!: boolean;

	tabs: number = 0;
	isSuccessToLoad: boolean | null = null;
	searchClientInput: string = '';
	invitationsDialog: boolean = true;
	EClientStatus = EClientStatus;

	@Getter('auth/userName') userName!: string | null;
	@Getter('auth/userEmail') userEmail!: string;
	@Getter('accountant/newInvitations') newInvitations!: IInvitedObject[];

	get showInvitationDialog(): boolean {
		return this.newInvitations.length > 0 && this.invitationsDialog;
	}

	get tourIsDone(): boolean {
		const attributes = this.user?.attributes;
		// @ts-ignore
		return attributes && attributes['custom:tour'] && attributes['custom:tour'] === EBoolean.TRUE;
	}

	get pendingClientList(): IInvitedObject[] {
		return this.invitedList.filter(v => v.status === 'INVITED').filter(v => v.email.includes(this.searchClientInput));
		// return this.invitedList;
	}

	get inProgressClientList(): IRelatedObject[] {
		return this.relatedList.filter(
			v => v.status === 'IN_PROGRESS' && v.relatedUser.email?.includes(this.searchClientInput),
		);
	}

	get reviewClientList(): IRelatedObject[] {
		return this.relatedList.filter(
			v => v.status === 'IN_REVIEW' && v.relatedUser.email?.includes(this.searchClientInput),
		);
	}

	get completedClientList(): IRelatedObject[] {
		return this.relatedList.filter(
			v => v.status === 'COMPLETED' && v.relatedUser.email?.includes(this.searchClientInput),
		);
	}

	async retrieve() {
		await Promise.all([await this.getInvitedClients(), await this.getRelatedClients(), await this.getInvitations()]);
	}

	// list of Pending
	async getInvitedClients() {
		const result = await this.$store.dispatch(`accountant/${GET_INVITED_LIST}`, {
			params: { type: 'CLIENT' },
			userName: this.userName,
		});
		return result;
	}

	// list of inProgress, inReview, completed
	async getRelatedClients() {
		const result = await this.$store.dispatch(`accountant/${GET_RELATED_LIST}`, {
			params: { type: 'CLIENT' },
			userName: this.userName,
		});
		return result;
	}

	async getInvitations() {
		const params = { type: 'ACCOUNTANT' };
		const result = await this.$store.dispatch(`accountant/${GET_INVITATIONS_BY_EMAIL}`, {
			params,
			userEmail: this.userEmail,
		});
		if (!result) {
			this.$store.dispatch(
				ADD_TO_MESSAGE_QUEUE,
				{ color: 'error', msg: `${this.$i18n.t('message.fail.loadTarget', { target: 'invitations' })}` },
				{ root: true },
			);
		}
	}

	fetchOnServer() {
		return false;
	}

	async fetch() {
		!this.user && (await this.$store.dispatch(`auth/${RETRIEVE_ME}`));
		this.$store.commit(PAGE_LOADER, true);
		await this.getInvitations();
		const results = await Promise.all([await this.getInvitedClients(), await this.getRelatedClients()]);
		this.isSuccessToLoad = !results.includes(false);
		this.$store.commit(PAGE_LOADER, false);
	}

	created() {}
}
</script>
<style lang="scss" scoped>
.hidden {
	display: none;
}
.searchTextFieldWrap {
	margin-bottom: 24px;

	.textField {
		width: 50%;
	}
}

.clientTapWrap {
	.tabGridWrapper {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));

		@media (min-width: #{$breakpoint-xl}) {
			grid-template-columns: repeat(12, minmax(0, 1fr));
		}

		.tabsInner {
			@media (min-width: #{$breakpoint-xl}) {
				grid-column: span 6 / span 6;
			}
		}
	}

	.v-tab {
		background-color: $outline;
		margin-right: 8px;
		border-top-left-radius: 0.125rem;
		border-top-right-radius: 0.125rem;
	}
	.v-tab--active {
		color: $primary;
		background-color: $orangeLight;
	}
	.clientTap {
		font-family: $poppins;
		font-weight: 500;
		letter-spacing: 0.15px;
	}
}

.checkbox {
	margin-top: 0px;
	padding-top: 0px;
}
</style>
