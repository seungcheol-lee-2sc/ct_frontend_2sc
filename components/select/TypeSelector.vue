<template>
	<v-menu offset-y :disabled="!canEdit" @input="openMenu">
		<template #activator="{ on, attrs }">
			<div v-bind="attrs" class="selection" :class="!canEdit ? '-disabled' : ''" style="max-width: 270px" v-on="on">
				<span v-if="!canEdit || !outlined">
					{{ typeValue }}
					<v-icon v-if="canEdit">mdi-menu-down</v-icon>
				</span>
				<v-select
					v-else
					:append-outer-icon="activateReset ? 'mdi-undo' : ''"
					hide-details
					readonly
					outlined
					:value="typeValue"
					:items="[typeValue]"
					@click:append-outer.stop="$emit('reset')"
				/>
			</div>
		</template>
		<ProductMenuList :product-menu-list="typeSelectList" :value="typeValue" />
	</v-menu>
</template>

<script lang="ts">
import { Component, Prop, State, Vue } from 'nuxt-property-decorator';
import ProductMenuList, { IProductMenuList } from '../list/ProductMenuList.vue';
import {
	ETransactionCategory,
	ETransactionType,
	IFlattenTransactionType,
	ITransactionRecord,
	ITransactionType,
} from '~/types/transaction/types';
import { IReformedTransactionRecord } from '~/types/review/types';

export const foundFlattenType = (
	type: string | undefined | null,
	transactionTypeArr: IFlattenTransactionType[],
): IFlattenTransactionType | undefined => {
	return type ? transactionTypeArr.find(v => v.type === type) : undefined;
};

export const filteredByCategory = (
	transaction: ITransactionRecord,
	transactionTypeArr: IFlattenTransactionType[],
	includeMySelf: boolean = false,
): IFlattenTransactionType[] => {
	const category = transaction.category;
	let filtered = transactionTypeArr.filter(t => {
		if (includeMySelf) {
			return t.category === category && t.userSelectable;
		} else {
			return t.category === category && t.userSelectable && t.type !== transaction.type;
		}
	});

	// additional filter for TRADE category
	if (category === ETransactionCategory.TRADE) {
		filtered = filtered.filter(v => v.type === ETransactionType.CONVERT || v.type === ETransactionType.SWAP);
	}

	return filtered;
};

export const typeSelectorList = (
	transaction: ITransactionRecord | null,
	transactionTypeArr: IFlattenTransactionType[],
	action: (v: any) => any,
): IProductMenuList[] => {
	if (transaction && transaction?.category) {
		return filteredByCategory(transaction, transactionTypeArr, true).map(t => ({
			color: 'primaryLight',
			text: t.label,
			onclick: () => {
				action(t.type);
			},
		}));
	} else {
		return [];
	}
};

@Component({
	components: {
		ProductMenuList,
	},
})
export default class TypeSelector extends Vue {
	@Prop({ required: true }) outlined!: boolean;
	@Prop({ required: true }) transaction!: ITransactionRecord | IReformedTransactionRecord;
	@Prop({ required: true }) canEdit!: boolean;
	@Prop() customTypeKey!: string;
	@Prop() activateReset!: boolean;

	@State(({ transaction }) => transaction.transactionTypeArr) transactionTypeArr!: IFlattenTransactionType[];
	@State(({ transaction }) => transaction.transactionTypes) transactionTypes!: Map<ETransactionType, ITransactionType>;

	typeSelectList: IProductMenuList[] = [];

	get typeValue(): string {
		return this.foundType?.label || '';
	}

	get foundType(): ITransactionType | undefined {
		// @ts-ignore
		const type = this.customTypeKey ? this.transaction[this.customTypeKey] : this.transaction?.type;
		return this.transactionTypes.get(type);
	}

	openMenu() {
		if (this.typeSelectList.length === 0) {
			this.typeSelectList = typeSelectorList(this.transaction, this.transactionTypeArr, t => this.$emit('action', t));
		}
	}
}
</script>

<style lang="scss" scoped>
.selection {
	padding: 1px 2px;
	> span {
		display: inline-block;
		max-width: 110px;
		word-break: break-word;
		&:hover {
			font-weight: $font-bold;
		}
	}

	&.-disabled {
		cursor: default;
		> span {
			&:hover {
				font-weight: $font-normal;
			}
		}
	}
}
</style>
