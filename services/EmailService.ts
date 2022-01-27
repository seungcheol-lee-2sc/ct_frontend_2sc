import { Store } from 'vuex/types/index';
import { SEND_INVITE_EMAIL } from '~/store/accountant';
import { BUILD_ENV, DEVELOPMENT, EMAIL_DEV_ACCOUNT, EMAIL_ID_SANDBOX, PRODUCTION } from '~/utils/constants';

export class EmailService {
	to: string;
	from: string;
	buttonLink: string;
	content: string;
	templateId: number;
	store: Store<any>;

	constructor(
		store: Store<any>,
		templateId: number,
		to: string,
		from?: string,
		buttonLink?: string | undefined,
		content?: string,
	) {
		this.to = BUILD_ENV === DEVELOPMENT ? EMAIL_DEV_ACCOUNT : to;
		this.templateId = BUILD_ENV === DEVELOPMENT ? EMAIL_ID_SANDBOX : templateId;
		this.store = store;
		this.from = from || '';
		this.buttonLink = buttonLink || '';
		this.content = content || '';
	}

	formatting(): any {
		const DTO: any = {
			message: {
				to: this.to,
			},
			customProperties: {
				recipient: this.to,
				senderName: (this.from || '').split('@')[0],
				senderEmail: this.from || '',
				buttonLink: this.buttonLink || '',
				content: this.content || '',
			},
			emailId: this.templateId,
		};

		if (BUILD_ENV !== PRODUCTION && BUILD_ENV !== DEVELOPMENT) {
			DTO.contactProperties = { qa_test: true };
		}

		return DTO;
	}

	async sendEmail(): Promise<boolean> {
		return await this.store.dispatch(`accountant/${SEND_INVITE_EMAIL}`, this.formatting());
	}
}
