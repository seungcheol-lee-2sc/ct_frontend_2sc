export interface IAffiliateCampaign {
	created_at?: string;
	id?: string;
	name?: string;
	updated_at?: string;
}
export interface IAffiliateSale {
	id?: string;
	currency?: string;
	charged_at?: string;
	stripe_account_id?: string;
	stripe_charge_id?: string;
	invoiced_at?: string;
	created_at?: string;
	updated_at?: string;
	charge_amount_cents?: number;
	refund_amount_cents?: number;
	tax_amount_cents?: number;
	sale_amount_cents?: number;
	referral?: {
		id?: string;
		stripe_account_id?: string;
		stripe_customer_id?: string;
		conversion_state?: string;
		deactivated_at?: string | null;
		expires_at?: string;
		created_at?: string;
		updated_at?: string;
		customer?: {
			platform?: string;
			id?: string;
			name?: string;
			email?: string;
		};
	};
	visits?: number;
	link?: {
		id?: string;
		url?: string;
		token?: string;
		visitors?: number;
		leads?: number;
		conversions?: number;
	};
}
export interface IAffiliateLink {
	conversions?: number;
	id?: string;
	leads?: number;
	token?: string;
	url?: string;
	visitors?: number;
}
export interface IAffliliateReq {
	campaign_id?: string;
	email?: string;
	first_name?: string;
	last_name?: string;
	paypal_email?: string;
	receive_new_commission_notifications?: boolean;
	state?: string;
	stripe_customer_id?: string;
	token?: string;
	wise_email?: string;
}
export interface IAffiliateBody {
	first_name?: string;
	last_name?: string;
	email?: string;
	campaign?: IAffiliateCampaign;
	conversions?: number;
	created_at?: string;
	id?: string;
	leads?: number;
	links?: IAffiliateLink[];
	paypal_email?: string | null;
	state?: string;
	stripe_account_id?: string;
	stripe_customer_id?: string;
	updated_at?: string;
	visitors?: number;
}
export interface ICommissionAffiliate {
	id?: string;
	created_at?: string;
	updated_at?: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	paypal_email?: string;
	confirmed_at?: string;
	paypal_email_confirmed_at?: string;
	receive_new_commission_notifications?: boolean;
	sign_in_count?: number;
	unconfirmed_email?: string | null;
	stripe_customer_id?: string | null;
	stripe_account_id?: string | null;
	visitors?: number;
	leads?: number;
	conversions?: number;
	campaign?: IAffiliateCampaign;
}
export interface ICommissionObject {
	// need update
	id?: string;
	created_at?: string;
	updated_at?: string;
	amount?: number;
	currency?: string;
	due_at?: string;
	paid_at?: string | null;
	campaign?: IAffiliateCampaign;
	sale?: IAffiliateSale;
	affiliate: ICommissionAffiliate;
}

export interface IReferralObject {
	id?: string;
	link?: IAffiliateLink;
	visits?: number;
	customer?: {
		platform?: string;
		id?: string;
		name?: string;
		email?: string;
	};
	affiliate?: ICommissionAffiliate;
	created_at?: string;
	expires_at?: string;
	updated_at?: string;
	deactivated_at?: string | null;
	conversion_state?: string;
	stripe_account_id?: string;
	stripe_customer_id?: string;
}
