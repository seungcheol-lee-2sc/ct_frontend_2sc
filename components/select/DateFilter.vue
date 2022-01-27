<template>
	<v-menu v-model="dateFilterMenu" offset-y :close-on-content-click="false">
		<template #activator="{ on, attrs }">
			<FilterAndValueButton
				:attrs="attrs"
				:on="on"
				:filtered-text="`${reformedFinalFrom} - ${reformedFinalTo}`"
				:activate="finalFromFilter || finalToFilter"
				:disabled="disabled ? disabled : false"
				init-text="Date"
			/>
		</template>
		<v-list v-if="dateFilterMenu" style="padding: 8px">
			<v-form @submit.prevent="saveDateFilter">
				<div style="margin-bottom: 8px">
					<DatePicker :value="reformedFromDate" :hide-details="true" @onchange="onChangeFromDate" />
				</div>
				<div style="margin-bottom: 8px">
					<DatePicker :value="reformedToDate" :hide-details="true" @onchange="onChangeToDate" />
				</div>
				<div style="text-align: right">
					<v-btn small text color="secondary" :disabled="(!from && !to) || dateFiltering" @click="clearDateFilter">
						Clear
					</v-btn>
					<v-btn
						small
						color="secondary"
						type="submit"
						depressed
						:disabled="(!from && !to) || dateFiltering"
						:loading="dateFiltering"
					>
						Save
					</v-btn>
				</div>
			</v-form>
		</v-list>
	</v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator';
import FilterAndValueButton from '~/components/button/FilterAndValueButton.vue';
import DatePicker from '~/components/select/DatePicker.vue';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { DATETIME_FORMAT_OUR_APP, DATE_FORMAT_CLASSIC, DATE_FORMAT_PRODUCT } from '~/utils/constants';

@Component({
	components: {
		FilterAndValueButton,
		DatePicker,
	},
})
export default class DateFilter extends Vue {
	@Prop({ required: true }) finalFromFilter!: string | null;
	@Prop({ required: true }) finalToFilter!: string | null;
	@Prop() disabled!: boolean | undefined;
	@Prop() clearTrigger!: boolean | undefined;

	DATE_FORMAT_PRODUCT = DATE_FORMAT_PRODUCT;
	dateFilterMenu: boolean = false;
	dateFiltering: boolean = false;
	from: string = ''; // yyyy-mm-dd
	to: string = ''; // yyyy-mm-dd

	@Watch('clearTrigger', { immediate: true, deep: true })
	watchClearTrigger(newVal: boolean, oldVal: boolean | undefined) {
		if (typeof newVal === 'boolean' && typeof oldVal === 'boolean') {
			this.from = '';
			this.to = '';
		}
	}

	get reformedFinalFrom(): string {
		let str = this.finalFromFilter;
		if (!this.finalFromFilter?.includes('T')) {
			str += 'T00:00:00Z';
		}
		return this.finalFromFilter ? this.$moment(str).utc().format(DATE_FORMAT_PRODUCT) : '';
	}

	get reformedFinalTo(): string {
		let str = this.finalToFilter;
		if (!this.finalToFilter?.includes('T')) {
			str += 'T00:00:00Z';
		}
		return this.finalToFilter ? this.$moment(str).utc().format(DATE_FORMAT_PRODUCT) : '';
	}

	/**
	 * @example yyyy-mm-dd -> mm/dd/yyyy hh:mm:ss
	 */
	get reformedFromDate(): string {
		return this.from ? this.$moment.utc(this.from).utc().format(DATETIME_FORMAT_OUR_APP) : '';
	}

	/**
	 * @example yyyy-mm-dd -> mm/dd/yyyy hh:mm:ss
	 */
	get reformedToDate(): string {
		return this.to ? this.$moment.utc(this.to).utc().format(DATETIME_FORMAT_OUR_APP) : '';
	}

	/**
	 * @param dateInput mm/dd/yyyy
	 */
	onChangeToDate(dateInput: string) {
		const result = dateInput ? this.$moment(dateInput).format(DATE_FORMAT_CLASSIC) : '';
		if (result === 'Invalid date') {
			this.to = '';
			return;
		}
		this.to = result;
	}

	onChangeFromDate(dateInput: string) {
		// dateInput === mm/dd/yyyy
		const result = dateInput ? this.$moment(dateInput).format(DATE_FORMAT_CLASSIC) : '';
		if (result === 'Invalid date') {
			this.from = '';
			return;
		}
		this.from = result;
	}

	clearDateFilter() {
		if (!this.from && !this.to) {
			this.dateFilterMenu = false;
			return;
		}

		this.from = '';
		this.to = '';
		this.$emit('fromSetter', null);
		this.$emit('toSetter', null);
		this.$emit('onclear');
		this.dateFilterMenu = false;
	}

	saveDateFilter() {
		if (!this.from && !this.to) {
			this.dateFilterMenu = false;
			return;
		}

		if (this.from && this.to) {
			const fromDate: any = new Date(this.from);
			const toDate: any = new Date(this.to);
			if (toDate - fromDate < 0) {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: '"From" have to be past than "to"' });
				return;
			}
		}

		this.dateFiltering = true;

		this.$emit('fromSetter', this.from);
		this.$emit('toSetter', this.to);
		this.$emit('onsave', this.from, this.to);

		this.dateFiltering = false;
		this.dateFilterMenu = false;
	}
}
</script>
