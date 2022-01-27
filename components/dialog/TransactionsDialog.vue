<template>
	<v-dialog :value="dialog" width="1400" persistent content-class="ct-scroll" @keydown.esc="close">
		<div>
			<div class="dialogCardWrapper cardWrapper" :class="selectedTransactions.length > 0 ? '-selected' : ''">
				<div class="topToolbar">
					<v-icon class="closeBtn" color="primaryLight" @click="close"> mdi-close </v-icon>

					<div class="toolButtons">
						<div class="filters">
							<TransactionFilter v-if="selectedTransactions.length === 0" />
							<span v-else> {{ selectedTransactions.length }} items selected </span>
						</div>

						<div class="buttonsWrapper -right">
							<template v-if="selectedTransactions.length === 0">
								<Button
									:rounded="true"
									:height="44"
									:fontsize="14"
									:outlined="true"
									color="primary"
									head-icon="mdi-plus"
									@click="onClickAddTransaction"
								>
									Add transaction
								</Button>
							</template>
							<template v-else>
								<Button
									:height="44"
									:width="44"
									:outlined="true"
									color="primary"
									head-icon="mdi-trash-can-outline"
									@click="onClickDelete(selectedTransactions)"
								>
								</Button>

								<v-menu v-if="!typeChangable" offset-y>
									<template #activator="{ on, attrs }">
										<div v-bind="attrs" v-on="on">
											<Button
												:height="44"
												:fontsize="14"
												color="primary"
												fontcolor="white"
												head-icon="mdi-pencil-outline"
												tail-icon="mdi-menu-down"
												@click="() => {}"
											>
												{{ $t('page.transaction.editType') }}
											</Button>
										</div>
									</template>
									<ProductMenuList :product-menu-list="productMenuList" />
								</v-menu>
							</template>
						</div>
					</div>
				</div>

				<div class="transactionsWrapper">
					<v-card color="white" elevation="0">
						<TransactionsTable
							height="calc(90vh - 172px)"
							:fixed-header="true"
							:submit-type="EManualSubmitType.CREATE"
							:provider="null"
							:target-transactions="transactions"
							:adding="Boolean(createdTransaction)"
							@callback="successCallback"
							@cancelCreate="setCreatedTransaction(null)"
							@cancelUpdate="setUpdatedTransaction(null)"
							@select="onSelect"
							@unselect="onUnSelect"
							@setSelected="setSelected"
						/>
					</v-card>

					<div class="paginationWrapper">
						<div class="paginationInner">
							{{ paginationText }}
							<ArrowPagination
								:loading="loading"
								:page="params.page"
								:page-length="pageLength"
								@next="onClickNext"
								@prev="onClickPrev"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Mutation, Prop, State, Watch } from 'nuxt-property-decorator';

import { typeSelectorList } from '../select/TypeSelector.vue';
import ProductMenuList from '../list/ProductMenuList.vue';
import ExtraTransaction from '~/components/pages/transaction/ExtraTransaction.vue';
import TransactionsTable from '~/components/table/TransactionsTable.vue';
import TransactionItem from '~/components/pages/transaction/TransactionItem.vue';
import TransactionFilter from '~/components/pages/transaction/TransactionFilter.vue';
import Button from '~/components/button/Button.vue';
import TransactionDefault from '~/components/mixins/TransactionDefault.vue';
import { IFlattenTransactionType, ITransactionRecord } from '~/types/transaction/types';
import {
	CLEAR_ALL_FILTERS,
	DELETE_MANUAL_IMPORTED_TRANSACTIONS_ALL,
	LOAD_TRANSACTIONS,
	SET_ACCOUNT_FILTER,
	SET_CREATED_TRANSACTION,
	SET_MANUAL_IMPORTED_TRANSACTION,
	SET_PARAMS,
	SET_MANUAL_UPDATED_TRANSACTION,
	SET_UPDATED_TRANSACTION,
	typeEditable,
	ADD_SELECTED_TRANSACTION,
	REMOVE_SELECTED_TRANSACTION,
	SET_SELECTED_TRANSACTIONS,
} from '~/store/transaction';
import NothingText from '~/components/text/NothingText.vue';
import ArrowPagination from '~/components/pagination/ArrowPagination.vue';
import { pageLength, paginationText } from '~/utils/application';
import { IPlatform, IUserTransactionRecordSource } from '~/types/provider/types';
import { uniqueKeyChecker } from '~/utils/func';
import { LOAD_USED_ASSETS } from '~/store/asset';
import { ICognitoUserExt } from '~/types/auth/types';

@Component({
	components: {
		TransactionsTable,
		NothingText,
		ArrowPagination,
		TransactionFilter,
		TransactionItem,
		Button,
		ExtraTransaction,
		ProductMenuList,
	},
})
export default class TransactionsDialog extends TransactionDefault {
	@Prop({ required: true }) dialog!: boolean;
	@Prop() injectedPlatform!: IPlatform | undefined;
	@Prop() injectedAccount!: IUserTransactionRecordSource | undefined;

