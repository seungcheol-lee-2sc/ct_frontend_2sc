import { NuxtApp } from '@nuxt/types/app';
import { MIN_PASSWORD } from './constants';

/* eslint-disable no-useless-escape */
export const DATE_PATTERN = /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/;
export const TIME_PATTERN = /(((([0-1][0-9])|(2[0-3])):?[0-5][0-9]:?[0-5][0-9]+$))/;
export const DATETIME_PATTERN =
	/(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d (((([0-1][0-9])|(2[0-3])):?[0-5][0-9]:?[0-5][0-9]+$))/;
export const EMAIL_PATTERN =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const CARD_NUMBER_PATTERN = /\d{4}-?\d{4}-?\d{4}-?\d{4}/;
export const CARD_EXP_PATTERN = /(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})/;
export const CARD_CVC_PATTERN = /[0-9]{3}$/;
export const UPPERCASE_CONTAIN_PATTERN = /([A-Z])/;
export const LOWERCASE_CONTAIN_PATTERN = /([a-z])/;
export const NUMERIC_CONTAIN_PATTERN = /([0-9])/;
export const SPECIAL_CHAR_CONTAIN_PATTERN = /([!@#$%^&*])/;
export const NUMBER_ONLY_PATTERN = /^[0-9]*$/;
export const YEAR_PATTERN = /(\d{4}|\d{2})/;
export const MONTH_PATTERN = /(0?[1-9]|1[0-2])/;
export const DAY_PATTERN = /(0?[1-9]|[12]\d|30|31)/;
export const HOUR_PATTERN = /(0?[1-9]|1[0-1])/;
export const MINUTE_PATTERN = /(0?[1-9]|1[0-2])/;
export const SECOND_PATTERN = /(0?[1-9]|1[0-2])/;
// regex for extract message between [" "]
export const MESSAGE_PATTERN = /(\[\{)(.*)(\}\])/;

export const natureNumberRule = (v: any, app: NuxtApp) => {
	return !v || +v >= 0 || app.$t('rules.natureNumber');
};

export const emailRule = (v: any, app: NuxtApp) => {
	return !v || EMAIL_PATTERN.test(v) || app.$t('rules.email');
};

export const requiredRule = (v: any) => {
	return !!v || '';
};

export const pwMin = (v: any, app: NuxtApp) => {
	return !v || v.length >= MIN_PASSWORD || app.$t('rules.pwMin', { min: MIN_PASSWORD });
};

export const pwUppercase = (v: any, app: NuxtApp) => {
	return !v || UPPERCASE_CONTAIN_PATTERN.test(v) || app.$t('rules.pwUppercase');
};

export const pwLowercase = (v: any, app: NuxtApp) => {
	return !v || LOWERCASE_CONTAIN_PATTERN.test(v) || app.$t('rules.pwLowercase');
};

export const pwNumeric = (v: any, app: NuxtApp) => {
	return !v || NUMERIC_CONTAIN_PATTERN.test(v) || app.$t('rules.pwNumeric');
};

export const pwSpecialChar = (v: any, app: NuxtApp) => {
	return !v || SPECIAL_CHAR_CONTAIN_PATTERN.test(v) || app.$t('rules.pwSpecialChar');
};

export const datetimeRule = (v: string, len: number, app: NuxtApp) => {
	return !v || (DATETIME_PATTERN.test(v) && v.length === len) || app.$t('rules.datetime');
};

export const dateRule = (v: string, len: number, app: NuxtApp) => {
	return !v || (DATE_PATTERN.test(v) && v.length === len) || app.$t('rules.date');
};

export const onlyNumberRule = (v: any, app: NuxtApp) => {
	return !v || NUMBER_ONLY_PATTERN.test(v) || app.$t('rules.onlyNumber');
};
