<template>
	<v-data-table
		id="transactionsTable"
		:vlaue="selectedTransactions"
		class="productTable"
		:class="selectedTransactions.length > 0 ? '-selected' : ''"
		:fixed-header="fixedHeader"
		:show-select="submitType === EManualSubmitType.CREATE"
		:items="finalTransactions"
		:item-key="submitType === EManualSubmitType.CREATE ? 'id' : 'tempDate'"
		hide-default-footer
		:headers="headers"
		:items-per-page="params.size"
		:sort-by="sortBy"
		:sort-desc="sortDesc"
		must-sort
		no-data-text="No transaction here. Please click ‘+Add’ button and add your data."
		loading-text="Loading..."
		:loading="loading"
		:height="height || 'auto'"
		@update:sort-by="onSortBy"
		@update:sort-desc="onSortDesc"
		@toggle-select-all="onSelectAll"
	>
		<template #[`header.category`]="{ header }">
			<span class="customTh">
				{{ header.text }}
				<TooltipCard>
					<ul>
						<li>Trade: Buy, Sell, Convert.</li>
						<li>Incoming: Deposit, Income, Mining, Reward, Airdrop, etc.</li>
						<li>Outgoing: Withdrawal, Other Expense, Fee, Interest Paid, etc.</li>
					</ul>
				</TooltipCard>
			</span>
		</template>

		<template #[`header.type`]="{ header }">
			<span class="customTh" style="cursor: pointer" @click="openNewTab">
				{{ header.text }}
				<v-icon small>mdi-open-in-new</v-icon>
			</span>
		</template>

		<template #[`body`]="{ items }">
			<tbody>
				<tr v-if="adding">
					<td
						:colspan="1000"
						class="bg-offWhite"
						:style="selectedTransactions.length > 0 ? { background: 'white' } : {}"
					>
						<ManualImportForm
							v-if="submitType === EManualSubmitType.CREATE"
							:make-new="true"
							:loading="manualImportLoading"
							:utc="false"
							:check-future="true"
							:check-timezone="true"
							:watch-fee="true"
							:injected-transaction="createdTransaction"
							:selectable-timezone="true"
							:provider="provider"
							:editable-provider="true"
							:init-switch="initSwitch"
							@onsubmit="manulImport"
							@cancel="$emit('cancelCreate')"
						/>
						<ManualImportForm
							v-else-if="submitType === EManualSubmitType.IMPORT"
							:make-new="true"
							:utc="true"
							:check-future="false"
							:check-timezone="true"
							:watch-fee="true"
							:injected-transaction="importedTransaction"
							:selectable-timezone="false"
							:provider="provider"
							:editable-provider="false"
							:init-switch="initSwitch"
							@onsubmit="temporaryManualImport"
							@cancel="$emit('cancelCreate')"
						/>
					</td>
				</tr>
				<template v-for="(item, index) in items">
					<TransactionRow
						v-if="shownIndex + shownNumber > index"
						:key="submitType === EManualSubmitType.CREATE ? item.id : item.tempDate"
						:disable-select="submitType === EManualSubmitType.IMPORT"
						:transaction="item"
						:temp-transaction="submitType === EManualSubmitType.IMPORT || isThisTemp(item)"
						@expand="onClickRow"
					/>
					<tr
						v-if="
							expandedTransacitons.length > 0 && !isThisTemp(item) && expandedTransacitons.find(v => v.id === item.id)
						"
						:key="submitType === EManualSubmitType.CREATE ? `expand-${item.id}` : `expand-${item.tempDate}`"
					>
						<td
							:colspan="1000"
							class="bg-offWhite"
							:style="selectedTransactions.length > 0 ? { background: 'white' } : {}"
						>
							<ExtraTransaction
								v-if="!updating(item)"
								:transaction="item"
								:injected-provider="provider"
								@cancel="clearExpanded"
								@setUpdate="() => setUpdatedTransaction(item)"
							/>
							<template v-else>
								<!-- IMPORT UPDATE -->
								<ManualImportForm
									v-if="submitType === EManualSubmitType.IMPORT"
									:make-new="false"
									:utc="true"
									:check-future="false"
									:check-timezone="false"
									:watch-fee="true"
									:injected-transaction="manualUpdatedTransaction"
									:selectable-timezone="false"
									:provider="provider"
									:editable-provider="false"
									:init-switch="initSwitch"
									@onsubmit="temporaryManualUpdate"
									@cancel="onCancelUpdate"
								/>
								<!-- UPDATE -->
								<ManualImportForm
									v-else
									:make-new="false"
									:utc="true"
									:check-future="true"
									:check-timezone="false"
									:watch-fee="false"
									:injected-transaction="updatedTransaction"
									:selectable-timezone="false"
									:provider="provider"
									:editable-provider="false"
									:init-switch="initSwitch"
									:get-provider-from-transaction="true"
									@onsubmit="updateTransaction"
									@cancel="onCancelUpdate"
								/>
							</template>
						</td>
					</tr>
				</template>
			</tbody>
		</template>
	</v-data-table>
