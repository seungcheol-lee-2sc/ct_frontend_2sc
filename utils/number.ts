export const isFloat = (n: number | string): boolean => {
	return !isNaN(+n) && +n % 1 !== 0;
};

export const isInt = (n: number | string): boolean => {
	return !isNaN(+n) && +n % 1 === 0;
};

export const cutOffMillion = (targetNumber: number): number => {
	return targetNumber > 999999 ? Math.floor(targetNumber / 1000000) : targetNumber;
};

/**
 * 0.00080 => 0.0008
 */
export const removeZero = (num: number | string): string => {
	const str = String(num);
	if (str?.includes('.')) {
		let nonZeroIndex = 0;
		for (let i = str.length - 1; i >= 0; i--) {
			const char = str[i];
			if (char !== '0') {
				nonZeroIndex = i;
				break;
			}
		}
		return str.substring(0, nonZeroIndex + 1);
	} else {
		return String(num);
	}
};

export const removeExponential = (num: number | string): string => {
	let temp: any = num;
	if (Math.abs(+temp) < 1.0) {
		const e = parseInt(temp.toString().split('e-')[1]);
		if (e) {
			temp *= Math.pow(10, e - 1);
			temp = '0.' + new Array(e).join('0') + temp.toString().substring(2);
		}
	} else {
		let e = parseInt(temp.toString().split('+')[1]);
		if (e > 20) {
			e -= 20;
			temp /= Math.pow(10, e);
			temp += new Array(e + 1).join('0');
		}
	}
	return removeZero(temp);
};

export const roundingNumber = (num: string | number, floatPoint: number): number | string => {
	if (num && !isNaN(+num) && +Number(num).toFixed(floatPoint) !== 0) {
		const removed = removeExponential(Number(num).toFixed(floatPoint));
		return removed && removed[removed.length - 1] === '.' ? removed.substring(0, removed.length - 1) : removed;
	} else {
		return 0;
	}
};
