/* eslint-disable import/no-named-as-default-member */
import Countries from 'countries-list';
import { LOCALES } from '~/config.app';
import { ESoftware } from '~/types/auth/types';

export const BUILD_ENV = process.env.BUILD_ENV;
export const CT_FRONT = process.env.CT_FRONT;
export const CT_BACK = process.env.CT_BACK;
export const COGNITO_BASE_URL = process.env.COGNITO_BASE_URL;
export const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
export const COGNITO_POOL_ID = process.env.COGNITO_POOL_ID;
export const COGNITO_REGION = process.env.COGNITO_REGION;
export const COGNITO_RESPONSE_TYPE = process.env.COGNITO_RESPONSE_TYPE;
export const COGNITO_SCOPE = process.env.COGNITO_SCOPE;
export const COGNITO_SIGN_IN_REDIRECT = `${CT_FRONT}/auth/`;
export const COGNITO_SIGN_OUT_REDIRECT = CT_FRONT;
export const STRAPI_BASE = process.env.STRAPI_BASE;
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
export const PAYPAL_URL = process.env.PAYPAL_URL;
export const REWARDFUL_KEY = process.env.REWARDFUL_KEY;
export const REWARDFUL_SECRET = process.env.REWARDFUL_SECRET;
export const REWARDFUL_CAMPAIGN_ID = process.env.REWARDFUL_CAMPAIGN_ID;
export const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY;
export const HELP_CENTER_URL = 'https://knowledge.cointelli.com/knowledge';
export const HUB_SPOT_ID = process.env.HUB_SPOT_ID;
export const TRANSACTION_TYPE_ARTICLE = 'https://knowledge.cointelli.com/knowledge/transaction-type';
let tempCookieStorage = '';
if (CT_FRONT) {
	tempCookieStorage = CT_FRONT.includes('//') ? CT_FRONT.split('//')[1] : CT_FRONT;
	tempCookieStorage = tempCookieStorage.includes(':') ? tempCookieStorage.split(':')[0] : tempCookieStorage;
}
export const COOKIE_STORAGE = tempCookieStorage;
export const BASE_SITE_TITLE = 'Cointelli';

export enum ECognitoTokenKeys {
	LastAuthUser = 'LastAuthUser',
	accessToken = 'accessToken',
	clockDrift = 'clockDrift',
	idToken = 'idToken',
	refreshToken = 'refreshToken',
	userData = 'userData',
}
export const KO = 'ko';
export const EN = 'en';
export const LOCALES_ARR = LOCALES;
export const PER_PAGE = 10;
export const DATETIME_FORMAT_OUR_APP = 'MM/DD/YYYY HH:mm:ss';
export const DATETIME_FORMAT_CLASSIC = 'YYYY-MM-DDTHH:mm:ss';
export const DATE_FORMAT_CLASSIC = 'YYYY-MM-DD';
export const DATETIME_FORMAT_PRODUCT = 'M/DD/YYYY H:mm:ss';
export const DATE_FORMAT_PRODUCT = 'M/DD/YYYY';
export const DATEFORMAT_CONTENT = 'MMMM D, YYYY';
export const DATEFORMAT_GRAPH = 'MMM D, YYYY';
export const DATEFORMAT_REPORT_ORDER = 'dddd D MMMM, HH:mm';
export const MIN_PASSWORD = 8;
export const MIN_WIDTH = 1200;

export const CONTINENTS = Countries.continents;
export const COUNTRIES = Countries.countries;
export const SERVICEABLE_COUNTRIES = ['US'];
export const RECOMMANDED_COUNTRY_CODES = ['US'];
export const INCOMING = 'Incoming';
export const OUTGOING = 'Outgoing';
export const PRODUCTION = 'production';
export const QA = 'qa';
export const STAGING = 'staging';
export const DEVELOPMENT = 'development';
export const RESEARCH = 'research';
export const TEST = 'test';
export const RC = 'rc';
export const CT_NOTICE_ALERT = 'ct-notice-alert';
export const CT_LOGIN_IMPORT = 'ct-login-import';
export const CT_PAY_REDIRECT = 'ct-pay-redirect';
export const CT_SIGN_UP_TYPE = 'ct-sign-up-type';
export const CT_SIGN_IN_TAB = 'ct-sign-in-tab';
export const NO_NEED_TO_INIT_PROVIDERS = ['changelly-pro']; // slug[]
export const LABEL_EXCEPTION_PROVIDERS = [{ slug: 'cex-io', label: 'User id' }];
export const SYMBOL_REPLACED_COINS = [{ symbol: 'UNI', newSymbol: 'ETH' }];
export const EMAIL_SEND_INTERVALS = ['1', '7', '15', '30'];
export const EMAIL_DEV_ACCOUNT = 'dev-test@cointelli.com';
export const EMAIL_ID_SEND_TO_ACCOUNTANT = 62682710398;
export const EMAIL_ID_INVITE_CLIENT = 62684162597;
export const EMAIL_ID_REMINDER_PENDING = 62682927163;
export const EMAIL_ID_REMINDER_IN_PROGRESS = 62691704424;
export const EMAIL_ID_REMINDER_REVIEW = 62691704640;
export const EMAIL_ID_SANDBOX = 62844450059;
export const EMAIL_ID_PAYPAL_CONNECTED = 62676089863;
export const EMAIL_ID_PROFILE_UPDATED = 62674949428;
export const EMAIL_ID_BUG_REPORT_RECIEVED = 62676112155;
export const EMAIL_ID_ALERT_ARRIVED = 62657092212;
export const FINAL_PRODUCTION: boolean = BUILD_ENV === PRODUCTION;
export const INVITE_HASH_EXPIRE_DAYS: number = 7;