</template>

<script lang="ts">
import { Component, Prop, State } from 'nuxt-property-decorator';
import TypeSelector from '../select/TypeSelector.vue';
import TooltipCard from '../tooltip/TooltipCard.vue';
import Chip from '../chip/Chip.vue';
import TransactionRow from '../pages/transaction/TransactionRow.vue';
import TransactionDefault from '~/components/mixins/TransactionDefault.vue';
import ManualImportForm, { EManualSubmitType } from '~/components/form/ManualImportForm.vue';
import TransactionItem from '~/components/pages/transaction/TransactionItem.vue';
import ExtraTransaction from '~/components/pages/transaction/ExtraTransaction.vue';
import { ETransactionType, IManualTransactionRecord, ITransactionRecord } from '~/types/transaction/types';
import { firstCharUppercase } from '~/utils/string';
import {
	ADD_MANUAL_IMPORTED_TRANSACTION,
	ADD_TEMP_TRANSACTION,
	ILoadTransactionsParams,
	SET_CREATED_TRANSACTION,
	SET_MANUAL_IMPORTED_TRANSACTION,
	SET_MANUAL_UPDATED_TRANSACTION,
	SET_UPDATED_TRANSACTION,
	UPDATE_MANUAL_IMPORTED_TRANSACTION,
	UPDATE_TRANSACTION,
} from '~/store/transaction';
import { ESortOrder } from '~/types/common/types';
import { IPlatform, ITransactionRecordProvider } from '~/types/provider/types';
import { tradeCategoryFilter } from '~/utils/application';
import { MANUAL_FORM_IMPORT } from '~/store/import';
import { LOAD_PROVIDER_SOURCES } from '~/store/provider';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { IManualFormImportDTO } from '~/types/import/dto';
import { TRANSACTION_TYPE_ARTICLE } from '~/utils/constants';

export interface ISelectItem {
	item: ITransactionRecord;
	value: boolean;
}

export interface ISelectAll {
	items: ITransactionRecord[];
	value: boolean;
}

@Component({
	components: {
		TransactionItem,
		ExtraTransaction,
		ManualImportForm,
		TypeSelector,
		TooltipCard,
		Chip,
		TransactionRow,
	},
})
export default class TransactionsTable extends TransactionDefault {
	@Prop() adding!: boolean;
	@Prop({ required: true }) submitType!: EManualSubmitType;
	@Prop({ required: true }) provider!: ITransactionRecordProvider;
	@Prop({ required: true }) targetTransactions!: ITransactionRecord[];
	@Prop() height!: number | undefined;
	@Prop() fixedHeader!: boolean;

