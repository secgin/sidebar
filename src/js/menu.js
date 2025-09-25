import BaseComponent from "bootstrap/js/dist/base-component";

const NAME = 's-menu';
const DATA_KEY = 'bs.menu';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api'

const CLASS_NAME_CLOSE = 's-menu-close';
const CLASS_NAME_HORIZONTAL = 's-menu-horizontal';

class Menu extends BaseComponent {
    constructor(element, config) {
        super(element, config);
    }

    static get NAME() {
        return NAME
    }

    isPopup() {
        return this._element.classList.contains(CLASS_NAME_CLOSE) || this._element.classList.contains(CLASS_NAME_HORIZONTAL);
    }

    open() {
        this._element.classList.remove(CLASS_NAME_CLOSE);
    }

    close() {
        this._element.classList.add(CLASS_NAME_CLOSE);
    }

    setHorizontal(isHorizontal = true) {
        if (isHorizontal === true)
            this._element.classList.add(CLASS_NAME_HORIZONTAL);
        else
            this._element.classList.remove(CLASS_NAME_HORIZONTAL);
    }

    static createOrInstance(element) {
        return Menu.getOrCreateInstance(element);
    }
}

export default Menu;