export const CONTACT_US_FORM_ID =
	BUILD_ENV === DEVELOPMENT ? '6779ec49-2976-42b2-83a8-e14ba3df52a6' : '85ac234d-b811-4115-af1b-02d3fc2965e5';
export const BUG_REPORT_FORM_ID =
	BUILD_ENV === DEVELOPMENT ? 'a9adddc0-0a4c-4c59-9513-9f6f88e51ae4' : 'ab28d7c1-6d5b-471e-b681-5954ef83e0ce';
export const ENTERPRISE_FORM_ID =
	BUILD_ENV === DEVELOPMENT ? '938953bf-77ed-48ca-a557-11031aa783fc' : '2979c63c-d44d-4dbc-9d37-c5664e9a3f9b';
export const PRICE_ID =
	BUILD_ENV === TEST || BUILD_ENV === RESEARCH || BUILD_ENV === PRODUCTION || BUILD_ENV === RC
		? 'price_1KERaiKdl0zRXBSseHD0GkPp' // live
		: 'price_1KDt4xKdl0zRXBSsJgoMKi8N'; // test
export const DUPLICATED_EMAIL_CRITERIA = 'Email already in use';

// export const IMPORT_ONLY = BUILD_ENV === QA || BUILD_ENV === DEVELOPMENT;
export const IMPORT_ONLY = BUILD_ENV === QA;

export enum DATE_RANGE {
	WEEK = '7D',
	ONE_MONTH = '1M',
	THREE_MONTHS = '3M',
	ONE_YEAR = '1Y',
	YEAR_TO_DATE = 'YTD',
	LAST_YEAR = 'Last Year',
	TOTAL = 'TOTAL',
	CUSTOM = 'Custom',
}

export interface ISoftwareItem {
	value: ESoftware;
	name: string;
	img: string;
}

export const ETC_SOFTWARE = { value: ESoftware.ETC, name: 'ETC', img: '' };
export const SOFTWARES: ISoftwareItem[] = [
	{ value: ESoftware.ATX, name: 'ATX', img: `/software/${ESoftware.ATX}.png` },
	{ value: ESoftware.CCH_AXCESS, name: 'CCH Axcess', img: `/software/${ESoftware.CCH_AXCESS}.png` },
	{ value: ESoftware.DRAKE, name: 'Drake software', img: `/software/${ESoftware.DRAKE}.png` },
	{ value: ESoftware.CCH_PROSYSTEM, name: 'CCH Prosystem tax', img: `/software/${ESoftware.CCH_PROSYSTEM}.png` },
	{ value: ESoftware.LACERTE, name: 'Lacerte tax', img: `/software/${ESoftware.LACERTE}.png` },
	{ value: ESoftware.PROCONNECT, name: 'Pro connect', img: `/software/${ESoftware.PROCONNECT}.png` },
	{ value: ESoftware.PROSERIES, name: 'Pro series', img: `/software/${ESoftware.PROSERIES}.png` },
	{ value: ESoftware.TAX_ACT, name: 'Tax act', img: `/software/${ESoftware.TAX_ACT}.png` },
	{ value: ESoftware.TAX_WISE, name: 'Tax wise', img: `/software/${ESoftware.TAX_WISE}.png` },
	{ value: ESoftware.ULTRA_TAX_CS, name: 'Ultra Tax CS', img: `/software/${ESoftware.ULTRA_TAX_CS}.png` },
	// { value: ESoftware.ETC, name: 'ETC', img: '' },
];
