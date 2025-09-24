import BaseComponent from "bootstrap/js/dist/base-component";
import EventHandler from "bootstrap/js/src/dom/event-handler";
import SelectorEngine from "bootstrap/js/src/dom/selector-engine";

const NAME = 's-app-menu';
const DATA_KEY = 'bs.app-menu';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api'

const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const CLASS_NAME_CLOSE = 's-close';

const SELECTOR_APP_MENU = '.s-app-menu';
const SELECTOR_TOGGLE = '.s-app-menu-toggle';
const SELECTOR_DATA_POPUP_TOGGLE = '[data-bs-toggle="s-popup"]'


const STORAGE_KEY = 's-app-menu-state';

class AppMenu extends BaseComponent {

    constructor(element, config) {
        super(element, config);
        this.initApMenuState();
    }

    static get NAME() {
        return NAME
    }

    initApMenuState() {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState === 'closed') {
            this._element.classList.add(CLASS_NAME_CLOSE);
        }

        setTimeout(() => {
            this._element.classList.add('ready');
        }, 50);
    }

    appMenuToggle() {
        this._element.classList.toggle(CLASS_NAME_CLOSE);

        const isClosed = this._element.classList.contains(CLASS_NAME_CLOSE);
        if (isClosed)
            this.closeAllDropdowns();

        localStorage.setItem(STORAGE_KEY, isClosed ? 'closed' : 'open');
    }

    closeAllDropdowns() {
        const openItems = SelectorEngine.find(SELECTOR_DATA_POPUP_TOGGLE, this._element);
        for (const item of openItems) {
            /*if (item.classList.contains(CLASS_NAME_SUB_MENU_POPUP)) {
                item.classList.remove(CLASS_NAME_SUB_MENU_OPEN);
                const btn = SelectorEngine.findOne(`.${CLASS_NAME_DROPDOWN_ROTATE}`, item);
                if (btn) btn.classList.remove(CLASS_NAME_DROPDOWN_ROTATE);
            }*/
        }
    }

    static create(element, config = {}) {
        const appMenu = SelectorEngine.parents(element, SELECTOR_APP_MENU)[0];
        return AppMenu.getOrCreateInstance(appMenu, config);
    }
}

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    for (const element of SelectorEngine.find(SELECTOR_APP_MENU)) {
        AppMenu.getOrCreateInstance(element)
    }
});

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_TOGGLE, function (event) {
    event.preventDefault();
    AppMenu.create(this).appMenuToggle();
});

export default AppMenu;