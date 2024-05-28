# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Архитектура приложения
В приложении реализован функционал, благодаря которому пользователь имеет возможность оформить заказ:
выбрать товар, положить его в корзину, оплатить и ввести свои данные для доставки.
Процесс включает в себя: главный экран со списком карточек товара, попап карточки, попап корзины, попап форм и попап с информацией об успешном оформлении заказа.\
При проектировании архитектуры приложения был применен Событийно Ориентированный Подход (СОП).

## Об архитектуре
Взаимодействия внутри приложения происходят через события.
Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения,
а также вычислениями между этой передачей, и еще они меняют значения в моделях.

Код приложения разделен на слои согласно парадигме MVP:
- слой данных, отвечает за хранение и изменение данных (**Model**),
- слой представления, отвечает за отображение данных на странице (**View**),
- презентер, отвечает за связь представления и данных (**Presenter**).


## Слой данных

### 1. Интерфейс `IProduct`
Описывает структуру данных продукта в каталоге.

#### Поля:
- `id: string` - уникальный идентификатор продукта.
- `title: string` - название продукта.
- `description?: string` - необязательное описание продукта.
- `price: number` - цена продукта.
- `image: string` - URL изображения продукта.


### 2. Интерфейс `IBasket`
Описывает структуру данных элемента в корзине.

#### Поля:
- `id: string` - уникальный идентификатор продукта в корзине.
- `title: string` - название продукта.
- `price: number` - цена за единицу продукта.
- `total: number` - общая стоимость продукта в корзине.


### 3. Интерфейс `IAppState`
Описывает структуру глобального состояния приложения.

#### Поля:
- `catalog: IProduct[]` - массив продуктов, доступных в каталоге.
- `basket: string[]` - массив идентификаторов продуктов в корзине.
- `order: IOrderForm | null` - текущая форма заказа, если она была инициирована.


### 4. Интерфейс `IOrderForm`
Описывает структуру данных для формы оформления заказа.

#### Поля:
- `email: string` - электронная почта покупателя.
- `phone: string` - телефонный номер покупателя.
- `address: string` - адрес доставки.
- `payment: string` - метод оплаты (онлайн или при получении).


### 5. Интерфейс `IOrder`
Расширяет `IOrderForm`, включая список заказанных товаров.

#### Поля:
- `items: string[]` - массив идентификаторов заказанных товаров.


### 6. Интерфейс `IOrderResult`
Описывает результат оформления заказа.

#### Поля:
- `id: string` - уникальный идентификатор оформленного заказа.
- `total: number` - итоговая сумма заказа.


### 7. Базовый класс `Model<T>`
Абстрактная базовая модель, которая обеспечивает функционал для работы с данными и событиями в системе.

#### Конструктор
- `constructor(data: Partial<T>, protected events: IEvents)`:
  - `data: Partial<T>` - начальные данные модели, которые могут быть неполными.
  - `events: IEvents` - объект для управления событиями.

#### Методы:
- `emitChanges` - оповещает об изменениях в модели.
- `isModel` - статическая функция, предоставляющая возможность проверки, является ли объект экземпляром Model.


### 8. Класс `AppState`
Управляет глобальным состоянием приложения.

#### Методы и свойства:
- `addToBasket` - добавляет товар в корзину.
- `removeFromBasket` - удаляет товар из корзины.
- `clearBasket` - очищает корзину, удаляя все товары из заказа.
- `isProductInBasket` - проверяет находится ли уже товар в корзине.
- `getOrderTotal` - вычисляет общую сумму стоимости заказанных товаров.
- `setCatalog` - устанавливает и обновляет каталог товаров.
- `setPreview` - устанавливает товар для предварительного просмотра.
- `setOrderField` - устанавливает значение поля в форме заказа.
- `setOrderPaymentMethod` - передает данные о способе оплаты в заказ.
- `setPhone` - передает телефон пользователя в заказ.
- `setEmail` - передает email пользователя в заказ.
- `validateOrderPaymentMethod` - валидирует модальное окно со способами оплаты и адресом покупателя.
- `validateOrderContacts` - валидирует модальное окно с почтой и телефоном покупателя.


