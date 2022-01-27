<template>
	<v-menu v-model="activate" offset-x :close-on-content-click="false">
		<template #activator="{ on, attrs }">
			<span>
				<v-text-field
					ref="dateInput"
					v-model="timestamp"
					v-mask="'##/##/#### ##:##:##'"
					:disabled="disabled"
					:label="label"
					placeholder="MM/DD/YYYY hh:mm:ss"
					:hide-details="hideDetails || false"
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
			<div class="timeInputsWrapper">
				<v-text-field
					v-model="hh"
					v-mask="'##'"
					type="text"
					hide-details
					outlined
					dense
					style="max-width: 70px"
					label="hh"
					@keypress.enter="close"
				/>
				:
				<v-text-field
					v-model="mm"
					v-mask="'##'"
					type="text"
					hide-details
					outlined
					dense
					style="max-width: 70px"
					label="mm"
					@keypress.enter="close"
				/>
				:
				<v-text-field
					v-model="ss"
					v-mask="'##'"
					type="text"
					hide-details
					outlined
					dense
					style="max-width: 70px"
					label="ss"
					@keypress.enter="close"
				/>
			</div>
			<v-btn block text color="secondary" @click="close">{{ $t('common.close') }}</v-btn>
		</v-card>
	</v-menu>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'nuxt-property-decorator';
import DateAndDatetime, { DATETIME_MAX, INIT_TIME, ISplittedDatetime } from './DateAndDatetime.vue';
import { DATETIME_FORMAT_OUR_APP } from '~/utils/constants';
import { datetimeRule, requiredRule } from '~/utils/rules';
import { digitFormat } from '~/utils/string';

@Component
export default class DatetimePicker extends DateAndDatetime {
	@Prop() disabled!: boolean;

	hh: string = '';
	mm: string = '';
	ss: string = '';

	get rules(): any[] {
		const result: any[] = this.required ? [(v: any) => requiredRule(v)] : [];
		return result.concat([(v: string) => datetimeRule(v, DATETIME_MAX, this.$nuxt)]);
	}

	// hh:mm:ss
	get newTimePicker(): string {
		return `${digitFormat(this.hh)}:${digitFormat(this.mm)}:${digitFormat(this.ss)}`;
	}

	@Watch('initSwitch', { immediate: true, deep: true })
	watchSwitch(newVal: boolean, oldVal: boolean) {
		if (typeof newVal !== 'boolean' || typeof oldVal !== 'boolean') return;
		this.initialize(this.value);
	}

	@Watch('newTimePicker')
	watchNewTime(newVal: string) {
		const datePart = this.timestamp.split(/\s/)[0];
		this.timestamp = `${datePart} ${newVal}`;
	}

	@Watch('timestamp', { immediate: true, deep: true })
	watchTimestamp(newVal: string, oldVal: string) {
		if (!newVal || newVal.length === 0) {
			this.$emit('onchange', '');
		} else if (newVal.length === DATETIME_MAX) {
			this.$emit('onchange', newVal);
		}
		this.maintainingCursor(newVal, oldVal);
	}

	close() {
		this.activate = false;
	}

	onChangeDate(newDate: string) {
		// newDate -> yyyy-mm-dd
		let reformedNewDate = this.$moment(newDate).format(DATETIME_FORMAT_OUR_APP).split(/\s/)[0];
		this.datePicker = newDate;

		let timeResult = INIT_TIME;

		if (this.timestamp.includes(' ')) {
			const timePart: string = this.timestamp.split(/\s/)[1];

			if (timePart) {
				const splittedTime = timePart.split(':');
				const hour = splittedTime[0] || '00';
				const minute = splittedTime[1] || '00';
				const second = splittedTime[2] || '00';
				timeResult = ` ${hour}:${minute}:${second}`;
				reformedNewDate += timeResult;
			}
		}

		this.setValue(reformedNewDate);
	}

	initialize(timestamp: string) {
		// value === mm/dd/yyyy || mm/dd/yyyy hh:mm:ss
		const temp: ISplittedDatetime = this.splitDateAndTime(timestamp);
		this.datePicker = temp.date;
		this.timePicker = temp.time;
		this.hh = this.timePicker.split(':')[0];
		this.mm = this.timePicker.split(':')[1];
		this.ss = this.timePicker.split(':')[2];
		this.timestamp = timestamp;
		this.cursorPos = 0;
	}

	created() {
		this.initialize(this.value);
	}
}
</script>

<style lang="scss" scoped>
.timeInputsWrapper {
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 0 4px;
	margin-bottom: 8px;
}
</style>
