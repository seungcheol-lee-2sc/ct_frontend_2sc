import { NuxtCookies } from 'cookie-universal-nuxt';
import {
	BASE_SITE_TITLE,
	COOKIE_STORAGE,
	COUNTRIES,
	CT_LOGIN_IMPORT,
	CT_PAY_REDIRECT,
	DEVELOPMENT,
	ECognitoTokenKeys,
	RECOMMANDED_COUNTRY_CODES,
	STRAPI_BASE,
} from './constants';
import { roundingNumber } from './number';
import { addComma, addMinusOutsideCurrency, omitText, sanitizeEveryTags } from './string';
import { ETransactionCategory, ETransactionType, ITransactionRecord } from '~/types/transaction/types';
import { ICountryWithCode, ICtUser } from '~/types/common/types';
import { IMeta, ISeoMeta } from '~/types/content/types';

export const getEveryCountries = (): ICountryWithCode[] => {
	const total: ICountryWithCode[] = Object.keys(COUNTRIES)
		// @ts-ignore
		.map(key => ({ ...COUNTRIES[key], code: key, recommanded: Boolean(RECOMMANDED_COUNTRY_CODES.includes(key)) }))
		.sort((a, b) => (a.name > b.name ? 1 : -1));
	const recommandedCountries = total.filter(v => v.recommanded);
	const otherCountries = total.filter(v => !v.recommanded);

	return recommandedCountries.concat(otherCountries);
};