	@State(({ transaction }) => transaction.selectedTransactions) selectedTransactions!: ITransactionRecord[];
	@State(({ transaction }) => transaction.tempTransactions) tempTransactions!: ITransactionRecord[];
	@State(({ transaction }) => transaction.createdTransaction) createdTransaction!: ITransactionRecord;
	@State(({ transaction }) => transaction.updatedTransaction) updatedTransaction!: ITransactionRecord;
	@State(({ transaction }) => transaction.importedTransaction) importedTransaction!: IManualTransactionRecord;
	@State(({ transaction }) => transaction.manualUpdatedTransaction)
	manualUpdatedTransaction!: IManualTransactionRecord;

	@State(({ transaction }) => transaction.manualImportedTransactions)
	manualImportedTransactions!: IManualTransactionRecord[];

	ETransactionType = ETransactionType;
	EManualSubmitType = EManualSubmitType;
	headers: any[] = [
		{ text: 'Date (UTC)', value: 'timestamp', sortable: true, align: 'center' },
		{ text: 'Account', value: 'batch.source.name', sortable: false, align: 'center' },
		{ text: 'Category', value: 'category', sortable: false, align: 'center' },
		{
			text: 'Sold or outgoing',
			value: 'transaction',
			sortable: false,
			align: 'center',
		},
		{
			text: 'Bought or incoming',
			value: 'none',
			sortable: false,
			align: 'center',
		},
		{ text: 'Type', value: 'type', sortable: false, align: 'center' },
	];

	initSwitch: boolean = false;
	sortBy: string | null = null;
	sortDesc: boolean | null = null;
	shownIndex: number = 0;
	shownNumber: number = 10;
	manualImportLoading: boolean = false;

	get finalTransactions(): ITransactionRecord[] {
		if (this.tempTransactions.length > 0) {
			return this.tempTransactions.concat(this.targetTransactions);
		} else {
			return this.targetTransactions;
		}
	}

	isThisTemp(transaction: ITransactionRecord): boolean {
		if (this.tempTransactions.length === 0) return false;
		return typeof transaction.id === 'string';
	}

	onSelectAll({ items, value }: ISelectAll) {
		const data = value ? items.filter(v => typeof v.id !== 'string') : [];
		this.$emit('setSelected', data);
	}

	openNewTab() {
		window.open(TRANSACTION_TYPE_ARTICLE, '_blank');
	}

	onCancelUpdate() {
		this.$emit('cancelUpdate');
	}

	setUpdatedTransaction(transaction: ITransactionRecord | IManualTransactionRecord) {
		if (this.submitType === EManualSubmitType.CREATE) {
			this.$store.commit(`transaction/${SET_CREATED_TRANSACTION}`, null);
			this.$store.commit(`transaction/${SET_UPDATED_TRANSACTION}`, transaction);
		} else {
			this.$store.commit(`transaction/${SET_MANUAL_IMPORTED_TRANSACTION}`, null);
			this.$store.commit(`transaction/${SET_MANUAL_UPDATED_TRANSACTION}`, transaction);
		}
	}

	updating(transaction: ITransactionRecord): boolean {
		return (
			Boolean(transaction && this.updatedTransaction && this.updatedTransaction?.id === transaction?.id) ||
			Boolean(this.manualUpdatedTransaction)
		);
	}

