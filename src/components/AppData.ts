import { Model } from './base/Model';
import {
	IAppState,
	IProduct,
	IOrder,
	FormErrors,
	PaymentMethod,
	IOrderAddress,
	IOrderContacts,
} from '../types';

export type CatalogChangeEvent = {
	catalog: IProduct[]
};

export class AppState extends Model<IAppState> {
	basket: IProduct[] = [];
	catalog: IProduct[];
	order: IOrder = {
		email: '',
		phone: '',
		items: [],
		total: 0,
		payment: '',
		address: ''
	};
	preview: string | null;
	formErrors: FormErrors = {};

	getBasketItems(): IProduct[] {
		return this.basket
	}

	addToBasket(product: IProduct) {
		this.basket.push(product);
		this.emitChanges('basket:change');
	}

	removeFromBasket(product: IProduct) {
		this.basket = this.basket.filter((item) => item.id !== product.id);
		this.emitChanges('basket:change');
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges('basket:change');
	}

	getTotal(): number {
		return this.basket.reduce((a, c) => a + c.price, 0);
	}

	setCatalog(products: IProduct[]) {
		this.catalog = products;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(product: IProduct) {
		this.preview = product.id;
		this.emitChanges('preview:changed', product);
	}

	isProductInBasket(product: IProduct): boolean {
		return this.basket.some(basketItem => basketItem.id === product.id);
	}

	setOrder() {
		this.order.items = this.getBasketItems().map((product) => product.id);
		this.order.total = this.getTotal();
	}

	setPayment(itemPayment: PaymentMethod) {
		this.order.payment = itemPayment;
		this.validateOrderPaymentMethod();
	}

	setAddress(itemAddress: string) {
		this.order.address = itemAddress;
		this.validateOrderPaymentMethod();
	}

	setEmail(itemEmail: string): void {
		this.order.email = itemEmail;
		this.validateOrderContacts();
	}

	setPhone(itemPhone: string): void {
		this.order.phone = itemPhone;
		this.validateOrderContacts();
	}

	setOrderField(field: keyof IOrderAddress, value: string) {
		this.order[field] = value;
		if (this.validateOrderPaymentMethod()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactsField(field: keyof IOrderContacts, value: string) {
		this.order[field] = value;
		if (this.validateOrderContacts()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrderPaymentMethod() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Введите адрес доставки';
		}
		this.formErrors = errors;
		this.events.emit('addressErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateOrderContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Введите Email';
		}
		if (!this.order.phone) {
			errors.phone = 'Введите номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('contactsErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}