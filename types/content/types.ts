/* eslint-disable camelcase */
export interface ISharePostIcon {
	name: string;
	src: string;
	href: string | null;
}

export interface IFaq {
	id: number | null;
	answer: string | null;
	question: string | null;
	helpPage: boolean;
	pricingPage: boolean;
	created_at: string | null;
	published_at: string | null;
	updated_at: string | null;
}

export interface ICommonContent {
	id: number | null;
	title: string | null;
	subtitle: string | null;
	content: string | null;
}

export interface IBlogCategory {
	id: number | null;
	categoryName: string;
	createdAt: string;
	posts: any[];
	publishedAt: string;
	updatedAt: string;
}

export interface IAuthor {
	avatar: any | null;
	created_at: string | null;
	id: number | null;
	introduce: string | null;
	name: string | null;
	role: string | null;
	updated_at: string | null;
}

export interface IMeta {
	id: number | null;
	title: string | null;
	description: string | null;
	ogTitle: string | null;
	ogDescription: string | null;
	ogImage: string | null;
}

export interface IDisclaimer {
	id: number | null;
	disclaimer: string | null;
}

export interface IPost {
	id: number | null;
	slug: string | null;
	author: IAuthor | null;
	category: IBlogCategory | null;
	content: string | null;
	disclaimer: IDisclaimer | null;
	intro: string | null;
	meta: IMeta | null;
	thumbnail: any;
	title: string | null;
	created_at: string;
	published_at: string;
	updated_at: string;
	post: IPost;
	posts: IPost[];
}

export interface ITaxSubject {
	id: number;
	title: string | null;
	content: string | null;
	example: string | null;
	img: string | null;
	order: number | null;
	created_at: string;
	updated_at: string;
}

export interface ITaxGuideContent {
	id: number;
	content: string | null;
	subjectsTitle: string | null;
	tax_subjects: ITaxSubject[];
}

export interface ITaxGuide {
	id: number;
	title: string | null;
	description: string | null;
	contents: ITaxGuideContent[];
	disclaimer: IDisclaimer;
	created_at: string;
	updated_at: string;
}

export interface IContact {
	id: number;
	twitter: string | null;
	facebook: string | null;
	youtube: string | null;
	linkedIn: string | null;
	instagram: string | null;
	reddit: string | null;
	googleMyBuisiness: string | null;
	email: string | null;
	phone: string | null;
	created_at: string;
	updated_at: string;
}

export interface IDefaultExchanges {
	id: number | null;
	exchange: ICommonContent;
	blockchain: ICommonContent;
	created_at: string | null;
	updated_at: string | null;
}

export interface IExchanges {
	slug: string | null;
	id: number | null;
	content: ICommonContent;
	meta: IMeta | null;
	published_at: string | null;
	created_at: string | null;
	updated_at: string | null;
}

export interface ICommonImportGuide {
	id: number | null;
	summary: string | null;
	warning: string | null;
	articleUrl: string | null;
	youtube: string | null;
	positionTop: boolean | null;
}

export interface IImportGuide {
	id: number | null;
	slug: string | null;
	auto: ICommonImportGuide;
	file: ICommonImportGuide;
	manual: ICommonImportGuide;
	created_at: string | null;
	updated_at: string | null;
	published_at: string | null;
}

export interface INoticeAlert {
	created_at: string | null;
	published_at: string | null;
	updated_at: string | null;
	id: number | null;
	summaryTitle: string | null;
	summaryContent: string | null;
	title: string | null;
	content: string | null;
	img: any;
	order: number;
	moreText: string | null;
	linkLabel: string | null;
	linkUrl: string | null;
	path: string | null;
}

export interface IDefaultImportGuide {
	id: number | null;
	auto: ICommonImportGuide;
	file: ICommonImportGuide;
	manual: ICommonImportGuide;
	created_at: string | null;
	updated_at: string | null;
}

export interface ICommonLegal {
	id: number | null;
	content: string | null;
	updatedAt: string | null;
}

export interface ILegal {
	id: number | null;
	tos: ICommonLegal;
	privacy: ICommonLegal;
	security: ICommonLegal;
	disclaimer: ICommonLegal;
	created_at: string | null;
	updated_at: string | null;
}

export interface ISeoMeta extends IMeta {
	path: string | null;
}

export interface ICookie {
	id: number | null;
	content: string | null;
	turnOn: boolean;
}

export interface IPopup {
	id: number | null;
	content: string | null;
	img: any;
	turnOn: boolean;
}

export interface INotice {
	id: number | null;
	created_at: string;
	updated_at: string;
	cookie: ICookie | null;
	popup: IPopup[];
}

export interface ISeo {
	id: number | null;
	created_at: string;
	updated_at: string;
	default: ISeoMeta;
	custom: ISeoMeta[];
}

export interface IReview {
	id: number | null;
	created_at: string;
	updated_at: string;
	title: string | null;
	content: string | null;
	order: number | null;
	img: any;
}