export const getCountryIcon = (countryCode: string): string => {
	return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`;
};

// pixel : the number of squares of 2 (max:128)
export const getIconImage = (imageUrl: string, pixel: number = 64): string => {
	return imageUrl ? imageUrl.replace(/PIXEL/g, String(pixel)) : '';
};

export const setPayRedirectCookie = (cookies: NuxtCookies, redirectPath: string): void => {
	cookies.set(`${CT_PAY_REDIRECT}`, redirectPath, {
		maxAge: 60 * 10,
		path: '/',
	});
};

export enum EStrapiImageSize {
	LARGE = 'large',
	MEDIUM = 'medium',
	SMALL = 'small',
	THUMBNAIL = 'thumbnail',
	ORIGINAL = 'original',
}

export const getStrapiImageSrc = (imgObj: any, size: EStrapiImageSize): string => {
	if (imgObj) {
		let resultUrl: string = '';
		if (size === EStrapiImageSize.ORIGINAL) {
			resultUrl = imgObj.url?.includes('http') ? imgObj.url : `${STRAPI_BASE}${imgObj.url}`;
		} else {
			const url = imgObj.formats && imgObj.formats[size] ? imgObj.formats[size].url : imgObj.url;
			resultUrl = url?.includes('http') ? url : `${STRAPI_BASE}${url}`;
		}
		return resultUrl;
	} else {
		return '';
	}
};

export const dynamicMetaInfo = (meta: IMeta, title: string = '', desc: string = ''): any => {
	const finalTitle = meta?.title || title || '';
	return {
		title: finalTitle || BASE_SITE_TITLE,
		meta: [
			{ hid: 'title', name: 'title', content: finalTitle },
			{
				hid: 'description',
				name: 'description',
				content: meta?.description || omitText(sanitizeEveryTags(desc || ''), 1000) || '',
			},
			{
				hid: 'og:image',
				name: 'og:image',
				content: meta.ogImage ? getStrapiImageSrc(meta.ogImage, EStrapiImageSize.SMALL) : '',
			},
			{ hid: 'og:title', name: 'og:title', content: meta.ogTitle || '' },
			{ hid: 'og:description', name: 'og:description', content: meta.ogDescription || '' },
		],
	};
};

export const metaInfo = (path: string, metaArr: ISeoMeta[], defaultMeta: ISeoMeta, defaultTitle: string): any => {
	let metaTitle: string = '';
	let metaDesc: string = '';
	let metaOgImage: string = '';
	let metaOgTitle: string = '';
	let metaOgDesc: string = '';

	let trimmedPath = (path && path.trim()) || '';

	if (trimmedPath.length > 1) {
		const lastChar = trimmedPath[trimmedPath.length - 1];
		if (lastChar === '/') {
			trimmedPath = trimmedPath.substring(0, trimmedPath.length - 1);
		}
	}

	if (trimmedPath) {
		const found = metaArr.find(v => v.path === trimmedPath);
		metaTitle = found?.title || defaultMeta?.title || defaultTitle || '';
		metaDesc = found?.description || defaultMeta?.description || '';
		metaOgImage = found?.ogImage || defaultMeta?.ogImage || '';
		metaOgTitle = found?.ogTitle || defaultMeta?.ogTitle || '';
		metaOgDesc = found?.ogDescription || defaultMeta?.ogDescription || '';
	}

	return {
		title: metaTitle || BASE_SITE_TITLE,
		meta: [
			{ hid: 'title', name: 'title', content: metaTitle },
			{ hid: 'description', name: 'description', content: metaDesc },
			{ hid: 'og:image', name: 'og:image', content: metaOgImage },
			{ hid: 'og:title', name: 'og:title', content: metaOgTitle },
			{ hid: 'og:description', name: 'og:description', content: metaOgDesc },
		],
	};
};

export const cookiRemovingConfig = () => {
	return process.env.NODE_ENV !== DEVELOPMENT
		? {
				domain: `.${COOKIE_STORAGE}`,
				path: '/',
				secure: true,
		  }
		: undefined;
};

export const removeTokens = (cookies: NuxtCookies, targets: ECognitoTokenKeys[] = []): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		try {
			const everyCookies = cookies.getAll();
			const keys = Object.keys(everyCookies);
			for (let i = 0; i < keys.length; i++) {
				const key: any = keys[i];
				if (key.includes('CognitoIdentityServiceProvider')) {
					if (targets.length === 0) {
						// delete everything
						cookies.remove(key, cookiRemovingConfig());
					} else {
						for (let j = 0; j < targets.length; j++) {
							const target = targets[j];
							if (key.includes(target)) {
								cookies.remove(key, cookiRemovingConfig());
								break;
							}
						}
					}
				}
			}
			resolve(true);
		} catch (error) {
			console.error(error);
			reject(error);
		}
	});
};

export const getCognitoValueFromCookie = (cookies: NuxtCookies, userKey: ECognitoTokenKeys): string => {
	const everyDatas = cookies.getAll();
	const keys = Object.keys(everyDatas);
	let result = '';
	for (let i = 0; i < keys.length; i++) {
		const key: any = keys[i];
		if (key.includes('CognitoIdentityServiceProvider') && key.includes(userKey)) {
			result = everyDatas[key];
		}
	}
	return result;
};

export const getAccessToken = (cookies: NuxtCookies): string => {
	return getCognitoValueFromCookie(cookies, ECognitoTokenKeys.accessToken);
};

export const getUserData = (cookies: NuxtCookies): string => {
	return getCognitoValueFromCookie(cookies, ECognitoTokenKeys.userData);
};

export const getRefreshToken = (cookies: NuxtCookies): string => {
	return getCognitoValueFromCookie(cookies, ECognitoTokenKeys.refreshToken);
};

export const makeNewTransaction = (): ITransactionRecord => {
	return {
		id: undefined,
		timestamp: undefined,
		tempTimeStamp: undefined,
		type: undefined,
		category: undefined,
		orderId: undefined,
		tradeId: undefined,
		outAsset: null,
		outQuantity: null,
		outSpotPrice: null,
		outTotal: null,
		outBalance: null,
		inAsset: null,
		inQuantity: null,
		inSpotPrice: null,
		inTotal: null,
		inBalance: null,
		outFeeAsset: null,
		outFeeQuantity: null,
		outFeeSpotPrice: null,
		outFeeTotal: null,
		outFeeBalance: null,
		inFeeAsset: null,
		inFeeQuantity: null,
		inFeeSpotPrice: null,
		inFeeTotal: null,
		inFeeBalance: null,
		outWalletAddress: null,
		inWalletAddress: null,
		outTransactionHash: null,
		inTransactionHash: null,
		batch: {
			id: null,
			status: null,
			fileLocation: null,
			fileName: null,
			timestampTimeZone: null,
			countTotal: null,
			countDuplicate: null,
			countError: null,
			source: null,
			errorCode: null,
			errorDescription: null,
			errorMessage: null,
			importErrors: [],
			rawData: null,
		},
		user: null,
		sourceName: null,
		comments: [],
		excluded: null,
		costBasis: null,
	};
};

export const tourContent = (src: string, title: string, contents: string, skip: string, next: string): string => {
	return `
		<div class="family-poppins">
			<div class="tourWrapper">
				${src ? `<div><img src="${src}" class="tourImg" /></div>` : ''}
				
				<div style="margin-left: 8px">
					<div class=" tourTitle">${title}</div>
					<div class=" tourContent">${contents}</div>
				</div>
			</div>
			<div class="tourButtonsWrapper">
				<a role="button" class=" ${!skip ? 'hidde' : ''} tourButton" style="margin-right:8px;" onclick="window.tour.exit()">
					${skip}
				</a>
				<a role="button" class="tourButton bg-primary" style="border-radius: 10000px" onclick="window.tour.nextStep()">
					<span class="tourButtonInner">${next}</span>
				</a>
			</div>
		</div>
	`;
};

export const paginationText = (page: number = 0, size: number = 0, total: number = 0, dataLength: number = 0) => {
	const from = page * size + 1;
	let to = page * size + dataLength;
	if (total <= to) {
		to = total;
	}
	return `${from}-${to} of ${total}`;
};

export const pageLength = (total: number, size: number): number => {
	return total > 0 ? Math.ceil(total / size) : 0;
};

export const returnErrorMsg = (response: any): string => {
	if (response && response.data) {
		return typeof response.data === 'string'
			? response.data
			: `${response.data?.title} (${response.data?.status})\n${response.data?.detail || ''}`;
	} else {
		return response;
	}
};

export const makeSrcToAbsolute = (html: string, baseUrl: string) => {
	// eslint-disable-next-line no-useless-escape
	return html && html.replace(/src=\"\//g, `src=\"${baseUrl}\/`); // src="/
};

