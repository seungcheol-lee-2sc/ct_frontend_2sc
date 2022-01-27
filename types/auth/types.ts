/* eslint-disable camelcase */
import { CognitoUser } from '@aws-amplify/auth';

export enum EBoolean {
	TRUE = '1',
	FALSE = '0',
}

export interface ISignIn {
	username: string;
	password: string;
}

export class SignIn {
	constructor(public username: string, public password: string) {
		this.username = username;
		this.password = password;
	}
}

export enum EIdentityType {
	GOOGLE = 'GOOGLE',
	FACEBOOK = 'FACEBOOK',
	APPLE = 'APPLE',
	COGNITO = 'COGNITO',
}

export enum EForgotPwStatus {
	READY = 'READY',
	SENDED = 'SENDED',
	DONE = 'DONE',
}

export enum ESoftware {
	ATX = 'ATX',
	CCH_AXCESS = 'CCH_AXCESS',
	DRAKE = 'DRAKE',
	CCH_PROSYSTEM = 'CCH_PROSYSTEM',
	LACERTE = 'LACERTE',
	PROCONNECT = 'PROCONNECT',
	PROSERIES = 'PROSERIES',
	TAX_ACT = 'TAX_ACT',
	TAX_WISE = 'TAX_WISE',
	ULTRA_TAX_CS = 'ULTRA_TAX_CS',
	ETC = 'ETC',
}

export enum EProfessionalType {
	LAWYER = 'Lawyer',
	EA = 'EA',
	CPA = 'CPA',
}

export interface ISignUp {
	username: string;
	password: string;
	givenName: string; // first name
	familyName: string; // last name
	subscribe: boolean;
	isAccountant: boolean;
	company: string;
	professionalType: EProfessionalType;
	licenseState: string;
	licenseNumber: string;
	software: string;
	referralId?: string;
}

export class SignUp implements ISignUp {
	constructor(
		public username: string,
		public password: string,
		public givenName: string,
		public familyName: string,
		public subscribe: boolean,
		public isAccountant: boolean,
		public company: string,
		public professionalType: EProfessionalType,
		public licenseState: string,
		public licenseNumber: string,
		public software: string,
	) {
		this.username = username;
		this.password = password;
		this.givenName = givenName;
		this.familyName = familyName;
		this.subscribe = subscribe;
		this.isAccountant = isAccountant;
		this.company = company;
		this.professionalType = professionalType;
		this.licenseState = licenseState;
		this.licenseNumber = licenseNumber;
		this.software = software;
	}
}

export interface ICognitoClient {
	endpoint: string;
	fetchOptions: any;
}

export interface IAttributes {
	address?: string;
	birthdate?: any;
	locale?: any;
	name?: string;
	picture?: string;
	profile?: string;
	zoneinfo?: string;
	email?: string;
	email_verified: boolean;
	family_name?: string;
	given_name?: string;
	identities: string;
	sub: string;
	phone_number_verified?: boolean;
	phone_number?: string;

	'custom:company'?: string;
	'custom:tax_country'?: string;
	'custom:fiat_currency'?: string;
	'custom:time_zone'?: string;
	'custom:tax_calc_method'?: string; // not used
	'custom:current_plan'?: string;
	'custom:email_report_freq'?: string; // not used
	'custom:acct_remove_reason'?: string; // not used
	'custom:last_ip_address'?: string;
	'custom:subscription_id'?: string; // not used
	'custom:is_accountant'?: EBoolean;
	'custom:is_plan_expired'?: EBoolean; // not editable // not used : for sure
	'custom:is_2fa_enabled'?: EBoolean; // not used
	'custom:is_newsletter_subd'?: EBoolean;
	'custom:is_promo_email_subd'?: EBoolean;
	'custom:is_notice_email_subd'?: EBoolean;
	'custom:is_notice_text_subd'?: EBoolean;
	'custom:is_account_removed'?: EBoolean; // not used
	'custom:is_blacklisted'?: EBoolean;
	'custom:is_unusual_activity'?: EBoolean;
	'custom:tour'?: EBoolean;
	'custom:paypal_email'?: string;
	'custom:marriage_status'?: string; // not used
	'custom:age'?: number; // not used
	'custom:zip_code'?: string; // not used
	'custom:annual_income'?: string; // not used
	'custom:long_term_gain'?: string; // not used
	'custom:short_term_gain'?: string; // not used
	'custom:state'?: string; // not used
	'custom:email_alert_starts'?: string; // not used
	'custom:email_alert_interval'?: string; // not used
	'custom:tax_strategy'?: string;
	'custom:affiliate_id'?: string;
	'custom:referral_id'?: string;
	'custom:phone_country'?: string;
	'custom:geo_country'?: string;
	'custom:geo_region'?: string;
	'custom:geo_locality'?: string;
	'custom:ea_number'?: string;
	'custom:professional_type'?: string;
	'custom:license_number'?: string;
	'custom:license_state'?: string;
	'custom:profession_other'?: string;
	'custom:software'?: string;
	'custom:address_accountant'?: string;
	'custom:company_state'?: string; // not used : for sure
	'custom:hubspot_token'?: string;
}

export enum EGoogleAddrType {
	POSTAL_CODE = 'postal_code',
	COUNTRY = 'country', // country
	POLITICAL = 'political',
	LOCALITY = 'locality',
	SUBLOCALITY = 'sublocality',
	premise = 'premise',
	AREA1 = 'administrative_area_level_1',
	AREA2 = 'administrative_area_level_2',
	AREA3 = 'administrative_area_level_3',
}

export interface IGoogleAddrComponent {
	long_name: string;
	short_name: string;
	types: EGoogleAddrType[];
}

export interface ICognitoUserExt extends CognitoUser {
	username: string;
	attributes: IAttributes;
}
