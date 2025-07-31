import BaseComponent from "bootstrap/js/dist/base-component";
import EventHandler from "bootstrap/js/src/dom/event-handler";
import SelectorEngine from "bootstrap/js/src/dom/selector-engine";


const NAME = 'sidebar';
const DATA_KEY = 'bs.sidebar';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api'

const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const CLASS_NAME_CLOSE = 'close';
const CLASS_NAME_SUB_MENU_SHOW = 'show';
const CLASS_NAME_DROPDOWN_ROTATE = 'rotate';

const SELECTOR_SIDEBAR = '[data-bs-sidebar]';
const SELECTOR_TOGGLE = '.sidebar-toggle';
const SELECTOR_DROPDOWN = '.sidebar-dropdown';
const SELECTOR_SUB_MENU = '.sidebar-sub-nav';

const STORAGE_KEY = 's-sidebar-state';

class Sidebar extends BaseComponent {

    constructor(element, config) {
        super(element, config);
        this.initSidebarState();
    }

    static get NAME() {
        return NAME
    }

    initSidebarState() {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState === 'closed') {
            this._element.classList.add(CLASS_NAME_CLOSE);
        }
        
        setTimeout(() => {
            this._element.classList.add('ready');
        }, 50);
    }

    sidebarToggle() {
        this._element.classList.toggle(CLASS_NAME_CLOSE);

        const isClosed = this._element.classList.contains(CLASS_NAME_CLOSE);
        localStorage.setItem(STORAGE_KEY, isClosed ? 'closed' : 'open');
    }

    dropdownToggle(dropdownElement) {
        const subMenuElement = SelectorEngine.next(dropdownElement, SELECTOR_SUB_MENU)[0];

        dropdownElement.classList.toggle(CLASS_NAME_DROPDOWN_ROTATE);
        subMenuElement.classList.toggle(CLASS_NAME_SUB_MENU_SHOW);
    }

    static create(element, config = {}) {
        const sidebarEl = SelectorEngine.parents(element, SELECTOR_SIDEBAR)[0];
        return Sidebar.getOrCreateInstance(sidebarEl, config);
    }
}

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    for (const element of SelectorEngine.find(SELECTOR_SIDEBAR)) {
        Sidebar.getOrCreateInstance(element)
    }
});

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_TOGGLE, function (event) {
    event.preventDefault();
    Sidebar.create(this).sidebarToggle();
});

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DROPDOWN, function (event) {
    event.preventDefault();
    Sidebar.create(this).dropdownToggle(this);
});

export default Sidebar;