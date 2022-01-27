import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import * as amazonCognitoIdentityJs from 'amazon-cognito-identity-js';
import axios from 'axios';
import { ADD_TO_MESSAGE_QUEUE, OPEN_SIGNING_ERROR, RootState } from '.';
import {
	ICognitoUserExt,
	EBoolean,
	EForgotPwStatus,
	EGoogleAddrType,
	EIdentityType,
	EProfessionalType,
	IAttributes,
	IGoogleAddrComponent,
	ISignIn,
	ISignUp,
} from '~/types/auth/types';
import { ECognitoTokenKeys, GOOGLE_MAP_API_KEY } from '~/utils/constants';
import { getGeolocation, removeTokens, returnErrorMsg } from '~/utils/application';
import { ICtUser } from '~/types/common/types';
import { IChangePasswordDTO, IConfirmSignUpDTO, ISubmitForgotPwDTO } from '~/types/auth/dto';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SIGN_UP = 'SIGN_UP';
export const CONFIRM_SIGN_UP = 'CONFIRM_SIGN_UP';
export const SEND_CONFIRMATION = 'SEND_CONFIRMATION';
export const GOOGLE_SIGN_IN = 'GOOGLE_SIGN_IN';
export const FACEBOOK_SIGN_IN = 'FACEBOOK_SIGN_IN';
export const APPLE_SIGN_IN = 'APPLE_SIGN_IN';
export const SET_ME = 'SET_ME';
export const RETRIEVE_ME = 'RETRIEVE_ME';
export const SET_SIGN_UP_RESULT = 'SET_SIGN_UP_RESULT';
export const SET_TEMP_PASSWORD = 'SET_TEMP_PASSWORD';
export const SET_FORGOT_PASSWORD_STATUS = 'SET_FORGOT_PASSWORD_STATUS';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const FORGOT_PASSWORD_SUBMIT = 'FORGOT_PASSWORD_SUBMIT';
export const UPDATE_ATTRIBUTES = 'UPDATE_ATTRIBUTES';
export const REMOVE_ATTRIBUTES = 'REMOVE_ATTRIBUTES';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const DELETE_ACCOUNT_FROM_DB = 'DELETE_ACCOUNT_FROM_DB';
export const REFRESH_SESSION = 'REFRESH_SESSION';
export const REMOVE_COOKIE_USER_DATA = 'REMOVE_COOKIE_USER_DATA';
export const PROFILE_IMAGE = 'PROFILE_IMAGE';
export const SEARCH_USERS = 'SEARCH_USERS';
export const SEARCH_USERS_ERROR = 'SEARCH_USERS_ERROR';
export const SYNC_CONTACT_COGNITO_TO_HUBSPOT = 'SYNC_CONTACT_COGNITO_TO_HUBSPOT';
export const SYNC_PROPERTY_TO_HUBSPOT = 'SYNC_PROPERTY_TO_HUBSPOT';
export const SYNC_SUBSCRIPTION_TO_HUBSPOT = 'SYNC_SUBSCRIPTION_TO_HUBSPOT';
export const WITHDRAWAL_CONTACT = 'WITHDRAWAL_CONTACT';
export const CREATE_CONTACT = 'CREATE_CONTACT';
export const UPDATE_GEO_LOCATION = 'UPDATE_GEO_LOCATION';
export const INIT_RECAPTCHA = 'INIT_RECAPTCHA';
export const EXECUTE_RECAPTCHA = 'EXECUTE_RECAPTCHA';
export const GET_USERS_BY_EMAIL = 'GET_USERS_BY_EMAIL';
export const GET_OR_CREATE_USER = 'GET_OR_CREATE_USER';
export const UPDATE_USER = 'UPDATE_USER';

const googleMapAxios = axios.create({ baseURL: 'https://maps.googleapis.com/maps/api' });

export const isAccountant = (user: ICognitoUserExt | null): boolean => {
	return Boolean(user?.attributes && user?.attributes['custom:is_accountant'] === EBoolean.TRUE);
};

export const checkIdentityType = (username: string): EIdentityType => {
	if (!username) return EIdentityType.COGNITO;

	if (username.toLowerCase().includes('google')) {
		return EIdentityType.GOOGLE;
	} else if (username.toLowerCase().includes('facebook')) {
		return EIdentityType.FACEBOOK;
	} else if (username.toLowerCase().includes('apple')) {
		return EIdentityType.APPLE;
	} else {
		return EIdentityType.COGNITO;
	}
};

