import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/Events';
import { ensureAllElements } from '../utils/utils';

export class Order extends Form<IOrderForm> {
	protected _address: HTMLInputElement;
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._address = container.elements.namedItem('address') as HTMLInputElement;
		this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

		this._buttons.forEach(button => {
			button.addEventListener('click', () => {
				this.class = button.name;
			});
		})
	}

	set class(name: string) {
		this._buttons.forEach(button => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
		// Обновляем метод оплаты в форме
		this.onInputChange('payment', name);
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}
