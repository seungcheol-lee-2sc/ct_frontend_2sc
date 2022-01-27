/* eslint-disable no-useless-constructor */

/**
 * about UI, front-end
 */
import { Country } from 'countries-list';
export interface ICountryWithCode extends Country {
	code: string;
	recommanded?: boolean;
}

export interface IMessageItem {
	id: string;
	msg: string;
	color: string;
	closer: any;
	actionText?: string;
	action?: () => any;
}

export enum ESortOrder {
	DESC = 'desc',
	ASC = 'asc',
}

export enum EDatetimeInput {
	DATETIME = 'DATETIME',
	DATE = 'DATE',
}

export interface ISimpleMenuItem {
	title: string;
	path: string;
	roles?: string[];
	icon?: string;
	iconColor?: string;
	label?: string;
	divider?: boolean;
	newTab?: boolean;
	external?: boolean;
	alias?: string;
	wrapper?: string;
	desc?: string;
	imageUrl?: string;
}

export interface IMenuItem extends ISimpleMenuItem {
	subMenus: ISimpleMenuItem[];
}

export interface ISnackBar {
	act: Boolean;
	msg: string;
	color: string;
	duration: number;
}

export interface IDataTableHeader {
	text: string;
	value: string;
	sortable?: Boolean;
	align?: string;
	class?: string;
}

export interface ITimeZone {
	name: string;
	format: string;
	shownName: string;
}

export class TimeZone implements ITimeZone {
	constructor(public name: string, public format: string, public shownName: string) {
		this.name = name;
		this.format = format;
		this.shownName = shownName;
	}
}

export interface ITwoDemensionData {
	x: string;
	y: number;
}

/**
 * about User
 */
export interface ILogin {
	username: string;
	password: string;
	rememberMe: Boolean;
}

export interface ILoginResponse {
	// eslint-disable-next-line camelcase
	id_token: string;
}

export interface ICtUser {
	id?: number;
	login?: string | null;
	password?: string | null;
	firstName?: string | null;
	lastName?: string | null;
	email?: string | null;
	activated?: boolean | null;
	langKey?: string | null;
	imageUrl?: string | null;
	activationKey?: string | null;
	resetKey?: string | null;
	resetDate?: Date | null;
	autoFixJobId?: string | null;
	defaultCurrency?: string | null;
	gainMethod?: string | null;
	guid?: string | null;
	isAccountant?: boolean | null;
	maxTransactionsAllowed?: number | null;
	taxCountry?: string | null;
}

export interface IRegister {
	email: string;
	langKey: string;
	login: string;
	password: string;
	firstName: string;
	lastName: string;
}

export class Register {
	constructor(
		public email: string,
		public langKey: string,
		public login: string,
		public password: string,
		public firstName: string,
		public lastName: string,
	) {}
}

export class ChangePassword {
	constructor(public currentPassword: string, public newPassword: string) {
		this.currentPassword = currentPassword;
		this.newPassword = newPassword;
	}
}

export interface IMetaInfo {
	hid: string;
	name: string;
	content: string;
}

export enum EAuthRole {
	INDIVIDUAL = 'INDIVUDUAL',
	PROFESSIONAL = 'PROFESSIONAL',
}

export interface IConfirmation {
	dialog: boolean;
	title: string | any;
	text: string | any;
	btnText: string | any;
	cancelBtn: boolean;
	borderColor?: string;
	lock?: boolean;
	id?: string;
	pending: () => Promise<any>;
}

export const DConfirmation: IConfirmation = {
	dialog: false,
	title: '',
	text: '',
	btnText: '',
	id: '',
	cancelBtn: true,
	borderColor: undefined,
	pending: () => new Promise(resolve => resolve(false)),
};

export interface ISigningError {
	dialog: boolean;
	text: string;
	linkPath: string;
	linkText: string;
}

export const DSigningError: ISigningError = {
	dialog: false,
	text: '',
	linkPath: '',
	linkText: '',
};