## Слой представления

### 1. Базовый класс `Component<T>`
Общий базовый класс для всех компонентов, управляющий элементами DOM. Дженерик `T` определяет тип данных, которыми управляет компонент.

#### Конструктор
- `constructor(protected readonly container: HTMLElement)`:
  - `container: HTMLElement` - защищённое свойство, содержит ссылку на DOM-элемент, который служит контейнером для компонента.

#### Методы:
- `toggleClass` - переключает наличие класса у элемента.
- `setText` - устанавливает текстовое содержимое элемента.
- `setDisabled` - устанавливает или снимает атрибут disabled у элемента.
- `setHidden` - скрывает элемент со страницы, применяя к нему стиль display: none.
- `setVisible` - показывает элемент, удаляя стиль display.
- `setImage` - устанавливает изображение и альтернативный текст для элемента <img>.
- `render` - сновной метод для рендеринга компонента, возвращает корневой DOM-элемент.


### 2. Класс `Page<T>`
Реализует отображение главного экрана со списком товаров, расширяет общий функционал абстрактного базового класса `Component<T>`.

#### Конструктор
- `constructor(container: HTMLElement, protected events: IEvents)`:
  - `container: HTMLElement` - элемент DOM, который служит контейнером для главной страницы.
  - `events: IEvents` - объект, управляющий событиями внутри страницы, использует экземпляр класса `EventEmitter`.

#### Методы:
- `set counter` - устанавливает значение счетчика.
- `set catalog` - заменяет содержимое _catalog на переданные HTML-элементы.
- `set locked` - управляет блокировкой страницы. Добавляет или удаляет класс элемента в зависимости от значения value.


### 3. Класс `Modal<T>`
Реализует управление модальными окнами, расширяет функционал класса `Component<T>`.

#### Конструктор
- `constructor(container: HTMLElement, protected events: IEvents)`:
  - `container: HTMLElement` - элемент DOM, в который встроено модальное окно.
  - `events: IEvents` - объект, управляющий событиями внутри модального окна.

#### Методы:
- `set content` - устанавливает содержимое контентной области модального окна.
- `open` - открывает модальное окно.
- `close` - закрывает модальное окно.
- `_toggleModal` - переключает модальное окно.
- `_handleEscape` - закрывает модальное окно по нажатию на Esc.
- `render` - рендерит модальное окно с данными, автоматически открывая его после рендеринга.


### 4. Класс `Card<T>`
Реализует отображение карточки товара, расширяет функционал класса `Component<T>`.

#### Конструктор
- `constructor(protected blockName: string, container: HTMLElement, events: ICardActions)`:
  - `container: HTMLElement` - элемент DOM, в который встроена карточка.
  - `events: ICardActions` - объект событий, используется для управления действиями пользователя в карточке товара.
  - `blockName: string` - защищенное свойство, устанавливает имя блока.

#### Методы:
- `set id` - устанавливает уникальный идентификатор для карточки.
- `get id` - возвращает уникальный идентификатор карточки.
- `set title` - устанавливает название товара.
- `get title` - возвращает название товара.
- `set image` - устанавливает изображение товара.
- `set description` - устанавливает описание товара, принимая строку или массив строк.
- `set buttonText` - устанавливает текст для кнопки.
- `set price` - устанавливает стоимость товара.
- `get price` - возвращает стоимость товара.
- `set category` - устанавливает категорию товара.


### 5. Класс `Basket<T>`
Реализует отображение карточки товара в корзине покупателя. Класс расширяет функционал базового класса `Component<T>`.

#### Конструктор
- `constructor(container: HTMLElement, protected events: EventEmitter)`:
  - `container: HTMLElement` - DOM элемент, который служит контейнером для карточки товара в корзине.
  - `events: EventEmitter` - объект для управления событиями внутри карточки.

