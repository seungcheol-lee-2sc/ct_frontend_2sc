export interface IContactFormDTO {
	email: string;
	firstname: string;
	lastname: string;
	category?: string;
	technical_category?: string;
	subject: string;
	attachments: string;
	message: string;
}

export interface IGetHubspotTokenDTO {
	email: string;
	firstName: string;
	lastName: string;
}

export interface IHubspotFormObject {
	objectTypeId: string;
	name: string;
	value: string;
}

export interface IHubspotFormDTO {
	fields: IHubspotFormObject[];
}
