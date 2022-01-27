<template>
	<client-only>
		<div :class="isAccountant ? 'accountantBodyWrapper' : ''">
			<ProductTitleSection v-if="!isAccountant" :no-margin="true">
				<template slot="title">
					{{ $t('page.profile.pageTitle') }}
				</template>
			</ProductTitleSection>

			<div class="tabWrapper">
				<div>
					<v-tabs v-model="tab" fixed-tabs background-color="offWhite" class="tabs">
						<v-tab>{{ String($t('page.profile.profile')).toUpperCase() }}</v-tab>
						<v-tab>{{ String($t('page.profile.setting')).toUpperCase() }}</v-tab>
					</v-tabs>
				</div>
			</div>

			<v-tabs-items v-if="!pageLoading" v-model="tab" class="tabItemsWrapper">
				<v-tab-item :key="0" class="tabItem" :transition="false">
					<div class="twoLinesWrapper">
						<div>
							<div class="singleColumn">
								<ProductCard :title="$t('page.profile.profile')">
									<ProfileForm />
								</ProductCard>
								<ProductCard v-if="!isAccountant" title="Connected Accountant">
									<template v-if="isSuccessToLoadAccountant">
										<div v-if="!isExistRelatedAccountant" class="text-align-center">
											<div class="accountantBox">
												<v-icon>mdi-account-off</v-icon>
												<div class="innerText">You have no connects right now.</div>
											</div>
											<div v-if="invitedList.length > 0" class="invitationSentWrap">
												Invitation sent :
												<v-chip
													v-for="(invitedObject, idx) in invitedList"
													:key="`${idx}-invitedObject`"
													outlined
													close
													close-icon="mdi-close"
													@click:close="deleteInvitedObject(invitedObject)"
													>{{ invitedObject.email }}
												</v-chip>
											</div>
										</div>
										<div v-else class="text-align-right">
											<div class="accountantBox -mb">
												<div class="innerGrid">
													<div class="accountantAvatar">{{ relatedAccountantName[0] || '-' }}</div>
													<div class="accountantInfo">
														<div class="name">{{ relatedAccountantName }}</div>
														<div class="email">{{ relatedAccountantEmail }}</div>
													</div>
												</div>
											</div>
											<div class="buttonsWrapper -right">
												<Button fontcolor="white" color="primary" :fontsize="14" @click="disconnectAccountant">
													Disconnect
												</Button>
											</div>
										</div>
									</template>
									<template v-else>
										<FailedAndRefreshCard @refresh="getConnectedAccountant" />
									</template>
								</ProductCard>
								<AcceptAccountant
									:dialog="invitationsDialog"
									@close="invitationsDialog = false"
									@retrieve="retrieveAccountantConnections"
								/>
							</div>
						</div>
						<div>
							<div class="singleColumn">
								<ProductCard
									:title="
										isAccountant
											? `${$t('page.profile.companyAddress')} (Optional)`
											: `${$t('page.profile.address')} (Optional)`
									"
								>
									<AddressForm />
								</ProductCard>
								<ProductCard :title="$t('page.profile.uploadProfilePhoto')">
									<ProfilePhotoForm />
								</ProductCard>
							</div>
						</div>
					</div>
				</v-tab-item>
				<v-tab-item :key="1" class="tabItem" :transition="false">
					<div class="twoLinesWrapper">
						<div>
							<div class="singleColumn">
								<ProductCard :title="$t('page.profile.changePassword.title')">
									<div>
										<ChangePasswordForm />
										<LockOverlay
											:lock="identityType !== EIdentityType.COGNITO"
											:msg="$t('page.profile.socialNotice')"
										/>
									</div>
								</ProductCard>
								<ProductCard v-if="!isAccountant" :title="$t('page.profile.deleteData.title')">
									<div>
										<div class="information">
											{{ $t('page.profile.deleteData.desc') }}
										</div>
										<div class="transactionDelete">
											<div>
												<span>
													<Button
														:disabled="deleting"
														color="primary"
														:outlined="true"
														:width="257"
														:height="44"
														:fontsize="14"
														@click="onClickDeleteTransaction"
													>
														Delete transaction data
													</Button>
												</span>
											</div>
										</div>
									</div>
								</ProductCard>

								<div>
									<LinkText :to="null" @click="onClickDeleteAccount">
										{{ $t('page.profile.deleteAccount.textButton') }}
									</LinkText>
									<DeleteAccountDialog :dialog="deleteAccountDialog" @close="deleteAccountDialog = false" />
								</div>
							</div>
						</div>
						<div>
							<div class="singleColumn">
								<ProductCard v-if="!isAccountant" title="Tax Strategy">
									<div class="taxStrategyWrap">
										<span>
											Your current tax strategy is <b>{{ currentMethod }}</b>
										</span>
										<Button
											fontcolor="white"
											color="primary"
											:width="122"
											:height="44"
											:fontsize="14"
											:rounded="true"
											@click="openTaxMethodDialog"
										>
											{{ $t('common.change') }}
										</Button>
										<ChangeTaxMethodDialog :dialog="taxMethodDialog" @close="closeTaxMethodDialog" />
									</div>
								</ProductCard>
								<ProductCard :title="$t('page.profile.notification.title')">
									<NotificationForm />
								</ProductCard>

								<ProductCard :title="$t('page.profile.paypal.title')">
									<LinkPaypalCard />
								</ProductCard>
							</div>
						</div>
					</div>
				</v-tab-item>
			</v-tabs-items>
		</div>
	</client-only>