#### Методы:
- `set items` - принимает массив элементов HTMLElement[]. Если массив не пуст, заменяет содержимое списка _list этими элементами. Если пуст, отображает сообщение "Корзина пуста".
- `set total` - устанавливает текстовое содержимое элемента _total и форматированное число.
- `toggleButton` - переключает заблокированную кнопку.


### 6. Класс `Form<T>`
Управляет закрытием и открытием формы и ее валидацией. Класс расширяет функционал базового класса `Component<T>`.

#### Конструктор
- `constructor(protected container: HTMLFormElement, protected events: IEvents)`:
  - `container: HTMLFormElement` - DOM элемент, который служит контейнером для формы.
  - `events: IEvents` - защищенный объект для управления событиями внутри формы.

#### Методы:
- `onInputChange` - вызывает событие при изменении поля формы.
- `set valid` - включает или отключает кнопку отправки формы.
- `set errors` - устанавливает текст ошибок в форме.
- `render` - обновляет визуальное состояние и данные формы, используя state.


### 7. Класс `Order<T>`
Расширяет класс `Form<IOrderForm>` для управления формой заказа с выбором способа оплаты и вводом адреса покупателя.

#### Конструктор
- `constructor(container: HTMLFormElement, events: IEvents)`:
  - `container: HTMLFormElement` - DOM элемент, который служит контейнером для формы.
  - `events: IEvents` - защищенный объект для управления событиями внутри формы.

##### Методы:
- `set class` - устанавливает класс для кнопки.
- `set address` - устанавливает адрес в соответствующее поле формы.


### 8. Класс `Success<T>`
Расширяет функционал класса `Component<T>`, который отображает успешное завершение заказа.

#### Конструктор
- `constructor(container: HTMLElement, actions: ISuccessActions)`:
  - `container: HTMLFormElement` - DOM элемент, который служит контейнером для формы.
  - `actions: ISuccessActions` - объект с действиями, включающими метод onClick, который вызывается при клике на элемент закрытия.


## Слой коммуникации

### 1. Класс `Api`
Управляет сетевыми запросами к серверу.

#### Конструктор
- `constructor(baseUrl: string, options: RequestInit = {})`:
  - `baseUrl типа string` - базовый адрес API.
  - `options типа RequestInit` - объект с опциями запросов.

#### Методы
- `get` - выполняет GET запрос к серверу по uri.
- `post` - выполняет POST запрос к серверу по uri, отправляя данные `data`.
- `_request` - универсальный метод запроса с проверкой ответа.


### 2. Класс `WebLarekApi`
Расширяет базовый класс Api, имплементируется интерфейсом IWebLarekAPI.

#### Конструктор
- `constructor(cdn: string, baseUrl: string, options?: RequestInit)` - не принимает аргументы, инициализирует новый экземпляр карты _events, которая предназначена для хранения и управления подписками на события.
  - `cdn` - строка, содержащая базовый URL для CDN, используемый для путей к изображениям.
  - `baseUrl` - базовый URL API.
  - `options` - дополнительные настройки запросов.

#### Методы:
- `getProductList` - получает список товаров с сервера.
- `getProductItem` - запрашивает данные конкретного товара с сервера по его идентификатору.
- `orderProducts` - отправляет информацию о заказе лотов через POST и возвращает результат выполнения заказа.


### 3. Класс `EventEmitter`
Управляет событиями в приложении.

#### Конструктор
- `constructor()` - не принимает аргументы, инициализирует новый экземпляр карты _events, которая предназначена для хранения и управления подписками на события.

#### Методы
- `on` - подписывается на событие.
- `emit` - инициирует событие с данными.
- `off` - отписывается от события.
- `onAll` - слушает все события.
- `offAll` - сбрасывает все обработчики.
- `trigger` - создает коллбек триггер, генерирующий событие при вызове.
