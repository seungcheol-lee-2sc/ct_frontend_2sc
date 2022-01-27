<template>
	<v-menu v-model="activate" offset-x :close-on-content-click="false" min-width="auto">
		<template #activator="{ on, attrs }">
			<span>
				<v-text-field
					ref="dateInput"
					v-model="timestamp"
					v-mask="'##/##/####'"
					:hide-details="hideDetails || false"
					:label="label"
					placeholder="MM/DD/YYYY"
					outlined
					type="text"
					:class="innerClass"
					:rules="rules"
				>
					<template slot="append">
						<v-icon v-bind="attrs" v-on="on">mdi-calendar-outline</v-icon>
					</template>
				</v-text-field>
			</span>
		</template>

		<v-card outlined>
			<v-date-picker :value="datePicker" @change="onChangeDate" />
			<v-btn block text color="secondary" @click="activate = false">{{ $t('common.close') }}</v-btn>
		</v-card>
	</v-menu>
</template>

<script lang="ts">
import { Component, Watch } from 'nuxt-property-decorator';
import DateAndDatetime, { DATE_MAX, ISplittedDatetime } from './DateAndDatetime.vue';
import { DATETIME_FORMAT_OUR_APP } from '~/utils/constants';
import { dateRule, requiredRule } from '~/utils/rules';

@Component
export default class DatePicker extends DateAndDatetime {
	get rules(): any[] {
		const result: any[] = this.required ? [(v: any) => requiredRule(v)] : [];
		return result.concat([(v: string) => dateRule(v, DATE_MAX, this.$nuxt)]);
	}

	@Watch('timestamp', { immediate: true, deep: true })
	watchTimestamp(newVal: string, oldVal: string) {
		if (!newVal || newVal.length === 0) {
			this.$emit('onchange', '');
		} else if (newVal.length === DATE_MAX) {
			this.$emit('onchange', newVal);
		}
		this.maintainingCursor(newVal, oldVal);
	}

	onChangeDate(newDate: string) {
		// newDate -> yyyy-mm-dd
		const reformedNewDate = this.$moment.utc(newDate).format(DATETIME_FORMAT_OUR_APP).split(/\s/)[0];
		this.datePicker = newDate;
		this.setValue(reformedNewDate);
	}

	created() {
		const temp: ISplittedDatetime = this.splitDateAndTime(this.value);
		this.datePicker = temp.date === '1970-01-01' ? '' : temp.date;
		this.timestamp = this.$moment.utc(this.datePicker).format(DATETIME_FORMAT_OUR_APP).split(/\s/)[0];
		this.cursorPos = 0;
	}
}
</script>