</template>

<script lang="ts">
import { Vue, Component, State, Getter } from 'nuxt-property-decorator';
import ProductCard from '~/components/card/ProductCard.vue';
import ProfileForm from '~/components/form/ProfileForm.vue';
import ChangePasswordForm from '~/components/form/ChangePasswordForm.vue';
import AddressForm from '~/components/form/AddressForm.vue';
import ProfilePhotoForm from '~/components/form/ProfilePhotoForm.vue';
import NotificationForm from '~/components/form/NotificationForm.vue';
import DeleteAccountDialog from '~/components/dialog/DeleteAccountDialog.vue';
import LinkPaypalCard from '~/components/card/LinkPaypalCard.vue';
import LockOverlay from '~/components/overlay/LockOverlay.vue';
import { LOAD_PROVIDER_SOURCES } from '~/store/provider';
import { IUserTransactionRecordSource } from '~/types/provider/types';
import { ADD_TO_CLOSING_QUEUE, ADD_TO_MESSAGE_QUEUE, CONFIRM_ACTION, CONFIRM_ERROR, PAGE_LOADER } from '~/store';
import ConfirmDialog from '~/components/dialog/ConfirmDialog.vue';
import { getFullname } from '~/utils/application';
import { ITransactionRecordBatch } from '~/types/transaction/types';
import { EAuthRole } from '~/types/common/types';
import Button from '~/components/button/Button.vue';
import ChangeTaxMethodDialog from '~/components/dialog/ChangeTaxMethodDialog.vue';
import AcceptAccountant from '~/components/dialog/AcceptAccountant.vue';
import {
	DELETE_INVITED_OBJECT,
	DELETE_RELATED_OBJECT,
	GET_INVITATIONS_BY_EMAIL,
	GET_INVITED_LIST,
	GET_RELATED_ACCOUNTANTS,
} from '~/store/accountant';
import { IInvitedObject, IRelatedObject } from '~/types/accountant/types';
import { GET_AFFILIATE } from '~/store/affiliate';
import LinkText from '~/components/text/LinkText.vue';
import { ICognitoUserExt, EIdentityType } from '~/types/auth/types';
import { DELETE_ALL_CATEGORIZED_ITEMS, DELETE_ALL_TAX_CASES, GET_METHOD } from '~/store/tax';
import ProductTitleSection from '~/components/section/ProductTitleSection.vue';
import { DELETE_ALL_TRANSACTIONS } from '~/store/transaction';
import FailedAndRefreshCard from '~/components/card/FailedAndRefreshCard.vue';

