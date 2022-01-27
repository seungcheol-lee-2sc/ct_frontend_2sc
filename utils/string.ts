import { makeSrcToAbsolute } from './application';
import { STRAPI_BASE } from './constants';
import { isFloat } from './number';

export const splittedByNl = (str: string): string[] => {
	return str && str.length > 0 ? str.split('\n') : [];
};

export const sanitize = (html: string): string => {
	if (html && typeof html === 'string') {
		let sanitized = html.replace(/<script>/gi, '&lt;script$gt;');
		sanitized = html.replace(/<\/script>/gi, '&lt;script$gt;');
		return sanitized;
	} else {
		return '';
	}
};

export const sanitizeAtag = (html: string): string => {
	if (html && typeof html === 'string') {
		return html.replace(/(<(a [^>]+)>)|(<(\/a)>)|(<(a)>)/gi, ' ');
	} else {
		return '';
	}
};

export const sanitizeEveryTags = (html: string): string => {
	if (html && typeof html === 'string') {
		return html.replace(/(<([^>]+)>)/gi, ' ');
	} else {
		return '';
	}
};

export const omitText = (str: string, num: number) => {
	let dotdotdot = '';
	if (str && str.length > num) {
		dotdotdot = '...';
	}
	return str && typeof str === 'string' ? `${str.substring(0, num - 3)}${dotdotdot}` : '';
};

export const nl2br = (str: string) => {
	return str.replace(/\n/g, '<br />');
};

export const filteringHTML = (html: string): string => {
	// @ts-ignore
	return html ? makeSrcToAbsolute(sanitize(html), STRAPI_BASE) : '';
};

export const firstCharUppercase = (text: string) => {
	return text ? text.charAt(0).toUpperCase() + text.toLowerCase().slice(1) : '';
};

export const addComma = (inputNum: string | number): string => {
	if (isFloat(inputNum)) {
		const splitted = String(inputNum).split('.');
		const natureNumberRule = splitted[0];
		const floatNumber = splitted[1];
		const internationalNumberFormat = new Intl.NumberFormat('en-US');
		const commaAddedNatureNumberRule = internationalNumberFormat.format(+natureNumberRule);
		return `${commaAddedNatureNumberRule}.${floatNumber}`;
	} else {
		const internationalNumberFormat = new Intl.NumberFormat('en-US');
		return internationalNumberFormat.format(+inputNum);
	}
};

/**
 *
 * @param inputNum number (0~99)
 * @returns Double digit (00, 01, 02,,,)
 */
export const digitFormat = (inputNum: string | number): string => {
	return inputNum ? ('0' + inputNum).slice(-2) : '00';
};

// -100 -> -$100
export const addMinusOutsideCurrency = (inputNum: number | string): string => {
	const checkMinus = inputNum.toString()[0] === '-';
	const absMinus = checkMinus ? inputNum.toString().replace('-', '') : inputNum.toString();
	return checkMinus ? `-$${absMinus}` : `$${absMinus}`;
};
