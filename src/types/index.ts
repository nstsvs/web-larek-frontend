export interface IProduct {
	id: string;
	title: string;
	description?: string;
	price: number;
	image: string;
}

export interface IBasket {
	id: string;
	title: string;
	price: number;
	total: number;
}

export interface IAppState {
	catalog: IProduct[];
	basket: string[];
	order: IOrderForm | null;
}

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	paymentMethod: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}