@Component({
	components: {
		ProductCard,
		ProfileForm,
		ChangePasswordForm,
		AddressForm,
		ProfilePhotoForm,
		NotificationForm,
		DeleteAccountDialog,
		LockOverlay,
		LinkPaypalCard,
		ConfirmDialog,
		Button,
		ChangeTaxMethodDialog,
		AcceptAccountant,
		LinkText,
		ProductTitleSection,
		FailedAndRefreshCard,
	},
	meta: { auth: true, roles: [EAuthRole.INDIVIDUAL, EAuthRole.PROFESSIONAL] },
	layout: 'product',
	asyncData: async ({ store }) => {
		store.commit(PAGE_LOADER, true);
		await Promise.all([store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`)]);
	},
})
export default class Profile extends Vue {
	@State(state => state.isMobile) isMobile!: boolean;
	@State(state => state.pageLoading) pageLoading!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt | null;
	@State(({ accountant }) => accountant.invitedList) invitedList!: IInvitedObject[];
	@State(({ accountant }) => accountant.invitations) invitations!: IInvitedObject[];
	@State(({ accountant }) => accountant.relatedObject) relatedObject!: IRelatedObject;
	@State(({ provider }) => provider.providerSources) providerSources!: IUserTransactionRecordSource[];
	@State(({ provider }) => provider.importProcessor) importProcessor!: ITransactionRecordBatch[];
	@State(({ tax }) => tax.currentMethod) currentMethod!: string;

	tab: number = 0;
	EIdentityType = EIdentityType;
	deleteAccountLoading: boolean = false;
	deleteAccountDialog: boolean = false;
	taxMethodDialog: boolean = false;
	invitationsDialog: boolean = false;
	errorMsg: string = '';
	deleting: boolean = false;
	isSuccessToLoadAccountant: boolean = false;

	@Getter('auth/isNoticeEmailSubscribed') isNoticeEmailSubscribed!: boolean;
	@Getter('auth/userEmail') userEmail!: string;
	@Getter('auth/identityType') identityType!: EIdentityType;
	@Getter('auth/isAccountant') isAccountant!: boolean;
	@Getter('accountant/isExistRelatedAccountant') isExistRelatedAccountant!: boolean;
	@Getter('accountant/relatedAccountantEmail') relatedAccountantEmail!: string;
	@Getter('accountant/newInvitations') newInvitations!: IInvitedObject[];

	get relatedAccountantName(): string {
		return getFullname(this.relatedObject?.user) || '';
	}

	get username(): string {
		return this.user?.username || '';
	}

	onClickSignOut() {
		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.signOut'),
			text: this.$t('message.signOutConfirm'),
			pending: () => {
				this.$router.push('/callback/sign-out');
			},
		});
	}

	onClickDeleteAccount() {
		this.deleteAccountDialog = true;
	}

	onClickDeleteTransaction() {
		if (this.providerSources && this.providerSources.length === 0) {
			this.$store.commit(CONFIRM_ERROR, {
				title: 'Woops',
				text: this.$t('message.noDataToDelete'),
			});
			return;
		}

		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.delete'),
			text: this.$t('message.deleteTransactionsConfirm'),
			pending: () => this.deleteTransactionsAction(),
		});
	}

	async deleteTransactionsAction() {
		const messageId = await this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
			msg: 'Deleting...',
			color: 'primary',
			manual: true,
		});
		this.deleting = true;
		const res: boolean[] = await Promise.all([
			this.$store.dispatch(`transaction/${DELETE_ALL_TRANSACTIONS}`, this.username),
			this.$store.dispatch(`transaction/${DELETE_ALL_TAX_CASES}`, this.username),
			this.$store.dispatch(`transaction/${DELETE_ALL_CATEGORIZED_ITEMS}`, this.username),
		]);
		this.deleting = false;
		this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);

		this.$store.dispatch(ADD_TO_CLOSING_QUEUE, messageId);
		if (!res.includes(false)) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('message.success.delete'),
				text: this.$t('message.deleteAllTransactions'),
			});
		}
	}

	deleteInvitedObject(invitedObject: IInvitedObject) {
		this.$store.commit(CONFIRM_ACTION, {
			title: this.$t('common.targetDelete', { target: 'invitation' }),
			text: 'Are you sure you want to cancel invitation?',
			pending: async () => {
				const resultOfDelete = await this.$store.dispatch(`accountant/${DELETE_INVITED_OBJECT}`, invitedObject.id);
				if (!resultOfDelete) {
					this.$store.dispatch(
						ADD_TO_MESSAGE_QUEUE,
						{ color: 'error', msg: `${this.$i18n.t('message.fail.delete')}` },
						{ root: true },
					);
					return;
				}
				await this.getInvitedAccountants();
			},
		});
	}

	async deleteAllRelations(relatedObject: IRelatedObject): Promise<boolean> {
		// delete all previous invitatedObjects
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

	disconnectAccountant() {
		this.$store.commit(CONFIRM_ACTION, {
			title: 'Do you want to disconnect?',
			text: '',
			pending: async () => {
				const resultOfDelete = await this.deleteAllRelations(this.relatedObject);
				if (!resultOfDelete) {
					this.$store.dispatch(
						ADD_TO_MESSAGE_QUEUE,
						{ color: 'error', msg: `${this.$i18n.t('message.fail.delete')}` },
						{ root: true },
					);
					return;
				}
				this.retrieveAccountantConnections();
			},
		});
	}

	async getInvitations() {
		const params = { type: 'CLIENT' };
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

	async getInvitedAccountants() {
		const result = await this.$store.dispatch(`accountant/${GET_INVITED_LIST}`, {
			params: { type: 'ACCOUNTANT' },
			userName: this.username,
		});
		if (!result) {
			this.$store.dispatch(
				ADD_TO_MESSAGE_QUEUE,
				{ color: 'error', msg: `${this.$i18n.t('message.fail.loadTarget', { target: 'invited users' })}` },
				{ root: true },
			);
		}
	}

	async getConnectedAccountant() {
		const params = { type: 'CLIENT' };
		const result = await this.$store.dispatch(`accountant/${GET_RELATED_ACCOUNTANTS}`, {
			params,
			userName: this.username,
		});
		this.isSuccessToLoadAccountant = result;
	}

	async retrieveAccountantConnections() {
		await Promise.all([this.getInvitations(), this.getConnectedAccountant(), this.getInvitedAccountants()]);
	}

	openTaxMethodDialog() {
		this.taxMethodDialog = true;
	}

	closeTaxMethodDialog() {
		this.taxMethodDialog = false;
	}

	async getTaxMethod() {
		await this.$store.dispatch(`tax/${GET_METHOD}`);
	}

	async getRewardInfo() {
		if (this.user?.attributes['custom:affiliate_id']) {
			await this.$store.dispatch(`affiliate/${GET_AFFILIATE}`, this.user?.attributes['custom:affiliate_id']);
		}
	}

	checkPaypalConnetion() {
		if (this.$route.query?.paypal === 'fail') {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('message.fail.connect'),
				text: this.$t('message.paypalFailed'),
			});
			this.tab = 1;
			this.$router.replace({ query: {} });
		}
		if (this.$route.query?.paypal === 'success') {
			this.tab = 1;
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: 'Successfully connected' });
			this.$router.replace({ query: {} });
		}
	}

	fetchOnServer() {
		return false;
	}

	async fetch() {
		let apiArr = [this.getRewardInfo(), this.getTaxMethod()];
		if (!this.isAccountant) {
			apiArr = apiArr.concat([this.getInvitations(), this.getConnectedAccountant(), this.getInvitedAccountants()]);
		}
		await Promise.all(apiArr);
		this.$store.commit(PAGE_LOADER, false);
		if (!this.isAccountant && this.newInvitations && this.newInvitations.length > 0) {
			this.invitationsDialog = true;
		}
	}

	mounted() {
		this.checkPaypalConnetion();
	}
}
</script>

<style lang="scss" scoped>
.v-field .v-input__append-inner {
	margin-top: 12px !important;
}

.tabWrapper {
	display: grid;
	@media (min-width: #{$breakpoint-xl}) {
		margin-top: 44px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		.tabs {
			grid-column: span 6 / span 6;
		}
	}
}

.tabItemsWrapper {
	margin-top: 48px;

	.tabItem {
		background-color: $offWhite;
	}
}

.twoLinesWrapper {
	display: grid;
	gap: 24px;
	@media (min-width: #{$breakpoint-xl}) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.singleColumn {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: 24px;

		.taxStrategyWrap {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
}

.transactionDelete {
	margin-top: 36px;
	display: flex;
	flex-direction: row-reverse;
}
.accountantBox {
	background-color: $offWhite;
	border-radius: 10px;
	padding: 20px;
	&.-mb {
		margin-bottom: 36px;
	}
	.innerGrid {
		display: flex;
		gap: 12px;
	}
	.innerText {
		margin-top: 4px;
		text-align: center;
	}
	.accountantAvatar {
		width: 56px;
		height: 56px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100%;
		background-color: $purpleDarkPale;
	}
	.accountantInfo {
		text-align: left;
		.name {
			font-family: $poppins;
			font-size: 23px;
		}
		.email {
			font-size: 16px;
			color: $primaryLight;
		}
	}
}
.invitationSentWrap {
	font-family: $poppins;
	font-size: 16px;
	margin-top: 20px;
}
</style>