	@State(({ transaction }) => transaction.selectedTransactions) selectedTransactions!: ITransactionRecord[];
	@State(({ transaction }) => transaction.transactions) transactions!: ITransactionRecord[];
	@State(({ auth }) => auth.user) user!: ICognitoUserExt | null;
	@State(({ transaction }) => transaction.createdTransaction) createdTransaction!: ITransactionRecord | null;
	@State(({ transaction }) => transaction.totalTransactions) totalTransactions!: number;
	@State(({ transaction }) => transaction.transactionTypeArr) transactionTypeArr!: IFlattenTransactionType[];

	get editable(): boolean {
		return typeEditable(this.selectedTransactions);
	}

	get typeChangable(): boolean {
		return uniqueKeyChecker(this.selectedTransactions, 'category');
	}

	get paginationText(): string {
		return paginationText(this.params.page, this.params.size, this.totalTransactions, this.transactions.length);
	}

	get productMenuList() {
		const tempTransaction =
			this.selectedTransactions && this.selectedTransactions[0] ? this.selectedTransactions[0] : null;
		if (tempTransaction === null) return [];
		return typeSelectorList(tempTransaction, this.transactionTypeArr, t =>
			this.onChangeTypes(this.selectedTransactions, t),
		);
	}

	get pageLength(): number {
		return pageLength(this.totalTransactions, this.params.size);
	}

	@Watch('dialog')
	watchDialog(newVal: boolean) {
		if (newVal) {
			this.newSetting();
		}
	}

	@Mutation(`transaction/${SET_CREATED_TRANSACTION}`) setCreatedTransaction!: any;
	@Mutation(`transaction/${SET_UPDATED_TRANSACTION}`) setUpdatedTransaction!: any;

	onSelect(transaction: ITransactionRecord) {
		this.$store.commit(`transaction/${ADD_SELECTED_TRANSACTION}`, transaction);
	}

	onUnSelect(transaction: ITransactionRecord) {
		this.$store.commit(`transaction/${REMOVE_SELECTED_TRANSACTION}`, transaction);
	}

	setSelected(transactions: ITransactionRecord[]) {
		this.$store.commit(`transaction/${SET_SELECTED_TRANSACTIONS}`, transactions);
	}

	close() {
		this.$emit('close');
		this.$store.commit(`transaction/${CLEAR_ALL_FILTERS}`);
		this.$store.commit(`transaction/${SET_MANUAL_UPDATED_TRANSACTION}`, null);
		this.$store.commit(`transaction/${SET_MANUAL_IMPORTED_TRANSACTION}`, null);
		this.$store.commit(`transaction/${DELETE_MANUAL_IMPORTED_TRANSACTIONS_ALL}`);
		setTimeout(() => {
			this.$store.commit(`transaction/${LOAD_TRANSACTIONS}`, []);
		}, 200);
	}

	newSetting() {
		let finalParams = this.params;
		if (this.injectedPlatform) {
			const argv = this.injectedPlatform.provider
				? this.injectedPlatform.provider.id
				: this.injectedPlatform.asset?.symbol;
			finalParams = this.platformFilterSetter(argv || null);
		} else if (this.injectedAccount) {
			this.$store.commit(`transaction/${SET_ACCOUNT_FILTER}`, this.injectedAccount.name);
			// @ts-ignore
			finalParams = {
				...this.params,
				sourceName: this.injectedAccount.name || null,
				providerId: null,
				blockchainAsset: null,
				page: 0,
			};
		}

		this.$store.commit(`transaction/${SET_PARAMS}`, finalParams);
		this.$store.dispatch(`asset/${LOAD_USED_ASSETS}`, this.user?.username || '');
		this.retrieveAction(finalParams);
	}

	successCallback() {
		this.setCreatedTransaction(null);
		this.$emit('reimportSuccess');
	}
}
</script>

<style lang="scss" scoped>
.cardWrapper {
	background-color: $white;
	border: 1px solid $outline;
	padding: 24px;
	height: 90vh;

	&.-selected {
		background-color: $offWhite;
	}

	.topToolbar {
		height: 72px;
		margin-right: 48px;
		.toolButtons {
			display: flex;
			justify-content: space-between;

			.filters {
				display: flex;
				align-items: center;
				gap: 12px;
				font-family: $poppins;
				font-weight: $font-medium;
				font-size: 16px;
				letter-spacing: 0.25px;
			}
		}
	}

	.transactionsWrapper {
		grid-column: span 12 / span 12;

		.createForm {
			margin-top: 12px;
			padding: 32px 36px;
			background-color: $offWhite;
		}

		.paginationWrapper {
			margin-top: 24px;
			display: flex;
			gap: 20px;
			justify-content: flex-end;

			.paginationInner {
				display: flex;
				align-items: center;
			}
		}
	}
}
</style>
