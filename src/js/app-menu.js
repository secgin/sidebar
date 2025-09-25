import BaseComponent from "bootstrap/js/dist/base-component";
import EventHandler from "bootstrap/js/src/dom/event-handler";
import SelectorEngine from "bootstrap/js/src/dom/selector-engine";
import Menu from "./menu";

const NAME = 's-app-menu';
const DATA_KEY = 'bs.app-menu';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api'

const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_CHANGE_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const CLASS_NAME_CLOSE = 's-close';
const CLASS_NAME_HORIZONTAL = 's-horizontal';

const SELECTOR_APP_MENU = '.s-app-menu';
const SELECTOR_MENU = '.s-menu';
const SELECTOR_TOGGLE_CHECK = '[name="appMenuMinToggle"]';
const SELECTOR_HORIZONTAL_TOGGLE_CHECK = '[name="appMenuHorizontalToggle"]';


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

        const menuEl = SelectorEngine.findOne(SELECTOR_MENU, this._element);
        this._menu = Menu.createOrInstance(menuEl);

        const toggleCheck = SelectorEngine.findOne(SELECTOR_TOGGLE_CHECK, this._element);
        if (toggleCheck)
            toggleCheck.checked = savedState === 'closed';

        if (savedState === 'closed') {
            this.close();
        }

        setTimeout(() => {
            this._element.classList.add('ready');
        }, 50);
    }

    open() {
        this._element.classList.remove(CLASS_NAME_CLOSE);
        localStorage.setItem(STORAGE_KEY, 'open');
        this._menu.open();
    }

    close() {
        this._element.classList.add(CLASS_NAME_CLOSE);
        localStorage.setItem(STORAGE_KEY, 'closed');
        this._menu.close();
    }

    appMenuToggle() {
        const isClosed = this._element.classList.contains(CLASS_NAME_CLOSE);
        if (isClosed) {
            this.open();
        } else {
            this.close();
        }
    }

    setHorizontal(isHorizontal = true) {
        if (isHorizontal === true)
            this._element.classList.add(CLASS_NAME_HORIZONTAL);
        else
            this._element.classList.remove(CLASS_NAME_HORIZONTAL);

        this._menu.setHorizontal(isHorizontal);
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

EventHandler.on(document, EVENT_CHANGE_DATA_API, SELECTOR_TOGGLE_CHECK, function (event) {
    if (this.checked === true)
        AppMenu.create(this).close();
    else
        AppMenu.create(this).open();
});

EventHandler.on(document, EVENT_CHANGE_DATA_API, SELECTOR_HORIZONTAL_TOGGLE_CHECK, function (event) {
    AppMenu.create(this).setHorizontal(this.checked);
});

export default AppMenu;