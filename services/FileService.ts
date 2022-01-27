/* eslint-disable import/no-named-as-default-member */
import { Store } from 'vuex/types/index';
import { Route } from 'vue-router';
import XLSX from 'xlsx';
import { CREATE_CONTACT_US, UPLOAD_TO_S3 } from '~/store/etc';
import { ICognitoUserExt } from '~/types/auth/types';
import { IContactFormDTO } from '~/types/etc/dto';

export type TFileType = 'zip' | 'csv' | 'img' | 'video';
const IMAGE_EXT_ARR = ['.png', '.jpg', '.jpeg', '.gif'];
const CSV_EXT_ARR = ['.xls', '.xlsx', '.xlsm', '.csv'];
const ZIP_EXT_ARR = ['.zip', '.7z', '.gz', '.tar', '.tgz', '.bz2', 'rar'];
const ZIP_MEDIA_ARR = [
	'application/zip',
	'application/x-zip-compressed',
	'application/x-7z-compressed',
	'application/x-tar',
	'application/gzip',
	'application/x-gzip',
	'application/vnd.rar',
];

export const makeAcceptableExt = (types: TFileType[]): string[] => {
	const result = [];
	types.includes('zip') && result.push(...ZIP_EXT_ARR);
	types.includes('csv') && result.push(...CSV_EXT_ARR);
	types.includes('img') && result.push(...IMAGE_EXT_ARR);
	if (types.includes('video')) {
		/**
		 * ToDo
		 * Acceptable video file's extensions should be declared
		 */
	}
	return result;
};

export const makeAcceptableMediaType = (types: TFileType[]): string[] => {
	const result = [];
	types.includes('zip') && result.push(...ZIP_MEDIA_ARR);
	return result;
};

export class FileService {
	files: File[];
	acceptExtensions: string[] = [];
	acceptMediatypes: string[] = [];
	manualMaxSize: number = 0;
	maxSizeMap: Map<string, number> = new Map([
		['xls', 65 * 1000000], // 65MB
		['xlsx', 25 * 1000000],
		['xlsm', 25 * 1000000],
		['csv', 12 * 1000000],
		['zip', 22.75 * 1000000],
		['7z', 22.75 * 1000000],
		['gz', 22.75 * 1000000],
		['tar', 22.75 * 1000000],
		['bz2', 22.75 * 1000000],
		['rar', 22.75 * 1000000],
	]);

	constructor(files: File[] = [], acceptableTypes: TFileType[]) {
		this.files = files;
		this.acceptExtensions = makeAcceptableExt(acceptableTypes);
		this.acceptMediatypes = makeAcceptableMediaType(acceptableTypes);
	}

	/**
	 *
	 * @returns true === pass
	 * @returns string === wrong file
	 */
	checkExt(): true | string {
		for (let i = 0; i < this.files.length; i++) {
			const file = this.files[i];
			for (let j = 0; j < this.acceptExtensions.length; j++) {
				const ext = this.acceptExtensions[j];
				if (file.name.includes(ext) || this.acceptMediatypes.includes(file.type)) {
					return true;
				}
			}
		}
		return this.acceptExtensions.join(', ').replace(/\./g, '');
	}

	checkSize(max: number = 0): true | any {
		for (let i = 0; i < this.files.length; i++) {
			const file: File = this.files[i];
			const ext = this.getExt(file.name);
			let maxSize: number = this.maxSizeMap.get(ext || '') || 10 * 1000000;
			if (max) {
				maxSize = max;
			}

			if (file.size > maxSize) {
				return { max: maxSize / 1000000, file };
			}
		}
		return true;
	}

	/**
	 * LoggedIn user only
	 */
	checkSizeAndSendToContact(max: number = 0, store: Store<any>, user: ICognitoUserExt, route: Route): true | any {
		const check: true | any = this.checkSize(max);
		if (check === true) return true;
		this.uploadToS3(check.file, store, user, route);
		return check;
	}

	async uploadToS3(file: File, store: Store<any>, user: ICognitoUserExt, route: Route) {
		const urls: string[] = await store.dispatch(`etc/${UPLOAD_TO_S3}`, [file]);
		if (urls.length === 0) return;

		let message = `\nAddtional Info\n`;
		message += `Path : ${route.path}\n`;
		message += `User id : ${user.getUsername()}\n`;
		message += `User email : ${user.attributes?.email || ''}\n`;

		const DTO: IContactFormDTO = {
			email: user.attributes.email || '',
			firstname: user?.attributes?.given_name || '',
			lastname: user?.attributes?.family_name || '',
			category: 'Large file size',
			subject: 'Too large file size',
			attachments: urls.map((v, idx) => `${idx + 1}. ${v}`).join('\n'),
			message,
		};

		store.dispatch(`etc/${CREATE_CONTACT_US}`, DTO);
	}

	checkCount(max: number): boolean {
		return this.files.length <= max;
	}

	getExt(filename: string): string | undefined {
		const exec = /[^.]+$/.exec(filename);
		return exec ? exec[0] : undefined;
	}

	cointelliTemplate(): Promise<boolean[]> {
		return new Promise((resolve, _reject) => {
			const CRITERIA =
				'Timestamp,Type,Out Currency,Out Quantity,In Currency,In Quantity,Fee Currency,Fee Quantity,Comments';

			const result: boolean[] = [];

			for (let i = 0; i < this.files.length; i++) {
				const file = this.files[i];
				const fileReader = new FileReader();
				fileReader.onload = (e: any) => {
					const data = e.target.result;
					const workbook = XLSX.read(data, { type: 'binary' });

					const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
					const header1 = firstSheet.A1 && firstSheet.A1.v;
					const header2 = firstSheet.B1 && firstSheet.B1.v;
					const header3 = firstSheet.C1 && firstSheet.C1.v;
					const header4 = firstSheet.D1 && firstSheet.D1.v;
					const header5 = firstSheet.E1 && firstSheet.E1.v;
					const header6 = firstSheet.F1 && firstSheet.F1.v;
					const header7 = firstSheet.G1 && firstSheet.G1.v;
					const header8 = firstSheet.H1 && firstSheet.H1.v;
					const header9 = firstSheet.I1 && firstSheet.I1.v;
					const headers: string = [
						header1,
						header2,
						header3,
						header4,
						header5,
						header6,
						header7,
						header8,
						header9,
					].join(',');

					result.push(headers.toLowerCase() === CRITERIA.toLowerCase());

					if (result.length >= this.files.length) {
						resolve(result);
					}
				};
				fileReader.readAsBinaryString(file);
			}
		});
	}
}
