/*!
  * Bootstrap v5.2.1 (https://getbootstrap.com/)
  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
import * as Popper from '@popperjs/core';

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): util/index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
const MAX_UID = 1000000;
const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = 'transitionend'; // Shout-out Angus Croll (https://goo.gl/pxwQGp)

const toType = object => {
  if (object === null || object === undefined) {
    return `${object}`;
  }

  return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
};
/**
 * Public Util API
 */


const getUID = prefix => {
  do {
    prefix += Math.floor(Math.random() * MAX_UID);
  } while (document.getElementById(prefix));

  return prefix;
};

const getSelector = element => {
  let selector = element.getAttribute('data-bs-target');

  if (!selector || selector === '#') {
    let hrefAttribute = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    // `document.querySelector` will rightfully complain it is invalid.
    // See https://github.com/twbs/bootstrap/issues/32273

    if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
      return null;
    } // Just in case some CMS puts out a full URL with the anchor appended


    if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
      hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
    }

    selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
  }

  return selector;
};

const getSelectorFromElement = element => {
  const selector = getSelector(element);

  if (selector) {
    return document.querySelector(selector) ? selector : null;
  }

  return null;
};

const getElementFromSelector = element => {
  const selector = getSelector(element);
  return selector ? document.querySelector(selector) : null;
};

const getTransitionDurationFromElement = element => {
  if (!element) {
    return 0;
  } // Get transition-duration of the element


  let {
    transitionDuration,
    transitionDelay
  } = window.getComputedStyle(element);
  const floatTransitionDuration = Number.parseFloat(transitionDuration);
  const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0;
  } // If multiple durations are defined, take the first


  transitionDuration = transitionDuration.split(',')[0];
  transitionDelay = transitionDelay.split(',')[0];
  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
};

const triggerTransitionEnd = element => {
  element.dispatchEvent(new Event(TRANSITION_END));
};

const isElement = object => {
  if (!object || typeof object !== 'object') {
    return false;
  }

  if (typeof object.jquery !== 'undefined') {
    object = object[0];
  }

  return typeof object.nodeType !== 'undefined';
};

const getElement = object => {
  // it's a jQuery object or a node element
  if (isElement(object)) {
    return object.jquery ? object[0] : object;
  }

  if (typeof object === 'string' && object.length > 0) {
    return document.querySelector(object);
  }

  return null;
};

const isVisible = element => {
  if (!isElement(element) || element.getClientRects().length === 0) {
    return false;
  }

  const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible'; // Handle `details` element as its content may falsie appear visible when it is closed

  const closedDetails = element.closest('details:not([open])');

  if (!closedDetails) {
    return elementIsVisible;
  }

  if (closedDetails !== element) {
    const summary = element.closest('summary');

    if (summary && summary.parentNode !== closedDetails) {
      return false;
    }

    if (summary === null) {
      return false;
    }
  }

  return elementIsVisible;
};

const isDisabled = element => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true;
  }

  if (element.classList.contains('disabled')) {
    return true;
  }

  if (typeof element.disabled !== 'undefined') {
    return element.disabled;
  }

  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
};

const findShadowRoot = element => {
  if (!document.documentElement.attachShadow) {
    return null;
  } // Can find the shadow root otherwise it'll return the document


  if (typeof element.getRootNode === 'function') {
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root : null;
  }

  if (element instanceof ShadowRoot) {
    return element;
  } // when we don't find a shadow root


  if (!element.parentNode) {
    return null;
  }

  return findShadowRoot(element.parentNode);
};

const noop = () => {};
/**
 * Trick to restart an element's animation
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */


const reflow = element => {
  element.offsetHeight; // eslint-disable-line no-unused-expressions
};

const getjQuery = () => {
  if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
    return window.jQuery;
  }

  return null;
};

const DOMContentLoadedCallbacks = [];

const onDOMContentLoaded = callback => {
  if (document.readyState === 'loading') {
    // add listener on the first call when the document is in loading state
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener('DOMContentLoaded', () => {
        for (const callback of DOMContentLoadedCallbacks) {
          callback();
        }
      });
    }

    DOMContentLoadedCallbacks.push(callback);
  } else {
    callback();
  }
};

const isRTL = () => document.documentElement.dir === 'rtl';

const defineJQueryPlugin = plugin => {
  onDOMContentLoaded(() => {
    const $ = getjQuery();
    /* istanbul ignore if */

    if ($) {
      const name = plugin.NAME;
      const JQUERY_NO_CONFLICT = $.fn[name];
      $.fn[name] = plugin.jQueryInterface;
      $.fn[name].Constructor = plugin;

      $.fn[name].noConflict = () => {
        $.fn[name] = JQUERY_NO_CONFLICT;
        return plugin.jQueryInterface;
      };
    }
  });
};

const execute = callback => {
  if (typeof callback === 'function') {
    callback();
  }
};

const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
  if (!waitForTransition) {
    execute(callback);
    return;
  }

  const durationPadding = 5;
  const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
  let called = false;

  const handler = ({
    target
  }) => {
    if (target !== transitionElement) {
      return;
    }

    called = true;
    transitionElement.removeEventListener(TRANSITION_END, handler);
    execute(callback);
  };

  transitionElement.addEventListener(TRANSITION_END, handler);
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement);
    }
  }, emulatedDuration);
};
/**
 * Return the previous/next element of a list.
 *
 * @param {array} list    The list of elements
 * @param activeElement   The active element
 * @param shouldGetNext   Choose to get next or previous element
 * @param isCycleAllowed
 * @return {Element|elem} The proper element
 */


const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
  const listLength = list.length;
  let index = list.indexOf(activeElement); // if the element does not exist in the list return an element
  // depending on the direction and if cycle is allowed

  if (index === -1) {
    return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
  }

  index += shouldGetNext ? 1 : -1;

  if (isCycleAllowed) {
    index = (index + listLength) % listLength;
  }

  return list[Math.max(0, Math.min(index, listLength - 1))];
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): dom/event-handler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage

let uidEvent = 1;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
};
const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
/**
 * Private methods
 */

function makeEventUid(element, uid) {
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}

function getElementEvents(element) {
  const uid = makeEventUid(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}

function bootstrapHandler(element, fn) {
  return function handler(event) {
    hydrateObj(event, {
      delegateTarget: element
    });

    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn);
    }

    return fn.apply(element, [event]);
  };
}

function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);

    for (let {
      target
    } = event; target && target !== this; target = target.parentNode) {
      for (const domElement of domElements) {
        if (domElement !== target) {
          continue;
        }

        hydrateObj(event, {
          delegateTarget: target
        });

        if (handler.oneOff) {
          EventHandler.off(element, event.type, selector, fn);
        }

        return fn.apply(target, [event]);
      }
    }
  };
}

function findHandler(events, callable, delegationSelector = null) {
  return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
}

function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
  const isDelegated = typeof handler === 'string'; // todo: tooltip passes `false` instead of selector, so we need to check

  const callable = isDelegated ? delegationFunction : handler || delegationFunction;
  let typeEvent = getTypeEvent(originalTypeEvent);

  if (!nativeEvents.has(typeEvent)) {
    typeEvent = originalTypeEvent;
  }

  return [isDelegated, callable, typeEvent];
}

function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return;
  }

  let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction); // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does

  if (originalTypeEvent in customEvents) {
    const wrapFunction = fn => {
      return function (event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
          return fn.call(this, event);
        }
      };
    };

    callable = wrapFunction(callable);
  }

  const events = getElementEvents(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);

  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff;
    return;
  }

  const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
  const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
  fn.delegationSelector = isDelegated ? handler : null;
  fn.callable = callable;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;
  element.addEventListener(typeEvent, fn, isDelegated);
}

function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);

  if (!fn) {
    return;
  }

  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}

function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};

  for (const handlerKey of Object.keys(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      const event = storeElementEvent[handlerKey];
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    }
  }
}

function getTypeEvent(event) {
  // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
  event = event.replace(stripNameRegex, '');
  return customEvents[event] || event;
}

const EventHandler = {
  on(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, false);
  },

  one(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, true);
  },

  off(element, originalTypeEvent, handler, delegationFunction) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }

    const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getElementEvents(element);
    const storeElementEvent = events[typeEvent] || {};
    const isNamespace = originalTypeEvent.startsWith('.');

    if (typeof callable !== 'undefined') {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!Object.keys(storeElementEvent).length) {
        return;
      }

      removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
      return;
    }

    if (isNamespace) {
      for (const elementEvent of Object.keys(events)) {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
      }
    }

    for (const keyHandlers of Object.keys(storeElementEvent)) {
      const handlerKey = keyHandlers.replace(stripUidRegex, '');

      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        const event = storeElementEvent[keyHandlers];
        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
      }
    }
  },

  trigger(element, event, args) {
    if (typeof event !== 'string' || !element) {
      return null;
    }

    const $ = getjQuery();
    const typeEvent = getTypeEvent(event);
    const inNamespace = event !== typeEvent;
    let jQueryEvent = null;
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;

    if (inNamespace && $) {
      jQueryEvent = $.Event(event, args);
      $(element).trigger(jQueryEvent);
      bubbles = !jQueryEvent.isPropagationStopped();
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
      defaultPrevented = jQueryEvent.isDefaultPrevented();
    }

    let evt = new Event(event, {
      bubbles,
      cancelable: true
    });
    evt = hydrateObj(evt, args);

    if (defaultPrevented) {
      evt.preventDefault();
    }

    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }

    if (evt.defaultPrevented && jQueryEvent) {
      jQueryEvent.preventDefault();
    }

    return evt;
  }

};

function hydrateObj(obj, meta) {
  for (const [key, value] of Object.entries(meta || {})) {
    try {
      obj[key] = value;
    } catch (_unused) {
      Object.defineProperty(obj, key, {
        configurable: true,

        get() {
          return value;
        }

      });
    }
  }

  return obj;
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): dom/data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */
const elementMap = new Map();
const Data = {
  set(element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, new Map());
    }

    const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
    // can be removed later when multiple key/instances are fine to be used

    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      // eslint-disable-next-line no-console
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
      return;
    }

    instanceMap.set(key, instance);
  },

  get(element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null;
    }

    return null;
  },

  remove(element, key) {
    if (!elementMap.has(element)) {
      return;
    }

    const instanceMap = elementMap.get(element);
    instanceMap.delete(key); // free up element references if there are no instances left for an element

    if (instanceMap.size === 0) {
      elementMap.delete(element);
    }
  }

};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
function normalizeData(value) {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (value === Number(value).toString()) {
    return Number(value);
  }

  if (value === '' || value === 'null') {
    return null;
  }

  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (_unused) {
    return value;
  }
}

function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
}

const Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
  },

  removeDataAttribute(element, key) {
    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
  },

  getDataAttributes(element) {
    if (!element) {
      return {};
    }

    const attributes = {};
    const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));

    for (const key of bsKeys) {
      let pureKey = key.replace(/^bs/, '');
      pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
      attributes[pureKey] = normalizeData(element.dataset[key]);
    }

    return attributes;
  },

  getDataAttribute(element, key) {
    return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
  }

};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): util/config.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Class definition
 */

class Config {
  // Getters
  static get Default() {
    return {};
  }

