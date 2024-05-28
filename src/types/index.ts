export interface IWebLarekAPI {
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export interface IAppState {
	catalog: IProduct[];
	basket: string[];
	order: IOrderForm | null;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IModal {
	content: HTMLElement;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IProduct {
	id?: string;
	title: string;
	description?: string;
	image?: string;
	price: number | null;
	category?: string;
}

export interface ICard extends IProduct {
	buttonTitle?: string;
}

export interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

export interface IBasket {
	id: string;
	title: string;
	price: number | null;
	total: number;
	items: string[];
}

export type PaymentMethod = 'cash' | 'card';

export interface IOrderAddress {
	payment: string;
	address: string;
}

export interface IOrderContacts {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderAddress, IOrderContacts {
	total: number;
	items: string[];
}

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: string;
	buttons: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface IOrderResult {
	id: string;
	total: number;
}
