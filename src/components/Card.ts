import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { categoryColorSettings } from '../utils/constants';
import { ICard, IProductActions } from '../types';

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;

	constructor(protected blockName: string, container: HTMLElement, actions?: IProductActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = container.querySelector(`.${blockName}__image`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._category = container.querySelector(`.${blockName}__category`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('mousedown', actions.onClick);
			} else {
				container.addEventListener('mousedown', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this._button, true);
			this.button = 'Нельзя купить';
		} else {
			this.setText(this._price, `${value} синапсов`);
			this.setDisabled(this._button, false);
		}
	}

	get price(): number | null {
		return Number(this._price.textContent);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(categoryColorSettings[value]);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set button(value: string) {
		this.setText(this._button, value)
	}
}
