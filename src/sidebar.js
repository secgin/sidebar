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
const CLASS_NAME_SUB_MENU_OPEN = 'open';
const CLASS_NAME_DROPDOWN_ROTATE = 'rotate';

const SELECTOR_SIDEBAR = '[data-bs-sidebar]';
const SELECTOR_TOGGLE = '.sidebar-toggle';
const SELECTOR_DROPDOWN = '.sidebar-dropdown';

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
        const subMenuElement = SelectorEngine.next(dropdownElement, 'ul')[0];
        const liElement = SelectorEngine.parents(dropdownElement, 'li')[0];
        const isClosed = this._element.classList.contains(CLASS_NAME_CLOSE);

        if (isClosed) {
            // Sadece close modunda accordion çalışsın
            const parentUl = liElement.parentElement;
            if (parentUl) {
                // Aynı seviyedeki açık menüleri kapat
                const openItems = SelectorEngine.find(`.${CLASS_NAME_SUB_MENU_OPEN}`, parentUl);
                for (const item of openItems) {
                    if (item !== liElement) {
                        item.classList.remove(CLASS_NAME_SUB_MENU_OPEN);
                        const btn = SelectorEngine.findOne(`.${CLASS_NAME_DROPDOWN_ROTATE}`, item);
                        if (btn) btn.classList.remove(CLASS_NAME_DROPDOWN_ROTATE);
                    }
                }
            }
        }

        // Seçilen menüyü aç/kapat
        dropdownElement.classList.toggle(CLASS_NAME_DROPDOWN_ROTATE);
        liElement.classList.toggle(CLASS_NAME_SUB_MENU_OPEN);
    }

    closeAllDropdowns() {
        const openItems = SelectorEngine.find(`.${CLASS_NAME_SUB_MENU_OPEN}`, this._element);
        for (const item of openItems) {
            item.classList.remove(CLASS_NAME_SUB_MENU_OPEN);
            const btn = SelectorEngine.findOne(`.${CLASS_NAME_DROPDOWN_ROTATE}`, item);
            if (btn) btn.classList.remove(CLASS_NAME_DROPDOWN_ROTATE);
        }
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

EventHandler.on(document, EVENT_CLICK_DATA_API, (event) => {
    const sidebar = SelectorEngine.findOne(SELECTOR_SIDEBAR);
    if (!sidebar) return;

    const sidebarInstance = Sidebar.getInstance(sidebar);
    if (!sidebarInstance) return;

    const isClosed = sidebar.classList.contains(CLASS_NAME_CLOSE);
    if (!isClosed) return; // sadece close modunda çalışsın

    if (!sidebar.contains(event.target)) {
        sidebarInstance.closeAllDropdowns();
    }
});

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DROPDOWN, function (event) {
    event.preventDefault();
    Sidebar.create(this).dropdownToggle(this);
});

export default Sidebar;