import * as Popper from '@popperjs/core'
import BaseComponent from "bootstrap/js/dist/base-component";
import EventHandler from "bootstrap/js/src/dom/event-handler";
import SelectorEngine from "bootstrap/js/src/dom/selector-engine";
import {isDisabled, noop} from "bootstrap/js/src/util";
import Manipulator from "bootstrap/js/src/dom/manipulator";

const NAME = 's-popup'
const DATA_KEY = 'bs.popup'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const TAB_KEY = 'Tab'

const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`

const CLASS_NAME_SHOW = 's-show'
const CLASS_NAME_HORIZONTAL_MENU = 's-menu-horizontal'
const CLASS_NAME_MENU_CLOSE = 's-menu-close'

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="s-popup"]:not(.disabled):not(:disabled)'
const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE}.${CLASS_NAME_SHOW}`
const SELECTOR_POPUP = '.s-popup'
const SELECTOR_MENU = '.s-menu'
const SELECTOR_SUBMENU = '.s-submenu'

const PLACEMENT_BOTTOM = 'bottom-start'
const PLACEMENT_RIGHT = 'right-start'

class Popup extends BaseComponent {
    constructor(element, config) {
        super(element, config);

        this._popper = null
        this._popup = SelectorEngine.next(this._element, SELECTOR_POPUP)[0] ||
            SelectorEngine.prev(this._element, SELECTOR_POPUP)[0];

        this._inMenu = this._detectMenu();
    }

    static get NAME() {
        return NAME
    }

    _detectMenu() {
        return this._element.closest(SELECTOR_MENU) !== null
    }

    _isFirstSubmenu() {
        if (this._inMenu === false)
            return false;

        const submenu = SelectorEngine.parents(this._popup, SELECTOR_SUBMENU)[0];
        return !submenu;
    }

    _isHorizontalMenu()
    {
        if (this._inMenu === false)
            return false;

        const menu = SelectorEngine.parents(this._popup, SELECTOR_MENU)[0];
        if (menu == null)
            return false;

        return menu.classList.contains(CLASS_NAME_HORIZONTAL_MENU);
    }

    _isShown() {
        return this._popup.classList.contains(CLASS_NAME_SHOW);
    }

    isPopup() {
        if (this._inMenu === false)
            return false;

        if (this._isHorizontalMenu() === true)
            return true;

        const menu = SelectorEngine.parents(this._popup, SELECTOR_MENU)[0];
        if (menu == null)
            return false;

        return menu.classList.contains(CLASS_NAME_MENU_CLOSE);
    }

    show() {
        if (isDisabled(this._element) || this._isShown()) {
            return;
        }

        this._createPopper();
        this._popup.classList.add(CLASS_NAME_SHOW);
        this._element.classList.add(CLASS_NAME_SHOW);
    }

    hide() {
        if (isDisabled(this._element) || !this._isShown()) {
            return
        }

        const relatedTarget = {
            relatedTarget: this._element
        }

        this._completeHide(relatedTarget)
    }

    _completeHide(relatedTarget) {
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE, relatedTarget)
        if (hideEvent.defaultPrevented) {
            return
        }

        // If this is a touch-enabled device we remove the extra empty mouseover listeners we added for iOS support
        if ('ontouchstart' in document.documentElement) {
            for (const element of [].concat(...document.body.children)) {
                EventHandler.off(element, 'mouseover', noop)
            }
        }

        if (this._popper) {
            this._popper.destroy()
        }

        this._popup.classList.remove(CLASS_NAME_SHOW)
        this._element.classList.remove(CLASS_NAME_SHOW)
        Manipulator.removeDataAttribute(this._popup, 'popper')
        EventHandler.trigger(this._element, EVENT_HIDDEN, relatedTarget)

        // Explicitly return focus to the trigger element
        this._element.focus()
    }

    toggle() {
        return this._isShown() ? this.hide() : this.show();
    }

    dispose() {
        if (this._popper) {
            this._popper.destroy()
        }

        super.dispose()
    }

    _createPopper() {
        let referenceElement = this._element
        const popperConfig = this._getPopperConfig();
        this._popper = Popper.createPopper(referenceElement, this._popup, popperConfig);
    }

    _getPlacement() {
        if (this._isHorizontalMenu() === true)
        {
            return this._isFirstSubmenu() === true ? PLACEMENT_BOTTOM : PLACEMENT_RIGHT;
        }

        return PLACEMENT_RIGHT;
    }

    _getOffset() {
        return [0, 0];
    }

    _getPopperConfig() {
        let defaultPopperConfig = {
            placement: this._getPlacement(),
            modifiers: [{
                name: 'preventOverflow',
                options: {
                    boundary: this._config.boundary
                }
            },
                {
                    name: 'offset',
                    options: {
                        offset: this._getOffset()
                    }
                }]
        }

        // Disable Popper if we have a static display or Dropdown is in Navbar
        console.log(this.isPopup());
        if (this.isPopup()===false) {
            Manipulator.setDataAttribute(this._popup, 'popper', 'static') // TODO: v6 remove
            defaultPopperConfig.modifiers = [{
                name: 'applyStyles',
                enabled: false
            }]
        }

        return defaultPopperConfig;
    }

    static clearPopups(event) {

        const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);

        for (const toggle of openToggles) {
            const context = Popup.getInstance(toggle)
            if (!context || context.isPopup() === false) {
                continue;
            }

            const composedPath = event.composedPath();
            const isPopupTarget = composedPath.includes(context._popup)
            if (composedPath.includes(context._element) || isPopupTarget) {
                continue;
            }

            const relatedTarget = {relatedTarget: context._element}

            if (event.type === 'click') {
                relatedTarget.clickEvent = event
            }

            context._completeHide(relatedTarget)
        }
    }
}

EventHandler.on(document, EVENT_CLICK_DATA_API, Popup.clearPopups)
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    event.preventDefault();
    Popup.getOrCreateInstance(this).toggle();
});

export default Popup;