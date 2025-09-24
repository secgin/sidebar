import BaseComponent from "bootstrap/js/dist/base-component";
import EventHandler from "bootstrap/js/src/dom/event-handler";
import SelectorEngine from "bootstrap/js/src/dom/selector-engine";

const NAME = 's-menu';
const DATA_KEY = 'bs.menu';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api'

const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const CLASS_NAME_CLOSE = 's-menu-close';
const CLASS_NAME_HORIZONTAL = 's-menu-horizontal';
const CLASS_NAME_SUBMENU_OPEN = 's-submenu-open';
const CLASS_NAME_SUBMENU_POPUP = 's-submenu-popup';

const SELECTOR_MENU = '.s-menu';
const SELECTOR_SUBMENU_TOGGLE = '.s-submenu-toggle';

const PLACEMENT_BOTTOM = 'bottom-start';
const PLACEMENT_RIGHT = 'left-start';

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

    toggleSubMenu(element) {
        const liElement = SelectorEngine.parents(element, 'li')[0];

        const parentUl = liElement.parentElement;
        if (parentUl) {
            const openItems = SelectorEngine.find(`.${CLASS_NAME_SUBMENU_OPEN}`, parentUl);
            for (const item of openItems) {
                if (item !== liElement && (this.isPopup() || item.classList.contains(CLASS_NAME_SUBMENU_POPUP))) {
                    item.classList.remove(CLASS_NAME_SUBMENU_OPEN);
                }
            }
        }

        liElement.classList.toggle(CLASS_NAME_SUBMENU_OPEN);
    }

    closeAllDropdowns() {
        const openItems = SelectorEngine.find(`.${CLASS_NAME_SUBMENU_OPEN}`, this._element);
        for (const item of openItems) {
            if (this.isPopup() || item.classList.contains(CLASS_NAME_SUBMENU_POPUP)) {
                item.classList.remove(CLASS_NAME_SUBMENU_OPEN);
            }
        }
    }

    static create(element, config = {}) {
        const menuEl = SelectorEngine.parents(element, SELECTOR_MENU)[0];
        return Menu.getOrCreateInstance(menuEl, config);
    }
}

/*EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_SUBMENU_TOGGLE, function (event) {
    Menu.create(this).toggleSubMenu(this);
});

EventHandler.on(document, EVENT_CLICK_DATA_API, (event) => {
    const menus = SelectorEngine.find(SELECTOR_MENU);

    for (const item of menus) {
        const menuInstance = Menu.getInstance(item);
        if (!menuInstance) continue;

        if (!item.contains(event.target)) {
            menuInstance.closeAllDropdowns();
        }
    }
});*/