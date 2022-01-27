import { NuxtAxiosInstance } from '@nuxtjs/axios';
import axios from 'axios';
import { IFileDetail, IGenerateUrlReq, IGenerateUrlRes } from '~/types/import/dto';

export class UploadFileService {
	files: File[];
	appAxios: NuxtAxiosInstance;
	url: string;

	constructor(appAxios: NuxtAxiosInstance, files: File[], version: number) {
		this.files = files;
		this.appAxios = appAxios;
		if (version === 1) {
			this.url = '/services/ct/api/import/csv/template/provider/generate-url'; // File import
		} else if (version === 2) {
			this.url = '/services/ct/api/import/csv/template/platform/generate-url'; // Template import
		} else if (version === 3) {
			this.url = '/services/ct/api/import/csv/template/custom/generate-url'; // Custom template import
		} else {
			this.url = '';
		}
	}

	async uploadToS3(): Promise<IFileDetail[] | false> {
		try {
			const DTO: IGenerateUrlReq[] = this.files.map((f, index) => ({ index, filename: f.name }));

			const res = await this.appAxios({
				method: 'POST',
				url: this.url,
				data: DTO,
			});

			const response: IGenerateUrlRes[] = res.data;
			const renamedFiles = this.files.map((f, idx) => new File([f], response[idx].uniqueFilename));

			await Promise.all(
				response.map((r, idx) => {
					return axios({
						url: r.presignedUrl,
						method: 'PUT',
						data: renamedFiles[idx],
						headers: { 'Content-Type': renamedFiles[idx].type },
					});
				}),
			);

			return this.files.map((file, index) => ({
				index,
				filename: file.name,
				size: file.size,
				result: true,
				uniqueFilename: response[index].uniqueFilename,
				presignedUrl: response[index].presignedUrl,
			}));
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}
