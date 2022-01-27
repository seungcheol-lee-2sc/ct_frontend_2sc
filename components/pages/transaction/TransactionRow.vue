<template>
	<tr class="transactionRow" :class="selected ? '-selected' : ''" @click="onClickRow(transaction)">
		<td v-if="!disableSelect">
			<v-checkbox
				v-if="!tempTransaction"
				hide-details
				style="margin: 0; padding: 0"
				color="disabled"
				readonly
				:value="selected"
				@click.stop="toggleSelection(transaction)"
			/>
			<Chip v-else color="successLight" fontcolor="successDark"> New </Chip>
		</td>
		<td>
			<span>
				{{ $moment(transaction.timestamp).utc().format(DATETIME_FORMAT_PRODUCT) }}
			</span>
		</td>
		<td>
			<template v-if="tempTransaction">
				{{ transaction.sourceName }}
			</template>
			<template v-else>
				{{ transaction.batch && transaction.batch.source && transaction.batch.source.name }}
			</template>
		</td>
		<td>
			{{ firstCharUppercase(transaction.category) }}
		</td>
		<td colspan="2">
			<TransactionItem
				:out-number="transaction.outQuantity"
				:out-asset="transaction.outAsset"
				:in-number="transaction.inQuantity"
				:in-asset="transaction.inAsset"
			/>
		</td>
		<td>
			<TypeSelector
				:outlined="false"
				:transaction="transaction"
				:can-edit="
					!tempTransaction && transaction.type !== ETransactionType.BUY && transaction.type !== ETransactionType.SELL
				"
				@action="t => onChangeTypes([transaction], t)"
				@bulkAction="t => onChangeTypes(selectedTransactions, t)"
			/>
		</td>
	</tr>
</template>

<script lang="ts">
import { Vue, Component, Prop, State } from 'nuxt-property-decorator';
import TransactionItem from './TransactionItem.vue';
import TypeSelector from '~/components/select/TypeSelector.vue';
import { ETransactionType, ITransactionRecord } from '~/types/transaction/types';
import { DATETIME_FORMAT_PRODUCT } from '~/utils/constants';
import { CHANGE_TYPES, TOGGLE_SELECTED_TRANSACTION } from '~/store/transaction';
import { firstCharUppercase } from '~/utils/string';
import { IChangeTypesDTO } from '~/types/transaction/dto';
import { IManualCategorize } from '~/types/review/types';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import Chip from '~/components/chip/Chip.vue';

@Component({
	components: {
		TransactionItem,
		TypeSelector,
		Chip,
	},
})
export default class TransactionRow extends Vue {
	@Prop({ required: true }) tempTransaction!: boolean;
	@Prop({ required: true }) transaction!: ITransactionRecord;
	@Prop() disableSelect!: boolean;

	@State(({ transaction }) => transaction.selectedTransactions) selectedTransactions!: ITransactionRecord[];

	DATETIME_FORMAT_PRODUCT = DATETIME_FORMAT_PRODUCT;
	ETransactionType = ETransactionType;
	expanded: boolean = false;

	get selected(): boolean {
		return Boolean(this.selectedTransactions.find(v => v.id === this.transaction.id));
	}

	toggleSelection(transaction: ITransactionRecord) {
		this.$store.commit(`transaction/${TOGGLE_SELECTED_TRANSACTION}`, transaction);
	}

	onClickRow(transaction: ITransactionRecord) {
		this.$emit('expand', transaction);
	}

	firstCharUppercase = firstCharUppercase;

	async onChangeTypes(transactions: ITransactionRecord[], type: ETransactionType) {
		if (!transactions || transactions.length === 0) return;
		const DTO: IChangeTypesDTO[] = transactions.map(t => ({
			transactionRecordId: t.id || 0,
			type,
			costBasis: null,
		}));
		const res: IManualCategorize[] | boolean = await this.$store.dispatch(`transaction/${CHANGE_TYPES}`, { data: DTO });
		const msg = transactions.length === 1 ? '1 item is updated' : `${transactions.length} items are updated`;
		if (res !== false) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg });
		} else {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Fail to update type' });
		}
	}
}
</script>

<style lang="scss" scoped>
.transactionRow {
	td {
		text-align: center;
	}
}
</style>
