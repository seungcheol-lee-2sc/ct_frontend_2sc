export interface IGetSession {
	sessionId: string;
}

export interface IProduct {
	description: string;
	productId: string;
	price: string;
	name: string;
	priceId: string;
	transactions: string;
}

export interface IPaymentHistory {
	id: number;
	isPaid: boolean;
	paidAmount: number;
	paymentDate: string;
	paymentId: string;
	paymentInitiatedDate: string;
	stripeCustomerId: string;
	stripePriceId: string;
	stripeProductId: string;
	subscriptionId: string | null;
	taxYear: string;
	transactionLimit: number;
}
