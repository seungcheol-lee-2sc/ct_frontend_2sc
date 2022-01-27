<template>
	<div class="selectorWrapper">
		<v-autocomplete
			ref="autocomplete"
			:value="value"
			item-value="id"
			:items="matchIns"
			outlined
			hide-details
			class="hideInput"
			@change="onChangeTransaction"
		>
			<template #selection="{ item }">
				<div class="selection">
					<MatchInternalTransaction
						:source-name="item.sourceName"
						:timestamp="item.timestamp"
						:quantity="item.quantity"
						:symbol="asset"
					/>
				</div>
			</template>
			<template #item="{ item }">
				<div class="selection">
					<MatchInternalTransaction
						:source-name="item.sourceName"
						:timestamp="item.timestamp"
						:quantity="item.quantity"
						:symbol="asset"
					/>
				</div>
			</template>
		</v-autocomplete>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import MatchInternalTransaction from '~/components/pages/review/MatchInternalTransaction.vue';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { IMatchIn } from '~/types/review/types';
import { DATETIME_FORMAT_PRODUCT } from '~/utils/constants';

@Component({
	components: {
		MatchInternalTransaction,
	},
})
export default class TransactionSelector extends Vue {
	$refs!: {
		autocomplete: any;
	};

	@Prop({ required: true }) value!: IMatchIn | null;
	@Prop({ required: true }) matchIns!: IMatchIn[];
	@Prop({ required: true }) asset!: string;

	DATETIME_FORMAT_PRODUCT = DATETIME_FORMAT_PRODUCT;

	onChangeTransaction(id: number) {
		const found: IMatchIn | undefined = this.matchIns.find(v => v.id === id);
		if (!found) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'warning',
				msg: 'Transaction is not found. Please try again.',
			});
			return;
		}

		this.$refs.autocomplete.blur();
		this.$emit('onchange', found);
	}
}
</script>

<style lang="scss" scoped>
.selectorWrapper {
	padding: 0 24px;
}
.selection {
	width: 100%;
}
</style>
