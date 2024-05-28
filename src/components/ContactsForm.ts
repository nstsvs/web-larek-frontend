import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/Events';

export class ContactsForm extends Form<IOrderForm> {
	protected _phone: HTMLInputElement;
	protected _email: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phone = container.elements.namedItem('phone') as HTMLInputElement;
		this._email = container.elements.namedItem('email') as HTMLInputElement;
	}

	set phone(value: string) {
		this._phone.value = value;
	}

	set email(value: string) {
		this._email.value = value;
	}
}
