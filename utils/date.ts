import moment from 'moment';
import { DATETIME_FORMAT_CLASSIC } from './constants';
import { EDatetimeInput } from '~/types/common/types';

export const tzAddedDate = (dateString: string | Date, timezone: string | null | undefined): Date => {
	const temp = moment.utc(dateString).format(DATETIME_FORMAT_CLASSIC);
	return new Date(temp + (timezone || ''));
};

/**
 *
 * @param dateStr yyyymmddhhmmss
 * @param type datetime or date
 * @returns mm/dd/yyyy hh:mm:ss
 */
export const reformedDate = (dateStr: string, type: EDatetimeInput): string => {
	let result = '';

	if (dateStr && typeof dateStr === 'string') {
		const month = dateStr.substring(0, 2);
		const day = dateStr.substring(2, 4);
		const year = dateStr.substring(4, 8);
		result += month ? `${month}/` : '';
		result += day ? `${day}/` : '';
		result += year ? `${year}` : '';
		if (type === EDatetimeInput.DATETIME) {
			const hour = dateStr.substring(8, 10);
			const minute = dateStr.substring(10, 12);
			const second = dateStr.substring(12, 14);
			result += hour ? ` ${hour}:` : '';
			result += minute ? `${minute}:` : '';
			result += second ? `${second}` : '';
		}
	}

	return result;
};

/**
 * @param inputTime mm/dd/yyyy hh:mm:ss
 * @param timezone +00:00
 */
export const futureTimeChecker = (inputTime: string | Date, timezone: string) => {
	const enteredTime = moment(inputTime).format('YYYY-MM-DDTHH:mm:ss') + (timezone === '+00:00' ? 'Z' : timezone); // Local date

	const enteredUTC = moment(enteredTime).utc().format(); // Change local date to UTC date
	const nowUTC = moment(new Date()).utc().format();
	if (enteredUTC > nowUTC) {
		return false;
	}
	return true;
};