export const state = () => ({
	user: null as ICognitoUserExt | null,
	signUpInfo: {
		username: '',
		password: '',
		givenName: '',
		familyName: '',
		subscribe: true,
		isAccountant: false,
		company: '',
	} as ISignUp,
	tempPassword: '' as string,
	signUpResult: null as amazonCognitoIdentityJs.ISignUpResult | null,
	forgotPwStatus: EForgotPwStatus.READY as EForgotPwStatus,
});

export type AuthState = ReturnType<typeof state>;

export const getters: GetterTree<AuthState, RootState> = {
	loggedIn: (state): boolean => Boolean(state.user !== null && state.user?.username),
	identityType: (state): EIdentityType => {
		const username: string = (state.user && state.user?.username) || '';
		return checkIdentityType(username);
	},
	fullName: (state): string => {
		const givenName = state.user?.attributes?.given_name || '';
		const familyName = state.user?.attributes?.family_name || '';
		return !givenName && !familyName ? '' : `${givenName} ${familyName}`;
	},
	avatarName: (state): string => {
		const givenName = state.user?.attributes?.given_name || '';
		const firstNameChar = givenName[0] || '';
		return !firstNameChar ? '' : firstNameChar.toUpperCase();
	},
	avatarImageUrl: (state): string => {
		const imageUrl = state.user?.attributes?.picture || '';
		return imageUrl;
	},
	isAccountant: (state): boolean => {
		return isAccountant(state.user);
	},
	userPaypalEmail: (state): string | null => {
		if (state.user && state.user.attributes) {
			if ('custom:paypal_email' in state.user.attributes) {
				return state.user.attributes['custom:paypal_email'] || null;
			} else {
				return null;
			}
		}
		return null;
	},
	isReferral: (state): boolean => {
		if (state.user && state.user.attributes) {
			return 'custom:referral_id' in state.user?.attributes;
		}
		return false;
	},
	thereIsCountry: (state): boolean => {
		if (state.user && state.user.attributes) {
			return 'custom:tax_country' in state.user?.attributes;
		}
		return false;
	},
	missingAgreementInfo: (state): boolean => {
		if (state.user && state.user.attributes) {
			return !('custom:is_newsletter_subd' in state.user.attributes);
		}
		return false;
	},
	accountantTaxSoftware: (state): string | null => {
		if (state.user && state.user.attributes) {
			if ('custom:software' in state.user.attributes) {
				return state.user.attributes['custom:software'] || null;
			} else {
				return null;
			}
		}
		return null;
	},
	userName: (state): string | null => {
		return state.user ? state.user.getUsername() : null;
	},
	userEmail: (state): string => {
		return (state.user && state.user?.attributes.email) || '';
	},
	isNoticeEmailSubscribed: (state): boolean => {
		if (state.user && state.user.attributes) {
			return state.user.attributes['custom:is_notice_email_subd'] === EBoolean.TRUE;
		}
		return false;
	},
};

export const mutations: MutationTree<AuthState> = {
	[SET_FORGOT_PASSWORD_STATUS]: (state, payload: EForgotPwStatus) => {
		state.forgotPwStatus = payload;
	},
	[SIGN_OUT]: state => {
		state.user = null;
	},
	[SET_ME]: (state, payload: ICognitoUserExt) => {
		state.user = payload;
	},
	[SET_SIGN_UP_RESULT]: (state, payload: amazonCognitoIdentityJs.ISignUpResult) => {
		state.signUpResult = payload;
	},
	[SET_TEMP_PASSWORD]: (state, payload: string) => {
		state.tempPassword = payload;
	},
};