export const reserveLoginImport = (cookies: NuxtCookies, providerId: number) => {
	if (!providerId) return;

	cookies.set(`${CT_LOGIN_IMPORT}`, providerId, {
		maxAge: 60 * 10, // 10 minutes
		path: '/',
	});
};

export const cancelLoginImportReservation = (cookies: NuxtCookies) => {
	cookies.remove(CT_LOGIN_IMPORT);
};

export const getGeolocation = (): Promise<string> => {
	return new Promise(resolve => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition((position: any) => {
				const x: number = position?.coords.latitude;
				const y: number = position?.coords.longitude;
				x && y ? resolve(`${x},${y}`) : resolve('');
			});
		} else {
			resolve('');
		}
	});
};

// -1000 => -$1,000;
export const reformedAmountValue = (value: number, roundNum: number = 2): string => {
	if (value === null) {
		return '-';
	}
	const roundedNum = roundingNumber(value, roundNum);
	if (Object.is(roundedNum, -0)) {
		return '0';
	}

	return addMinusOutsideCurrency(addComma(roundedNum));
};

export const tradeCategoryFilter = (transaction: ITransactionRecord): ITransactionRecord => {
	// if (category === trade) : type always be 'convert'
	return {
		...transaction,
		type: transaction.category === ETransactionCategory.TRADE ? ETransactionType.CONVERT : transaction.type,
	};
};

export const getFullname = (user: ICtUser): string => {
	if (user) {
		if (user?.firstName && user?.lastName) {
			return `${user?.firstName} ${user?.lastName}`;
		} else {
			return user.email?.split('@')[0] || '-';
		}
	} else {
		return '-';
	}
};

export const generateAgreementText = (
	component: any,
	key: string,
	color: string = 'primary',
	enterprise: boolean = false,
) => {
	const commonAttr = `style="font-weight:500" target="_blank" rel="noopener noreferrer"`;
	return component.$t(key, {
		terms: `<a class="text-${color}" ${commonAttr} href="/terms-of-service">Terms</a>`,
		policy: `<a class="text-${color}" ${commonAttr} href="/privacy-policy">Privacy Policy</a>`,
		disclaimer: `<a class="text-${color}" ${commonAttr} href="/disclaimer">Disclaimer</a>`,
		enterprisePolicy: enterprise
			? `<a class="text-${color}" ${commonAttr} href="/privacy-policy/enterprise">Enterprise Privacy Policy</a>`
			: '',
	});
};
