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
import { AppEvents } from '../utils/enums';

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
		this.emitChanges(AppEvents.BasketChange);
	}

	removeFromBasket(product: IProduct) {
		this.basket = this.basket.filter((item) => item.id !== product.id);
		this.emitChanges(AppEvents.BasketChange);
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges(AppEvents.BasketChange);
	}

	getTotal(): number {
		return this.basket.reduce((sum, item) => sum + item.price, 0);
	}

	setCatalog(products: IProduct[]) {
		this.catalog = products;
		this.emitChanges(AppEvents.ItemsChange, {
			catalog: this.catalog
		});
	}

	setPreview(product: IProduct) {
		this.preview = product.id;
		this.emitChanges(AppEvents.PreviewChange, product);
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
			this.events.emit(AppEvents.OrderReady, this.order);
		}
	}

	setContactsField(field: keyof IOrderContacts, value: string) {
		this.order[field] = value;
		if (this.validateOrderContacts()) {
			this.events.emit(AppEvents.OrderReady, this.order);
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
		this.events.emit(AppEvents.AddressErrorsChange, this.formErrors);
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
		this.events.emit(AppEvents.ContactsErrorsChange, this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