export const actions: ActionTree<AuthState, RootState> = {
	[REMOVE_COOKIE_USER_DATA](): Promise<any> {
		return removeTokens(this.$cookies, [ECognitoTokenKeys.userData]);
	},
	async [GOOGLE_SIGN_IN]() {
		await removeTokens(this.$cookies);
		Auth.federatedSignIn({ customProvider: CognitoHostedUIIdentityProvider.Google });
	},
	async [FACEBOOK_SIGN_IN]() {
		await removeTokens(this.$cookies);
		Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Facebook });
	},
	async [APPLE_SIGN_IN]() {
		await removeTokens(this.$cookies);
		Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Apple });
	},
	async [SIGN_IN]({ commit }, payload: ISignIn): Promise<string> {
		await removeTokens(this.$cookies);

		try {
			const user = await Auth.signIn(payload.username, payload.password);
			commit(SET_ME, user);
			this.$router.push('/auth');
			return 'success';
		} catch (error: any) {
			console.error(error);
			if (error && error.code === 'UserNotConfirmedException') {
				return 'notConfirmed';
			} else {
				commit(
					OPEN_SIGNING_ERROR,
					{
						text: returnErrorMsg(error.message),
						linkPath: '',
						linkText: '',
					},
					{ root: true },
				);
			}
			return 'fail';
		}
	},
	async [SIGN_OUT]({ commit, dispatch }) {
		try {
			await Auth.signOut();
			commit(SIGN_OUT);
		} catch (error: any) {
			console.error(error);
			dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$i18n.t('message.fail.signOut') }, { root: true });
		}
	},
	async [SIGN_UP]({ commit }, payload: ISignUp): Promise<true | string> {
		const attributes = {
			given_name: payload.givenName,
			family_name: payload.familyName,
			'custom:is_accountant': payload.isAccountant ? EBoolean.TRUE : EBoolean.FALSE,
			'custom:is_newsletter_subd': payload.subscribe ? EBoolean.TRUE : EBoolean.FALSE,
			'custom:is_promo_email_subd': payload.subscribe ? EBoolean.TRUE : EBoolean.FALSE,
			'custom:is_notice_email_subd': payload.subscribe ? EBoolean.TRUE : EBoolean.FALSE,
			'custom:is_notice_text_subd': payload.subscribe ? EBoolean.TRUE : EBoolean.FALSE,
			'custom:company': payload.company,
			'custom:license_state':
				payload.isAccountant && payload.professionalType !== EProfessionalType.EA ? payload.licenseState : '',
			'custom:license_number': payload.isAccountant ? payload.licenseNumber : '',
			'custom:professional_type': payload.isAccountant ? payload.professionalType : '',
			'custom:software': payload.isAccountant ? payload.software : '',
		};

		try {
			const res: amazonCognitoIdentityJs.ISignUpResult = await Auth.signUp({
				username: payload.username,
				password: payload.password,
				attributes,
			});

			commit(SET_TEMP_PASSWORD, payload.password);
			commit(SET_SIGN_UP_RESULT, res);
			return true;
		} catch (error: any) {
			console.error(error);
			return error.message;
		}
	},
	async [CONFIRM_SIGN_UP]({ commit }, payload: IConfirmSignUpDTO): Promise<boolean> {
		try {
			await Auth.confirmSignUp(payload.username, payload.code);
			return true;
		} catch (error: any) {
			console.error(error);
			commit(OPEN_SIGNING_ERROR, { text: returnErrorMsg(error.message), linkPath: '', linkText: '' }, { root: true });
			return false;
		}
	},
	async [SEND_CONFIRMATION]({ dispatch, commit }, payload: string): Promise<boolean> {
		try {
			await Auth.resendSignUp(payload);
		} catch (error: any) {
			console.error(error);
			commit(OPEN_SIGNING_ERROR, { text: returnErrorMsg(error.message), linkPath: '', linkText: '' }, { root: true });
			return false;
		}
		dispatch(
			ADD_TO_MESSAGE_QUEUE,
			{ color: 'successDark', msg: this.$i18n.t('message.resentConfirmation') },
			{ root: true },
		);
		return true;
	},

	async [REFRESH_SESSION](): Promise<any> {
		let session: any = null;
		try {
			session = await Auth.currentSession();
		} catch (error) {
			if (error !== 'No current user') {
				console.error('Refresh session : ', error);
			}
			return false;
		}

		let refreshToken: any = null;
		try {
			refreshToken = session.getRefreshToken();
		} catch (error) {
			console.error('Get refresh token : ', error);
			return false;
		}

		try {
			const user = await Auth.currentAuthenticatedUser();
			return new Promise((resolve, reject) => {
				user.refreshSession(refreshToken, (err: any, data: any) => (err ? reject(err) : resolve(data)));
			});
		} catch (error: any) {
			console.error('Get user data : ', error);
			return false;
		}
	},
	async [RETRIEVE_ME]({ dispatch, commit }): Promise<ICognitoUserExt | null> {
		let response = null;
		try {
			await dispatch(REMOVE_COOKIE_USER_DATA);
			response = await Auth.currentAuthenticatedUser();
			commit(SET_ME, response);
			return response;
		} catch (error: any) {
			commit(SET_ME, null);
			return null;
		}
	},
	async [FORGOT_PASSWORD]({ dispatch, commit }, payload: string) {
		try {
			await Auth.forgotPassword(payload);
			dispatch(
				ADD_TO_MESSAGE_QUEUE,
				{ color: 'successDark', msg: this.$i18n.t('message.sendConfirmation') },
				{ root: true },
			);
			commit(SET_FORGOT_PASSWORD_STATUS, EForgotPwStatus.SENDED);
		} catch (error: any) {
			console.error(error);
			commit(OPEN_SIGNING_ERROR, { text: returnErrorMsg(error.message), linkPath: '', linkText: '' }, { root: true });
		}
	},
	async [FORGOT_PASSWORD_SUBMIT]({ dispatch, commit }, payload: ISubmitForgotPwDTO) {
		try {
			await Auth.forgotPasswordSubmit(payload.username, payload.code, payload.newPassword);
			dispatch(
				ADD_TO_MESSAGE_QUEUE,
				{ color: 'successDark', msg: this.$i18n.t('message.success.passwordUpdate') },
				{ root: true },
			);
			commit(SET_FORGOT_PASSWORD_STATUS, EForgotPwStatus.DONE);
		} catch (error: any) {
			console.error(error);
			commit(OPEN_SIGNING_ERROR, { text: returnErrorMsg(error.message), linkPath: '', linkText: '' }, { root: true });
		}
	},
	async [UPDATE_ATTRIBUTES]({ dispatch, commit }, payload: IAttributes): Promise<boolean> {
		const willBeUpdated: any = {};
		const willBeRemoved: string[] = [];

		const keys = Object.keys(payload);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			// @ts-ignore
			const value = payload[key];
			value ? (willBeUpdated[key] = value) : willBeRemoved.push(key);
		}

		try {
			const user = await Auth.currentAuthenticatedUser();
			await Auth.updateUserAttributes(user, willBeUpdated);
			await Auth.deleteUserAttributes(user, willBeRemoved);
			return true;
		} catch (error: any) {
			console.error(error);
			commit(OPEN_SIGNING_ERROR, { text: returnErrorMsg(error.message), linkPath: '', linkText: '' }, { root: true });

			return false;
		} finally {
			const cognitoUser: ICognitoUserExt = await dispatch(RETRIEVE_ME);
			cognitoUser.attributes && dispatch(SYNC_CONTACT_COGNITO_TO_HUBSPOT, cognitoUser.attributes);
		}
	},
	async [REMOVE_ATTRIBUTES]({ dispatch, commit }, payload: string[]) {
		try {
			const user = await Auth.currentAuthenticatedUser();
			await Auth.deleteUserAttributes(user, payload);
		} catch (error: any) {
			console.error(error);
			commit(OPEN_SIGNING_ERROR, { text: returnErrorMsg(error.message), linkPath: '', linkText: '' }, { root: true });

			return false;
		}
		await dispatch(RETRIEVE_ME);
		return true;
	},
	async [CHANGE_PASSWORD](_, payload: IChangePasswordDTO): Promise<true | string> {
		try {
			const user = await Auth.currentAuthenticatedUser();
			await Auth.changePassword(user, payload.oldPassword, payload.newPassword);
			return true;
		} catch (error: any) {
			console.error(error);
			return returnErrorMsg(error.message);
		}
	},
	async [DELETE_ACCOUNT_FROM_DB]({ state }): Promise<boolean> {
		const username = state.user?.getUsername();

		try {
			await this.$axios({
				method: 'DELETE',
				url: `/services/ct/api/ct-users/login/${username}`,
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [PROFILE_IMAGE]({ dispatch }, payload: FormData) {
		try {
			const res = await this.$axios({
				method: 'POST',
				url: '/services/ct/api/ct-users/current/profile-image',
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				data: payload,
			});
			const pictureUrl = { picture: res.data };
			await dispatch(UPDATE_ATTRIBUTES, pictureUrl);
			dispatch(
				ADD_TO_MESSAGE_QUEUE,
				{ color: 'successDark', msg: this.$i18n.t('message.success.update') },
				{ root: true },
			);
		} catch (error: any) {
			console.error(error);
			dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$i18n.t('message.fail.update') }, { root: true });
			return false;
		}
	},
	async [SEARCH_USERS](_, email: string): Promise<ICtUser[] | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/resources/ct-users/email/${email}`,
			});
			return res.data;
		} catch (error: any) {
			console.error(error);
			return false;
		}
	},
	async [GET_OR_CREATE_USER](_, login: string): Promise<ICtUser | false> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/ct-users/login/${login}`,
			});
			return res.data;
		} catch (error: any) {
			console.error(error);
			return false;
		}
	},
	async [GET_USERS_BY_EMAIL](_, email: string): Promise<ICtUser[]> {
		try {
			const res = await this.$axios({
				method: 'GET',
				url: `/services/ct/api/ct-users/email/${email}`,
			});
			return res.data;
		} catch (error: any) {
			console.error(error);
			return [];
		}
	},
	async [UPDATE_USER](_, req: any): Promise<ICtUser | false> {
		try {
			const res = await this.$axios({
				method: 'PATCH',
				url: `/services/ct/api/ct-users/${req.id}`,
				data: req.data,
			});
			return res.data;
		} catch (error: any) {
			console.error(error);
			return false;
		}
	},
	async [SYNC_CONTACT_COGNITO_TO_HUBSPOT](_, payload: IAttributes) {
		try {
			await this.$axios({
				method: 'POST',
				url: '/services/ct/api/marketing/sync-contact',
				data: payload,
			});
		} catch (error) {
			console.error(error);
		}
	},
	// async [SYNC_PROPERTY_TO_HUBSPOT](_, payload: any) {
	// 	try {
	// 		await this.$axios({
	// 			method: 'POST',
	// 			url: '/services/ct/api/marketing/sync-contact-property',
	// 			data: payload,
	// 		});
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// },
	// async [SYNC_SUBSCRIPTION_TO_HUBSPOT](_, subscriptionId: number) {
	// 	try {
	// 		await this.$axios({
	// 			method: 'POST',
	// 			url: '/services/ct/api/marketing/subscribe',
	// 			params: { subscriptionId },
	// 		});
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// },
	async [WITHDRAWAL_CONTACT]({ state, dispatch }): Promise<boolean> {
		try {
			const email = state.user?.attributes.email;
			if (!email) {
				dispatch(
					ADD_TO_MESSAGE_QUEUE,
					{ color: 'error', msg: 'Email not found. Please refresh this page' },
					{ root: true },
				);
				return false;
			}

			await this.$axios({
				method: 'DELETE',
				url: '/services/ct/api/marketing/withdrawal',
				params: {
					email,
				},
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [CREATE_CONTACT](_, payload: IAttributes) {
		try {
			await this.$axios({
				method: 'POST',
				url: '/services/ct/api/marketing/create-contact',
				data: payload,
			});
		} catch (error) {
			console.error(error);
		}
	},
	async [UPDATE_GEO_LOCATION]({ dispatch }) {
		try {
			if (!GOOGLE_MAP_API_KEY) return;
			const latlng = await getGeolocation();

			const res: any = await googleMapAxios({
				method: 'GET',
				url: '/geocode/json',
				params: {
					latlng,
					key: GOOGLE_MAP_API_KEY,
					sensor: false,
					language: 'en',
				},
			});

			const addrComponents: IGoogleAddrComponent[] | undefined = res?.data?.results[0]?.address_components;
			if (!addrComponents) return false;

			let country = '';
			let region = '';
			let city = '';

			addrComponents.forEach(addrComponent => {
				if (addrComponent.types.includes(EGoogleAddrType.COUNTRY)) {
					country = addrComponent.short_name;
				} else if (addrComponent.types.includes(EGoogleAddrType.AREA1)) {
					region = addrComponent.long_name;
				} else if (addrComponent.types.includes(EGoogleAddrType.LOCALITY)) {
					city = addrComponent.long_name;
				}
			});

			const data: any = {
				'custom:geo_country': country,
				'custom:geo_locality': city,
				'custom:geo_region': region,
			};

			const updateResponse: boolean = await dispatch(UPDATE_ATTRIBUTES, data);
			if (!updateResponse) {
				throw new Error('Update error');
			}

			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async [INIT_RECAPTCHA]() {
		try {
			// @ts-ignore
			await this.$recaptcha.init();
		} catch (e) {
			console.error(e);
		}
	},
	async [EXECUTE_RECAPTCHA]({ dispatch }): Promise<boolean> {
		try {
			// @ts-ignore
			await this.$recaptcha.execute('login');
			return true;
		} catch (error) {
			dispatch(
				ADD_TO_MESSAGE_QUEUE,
				{ color: 'error', msg: 'Recaptcha authentication failed. Try again' },
				{ root: true },
			);
			return false;
		}
	},
};
