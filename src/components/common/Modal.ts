import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { IModal } from '../../types';

export class Modal extends Component<IModal> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('mousedown', this.close.bind(this));
		this.container.addEventListener('mousedown', this.close.bind(this));
		this._content.addEventListener('mousedown', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.toggleClass(this.container, 'modal_active', true);
		document.addEventListener('keydown', this._handleEscape.bind(this));
		this.events.emit('modal:open');
	}

	close() {
		this.toggleClass(this.container, 'modal_active', false);
		document.removeEventListener('keydown', this._handleEscape.bind(this));
		this.content = null;
		this.events.emit('modal:close');
	}

	private _handleEscape(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			this.close();
		}
	}

	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}