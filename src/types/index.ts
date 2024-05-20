export interface IProduct {
	id: string;
	title: string;
	description?: string;
	image: string;
	price: number | null;
	category: string;
}

export interface IBasket {
	id: string;
	title: string;
	price: number | null;
	total: number;
	items: HTMLElement[];
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
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}
