<template>
	<span></span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { EDatetimeInput } from '~/types/common/types';

export const DATE_MAX = 10;
export const DATETIME_MAX = 19;
export const INIT_DATE = '01/01/1970';
export const INIT_TIME = '00:00:00';

export interface ISplittedDatetime {
	date: string;
	time: string;
}

const NUM_SIZES = [2, 5, 10, 13, 16, 19];

@Component
export default class DateAndDatetime extends Vue {
	$refs!: {
		dateInput: any;
	};

	@Prop() required!: boolean;
	@Prop() innerClass!: string;
	@Prop() label!: string;
	@Prop() value!: string;
	@Prop() hideDetails!: boolean;
	@Prop() initSwitch!: boolean;

	cursorPos: number = 0;
	EDatetimeInput = EDatetimeInput;
	timestamp: string = ''; // mm/dd/yyyy || mm/dd/yyyy hh:mm:ss
	datePicker: string = ''; // yyyy-mm-dd
	timePicker: string = ''; // hh:mm:ss
	activate: boolean = false;

	maintainingCursor(newVal: string, oldVal: string) {
		if (!newVal || !oldVal || newVal.length <= oldVal.length) return;

		const el: HTMLInputElement | null = this.$refs.dateInput?.$el?.querySelector('input');
		if (!el) return;

		if (el.selectionStart === newVal.length) return;

		this.cursorPos = el.selectionStart || 0;
		if (NUM_SIZES.includes(this.cursorPos)) {
			this.cursorPos += 1;
		}
		setTimeout(() => el?.setSelectionRange(this.cursorPos, this.cursorPos), 0);
	}

	setValue(val: string) {
		this.timestamp = val;
	}

	splitDateAndTime(dateStr: string): ISplittedDatetime {
		// dateStr === mm/dd/yyyy hh:mm:ss
		let returnDate = '1970-01-01';
		let returnTime = '00:00:00';
		if (dateStr && /\s/.test(dateStr)) {
			const splitted = dateStr.split(/\s/);
			const datePart: string = splitted[0];
			const timePart: string = splitted[1];

			returnTime = timePart.includes(':') ? timePart.trim() : '';
			if (datePart.includes('/')) {
				const splittedDate = datePart.trim().split('/');
				if (splittedDate.length === 3) {
					returnDate = `${splittedDate[2]}-${splittedDate[0]}-${splittedDate[1]}`; // yyyy-mm-dd
				} else {
					returnDate = '1970-01-01';
				}
			}
		}

		return {
			date: returnDate, // yyyy-mm-dd
			time: returnTime, // yyyy-mm-dd
		};
	}
}
</script>