	async manulImport(data: ITransactionRecord, platform: IPlatform) {
		const reformed = tradeCategoryFilter(data);

		const DTO: IManualFormImportDTO = { data: [reformed] };
		if (!platform?.provider && !platform?.asset) {
			DTO.sourceName = platform?.name || '';
		} else if (platform.provider) {
			DTO.providerId = platform.provider.id;
		} else if (platform.asset) {
			DTO.assetSymbol = platform.asset.symbol;
		} else {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Out of case' });
			return;
		}

		this.manualImportLoading = true;
		const success: boolean = await this.$store.dispatch(`import/${MANUAL_FORM_IMPORT}`, DTO);
		this.manualImportLoading = false;

		this.$store.commit(`transaction/${ADD_TEMP_TRANSACTION}`, {
			...data,
			id: `temp-${this.tempTransactions.length}`,
			sourceName: platform.name,
		});
		if (success) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.update') });
			// await this.$store.dispatch(`transaction/${LOAD_TRANSACTIONS}`, this.params);
			this.initSwitch = !this.initSwitch;
			this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
		}
	}

	temporaryManualImport(data: ITransactionRecord, _platform: IPlatform) {
		const reformed = tradeCategoryFilter(data);
		this.$store.commit(`transaction/${ADD_MANUAL_IMPORTED_TRANSACTION}`, {
			...reformed,
			sourceName: this.provider.name,
			tempDate: new Date().valueOf(),
		});
		this.initSwitch = !this.initSwitch;
	}

	temporaryManualUpdate(data: ITransactionRecord, _platform: IPlatform) {
		const reformed = tradeCategoryFilter(data);
		this.$store.commit(`transaction/${UPDATE_MANUAL_IMPORTED_TRANSACTION}`, {
			...reformed,
			sourceName: this.provider.name,
		});
		this.expandedTransacitons = [];
		this.$store.commit(`transaction/${SET_MANUAL_UPDATED_TRANSACTION}`, null);
		this.initSwitch = !this.initSwitch;
	}

	async updateTransaction(data: ITransactionRecord, _platform: IPlatform) {
		const updateResponse = await this.$store.dispatch(`transaction/${UPDATE_TRANSACTION}`, data);
		if (updateResponse) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.update') });
			this.expandedTransacitons = [];
			this.$store.commit(`transaction/${SET_UPDATED_TRANSACTION}`, null);
			this.initSwitch = !this.initSwitch;
		} else {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$t('message.fail.update') });
		}
	}

	firstCharUppercase(str: string) {
		return firstCharUppercase(str);
	}

	onSortBy(e: string) {
		this.sortBy = e || null;
	}

	onSortDesc(e: boolean) {
		this.sortDesc = typeof e === 'boolean' ? e : null;
		const newSort =
			this.sortDesc === null ? null : `${this.sortBy},${this.sortDesc ? ESortOrder.DESC : ESortOrder.ASC}`;

		const params: ILoadTransactionsParams = { ...this.params, sort: newSort };
		this.retrieve(params);
		this.$emit('selectAll', { items: [], value: false });
	}

	clearExpanded() {
		this.expandedTransacitons = [];
	}

	onClickRow(transaction: ITransactionRecord) {
		const found: ITransactionRecord | undefined = this.expandedTransacitons.find(v => v.id === transaction.id);
		this.expandedTransacitons = found ? [] : [transaction];
	}

	shownInformation(el: HTMLElement) {
		const scrollPos: number = el.scrollTop;
		const height: number = el.offsetHeight;

		this.shownNumber = Math.ceil(height / 72) + 2;
		this.shownIndex = Math.round(scrollPos / 72);
	}

	mounted() {
		this.shownNumber = Math.ceil(window.innerHeight / 100) + 2;
		window.addEventListener('resize', () => {
			this.shownNumber = Math.ceil(window.innerHeight / 100) + 2;
		});

		this.tableContent = document.querySelector('#transactionsTable > div');
		this.tableContent?.addEventListener('scroll', (event: Event) => {
			// @ts-ignore
			this.shownInformation(event.target);
		});
	}

	beforeDestroy() {
		this.sortBy = null;
		this.sortDesc = null;
		this.expandedTransacitons = [];
	}
}
</script>

<style lang="scss">
#transactionsTable {
	tbody {
		tr {
			&.-selected {
				td {
					background-color: $white;
				}
			}
		}
	}
}
</style>

<style lang="scss" scoped>
.typeCell {
	cursor: pointer;
	padding: 1px;
	&:hover {
		text-decoration: underline;
	}
}
</style>