  static get DefaultType() {
    return {};
  }

  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!');
  }

  _getConfig(config) {
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);

    this._typeCheckConfig(config);

    return config;
  }

  _configAfterMerge(config) {
    return config;
  }

  _mergeConfigObj(config, element) {
    const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

    return { ...this.constructor.Default,
      ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
      ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
      ...(typeof config === 'object' ? config : {})
    };
  }

  _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
    for (const property of Object.keys(configTypes)) {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = isElement(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    }
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const VERSION = '5.2.1';
/**
 * Class definition
 */

class BaseComponent extends Config {
  constructor(element, config) {
    super();
    element = getElement(element);

    if (!element) {
      return;
    }

    this._element = element;
    this._config = this._getConfig(config);
    Data.set(this._element, this.constructor.DATA_KEY, this);
  } // Public


  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY);
    EventHandler.off(this._element, this.constructor.EVENT_KEY);

    for (const propertyName of Object.getOwnPropertyNames(this)) {
      this[propertyName] = null;
    }
  }

  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated);
  }

  _getConfig(config) {
    config = this._mergeConfigObj(config, this._element);
    config = this._configAfterMerge(config);

    this._typeCheckConfig(config);

    return config;
  } // Static


  static getInstance(element) {
    return Data.get(getElement(element), this.DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
  }

  static get VERSION() {
    return VERSION;
  }

  static get DATA_KEY() {
    return `bs.${this.NAME}`;
  }

  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }

  static eventName(name) {
    return `${name}${this.EVENT_KEY}`;
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): util/component-functions.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const enableDismissTrigger = (component, method = 'hide') => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`;
  const name = component.NAME;
  EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    const target = getElementFromSelector(this) || this.closest(`.${name}`);
    const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

    instance[method]();
  });
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$f = 'alert';
const DATA_KEY$a = 'bs.alert';
const EVENT_KEY$b = `.${DATA_KEY$a}`;
const EVENT_CLOSE = `close${EVENT_KEY$b}`;
const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
const CLASS_NAME_FADE$5 = 'fade';
const CLASS_NAME_SHOW$8 = 'show';
/**
 * Class definition
 */

class Alert extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$f;
  } // Public


  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);

    if (closeEvent.defaultPrevented) {
      return;
    }

    this._element.classList.remove(CLASS_NAME_SHOW$8);

    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);

    this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
  } // Private


  _destroyElement() {
    this._element.remove();

    EventHandler.trigger(this._element, EVENT_CLOSED);
    this.dispose();
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Alert.getOrCreateInstance(this);

      if (typeof config !== 'string') {
        return;
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config](this);
    });
  }

}
/**
 * Data API implementation
 */


enableDismissTrigger(Alert, 'close');
/**
 * jQuery
 */

defineJQueryPlugin(Alert);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$e = 'button';
const DATA_KEY$9 = 'bs.button';
const EVENT_KEY$a = `.${DATA_KEY$9}`;
const DATA_API_KEY$6 = '.data-api';
const CLASS_NAME_ACTIVE$3 = 'active';
const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
/**
 * Class definition
 */

class Button extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$e;
  } // Public


  toggle() {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Button.getOrCreateInstance(this);

      if (config === 'toggle') {
        data[config]();
      }
    });
  }

}
/**
 * Data API implementation
 */


EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
  event.preventDefault();
  const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
  const data = Button.getOrCreateInstance(button);
  data.toggle();
});
/**
 * jQuery
 */

defineJQueryPlugin(Button);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): dom/selector-engine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const SelectorEngine = {
  find(selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
  },

  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector);
  },

  children(element, selector) {
    return [].concat(...element.children).filter(child => child.matches(selector));
  },

  parents(element, selector) {
    const parents = [];
    let ancestor = element.parentNode.closest(selector);

    while (ancestor) {
      parents.push(ancestor);
      ancestor = ancestor.parentNode.closest(selector);
    }

    return parents;
  },

  prev(element, selector) {
    let previous = element.previousElementSibling;

    while (previous) {
      if (previous.matches(selector)) {
        return [previous];
      }

      previous = previous.previousElementSibling;
    }

    return [];
  },

  // TODO: this is now unused; remove later along with prev()
  next(element, selector) {
    let next = element.nextElementSibling;

    while (next) {
      if (next.matches(selector)) {
        return [next];
      }

      next = next.nextElementSibling;
    }

    return [];
  },

  focusableChildren(element) {
    const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
    return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
  }

};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): util/swipe.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$d = 'swipe';
const EVENT_KEY$9 = '.bs.swipe';
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
const POINTER_TYPE_TOUCH = 'touch';
const POINTER_TYPE_PEN = 'pen';
const CLASS_NAME_POINTER_EVENT = 'pointer-event';
const SWIPE_THRESHOLD = 40;
const Default$c = {
  endCallback: null,
  leftCallback: null,
  rightCallback: null
};
const DefaultType$c = {
  endCallback: '(function|null)',
  leftCallback: '(function|null)',
  rightCallback: '(function|null)'
};
/**
 * Class definition
 */

class Swipe extends Config {
  constructor(element, config) {
    super();
    this._element = element;

    if (!element || !Swipe.isSupported()) {
      return;
    }

    this._config = this._getConfig(config);
    this._deltaX = 0;
    this._supportPointerEvents = Boolean(window.PointerEvent);

    this._initEvents();
  } // Getters


  static get Default() {
    return Default$c;
  }

  static get DefaultType() {
    return DefaultType$c;
  }

  static get NAME() {
    return NAME$d;
  } // Public


  dispose() {
    EventHandler.off(this._element, EVENT_KEY$9);
  } // Private


  _start(event) {
    if (!this._supportPointerEvents) {
      this._deltaX = event.touches[0].clientX;
      return;
    }

    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX;
    }
  }

  _end(event) {
    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX - this._deltaX;
    }

    this._handleSwipe();

    execute(this._config.endCallback);
  }

  _move(event) {
    this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
  }

  _handleSwipe() {
    const absDeltaX = Math.abs(this._deltaX);

    if (absDeltaX <= SWIPE_THRESHOLD) {
      return;
    }

    const direction = absDeltaX / this._deltaX;
    this._deltaX = 0;

    if (!direction) {
      return;
    }

    execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
  }

  _initEvents() {
    if (this._supportPointerEvents) {
      EventHandler.on(this._element, EVENT_POINTERDOWN, event => this._start(event));
      EventHandler.on(this._element, EVENT_POINTERUP, event => this._end(event));

      this._element.classList.add(CLASS_NAME_POINTER_EVENT);
    } else {
      EventHandler.on(this._element, EVENT_TOUCHSTART, event => this._start(event));
      EventHandler.on(this._element, EVENT_TOUCHMOVE, event => this._move(event));
      EventHandler.on(this._element, EVENT_TOUCHEND, event => this._end(event));
    }
  }

  _eventIsPointerPenTouch(event) {
    return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
  } // Static


  static isSupported() {
    return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$c = 'carousel';
const DATA_KEY$8 = 'bs.carousel';
const EVENT_KEY$8 = `.${DATA_KEY$8}`;
const DATA_API_KEY$5 = '.data-api';
const ARROW_LEFT_KEY$1 = 'ArrowLeft';
const ARROW_RIGHT_KEY$1 = 'ArrowRight';
const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

const ORDER_NEXT = 'next';
const ORDER_PREV = 'prev';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';
const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
const EVENT_SLID = `slid${EVENT_KEY$8}`;
const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
const CLASS_NAME_CAROUSEL = 'carousel';
const CLASS_NAME_ACTIVE$2 = 'active';
const CLASS_NAME_SLIDE = 'slide';
const CLASS_NAME_END = 'carousel-item-end';
const CLASS_NAME_START = 'carousel-item-start';
const CLASS_NAME_NEXT = 'carousel-item-next';
const CLASS_NAME_PREV = 'carousel-item-prev';
const SELECTOR_ACTIVE = '.active';
const SELECTOR_ITEM = '.carousel-item';
const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
const SELECTOR_ITEM_IMG = '.carousel-item img';
const SELECTOR_INDICATORS = '.carousel-indicators';
const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
const KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
};
const Default$b = {
  interval: 5000,
  keyboard: true,
  pause: 'hover',
  ride: false,
  touch: true,
  wrap: true
};
const DefaultType$b = {
  interval: '(number|boolean)',
  // TODO:v6 remove boolean support
  keyboard: 'boolean',
  pause: '(string|boolean)',
  ride: '(boolean|string)',
  touch: 'boolean',
  wrap: 'boolean'
};
/**
 * Class definition
 */

class Carousel extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._interval = null;
    this._activeElement = null;
    this._isSliding = false;
    this.touchTimeout = null;
    this._swipeHelper = null;
    this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);

    this._addEventListeners();

    if (this._config.ride === CLASS_NAME_CAROUSEL) {
      this.cycle();
    }
  } // Getters


  static get Default() {
    return Default$b;
  }

  static get DefaultType() {
    return DefaultType$b;
  }

  static get NAME() {
    return NAME$c;
  } // Public


  next() {
    this._slide(ORDER_NEXT);
  }

  nextWhenVisible() {
    // FIXME TODO use `document.visibilityState`
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden && isVisible(this._element)) {
      this.next();
    }
  }

  prev() {
    this._slide(ORDER_PREV);
  }

  pause() {
    if (this._isSliding) {
      triggerTransitionEnd(this._element);
    }

    this._clearInterval();
  }

  cycle() {
    this._clearInterval();

    this._updateInterval();

    this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
  }

  _maybeEnableCycle() {
    if (!this._config.ride) {
      return;
    }

    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
      return;
    }

    this.cycle();
  }

  to(index) {
    const items = this._getItems();

    if (index > items.length - 1 || index < 0) {
      return;
    }

    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
      return;
    }

    const activeIndex = this._getItemIndex(this._getActive());

    if (activeIndex === index) {
      return;
    }

    const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

    this._slide(order, items[index]);
  }

  dispose() {
    if (this._swipeHelper) {
      this._swipeHelper.dispose();
    }

    super.dispose();
  } // Private


  _configAfterMerge(config) {
    config.defaultInterval = config.interval;
    return config;
  }

  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN$1, event => this._keydown(event));
    }

    if (this._config.pause === 'hover') {
      EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
      EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
    }

    if (this._config.touch && Swipe.isSupported()) {
      this._addTouchEventListeners();
    }
  }

  _addTouchEventListeners() {
    for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
      EventHandler.on(img, EVENT_DRAG_START, event => event.preventDefault());
    }

    const endCallBack = () => {
      if (this._config.pause !== 'hover') {
        return;
      } // If it's a touch-enabled device, mouseenter/leave are fired as
      // part of the mouse compatibility events on first tap - the carousel
      // would stop cycling until user tapped out of it;
      // here, we listen for touchend, explicitly pause the carousel
      // (as if it's the second time we tap on it, mouseenter compat event
      // is NOT fired) and after a timeout (to allow for mouse compatibility
      // events to fire) we explicitly restart cycling


      this.pause();

      if (this.touchTimeout) {
        clearTimeout(this.touchTimeout);
      }

      this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
    };

    const swipeConfig = {
      leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
      rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
      endCallback: endCallBack
    };
    this._swipeHelper = new Swipe(this._element, swipeConfig);
  }

  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return;
    }

    const direction = KEY_TO_DIRECTION[event.key];

    if (direction) {
      event.preventDefault();

      this._slide(this._directionToOrder(direction));
    }
  }

  _getItemIndex(element) {
    return this._getItems().indexOf(element);
  }

  _setActiveIndicatorElement(index) {
    if (!this._indicatorsElement) {
      return;
    }

    const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
    activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
    activeIndicator.removeAttribute('aria-current');
    const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);

    if (newActiveIndicator) {
      newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
      newActiveIndicator.setAttribute('aria-current', 'true');
    }
  }

  _updateInterval() {
    const element = this._activeElement || this._getActive();

    if (!element) {
      return;
    }

    const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
    this._config.interval = elementInterval || this._config.defaultInterval;
  }

  _slide(order, element = null) {
    if (this._isSliding) {
      return;
    }

    const activeElement = this._getActive();

    const isNext = order === ORDER_NEXT;
    const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);

    if (nextElement === activeElement) {
      return;
    }

    const nextElementIndex = this._getItemIndex(nextElement);

    const triggerEvent = eventName => {
      return EventHandler.trigger(this._element, eventName, {
        relatedTarget: nextElement,
        direction: this._orderToDirection(order),
        from: this._getItemIndex(activeElement),
        to: nextElementIndex
      });
    };

    const slideEvent = triggerEvent(EVENT_SLIDE);

    if (slideEvent.defaultPrevented) {
      return;
    }

    if (!activeElement || !nextElement) {
      // Some weirdness is happening, so we bail
      // todo: change tests that use empty divs to avoid this check
      return;
    }

    const isCycling = Boolean(this._interval);
    this.pause();
    this._isSliding = true;

    this._setActiveIndicatorElement(nextElementIndex);

    this._activeElement = nextElement;
    const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
    const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
    nextElement.classList.add(orderClassName);
    reflow(nextElement);
    activeElement.classList.add(directionalClassName);
    nextElement.classList.add(directionalClassName);

    const completeCallBack = () => {
      nextElement.classList.remove(directionalClassName, orderClassName);
      nextElement.classList.add(CLASS_NAME_ACTIVE$2);
      activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
      this._isSliding = false;
      triggerEvent(EVENT_SLID);
    };

    this._queueCallback(completeCallBack, activeElement, this._isAnimated());

    if (isCycling) {
      this.cycle();
    }
  }

  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_SLIDE);
  }

  _getActive() {
    return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  }

  _getItems() {
    return SelectorEngine.find(SELECTOR_ITEM, this._element);
  }

  _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  _directionToOrder(direction) {
    if (isRTL()) {
      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
    }

    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
  }

  _orderToDirection(order) {
    if (isRTL()) {
      return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }

    return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Carousel.getOrCreateInstance(this, config);

      if (typeof config === 'number') {
        data.to(config);
        return;
      }

      if (typeof config === 'string') {
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }

}
/**
 * Data API implementation
 */


EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function (event) {
  const target = getElementFromSelector(this);

  if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
    return;
  }

  event.preventDefault();
  const carousel = Carousel.getOrCreateInstance(target);
  const slideIndex = this.getAttribute('data-bs-slide-to');

  if (slideIndex) {
    carousel.to(slideIndex);

    carousel._maybeEnableCycle();

    return;
  }

  if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
    carousel.next();

    carousel._maybeEnableCycle();

    return;
  }

  carousel.prev();

  carousel._maybeEnableCycle();
});
EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);

  for (const carousel of carousels) {
    Carousel.getOrCreateInstance(carousel);
  }
});
/**
 * jQuery
 */

defineJQueryPlugin(Carousel);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$b = 'collapse';
const DATA_KEY$7 = 'bs.collapse';
const EVENT_KEY$7 = `.${DATA_KEY$7}`;
const DATA_API_KEY$4 = '.data-api';
const EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
const CLASS_NAME_SHOW$7 = 'show';
const CLASS_NAME_COLLAPSE = 'collapse';
const CLASS_NAME_COLLAPSING = 'collapsing';
const CLASS_NAME_COLLAPSED = 'collapsed';
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
const WIDTH = 'width';
const HEIGHT = 'height';
const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
const Default$a = {
  parent: null,
  toggle: true
};
const DefaultType$a = {
  parent: '(null|element)',
  toggle: 'boolean'
};
/**
 * Class definition
 */

class Collapse extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isTransitioning = false;
    this._triggerArray = [];
    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);

    for (const elem of toggleList) {
      const selector = getSelectorFromElement(elem);
      const filterElement = SelectorEngine.find(selector).filter(foundElement => foundElement === this._element);

      if (selector !== null && filterElement.length) {
        this._triggerArray.push(elem);
      }
    }

    this._initializeChildren();

    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
    }

    if (this._config.toggle) {
      this.toggle();
    }
  } // Getters


  static get Default() {
    return Default$a;
  }

  static get DefaultType() {
    return DefaultType$a;
  }

  static get NAME() {
    return NAME$b;
  } // Public


  toggle() {
    if (this._isShown()) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    if (this._isTransitioning || this._isShown()) {
      return;
    }

    let activeChildren = []; // find active children

    if (this._config.parent) {
      activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(element => element !== this._element).map(element => Collapse.getOrCreateInstance(element, {
        toggle: false
      }));
    }

    if (activeChildren.length && activeChildren[0]._isTransitioning) {
      return;
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);

    if (startEvent.defaultPrevented) {
      return;
    }

    for (const activeInstance of activeChildren) {
      activeInstance.hide();
    }

    const dimension = this._getDimension();

    this._element.classList.remove(CLASS_NAME_COLLAPSE);

    this._element.classList.add(CLASS_NAME_COLLAPSING);

    this._element.style[dimension] = 0;

    this._addAriaAndCollapsedClass(this._triggerArray, true);

    this._isTransitioning = true;

    const complete = () => {
      this._isTransitioning = false;

      this._element.classList.remove(CLASS_NAME_COLLAPSING);

      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

      this._element.style[dimension] = '';
      EventHandler.trigger(this._element, EVENT_SHOWN$6);
    };

    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
    const scrollSize = `scroll${capitalizedDimension}`;

    this._queueCallback(complete, this._element, true);

    this._element.style[dimension] = `${this._element[scrollSize]}px`;
  }

  hide() {
    if (this._isTransitioning || !this._isShown()) {
      return;
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);

    if (startEvent.defaultPrevented) {
      return;
    }

    const dimension = this._getDimension();

    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
    reflow(this._element);

    this._element.classList.add(CLASS_NAME_COLLAPSING);

    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

    for (const trigger of this._triggerArray) {
      const element = getElementFromSelector(trigger);

      if (element && !this._isShown(element)) {
        this._addAriaAndCollapsedClass([trigger], false);
      }
    }

    this._isTransitioning = true;

    const complete = () => {
      this._isTransitioning = false;

      this._element.classList.remove(CLASS_NAME_COLLAPSING);

      this._element.classList.add(CLASS_NAME_COLLAPSE);

      EventHandler.trigger(this._element, EVENT_HIDDEN$6);
    };

    this._element.style[dimension] = '';

    this._queueCallback(complete, this._element, true);
  }

  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$7);
  } // Private


  _configAfterMerge(config) {
    config.toggle = Boolean(config.toggle); // Coerce string values

    config.parent = getElement(config.parent);
    return config;
  }

  _getDimension() {
    return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
  }

  _initializeChildren() {
    if (!this._config.parent) {
      return;
    }

    const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);

    for (const element of children) {
      const selected = getElementFromSelector(element);

      if (selected) {
        this._addAriaAndCollapsedClass([element], this._isShown(selected));
      }
    }
  }

  _getFirstLevelChildren(selector) {
    const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent); // remove children if greater depth

    return SelectorEngine.find(selector, this._config.parent).filter(element => !children.includes(element));
  }

  _addAriaAndCollapsedClass(triggerArray, isOpen) {
    if (!triggerArray.length) {
      return;
    }

    for (const element of triggerArray) {
      element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
      element.setAttribute('aria-expanded', isOpen);
    }
  } // Static


  static jQueryInterface(config) {
    const _config = {};

    if (typeof config === 'string' && /show|hide/.test(config)) {
      _config.toggle = false;
    }

    return this.each(function () {
      const data = Collapse.getOrCreateInstance(this, _config);

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }

}
/**
 * Data API implementation
 */


EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
  if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
    event.preventDefault();
  }

  const selector = getSelectorFromElement(this);
  const selectorElements = SelectorEngine.find(selector);

  for (const element of selectorElements) {
    Collapse.getOrCreateInstance(element, {
      toggle: false
    }).toggle();
  }
});
/**
 * jQuery
 */

defineJQueryPlugin(Collapse);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$a = 'dropdown';
const DATA_KEY$6 = 'bs.dropdown';
const EVENT_KEY$6 = `.${DATA_KEY$6}`;
const DATA_API_KEY$3 = '.data-api';
const ESCAPE_KEY$2 = 'Escape';
const TAB_KEY$1 = 'Tab';
const ARROW_UP_KEY$1 = 'ArrowUp';
const ARROW_DOWN_KEY$1 = 'ArrowDown';
const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
const CLASS_NAME_SHOW$6 = 'show';
const CLASS_NAME_DROPUP = 'dropup';
const CLASS_NAME_DROPEND = 'dropend';
const CLASS_NAME_DROPSTART = 'dropstart';
const CLASS_NAME_DROPUP_CENTER = 'dropup-center';
const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center';
const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
const SELECTOR_MENU = '.dropdown-menu';
const SELECTOR_NAVBAR = '.navbar';
const SELECTOR_NAVBAR_NAV = '.navbar-nav';
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
const PLACEMENT_TOPCENTER = 'top';
const PLACEMENT_BOTTOMCENTER = 'bottom';
const Default$9 = {
  autoClose: true,
  boundary: 'clippingParents',
  display: 'dynamic',
  offset: [0, 2],
  popperConfig: null,
  reference: 'toggle'
};
const DefaultType$9 = {
  autoClose: '(boolean|string)',
  boundary: '(string|element)',
  display: 'string',
  offset: '(array|string|function)',
  popperConfig: '(null|object|function)',
  reference: '(string|element|object)'
};
/**
 * Class definition
 */

class Dropdown extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._popper = null;
    this._parent = this._element.parentNode; // dropdown wrapper
    // todo: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.2/forms/input-group/

    this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0];
    this._inNavbar = this._detectNavbar();
  } // Getters


  static get Default() {
    return Default$9;
  }

  static get DefaultType() {
    return DefaultType$9;
  }

  static get NAME() {
    return NAME$a;
  } // Public


  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }

  show() {
    if (isDisabled(this._element) || this._isShown()) {
      return;
    }

    const relatedTarget = {
      relatedTarget: this._element
    };
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);

    if (showEvent.defaultPrevented) {
      return;
    }

    this._createPopper(); // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


    if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop);
      }
    }

    this._element.focus();

    this._element.setAttribute('aria-expanded', true);

    this._menu.classList.add(CLASS_NAME_SHOW$6);

    this._element.classList.add(CLASS_NAME_SHOW$6);

    EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
  }

  hide() {
    if (isDisabled(this._element) || !this._isShown()) {
      return;
    }

    const relatedTarget = {
      relatedTarget: this._element
    };

    this._completeHide(relatedTarget);
  }

  dispose() {
    if (this._popper) {
      this._popper.destroy();
    }

    super.dispose();
  }

  update() {
    this._inNavbar = this._detectNavbar();

    if (this._popper) {
      this._popper.update();
    }
  } // Private


  _completeHide(relatedTarget) {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);

    if (hideEvent.defaultPrevented) {
      return;
    } // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support


    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop);
      }
    }

    if (this._popper) {
      this._popper.destroy();
    }

    this._menu.classList.remove(CLASS_NAME_SHOW$6);

    this._element.classList.remove(CLASS_NAME_SHOW$6);

    this._element.setAttribute('aria-expanded', 'false');

    Manipulator.removeDataAttribute(this._menu, 'popper');
    EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
  }

  _getConfig(config) {
    config = super._getConfig(config);

    if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
      // Popper virtual elements require a getBoundingClientRect method
      throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
    }

    return config;
  }

  _createPopper() {
    if (typeof Popper === 'undefined') {
      throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
    }

    let referenceElement = this._element;

    if (this._config.reference === 'parent') {
      referenceElement = this._parent;
    } else if (isElement(this._config.reference)) {
      referenceElement = getElement(this._config.reference);
    } else if (typeof this._config.reference === 'object') {
      referenceElement = this._config.reference;
    }

    const popperConfig = this._getPopperConfig();

    this._popper = Popper.createPopper(referenceElement, this._menu, popperConfig);
  }

  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW$6);
  }

  _getPlacement() {
    const parentDropdown = this._parent;

    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
      return PLACEMENT_RIGHT;
    }

    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
      return PLACEMENT_LEFT;
    }

    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
      return PLACEMENT_TOPCENTER;
    }

    if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
      return PLACEMENT_BOTTOMCENTER;
    } // We need to trim the value because custom properties can also include spaces


    const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
    }

    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
  }

  _detectNavbar() {
    return this._element.closest(SELECTOR_NAVBAR) !== null;
  }

  _getOffset() {
    const {
      offset
    } = this._config;

    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10));
    }

    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element);
    }

    return offset;
  }

  _getPopperConfig() {
    const defaultBsPopperConfig = {
      placement: this._getPlacement(),
      modifiers: [{
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }]
    }; // Disable Popper if we have a static display or Dropdown is in Navbar

    if (this._inNavbar || this._config.display === 'static') {
      Manipulator.setDataAttribute(this._menu, 'popper', 'static'); // todo:v6 remove

      defaultBsPopperConfig.modifiers = [{
        name: 'applyStyles',
        enabled: false
      }];
    }

    return { ...defaultBsPopperConfig,
      ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
    };
  }

  _selectMenuItem({
    key,
    target
  }) {
    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => isVisible(element));

    if (!items.length) {
      return;
    } // if target isn't included in items (e.g. when expanding the dropdown)
    // allow cycling to get the last item in case key equals ARROW_UP_KEY


    getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Dropdown.getOrCreateInstance(this, config);

      if (typeof config !== 'string') {
        return;
      }

      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }

  static clearMenus(event) {
    if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1) {
      return;
    }

    const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);

    for (const toggle of openToggles) {
      const context = Dropdown.getInstance(toggle);

      if (!context || context._config.autoClose === false) {
        continue;
      }

      const composedPath = event.composedPath();
      const isMenuTarget = composedPath.includes(context._menu);

      if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
        continue;
      } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


      if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
        continue;
      }

      const relatedTarget = {
        relatedTarget: context._element
      };

      if (event.type === 'click') {
        relatedTarget.clickEvent = event;
      }

      context._completeHide(relatedTarget);
    }
  }

  static dataApiKeydownHandler(event) {
    // If not an UP | DOWN | ESCAPE key => not a dropdown command
    // If input/textarea && if key is other than ESCAPE => not a dropdown command
    const isInput = /input|textarea/i.test(event.target.tagName);
    const isEscapeEvent = event.key === ESCAPE_KEY$2;
    const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);

    if (!isUpOrDownEvent && !isEscapeEvent) {
      return;
    }

    if (isInput && !isEscapeEvent) {
      return;
    }

    event.preventDefault(); // todo: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.2/forms/input-group/

    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0];
    const instance = Dropdown.getOrCreateInstance(getToggleButton);

    if (isUpOrDownEvent) {
      event.stopPropagation();
      instance.show();

      instance._selectMenuItem(event);

      return;
    }

    if (instance._isShown()) {
      // else is escape and we check if it is shown
      event.stopPropagation();
      instance.hide();
      getToggleButton.focus();
    }
  }

}
/**
 * Data API implementation
 */


EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
  event.preventDefault();
  Dropdown.getOrCreateInstance(this).toggle();
});
/**
 * jQuery
 */

defineJQueryPlugin(Dropdown);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): util/scrollBar.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
const SELECTOR_STICKY_CONTENT = '.sticky-top';
const PROPERTY_PADDING = 'padding-right';
const PROPERTY_MARGIN = 'margin-right';
/**
 * Class definition
 */

class ScrollBarHelper {
  constructor() {
    this._element = document.body;
  } // Public


  getWidth() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = docq�ej|*d�cum%nT�emef|*kLme.4Sil|L;�  �2d�urn �u4i�`cr�7hfdns.i�mrS�d`h )!d�.uo�&t_id|!!� &� �hut(= �(H  concp#Siet�8-,�has.gem�Iet<h);J�! thcv,O$is�zlm'teslk�(){�? gyve�xa$d}nGgtg u�d}M�t@to�bQlafc�44He8ic`�d!�cz�|lbqr,sht`h�
*�(` t�9u,�sgtE,eoo|Atur+g�Tes �`ksn�lmmu�t PB�u:`y_
�Dbi/Ed�{ad}l�fddFalq�0> s�hB�lMVgnTa�%'@;0v-�t(	+#�o Triw�z �% ilj�f b+iu)6`(padt�gbl'ht ad� ll'�pmvE o`rwmoPiwjt�DO qpiccy�4gp Ele-gnPs woVkagP sho�ig�f,|V)�th

