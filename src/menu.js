import BaseComponent from "bootstrap/js/dist/base-component";
import EventHandler from "bootstrap/js/src/dom/event-handler";
import SelectorEngine from "bootstrap/js/src/dom/selector-engine";
import Collapse from "bootstrap/js/src/collapse";

const NAME = 's-menu';
const DATA_KEY = 'bs.menu';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api'

const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const CLASS_NAME_CLOSE = 's-menu-close';
const CLASS_NAME_SUBMENU_OPEN = 's-menu-open';
const CLASS_NAME_SUBMENU_POPUP = 's-menu-popup';

const SELECTOR_MENU = '.s-menu';
const SELECTOR_SUBMENU_TOGGLE = '.s-submenu-toggle';

class Menu extends BaseComponent {
    constructor(element, config) {
        super(element, config);
    }

    static get NAME() {
        return NAME
    }

    toggleSubMenu(element) {
        const liElement = SelectorEngine.parents(dropdownElement, 'li')[0];
        const isClosed = this._element.classList.contains(CLASS_NAME_CLOSE);

        const parentUl = liElement.parentElement;
        if (parentUl) {
            const openItems = SelectorEngine.find(`.${CLASS_NAME_SUBMENU_OPEN}`, parentUl);
            for (const item of openItems) {
                if (item !== liElement && (isClosed || item.classList.contains(CLASS_NAME_SUB_MENU_POPUP))) {
                    item.classList.remove(CLASS_NAME_SUB_MENU_OPEN);
                    const btn = SelectorEngine.findOne(`.${CLASS_NAME_DROPDOWN_ROTATE}`, item);
                    if (btn) btn.classList.remove(CLASS_NAME_DROPDOWN_ROTATE);
                }
            }
        }

        dropdownElement.classList.toggle(CLASS_NAME_DROPDOWN_ROTATE);
        liElement.classList.toggle(CLASS_NAME_SUB_MENU_OPEN);
    }

    static create(element, config = {}) {
        const menuEl = SelectorEngine.parents(element, SELECTOR_MENU)[0];
        return Menu.getOrCreateInstance(menuEl, config);
    }
}

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_SUBMENU_TOGGLE, function (event) {
    event.preventDefault();
    Menu.create(this).toggleSubMenu(this);
});