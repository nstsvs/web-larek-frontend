import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { WebLarekAPI } from './components/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { IOrderAddress, IOrderContacts, IProduct } from './types';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';
import { AppEvents } from './utils/enums';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new WebLarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => modal.close()
});

// Изменились элементы каталога
events.on<CatalogChangeEvent>(AppEvents.ItemsChanged, () => {
	page.catalog = appData.catalog.map(item => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit(AppEvents.CardSelected, item)
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});

	page.counter = appData.getBasketItems().length;
});

// Открытие карточки товара
events.on(AppEvents.CardSelected, (item: IProduct) => {
	appData.setPreview(item);
});

// Изменен открытый выбранный товар
events.on(AppEvents.PreviewChanged, (item: IProduct) => {
		const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				events.emit(AppEvents.CardBasket, item);
				card.button = appData.isProductInBasket(item)
					? 'Удалить из корзины'
					: 'В корзину';
			},
		});

	// Начальное состояние кнопки при открытии карточки
	card.button = appData.isProductInBasket(item)
		? 'Удалить из корзины'
		: 'В корзину';

		modal.render({
			content: card.render({
				id: item.id,
				title: item.title,
				image: item.image,
				price: item.price,
				category: item.category,
				description: item.description,
			})
		});
});

// Переключение кнопок в карточке
events.on(AppEvents.CardBasket, (item: IProduct) => {
	if (appData.basket.indexOf(item) === -1) {
		events.emit(AppEvents.BasketAdded, item);
	} else {
		events.emit(AppEvents.BasketRemoved, item);
	}
});

// Добавление товара в корзину
events.on(AppEvents.BasketAdded, (item: IProduct) => {
	appData.addToBasket(item);
});

// Удаление товара из корзины
events.on(AppEvents.BasketRemoved, (item: IProduct) => {
	appData.removeFromBasket(item);
});

// Размер корзины
events.on(AppEvents.BasketChanged, () => {
	page.counter = appData.basket.length;
});

// Открытие корзины
events.on(AppEvents.BasketOpened, () => {
	basket.total = appData.getTotal();
	modal.render({
		content: basket.render({
			price: appData.getTotal(),
		}),
	});
});

// Обновление корзины
events.on(AppEvents.BasketChanged, () => {
	basket.items = appData.basket.map((item) => {
		const card = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit(AppEvents.BasketRemoved, item);
			},
		});
		return card.render({
			title: item.title,
			price: item.price,
		});
	});

	basket.total = appData.getTotal();
});

// Открытие модального окна с адресом
events.on(AppEvents.OrderOpened, () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открытие модального окна с контактными данными
events.on(AppEvents.OrderSubmitted, () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

// Универсальный обработчик для изменений полей формы заказа
events.on(AppEvents.AddressChanged, (data: { field: keyof IOrderAddress; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Универсальный обработчик для изменений полей формы контактов
events.on(AppEvents.ContactsChanged, (data: { field: keyof IOrderContacts; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Отображение ошибок полей форм
events.on(AppEvents.AddressErrorsChanged, (errors: Partial<IOrderAddress>) => {
	const { address, payment } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on(AppEvents.ContactsErrorsChanged, (errors: Partial<IOrderContacts>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Отправка заказа на сервер
events.on(AppEvents.ContactsSubmitted, () => {
	appData.setOrder();
	api
		.orderProducts(appData.order)
		.then((res) => {
			appData.clearBasket();
			page.counter = appData.basket.length;
			modal.render({
				content: success.render({
					total: appData.getTotal(),
				}),
			});
			events.emit(AppEvents.OrderSuccess, res);
		})
		.catch((err) => {
			console.error(err);
		});
});

// Блокируем прокрутку страницы если открыта модалка
events.on(AppEvents.ModalOpened, () => {
	page.locked = true;
});

// ... и разблокируем
events.on(AppEvents.ModalClosed, () => {
	page.locked = false;
});

// Получаем товары с сервера
api.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