! !00la�,W{e4�llm�ntAtdRkbud/s(�ELGCUGR]DI]D�UoN�Qo,�XROER I�PAE\A@F*
ba0c\l�tu value>�#alc�lAtd$VaLu� * ~Idt(aW�" �(`hHs._c�t@�mmA�ta4vrlreteR(YeL`GTR_GTIckEK^G@�, T�NREB\�_]EN�m^.(#a^culuteHWal}�"?>"c h�tlat-dvittT"-psI�vx9;�" }^
  peceT.)�{
`". `H)r+_rm1g�T,�]eot�ft~izttus,�his�_d%Menp, 'oVerFlo_g){
l  t(�w.�AcetE,iaentAs7Rac�ue{hphis�?5~dmubq,aRR�TER�YZXQDD@G)*
$  2tdi3�r�se�Dte�gt�ttrib�tGq�S-LASTORVy|E�BNf�NU$$PROP�X\_�aDGM�G)9
�  <v`�r.�rEsapE,�ea,DAtvyabtvdr8SEecTORG3	�C�OTG~�-!SOPGZ\�_E�ROI�)"!�|
e0�sF�evf|�gine() {0   rEtu�N �li;.ge|Wad4� 	 6(0+
!0�$o/"Privat�
  _$`3�bL$�WdbF|Ow))�z.   (thawl�sa�eIfiti`lAttribu|e,�his.�Ede}e,t�'overFl'~'�

! d 4h�qelee�~t.st}me./vMrblow  'hi�een'�$ ]
%$�qeLEd�me�tA�vryru�eq(s�le�dor< ktq,eProPerty, c�lmbcck� {� "�0konst1scrolLba�i%th = dhis<cmpwidtH(+{
  &�aoLsp }al�pulapimnGallBe#{= �lumeb$a�>$x
`! (ahf2*A�eld,u �=?$t�iW�ele-dn� $& v)nFou.�n~�zSittl ? �demu�enclienu�idt`d+2rczol�baR�hvh)�{
""`   ! r5turn;
 !    }

  *(� tJyc�_ya�eAnm`ialB4trijttE)m,emen� ctyleTrp%rTy)+
`#  "!conct culCulaved^qlwu�< g}olgu.gEtKgmpu4enSdy�E)ge�aNvh$ga|P#oyeb�yVqd�e)c|yllP2otesv�!=
   0 c�ueentNst{he+�etP2/0er�i(styhePvcp%rTy,``�{c llback 5ybesqcrw�Bloat	ckbul`Vel�afM�)(}xx`)3� q(]Y�  !�this._attlyManm�ula�kjCanhraci�sgle#4or,aianip5laliNcanlBa"k(:* "}
� _Sav�I.htimATt0ibtte`UlemaNt< st�neProper�}% [!`  Con�t agt�CmV`l5m m(um-m�T~�y|m&getprkpmrtyVadua(Sty�eXqOpe�py+;

 �(2IF (akdu�nWal5e	�;" ,(  MifipULATkv�waudatAAvtbi@5t�*}emoelt,$styleQvopebty ccttalZA�we-;
" ,!}` �
0!^vm2%t�mgm�ndAttrh`qtes�3elector, Wt}leqpoperuy�`[
!(  "o�{|`m`jirul14io.�dllBac{!=!eleMmns 9> {( `  $Cojst$tale% =(Ha�Ipt" vnr�e4Ata!tt�ibuTu)ol�iend, {tqduPro2er|Y�3 -&�e gn,Y wajT to �mme~A0phe `soq!rtl!hF t(e 6alt� h�$`Nwlhh� vie ve�}g$can `mqo0bd rero

      mn�8vlue =7 null�*[b ` !�  edemelt*Style&rU=o�gPpox5R`Y(sti,�@popurty)+
�      brexqpL;(� 0( }*0�$ $0]i�Ixueav/v.�eoovETata	T�rm�ute(�lemmo$, �7{deP�oPer491;
 !$  8e�e-ejt.3tmlg.Sep@vgpr|}(st9�ePrOp�ruy,"valuu+;0("`}�J(00 �hi3(_apqliM�nIpuLal�n~A`llrRck(�ale#|or, manepu}atIonCa,�Cac�)+� -�  _a�p<9MenipuL`�innC�llbqak,qelegtor, RclmBack1 y!   Ie")izE,Eog�t({eLe�toH9) �
 $  (ca�lBmcs(selmctob	9 `"  r%twrn*
 `� }

"$ �drh(cofS40se�0+ Se�-Cto2U�gine,bind(sg,ag4ot-"ph�s.e,ement*) {�     4#||ag+(sel!{  ! ^  ]	
�
J/*�
>�----m-�-5-m	,----,-�i---�/,---,--?=-�-)-----%-%-1-----�-�%----�--M,9� 
 �ont{trap,�5&6�!98!}&il/bAckfs�q.js � mi�ejSe� ujdgr MIT ,zd�0w�#?eilHEr.com?tvfs/b_otrtja�+rl�"/main?DIGEN� * /-----%-----�=--,-]-%---%-�-/-=---%%=---=--7---,�)--�-/-%---/-�$
 *?J/2z
�* Konst�fus�1*/

consd NAME$id-�'@A#kfr;xg;ncolqT�ahA3WoLAME_FAd�d40= �ade';cons� CLGSR_N�LES�MW./ = �sjow';Cm.sv"MVF\^�OESENOwN -`�mm�sedocn,b�.${N�lE$1}`;
consV Denq�lu8 � {
  clascLame8`%m�dlmjackl�z`'(+!�Cnaic�pl�biak%�uNl,�  arAni�atm:"Falqe,J $isVmsi"le*"�|e,�a2'/!mF falsen wd uSe0He ba#ktsg�$h'�pu: wIpho�t add�ng any�eXummn� po`|je $ooX @voo|Q|umalt: 'boe9. /'0g)vm q�% chOice
to%|l�cE0`eskD6oq unD�r0diffebe�t el�lelvS
}:Bcoo3t EefaU,tTxpe$80= s
P0cma{sNcme2 �{tv)ng',
  clib+Catm�a#k �(f}ncti�N|juh�)',
  �sAniai|el� 'boiHea~'m
` irkQib�er 'xO�leq~-$ro.tDlemu�D:$'(ene}Ent|�uran')e�=;/*

 * Cl�ss$LmfinmtmoO
�(+�Jblars bacJdrP eytEfds GO�&ic�{ "c&nstzpctor(smnfigi`$ 4(s�per)+
,   wahr._Ao~fig - tQi�n_gatAnf�whcKnfym-{�!4  thm�*_isArpmn`eF`? �alse;
!�  t�)s.�elwmE.4 �(nEn�{
!gyh-/�Gedt�Q
*  s�ith#`gep DebquLp()y`(" re�5rn`DeFcwht$:{
  }
 �stq�ic cet �dfauluT?pu()�K!   bep5rn�gau||TYr�$<;
!ry
|sp!dma get NaMe()${$0$#reT5rn NQIE$13J6�}%/.0Pua)ic
`�sHow*c!lizec�)"{   if h!<hi�*_aoNdkg,asFi�)c,e)(z  $� Aexgcud�)c!Lmbaks�Z      rtttQf;�0 �!l

h(  rhisn_a�Held8�;**    �/ct9elu-enu0=!tmm7gEtEleoan� );
 " %if!t(Iq&_c~ofag*isAjy�ame)`x
`"`@( vgf/ow(5le�EnD);(   u
"  elem�n4.blss2XIcu.cde(CLAsSNAME�QHOW$5);

 `#!4h�s.Uu-Ua�eAnoM`piOn(8( =>�s0   ! exec}te*cqdL"�cJ9;
"$( })+
  |

 	(idu(cal`jagk82;
�   I� ,�tIis.�c~fie.)R�I!iB~') 
a`�$,�exEcupu�cal�jac+-;
2 ` !`2E�qRn+
!$1} c �hin_getEl�ment(�,cl!ssLmst.p%mxvE,ALAS�_nAMEZSHOS%�9;J    t`is.ems�atu nmgaxiN( !$=� {�` !  t(iS>eispnsg�!z
   ,(`%�ecu4e�sa�lbAc?!�
`(� ]+;
�:}
H  dis`O{e(	�{
  "(af`t(Iq.^isIrp�nde�) rH`!!   �Evwrn;"   }#!! Eva�tJAn`le�n/�f(txIs.�exe|e~t-`ETAPWM�USDO^+:

!  "Uhis,^eLe!�jt.remoe 9;

 $�thiS�IQ�pr�nde$h�"&a@3e;  !'/"Q�!vatd�
*� _?etE|AoenV + {� ` $i� *!D(i�OedeMeot	!{
 " (, c�Nsv �ac�dro` = foCd�dnt.cpeAddA�em=bt(#d�v'-+(  0 $�askero�.cl�srN�om$�tjks>kon'mg.kl@gsVadd;
 �   $i (vhisoOc�nFig.msA~)m�|gd)a{42! 0 @ bac�db/�.clqSSLi3papd(�LISS_FA�D]FED�$4+;
  !  8] ^ �`   thms.[%laMe�t =(cack$"'  `  �&  )retu2�atli{.oe%emgff9
 �}*! _k}nfioEftm2Mer�e(cmNfhg) k
 `  // u`� fetMdeMent(� 7et``he defa}l4"`Dy t gdu a"nrAs� GlaM�nv�n e�c($ins�aNp�at�l
 0  c�nfhg.romtEd`Ment0= gEtE.�}eju*dk>fiG.rmgtEhe-#jt); � `R�w4rn c�~fig;�0 }�" )at0end() {
 `�"a�(t(ys.}isB�qendEd) k�&   �0ruturO;*   p}

(  1�on�|$elemeov(} txic._ca�dlemen�(-z
  (|�KS.Vcen�igjroov�le-%�w.�p`%jd(al%ienTy+

d   E6eo`Jaj$xer.o�(clem%nt,DAvE�T_�OSE�OWNL0<) }>az
  !!� gxec�tE(�,iS�_coog�g&coic�Calh`�ck);�"@ `})�  $ vhYs._yrEpre~4ed(= tjue�* "}
�  _l}�lateAimAt�m.(ballback)){
�   gxm#utd�f4erTv�nRithoL)ccl,ba�{, <99s._'e|�heiejT(), f�is_w}n�if.i[nkmaled);  m
}J./**
 *�?)�-m--)---m=�m%--,mm--�/-=----)--m------)m=�----�-�=---	--m!-----)�. * oMt�Tbqp ivun:.1):!Uti�/focustSc�.js
�:"E`ce�wed&5�tur`MIT(8ittppz'�gk�luB<ao,/tGds.�ogtstRepb,�b/maino\ICDNSG) *0<---=--�---)�---�---/-)/�--e------)-g,--/---�-,-<�)/--,mmm!--%�-%m----/$  �/
/**�$"�Coosta�tS
 j/
�#knsq"^Mu$<0= ?fOs7st2ap'ckn�t DaTA�KU[�u=('rs*eOsucTfe`73
c^~st EVEN_�Y4u =�.${DAuCOIUY&490;*bonsv`MGE~T[fOkq	O$6 } `�nc}sIn${EVD^�_KE[&�}`;�`onst GV�T^KE]F�S~_TAR < �eyd�7N.ta�{�ELT_JEI$�}a;
colsd0TAB_JUY = 'DIb%consT TaV_OIV_FWR�XRD =$#f?rwr�'
const PaB_L@VBACKaRf!=$'bebisasd"6
cmnqt#F%fa4ld$7 � {
  a7tof�cus:`tsug,�,tsidE�emgnf�0nuld%o� Dhm )lammn| 5o!urap foc}s insa�e ?fJ u9
#onwt DeFaul�]yam7 = {
 0cutgFiceS:b'b�olein',	  �2#pMheMe�t cel%meNt�};
/**
`* CLis �aFk&mvk+~ */+�clac{ �oc}qsqp�E8t�ndS�Confiw`K
 "aonqXpucvoR(#onnh')(;( $ �tp�v((;*    tkhfn^�ojf�o - tlhS,Wf$4CoN�Zg(confyg-;0 ! 4i�q.�i{Active =�false;.    t�msfOl�3fTajN!rDpre�pifn"} g�ll;*  }$/� GettersJ:
� seaT)k w'�DeFaund�9 
 ! $�etur� D5feult$�; $}�0(s4qtMA ge|�D%feU,0Dypeh) k(   s�4urn$DE"e�,tT9pe47;"�}

 "wtc�ic �%t`NAMU(m ;
$   r#t1rb NA�A$8�
  }(/- P=jli"*�  ic4ivatM()�{j a$ il4 tmiw*_)qU�ty6e� s$�`  "ret�bn;j� $h}

    ifA,t�y[.WongiW.a1tofnkws-�[ #   �tHms.�konr�onersp]iemef�nvo`uc()9
t$ }
$   EVenvHa.`ler�og�(docw-�fv, EV�NT�[GY$u):d/' 'uard against"inf�ni\� f�cusloo`
�!"`LVg~�HqndlernnDc#um�nt, GFMNV[F_CAC�Nl:< �we�p �< t)Is<_li�d,eFobU~mb,ef%n�)(3J#� `Mv%~|JcndL%�>/n(`;aEm%n\,`Eve�T_K�GS�T�Rl evdot => thk{/�hioLleKeQl/vd(avgnp	i;�2$( Tmhc�_hsIctMv% =$tr�%
  y

  $�acVid�ta))!{ �1 �f �8Dhi�_irAk�a~e)({
"0!!0 ve�uzj;
 �  }
` p txi�n_}sCsta4� = falRd;
   ,E6en|Janh�mR.df(dncu�enu. EVGND�MY�5-�  } +/rPravaTdH
*  _�aheleFOg}smN(�vun�) {
 �  con�t1y
 �  $"trqpU�emenu$   } �tHis.~cknvig:` #"iF �u~ent.u�rget ?�}bd{�!}inu ~| e�ent&t`�'et ===&t�#p�me)enp |<�frapEhemejt*3k.pcinwlewen�.|Isggpi)0{
    ) 2epurl;
 (" >i
`(�const eldmeots 5(selectozCngin�.f{f5saJdeShild�e^8trape�emen|�;

$ $ )r �%tgadnts.lejg}h �=`�)$[     "trspUdem�od&f?�]s();h� `} l|#' if!�thm�n_|a�t\ebNaDFizectIon=1=�TB_NAV_�aCJwAsD)0{
 �   �m<wme~v�SaLgeen�s.Lefgt| -d1U"fobus():
�   ]elsg"{*8�   "edaezus[4Q�fmFqs();
% ! } "xB
  _haN$hE�eyenun(uvgnu* ;
 h  Af$$Ev�nt.kex )=} TAB_�DY+ {( 0� !ze|w�f;
� ` ]�0( 0thi3>~nertabcvDkvac|mon =$�vaN�.3hi�tODy"? LD_nE^_BGS[UQ�D UA�NAR_GOBWA�8J "}
]
/**
"* --$-=--m--,-%-=-=-�---�,-)=-�m%-=?-----------,------m--m-%%m=m---/�--*`*BoMx�psap!(R�*:.(8 m�dil6j[
 * �acens�d uN$e� MiV�ijqtpS2/'fc4`Ub.�'}/p�cs�joOtstrep'"|�j/mmn/IA�OSE!H�*3/--/-I------)-=�-=�-=----	=-m�--,--,-,-l---=-m�----m=-),-/------�-,/-*!*�J/**
 �`Gnns|intc
 *.
`�fsv�JAI�$729`g�j`c,';*skn:t DAPA�KGI440�!gbs*m�dAl';
c'l�| EvE�T_KE�$4#=�`*�sDA\A_kOX44}a;
gnsv TAT�Q�I_EY$2 �`.ha4c-�pY'{
#kgSt ESCP�_Ke�d9 =bE{ctqE'�
c.wt sVE�T_hAdE�$"� `hin�4EVENT]KUY�4}`)Hcmnc<$DVEFTM@F_�EFEDED 105$`hite2evEnved UENlWKE$�}`;�conat"GvENT�HHDEEN$0 }``�a$%�n${EVEOE]OGY�4}`�con�T$GVENtWShOW$�2=  siow%{EVE^tSKe$$^`+
�k.st IV�NT�S\OWF& 7 `�`gw~${�VEN~_KD$ }`;
Cgn�d EVENt�REqMZU49 = @recizd$;GZEnT]kEx$<}a;co.s�1ETENTo\�CK_dISMISS`�"`chIcy*disoIss�sEUnTKE[,4�0:b/.ct�EVIn@]MUSEDOG�_DISIIS =�`O/u{unOw*.das}isw�kE�UB�_OEY$4�?c^n1t �WN�WKUQDOWN[MIS�YSS� = `k�y6Own,d)s�Iss${E_eUVKUY&4}h:
ck�{t EVEO^AD	CK_LATA^qP[ 3(= `khick${EZUNt]kEY$0=${DA\�_A�x_kG]"7}b9
sonqT!c\SS[^�ME�O]o(}2'modax-opmN;
Konst C|�SSO�AmE_DAfF$3(=!'&ade7;{k.s|(SDAWS�	OG�[HOW<�= 's(�w':
cfnw�)CLaQS__AMEO[TITAC �`'lndal-sta�ic';#�nst4OaNOSA�eCVO�$1 ? '�noda|.rhw';�coNct!sA\EC�OR_DHQLOG�= '.Mo�Ql�l)aLg53Jbo�{t$�eNEC\OR�ENDAM[BOY!= '*odmm-b�dy7?
cnNwt"M�EBTO�_D�XA_\NGGHL�3  �SdAta-Fs-toEg|$="qoe!b"_�:
inst DexaulP6(=${� 2`ckDr�`: Tr}e(
  f/a5�*b|r�%<0 a�{boad* tpue}�
solwt�Df&au�t^h0� >`} a
` bcckfr=p� #�b/oneunhrdrinc)7,  f�s3* 'b�one`N'� $�qbnaRd:$&foo,ean'~;/** *hClis�$defMnkuinf
 */
cl!qs �odan$uptmn�c`CcseA�upjE,t"S
0 con�tz7b�p e,dMe"|<$#obfiA� q*$0�"supgb-elemqnt<$c�nFi');`�"T+�q._l�qdo�p=�S%LucD}pENgij!.vindvEhSeLGK�OR^�IADO�, th�w_ml`}Enq	;
    this&_jackdrox�= thys.�mnitia,yjeCm�kFzep,){
 (  �xiS.jfocust6eta<DthK�nWi.Iv)q(YzeGoc�qTre|�);
  " 4ais[�wShoG| = &e,s%�
    qH`s�[I1�ransh4Anning`= $p\{d    thos�_wcp�llBpr�= nu ScRollB!sHe�por,)3
!� $4h�s?aED�ventL	cteje�z();� 0} // Gefvor3

  2taDIg�odt Ndra}dt() {�0   Reuurn eNaglp-6?
001
*$(statik cet Def�wltT{te(�(s$%0 r%turn DEfaulfB{Pe&&:
 a}J
 !statik@fed L�MD()�wp   r%t�rn NC�$3;
  }f/) Pubmi�

�`(�og�L%(�elatel!Rgqt) ;
" 0�dt]rn`xj�s._IsChmwl ?�t`Is�(a`w(� z tjis.Who� relaueeUa�wef);
  l
� sho7hreh-tdPerom�! {
    iv8)dj�s.[i3Sj�wn || y,is._�s\raN�it,eneng){* �b  (ruum�n3�  ((y
 "` Cn.s~ 7hovent = Evuj|Nahddav*|ri$%S04jys&_ehDme.t-$EVGN�_yJ7f�,";Z b  � zdnapedTaQwetJ "` }�;K`0 "if"-wx'wMvent.degaWltT�wv�nt�$)0{�     0retUrn�
$ (0}

"  !�hhs�_i3S�wn =�uvqm; !� tiis._asTsh�siti{�i*g = tr�a
$   u�hs�_sc"OmlBAR*�kde(!+

  �$Doc}mu�t.bNd9.c,acSL�st"atd(CLCW_O@ME�SEN{

� h�his._!djuc�Dia�og();N
 �  qb)3.<i"afrox.siog(�)%=70uhesNs*ouEmeKUnu8re�ateD�arCev));p u
J  liee() {
    )f (!thiR�_isShogn �\ati�s,_istfaj3ytikninc-"{
�  #� ratu�n;
@ � }
�  co~qt h�feEvm�t$= Evdnta^`,eb.pr)goeR(|jis�_%leu�t. GVD\�HILE44);

 $"�if xhidEEb!nv.d�rau,tPrqventef) k*�    �ex�sn;  � }*
 !! Tiiw�_msShOw^8= �alsez
 " �va�s.]asTzAns)pim.Ing = urum;�
2<  Uh�w.[6octstj-`.�ec#�it@|e(!

  " v�I{&_emmmefu�cl!ssXI{t.remo~�8SLAS_�AME�LNT$4!;

�`! �(as�_paueCalmb!�k())0=> tJis/O�iheMOd!l(-,!�is>_�ldnenv= t�ys.�}rCn�Ihvd(,++� `}

` dksdosd()�{
  ` fR`(gon�t!hum�A\e-�ot/f)KyIndow. t�mr.^diilngU!!{  "% I>entHCndlErnof�8hpmlElemeo�$"EVE^EY 6 ;
"$"`u$ $(tim�>]ra#klj[�.ty�`oqd))�

 ` 0�hhS/�focicUja`.eeect)vate
	;

 !" cqpepDirpOse�-;
  }

" H�hDleUthA�t)(;
�("e�hs._ydjUqvDiaLkg);
 �} �.(Pbivq5E
  {~m�imlizeBAyDr|(�b{. �ru4ur.0lQwhbcskdropxS
 0  @ AqVi�x"le(!ZoOlga.*ti)S,[konb)g>f�Ccdvop!,``   �-$'q�aTag&%o�tion�wiLl8�e tRaf�`q0ed`fo tru�- inf0cggEanS willhIeep thE�r vqlu%(t�    isA�ima4ef:!tiAs/_)s@niD�dee()` `!});
$�m
�`_in�Tializc�kcu�UAu�i0{�00 re�}Rn�ew Dkcest2au(k� 2  (tca8�leodo�:!th�s._glem%nt�3  0})3
 0}

  _b�nwhe-entHrel`tedTarfe:�({
    /4�ry0} `pyeNd `qn�oic moden
�  1Id(()�c�-ent.Jod],cojt�inw	5hhr.^Exeent� {
$ `   d/cu-enTbod�.epp�nh(phx�._an�}eJTH;
0 !`|*0 ! th�s.�eleamntnstylE.�asp,`y = �Bn/ao3;
    !tj�s.�elm�endjrem�feA�tbi`U�m,'!rie�bidd�f7+8* !$t�)rO�Lg�5nl*+o�Atpibude8'iRi!-moeclg, 4ruE)3
*�  $T h�._edemeN�.sa|Attrib5te�|o.e�%(gdiaog'i;HJ    tHa�+edemmltFscrghlt =(01
�01"cOjs�$ekd�BoD{ - SeecvotG�gijE.gmndOn�(MHDa�OR_MNDA�BKd�, dhis>_dkp�og);Z ( )f *moda�B}dq)2{
 0l` "uodalBody.rbrml�ToP(}(2+
 �  }

 "b�sefL�w)tl�_.ede�d~|);
0 � tmis6_e,-mend&c�a{sLks�/ale IHAZQ_NAMEO�HO�44);*
 �  cm�s|"urasi|hOnCmplmued= (h"�6${
  �!! if%(|mir.]cOofif�foc�3-d{
( $     txiro�fmcus�rap,pativat,)+  ! � g

�(   thIs.�aq"ansiuIO.inf (oc.we
�$    MveF4hcndh�r/�R)gg%s(�hip.Wdn%mm�th �VQNDOS�OwN�4, k
    0 $0seldttp�rgav
 #"!( |)�
    �; $ `$*is*queUe�ahl`ac+(|vglWit�o~�omp,g�e,!this._diallg, this._�rC~io�Tmd(�-+*  }

 �_id�Mvendis�eneps9"{
l  �Even0Ic�ller.gJ(|his._ed�Menu�dUVENL_KAY�OWO_DISMISS,3, #�e.t5. {0 D" (Hf4Gven*iey(d== E[BAP�_KE	�1-(�"$0     bau5�n9
  00( |�
   % `i& (Vh�s,conf9g�keycMar@) �  �  #p etgn4�revemtDe�Ault(	;
�  �8   thqs.hidgl�
100     �uturN;
  �$  U
 (   `th�s&tri�fesB�yj`tmPTrbnSyu)on8)�
    }�;*  " >En4HandLe:+on8vinDou� EVUO�]RG3IRE�1,"(+ =6(z
 ` h% ig�
Th�P.KisShown8f(1T�yy.i�Vr�osiT�onin�)&[` `<4 @ thir.edjwstFia�g))3("   !A
(� $})+`000~eotHamdldz./f(thos*_eleiint,`EVE�T_OUWNOWN^DYSmIQ| ere�| =>�{  0 `"EvejtHa~flEj.o.e,thi�/_em�me�1( EVENT_C\IWJ]FOSMY[, eue�t2!m�{  "!  �"/. a1`kd tr�c{�4o$segRe�ste yL�kks!tH%4 ma{ wTAbv$ansKde da�og fu|`�nd gutsiDm, �n$0An?it liste.�~�o#rwllBar s�akos:  4�   `id �h*s._`imlo�!on4e�ns,eve�t(Uirfdv)�||`ehhs>_fiAlkG-contazr(%wef63.t`rggp)!�{
  "     � r�~ur~
      � }�`"  )bH iF (|z`c>�conbjg%b�ck`vop$}< #S�atia�	${
� `"  0  pthhz�_TrigbevBabk$�opL�aHsit�o~(	
  !�      rd�uv.
$0 (�0`�|

# $  (" if ,�licn_confiG&cac{dpop(0z
 B  6b$p �uh�GjhYl�(*[
 . $d  !}
 q� ( }i:�` & }i;
 (�
  _(a@eOOda|") { ( t`i{�_%leme�t.spxlg>diSpnay -d'n�Ne';
   �phic._`l�mEnv>Se�At�^ib�Tm*'arha-hY` e.7`vr�m!;
J("  4His._elmmEt/peMoviAtt2�b_te('a^iamofal%)�J
 � "t(is,[%lmmeNu.removgAt�pI'ut�('r�lm#(;
  � th)s._istr`�sidikn}N�(= e�lsf;*
�$  th�S._bcciuroq�lytm() =>�{
$   *dmb�ment>bod�.cli33Lisd.rm\ove(C�BO�IME_GP�N1;

 "`0 thacn�ruzeuEd+ustMe�ts()3

  � h�his._sjpoldbar�beset(!�
`(�!(EventHAnnlaR.lrKgge2(|his._e|emmju/#�EN�_�DDE^$%�=
0 !�}); `}

  ^)sAn)mated8)"{
  )2etUr� thys/_uleoc~t/blas�isT.c/n�ains�ChAsW_�ADE_BDD$)�
 #
! [trmwge�G!c�dro0TrensitmoL)� {
   �cjSt hhdgEvunr�=`EveN�Halll%r.Trig�gr(�jlr>�mumqn4, UVEO_�ADD^P�AVENtD41i{J
$ 0 a� (�keeLVenp.defS�dt�ru^e�tEd� ;
  "$`�~e|urL;04  }�
   "C�nsv iwLgdulOvaRf�ow�no ? tHas�Wenument.�grcLdEa�ht ~ locU�enD,d#emendDldle.t>cl)%ndLeioht;
!�$ const init�alMgDzftMwY =0tihs._el�meN4.�ti-e.ov�rfhmwQ; o/ �!Dwrn hf �hu!followhng(back'sound p2Anso0k-f hecl'|"yet#cooxletE�

0 %(ib 8hnitkcl�ve�glmwi$�=-0'`jd�En7(�|#this&_d(eMen|*slassLMse.c/otainb(KL�SR_�IME_STeVIC))`{
( ` $ 2etU^n;
 �  J( ( hf�)!h3�odi|Ovarfdfwin�- {  `�``l`i�_m�Fmmnp*stYle.ofgrflowY 9 hi�dej'+  ` u

�   tiis>]eMemeft�cmQqsMiwu.adt(CLURX_GaM�_STA�YC)�*�   thI�*1ueueBEvmc�Bk((! 5> z!% !a�fhi#._eluM!fT.claS�Mms|�BdmgVg(CHASS[NA�E_RTATIc+(
    "1}hks~[yu�udK�/lbac{(() => y !8 � !$v�i3_el%me~t�st�lGdovErfl+wQ#= I�itiaLOveRflovY;(*$  2}l$tH�s/]tI!lGg)+
    iN!t�)r+^$ha�nb	;
$�d(th�q._'l%o�nt.eoK5c+)?j(`}$ -b*B   * txe`fkll/wi~g�meVhgds0are�5sed$to `e�dlg�ovezndnWing)-kdilq   */*

 �_idHWsti�d/�(i`{�#2  co~3e�)sMoD,wmrvdgw)ng = 5hir�]eoem�jT.cb�oll�Ic�u ~(d/sulent.`Kcqodn`�eelt>clidj�Ha)gzt;
   c�~st"sroLlfarWidTn ="�pls._Sc�l�Barngdt_)(q(;*"" 0Cof�t i�bcl�Ov$pflOwhng�=$wCpo}lbatu�dvh > 0;

`" �f (iBfD�Owe2f�k7-nG $$!q�s]m�!lOvEsfloWing*$y
�     coosu�p2oqe�ty$/$isRTL(`� 'pa&dif�ugt' ; �eadingp�fh'+( 0    �xis.^�le�lv�s6�lG[pbobERuy] �!`4{scw}�lJpzWiduh}x`;
(0%$mR d �!f j!�sCeiM6u6&low)n�07& is�odamN�ejvlK�ang"{`  (( Wbnwt ppoYer4{ 9 hs�TX(i0? 'pabMin�Ry�ht% : 'qaFtk,gM�n';�  �  !dii�n_%leme�t.sdsh�Kprc�%tx�(-  �ys�s/`�bar�idtH<�r` !5 }  �
*  _r%cut�DJUs�mends(2{�   Thi3n_elemanv.3tylenpael�ng�efv }�'#: "� Pxis._eleme'|sh"y1e*������s)2=2H'�������'��"qKtS z 27��cm"5FŁ�����ld3%
aᗝr��VBG6nxQQ8J
CX&���(ut��"s9itz=����Ѷ���*n.+>p~7�쫦#����m���V'6v&C̄�(��X/-ei|Y8p�� l�����{#BLi鯣�{��B"(b&��k+/��5m���d��b;��2???m&V�����/$6lpu��,pl 3T3���s����tif��@"i��	K\��%F3n��,g%akB{t-%} ^<51<a(&`��BTsu"nqڵ�Pg*T���츌'#��z���^LAaolg#0����J{x;,^H.(.���۶�8p ��Ey���|��U��=4(!fe/��8��$������b��Kb<��y����h,}����C�0��R�� ��aa��$+*B>~t1'܏���Bϒ�E6��uWRXՑg3?ӭ0���yASѐ�ķ�`Mdf'iAhcp-MO ��,Z��fFtv{����L��6-"d8#��'kyL}��d"'|l$K
dt76t��'lj���ar��TC6,n�͋8h9
=  /85��<11�ɹრ������o�����󪘉�m�� O=c��j$i��o>��I^����g���T��:Y40Ly��dNP*ev*��u!|!{&!#~ NPg��QU@Ƈވ��Y�K���=��R*'69(%h�����w��mQ _Q'nd^��Y����u$O����7m߀ʪ ��vw!_m�������H����4��3flA�����+){ȅ��cos��|1PDgb0*���k����H���tಾ4nnD:"BE��`*rH��`h��+/l I��6���"��dh&��ICfņ�?��=M!��ax��� ;	T	&:,/së0mps`����g0:�̤�2�䐋؄5j'��X���5 3#m/@���-'l�g�ΖEK	�� 7{�B@����shG.{s9dIm��mnFa |aclerhG`�Tq a.�Rhgb �~t�ms GxEn�  �ks@ A�jet�MpEj�6*CeL��voNo{ne&&mz�O>u _HeN�U�ECTO�#aZ�
	 if L`lx$a�}�x *)�{* ( Moda�*G$�v1|�c��Ian3�Utm�Re.*\mte(#;��(="wndS�!ed�-e�/f}h'/vfnrC~�iTqHostcn#t.tyrg��90�dp|��mg'Mg8�t�s)+l)=Ne%sale�e��Is3Trx7uEV�Mo$!l);J�j�(:��Y�lr}�k/
.nm�ind^QsaRyQ,tgeO �O !� ;
j/J..� 5=�d�-'9-=<%-�l-d-)-�%Tm�==')-$--'m-)),�1=--)-5=-=)m5�g�-�/=m5-%/�-,"`*"Bmn��qrip8�t1 )�x.]fdei�616.�*
 j`LacM�san e�Fmr M	|@8i�tts://gath��oa?�/�w`s�cooq�tv�R/&l�z-�ayl/M@ADN�Eo�`; -,-�)5	)�%)-%>m,---/m	--9--/-�(m{�-+-�,))-//i�9,-Oe}�-�)m-%-=--�/N � ��(h /0Sm�tE~��B1
o
cc&wt#kE-D 5 5b�b�dc�.gc�+)k�m��tGKT�>[Ci+��"%bq.obf��ow��+;!zg�0e�AND?KA4q 51`(#L�Cb[KEA`�]`=coVgt �IT�!PDKI�4q`�.e�tK�� AfB{.st)@FGN��LPdYā|D]cPI$:�)p`\_!pD{MN�OOA=d�}d9�A� ]AH	yKFZ6�}dssmf�tce�kAЏ5SMy�< '@��`p�=s*A�nsu C��S�_aEeSXJRd3"=%'�hw�3ao.`� ǴC^.@Ig_�LO	^G3�'uy�3o��{*con�f)�LAS�LEm�_IHVI,G �$'hIf9n'%�N3nx{t(G\aYSW��_A�"ACK$MP$j'/4�#c�nAs�re+kdxo��*mn��NTE^_sETU�\FP"� &.!ff�ujfa{�qho�71��nr~aJB&�R^OWd3"<� #h�w$iERU�P?�MY$]a;cw.�\ vEN@�QHF�N$'`<�`�h��n${Wv��TcEQ3}� _~{� QF�Nt]hI�E�2 { h|)`m$oE�UP]_��}`k.Cm|wtEVMN7\LF�n0WA^TEE#� phKt�D3�R��|=D$sEU}�\�UYd�wc+
kmostb�NMct_[MdLd3"=�hItp�N${qM&W_KY$1=�3snnsm�$VLX[�D�I�E %%�s}�M�bdy�WtN~KE<�}"
c��{| A6�T�LI�BqUa_CM )T9hj�ick$�e�DN\[v 3w$;&I\M^A�QO�]$�y �
kK~st A�M�\woEm^oWFONX_Kð a{ei�gnn`1rea{s$k�SEnUVKQY�;m0"Coftp S@T�`��R]DaUUVUO�DN] 36;bedapa�Bq�p��Cf'�"o`facjVa�"yJG2s0(�eoedTd5 ="{
 HfBCkdrop: gr�e-k("�e}bcyl8r\Rte-[h[C�oL:�lmacE�=;
co�ut`�pu,4Vyre��#0 {� 1B�CodRmr��7.`o�d�a�|wqrAfg�'( hOgqbmAb/� ,�Wk�ean�.�� 3k{fmn: #n??Eeqn'
](?� +0W|c� L#g�nI`In�":/*a,�{�1wf�`�nu!S�!py�n�S�V�sTH��`oNe.<b�L  bmNst{mbP/G/��dm�ft {�fyGk h"��s%p��&%ldlE$T%acnN&ik)>"h��edms��{jlwN9<`falsW)2! @ tdHs>Uqusd`?t`� |mIvk[qnity�ti2a�jckD2P){d"$0-iC�f�uc�ra0 �w�msnQq��Fiakz-�{={T�a0 	+J0h pni[.[a�\��.S�{r��,%r�;H } ?)�Gmt�Eqr.JT�uit)c`G�vtDMva�r() {
( !��eturnDeua}$� 5;K ��
� r4 4�g!&!<%|dbau�PT}�e"= w!ip2�eTU2O"Defat��Ti1a$�{
  ��
p �%!tYs sy�$NM� z� �t0beU|fo(FMŠ4;J`�~pO/$R�Blko*��`��C&lE	r-L�|e`t`2g%t)$�
  �qrW��n�tb%C.[�"�xmwh(?<4|�/2oEe()>$u�mw/w|ywArm}et1dTa�geD!;$J}�
" s��2F�i@uu�Wq0�et� �!$ �hЪ(phia?_�rR,/en��+
  0�!{c>Erj;2#�2yJ
$  �boz`$�(�WeTent0�#p�n4aa~||r&Trioa$u�vjKs"�eDulen�- EveN_ i2$$R( "   kf,ct�aT1s��tBh d"h;
a�!�n�8r8owEv/nu.E%FQuht``e|e��ed- S*!p ""(�%ts2f�J  p}.C�%( 4hiz.KK�� nw�"dD�}a]�i( `��3>_&q�kbRop<Uh�a()���� �`	e�(!�h��.s-?�igou+�nlh) kNa�   8n�w07vgl|a6�-lqur(i5DiE`�;x
 }:#��!p*hs.em=-�.tpuME�s2ibuQaeqriC�m��al�v�eu�;# `�u��C.K�ma}}N�<�mvaTTp��wvm��bd.8' K!~O�')+
  !(�hiqn�$��met.cjcsqo�T.a$l�BNQV^JpI�_�hOGiZd81i�J�!. Cnsu$qkm(}A4eA�l�b��k�� )
5>(�`   c%$H1thi3,Oc�nfyo,s㲯�l l<�6dHc��al�vi/"u�kep�@{ls
 0 1   $thiR,_foyusuva4�qati^�xd(i;N�  � #}��  (�hi{,Y!|gma�t.�mcSsL�st,j`rxBnQR�{fA�GUUYo�4Z+
 p "�Th;�melAeDjt.CVq[�da{d
r�}�(D�vS_OA�]�SH]WIL�$);#� b"$8G6�.��aDdle�.��igdR�mis.Y�le-�H���A>D_�KWJ$*`�
(a8`)01 R$�!%m�Tazoe�z� "p  u�?(p �0}@$(&th�s.Qu!uFA�llf�az(k�m0lịCa,t�Ck,&tmi�_E|$M5dv>!tr7ez
$ |
8 ahD�(I0� ( (L.!('x�ir&]�r�hj��)%r*"!Q ! rEw�r�{�� "A�
$ g�bolstaxidEE~U>d(� AvgOT��K�lu2/�pinf�p8\h�?&Wa�%mg~t-$eF�^�K�Ed�){ %# ig Hieeeve�}.d�Q�ltPqE�u��d`9 {�(��"�(gaDurl�p�#u. �`���aq�[�o�ucursr/p�A�Eo\gua(8?

1" uiy�.^fme��p>dler(=; #� vhk[.W+1Zlgn�=�%)�wi9
 !(!�h�_el-imnt*�|ais�)srj�dd*L�c��FA]ESHD	NK!;��$�C$xms,]`aUZ 8kp.X9d] )o
 �d!��Bwt`cO-p�e0�Aa,l"I-? �<-=� {J("`����`)�oeh�id~|&CHas�L-!�.|wiOvEICRs�L�M_�LOQd3�#KlGS7_BkMU_HI�ANN(�!$ "$�nK�._-Leme.�.:d�mbw@vu�obUtM,'GrJA<m/dqn79��  )$`|x�S.�'|mmen�2�om4}�|tpi2ugs(7rkle#:*
  �(!�if ,;uhkcz�ck�d�wQsvOl�%����  "! !ner&3cf�~lFApHel|�s ).r�q-v#1% $ }Z
0p, !dEt��tJAjdLer~tp-e�f�)eaq�n_e�l-en4,FQnTZ@Id�O$3)3�0  �;B�ea  4(�s&tPqea�Cil�`!co(Emkul�$eJ�OnBj�K�t|cr_�e=e�p, |2ud�;,,qZ( $\7�Ksm*�${  �@Tj�S6[k�czd��">�)s`�U��)��K ),�thms*�4��wRdzap/�uz!p�v�|o$)9�H2 0bureR/&,�ksl(�s*8$=�/)RBK.�4%"Z84O�FtI�l�:�Be`k�z?P�)%{�! !bclnsV1KH�bK�anl`cs; y ��$<!s.(  ��iF"��hkwn]�oNgm�.biOcFr-|$ͽ91&{0athc7o�pp@� �" 3�vD,vHam"dQ2�vr�f_e2)U�ka/�e|�MdNd4#ETU�D_LM@��ZR�M�TE�);" ` ( `!rervB-/    <
`  c $D`kOxih (	5�  $ };��n-gsa�lc& �1Ugo^ wim� Ze yzanb�a0Ld w,�x+ue��l$ �mOdea�* gill(beu t@eyb vdl5e	�0 �c��St �sVxak��e	|ole�n,tx��._�k~&Ya�vabi&2Op9��!$ �dpuvn�Vmu C�`@Tvgp�{�  $0! sda3qNAmuj�CLaSS_Z�W_AbK�[Op<��`:  !k�Vi3if�q�
� ``B�{��im3�<=2#d:e�% ! c  �okMe��ent� tJis.OgNemdn*pab}b]N/de�0    �cHjbkC�ll"agk
)a#�ivC`l� ,�c�xk�C`l�bagb :Tn$ l("1 "��T }�a  �/ot{a�*"eF�a��rc\j� {�    i%4�Pn me{(Ff#usPh�t {�  $uvat�.eMDn|!thm{*_}��ogj~n � !}i; 2
 (��tddpeoa�atgnrc(�({
!!�tGv�N�@alnntu.+Nhu��sUoll�Mh6��EVmN�_IA9TM��[DI�mAS&,4w lt!=~ �
� ""  if9(�vd.4&�{2%5=�ES�IxP_K)��� ! ` $Be2Fqg�! d(40m
�`!�  f(x!THi~/{Coj�ickuip~gcD! K��" $`(�mve+t� nT�ew2r�e4)4ai{n_mh�i%lt,MV�JT_�Y$G�TREwLN\E9;�00    reu_6�C�  4�y!�$ R 0ly~h}eE((;*  6 �;@$y�/= md!t�c"
d s6�P�#��QtoyM��uvj�"�)co�ki�ybk
   ,�U�4R |�@�$%caH"q.#xi�+d��bg
%&#�hKons�2ct�=amb�{aj&���er�rrt�ueKn���2%(<(y�,$cm/$�g+;
1��  \d 8 enf ckg&A� 1�#�tZ�Ne%,�{ `�,� ,p%v�bj� !`2�"  (iF� dce[b�t|C]!7�=�q�etfIL%d"i|!g�F|y�$r�A��bV-dh*>Vf�%}�3'gn ag =�(/coNs|Pu!lOp/i$k
)(A   �(�hvw�nmv0�y�e��r.2 `NUMegu(�$$~a/U$! y'~$h�bca�
"$�`(T]
� 0�0� �y�AYGC��ik�"y(i2	!  R(�I;
 O
o��+L `(`De5a	qTMPM%�,ame�5a|1N�
"j�

~L6EntX bdn`r$.N(`��uiTmv/ MvDTp
��CkODADAOA$(�R�euCPMT_D@�QO�nP[LA$1,�&fct)o� +G^��U!!��cKn2d ua�omu(/sg�DU<uoEoqFBooSAn�K�/r8txa{19" ib"�[ Z�-`+LrME7].io�l��e)|h�W&TIgNe-a)8"+*   bev}nv�rzG5m�Eegay�D( ;
� ��_ �`f��i3D�cabltf>�Hc2��!Jf ,`-R�=r~="�d !!�h~pHi.-^}2/on�t��w7|d`CbE�pTJEn 1n@(=d9�e�#� �egBi�}�"of1V*��bp`7h�jaaF�mq jlose"
(  !`` HY7Vh��khe<tl�c(#{ )) "ty9r.ec}z((; $$]B  �8;!K��d.i� gml�,ictslenbkl)�kAfg���t��olgb��f eh#]wfs)Ova�,���;]� sfE�I�b"ic$n ef
Jr`cnnr�$a,p'a��gPbn!=`Sah��tnpEn�;fu,`�j.Mh�,cPe\]MMGCU�s3
( ) `a,reae9Opc~%&��aD2aatl0a� !Y t�c�T ({0 0OfR�antaS(ga�INw�N��(slrMib-t%n�*l��a():
%�
  k/�rv7|%ei �_FfcaFv�n/��GrC�av%	~Wu`o#},pyB7�vi3�! aty.vomfxe(ThaW)9&l�{Eza�tH�n&�r//d7�NDkw,MF��P^�_@ULAAVA H$"%�;�?<�sp���r 8sns4"sa�lcvNr�.g p�v{b_ra<g	he.&ijh(�qEƏSLEB\mP;-8k�, "Fffr�nr	f��GtGbpmAeIm�8Xlcu�3mNEk�ob�.ahow-;�  }Z)�JtejuKa�vlu�gOo�uc��oclMV��p]�E3ZE=A�)���+*"lmr�H3n�ct8el�me��|_f"lLZ|ozY�'�
E.oaM�8#Zar�i%lcv1�m;b�esq=�yo^�[ihrSq:=O&fqANt�s-IW!9+{
! 0kf8�dd#o�pttedR�ylE`�Ne-eN�;&pWw94m-n)��!.fkx`/8): �   Oe�+cv w$�}t�wt�K�eMl�4a^gu8emf�el�+Hh�g,�9J��  }
2 ]���
EncB|�D��mxc��vY'Gu:(Off�QnWd��'*�(+d*ue�[":/
d�.y.JYU�2z@��FcJHoffgAn�gci�-�2k4:()��)�/e%==,-�----,<>,e�O�$��-,+}�!-}-,--,%-��-l=/�-)��/=/�)�$)!/-�%

2�moc�Sav0 r53.!) !th|/7aji�z�0.�sZ /!La�Ecgdw/�ev�\IV2*httpmz/gi4Jt
{o�`'|rO�k�@rtPa }j}oB#l#n�/�IAENJo)���%-$n/)u�-M -,,-,s=�M�-5}�k��-!-/]�U�-�.l--=|=-��!,-+m��----==---"h#X�Ojqt(��aXp�piru�es <�jqiQ�rlK"�ggrieod',0��iu�',�Gh�!F'o �Uz%Etitt -0%no.gmeCC'$�yoy4up','2rs$ #�lh~)��u-&f] 7��;�S� MSI�_Au�z��WQ�AADKhL 5(/~�k�i5[�wlU*�/*3
 &$�p�t��bv|(a�#}cfn-ze�&�ko?oz\q$use�5hd�u`qe4o�`S@q1t�a4 qSu(3�g5/�""
$*$cfe$,�pt�ukBfgpdk" hV6�5�ksitMdb/cmG/M~#Ql��/a^}=l`z/f�b�1s.t.x'�qCZ!�eS-c�re%�rCorankpPct��r=g�nr)nkuazEr��pH0�;
ci~{|$QTW_RL_PCT�U]j!�'_(?:0�`vtp{>T�i�4��ft��xEl~&`(D<so:#
x�^c/�]:�76[!}n]X$�8/l#A/�("z"Iu!d0�rN v�a@0MeTc"e3,�i&e!"Qpd TRMi. Gn�y�-k%Iez ite'l viF%Lbag aadi��wy@%q?� "
 
!Sh?t�N5o b/$A�tum�z`jut0{{-�cI��u
.OKm�an�xlyV;ADou(a2�Rlo�/.>x.Pak�qV%[.Kv�/�rcKanhtmzIv�on'D2��S	n)�lZ%�.��b�.�
soobD$NARI[Q[�W�TdDV� 	$.nTi<a3?kh!7m\-�8�)q�'yf|vb|f<kpg8(n�|T�6n|eg"1+\faPen�-(��-xEc|�r6|ogg<ge"u!\t7tIg(>~ec7}~oalgf\jq�sy!3��rev.X\p/a%~O	��'I_
	ck�s  !l,o%-,I�2I��$�pu0(�4|�IfU�a- `hh�wedAttri*�pgEIst-=:)�B  3-nsw!at�Qia�|dN!�e,=!!txrA�uaan"g�m�a.t{^KwdrCA�g()>K+8 lv 8�n/�evIpdTi�Quq@{[x.i�ClUt%s(�4�raBaTe|k`m�)$o
 � 8Ib!(q/iA`ry`tt�s.[�snatdwIbte`|�me/) iK(%  * zd�msg��onnd�bXKFCW}��PQDUpF<tms�(�tt�`�uul.,/l�t�muM)`x|a�T����_X�G�	��/��Ydh1tts	B�6!.f��g�%mee)+2$$p��`   �UPw�r%~rti�
f� k/ 9ag�kf�`"z��%l`z"5h`rSs�,O.�tafX �tEa vl%0�tuzh��peFG
* fVcuqBn!mJ|o~�fAt}�ibUpgDi��.��~ler(`tfr`"u4u^ewex 1*hptZiju|�R�agh�h�rTi�b��f(QegQxz�jwoid(vdex �: r5Sd&}ert*at4RH�~fs}��!7�y+*"kk�S49DgFauluC,�owlis�"5 9: !./2#lobal&�4t2i2�8gs 1\-Gs-T�o�"A~Y"syyPn{et�dnEm�n��`ml���ZhH'Jf 6Rlhs�'�@la� $&M$-� ,�f'* $r�t�")&�R	A_TPkBQTGG9QH@MB�Y!0#� {'ta&�e��,b'Irgv&�tMtd�(`grGL'\, 0ar�S:jkY�x��*{�]d�bz8`S]*`�kel� Y��J*�k/`20��Jf"dmr�`}.
"e}>0_] �hr>B�M,`�j$*tZ]|� @3;�[]�8�j#2�[�<� �4) �}*(!p��\�  p? J�%
 8Y�!�}0>p(��g{(k'ssC��:{s�wft7� w7l=<"'tm�l�g, '7idTi�,h'aaegl�6�8 0,m [Uf"�lx �,0yx2*�]("�~e [-
� bz YE,Kp�rmclo> X �xp�&
]=
"0!mT� [z,�"2b��;�_�l��0qtroig:�[-��t��Z@(�L�0[|}?
�|lgpew:r�f+tiza�4��1n�~�|}l a�l~w\��t, va~ivcr`�u���n	0��1!hn0�+.sy�ddteL&�%l�vz��{
(,�*2%�eZn QnwIb�xrm)�
2 }
2(hc`�s��!u*�mVULwti^n '$�4y�e{vbs�xy~ceW~x��mo* =��('`u~gqi,n%)�   cu�ErN@#a�i��x�FtN��OFhg�k�wU�/�38 e�.(�ConK|$�om`ssep`� juw@4q^do=.DM�2ab�ec():+! AO�st0#ra�pedDnau�In5(5dO.e�Q�[*p�R{EWvwitrimohuOaff �im> 7�x��eud%)���gOst4�,�eEdts( C],{'zea5,:.�Kre!TE&F2yygj/bc(i*1�e�y�OkC4O2�nd(%$%�i:
�"'OR0�L�w4�e|Dmen^`~v �fy+EgpW! ��   &+n�t�eoAmedt�am%84",DuEe.6.n%`mOaag#t�Nm7arC`r�(=+�,"�1i� �	_`.`b|.+�8q+an/O7AI�di.ijA.b�wq*5`Lfa&4baiG)��g�! �$%!e|e9$.pRalw��))  0 �!#gntin}�+3` h��+J"!$�/o�s4 ltUbgj'TEList1(�]>@o�F p(:>.-d�mdI4��T`R[�ut$�)*H"$ !y#n�|`dl,oudHtbip��W@9,[_/cO�c`te<l�Lis�['*'] 8}�Y](`�lootLkrt{$HA�a,`Lb|O� _> [̡9
�� �fgg8��Ip�e��B��wte oF +�f�Ibu|EM;st+?h*@" ( ��g0�!Cllgw2dCr6RIi5pejaU|sk�5u�l`a|�Owe�4e2ibuPu�#�#�� P� @ 1!g:$mwn!�ccI+veA�|r0�&d,!`tz�c��e,�n�aJaee!/Z!��p`y
�0 (t�@\
 �%�u�j�b2eau$�xc�e�ulc/$2&Yod!xmD6z6.��.*x� -)%�e.=9--,-%))-)=-%-%m%=$i)-M�--==��%�+---�=/�')=�-$%/�=,-]/i�=m�( +(Cn�r�4S��!)v1.:.0!: qta,'f%lqDa|%,wi�o:qn�;
 " X�#e.bmd ndes 	AT 8`pUtsg.�iPhu�.co�t��{�"�k4s�rpob,o/oOa�%�LCY^E()4*(m-,�%/	-�m-mi��9,m;-%)%�-1-	/m�)</-o-----,	%-//5%-+5=-|-�%m/--/;%,=/-m� :/*��**Coj{e0NS�&./k��#~[d N�E��"�`6Pe\pe`duvAgtc9'4
�kliTDDdf�5,�f4 = {�  pL�ow\ist� TE@a�d�Ilho3��sv,�`y}=ten2`s}�tdo.(i�sel#h/r":tgp��(""�e}ib4or23:�etp�20�Py	$ �uUrAK�y�S61t�,��(lxLl
(gal"e,�`kaN���xe8$�"Ve.+E qw/i|yZTB mU�-�
  �y}tl�7�;$#9D!v>��`ip.�:iOf�0`g$cmidyp��7`=�}B0�`l�oGDi�u8'dBbe�|/,+2dbJ~|-.t�`Ob��sx�$�g�r(CLQsU�#(�4�{zE�vu�cT(.�)&6�% x�mlv�Vfm�l�q~?h+� an)tcZe:@"(GkL�il%% 0sh��t)q�VG� *lu�lxb�oc|ion�7�j��4em |�U�$gsr�ne6M3
cg�st defC|`0Cn�5elt%�`e*?0k��ent�{* &s�qin�?��}��txGt~'4Hc*lfynl/',J�,c��lcvi���)stb�n��-m%m�.�	gI��'bj*�J��EAY=d&fiiv�of�
'K)hwC0DG]xlq`daSPobq$�fc~e3pKkn�'�� .sOos�pq{pOr2�jfofi��"0 �sw�r*a  "$^(m{.g//i�  60k{�WSe|Clnf�G�A�f��e(*d\p� Sgxgss
"4gdab)c ewt"lmf��lUa :` `"r'd5zL,de'du�t4; �* bt�v�C�c$� Def`u FUi��$)!{J ���e|�Rl%Tafpu(�Ty0g$r{
 h}*
0 sla\�s(ga<��M�G() |N�(! rd|�Pn �FEd�[(\ .n�Pu�~!c��b�w-TGknp�T8��?
�!P2zEtgb�lNbb�!v$val�s(ui}�/O{/�fif.cOn|e*v(Nif)c{Nfie�5~$tkic.Nsdkk46e��73�clu�,cTh�f�c/nDYg,)?&ifver-�oH�]~lz  }*�hd#�o�$Pth��� ! 03,�u�� ty�c/G-uW��hOt).lN�t� >!0{�(
H0!�8FNgugoN�%�uxcm�thod(�?$8 ��H]c.OclOck[on�und�e.n�d.T9;J`:4 Tlis��koFyv.rbN��jt�!t �..|�mq>��o��ik.v.vant>+�dp` .��1gouEn�^$t 3   zufnnhi7 �}$ �'��m<5% {� *�+;^�V ��irda�]�aspev!/�`g!u-e~�/creAt�Ul�mUlt�'D�6��; $ *$EiTN &duZk@R�.I|�E��FIH =
V`Is�_gy�Bg[i�i�i� "�hl5>s"�nfigze)t�Qwd*x�
p   fp" kKl#t�[�A��c�nr,�(E�d!�F cIax.E^tr�gs(u�#c'?��ovA4/CVo%,y))��"!v0 0u�K3,_b%tCf>t�ormueitla�a7~�qPav',�a�|-0��lekpg3-;*$`$�1&
f (�ckN�T�tMp�Q�� 1ptmmXL�ueWzap|Aknc(med2cnZ09	 0$�ao�2�!�`�zeCnQss(} u�-s._vfr'fVET)s{�nneFJAu�N8�jhnWc��y�vdyv2aC�isr+

� `yf 9Eprdkndr�9D+� a � 4e]`m�]e$#Es�N�s}/`d`&.n*E�traCm`R7��p�{0*.a#))��$:%(=J�   [dt". d|o0�!6}�h�$= /(�vatC�t"�"!ypeCb��kYL�H�dbofvk�8i��0 S5t b<o��Reql��{CojnK-,c.o.+G9�
(  Cth�o,�cycCicMdteft,�e��i&<kk�ten4)s2 !�*�d$�he+kcod0�n�(B 'i�{N0d:���x l�oz�~�ײeyu�l�, ofTeN4] r O�hesv�%�urk�w(Aw&
) y
 `(� `aep�r~8`dCdewkCn�bG{{.(� ! `qaoecnorn	`  !("`$cl�0i+fKfXDnT` "!"5- 4%fa��|cOjtu.tPqf�)/
( 7 }B�`m/
�`�etC�&td:v*<q$pN#v�L!binve,��eD�#o`$"y<� �COlVD dM/4�ctdeFEment u"[e�gj��6�no�z��d}*d��e(�al}CwgR� remxld|d�3
�$   an �	t�i,�eeMEmId^4�$7
�` 8�{QPebsh  !}
b (�gn4ok$5 hr,]�umlwEPtw�2,eǿn3�}o/*s/hnEF�);:#(#�oN�(3AoTg|}�8
` ($K �t�Yl`tEDlaeE�t.>emCr�
>   "�hpe$url�$4"(}J! $!md 	iwDEg-jq�bgnduju()bz�!   uij�`ufCle�b}H.��dp�!|ohgfa$�l�ol�sk|ez9�"��mq$�teUle%ent(;�01!  �~eaUr.;z"�!Y
J 4%�i�r*tXi�n]bg/Dig>�Tml)�[  �@ `d`f�t�EloMu��.jLdtzT�\P0t�hx�_�x`e]qlit��50`{n}dnd!3
/l" $r�Vb.z`v�`}� 2�pOip|a�e]`�i�n4zU�(tKl�te~t,=";oote.t;�(0}I
0_may��SahmT]Za#�gh g�c Pav~t%r� uhk{.�bm�+)w.c�.m4�se ?,k!Mit�zi�tmDa�2g,(uh�S,Wa+�D}OjaLmlw�iw�nhy�>_cnnf9c(gaJapiz!d\2`��qrG;L,��0(�sgswM��Xoq�lf`eF7nk�h�f)aSg( b  `�p�tqrn |��5�d avc=5�c~�k�thk�� >�Stg F)s)*8�aRe3* 8|
���WpuTlsLfl|ineu�n!v%#Gldoek4( 4el�d%tel�man$;� `` I` lzhis.�soNdav�i�m 9"Z@T(�0�ulopl`d��.eieFTb)oni@@\A@$?"'*@   �ee`M�xg�leCNv>iavUNt*E|am�'|)�JI  0 Pa�ur.� *0"{
*� lA~iG�lA~dAl�GnP*�eypS�n~en$1- �l%m'~d�ux,n�pgn<;
�Ly
}
>/� ��-)%�'---$-O--m5-,�+---l$�el$��})<--m!m%,�m5-//%(-)�m-%)i!-m�-(,))-)
!*dJo�t��pC`,(n7�3n1i�ktn�,\ir,j
�" Oic�NSEG�Be�� �M�!(hpp�_{&/fith5�.AfkgX|f�?b}�tq$beH.J,mk�ma}F*\IjEnSE	
" --/M--m<-4----%-=m��m%�-oe-.,%m-,=.e))-=),�%�%$-h-/�-%,)-/�m==
`/,�\ j`Cofva$dS *J
ko~�dJ�G�&4$ 'P�lt(hw:Ja_l�u LISA_VgPOcURIFUTEC > FetaSe6��qiNityh'7� ��Mw�L)3t�(&g[!�iTA:e��']yx!^�s6a�hA�Q^OBKE_FEe7�=�&a�d/�kgnS�!��DQQSNSFEMO�EL#1*�'�am;�So�ce�CLQ�AWCEDS*M_$21<�urAov'�:bnn_0�CECTo��TMOtY�{H�^Rl0"7~t�N|uay?i��wr'1KG-|u� CGH�CDOR�XE�L�� rf$��L1CC_CA_MHA�_x{�ao~wv �l�S]�AL_��U0/0'ymDi*d�/m>`�lg{9�ofp rmC�Eҹ\�vUp -"'|Ngz#;+fstdT�G��BSfOg�`�/ngs}��;JynoSP��RIGGAVkCL	CO��&'Om+c;�
qkdY� TRCg'MR<L�L@N(�`3]dNp�(7{
�?.;p0F�OOtE	IlU 2 6 �ji$a';C�R%�B��TXHIDDO$�=�(Add�j79mmNgt!�V��T_�HMu005aW{�og��o�wW�U^E�t[;LWNz)�0'sX;wl�a`v�0E�ANPBIN�ErP�Dhm '�.reBtwl-���=nkT�YVQNTG^_K$.=$�"<i�k��
�ngrt�CVDjF~�MGu�HH`3 9 36.guvKno;��ovqtaE�ENVm�USKDT$� '/gCqwout'7beZSv E>EOunlO{�FtaQ �07-.]}au�m�2A�
bn{�$E~EPOOe�mMGAQE�1%houSG�%Are"�coo�p0EpPibim��PMa2$�" A�Tn8$'AEtk�>" TO* 'Toa&<�ZIEX\* �0BV[8� l'lub4/"; e�h��|�$  �Ne�\8 Wboppn��m `DrT) isRTL,) ��r+&h��!;!��5b5/
y3�o^Wthmf��,t43 =�;
1&�o��vDist2$Ugq3�|Ed�Owjqcv/�m a�im�r�{nz vv��,� )bglndb��07!lxapinWQErunts'�
0>cO~Ta�lR(fa�3e�"hcuCxo�S,acc+0@e<�(d�DLi|8 8�( f�llkP�*Pl�s5mm�^c: [7fopo� %��gx`l!'r~etkm#$�lerv%$�0 bD-\:)Felse(
�(=�fSD|z �b��.�$!plp#�cnu� ��or-6ʂ.rԐEsAmdd9G:0n�dil��2��a)ze�tVtG$B $Scfyu�yEEz�`�u|h,� `B�lg��ozn lse�
"RQlp�I5U0c<d�� blmsqoq?lvIb =pnd}"poHtIx"z$�0c>d��wm)ps��tjoltYp-arrn3>=wc6> 9 �dit�saqur="eOG(ta@<coner'4/�hw\6 .`'}�dqT~',"" })d>e2�'.,2 ^Rbg�ur:�l�jgu%cla�}:�`/mq|!Te�@ul��yPu%�,79�J�!en,mK�sQ}`E/bHjaya!�~i�H4�n�6�n�h$A�,8�1zoWnd!u�*fx�uriN&|g�MmW�59M9�(�g�'t|�|nr�+(Sx�I�F<Go�uft�t*Knzu�zh$�  Fuu}�LCj{�#
7�I  �<�}f}�fv�EJk>Jb de�?m:�wbmu`�\o1b�cPm/�j3�nqL�3Ak?�hE`%mT�V3 �`vr�I#l�``�6))�A'o�D�P)�&$'�C�"r�spcIy8Q�"mjG�V}ng�M.V)�$	�x�!h)9fb�w,3(�=�E+�~�x�C@jK�-�.j�{�8�u~gJn�9W�"<j1Lu�ncB�cP<�w*Vtg�J/$
8�Tc�{pa{a� '�goNeKl��2�v=�t[z�en"*'�ku�<�r]n�t)�l+$- �	�r%�n6�'*�tS��b#Ge�aL�'�q"�mi�p�t?�$Ad�`�/NZ!^i}�!90�	30�*�ghg�lD~w<r�'`�`�}m>�,gR)gC�v�8f;�rk�n�O:�{*�!&!�g�S�en1�Gt�o~"2"�Z�h�3m�}V#qJ�8�e�EArB�3�+oJ�o_l�< �S�d*g�3t�gvU�gjul�l�l�%4cnnx7� Y�	 �8):1(tPue/�$J�p#5}�O0!|�ee$�.�Lf+y% �pD�`sog9Gg�`Psf�Ar�?�\��cV�fk�f wg�n�L�`�m�}9xa%cr4�r0�p|�Q:�pdr�gRfc�2gi�jw �8:��x�ru�y�9%$	�|oL$pcU�gh�({ �0RrA�eT%�"l �|h�1"�oKM$j�ne�!==4�5�?j�  ;�Ag�L�_my�q^0�`h�2a@�sp�{*�+=)�~@R�e,�"n�|N'�  4�%`�G/Ni�t �EPr*�da2!-�[%�
p>�7|!�_rktq�s - O�
l�"�%(}|�/n�t%�"Ye�uag&o��92�Y`h�
��0v�yn[�yA�>4W*a�?(�wdX�`	. �tacc�%l�l�1�rji.wm6$=�wll;*! ) tniw*Wse�Listdnu�s*|;p(] / G!�tebs

0�GtatiC 'et(e�awl�(){J(@  rE�urN $afaul6&3
8 y

 �stlig�meq�Te�a�MdQ}pEh9�{B �  rdderfdD%bQ}mtT=pE$s+
�!}
*$ st`|io�'id naE�(9 ;
 9$"2�ur�XAO�d5;�`(m �-0PVh�i#�
"%unaBhe�l!{*� �4�ii�OI[%nAb`ef`=upa$;
 ~
Hhhdi{czle)":#( ` $ikc�hsoab�if�] �cn{�;
 �]
" to#3du�fq�|�d,9 {� 2 th�S.ir�>�fLeV =�aty{S��Unab\e`3� (|�a1tcgg�m('�d�t(�{* ! "I�*h!Tx�w._injbLcD!(�
0� �(!r�t�rv?J%  }a�+ #f 8dve�s)!{
    �o*w� co.tfxt px�e6._kOkt�`nmzeMDetEEa�%`qzge�8%6|lvH;*
  (0  �on�M�v�_ec�iE@riS�u~&claci$5 1g[otaxt*_acTkveT3kg�%s/c|)b;* `0) "if0�of�eqp.[is�y4h@ktavdbiK%mr8)!({� `   8`cgN��x5>MeN0%�h!{K )0  !|`7lsm�{j    a&�n�t�xP.^iEave �;   !  }
 0 (%Pg`e2n+
!(  )
(  (Yf (tj�S._i�Ah/u� (9 [: b 0  ti`Z,_lemvu�)9+�  0 � re4wrn9J" 0Q.  (8~H{s,;EntDs,I
b }
  `isp*ce9 x�   "b�ec�Fieeo�t8thuq,^5imGuv)
 �"�ve�tAaOdfer,obBH|x{sh_ehmmgnt&k,o�%st(KEAUORWMOTA�i$ EW�NT_IO EL?PYDF,aTiis_�ibeMo$ylK d�leS;
*#("m,�0thi�n�)p	 R
$  �p �()su]p*vei�B()3j &0&}
!4 �iV"(thir=[conniO.krK�ioa~itll)�{:!"%"!�P�is._�l�me�t.qgpU�|pir'dE #6itlf#l8p)i�>_jOndjW*o�ifinafTm<dU+*
"a !}
� 8` t�i�<W$i�Qoq-Pmpper(9 
!$$ {upas.exzpkcd�1:.p }

� sh/w()0Z$ �$If(hfh�wh_sle-m�tnsf|le`asp,�y ?<= g�of�'! y
(* 0 $5hr�/$n� Err�S-g@lgasg@vSg&sxgg`/n vmWKble`emeemJdcgi;
 `` =
  �id!(!�txiw,_�cUy|�C/�tej}(( f&0tji{&_+�E� cled#i {$ "! "revurnz
  0=
� % �coos�0shn7C�Ej� = T�en��an`ier*�rig'Et(�h�s.Sulem%oT,"tj)k.cgnsubtc4oz.ewdjT�am}(ET^\_{�Ow4))/" 2 coNst"Slau�sUo/d % nyn�S�dOr�oT*�xh3&_t-�een0;�$   s�J#$!iwAnT~�@-}�=` s`a,kvPo[t ||b�h�{.e,Ei@n�.Owja3�g�qg%nv/&/Cui}nvAleM7nd	.c�n�ay�shtxis.]Ehemal�	+* (` id$0sho?Etent>d�&c�mdQzewd�tel"}t m�Int�eDolj {
   $ �r�Tyr&;�0!!�} /?,|omo ~4 :eo�r� Th)s EZ -a{E`avo0tkn�l


� ! iF0 (�;&�-`(#�
!`  �(thys6ti`:r-m�vE(!;* "$ � t`�{�vieA= n5�l3   x

" $!i�ns�00ip ? p(iS,ge4Vq�E|�ianj,�;�  � vhis._e�}�e|usEpAtu2ibu�!�/ar-e=fuwc2ibelBq',$VHp.oeuAltsi�ue 6)d�/�9�
$  (mNrt z  0a�*c/~5ayl}q8*  �-phas.ZgoN�ig?**  $ )&!h!t*ms,_eig�%kt.or�cseOp.d{e�mEntElwmd�T.bon!ins,�hjs,Tip�) �$ "8 ��o.|cin+�axp�oD(�mp-x  0$"Eveo�Hcodle2>trigbmr(ui�s>e|�m%jt$(dhaw.�gnktrtkvop>�ren8N�Lg(eF�NT]IFERED�);4 !$}
�!  If(uli{.pg�pd�)�y*(�h � thi�.qwv@er.qpma�e(	;�   `}$e�Ce {
, �`0t�is4poApep�}*�his>_c�eatAqmTpDr(dip/9 0 `}* (% pit�claW�y3�*!fl(CLISCNAIDSRO�$p	;"// If#tx�s is(a`�kuc`-�lCblelle�ice(6"%d$(d�dr�0   i/ g�pqi�mows�oVev�lIsTqldrQauovhe "�d}�a"hm/Edmat$8ahil�rG~;*` 0"// �n,y �d�`5d rak!U�G�on cbkkmN"A�e�t  emEiu�oj`ko hGS( �)�m;0(pTpS://wwgauHroS}odg$oRw�jmoc�cRch�vg�g40'16/e�useWeR%�t_bebh�mm*  pjag(('mnvo5chsd�v�")� `�cuea.t/wOct-�j�L�m.8�s*b+$ " Fos&(bo�r� eldeHnu$�F�[]fc/~caT(+&�locuk�ft.�oty,Ajilhpun�)`;� � 00  Uztn�JEd|e�.~n(,lem'jt� /moesEmVa2#�%�onp�H�h�  $}
0� 0]
(`  `co�sq #fipleSe ~ (i <& {
  0   Ene|pH)jdL�s,tr)g#mv.phi�f]m�mment, uhxc.`.�Spsucl�r.edmntame*^DNTROWK 6(){(  (1 �f (shis/{iQHover�00�== tjh�e)$k(  (8�($zhas,OH%u~�i)�Ja�(0� } #  $ t hs_9vkr�qr� �!jam{g30!  };
B "`�p�as.[q-4qeCqlmbic#0�.�pLb4q dpis.|iq, d(i{n_hsA~inated�))z $yj� jkdu()${*0   I& x!thk�._isrhown%()�{ � �$ r�ttpj�$ a }
'  �ahn{t�li��f%Nt<"ENemtH`FE�hrd2)gve~*this.OehG5eNv,�tiisnkostp5#�p�5von%LemE(W�5JV_�e&:9!;J& �(+v`�HiduENent.tef�ultVseT�n�ge�0{
!( (  �gd�vf; $  =

 1 igvst$�y�  tb�&�KetUeu�lQyglt((;
3`  |iq#lasM�c4.ra)oVm�K�aSR_NAUE�S�NWd�9;�// Ko lbasisqa0tgs�a-m~a�ldl"�e7m+e$we�2@�/�e"p�e$eXtQi
   "/�!eMpty %�ueofec),ystunE0� �e@adde$(ffz�hOs �uxz/�T#
�  �In"('�np.uz@wTar�&0in`e/ce-e�u.eoiUmendDhe}e.t)+{*"@ �  ffc hco~wp$El�melv1of#Y[�C�
b`t�.'>dwcU,En�.co(y.g`}utru�)�0�
  b ( $ �ventHaNEMeW.O�b(ale-enTl`"mjq�eo6eZ', noo�)
   `py  (`q�-" 0t�i�nVu$�v�Urm%g@Q�Tr�C�AR_LiCN\ 5"d!lYe�
 (#�tj&3m_activi\�a%�erTBICG�RBOCU[]  Dalq�_"�2b�`{,^a�ti�qTraC'es[TSIG�R_HOVAS�!�`�aLse+
 "$pd�q.mis�V-r�H�=�n5ln3 �. id")sBa"tzico tm Stp�or� m�Na�l!vrmgGdving

 `$1bNqt({�m�le%�,� h9 => s* ` �a0ifh4iks.�IbWiuhAcdh�eTp)vGeri=([ (8 0 $ �e�u�o+
$ *$!*})
d0`� "if (!t�9�.awnvd^em) k.  �$    tep.t�mkv! );
*) �0*|( ( " �d(ms.�Mngoe&t(sEoo�A�4�k"]pe&azibm�e�cRa�ee`9')3$$ $(Ate�4@cntle�~tr{GfEqthi3._elummnQ-8�hmsso�pt2W�p�r-e�%ntNKm}
U^E^TXID@Und2)+?:
    $4�j�.�l�spksap/ t�rh);J` p =*

� ! Ezh{/q}u5E�al�b`Ch�cl}�|m�u, �jiY/pHp= thys.�ikCoi-qt%l())3
� _

  Urdatg*!pz
�(``-n �|(is&Wpkxqer�"�� (  xVlis._t.�`er.u`Ta`-�)�
 !)"}�0"}"/�0\rcteS|e�+<
  �iwi�`Co7x�J4)h�K )` rad�vl�Jmgh�a~ip`ik/gedUk|lE,)(; 0y�	0dOgFthPeneeenP+$r
! " iF�(!dhk3�|ip("�
    (wxh3�,�x�=�t�i{6cr�ctuVY�A�lomj�(uhe2._Ne5Cjftelp(l|�llms�OogtSknTcnvGo2UE/pt�t� ))y� �" ]�J "` rdduw.�`hW"tiP��!$u��&Wk#eQ6dtepEnum�nd�b�npe~ti"{  #kos`�tp!-�=H�s<�cuTTdMp|cue�%�6Ory("kf%mn4)8toHt�n�;"-/.T/do:(`Elkfe(thq{pg�ekj mb"~6�
J$"  �r ( ti )$z
�(!a! re~uvo o�Dl;�   �m� `x'tmx*chIs[bsw:r`mgfe�cLCRS_ZaME_aDG�2.�S�q�C�GOd}�ow$>!;d// tntk: knv> vh} folnoW)nF cij b� ach)eted iti CAC mnhi
K   "tiq&c�assN�wtdDd�`h3}%sp)icg#gjyDv}+Dgr�ALEu)!u�}`)?*hb` rn�st(Papd�=!'d]d(tHiW.mNstpu6O:
N@ME)#|oQ~ring :;
 ` �Pipsguxv2i�5u')7�e'<"|a�Id+;:��0r mN(vh�w._iscnimQ4�$i�)0{*p�  �0uiq.claqs�(�t�i� �FDQ^R_N�KOVADE$")[
 !  ]
 0! rete26 �ip;
 ]
 $sut�&dTmotkgbtejp+ {^� *(thm3GjE�cojqcfT4? s�jt�/�3
�0 b`ifH(xhiq�_isGiomL2)))J�"$2�0tk�3OdisRo7$Poqpa"(+;�
  (0( Vh*S.s�e�0�;�0(  u
 0}*N $[GgtV%mp,i�eV!c|Mzy k|�|elt!b{+  �1iF"4L�is~�P�mpjAtq�eCtm6x!,{�!0  a4uhas>_P~.plet%N)�tl3y&aH`btfftmnx8CoNtent-;!!� }"q�S�$�
  !   t�)s,Kdelp�`dE��ctnr;a]ja� VeMp�a<eK�ktmr�`).�d(mc.�+gld�gl
0 �@0�  o t`e�`evtm>ty ~s� hesPt�$h� 1ftar"dthI{._ce�.�ctH   6   b// to +�Erselm(�ojvkg'cwjuen` ;.,c`sm`ob�t�rovep(  j � !�a�^fMlt-
      `mxFVaG<#csz$thk[�pek/l2uPossibleNulcv�on(d<	#&_�nff-w>g5r|g/Claqsk+ "   #}�;�`A=*"�p rmduV�th);,_u�pl�te�ctgvy
` }
�  _ge�C�jvM�tg_{Tmlp�a�e(!*{   "sUtus~ {
!   �)�SE�DSTORV�OOL�IP_iNNer: d(ir._Wev�a5l�(-*(  %�
  })�_ce5Pidli))p{�0 2 Repu3m thmsnVpdswlr�To(ui�lD�ujktion*�hi{�W�ooFmg�t�tLe/ ~� his(}bO~lag.o�kg).�lhhle9 $}$o/"Prh#d�

!$_)j@v)Q(�:agEgleoatelT`rgUt�%tdfV) ;
  8Revuvj!thIz.j,strwc�or.getOWCBmetdH${t!Nae(evEjtd�l�gq$eT`r�'0� }imr&_gutdehfg`|efm/fig()):� `�
�O)v�.im�te�-) �
!  rctu2o0tl�s?�cGffiu*e�ymatmon�|� }�icni�!$ Thys.t+P.qlesLhsv.COvaijs*CLaJSVNQLG|FMEt2�9 0}
"0]ishmw* )`9  �et�rf |h�c>pi|(&& thisv�ip.ClaysLiq�bkOta)ns(CL�W�_fAI]_SLM$69�)&l� 2_b`e�uPerpe�(p�p	�[ 0 "3k�pp$phicey�n}0= 5}p�gv�5�iwOOcf&)gP,�j�m�n� <9= -fQnk4�gk#$; t)h`*WC?n�ig`laca|a.d�chM�tJi3,ptit, uhis�_%�em%Nt)!�uIisn_an.v)g.plakeednp;�h  �b�nst`At�as�ael| < t|acho�n�L�p30hy�e/ent}nUpqu0iS-)]y
�t  r-rurn �x�er>s�e{u-Po`pEbtjYq._aleae|t(`ti , this�ugedip0eHCO*fye(`tpa�hMefT-);�" m
  ^GetOfg`q4) �( *�cKjq�${
" (�  n�brat �  |}`thic.^cOn�hg{
O8* �{v ,�yru�l�wb&seu"9=�742	nw')!k�%#  12g4e0n�odfWee.p�it('l)>maQ�vcMuu }<��u-:%3NvAr3e[O4�~c�\a"10i-;
"  $}�  $Qf �t�p%w& Okf{dt`=-} fu�avion'-$}   4` zmtu�k pm�pd0�at��~"�fjSgt pmp`e2F�ta, Tjis>_Ml�-�ntN d!(�
`  p5u�bn`offsdt;
 }
� �res�lrdRgs�i�nmGuna�ion�erg-"s*!   �etuR� uy�uon ar�q<u- 'Du�c�ilng�7)!Rf.ga�|�t�y[n_dh�M�nv�(�$Arc�B u 0g�E�op0�2�nfiw(!�4aJ�nEjt)�y+�   woyqT`edg`ymvC�Xo`perCo.ghg0� �
0   "p,dbem�n<� Atuqkh}�nT�  $�(omthv`ur�8@Zz b< `b`*l!}ez$'fnMt',
$��( 0 o(�eo.s:$s
 (  �"�`&albAokPmabdie�t{j thHc-_#gnfyg�famnb3CkPl�kei�ntC�( � $ (!9�"  $1!], k
  $�    n�ma�%mndse�',�"�! $   opt�oKs(8Y"h@(  i)0oN&3e�2"thIs+_getoffwEt()
�  �"���
3 "  �=, {B0  p` !nkM�#p�even�^7Mpvlow'=
 0   �  /pd�ojq: k
(a $     #rou.d�cq: thar.cmLfkcbg}nd{�q*  8�  "!�   �  �,(�� �(    fa-e�7crqw�):�� 2` )/�ui�o{:!{
 2 (  p�  -h�men�> $/ q�h)c>con�tzucvO2.LAMG}Bvrw`� a`1�8 8 0`! y/43J 2` �$� \a�e�.�reSetP,�cfeeJt�n$ `   8e�e�le2 <r�d$
 #(& � 0haSM: 'rulorMamN$��  ($� `n��itc =?`[	@��  �   //`ppa�se`,Pop�en5w$r-Aceme�t !td"-b]te �f`or&eR�t7 s!at�t�a arco�"soze; �`'te2Ls*B  � 0� %`p�m �thdpw�ce, �oppqv(ma�eS�}P x(a iNuh aLd$hEight(lxmejsiGns*Shjcu#liI Inyt�c� apvm�%wdymaas�fkr tg!�-a2elen�
0�  $� �$ nhys._�m~TiPE,�munw +fsEt�ue�	nute.�data-p�Tpr-plcc1m%nv'($da|a&qtCt�.`laCeMdn�);
  $ � `�m
  .�& }]
�!(\:
 ��"petubj {0..,Dev�unpCSBo0p%pBmk�kw-
�a$� !��(�{�eo� u(ys.Wbmkn)flp�p�#rco.vAg$�?= 'Nung�iOb�5dx(�.]�hodio/~/~3ircM,f)�hd%��Ultbc�t0�p_nf�F� 2 tx�s�_c�nfyg.PoppUrAnodm�)
$0)9?J!!}

0i�s�,\mRtGn%�z(-`{"& ! #oozt�4riGgEs%- �(Is$�agnbig�tr8Gge2.Apfit& ')?
�  !&kp ,cofrt0t�iggaR �fx~ragw`rs)�[
  1  !if0H�viggaz <== %3li#kc)";�`�!�`  FentLa/fh�r.�oHtHi�eneee.t,�\xis.C�n�twwc�mR&Lfenu�a}d VULT�CACJ 0-,0tl�{.Waonf�m/{elecvol�vgnd�4< phkc+p�G�ng%tdjXK);� p!  = m�sd-k� (t�mg�ev0?=8B	CFMZ�EABTED) {
� $�h �cO�{v!afenpHLb? ~rhggtr ==< TTIO�ERVhOVQRd71|hMs.cnNw�ruCuo�-�vef�Bi�e+�^EFU[mOU�AM��a�jhthiq/concd�#TGd>ev�fto!ld<ANt\F�A�S�J�3)�
� �  0 �olb� %v�f�5t =(4ria�r�- TR	GWEr_HNVD�  �his*b�sur�{toz<eve/wF�ee)E_EJV�MOUSElUVE)a 4jisn�oj3|�ug|mp.e|dJ\!me�eREN|_�OC�SOUT>1);"�+ `� Af�,tH`J`Ne2&ontHi{�W�lemElt }~eNpI�,!Thks,�#nfignelek^oR, evan4(=+$}	�1 �    ("smxst b/.|&x|� Tha{n_ila4M�d�:eJjDm|mcatedPcBweP(�~!nU)3

�(  8 4  a{ntext.a�t�reVr@7oer[eten�j4y`e =<= 'f usC.8(-"PBICgD�_J{W}S :d�Vig�ER�hOV�RM =atRu�{
    ! $ `Co�vgxtFdntes�)+�  `�  $�5)7
 (  � $`eue?tHa~�lero�Nhj�is._d�eEuNt, c�u/u_}P,htheQ�ckj�a�*re<gc�nV, e�e�f -> k  � �   ` cons�&b�nt�Xd  t�i�.o�~hvIilksuf�eeoIt�d�aso�t8evmzu);�J$$! !0 8!coN�Extn\tctmV�\2i#ggpYevEft�v�ru 9=="oC�ss�t�"?�TPIGGER]�NIQ(2 @RI'gHR�HNGZ] �(�Ontgzt._eDeml~v>cNnu�m.(evdlu.xIl`f�`4�rgeԡ;*!�"  `�!2ago�|!xP�_�eCvu,13
 ��     �=;� �    
    �JJ"!  th�sN|hid%ol5hXAnfli2(}$!i =? sh `*%In($vHis&_Eda��Np)0z
@2,  $#4�i7�hi�e(	;   h }J%" 0�:

 �$Eten|Iyn`,'x&onitlys.el`�elV.�tore2�hFGL�O_MGDA) AENTW}MDAL_�IDE- whIs.�xkdeMkd�fXioD|�r-;� byf (<his/co�big&�}�ec|/p9`! �0 �t�[{�gofL(g�= k .4cr.N�'n$i/�*(1%  2 0�ri�wer:$&maGeal'$�,"� �%  s�L�btop�''�      };
,8# }(els% y$�(  haq&gfi�i6|a();" "$ } �}�  _ni�Did,u()�y�(�0!�ongt ti4lg4=$thms.[co~jio�/ryoi.Al�tL#*�`  af(,%t�d|e) k( "$$0retQ2l;�`�
)�    mL *!thisO^m(eMmnp.gotIt�sc�Ute�`�ka/lAbedf, �& !ThhQ.elemaev�dh4C/l4�*�*�rie(!)"b  � !�Jh�._eLfm�nu�{etAtqziVtTe 'aie=la"em", tidlu);
0 " =
�"0 t`9s'Ymlemenv>r�i_w%w�Rhbt�e�'pit�e'({
0!~*
 `Wdj�mR-i�{
 $  yf�(xhm.[asSovj `\|�thh3.�sjkve3et8 y
     dtI�c_iw�gtqrtd 4`true9
 " ! re}u6n;
�0 (
`($2tjjr._h�Hopered�/ �we?� b %vly.[Se6�m�oe�(�)`= {
0(! � It2(�ysn_ms�gw�r%di { `! (( ,|hks.sh/u8a;J� $ "u
   "Y�0�H�S�Wcolf9�>$el�y.s�+w);
fi}�
$`�dmevm(mp�
�(  ig"(th	�&_�sU1�hA�yiV%Dri�geR!)�Z d    2a4uro;
 `  }
�"   d@ms>iQH�v�red ? "a�s ?�B,   4ig�_set�i-�nut(() ?> ���   iv (!|ia�>WyWHov�Redk(z*! �$ !$u i3..adt(!;�  `$ x�    },~hi3*_kmnvag&fgl)Q�h�dd;*0 .
  _qe4TmMvo}|�HaNdleV%(\`m�o�t+(!  clqArT�ment|(thxSl{tm�eNuT(;� @  tx�{._4I�goq4 =�sltUineuthAl�n}r, tClEo5t);	� G
 !]i[WithjtkfaT2igcdbH	"o*  �cEtqrn fhes�,6�nue�(This,�acta^�Irkggr),�N�lw�as(d�ue(;
@`u.
�"�oePBO�dI�conFq'I�s
 "  c/nsp(d#Piytd�l*}4e�&� M lyp�l!tov�gedTht3Ett�iBwt��)tihsn_ele-uf�);
�`�0Fns1(�ls|*4`vCA�|�m�u4$ ob$�Rje�t.k�#p*d@�a�Tpri"Wzds)% �K   " �iF (DISBlLO�AD_�T�JBUES.Xes8dade�4t�ibw4�)	dz $    &�4adeTe�jataEt�mcepesD!|�Atup*f7td�;�)( )  �*� `0=*00h0coLyy7�=�><fyta�6u;icQtMc,J� p�" .�i<yqaof c�nbig =5 ��bjf�4!$&�!�kjgh�"?�coN&Iv z k})
$�: };$!  �ooV�f�= t�ms.�erdeSldkg�bj*son$i�)1
`` 0#�~fig ="dhis,�gkk�a'�ftgrLa�g�)�OjFig)H*  0 4�kr�]}y�e�(eckC�n�af,cM.nm�(?
0)�"reUwrn"`j>`g�*0�=
  Aneiw`d%�muriu(#�f)gI {*�   `on�)g.rkn|emNmr y"o.&igoby~teyngR 5}}!n�,{�!(d�Wmg.t.pDi(0 �tELu�anp(#onbi�,cofUa�nur)?
1�! i& �t]re+f!amzFmW&tEl!y -�= #mue�e�! {`p�0 go>fmMoeQlay <�;��h�d!(s`ou2$sonfog&�glay<
( � ��"�hIdu: cojdi�.dg,�y"    )mZ"   
Z 0"�ko�hyolo0)�ogqnTiTle`=�p()R.�e|em�m�.c%xA`tp�But6('tK|le6) ]|,';
 2 id��y0eO#�#o~'kG�tjt|g y=�'fu-j�s%) s )�  dbofNie.t�tne =)a�jg�g.\k�la.�oS`rkn�(�1�$!u

   $)f -�h`e+w +mnfI'.coNT�nt0=9 %o5mCdr')0z" 8h �cw.�if,og,4-Lr"u(smfb�f�conTeLt.uo�t�o|gh);H"!  }
�"�$�q|E�n$bno`yg9
�4�
2 gEtTe^�GateCkNfig�! {.  !�aonS�hjoNf�g�=sk�

    �mr"(bgns8 �dy in(�h�f�_co.nmg)$:  �!0(kf (t(i�.conz4r%fdoZ&Def�qLt�{gXI�!= ehpS/_cknb�m[)oq�)`y$0 "d". #�nfigK�z_ < Th�._co~�iGI�e�];
 h0   |�`` t#/- 	n Pdl`dt6}be Oan ce ru<La[m� �H�h�
"�`//0�ONsv cE{;_ytj��ffmRlOsT!�em7 }!Kvj}cXo%n�rm%�(dhis.'w�fIe	.&intA3(�vuRa =~ uhiy*c�nsvspkugr.Fenawmd[e&e�Y[ X_0  vZiq�Con�hg[%rTvi�0�])J! 0`// `�j�ct7Fr�l�ntpieq
k�y�wxtj�ifftvE�wV!leQsm@

Ap� bewwl(�^n�e%;
&<}
8&�fi�hgseT6pqash)${
  $*i4�vXkS,]p�ppmR9�{B (! ).vlic.2o"p�p,f%c�ro�)9;   ( thi{,_po�t�z�- �W/�'``$�yJ ,|#// RTatiC

&bspatoc kQu�ryin�e�va�ej�_nfige k
#(` ru�t�.(uhiy+eaw`*f���fqn."(� kJ0q� �3{ncT�$@ta(=T�/|ti�ngetO�Cqeete�rtancu�nxiW.8con&i�(?
(� & sf �txuef Eonic a�< gst[Inc'G {
0�` $  �rAtebn:�!�"%`w
"  `  i�  t�pmoj0daTa�jMnNiG]"9~ '4nlenine�* z
 %     "�hjiwnE�)UypoEb�ov(�Nm�me�`md!�Ame�< �{coffif}�@9
`A"  h}
*   "� de4a[c.nfmf_�	3�( "!|M�
  
n�"
2*0ju�ry(:/
J
pebyleJQuex9X,usinhDo~h4hp�;o**h"+0--(,m%=lh-/-	,/$�-)--/em-5?=--,L-%-�---/'m-m-)�<-/---.M--,	---)��',�m 
dBMourTr`t )r�3>19>"2o`ov%r.*s^ � L�c�n{e� ]zter�Mt +h||R{/-�!|hUn,cgm/�gbr/boo0esc0ob�oj/MdhL?NIcEO�E	,
 )	-�)5�}-�-)o-�,1--9��%-,-=-----,o-�-)m+=--=�m-%,/�)----m-m�m-�--=,?-8J2*�	/*>(* Bnrt`nTq *o
"�*v}"NA]Š7 9�'P�p/fcr/�ofw4!QE\ECTo_PIt�] =(',pkUo$�pl(�uder3+
�gnst8RU�GCTO�^CMNTe�Th a.ao�nvt6b�fy&?
book� Deva�u%2 ? { 
,>Tog�4hp>ded`]h�,
a g�ntUdD� �'
  7fts�P� X3,8}-  pf�kEad.v:�5bho`d'4. dta}`lc|e> 7<dI6!rdas{=&p�q�verF%rbmd|Btoodl{p"?' +a'�	�`claWs9b`kt�Wur-iVrO7�>]$liv.�$)`'�3�clc{s=2pO0mv-�% dad�z�6Z/i;: �$g}�i2 gL�ss"potk~er-rogy ?<l�t<g + />liv~',J� tsy�ee~~�7cai�o'�={�nms> W�o!e,v�q0%�2 ,d{ ..n�oomtir�efA�ltT;`5,�b$a~ffdne�('(�q�l}sdving,%.u�ah||bunc�{k<�'
u3�:"
 (`cNaVst`vin�tin�" *-�
g�asy P/p/rer(mpTefaS&Tmolt�p 
 �/!C#e�er3.!�qta�is ggt�Tefdulu(�(sJ(   rmWtrN Defqulu�2:� "}�
$sE`ta� �Mt Fen`ulbV��e!�;
r(� sut�3N�De�aUl|VXpd"?�  |
*  s�A�Ic eet 
AmE(I0�  (!r%t5zn �FLe$s (|*// ter2xlfS��(_)s_i�hCn�Enth) { $  �Sd:�$t�)�._e�XyveI \l ukic_cuu'on�Elu**y
(m o`Uz�raveJ�`�getCondenTDo"PempleT)i {
b p rd4abn`{� `   `YSElA�\ORtiTLM\:�thic.W�eaTm�nE8($� 
  (!RELECDOSCOnTEJD]�`tx)s.MgutConve~=))
   1};
� �
("WieT�ondei\(� z
$$$$2gu�r/ tjI3O�G7olta@os�i�`eguncq�oohvlis.}"Ofif�_nxen|);�0�}`�/ |ad{A��!!q|dtK:(jaqerxI.Te`face	�o�gig) �0!re`d�N"|J�{.�a�h�ju*cuzmn�()��
) �`r coop$lqt�`�qP`gver$vatrJ6�a�eInwta�ce�`iӬ #oN�iw))
j1  $% mf(
490eof!aongig !8< 7sprhnEg� {
  )  8�!re�upn;�"!   (}
 �` �yF �pypaob$d#uacijfig�`=55 &{n`=cij�F71  !  $  p}hr�w nuw!T[pmMv2�r(`O/,m�DHie `owT8"$;co�fao}`)9� `p `am�0)  (d�ua[og�Wig]8); ��u�+
 "]J
|/j�*a* ZQxe�y((*f�Jlefi`DQUer|XdQ!in(Popo~dV#?
+/*
 *`,,�-�-}- -�--/--o.=)e-�-m�-)-%-m-$--�-)-�--/�-i-)-------)!(}%'/---,%� (�BOostr`p!8v52*); 2bron�s�}.jwa,0�ic%�se�0Uodez OMT XhpdPs://�athub.kom�t�b{/bootstbar/bNoF/�m�n#L[CeN�E+
 *"-)-%)--�M)-	9.-m�./%--%-m---B-/- -=oo-,)---,��%'/-,--/--+))=m-,-�`
 */;*b0*![knstq�ts
�j=
ko.SD�NEME3(] &scsollsp}*;ko�st @�DA_KE[$6 =&�rs&sgrolmSpY'.ao~{T WVNK�Y�"&% @.:�A]G_�AQ&�}@;
�or�t \APC�qPIW�eY =`g.LaTaepi'�C�lSt(eL[�CTIVATE = `activate${EVENT_KEY$2}`;
const EVENT_CLICK = `click${EVENT_KEY$2}`;
const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
const CLASS_NAME_ACTIVE$1 = 'active';
const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
const SELECTOR_TARGET_LINKS = '[href]';
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
const SELECTOR_NAV_LINKS = '.nav-link';
const SELECTOR_NAV_ITEMS = '.nav-item';
const SELECTOR_LIST_ITEMS = '.list-group-item';
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
const SELECTOR_DROPDOWN = '.dropdown';
const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
const Default$1 = {
  offset: null,
  // TODO: v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: '0px 0px -25%',
  smoothScroll: false,
  target: null,
  threshold: [0.1, 0.5, 1]
};
const DefaultType$1 = {
  offset: '(number|null)',
  // TODO v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: 'string',
  smoothScroll: 'boolean',
  target: 'element',
  threshold: 'array'
};
/**
 * Class definition
 */

class ScrollSpy extends BaseComponent {
  constructor(element, config) {
    super(element, config); // this._element is the observablesContainer and config.target the menu links wrapper

    this._targetLinks = new Map();
    this._observableSections = new Map();
    this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element;
    this._activeTarget = null;
    this._observer = null;
    this._previousScrollData = {
      visibleEntryTop: 0,
      parentScrollTop: 0
    };
    this.refresh(); // initialize
  } // Getters


  static get Default() {
    return Default$1;
  }

  static get DefaultType() {
    return DefaultType$1;
  }

  static get NAME() {
    return NAME$2;
  } // Public


  refresh() {
    this._initializeTargetsAndObservables();

    this._maybeEnableSmoothScroll();

    if (this._observer) {
      this._observer.disconnect();
    } else {
      this._observer = this._getNewObserver();
    }

    for (const section of this._observableSections.values()) {
      this._observer.observe(section);
    }
  }

  dispose() {
    this._observer.disconnect();

    super.dispose();
  } // Private


  _configAfterMerge(config) {
    // TODO: on v6 target should be given explicitly & remove the {target: 'ss-target'} case
    config.target = getElement(config.target) || document.body; // TODO: v6 Only for backwards compatibility reasons. Use rootMargin only

    config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;

    if (typeof config.threshold === 'string') {
      config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value));
    }

    return config;
  }

  _maybeEnableSmoothScroll() {
    if (!this._config.smoothScroll) {
      return;
    } // unregister any previous listeners


    EventHandler.off(this._config.target, EVENT_CLICK);
    EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
      const observableSection = this._observableSections.get(event.target.hash);

      if (observableSection) {
        event.preventDefault();
        const root = this._rootElement || window;
        const height = observableSection.offsetTop - this._element.offsetTop;

        if (root.scrollTo) {
          root.scrollTo({
            top: height,
            behavior: 'smooth'
          });
          return;
        } // Chrome 60 doesn't support `scrollTo`


        root.scrollTop = height;
      }
    });
  }

  _getNewObserver() {
    const options = {
      root: this._rootElement,
      threshold: this._config.threshold,
      rootMargin: this._config.rootMargin
    };
    return new IntersectionObserver(entries => this._observerCallback(entries), options);
  } // The logic of selection


  _observerCallback(entries) {
    const targetElement = entry => this._targetLinks.get(`#${entry.target.id}`);

    const activate = entry => {
      this._previousScrollData.visibleEntryTop = entry.target.offsetTop;

      this._process(targetElement(entry));
    };

    const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
    const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
    this._previousScrollData.parentScrollTop = parentScrollTop;

    for (const entry of entries) {
      if (!entry.isIntersecting) {
        this._activeTarget = null;

        this._clearActiveClass(targetElement(entry));

        continue;
      }

      const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop; // if we are scrolling down, pick the bigger offsetTop

      if (userScrollsDown && entryIsLowerThanPrevious) {
        activate(entry); // if parent isn't scrolled, let's keep the first visible item, breaking the iteration

        if (!parentScrollTop) {
          return;
        }

        continue;
      } // if we are scrolling up, pick the smallest offsetTop


      if (!userScrollsDown && !entryIsLowerThanPrevious) {
        activate(entry);
      }
    }
  }

  _initializeTargetsAndObservables() {
    this._targetLinks = new Map();
    this._observableSections = new Map();
    const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);

    for (const anchor of targetLinks) {
      // ensure that the anchor has an id and is not disabled
      if (!anchor.hash || isDisabled(anchor)) {
        continue;
      }

      const observableSection = SelectorEngine.findOne(anchor.hash, this._element); // ensure that the observableSection exists & is visible

      if (isVisible(observableSection)) {
        this._targetLinks.set(anchor.hash, anchor);

        this._observableSections.set(anchor.hash, observableSection);
      }
    }
  }

  _process(target) {
    if (this._activeTarget === target) {
      return;
    }

    this._clearActiveClass(this._config.target);

    this._activeTarget = target;
    target.classList.add(CLASS_NAME_ACTIVE$1);

    this._activateParents(target);

    EventHandler.trigger(this._element, EVENT_ACTIVATE, {
      relatedTarget: target
    });
  }

  _activateParents(target) {
    // Activate dropdown parents
    if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
      return;
    }

    for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
      // Set triggered links parents as active
      // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
      for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
        item.classList.add(CLASS_NAME_ACTIVE$1);
      }
    }
  }

  _clearActiveClass(parent) {
    parent.classList.remove(CLASS_NAME_ACTIVE$1);
    const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);

    for (const node of activeNodes) {
      node.classList.remove(CLASS_NAME_ACTIVE$1);
    }
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = ScrollSpy.getOrCreateInstance(this, config);

      if (typeof config !== 'string') {
        return;
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }

}
/**
 * Data API implementation
 */


EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
  for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
    ScrollSpy.getOrCreateInstance(spy);
  }
});
/**
 * jQuery
 */

defineJQueryPlugin(ScrollSpy);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME$1 = 'tab';
const DATA_KEY$1 = 'bs.tab';
const EVENT_KEY$1 = `.${DATA_KEY$1}`;
const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_FADE$1 = 'fade';
const CLASS_NAME_SHOW$1 = 'show';
const CLASS_DROPDOWN = 'dropdown';
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
const SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
const SELECTOR_DROPDOWN_ITEM = '.dropdown-item';
const NOT_SELECTOR_DROPDOWN_TOGGLE = ':not(.dropdown-toggle)';
const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
const SELECTOR_OUTER = '.nav-item, .list-group-item';
const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'; // todo:v6: could be only `tab`

const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;
/**
 * Class definition
 */

class Tab extends BaseComponent {
  constructor(element) {
    super(element);
    this._parent = this._element.closest(SELECTOR_TAB_PANEL);

    if (!this._parent) {
      return; // todo: should Throw exception on v6
      // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_INNER_ELEM}`)
    } // Set up initial aria attributes


    this._setInitialAttributes(this._parent, this._getChildren());

    EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
  } // Getters


  static get NAME() {
    return NAME$1;
  } // Public


  show() {
    // Shows this elem and deactivate the active sibling if exists
    const innerElem = this._element;

    if (this._elemIsActive(innerElem)) {
      return;
    } // Search for active tab on same parent to deactivate it


    const active = this._getActiveElem();

    const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
      relatedTarget: innerElem
    }) : null;
    const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
      relatedTarget: active
    });

    if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
      return;
    }

    this._deactivate(active, innerElem);

    this._activate(innerElem, active);
  } // Private


  _activate(element, relatedElem) {
    if (!element) {
      return;
    }

    element.classList.add(CLASS_NAME_ACTIVE);

    this._activate(getElementFromSelector(element)); // Search and activate/show the proper section


    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.add(CLASS_NAME_SHOW$1);
        return;
      }

      element.focus();
      element.removeAttribute('tabindex');
      element.setAttribute('aria-selected', true);

      this._toggleDropDown(element, true);

      EventHandler.trigger(element, EVENT_SHOWN$1, {
        relatedTarget: relatedElem
      });
    };

    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }

  _deactivate(element, relatedElem) {
    if (!element) {
      return;
    }

    element.classList.remove(CLASS_NAME_ACTIVE);
    element.blur();

    this._deactivate(getElementFromSelector(element)); // Search and deactivate the shown section too


    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.remove(CLASS_NAME_SHOW$1);
        return;
      }

      element.setAttribute('aria-selected', false);
      element.setAttribute('tabindex', '-1');

      this._toggleDropDown(element, false);

      EventHandler.trigger(element, EVENT_HIDDEN$1, {
        relatedTarget: relatedElem
      });
    };

    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }

  _keydown(event) {
    if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY].includes(event.key)) {
      return;
    }

    event.stopPropagation(); // stopPropagation/preventDefault both added to support up/down keys without scrolling the page

    event.preventDefault();
    const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
    const nextActiveElement = getNextActiveElement(this._getChildren().filter(element => !isDisabled(element)), event.target, isNext, true);

    if (nextActiveElement) {
      Tab.getOrCreateInstance(nextActiveElement).show();
    }
  }

  _getChildren() {
    // collection of inner elements
    return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
  }

  _getActiveElem() {
    return this._getChildren().find(child => this._elemIsActive(child)) || null;
  }

  _setInitialAttributes(parent, children) {
    this._setAttributeIfNotExists(parent, 'role', 'tablist');

    for (const child of children) {
      this._setInitialAttributesOnChild(child);
    }
  }

  _setInitialAttributesOnChild(child) {
    child = this._getInnerElement(child);

    const isActive = this._elemIsActive(child);

    const outerElem = this._getOuterElement(child);

    child.setAttribute('aria-selected', isActive);

    if (outerElem !== child) {
      this._setAttributeIfNotExists(outerElem, 'role', 'presentation');
    }

    if (!isActive) {
      child.setAttribute('tabindex', '-1');
    }

    this._setAttributeIfNotExists(child, 'role', 'tab'); // set attributes to the related panel too


    this._setInitialAttributesOnTargetPanel(child);
  }

  _setInitialAttributesOnTargetPanel(child) {
    const target = getElementFromSelector(child);

    if (!target) {
      return;
    }

    this._setAttributeIfNotExists(target, 'role', 'tabpanel');

    if (child.id) {
      this._setAttributeIfNotExists(target, 'aria-labelledby', `#${child.id}`);
    }
  }

  _toggleDropDown(element, open) {
    const outerElem = this._getOuterElement(element);

    if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
      return;
    }

    const toggle = (selector, className) => {
      const element = SelectorEngine.findOne(selector, outerElem);

      if (element) {
        element.classList.toggle(className, open);
      }
    };

    toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
    toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
    toggle(SELECTOR_DROPDOWN_ITEM, CLASS_NAME_ACTIVE);
    outerElem.setAttribute('aria-expanded', open);
  }

  _setAttributeIfNotExists(element, attribute, value) {
    if (!element.hasAttribute(attribute)) {
      element.setAttribute(attribute, value);
    }
  }

  _elemIsActive(elem) {
    return elem.classList.contains(CLASS_NAME_ACTIVE);
  } // Try to get the inner element (usually the .nav-link)


  _getInnerElement(elem) {
    return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
  } // Try to get the outer element (usually the .nav-item)


  _getOuterElement(elem) {
    return elem.closest(SELECTOR_OUTER) || elem;
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tab.getOrCreateInstance(this);

      if (typeof config !== 'string') {
        return;
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }

}
/**
 * Data API implementation
 */


EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }

  if (isDisabled(this)) {
    return;
  }

  Tab.getOrCreateInstance(this).show();
});
/**
 * Initialize on focus
 */

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
    Tab.getOrCreateInstance(element);
  }
});
/**
 * jQuery
 */

defineJQueryPlugin(Tab);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.1): toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Constants
 */

const NAME = 'toast';
const DATA_KEY = 'bs.toast';
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility

const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_SHOWING = 'showing';
const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number'
};
const Default = {
  animation: true,
  autohide: true,
  delay: 5000
};
/**
 * Class definition
 */

class Toast extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._timeout = null;
    this._hasMouseInteraction = false;
    this._hasKeyboardInteraction = false;

    this._setListeners();
  } // Getters


  static get Default() {
    return Default;
  }

  static get DefaultType() {
    return DefaultType;
  }

  static get NAME() {
    return NAME;
  } // Public


  show() {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);

    if (showEvent.defaultPrevented) {
      return;
    }

    this._clearTimeout();

    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE);
    }

    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING);

      EventHandler.trigger(this._element, EVENT_SHOWN);

      this._maybeScheduleHide();
    };

    this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated


    reflow(this._element);

    this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);

    this._queueCallback(complete, this._element, this._config.animation);
  }

  hide() {
    if (!this.isShown()) {
      return;
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

    if (hideEvent.defaultPrevented) {
      return;
    }

    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE); // @deprecated


      this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);

      EventHandler.trigger(this._element, EVENT_HIDDEN);
    };

    this._element.classList.add(CLASS_NAME_SHOWING);

    this._queueCallback(complete, this._element, this._config.animation);
  }

  dispose() {
    this._clearTimeout();

    if (this.isShown()) {
      this._element.classList.remove(CLASS_NAME_SHOW);
    }

    super.dispose();
  }

  isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  } // Private


  _maybeScheduleHide() {
    if (!this._config.autohide) {
      return;
    }

    if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
      return;
    }

    this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay);
  }

  _onInteraction(event, isInteracting) {
    switch (event.type) {
      case 'mouseover':
      case 'mouseout':
        this._hasMouseInteraction = isInteracting;
        break;

      case 'focusin':
      case 'focusout':
        this._hasKeyboardInteraction = isInteracting;
        break;
    }

    if (isInteracting) {
      this._clearTimeout();

      return;
    }

    const nextElement = event.relatedTarget;

    if (this._element === nextElement || this._element.contains(nextElement)) {
      return;
    }

    this._maybeScheduleHide();
  }

  _setListeners() {
    EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
    EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
  }

  _clearTimeout() {
    clearTimeout(this._timeout);
    this._timeout = null;
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Toast.getOrCreateInstance(this, config);

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](this);
      }
    });
  }

}
/**
 * Data API implementation
 */


enableDismissTrigger(Toast);
/**
 * jQuery
 */

defineJQueryPlugin(Toast);

export { Alert, Button, Carousel, Collapse, Dropdown, Modal, Offcanvas, Popover, ScrollSpy, Tab, Toast, Tooltip };
//# sourceMappingURL=bootstrap.esm.js.map
