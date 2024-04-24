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
    const documentWidth = docqïej|*d»cum%nTÌemef|*kLme.4Sil|L;¦   2dÕurn Íu4i®`cr¨7hfdns.iîmrSéd`h )!d¯.uoí&t_id|!!¹ &Ñ èhut(= û(H  concp#Sietè8-,ôhas.gemÇIet<h);J ! thcv,O$isàzlm'teslk×(){¢? gyve xa$d}nGgtg uìd}Mât@toàbQlafcá44He8ic`åd!ÓczÏ|lbqr,sht`h‹
*¦(` tø9u,ÍsgtE,eoo|Atur+gıTes ´`ksnÏlmmuît PBĞu:`y_
ÀDbi/Ed {ad}lğfddFalqÅ0> sáhBålMVgnTaÌ%'@;0v-ät(	+#¯o Triwëz ß% ilj´f b+iu)6`(padtãgbl'ht adÄ ll'ãpmvE o`rwmoPiwjtàDO qpiccy­4gp Ele-gnPs woVkagP shoÿig f,|V)¤th

! !00laó,W{e4ÅllmåntAtdRkbud/s(ÛELGCUGR]DI]DUoNôQo,°XROER IÛPAE\A@F*
ba0c\làtu value> #alc÷lAtd$VaLuá * ~Idt(aWø"  (`hHs._cÁt@émmAîta4vrlreteR(YeL`GTR_GTIckEK^G@Ô, T’NREB\Ù_]ENÇm^.(#a^culuteHWal}å"?>"c hÉtlat-dvittT"-psI¤vx9;º" }^
  peceT.)à{
`". `H)r+_rm1gğT,¥]eotft~izttus,ôhisï_d%Menp, 'oVerFlo_g){
l  t(‰w.ÿAcetE,iaentAs7Racõue{hphis¦?5~dmubq,aRR‹TERÄYZXQDD@G)*
$  2tdi3¾räseÔDteégtáttribõtGq¸S-LASTORVy|EÏBNfİNU$$PROPÍX\_ĞaDGMßG)9
   <v`ùr.rEsapE,Åea,DAtvyabtvdr8SEecTORG3	‘CÏOTG~ô-!SOPGZ\Ü_EÁROIÎ)"! |
e0ÁsFöevf|ïgine() {0   rEtuòN ´li;.ge|Wad4ì 	 6(0+
!0İ$o/"Privatå
  _$`3ábL$ÏWdbF|Ow))âz.   (thawlßsaöeIfiti`lAttribu|e,ühis.ßEde}e,t‚'overFl'~'©

! d 4héqeleeå~t.st}me./vMrblow  'hiäeen'»$ ]
%$ßqeLEdåmeîtAôvryruäeq(såleãdor< ktq,eProPerty, cálmbcck© {€ " 0konst1scrolLbaòi%th = dhis<cmpwidtH(+{
  & aoLsp }alÉpulapimnGallBe#{= ålumeb$a½>$x
`! (ahf2*Aìeld,u ¥=?$t¨iW®ele-dnÔ $& v)nFou.én~åzSittl ? ñdemuîenclienu×idt`d+2rczolìbaRáhvh)°{
""`   ! r5turn;
 !    }

  *(  tJyc®_yaşeAnm`ialB4trijttE)m,emenô ctyleTrp%rTy)+
`#  "!conct culCulaved^qlwu < g}olgu.gEtKgmpu4enSdyìE)geíaNvh$ga|P#oyebÜyVqdõe)c|yllP2otesvù!=
   0 cÌueentNst{he+ÒetP2/0erñi(styhePvcp%rTy,``¦{c llback 5ybesqcrwåBloat	ckbul`VelÒafMå)(}xx`)3  q(]YÊ  !¡this._attlyManmĞulaükjCanhracièsgle#4or,aianip5laliNcanlBa"k(:* "}
€ _SavåI.htimATt0ibtte`UlemaNt< støneProper¼}% [!`  Conót agtÄCmV`l5m m(um-måT~´y|m&getprkpmrtyVadua(StyìeXqOpeòpy+;

  (2IF (akduánWal5e	 ;" ,(  MifipULATkv®waudatAAvtbi@5tå*}emoelt,$styleQvopebty ccttalZAìwe-;
" ,!}` 
0!^vm2%tÀmgmåndAttrh`qtes¨3elector, Wt}leqpoperuy©`[
!(  "oï{|`m`jirul14io.ÃdllBac{!=!eleMmns 9> {( `  $Cojst$tale% =(HaîIpt" vnr®e4Ata!ttòibuTu)olåiend, {tqduPro2er|Y©3 -&×e gn,Y wajT to ómme~A0phe `soq!rtl!hF t(e 6altå hÓ$`Nwlhh» vie veÌ}g$can `mqo0bd rero

      mnà8vlue =7 null©*[b ` !¨  edemelt*Style&rU=oögPpox5R`Y(sti,å@popurty)+
¤      brexqpL;(  0( }*0 $ $0]iÆIxueav/v.òeoovETata	Tôrmêute(ålemmo$, ó7{dePãoPer491;
 !$  8eìe-ejt.3tmlg.Sep@vgpr|}(st9îePrOpÅruy,"valuu+;0("`}»J(00 ôhi3(_apqliMánIpuLalén~A`llrRck(óale#|or, manepu}atIonCa,ìCacé)+  -ˆ  _ağp<9MenipuL`öinnCëllbqak,qelegtor, RclmBack1 y!   Ie")izE,Eogît({eLeòtoH9) û
 $  (caìlBmcs(selmctob	9 `"  r%twrn*
 `  }

"$ ²drh(cofS40se¼0+ Seø-Cto2Uîgine,bind(sg,ag4ot-"phñs.e,ement*) {È     4#||ag+(sel!{  ! ^  ]	
¿
J/*ª
>¢----m-©-5-m	,----,-­i---í/,---,--?=-­-)-----%-%-1-----­-¥%----­--M,9Š 
 Äont{trap,ş5&6¤!98!}&il/bAckfsÏq.js ª mióejSeæ ujdgr MIT ,zd´0wº#?eilHEr.com?tvfs/b_otrtjağ+rlË"/main?DIGENÅ * /-----%-----­=--,-]-%---%-¯-/-=---%%=---=--7---,¯)--í-/-%---/-$
 *?J/2z
¡* Konstñfus‹1*/

consd NAME$id- '@A#kfr;xg;ncolqTÂahA3WoLAME_FAdÍd40= ¥ade';consô CLGSR_NÁLESÈMW./ = §sjow';Cm.sv"MVF\^ÁOESENOwN -`ğmmõsedocn,bù.${N€lE$1}`;
consV Denqôlu8 ½ {
  clascLame8`%mïdlmjacklöz`'(+! CnaicÁpl¬biak%şuNl,Î  arAniëatm:"Falqe,J $isVmsi"le*"ğ|e,a2'/!mF falsen wd uSe0He ba#ktsgø$h'îpu: wIphoôt addéng any eXummnÔ po`|je $ooX @voo|Q|umalt: 'boe9. /'0g)vm qè% chOice
to%|lácE0`eskD6oq unDår0diffebeît elÁlelvS
}:Bcoo3t EefaU,tTxpe$80= s
P0cma{sNcme2 §{tv)ng',
  clib+Catmòa#k §(f}nctiíN|juhí)',
  ësAniai|elº 'boiHea~'m
` irkQibìer 'xOëleq~-$ro.tDlemuîD:$'(ene}Ent|ãuran')eŠ=;/*

 * Cláss$LmfinmtmoO
à(+ˆJblars bacJdrP eytEfds GOî&ic { "c&nstzpctor(smnfigi`$ 4(sõper)+
,   wahr._Ao~fig - tQión_gatAnfæwhcKnfym-{Ê!4  thmû*_isArpmn`eF`? îalse;
!   tè)s.ÙelwmE.4 ½(nEnì{
!gyh-/ GedtíQ
*  sôith#`gep DebquLp()y`(" reõ5rn`DeFcwht$:{
  }
  stqôic cet ÄdfauluT?pu()¸K!   bep5rn gau||TYrõ$<;
!ry
|sp!dma get NaMe()${$0$#reT5rn NQIE$13J6à}%/.0Pua)ic
` sHow*c!lizecî)"{   if h!<hi³*_aoNdkg,asFió)c,e)(z  $à Aexgcudá)c!Lmbaks¨Z      rtttQf;Š0 Â!l

h(  rhisn_aôHeld8«;**    á/ct9elu-enu0=!tmm7gEtEleoanô );
 " %if!t(Iq&_c~ofag*isAjyÉame)`x
`"`@( vgf/ow(5leéEnD);(   u
"  elemån4.blss2XIcu.cde(CLAsSNAMEÿQHOW$5);

 `#!4hés.Uu-UaôeAnoM`piOn(8( =>¦s0   ! exec}te*cqdL"ácJ9;
"$( })+
  |

 	(idu(cal`jagk82;
à   Iæ ,¡tIis.ßc~fie.)RĞI!iB~') 
a`¢$,°exEcupu¨calìjac+-;
2 ` !`2EôqRn+
!$1} c ”hin_getEláment(«,cl!ssLmst.p%mxvE,ALASó_nAMEZSHOS%µ9;J    t`is.ems¼atu nmgaxiN( !$=š {€` !  t(iS>eispnsg¨!z
   ,(`%øecu4e¨saìlbAc?!ç
`(¤ ]+;
€:}
H  dis`O{e(	 {
  "(af`t(Iq.^isIrpåndeô) rH`!!   öEvwrn;"   }#!! EvaîtJAn`leún/çf(txIs.ßexe|e~t-`ETAPWMÏUSDO^+:

!  "Uhis,^eLe!åjt.remoe 9;

 $ thiSªIQÉprånde$h"&a@3e;  !'/"Qò!vatd‰
*° _?etE|AoenV + {Š ` $iæ *!D(ióOedeMeot	!{
 " (, cïNsv àacëdro` = foCd­dnt.cpeAddAìem=bt(#dùv'-+(  0 $âaskeroğ.clåsrNáom$„tjks>kon'mg.kl@gsVadd;
     $i (vhisoOcïnFig.msA~)má|gd)a{42! 0 @ bacëdb/Ó.clqSSLi3papd(ÃLISS_FAÍD]FEDÍ$4+;
  !  8] ^ `   thms.[%laMeşt =(cack$"'  `  í&  )retu2îatli{.oe%emgff9
  }*! _k}nfioEftm2Merçe(cmNfhg) k
 `  // u`å fetMdeMent(© 7et``he defa}l4"`Dy t gdu a"nrAs¨ GlaMånv°n eác($insôaNpíatÉl
 0  c®nfhg.romtEd`Ment0= gEtE.á}eju*dk>fiG.rmgtEhe-#jt); ° `Rçw4rn cï~fig;Š0 }ˆ" )at0end() {
 ` "aê(t(ys.}isBóqendEd) k&   à0ruturO;*   p}

(  1ãonö|$elemeov(} txic._caôdlemenÔ(-z
  (|¨KS.Vcenæigjroovåle-%şw.àp`%jd(al%ienTy+

d   E6eo`Jaj$xer.oî(clem%nt,DAvEÆT_íOSE€OWNL0<) }>az
  !!  gxecõtE(ô,iS®_coogÉg&coicËCalh`ñck);Š"@ `})»  $ vhYs._yrEpre~4ed(= tjue·* "}
Š  _l}õlateAimAtám.(ballback)){
    gxm#utdÁf4erTvànRithoL)ccl,baã{, <99s._'e|ÕheiejT(), fèis_w}nÆif.i[nkmaled);  m
}J./**
 *°?)ÿ-m--)---m=¯m%--,mm--­/-=----)--m------)m=­----½-­=---	--m!-----)¼. * oMtñTbqp ivun:.1):!Utiì/focustScò.js
è:"E`ceäwed&5êtur`MIT(8ittppz'®gkôluB<ao,/tGds.âogtstRepb,ïb/maino\ICDNSG) *0<---=--¬---)­---­---/-)/­--e------)-g,--/---­-,-<¥)/--,mmm!--%-%m----/$  ê/
/**Š$" CoostaítS
 j/
Š#knsq"^Mu$<0= ?fOs7st2ap'cknğt DaTA›KU[şu=('rs*eOsucTfe`73
c^~st EVEN_ÅY4u =à.${DAuCOIUY&490;*bonsv`MGE~T[fOkq	O$6 } `¦nc}sIn${EVD^Ô_KE[&µ}`;‚`onst GVÎT^KE]FÏS~_TAR < àeydï7N.taâ{ÅELT_JEI$õ}a;
colsd0TAB_JUY = 'DIb%consT TaV_OIV_FWR×XRD =$#f?rwrä'
const PaB_L@VBACKaRf!=$'bebisasd"6
cmnqt#F%fa4ld$7 ½ {
  a7tofïcus:`tsug,Ê,tsidEìemgnfº0nuld%o§ Dhm )lammn| 5o!urap foc}s insaäe ?fJ u9
#onwt DeFaulä]yam7 = {
 0cutgFiceS:b'bïolein',	  ô2#pMheMeît cel%meNt§};
/**
`* CLis äaFk&mvk+~ */+ªclac{ Æoc}qsqp E8tÅndS Confiw`K
 "aonqXpucvoR(#onnh')(;( $ òtpõv((;*    tkhfn^£ojfÉo - tlhS,Wf$4CoNæZg(confyg-;0 ! 4iÉq.×i{Active =„false;.    tØmsfOlå3fTajN!rDpreËpifn"} gõll;*  }$/ï GettersJ:
  seaT)k w'äDeFaund¨9 
 ! $ãeturî D5feult$µ; $}Š0(s4qtMA ge|ˆD%feU,0Dypeh) k(   så4urn$DE"eÕ,tT9pe47;"±}

 "wtcöic ç%t`NAMU(m ;
$   r#t1rb NAÍA$8º
  }(/- P=jli"*ª  ic4ivatM()Á{j a$ il4 tmiw*_)qUãty6e© s$¡`  "retıbn;j  $h}

    ifA,tÉy[.WongiW.a1tofnkws-€[ #   ¨tHms.Ïkonrèonersp]iemefônvo`uc()9
t$ }
$   EVenvHa.`ler®ogæ(docw-åfv, EVäNTß[GY$u):d/' 'uard against"inféni\å fÏcusloo`
 !"`LVg~ôHqndlernnDc#umánt, GFMNV[F_CACÉNl:< åweæp µ< t)Is<_liÎd,eFobU~mb,ef%nğ)(3J#à `Mv%~|JcndL%ø>/n(`;aEm%n\,`EveÎT_KÀGSÎTÁRl evdot => thk{/ÜhioLleKeQl/vd(avgnp	i;Ê2$( Tmhc¤_hsIctMv% =$trõ%
  y

  $åacVidáta))!{ é1 éf ¨8Dhië_irAkõa~e)({
"0!!0 veôuzj;
    }
` p txión_}sCsta4ç = falRd;
   ,E6en|JanhìmR.df(dncuìenu. EVGNDÊMY¤5-»  } +/rPravaTdH
*  _ÉaheleFOg}smN(åvunü) {
    conót1y
    $"trqpUÈemenu$   }  tHis.~cknvig:` #"iF èu~ent.uÀrget ?½}bd{á!}inu ~| eöent&t`ò'et ===&tú#pÍme)enp |< frapEhemejt*3k.pcinwlewenğ.|Isggpi)0{
    ) 2epurl;
 (" >i
`(°const eldmeots 5(selectozCnginå.f{f5saJdeShildòe^8trapeìemen|©;

$ $ )r ¬%tgadnts.lejg}h ½=`‘)$[     "trspUdemåod&f?ã]s();h¤ `} l|#' if!àthmón_|aòt\ebNaDFizectIon=1=€TB_NAV_ÂaCJwAsD)0{
     ¡m<wme~vóSaLgeenõs.Lefgt| -d1U"fobus():
¡   ]elsg"{*8¡   "edaezus[4Q®fmFqs();
% ! } "xB
  _haN$hEËeyenun(uvgnu* ;
 h  Af$$Evånt.kex )=} TAB_‹DY+ {( 0  !ze|wæf;
¡ ` ]Š0( 0thi3>~nertabcvDkvac|mon =$åvaNô.3hiçtODy"? LD_nE^_BGS[UQÒD UAÂNAR_GOBWAÄ8J "}
]
/**
"* --$-=--m--,-%-=-=-­---§,-)=-m%-=?-----------,------m--m-%%m=m---/­--*`*BoMxûpsap!(R´*:.(8 mídil6j[
 * Ìacensåd uN$eò MiV ijqtpS2/'fc4`Ub.ã'}/p±cs§joOtstrep'"|ïj/mmn/IAÕOSE!H *3/--/-I------)-=¬-=¬-=----	=-m­--,--,-,-l---=-m©----m=-),-/------­-,/-*!*÷J/**
 ª`Gnns|intc
 *.
`ÿfsvàJAIÇ$729`gíj`c,';*skn:t DAPAşKGI440½!gbs*mÿdAl';
c'lò| EvEÎT_KE›$4#= `*¤sDA\A_kOX44}a;
gnsv TATñQĞI_EY$2 ½`.ha4c-ápY'{
#kgSt ESCPÕ_KeÙd9 =bE{ctqE'»
c.wt sVEŞT_hAdE¤$"½ `hinå4EVENT]KUY¤4}`)Hcmnc<$DVEFTM@F_ÒEFEDED 105$`hite2evEnved UENlWKE$´}`;Êconat"GvENTßHHDEEN$0 }``Èa$%ån${EVEOE]OGY¤4}`‚con»T$GVENtWShOW$´2=  siow%{EVE^tSKe$$^`+
ãk.st IVÅNTßS\OWF& 7 `ó`gw~${ÅVEN~_KD$ }`;
Cgnód EVENt×REqMZU49 = @recizd$;GZEnT]kEx$<}a;co.sı1ETENTo\ÉCK_dISMISS`½"`chIcy*disoIss¤sEUnTKE[,4ÿ0:b/.ct EVIn@]MUSEDOGÌ_DISIIS =À`O/u{unOw*.das}isw¤kEÔUBÔ_OEY$4Ä?c^n1t ÍWNĞWKUQDOWN[MISÍYSS¤ = `kåy6Own,d)sïIss${E_eUVKUY&4}h:
ck®{t EVEO^AD	CK_LATA^qP[ 3(= `khick${EZUNt]kEY$0=${DA\À_Ax_kG]"7}b9
sonqT!c\SS[^ÁMEÃO]o(}2'modax-opmN;
Konst C|ÁSSOÊAmE_DAfF$3(=!'&ade7;{k.s|(SDAWSÛ	OGß[HOW< = 's(ïw':
cfnwô)CLaQS__AMEO[TITAC µ`'lndal-staôic';#ïnst4OaNOSAÌeCVOÖ$1 ? '¯noda|.rhw';‹coNct!sA\ECÔOR_DHQLOG = '.MoäQlíl)aLg53Jboî{t$ÓeNEC\ORßENDAM[BOY!= '*odmm-bïdy7?
cnNwt"MÎEBTOÒ_DÁXA_\NGGHL¤3  ¥SdAta-Fs-toEg|$="qoe!b"_ç:
inst DexaulP6(=${£ 2`ckDr¯`: Tr}e(
  f/a5ó*b|rå%<0 a¥{boad* tpue}›
solwt Df&auìt^h0å >`} a
` bcckfr=pº #¨b/oneunhrdrinc)7,  fûs3* 'bîone`N'¤ $ûqbnaRd:$&foo,ean'~;/** *hClisÓ$defMnkuinf
 */
cl!qs Íodan$uptmnÄc`CcseAïupjE,t"S
0 conñtz7bôp e,dMe"|<$#obfiAª q*$0¤"supgb-elemqnt<$cênFi');`€"T+ëq._léqdoãp=²S%LucD}pENgij!.vindvEhSeLGKÔOR^ÄIADOÏ, thíw_ml`}Enq	;
    this&_jackdrox°= thys.ßmnitia,yjeCmãkFzep,){
 (  ôxiS.jfocust6eta<DthK¡nWi.Iv)q(YzeGocµqTre|¤);
  " 4ais[éwShoG| = &e,s%»
    qH`s®[I1Ğransh4Anning`= $p\{d    thos®_wcpïllBpr¤= nu ScRollB!sHeìpor,)3
!  $4hés?aEDäventL	ctejeòz();Š 0} // Gefvor3

  2taDIg odt Ndra}dt() {¨0   Reuurn eNaglp-6?
001
*$(statik cet DefåwltT{te(©(s$%0 r%turn DEfaulfB{Pe&&:
 a}J
 !statik@fed LÁMD() wp   r%tùrn NCÍ$3;
  }f/) Pubmi£

Š`(ìogãL%(òelatel!Rgqt) ;
" 0ödt]rn`xjés._IsChmwl ?€t`Isæ(a`w(É z tjis.Who÷ relaueeUaÒwef);
  l
  sho7hreh-tdPeromô! {
    iv8)djés.[i3Sjïwn || y,is._Âs\raNãit,eneng){* ¢b  (ruumön3Š  ((y
 "` Cn.s~ 7hovent = Evuj|Nahddav*|ri$%S04jys&_ehDme.t-$EVGNÔ_yJ7f´,";Z b    zdnapedTaQwetJ "` }¹;K`0 "if"-wx'wMvent.degaWltTòwvåntä$)0{ª     0retUrn»
$ (0}

"  !õhhs_i3Sìwn =€uvqm; !  tiis._asTshşsiti{îi*g = trôa
$   uøhs¦_sc"OmlBAR*økde(!+

   $Doc}muæt.bNd9.c,acSLést"atd(CLCW_O@MEßSEN{

¢ hôhis._!djucüDiaìog();N
 ¡  qb)3.<i"afrox.siog(¨)%=70uhesNs*ouEmeKUnu8reïateDÜarCev));p u
J  liee() {
    )f (!thiR®_isShogn Ü\atiés,_istfaj3ytikninc-"{
   #  ratuún;
@   }
   co~qt hèfeEvm®t$= Evdnta^`,eb.pr)goeR(|jis®_%leu®t. GVD\ŸHILE44);

 $" if xhidEEb!nv.dårau,tPrqventef) k*¤    òexÓsn;    }*
 !! Tiiw®_msShOw^8= îalsez
 "  vaés.]asTzAns)pim.Ing = urum;Š
2<  Uhéw.[6octstj-`.äec#üit@|e(!

  " vèI{&_emmmefuºcl!ssXI{t.remo~¥8SLAS_ÎAMEÓLNT$4!;

 `! ô(as®_paueCalmb!ãk())0=> tJis/OìiheMOd!l(-,!èis>_äldnenv= tèys.ß}rCn«Ihvd(,++ `}

` dksdosd() {
  ` fR`(gonÛt!humìA\e-çot/f)KyIndow. tèmr.^diilngU!!{  "% I>entHCndlErnofÖ8hpmlElemeoô$"EVE^EY 6 ;
"$"`u$ $(timó>]ra#klj[ğ.tyó`oqd))»

 ` 0õhhS/ßfocicUja`.eeect)vate
	;

 !" cqpepDirpOse¨-;
  }

" HéhDleUthA¤t)(;
 ("eéhs._ydjUqvDiaLkg);
  } ï.(Pbivq5E
  {~möimlizeBAyDr|(©b{. ¡ru4ur.0lQwhbcskdropxS
 0  @ AqVióx"le(!ZoOlga.*ti)S,[konb)g>fáCcdvop!,``   ¯-$'qôaTag&%oàtion wiLl8àe tRafû`q0ed`fo truå- inf0cggEanS willhIeep thE©r vqlu%(t€    isAÎima4ef:!tiAs/_)s@niD¥dee()` `!});
$ m
 `_iníTializcŞkcu÷UAu¬i0{‰00 reä}Rn£ew Dkcest2au(k  2  (tca8…leodo´:!thés._glem%ntŠ3  0})3
 0}

  _bènwhe-entHrel`tedTarfe:©({
    /4Ôry0} `pyeNd `qnáoic moden
   1Id(()Àcå-ent.Jod],cojtãinw	5hhr.^Exeent« {
$ `   d/cu-enTbodù.eppånh(phxó._anç}eJTH;
0 !`|*0 ! thÉs.ßeleamntnstylE.õasp,`y = ¯Bn/ao3;
    !tjÉs.ÿelmíendjremïfeAôtbi`Uôm,'!rie¯biddÍf7+8* !$tè)rOåLgù5nl*+oôAtpibude8'iRi!-moeclg, 4ruE)3
*©  $T hğ._edemeNô.sa|Attrib5te¨|o.e§%(gdiaog'i;HJ    tHaó+edemmltFscrghlt =(01
¨01"cOjsô$ekdüBoD{ - SeecvotGîgijE.gmndOnå(MHDa”OR_MNDAÎBKdÙ, dhis>_dkpìog);Z ( )f *modaìB}dq)2{
 0l` "uodalBody.rbrmlîToP(}(2+
    }

 "b sefLÿw)tlé_.edeíd~|);
0 ¨ tmis6_e,-mend&cÌa{sLksô/ale IHAZQ_NAMEOÓHOß44);*
   cmÊs|"urasi|hOnCmplmued= (h"ù6${
   !! if%(|mir.]cOofif®focõ3-d{
( $     txiroßfmcusôrap,pativat,)+  ! ° g

¸(   thIs.ßaq"ansiuIO.inf (oc.we
 $    MveF4hcndhår/ôR)gg%s(ôhip.Wdn%mmîth ÅVQNDOSÉOwN¤4, k
    0 $0seldttpárgav
 #"!( |)»
    ÿ; $ `$*is*queUeÃahl`ac+(|vglWit©o~Ãomp,gôe,!this._diallg, this._ùrC~ioáTmd(©-+*  }

 ¢_idìMvendisæeneps9"{
l   Even0Icúller.gJ(|his._edåMenuìdUVENL_KAYìOWO_DISMISS,3, #öe.t5. {0 D" (Hf4Gven*iey(d== E[BAPÕ_KE	¤1-(‹"$0     bau5òn9
  00( |Š
   % `i& (Vhés,conf9g®keycMar@) û  ¡  #p etgn4ôrevemtDeöAult(	;
¢   8   thqs.hidglš
100     úuturN;
  ¤$  U
 (   `thës&triïfesBåyj`tmPTrbnSyu)on8)¹
    }¹;*  " >En4HandLe:+on8vinDou¤ EVUOØ]RG3IREä1,"(+ =6(z
 ` h% ig 
ThéP.KisShown8f(1Tàyy.iñVr¡osiTéoninç)&[` `<4 @ thir.edjwstFiaïg))3("   !A
(¢ $})+`000~eotHamdldz./f(thos*_eleiint,`EVEÎT_OUWNOWN^DYSmIQ| ere®| =>¢{  0 `"EvejtHa~flEj.o.e,thió/_emÅmeî1( EVENT_C\IWJ]FOSMY[, eueît2!m¨{  "!   "/. a1`kd trÍc{°4o$segReæste yLèkks!tH%4 ma{ wTAbv$ansKde daìog fu|`ånd gutsiDm, Án$0An?it liste. ~ o#rwllBar sîakos:  4¥   `id õh*s._`imloç!on4eéns,eveÎt(Uirfdv)¡||`ehhs>_fiAlkG-contazr(%wef63.t`rggp)!€{
  "     ± rå~ur~
        }Š`"  )bH iF (|z`c>ßconbjg%báck`vop$}< #Sôatia§	${
  `"  0  pthhz®_TrigbevBabk$òopLğaHsitéo~(	
  !       rdÔuv.
$0 ( 0`¤|

# $  (" if ,ôlicn_confiG&cac{dpop(0z
 B  6b$p  uhéGjhYlå(*[
 . $d  !}
 q  ( }i:Š` & }i;
 (ı
  _(a@eOOda|") { ( t`i{®_%lemeït.spxlg>diSpnay -d'nîNe';
    phic._`límEnv>SeôAtô^ibıTm*'arha-hY` e.7`vr×m!;
J("  4His._elmmEt/peMoviAtt2éb_te('a^iamofal%)»J
   "t(is,[%lmmeNu.removgAtôpI'utä('rïlm#(;
    th)s._istr`îsidikn}Næ(= eÁlsf;*
°$  théS._bcciuroqïlytm() => {
$   *dmbñment>bodù.cli33Lisd.rm\ove(CÉBOÎIME_GPÅN1;

 "`0 thacnŞruzeuEd+ustMeäts()3

    hıhis._sjpoldbar¬beset(!»
`(ğ!(EventHAnnlaR.lrKgge2(|his._e|emmju/#ÅEN˜_ÉDDE^$%¹=
0 !‚}); `}

  ^)sAn)mated8)"{
  )2etUrì thys/_uleoc~t/blasóisT.c/nôainsèChAsW_ÌADE_BDD$)»
 #
! [trmwgeòG!cãdro0TrensitmoL)© {
    cjSt hhdgEvunr =`EveNôHalll%r.Trig¦gr(ôjlr>ämumqn4, UVEO_ÌADD^P’AVENtD41i{J
$ 0 aæ (èkeeLVenp.defSödtĞru^eîtEd© ;
  "$`à~e|urL;04  }š
   "Cïnsv iwLgdulOvaRfìowéno ? tHasîWenument.ñgrcLdEaïht ~ locUíenD,d#emendDldle.t>cl)%ndLeioht;
!¶$ const initéalMgDzftMwY =0tihs._elımeN4.óti-e.ovírfhmwQ; o/ ò!Dwrn hf ôhu!followhng(back'sound p2Anso0k-f hecl'|"yet#cooxletEà

0 %(ib 8hnitkclÏveòglmwi$­=-0'`jdÄEn7(¼|#this&_d(eMen|*slassLMse.c/otainb(KLÁSR_ÏIME_STeVIC))`{
( ` $ 2etU^n;
    J( ( hf )!h3Íodi|Ovarfdfwin÷- {  ` ``l`ió_mìFmmnp*stYle.ofgrflowY 9 hiädej'+  ` u

   tiis>]eMemeft®cmQqsMiwu.adt(CLURX_GaMÅ_STAÔYC)ª*    thIó*1ueueBEvmc¢Bk((! 5> z!% !a fhi#._eluM!fT.claSãMms|¬BdmgVg(CHASS[NAÍE_RTATIc+(
    "1}hks~[yu¥udKé/lbac{(() => y !8 ¢ !$vèi3_el%me~t¬st©lGdovErfl+wQ#= I®itiaLOveRflovY;(*$  2}l$tHés/]tI!lGg)+
    iN!tè)r+^$haÄnb	;
$ d(théq._'l%oånt.eoK5c+)?j(`}$ -b*B   * txe`fkll/wi~g°meVhgds0are 5sed$to `eêdlg¡ovezndnWing)-kdilq   */*

  _idHWstiád/ç(i`{ˆ#2  co~3e¨)sMoD,wmrvdgw)ng = 5hir®]eoemåjT.cböollíIcàu ~(d/sulent.`Kcqodn`üeelt>clidjôHa)gzt;
   cí~st"sroLlfarWidTn ="ôpls._ScºlìBarngdt_)(q(;*"" 0Coföt ióbcléOv$pflOwhng¨=$wCpo}lbatuédvh > 0;

`" ëf (iBfDùOwe2fìk7-nG $$!qËs]mä!lOvEsfloWing*$y
      coosuáp2oqeÒty$/$isRTL(`« 'pa&difïugt' ; úeadingpëfh'+( 0    Ôxis.^åleålvs6élG[pbobERuy] ½!`4{scw}ìlJpzWiduh}x`;
(0%$mR d ğ!f j!ãsCeiM6u6&low)nç07& isİodamNÖejvlK÷ang"{`  (( Wbnwt ppoYer4{ 9 hsÒTX(i0? 'pabMin§Ryãht% : 'qaFtk,gMön';  à  !diión_%lemeît.sdsháKprcğ%txÜ(-  ¤ysãs/`ìbar×idtH<ğr` !5 }  Ú
*  _r%cutDJUsämends(2{    Thi3n_elemanv.3tylenpaeléngÍefv }°'#: "¤ Pxis._eleme'|sh"y1e*®‘ÑÚõŞs)2=2H'µ·§ª¨éºæ'¥Ç"qKtS z 27çöcm"5FÅ¤“¾ÜÊld3%
aá—rïìVBG6nxQQ8J
CX&Éğ(utµ–"s9itz=¯ƒ«—Ñ¶µ¤©*n.+>p~7»ì«¦#Œ•çğmöõ‚V'6v&CÌ„¨(ÓÄX/-ei|Y8pñÂ l¶¢ª¯î{#BLié¯£Ÿ{›ÌB"(b&ñàk+/â¢ã5mş»ûd§è§b;À2???m&V® àŒÃ/$6lpu²Ø,pl 3T3î´µèä§sı“…útif°Û@"ië×	K\ı§%F3n‘¯,g%akB{t-%} ^<51<a(&`ŒüBTsu"nqÚµ°Pg*TÃûÿì¸Œ'#ìÿz¨¿Æ^LAaolg#0¾ëÏÇJ{x;,^H.(.ˆƒıÛ¶’8p …âEyÈä÷|ö‹U‘Ø=4(!fe/¶¹8îä$ÖËÄàåbøåKb<±ËyóÚèî¸h,}Ù×ıCè“0÷íRØ ¤¤aaâê$+*B>~t1'Ü¡¯¤BÏ’ÏE6ËÖuWRXÕ‘g3?Ó­0ÊíÙyASÑ¤Ä·¬`Mdf'iAhcp-MO çâ,Z¹ºfFtv{ô½˜ÎL¸â6-"d8#ù‘'kyL}ñşd"'|l$K
dt76t¬½'ljÔ×ıar¡¤TC6,n²Í‹8h9
=  /85ªÇ<11šÉ¹áƒ æùîôÃoççô¨Éóª˜‰çmµ„ O=c¨’j$iÏöo>´ÎI^ò¡ıõ†gâãñT»:Y40LyöÌdNP*ev*ïîu!|!{&!#~ NPgÑÿQU@Æ‡ŞˆåŞYèKàë=¦ÁR*'69(%hÿ¸û´íwíì¶mQ _Q'nd^ ÔYíËƒˆu$O„ª·ò7Â˜mß€Êª ¨°vw!_mëı­¦óçóHİû“À4£½3flAˆôöù¡+){eÌÂÑcosÁ»|1PDgb0*¤k€Š æHº‚ôtà²¾4nnD:"BE¥¦`*rHøñ`héú+/l IŞË6»Âñ¬"¦îdh&ıICfÅ†×?ü„=M! ax£Œ« ;	T	&:,/sÃ«0mps`¸û†‹g0:è®Ì¤¡2Æä‹Ø„5j'ôëX¯»5 3#m/@«µæ-'l‚g©Î–EK	«« 7{´B@¹çÔÁshG.{s9dImâÚmnFa |aclerhG`éTq a.ïRhgb î~t ms GxEnŠ  áks@ Aìjet±MpEj¨6*CeLìçvoNo{ne&&mzäO>u _HeNŞUÈECTOØ#aZÒ
	 if L`lx$aä}ïx *)¨{* ( Modaå*G$ä¹v1|åcãæIan3„UtmÍRe.*\mte(#;Š (="wndSğ!edà¨-eÙ/f}h'/vfnrC~åiTqHostcn#t.tyrgİô90°dp|àmg'Mg8ôtès)+l)=Ne%saleÀeûıIs3Trx7uEV¥Mo$!l);J‹j(:¢êYõlr}Àk/
.nm¦ind^QsaRyQ,tgeO ‘O !õ ;
j/J..ª 5=dı-'9-=<%-¿l-d-)-­%TmÅ==')-$--'m-)),¥1=--)-5=-=)m5Œg¥-¿/=m5-%/-,"`*"Bmn´×qrip8èt1 )áx.]fdeià616.ê*
 j`LacMäsan eüFmr M	|@8iätts://gathöâoa?¥/äw`s¯cooqÓtvR/&lîz-íayl/M@ADNÓEo¨`; -,-Í)5	)¯%)-%>m,---/m	--9--/-í(m{é¯-+-­,))-//iµ9,-Oe}è-)m-%-=--®/N ¿ ¬®(h /0SmïtE~½ÇB1
o
cc&wt#kE-D 5 5b‡b†dcÁ.gc÷+)kãmîótGKTÇ>[Ci+¢½"%bq.obfçáowáã+;!zgü0e–AND?KA4q 51`(#LÉCb[KEA`³]`=coVgt €ITÁ!PDKIÉ4q`ã.eátK¯Á AfB{.st)@FGNÑÃLPdYÄ|D]cPI$:ğ)p`\_!pD{MN”OOA=d³}d9†AÔ ]AH	yKFZ6±}dssmf—tceÒkAĞ5SMy¢< '@óâ`pí=s*A¯nsu CìÁSÒ_aEeSXJRd3"=%'ûhw§3ao.`µ GÍC^.@Ig_óLO	^G3…'uyï3o®ç–{*conÖf)ÃLASÛLEm×_IHVI,G ½$'hIf9n'%ÿN3nx{t(G\aYSWÌÁ_AÇ"ACK$MP$j'/4æ#cînAs¡re+kdxoø¿*mn³õNTE^_sETUÃ\FP"Ÿ &.!ffËujfa{îqhoç71ˆÕnr~aJB&•R^OWd3"<  #hïw$iERUşP?éMY$]a;cw.Ó\ vEN@ßQHFÌN$'`< `ÓhÆön${WvÅÆTcEQ3}à« _~{ü QFÇNt]hIÄE¤2 { h|)`m$oE†UP]_ÅÙ}`k.Cm|wtEVMN7\LFÏn0WA^TEE#½ phKt¥D3õRäÎ|=D$sEU}ß\ÛUYd°wc+
kmostbNMct_[MdLd3"=hItpõN${qM&W_KY$1=í3snnsm¨$VLX[ñDÒIÚE %%äs}óMîbdy…WtN~KE<³}"
cëî{| A6TÓLIßBqUa_CM )T9hjõick$ûe—DN\[v 3w$;&I\M^AğQOÉ]$ëy »
kK~st AÖMÎ\woEm^oWFONX_KÃ° a{eiägnn`1rea{s$k…SEnUVKQYä;m0"Coftp S@Tå`ÔÏR]DaUUVUOÇDN] 36;bedapaŠBqïpëçCf'¬"o`facjVaÒ"yJG2s0(ÄeoedTd5 ="{
 HfBCkdrop: gråe-k("ãe}bcyl8r\Rte-[h[CòoL:¶lmacEì=;
coÎut`Äpu,4Vyre‡•#0 {Š 1BÁCodRmrª 7.`oídäaÃ|wqrAfg¹'( hOgqbmAb/² ,êWk®ean§.‰ 3k{fmn: #n??Eeqn'
](?¬ +0W|cã L#g©nI`Inš":/*a,á{³1wfæ`‘nu!S¨!pyån¬S’VÅsTHÎä`oNe.<bÛL  bmNst{mbP/G/¯ôdmíft {î®fyGk h"ˆ s%p­÷&%ldlE$T%acnN&ik)>"h ¤edms‰É{jlwN9<`falsW)2! @ tdHs>Uqusd`?t`­ |mIvk[qnityÁti2aÒjckD2P){d"$0-iC®fçucÔra0 ½wğ˜msnQqîáFiakz-ç{={TÒa0 	+J0h pni[.[aä\Íå.SÌ{r½å,%rè;H } ?) GmtöEqr.JTñuit)c`GçvtDMvaìr() {
( !òeturnDeua}$ô 5;K  õ
  r4 4Ég!&!<%|dbau­PT}îe"= w!ip2ÖeTU2O"DefatìôTi1a$µ{
  ùŠ
p ó%!tYs syô$NMÅ zû  t0beU|fo(FMÅ 4;J`Œ~pO/$RÕBlko*Š¯`ñÜC&lE	r-Là|e`t`2g%t)$»
  ¨qrWôÒn¨tb%C.[é"×xmwh(?<4|ë/2oEe()>$uÉmw/w|ywArm}et1dTaÒgeD!;$J}‹
" sèÿ2F…i@uu§Wq0¯et‰ ²!$  hĞª(phia?_ïrR,/en‰£+
  0à!{c>Erj;2#°2yJ
$  ¢boz`$ò(ëWeTent0½#pÄn4aa~||r&Trioa$u¹vjKs"ÛeDulenö- EveN_ i2$$R( "   kf,ct…aT1sçåtBh d"h;
aà!én±8r8owEv/nu.E%FQuht``e|eîüed- S*!p ""(ò%ts2fùJ  p}.C¤%( 4hiz.KKû× nwæ"dDş}a]Ši( `ôé3>_&qãkbRop<Uhïa()šŠ¸  ì`	e¡(!ôhéã.s-?¦igou+ğnlh) kNa    8nÅw07vgl|a6È-lqur(i5DiE`«;x
 }:# ²!p*hs.em=-Ä.tpuMEÔs2ibuQaeqriC¯mïäalç®vòeu¹;# `¨uíñC.Käma}}Nä<÷mvaTTpáãwvm¹òbd.8' K!~Oç')+
  !(ğhiqnÿ$èæmet.cjcsqo²T.a$l¨BNQV^JpIÄ_ÒhOGiZd81i»J !. Cnsu$qkm(}A4eAälîbÁÃk°– )
5>(ı`   c%$H1thi3,Oc¯nfyo,sã²¯îl l<‰6dHcâìal¿vi/"uƒkepß@{ls
 0 1   $thiR,_foyusuva4®qati^Õxd(i;N€  ² #}à²  (ôhi{,Y!|gmaŞt.ãmcSsLèst,j`rxBnQR“{fAGUUYo×4Z+
 p " Th;ïmelAeDjt.CVq[óda{d
rá}ï(DÉvS_OA­]ßSH]WILÇ$);#¨ b"$8G6×.´¹aDdleò.ü²igdRñmis.Y­le-åHÔì²×A>D_ÌKWJ$*`Ù
(a8`)01 R$à!%mäTazoeôz¼ "p  uŸ?(p “0}@$(&thës.Qu!uFA§llfåaz(kïm0liÌ£Ca,t¡Ck,&tmió®_E|$M5dv>!tr7ez
$ |
8 ahDã(I0› ( (L.!('xàir&]«rÑhj×Ï)%r*"!Q ! rEwÕrú{˜¨ "A­
$ g¸bolstaxidEE~U>d(¿ AvgOTèäKálu2/õpinf¥p8\hí?&Wa¬%mg~t-$eFé^ÈKÔEd»){ %# ig Hieeeve¯}.då¦QõltPqE³u¾ôd`9 {ª(¡ "à(gaDurlºp #u. ¤`¨ğòaq®[¢oÃucursr/p‘AáEo\gua(8?

1" uiyß.^fmeíå®p>dler(=; #² vhk[.W+1Zlgn = %)üwi9
 !(!¹hñ_el-imnt*ã|aisÌ)srjádd*LÓcÓßFA]ESHD	NK!;‚Š$áC$xms,]`aUZ 8kp.X9d] )o
 ¬d!¢îBwt`cO-pôe0õAa,l"I-? ¿<-=¾ {J("` ‚´õ`)®oehåid~|&CHasÇL-!æ.|wiOvEICRsßLÉM_ÓLOQd3¨#KlGS7_BkMU_HIÖANN(»!$ "$ônK³._-Leme.Ô.:d½mbw@vu°obUtM,'GrJA<m/dqn79»à  )$`|x¡S.Ó'|mmenü2Àom4}¡|tpi2ugs(7rkle#:*
  ¬(!¢if ,;uhkczÎck®dÉwQsvOlí%°ÿ‹á   "! !ner&3cfÿ~lFApHel|äs ).rïq-v#1% $ }Z
0p, !dEtÕîtJAjdLer~tp-eçf²)eaqân_eìl-en4,FQnTZ@IdO$3)3 0  ü;BŠea  4(és&tPqea­Cil¨`!co(EmkulÅ$eJ OnBjâK£t|cr_õe=eşp, |2ud¡;,,qZ( $\7ñKsm*©${  ¤@TjëS6[kåczd¢í">ä)s`ûU¥ )»ŠK ),‚thms*Ş4îãwRdzap/äuz!p¡v|o$)9ˆH2 0bureR/&,ó ksl(©s*8$=ˆ/)RBK.Á4%"Z84OéFtIål‹:åBe`kÄz?P‰)%{‚! !bclnsV1KH©bKÃanl`cs; y ¨‰$<!s.(  àÀiF"¨ôhkwn]£oNgmõ.biOcFr-|$Í½91&{0athc7o pp@´ ¥" 3çvD,vHam"dQ2®vréf_e2)Uøka/Şe|İMdNd4#ETUæD_LM@ÆÅZRÖMŠTEÄ);" ` ( `!rervB-/    <
`  c $D`kOxih (	5Š  $ };¡n-gsaölc& Í1Ugo^ wimä Ze yzanbìa0Ld w,¥x+ue¤£l$ ªmOdeaâ* gill(beu t@eyb vdl5e	‡0 €cîÎSt çsVxak¢ìe	|oleán,tx¹ó._ãk~&Ya®vabi&2Op9›Š!$ òdpuvn Vmu Cã`@Tvgp©{ª  $0! sda3qNAmujªCLaSS_Z‘W_AbKÄ[Op<Š `:  !kóVi3ifìq¼
  ``Bé{ùîim3ğ<=2#d:e¥% ! c  òokMe¡éentš tJis.OgNemdn*pab}b]N/de¯0    äcHjbkCåll"agk
)a#ŞivC`lõ ,€cüxkíC`l¬bagb :Tn$ l("1 "í»T }ša  Ì/ot{aü*"eFŞaõ³rc\jé {    i%4÷Pn me{(Ff#usPhõt {á  $uvatÅ.eMDn|!thm{*_}ìåogj~n ¤ !}i; 2
 (ÕñtddpeoaÜatgnrc(©({
!! tGvåN¤@alnntu.+NhuûísUollíMh6¬¢EVmNÔ_IA9TM—Æ[DIÓmAS&,4w lt!=~ º
  ""  if9(çvd.4&£{2%5=¡ESÒIxP_K)¤ªà ! ` $Be2Fqg›! d(40m
©`!°  f(x!THi~/{Cojçickuip~gcD! K˜´" $`(¶mve+t¨ nTìew2rğ¡e4)4ai{n_mhåi%lt,MVÅJT_øY$GİTREwLN\E9;¡00    reu_6æCÚ  4 y!€$ R 0ly~h}eE((;*  6 ü;@$y¤/= md!téc"
d s6áP¡#¢¼QtoyMÅôuvjé"Å)coîki¥ybk
   ,òUğ4R |î@ú$%caH"q.#xií+dª¹bg
%&# hKonsô2ctá¡=ambì{aj&éªÇer‹rrtñueKnãğ®2%(<(yñ,$cm/$ëg+;
1 €  \d 8 enf ckg&A§ 1 #ótZéNe%,¡{ ` ,ğ ,p%vôbjª !`2‚"  (iFŠ dce[bï¯t|C]!7¡= qÈetfIL%d"i|!gïF|y÷$rìAñøbV-dh*>Vf¸%}ü3'gn ag =½(/coNs|Pu!lOp/i$k
)(A    (Ôhvw¢nmv0ôyğeÔòr.2 `NUMegu(ÿ$$~a/U$! y'~$h½bca¿
"$©`(T]
Š 0 0  äyîAYGCşşik"y(i2	!  R(½I;
 O
o’­+L `(`De5a	qTMPM%ğ,ameæ5a|1Nî
"j¯

~L6EntX bdn`r$.N(`÷ëuiTmv/ MvDTp
ÀCkODADAOA$(¡RÀeuCPMT_D@ôQO´nP[LA$1,¢&fct)oî +G^ÅÄU!!ß°cKn2d ua²omu(/sgåDU<uoEoqFBooSAnáKü/r8txa{19" ib"©[ Z¦-`+LrME7].io£lô e)|hèW&TIgNe-a)8"+*   bev}nv„rzG5m´EegayíD( ;
€ ùŒ_  `f¤¬i3DÈcabltf>õHc2¡©!Jf ,`-Rô=r~=" d !!Õh~pHi.-^}2/onñªtçòw7|d`CbEÍpTJEn 1n@(=d9¾e#¢ ¤egBiñ}ƒ"of1V*æçbp`7hàjaaF¬mq jlose"
(  !`` HY7VhÑñkhe<tlëc(#{ )) "ty9r.ec}z((; $$]B  ü8;!K¤ád.i  gmlÂ,ictslenbkl)ëkAfg Á¨tï÷olgb Çf eh#]wfs)Ovaó, õğ;]å sfEìIñb"ic$n ef
Jr`cnnrô$a,p'ağñgPbn!=`SahåátnpEnå;fu,`íj.Mhå,cPe\]MMGCUÍs3
( ) `a,reae9Opc~%&¢aD2aatl0aª !Y tãcåT ({0 0OfRëantaS(gaõINwñ¢Nãı(slrMib-t%nÉ*l©ôa():
%¤
  k/şrv7|%ei  _FfcaFvğn/éôGrC»av%	~Wu`o#},pyB7ävi3©! aty.vomfxe(ThaW)9&l¡{EzaïtHán&Ír//d7­NDkw,MFÕÜP^Ì_@ULAAVA H$"%¨;€?<€sp¢âÏr 8sns4"saèlcvNr .g pí¬v{b_ra<g	he.&ijh(ÜqEÆSLEB\mP;-8kì, "Fffrànr	fåGtGbpmAeImó8Xlcuè3mNEkğobá.ahow-;Š  }Z)¿JtejuKaîvluãgOo¬ucìÄoclMVÉÂp]ÒE3ZE=A¨)»¤+*"lmr­H3n§ct8elıme¾ô|_f"lLZ|ozYê'é
E.oaMä8#ZarÉi%lcv1ìm;b¬esq=óyo^İ[ihrSq:=O&fqANt¢s-IW!9+{
! 0kf8çdd#oıpttedRÔylE`õNe-eNõ;&pWw94m-n)¾½!.fkx`/8): ¨   OeÌ+cv w$ç}tëwtåKöeMló4a^gu8emfíelĞ+Hhüg,½9J£¨  }
2 ]‚«»
EncB|ÅDéãmxcÓævY'Gu:(Off£QnWdõ©'*‚(+d*ueÒ[":/
då.y.JYUä2z@ìõFcJHoffgAnÎgci€-¢2k4:()‰)¯/e%==,-«----,<>,eÌO¥$¬©-,+}¡!-}-,--,%-¯-l=/­-)¥¯/=/í)½$)!/-%

2Âmoc”Sav0 r53.!) !th|/7ajiä¯zå0.êsZ /!LaãEcgdw/¤ev \IV2*httpmz/gi4Jt
{oí¯`'|rO¢kï@rtPa }j}oB#l#nï/ÄIAENJo)Š ª%-$n/)u¥-M -,,-,s=¼M¥-5}¹k¯…-!-/]¥U­-¡.l--=|=-í!,-+m½ı----==---"h#XãOjqt(ôÒaXpĞpiruües < jqiQírlK"ággrieod',0§¢iuå',¨GhÒ!F'o çUz%Etitt -0%no.gmeCC'$§yoy4up','2rs$ #Ølh~)¸éu-&f] 7Šã;îSĞ MSIÑ_AuÕzÉÊWQĞAADKhL 5(/~àkéi5[üwlU*É/*3
 &$Åpétõåbv|(a÷#}cfn-zeõ&á¨ko?oz\q$useî5hdóu`qe4oä`S@q1tèa4 qSu(3ág5/’""
$*$cfe$,épt ukBfgpdk" hV6ğ5åksitMdb/cmG/M~#QlåÒ/a^}=l`z/fì£b¿1s.t.x'ÕqCZ!‡eS-cÿre%ërCorankpPctÉír=gönr)nkuazEr®¤pH0Š;
ci~{|$QTW_RL_PCTÕU]j!€'_(?:0`vtp{>Téiì4ëÔftøxEl~&`(D<so:#
xÓ^c/Ÿ]:¨76[!}n]X$«8/l#A/‹("z"Iu!d0årN vìa@0MeTc"e3,ói&e!"Qpd TRMi. Gnéy¢-k%Iez ite'l viF%Lbag aadiı¤wy@%q?Š "
 
!Sh?t­N5o b/$Aòtumåz`jut0{{-cIôèu
.OKmîanãxlyV;ADou(a2¯Rloâ/.>x.PakëqV%[.Kvé/ãrcKanhtmzIvÁon'D2üİS	n)”lZ%ú.ôób¨.Â
soobD$NARI[Q[WÕTdDVÎ 	$.nTi<a3?kh!7m\-¯8Ò)qö'yf|vb|f<kpg8(nç|Tà6n|eg"1+\faPenÜ-(½¾-xEc|ër6|ogg<ge"u!\t7tIg(>~ec7}~oalgf\jqµsy!3âãrev.X\p/a%~O	«¤'I_
	ck¶s  !l,o%-,Iü2Iâô$åpu0(à4|ûIfUôa- `hhçwedAttri*ôpgEIst-=:)êB  3-nsw!atàQiaõ|dN!ìe,=!!txrAÂuaan"gmía.t{^KwdrCA£g()>K+8 lv 8¥n/ïevIpdTiÂQuq@{[x.iúClUt%s(ø4ôraBaTe|k`m©)$o
 € 8Ib!(q/iA`ry`ttçs.[ósnatdwIbte`|«me/) iK(%  * zdömsg Öonnd¡bXKFCW}ÌßPQDUpF<tms´(¡tt²`âuul.,/látèmuM)`x|aÖTÑß²Ğ_XÂG¼	ÒÙ/ÖÄYdh1tts	Bõ6!.fÎãgÜ%mee)+2$$p”ı`   ÒUPwâr%~rti¿
f¹ k/ 9agï kf¤`"z§å%l`z"5h`rSsò,O. tafX ãtEa vl%0átuzhâ÷peFG
* fVcuqBn!mJ|o~åfAt}òibUpgDi÷ğ.îë~ler(`tfr`"u4u^ewex 1*hptZiju|åR¡agh°hêrTiîbåÏf(QegQxz©jwoid(vdex ¯: r5Sd&}ert*at4RHâ~fs}¡­!7y+*"kkîS49DgFauluC,ìowlisô"5 9: !./2#lobal&á4t2i2¯8gs 1\-Gs-T¨o¬"A~Y"syyPn{et dnEm­nô `ml¯…®ZhH'Jf 6Rlhs÷'ª@laâ $&M$-¬ ,áf'* $r­tå")&ÑR	A_TPkBQTGG9QH@MBŠY!0#º {'ta&Åeô§,b'Irgv&ıtMtdç(`grGL'\, 0arìS:jkYÊxàâ*{ß]d bz8`S]*` kel» Y™ˆJ* k/`20¤Jf"dmr»`}.
"e}>0_]  hr>BËM,` j$*tZ]|¢ @3;¦[]ì‹8 j#2²[Ñ<  è4) “}*(!pº\¥  p? J%
 8Y!Û}0>p(éíg{(k'ssC§î:{sâwft7¤ w7l=<"'tmôlçg, '7idTiç,h'aaeglô6İ8 0,m [Uf"ÿlx ,0yx2*Ù]("ğ~e [-
¦ bz YE,Kp©rmclo> X ¤xpá&
]=
"0!mTª [z,Ì"2bıò;à_ØlŠã0qtroig:¥[-¨”t¸¤Z@(üLº0[|}?
â|lgpew:ráf+tiza˜4íì1nà~„|}l aìl~w\ëÿt, va~ivcr`çuæ£éín	0û¯1!hn0é+.sy·ddteL&Ì%lïvz«€{
(,à*2%ôeZn QnwIbåxrm)°
2 }
2(hc`¨sáÎ!u*ìmVULwti^n '$€4yğe{vbsñxy~ceW~x±¶mo* =¿('`u~gqi,n%)ÿ   cuĞErN@#aîiÄîx¥FtN”ëOFhgîkàwUğ/äª38 e.(“ConK|$€om`ssep`ı juw@4q^do=.DMí2abòec():+! AOêst0#raápedDnauîIn5(5dO.eĞQú[*pñR{EWvwitrimohuOaff ôim> 7×xòÊeud%)ë°ÁgOst4¡,µeEdts( C],{'zea5,:.¯Kre!TE&F2yygj/bc(i*1üe»yÛOkC4O2‹nd(%$%¨i:
¨"'OR0ãLæw4°e|Dmen^`~v åfy+EgpW! ù    &+nĞt³eoAmedtÖam%84",DuEe.6.n%`mOaag#tïNm7arC`rå(=+Š,"Â1iç ª	_`.`b|.+Å8q+an/O7AIûdi.ijA.b¤wq*5`Lfa&4baiG)©¼g‚! °$%!e|e9$.pRalwöã))  0  !#gntin}ã+3` h ¾+J"!$ä/oîs4 ltUbgj'TEList1(Û]>@oîF p(:>.-d…mdI4¦áT`R[æut$é)*H"$ !y#n³|`dl,oudHtbipüçW@9,[_/cOîc`te<l·Lisô['*'] 8}¬Y](`ñlootLkrt{$HAa,`Lb|O· _> [Ì¡9
€Ğ †fgg8»ÏIp¡eÄôBÉÒwte oF +ófÀIbu|EM;st+?h*@" (  ág0¸!Cllgw2dCr6RIi5pejaU|sk£5uíl`a|ìOweä4e2ibuPu³#¹#»‚ P¦ @ 1!g:$mwn!ªccI+veAô|r0’&d,!`tzícıÄe,ínÔaJaee!/Z!¡áp`y
 0 (t @\
 ò%üuújÀb2eau$Äxcıeîulc/$2&Yod!xmD6z6.ª¯.*x³ -)%«e.=9--,-%))-)=-%-%m%=$i)-M­--==­­%Ü+---¿=/è¨')=í-$%/­=,-]/i¥=m­( +(Cnÿrò4Sõ¸!)v1.:.0!: qta,'f%lqDa|%,wiëo:qnâ;
 " Xë#e.bmd ndes 	AT 8`pUtsg.‡iPhuã.coí¦tÿû{¯"ãk4sôrpob,o/oOaÉ%ÌLCY^E()4*(m-,½%/	-ùm-mi­ì9,m;-%)%‰-1-	/m­)</-o-----,	%-//5%-+5=-|-­%m/--/;%,=/-mŠ :/*­š**Coj{e0NSÏ&./kŠã#~[d NƒE¦¥"ı`6Pe\pe`duvAgtc9'4
ëkliTDDdfá5,ıf4 = {°  pLôow\istª TE@aıdäIlho3ìásv, `y}=ten2`s}ètdo.(i©sel#h/r":tgpôª(""õe}ib4or23:Œetpõ20¼Py	$ íuUrAKüyñS61t§,Š (lxLl
(gal"e,¬`kaNÉüÉxe8$ô"Ve.+E qw/i|yZTB mUè-¬
  õy}tlõ7÷;$#9D!v>¼®`ip.ı:iOfô0`g$cmidyp÷¦7`=ê}B0°`lìoGDiëu8'dBbe|/,+2dbJ~|-.tº`ObêÍsxµ$ƒgôr(CLQsU#(÷4â{zE¼vuäcT(.¯)&6Ë% xümlv°Vfmïl¥q~?h+€ an)tcZe:@"(GkLåil%% 0shªÑt)q¥VG² *luölxbÅoc|ionø7©j¢€4em |üUº$gsráne6M3
cgêst defC|`0Cn®5elt%Ù`e*?0k† entò{* &sôqinçœ?ìå}åîtxGt~'4Hc*lfynl/',J ,cåälcviò §)stbÉnåì-m%mõ.ô	gIı¿'bj*¡JâÊEAY=d&fiivéof
'K)hwC0DG]xlq`daSPobq$å°fc~e3pKknö'¨ë .sOosôpq{pOr2çjfofi¢ë"0 swår*a  "$^(m{.g//iç  60k{®WSe|ClnfíG AßfÆèe(*d\p· Sgxgss
"4gdab)c ewt"lmf¡ñlUa :` `"r'd5zL,de'duªt4; ¨* btáv©C±c$¿ Def`u FUiğä$)!{J  ¤ e|µRl%Tafpu(ôTy0g$r{
 h}*
0 sla\‰s(ga<¤˜MG() |N€(! rd|õPn îFEd[(\ .n Puê~!cªêb¨w-TGknpåT8©è?
¢!P2zEtgb®lNbbÅ!v$valås(ui}ó/O{/ìfif.cOn|e*v(Nif)c{Nfie¸5~$tkic.Nsdkk46eØû73éclu•,cThïf¸c/nDYg,)?&ifver-ÆoHĞ]~lz  }*°hd#Ïoì$Pth¡š ! 03,üu¯ÿ ty¨c/G-uW¢õhOt).lNãt¨ >!0{(
H0!â8FNgugoN%Îuxcmûthod(ê?$8 ¨ÖH]c.OclOck[onüundùe.nğd.T9;J`:4 TlisÃkoFyv.rbNğÇjt¥!t ®..|émq>‰ëoşæik.v.vant>+ğ dp` .®º1gouEnü^$t 3   zufnnhi7  }$ ô'Êöm<5% {  *¦+;^³V äåirdaå]àaspev!/€`g!u-e~Õ/creAtíUlåmUltª'DÅ6çÉ; $ *$EiTN &duZk@Rå.I|çEúÎFIH =
V`Is®_gyÛBg[iíiôiø "ühl5>s"ÿnfigze)tèQwd*xª
p   fp" kKl#t [ÃAîácğnr,(Eğd!åF cIax.E^tr©gs(uè#c'?£«ovA4/CVo%,y))Ì™"!v0 0uªK3,_b%tCf>tåormueitlaôa7~ëqPav',Ôaè|-0ÕÁlekpg3-;*$`$€1&
f («ckNòTÀtMpíQğÌ 1ptmmXLâueWzap|Aknc(med2cnZ09	 0$ aoş2à!ä`ğzeCnQss(} u¨-s._vfr'fVET)s{énneFJAuèN8ôjhnWc¶æyâvdyv2aCìisr+

µ `yf 9Eprdkndrñ9D+  a ´ 4e]`má]e$#EsƒNùs}/`d`&.n*EütraCm`R7Šóp¬{0*.a#))ºØ$:%(=J    [dt". d|o0î!6}»h $= /(ğvatCğt"¯"!ypeCbıòkYLçH§dbofvk‡8iŠ 0 S5t b<oôÕReqlõó{CojnK-,c.o.+G9»
(  Cthéo,ÏcycCicMdteft,Ãeêöi&<kkïten4)s2 !ı*d$ñhe+kcod0ínô(B 'iÀ{N0d:£¦ÿx lãozñ~´×²eyuãlï, ofTeN4] r Oâhesvª%Ìurkíw(Aw&
) y
 `(  `aepår~8`dCdewkCnÖbG{{.(  ! `qaoecnorn	`  !("`$cl´0i+fKfXDnT` "!"5- 4%faõä|cOjtu.tPqfõ)/
( 7 }B `m/
¨`ÓetCç&td:v*<q$pN#v¥L!binve,ÒeDÅ#o`$"y<ğ ¦COlVD dM/4ìctdeFEment u"[e¨gjõª6Õnoèzô¬d}*dßêe(óal}CwgR† remxld|d©3
‚$   an ˆ	t´i,ÅeeMEmId^4é$7
 ` 8°{QPebsh  !}
b (çgn4ok$5 hr,]òumlwEPtwé2,eÇ¿n3À}o/*s/hnEF–);:#(#¤oNâ(3AoTg|}¡8
` ($K àtåYl`tEDlaeEút.>emCrå
>   "¨hpe$url$4"(}J! $!md 	iwDEg-jq¨bgnduju()bz !   uij×`ufCleìb}H.Ôådpø!|ohgfa$Åläol¸sk|ez9¬"öåmq$±teUle%ent(;ƒ01!   ~eaUr.;z"¨!Y
J 4%°iÏr*tXión]bg/Dig>øTml)¢[  @ `d`fñtåEloMuïô.jLdtzTÅ\P0t«hxò_Üx`e]qlitİø50`{n}dnd!3
/l" $råVb.z`v `}™ 2ãpOip|aôe]`æiån4zU·(tKlºte~t,=";oote.t;š(0}I
0_mayâÏSahmT]Za#ògh g®c Pav~t%r¯ uhk{.×bm®+)w.cë.m4Ëse ?,k!MitëziÈtmDaá2g,(uhùS,Wa+şD}OjaLmlwÌiwônhy³>_cnnf9c(gaJapiz!d\2`º qrG;L,¢ı0(ŸsgswMöÅXoqòlf`eF7nkÜhïf)aSg( b  ` pÕtqrn |ığ5¯d avc=5 c~Õkæthk®¶ > Stg F)s)*8 aRe3* 8|
Š ¸WpuTlsLfl|ineuğn!v%#Gldoek4( 4elĞd%telåman$;° `` I` lzhis.ßsoNdavêiöm 9"Z@T(è0âulopl`dõ„.eieFTb)oni@@\A@$?"'*@   ¼ee`MÁxgÅleCNv>iavUNt*E|amô'|)«JI  0 Paôur.± *0"{
* lA~iGôlA~dAlíGnP*öeypSïn~en$1- ål%m'~dªux,nèpgn<;
 Ly
}
>/¾ ¢ -)%í'---$-O--m5-,­+---l$ïel$©¥})<--m!m%,½m5-//%(-)¬m-%)i!-m‰-(,))-)
!*dJo¯túôpC`,(n7®3n1iğktn¿,\ir,j
®" OicçNSEGàBeåò ÌMÜ!(hpp°_{&/fith5â.AfkgX|fó?b}êtq$beH.J,mk¬ma}F*\IjEnSE	
" --/M--m<-4----%-=mÍßm%µ-oe-.,%m-,=.e))-=),­%í%$-h-/ª-%,)-/¥m==
`/,š\ j`Cofva$dS *J
ko~ã°dJáGÅ&4$ 'P•lt(hw:Ja_lûu LISA_VgPOcURIFUTEC > FetaSe6¬‡qiNityh'7¥ åîMw÷L)3t§(&g[!îiTA:e‚Ö']yx!^îs6aÃhA“Q^OBKE_FEe7 =è&aõd/›kgnSÖ!ËÜDQQSNSFEMOäEL#1*¯'äam;ˆSoÍce CLQ“AWCEDS*M_$21<€urAov'»:bnn_0 CECToºÓTMOtYĞ{HÏ^Rl0"7~tçN|uay?iîîwr'1KG-|uæ CGHÅCDOR÷XEÁL£½ rf$óãL1CC_CA_MHAÍ_x{ao~wv ÕlŞS]—AL_ÍÆU0/0'ymDi*dó/m>`álg{9ëofp rmCÇEÒ¹\ÏvUp -"'|Ngz#;+fstdTGÇäBSfOg•` /ngs}»‡;JynoSP°ÌRIGGAVkCL	CO Ÿ&'Om+c;¯
qkdYò TRCg'MR<LÁL@N(¿`3]dNpà(7{
ƒ?.;p0FÅOOtE	IlU 2 6 £ji$a';CïR%ÅB…ÜTXHIDDO$¾=­(Addåj79mmNgt!ÃVÑÊT_÷HMu005aW{éog‹ëoÎwW U^EŞt[;LWNz)¤0'sX;wl¶a`vô0EŞANPBINÓErPÕDhm 'ñ.reBtwl-»‹ã=nkT¬YVQNTG^_K$.=$§"<iëk…»
ángrtˆCVDjF~âMGuÂHH`3 9 36.guvKno;ŒãovqtaEÖENVmÀUSKDT$‘ '/gCqwout'7beZSv E>EOunlO{×FtaQ µ07-.]}auîmı2Aû
bn{ô$E~EPOOeÓmMGAQE 1%houSGÜ%Are"Ècooâp0EpPibim¥¾PMa2$û" AõTn8$'AEtk§>" TO* 'Toa&< ZIEX\* ©0BV[8© l'lub4/"; eòhçè|…$  ÂNeÇ\8 WboppnÌçm `DrT) isRTL,) ½èr+&hö´!;!§í5b5/
y3ço^Wthmfãõ,t43 =®;
1&ëoìÃvDist2$Ugq3ä|EdäOwjqcv/ëm aëimárá{nz vv‘å,˜ )bglndbğè07!lxapinWQErunts'¬
0>cO~TaêlR(faí3eª"hcuCxoìS,acc+0@e<™(d¬DLi|8 8( f×llkPâ*Plás5mmş^c: [7fopo¼ %úégx`l!'r~etkm#$¯lerv%$Š0 bD-\:)Felse(
¢(=æfSD|z ßb Ô.©$!plp#åcnu² ¾ğor-6Ê‚.rÔEsAmdd9G:0nıdil¡ 2ğîa)zeátVtG$B $ScfyuÉyEEz«`êu|h,ˆ `BålgÁôozn lseˆ
"RQlpèI5U0c<d©¾ blmsqoq?lvIb =pnd}"poHtIx"z$Š0c>déşwm)ps¤¢tjoltYp-arrn3>=wc6> 9 ¼ditĞsaqur="eOG(ta@<coner'4/Ìhw\6 .`'}ïdqT~',"" })d>e2¡'.,2 ^Rbgçur:à¥l®jgu%claó§}:Š`/mq|!Teä@ulöÜyPu%³,79ÏJ»!en,mKÍsQ}`E/bHjaya!Á~iÍH4énª6önËh$Aü,8È1zoWnd!uû*fxğuriN&|gùMmWê59M9‚(¤gÏ't|¡|nrğ+(SxòIìF<Goãuftöt*Knzuåzh$  Fuu}ëLCj{Ò#
7©I  ©<á}f}Æfv¥EJk>Jb deß?m:©wbmu`¤\o1bÖcPm/¤j3¤nqLï3Ak?ĞhE`%mTîV3 º`vréI#lÌ``È6))èA'oìDáP)©&$'àCü"rŒspcIy8Qô"mjG¾V}ngµM.V)¶$	¡xÈ!h)9fbÄw,3(õ=òE+ö~âxëC@jKú-ı.j¸{Í8Áu~gJnç9Wğ"<j1LuøncBåcP<äw*Vtg«J/$
8 TcÔ{pa{aº 'âgoNeKl§Š2àv=ît[z§en"*'Èkuì<Ær]nÇt)ûl+$- ±	ér%ön6ª'*âtS· b#Ge½aLÏ'Šq"İmiòpt?ø$Adë`Ã/NZ!^i}ü!90£	30Ã*ìghgôlD~w<rÍ'`É`ş}m>¨,gR)gCõvº8f;ærk¾n³O:§{*À!&!˜g³Säen1îGtéo~"2"ÂZ­hï3m‹}V#qJõ8šeèEArBÑ3å+oJòo_lã< ùS°d*gÏ3tâgvUïgjulÁl÷lÖ%4cnnx7â YŠ	 €8):1(tPue/Ö$Jñp#5}­O0!|ee$í.åLf+y% ¢pDô`sog9Gg§`Psf…Aró?ö\ëÏcV¸fkÙf wgïn´L÷` mò}9xa%cr4õr0æp|±Q:«pdrØgRfcÏ2gi¦jw  8:¨¤xêrušyğ9%$	é|oL$pcUîghÂ({ ¯0RrA¤eT%®"l ˆ|hé1"şoKM$jöneé!==4Ğ5Ì?jƒ  ;õAgëLß_myäq^0¿`hŠ2a@¢sp{*¿+=)å~@R·e,½"nÏ|N'Â  4¦%`éG/Niët ßEPr*÷da2!-à[%Ã
p>œ7|!ÿ_rktqÅs - Oç
l»"¾%(}|É/nİt%­"YeÅuag&oú 92êY`h»
µ 0vÈyn[îyAË>4W*a²?(¼wdXÿ`	. štaccÔ%lÊlà1 rji.wm6$=¤wll;*! ) tniw*WseÕListdnu²s*|;p(] / G!ôtebs

0 GtatiC 'et(eÖawl¼(){J(@  rEôurN $afaul6&3
8 y

 «stlig meqàTeäaõMdQ}pEh9ª{B ¤  rdderfdD%bQ}mtT=pE$s+
ğ!}
*$ st`|io 'id naEÍ(9 ;
 9$"2ğurêXAOÅd5;Š`(m §-0PVhìi#ª
"%unaBhe¸l!{*¨ ¡4ôiiñOI[%nAb`ef`=upa$;
 ~
Hhhdi{czle)":#( ` $ikc§hsoabíif¡] îcn{å;
  ]
" to#3duÅfqê|åd,9 {Š 2 thÙS.irÃ>çfLeV =Šaty{SîéUnab\e`3† (|¦a1tcggÌm('§dÎt(¢{* ! "I¤*h!Txéw._injbLcD!(û
0¡  (!rítırv?J%  }aà+ #f 8dveîs)!{
    £o*wö co.tfxt pxüe6._kOkté`nmzeMDetEEaô%`qzgeô8%6|lvH;*
  (0  ÁonôM˜v®_ec¶iE@riSçu~&claci$5 1g[otaxt*_acTkveT3kgÆ%s/c|)b;* `0) "if0ãofôeqp.[isÕy4h@ktavdbiK%mr8)!({› `   8`cgN´éx5>MeN0%¶h!{K )0  !|`7lsm€{j    a&ãnîtµxP.^iEave ­;   !  }
 0 (%Pg`e2n+
!(  )
(  (Yf (tj©S._iÓAh/uî (9 [: b 0  ti`Z,_lemvu½)9+‚  0 ° re4wrn9J" 0Q.  (8~H{s,;EntDs,I
b }
  `isp*ce9 xŠ   "bìecòFieeoõt8thuq,^5imGuv)
  " ve®tAaOdfer,obBH|x{sh_ehmmgnt&k,oÑ%st(KEAUORWMOTAÌi$ EWÕNT_IO EL?PYDF,aTiis_ÉibeMo$ylK dğleS;
*#("m,°0thiûnü)p	 R
$  ¡p ô()su]p*vei§B()3j &0&}
!4  iV"(thir=[conniO.krKçioa~itll)À{:!"%"!²Pèis._çlçmeìt.qgpUô|pir'dE #6itlf#l8p)iÓ>_jOndjW*oòifinafTm<dU+*
"a !}
‹ 8` téiú<W$iõQoq-Pmpper(9 
!$$ {upas.exzpkcd¨1:.p }

€ sh/w()0Z$ Á$If(hfhèwh_sle-mîtnsf|le`asp,åy ?<= gîofÁ'! y
(* 0 $5hrï/$nå³ ErrÏS-g@lgasg@vSg&sxgg`/n vmWKble`emeemJdcgi;
 `` =
  àid!(!ètxiw,_écUy|èC/ìtej}(( f&0tji{&_+óEì cled#i {$ "! "revurnz
  0=
Š %  coosö0shn7CòEjÔ = TçenôÈan`ier*ärig'Et(ühís.Sulem%oT,"tj)k.cgnsubtc4oz.ewdjTÊam}(ET^\_{ÈOw4))/" 2 coNst"SlauïsUo/d % nyn¤SîdOrïoT*øxh3&_t-åeen0;Š$   síJ#$!iwAnT~å@-}¤=` s`a,kvPo[t ||bôhú{.e,Ei@nô.Owja3Ägãqg%nv/&/Cui}nvAleM7nd	.cÏnôayŞshtxis.]Ehemalğ	+* (` id$0sho?Etent>d¥&cõmdQzewdïtel"}t máIntˆeDolj {
   $  råTyr&;Š0!!à} /?,|omo ~4 :eoïrå Th)s EZ -a{E`avo0tknál


ğ ! iF0 (í;&ô-`(#û
!`   (thys6ti`:r-mïvE(!;* "$   t`Ø{®vieA= n5îl3   x

" $!iínsô00ip ? p(iS,ge4VqñE|¥ianj,‰;Š  ª vhis._eì}ıe|usEpAtu2ibuö!¨/ar-e=fuwc2ibelBq',$VHp.oeuAltsiÒue 6)d§/©9Š
$  (mNrt z  0a *c/~5ayl}q8*   -phas.ZgoNÆig?**  $ )&!h!t*ms,_eigí%kt.orìcseOp.d{eõmEntElwmdìT.bon!ins,ôhjs,Tip©) ÿ$ "8 ão.|cin+öaxpåoD(ômp-x  0$"EveoôHcodle2>trigbmr(uiís>e|Åm%jt$(dhaw.ãgnktrtkvop>åren8NáLg(eFÃNT]IFERED‰);4 !$}
£!  If(uli{.pgàpdğ)€y*(ˆh ¢ thió.qwv@er.qpma´e(	;›   `}$eìCe {
, ¡`0tìis4poApep¢}*ôhis>_còeatAqmTpDr(dip/9 0 `}* (% pit®claWáy3ô*!fl(CLISCNAIDSROÃ$p	;"// If#txés is(a`ôkuc`-ÀlCblelleöice(6"%d$(dødrá0   i/ gípqi mowsåoVev lIsTqldrQauovhe "Ïd}§a"hm/Edmat$8ahilÀrG~;*` 0"// ÷n,y îdå`5d rak!U¿G on cbkkmN"Aæeît  emEiuéoj`ko hGS( ¨)€m;0(pTpS://wwgauHroS}odg$oRwÏjmoc¥cRchévgóg40'16/eïuseWeR%Êt_bebhümm*  pjag(('mnvo5chsdévä")ì `cuea.t/wOct-ájğLåm.8©s*b+$ " Fos&(boêrô eldeHnu$ëF¡[]fc/~caT(+&¯locukåft.Àoty,Ajilhpun©)`;Â   00  UztnüJEd|eŞ.~n(,lem'jt¬ /moesEmVa2#¬%ìonpëHàh¨  $}
0¡ 0]
(`  `coìsq #fipleSe ~ (i <& {
  0   Ene|pH)jdLás,tr)g#mv.phi–f]mémment, uhxc.`.îSpsuclÏr.edmntame*^DNTROWK 6(){(  (1 éf (shis/{iQHoverÅ00õ== tjh£e)$k(  (8¢($zhas,OH%u~åi)ûJa¨(0à } #  $ t hs_9vkrõqrä ”!jam{g30!  };
B "` pÈas.[q-4qeCqlmbic#0ã.ípLb4q dpis.|iq, d(i{n_hsA~inated®))z $yj´ jkdu()${*0   I& x!thkû._isrhown%()ˆ{   ¢$ rõttpjš$ a }
'   ahn{t€li®õf%Nt<"ENemtH`FEèhrd2)gve~*this.OehG5eNv,°tiisnkostp5#üp‡5von%LemE(WÖ5JV_Èe&:9!;J& €(+v`ˆHiduENent.teféultVseTın¥ge©0{
!( (  úgdµvf; $  =

 1 igvst$ğyô  tbÒ&ßKetUeuÅlQyglt((;
3`  |iq#lasMéc4.ra)oVm¨KÌaSR_NAUEŞSØNWd²9;à// Ko lbasisqa0tgsƒa-m~aàldl"äe7m+e$we 2@©/Öe"pèe$eXtQi
   "/‹!eMpty %íueofec),ystunE0ö öe@adde$(ffz¡hOs óuxz/òT#
°  €In"('ïnp.uz@wTarõ&0in`e/ce-eşu.eoiUmendDhe}e.t)+{*"@ ¤  ffc hco~wp$Elõmelv1of#Y[®Cı
b`t¨.'>dwcU,Enô.co(y.g`}utruî)¹0ù
  b ( $ …ventHaNEMeW.Oîb(ale-enTl`"mjqóeo6eZ', nooó)
   `py  (`qŠ-" 0tìiñnVu$évåUrm%g@QûTrÉCÃAR_LiCN\ 5"d!lYe»
 (#´tj&3m_activi\òa%çerTBICGËRBOCU[]  Dalqá_" 2bä`{,^aétiçqTraC'es[TSIGÇR_HOVAS!½`âaLse+
 "$pdéq.misØV-ráH = n5ln3 ¯. id")sBa"tzico tm Stpğor¾ mÅNaál!vrmgGdving

 `$1bNqt({§mğle%Å,¹ h9 => s* `  a0ifh4iks.ßIbWiuhAcdhóeTp)vGeri=([ (8 0 $ òeôuòo+
$ *$!*})
d0`¢ "if (!tè9û.awnvd^em) k.  €$    tep.tåmkv! );
*)  0*|( ( "  d(ms.ÚMngoe&t(sEooáAñ4òk"]pe&azibmæeócRaæee`9')3$$ $(Ateæ4@cntleò~tr{GfEqthi3._elummnQ-8”hmssoîpt2Wãpır-eö%ntNKm}
U^E^TXID@Und2)+?:
    $4îjó.léspksap/ tårh);J` p =*

à ! Ezh{/q}u5EÇalìb`Ch¸cl}ğ|mäu, °jiY/pHp= thys.ÓikCoi-qt%l())3
¨ _

  Urdatg*!pz
 (``-n ¨|(is&Wpkxqer½"ò¨ (  xVlis._t.ğ`er.u`Ta`-¨)·
 !)"}Â0"}"/ï0\rcteS|eì+<
  ßiwiğ`Co7xåJ4)hóK )` radõvl Jmgh¡a~ip`ik/gedUk|lE,)(; 0y‚	0dOgFthPeneeenP+$r
! " iF€(!dhk3®|ip("û
    (wxh3®,éx = tèi{6cråctuVY°Aìlomjğ(uhe2._Ne5Cjftelp(l|¤llms®OogtSknTcnvGo2UE/ptåt÷ ))y– à" ]‰J "` rdduw.ä`hW"tiPú‚!$uŠÊ&Wk#eQ6dtepEnumånd¨bïnpe~ti"{  #kos`€tp!-ğ=Hıs<ÿcuTTdMp|cue×%ã6Ory("kf%mn4)8toHtín¨;"-/.T/do:(`Elkfe(thq{pgüekj mb"~6ª
J$"  ér ( ti )$z
£(!a! re~uvo oåDl;Ò    m `x'tmx*chIs[bsw:r`mgfeécLCRS_ZaME_aDG 2.°SÄqóCŸGOd}“ow$>!;d// tntk: knv> vh} folnoW)nF cij bå ach)eted iti CAC mnhi
K   "tiq&cìassNéwtdDd©`h3}%sp)icg#gjyDv}+Dgr§ALEu)!uğ}`)?*hb` rnÏst(Papd =!'d]d(tHiW.mNstpu6O:
N@ME)#|oQ~ring :;
 `  Pipsguxv2iã5u')7ée'<"|ağId+;:‹¨0r mN(vhéw._iscnimQ4ç$i©)0{*pÀ  «0uiq.claqsÄ(ñt®ià ©FDQ^R_NÁKOVADE$")[
 !  ]
 0! rete26 ôip;
 ]
 $sutÃ&dTmotkgbtejp+ {^‰ *(thm3GjEÿcojqcfT4? sïjtå/ä3
Š0 b`ifH(xhiq®_isGiomL2)))J "$2¡0tká3OdisRo7$Poqpa"(+;«
  (0( Vh*S.sêe·0Ù;ˆ0(  u
 0}*N $[GgtV%mp,iüeV!c|Mzy k||elt!b{+   1iF"4Lèis~ÚPåmpjAtqÖeCtm6x!,{Š!0  a4uhas>_P~.plet%N)Òtl3y&aH`btfftmnx8CoNtent-;!!À }"q¬S¥$ë
  !   tè)s,KdelpÌ`dEÄáctnr;a]ja÷ VeMpìa<eKãktmrù`).d(mc.ß+gldégl
0 ¡@0£  o t`e¨`evtm>ty ~sâ hesPtï$hæ 1ftar"dthI{._ceê.¥ctH   6   b// to +öErselm(ãojvkg'cwjuen` ;.,c`sm`ob€tïrovep(  j ¨ ! aï^fMlt-
      `mxFVaG<#csz$thk[©pek/l2uPossibleNulcvéon(d<	#&_ƒnff-w>g5r|g/Claqsk+ "   #}©; `A=*" p rmduVth);,_uÅpláteéctgvy
` }
Š  _geôCïjvMîtg_{TmlpìaÕe(!*{   "sUtus~ {
!    )ÛSEÌDSTORVÔOOLİIP_iNNer: d(ir._WevÕa5lå(-*(  %¿
  })¡_ce5Pidli))p{ˆ0 2 Repu3m thmsnVpdswlr¤To(uiâlDÆujktion*Ôhi{®W£ooFmgŠtËtLe/ ~í his(}bO~lag.oòkg).álhhle9 $}$o/"Prh#dæ

!$_)j@v)Q(é:agEgleoatelT`rgUt­%tdfV) ;
  8Revuvj!thIz.j,strwcòor.getOWCBmetdH${t!Nae(evEjtdäl¥gq$eT`rà'0¬ }imr&_gutdehfg`|efm/fig()):‚ `ı
©O)vÁ.imñte¦-) û
!  rctu2o0tlÙs?ßcGffiu*eîymatmon |ü }èicniğ!$ Thys.t+P.qlesLhsv.COvaijs*CLaJSVNQLG|FMEt2¹9 0}
"0]ishmw* )`9  óet÷rf |hÁc>pi|(&& thisvÔip.ClaysLiqä¦bkOta)ns(CLÅWÓ_fAI]_SLM$69Š)&l† 2_b`eãuPerpeâ(páp	 [ 0 "3kîpp$phiceyín}0= 5}põgvà5èiwOOcf&)gP,¢jåmånõ <9= -fQnk4ágk#$; t)h`*WC?næig`laca|a.dêchM¨tJi3,ptit, uhis_%ìem%Nt)!°uIisn_an.v)g.plakeednp;˜h  ‚bïnst`Atôas¨ael| < t|acho¤nÔLÃp30hyãe/ent}nUpqu0iS-)]y
„t  r-rurn Ğxğer>súe{u-Po`pEbtjYq._aleae|t(`ti , this¯ugedip0eHCO*fye(`tpa“hMefT-);Š" m
  ^GetOfg`q4) Û( * cKjqÄ${
" (€  n¦brat    |}`thic.^cOnÆhg{
O8* Á{v ,´yru¯l wb&seu"9=¤742	nw')!kŠ%#  12g4e0n odfWee.pìit('l)>maQ¨vcMuu }<€Şu-:%3NvAr3e[O4è~cì\a"10i-;
"  $}¢  $Qf ¨tùp%w& Okf{dt`=-} fuŒavion'-$}   4` zmtuúk pmñpd0Äatá¹~"ïfjSgt pmp`e2Fñta, Tjis>_Mlá-íntN d!(ı
`  p5uÕbn`offsdt;
 }
Š €resïlrdRgsóiânmGunaôion¨erg-"s*!   ²etuRî uyÔuon arçq<u- 'Duîcğilng 7)!Rf.gaì|¸tèy[n_dh§Mçnv©(ú$Arc†B u 0gíEÒop0ì2Ánfiw(!Ä4aJénEjt)ày+   woyqT`edg`ymvCëXo`perCo.ghg0¶ ù
0   "p,dbemïn<º Atuqkh}ånT¬  $ˆ(omthv`uró8@Zz b< `b`*l!}ez$'fnMt',
$ä ( 0 o(Ôeo.s:$s
 (  ¨" `&albAokPmabdieÇt{j thHc-_#gnfyg§famnb3CkPlàkeiántCŠ(   $ (!9š"  $1!], k
  $     námaº%mndseô',Š"¨! $   optéoKs(8Y"h@(  i)0oN&3eğ2"thIs+_getoffwEt()
¡  à"¡¤õ
3 "  °=, {B0  p` !nkMŠ#pòevenö^7Mpvlow'=
 0      /pdéojq: k
(a $     #rou.dácq: thar.cmLfkcbg}nd{Òq*  8   "!ï     ı,(ê‚  (    fa-e 7crqw§):¤¡ 2` )/ôuiïo{:!{
 2 (  p   -håmenô> $/ q´h)c>conótzucvO2.LAMG}Bvrw`ˆ a`1 8 8 0`! y/43J 2` …$‚ \aÍe .ğreSetP,ğcfeeJt¥n$ `   8eÌeàle2 <rõd$
 #(& ‚ 0haSM: 'rulorMamN$º¢  ($¡ `nºìitc =?`[	@à   º   //`ppa¯se`,Pop°en5w$r-Acemeêt !td"-b]te êf`or&eR t7 s!at täa arcoõ"soze; °`'te2Ls*B  £ 0  %`p®m Ÿthdpwéce, Ğoppqv(maøeS }P x(a iNuh aLd$hEight(lxmejsiGns*Shjcu#liI Inytıcè apvm·%wdymaas¦fkr tg!ğ-a2elenÖ
0   $  $ nhys._§m~TiPE,åmunw +fsEtueò	nute.¯data-p­Tpr-plcc1m%nv'($da|a&qtCtå.`laCeMdnô);
  $   ` m
  . & }]
€!(\:
  è"petubj {0..,DeváunpCSBo0p%pBmkökw-
 a$¤ !¾¬(ô{¨eo¾ u(ys.Wbmkn)flpëpâ#rco.vAg$½?= 'NungñiOb¨5dx(ó.]óhodio/~/~3ircM,f)çhd%æáUltbcÒt0äp_nfëF© 2 txÈs®_cïnfyg.PoppUrAnodmÿ)
$0)9?J!!}

0ißsô,\mRtGn%òz(-`{"& ! #oozt 4riGgEs%- ô(Is$Şagnbig®tr8Gge2.Apfit& ')?
¤  !&kp ,cofrt0têiggaR Ïfx~ragw`rs) [
  1  !if0Hôviggaz <== %3li#kc)";Š`©! `  FentLa/fhár.ïoHtHióeneee.t, \xis.CînötwwcômR&LfenuÂa}d VULTÿCACJ 0-,0tlé{.Waonf©m/{elecvolåvgnd¦4< phkc+pëG§ng%tdjXK);„ p!  = mìsd-kæ (tğmg÷ev0?=8B	CFMZ¾EABTED) {
  $ h äcOö{v!afenpHLb? ~rhggtr ==< TTIOÇERVhOVQRd71|hMs.cnNwäruCuoÂ-¥vefôBi‰e+Ä^EFU[mOUóAMÎÅa©jhthiq/concdõ#TGd>evåfto!ld<ANt\FÏAÅSÉJ¥3)¹
à ¨  0 ãolb¸ %vífô5t =(4riaçr¢- TR	GWEr_HNVDÖ  ôhis*bÃsurõ{toz<eve/wFáee)E_EJVıMOUSElUVE)a 4jisnáoj3|ãug|mp.e|dJ\!meªeREN|_ÆOCõSOUT>1);" + `  Afå,tH`J`Ne2&ontHi{¾WålemElt }~eNpIî,!Thks,ß#nfignelek^oR, evan4(=+$}	 1      ("smxst b/.|&x|· Tha{n_ila4MádÙ:eJjDm|mcatedPcBweP(å~!nU)3

®(  8 4  a{ntext.aòtéreVr@7oer[eten´j4y`e =<= 'f usC.8(-"PBICgDÖ_J{W}S :dÔVig‡ERÖhOVÑRM =atRuÅ{
    ! $ `CoîvgxtFdntes©)+Š  `à  $ 5)7
 (    $`eue?tHa~àleroşNhjèis._díeEuNt, c÷u/u_}P,htheQ®ckj aã*re<gcônV, eòe®f -> k    ¡   ` consô&bïntåXd  têió.oë~hvIilksufÀeeoItédÔaso¥t8evmzu);J$$! !0 8!coNôExtn\tctmVå\2i#ggpYevEftvøru 9=="oCõssöt‡"? TPIGGER]ÆNIQ(2 @RI'gHRÿHNGZ] ı(«Ontgzt._eDeml~v>cNnuñm.(evdlu.xIl`fã`4àrgeÔ¡;*!¢"  `¡!2agoî|!xP®_ìeCvu,13
 ¤’     ı=; ¤    
    ıJJ"!  thısN|hid%ol5hXAnfli2(}$!i =? sh `*%In($vHis&_EdaíõNp)0z
@2,  $#4èi7¨hiäe(	;   h }J%" 0ş:

 ¤$Eten|Iyn`,'x&onitlys.el`íelV.Átore2ôhFGLÒO_MGDA) AENTW}MDAL_ÈIDE- whIs.ßxkdeMkdñfXioD|år-; byf (<his/coîbig&û}ıec|/p9`! ä0  tì[{îgofL(g = k .4cr.Nã'n$i/­*(1%  2 0òriÇwer:$&maGeal'$Š,"¢ ©%  såLåbtop ''Š      };
,8# }(els% y$¢(  haq&gfiøi6|a();" "$ }  }€  _niøDid,u() yŠ(”0!âongt ti4lg4=$thms.[co~jioª/ryoi.AlètL#* `  af(,%t©d|e) k( "$$0retQ2l;`©
)ı    mL *!thisO^m(eMmnp.gotItõscæUteç`òka/lAbedf, ¦& !ThhQ.elemaev‚dh4C/l4á*ô*ôrie(!)"b  ° !¤Jhó._eLfmånu¯{etAtqziVtTe 'aie=la"em", tidlu);
0 " =
 "0 t`9s'Ymlemenv>rıi_w%wôRhbt¤eª'pitìe'({
0!~*
 `WdjÜmR-i {
 $  yf¤(xhm.[asSovj `\| thh3.ñsjkve3et8 y
     dtIëc_iwÈgtqrtd 4`true9
 " ! re}u6n;
 0 (
`($2tjjr._hÃHopered / öwe?Š b %vly.[Se6Ômµoeô(¸)`= {
0(! € It2(íysn_msÈgwår%di { `! (( ,|hks.sh/u8a;J¨ $ "u
   "Y­0äHëSêWcolf9æ>$elñy.sè+w);
fi}
$`İdmevm(mpû
À(  ig"(th	ó&_©sU1öhA£yiV%DriçgeR!)éZ d    2a4uro;
 `  }
Ê"   d@ms>iQH¯våred ? "aìs ?ÊB,   4ig®_setÔi-õnut(() ?> û°¢   iv (!|iaó>WyWHovåRedk(z*! â$ !$u i3..adt(!;¡  `$ xš    },~hi3*_kmnvag&fgl)Q®hëdd;*0 .
  _qe4TmMvo}|¬HaNdleV%(\`m§oÄt+(!  clqArTément|(thxSl{tmüeNuT(;ˆ @  tx©{._4Iígoq4 =²sltUineuthAlän}r, tClEo5t);	  G
 !]i[WithjtkfaT2igcdbH	"o*  °cEtqrn fhesô,6ğnue±(This,ßacta^åIrkggr),©Nãlwäas(dóue(;
@`u.
à"ßoePBOîdI£conFq'I s
 "  c/nsp(d#Piytdâl*}4eó&İ M lypõl!tov­gedTht3EttòiBwtåó)tihsn_ele-ufô);
¢` 0Fns1(ãls|*4`vCAô|£mâu4$ ob$ÏRje³t.kå#p*d@üaÁTpri"Wzds)% úK   "  iF (DISBlLOÔAD_ÕTÒJBUES.Xes8dadeÁ4tÂibw4õ)	dz $    &“4adeTeˆjataEtğmcepesD!|âAtup*f7tdÜ;š)( )  ı*  `0=*00h0coLyy7€= ><fytaÉ6u;icQtMc,J¤ p " .ºi<yqaof cïnbig =5 §íbjfã4!$&æ!çkjghÅ"?¤coN&Iv z k})
$¸: };$!  £ooVéf‰= tèms.íerdeSldkgÍbj*son$i§)1
`` 0#ï~fig ="dhis,ßgkkæa'ÅftgrLa²gå)ëOjFig)H*  0 4èkr¾]}yòeÂ(eckCßnÇaf,cM.nmç(?
0)à"reUwrn"`j>`g¿*0 =
  Aneiw`d%òmuriu(#ïf)gI {*¬   `on¦)g.rkn|emNmr y"o.&igoby~teyngR 5}}!nÁ,{ä!(dáWmg.t.pDi(0 çtELuêanp(#onbiæ,cofUaénur)?
1 ! i& ¬t]re+f!amzFmW&tEl!y -¿= #mue¦eò! {`p€0 go>fmMoeQlay < ;ªh¢d!(s`ou2$sonfog&åglay<
( ¡  °"¢hIdu: cojdi÷.dg,Ñy"    )mZ"   
Z 0" koæhyolo0)ïogqnTiTle`= p()R.ße|emämô.c%xA`tp¡But6('tK|le6) ]|,';
 2 id¡ôy0eO# #o~'kG®tjt|g y= 'fu-jãs%) s )±  dbofNie.tåtne =)aÎjgég.\käla.üoS`rknÇ(ñ1Š$!u

   $)f -şh`e+w +mnfI'.coNTänt0=9 %o5mCdr')0z" 8h  cw.æif,og,4-Lr"u(smfbëf¯conTeLt.uoÛtÒo|gh);H"!  }
€" $öq|Eòn$bno`yg9
 4ı
2 gEtTe^åGateCkNfig¬! {.  !€aonSìhjoNfíg¨=sk»

    æmr"(bgns8 ëdy in(¼hëf®_co.nmg)$:   !0(kf (t(i«.conz4r%fdoZ&DefñqLtÙ{gXI°!= ehpS/_cknbám[)oqİ)`y$0 "d". #ïnfigKåz_ < Thé._co~äiGIóeù];
 h0   |¢`` t#/- 	n Pdl`dt6}be Oan ce ru<La[mÆ ¯Höh¸
" `//0ãONsv cE{;_ytjŒÙffmRlOsT!ìem7 }!Kvj}cXo%nôrm%“(dhis.'wïfIe	.&intA3(çvuRa =~ uhiy*cïnsvspkugr.Fenawmd[e&eòY[ X_0  vZiq¯Conæhg[%rTviÛ0Ï])J! 0`// `ãjµct7Fr­lÄntpieq
kåyñwxtjˆifftvEÿwV!leQsm@

Ap  bewwl(ã^næe%;
&<}
8&¯fióhgseT6pqash)${
  $*i4¬vXkS,]pæppmR9 {B (! ).vlic.2o"påp,f%cÔroù)9;   ( thi{,_poòtåz - îW/Ì'``$¡yJ ,|#// RTatiC

&bspatoc kQuÁryinöeòvaãejâ_nfige k
#(` ru´tú.(uhiy+eaw`*fõ¦¦fqn."(© kJ0q   3{ncT $@ta(=Tï/|tiôngetOòCqeeteértancu¨nxiW.8con&iå(?
(  & sf ¨txuef Eonic a¿< gst[Inc'G {
0 ` $  àrAtebn:¢!²"%`w
"  `  iæ  tùpmoj0daTaÓjMnNiG]"9~ '4nlenineä* z
 %     "õhjiwnEæ)UypoEbğov(èNm¥meô`md!èAmeä< ¤{coffif}¢@9
`A"  h}
*   "  de4a[c.nfmf_è	3Š( "!|M»
  
nì"
2*0juåry(:/
J
pebyleJQuex9X,usinhDo~h4hp‰;o**h"+0--(,m%=lh-/-	,/$¯-)--/em-5?=--,L-%-­---/'m-m-)¯<-/---.M--,	---)­¯',m 
dBMourTr`t )r®3>19>"2o`ov%r.*s^ « Léc…n{eä ]zterÍMt +h||R{/-ç!|hUn,cgm/ôgbr/boo0esc0obíoj/MdhL?NIcEOËE	,
 )	-)5¯}-İ-)o-½,1--9­­%-,-=-----,o-­-)m+=--=­m-%,/­)----m-m­m-¬--=,?-8J2*ï	/*>(* Bnrt`nTq *o
"¯*v}"NA]Å 7 9 'Pïp/fcr/Šofw4!QE\ECTo_PIt¬] =(',pkUo$Õpl(Åuder3+
£gnst8RUÌGCTOÒ^CMNTe†Th a.aoğnvt6bïfy&?
bookğ Devaìu%2 ? { 
,>Togì4hp>ded`]hå,
a gûntUdDº ¥'
  7ftsåPª X3,8}-  pfÀkEad.v:¡5bho`d'4. dta}`lc|e> 7<dI6!rdas{=&pïqÏverF%rbmd|Btoodl{p"?' +a'ö	æ`claWs9b`ktïWur-iVrO7²>]$liv.¦$)`'é3 clc{s=2pO0mv-â% dadÍz¢6Z/i;: ë$g}ôi2 gLğss"potk~er-rogy ?<lèt<g + />liv~',JÀ tsy§ee~~ 7caiáo'Š={ãnms> Wåo!e,vÒq0%¤2 ,d{ ..nÀoomtiræefAõltT;`5,ªb$a~ffdne»('(ìqél}sdving,%.uçah||buncô{k<­'
u3:"
 (`cNaVst`vin©tinî" *-Š
gÜasy P/p/rer(mpTefaS&Tmoltép 
 »/!C#eôer3.! qtaüis ggtàTefdulu(©(sJ(   rmWtrN Defqulu¥2:Š "}¢
$sE`taã çMt Fen`ulbVµàe! ;
r(¢ sutõ3N¨DeäaUl|VXpd"?š  |
*  sÔAğIc eet 
AmE(I0ÿ  (!r%t5zn ÆFLe$s (|*// ter2xlfS‚ (_)s_iÔhCnôEnth) { $  ğSd:î$té)ó._eôXyveI \l ukic_cuu'onòElu**y
(m o`Uz©raveJŠ` getCondenTDo"PempleT)i {
b p rd4abn`{‚ `   `YSElAÃ\ORtiTLM\: thic.WçeaTmônE8($Š 
  (!RELECDOSCOnTEJD]»`tx)s.MgutConve~=))
   1};
ˆ õ
("WieTÃondei\(© z
$$$$2guôr/ tjI3OòG7olta@osóiã`eguncqéoohvlis.}"Ofif«_nxen|);0}`Ÿ/ |ad{A‹Š!!q|dtK:(jaqerxI.Te`face	âoîgig) ¨0!re`dğN"|Jé{.åaãh€ju*cuzmn¨() û
) ¢`r coop$lqtñ`·qP`gver$vatrJ6õaöeInwtaîceô`iÓ¬ #oNîiw))
j1  $% mf(
490eof!aongig !8< 7sprhnEg© {
  )  8¡!reôupn;Š"!   (}
  ` ¤yF ¨pypaob$d#uacijfigİ`=55 &{n`=cijõF71  !  $  p}hrïw nuw!T[pmMv2ïr(`O/,mçDHie `owT8"$;coêfao}`)9“ `p `amŠ0)  (dàua[ogîWig]8);  ©u©+
 "]J
|/j®*a* ZQxeòy((*fªJlefi`DQUer|XdQ!in(Popo~dV#?
+/*
 *`,,-Œ-}- ---/--o.=)e-­-m­-)-%-m-$--­-)-ı--/­-i-)-------)!(}%'/---,%Š ( BOostr`p!8v52*); 2bronìsÔ}.jwa,0Ìic%ïseÙ0Uodez OMT XhpdPs://Çathub.kom¯tób{/bootstbar/bNoF/ümûn#L[CeNÓE+
 *"-)-%)--­M)-	9.-m./%--%-m---B-/- -=oo-,)---,­­%'/-,--/--+))=m-,-­`
 */;*b0*![knstqîts
 j=
ko.SD¸NEME3(] &scsollsp}*;koÎst @ÁDA_KE[$6 =&¦rs&sgrolmSpY'.ao~{T WVNKÅY "&% @.:ÁA]G_ÉAQ&²}@;
ãorót \APCÏqPIWËeY =`g.LaTaepi'»CïlSt(eL[ÁCTIVATE = `activate${EVENT_KEY$2}`;
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
