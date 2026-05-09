import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { initMenu } from '../assets/js/app.js';

const PORTRAIT_WIDTHS = [320, 360, 375, 390, 412, 430, 768];

function setupMenuHarness() {
  let clickHandler = null;
  let keydownHandler = null;
  let documentClickHandler = null;
  let menuClickHandler = null;
  let focused = null;
  const button = {
    attrs: new Map([['aria-expanded', 'false']]),
    focus() {
      focused = this;
    },
    contains(target) {
      return target === this;
    },
    addEventListener(event, handler) {
      if (event === 'click') clickHandler = handler;
    },
    getAttribute(name) {
      return this.attrs.get(name) ?? null;
    },
    setAttribute(name, value) {
      this.attrs.set(name, value);
    },
  };
  const firstLink = {
    matches(selector) {
      return selector === 'a';
    },
    focus() {
      focused = this;
    },
  };
  const menu = {
    hidden: true,
    addEventListener(event, handler) {
      if (event === 'click') menuClickHandler = handler;
    },
    querySelector(selector) {
      return selector === 'a' ? firstLink : null;
    },
    contains(target) {
      return target === this || target === firstLink;
    },
  };

  const classSet = new Set();
  globalThis.Node = class {};
  globalThis.HTMLElement = class {};
  Object.setPrototypeOf(firstLink, globalThis.HTMLElement.prototype);

  globalThis.document = {
    body: {
      classList: {
        toggle(name, enabled) {
          if (enabled) classSet.add(name);
          else classSet.delete(name);
        },
      },
    },
    addEventListener(event, handler) {
      if (event === 'keydown') keydownHandler = handler;
      if (event === 'click') documentClickHandler = handler;
    },
    querySelector(selector) {
      if (selector === '.menu-toggle') return button;
      if (selector === '#site-menu') return menu;
      return null;
    },
  };

  return {
    button,
    menu,
    firstLink,
    classSet,
    getFocused() {
      return focused;
    },
    click() {
      assert.ok(clickHandler, 'click handler should be attached by initMenu');
      clickHandler();
    },
    pressEscape() {
      assert.ok(keydownHandler, 'keydown handler should be attached by initMenu');
      keydownHandler({ key: 'Escape' });
    },
    clickOutside() {
      assert.ok(documentClickHandler, 'document click handler should be attached by initMenu');
      documentClickHandler({ target: new globalThis.Node() });
    },
    clickMenuLink() {
      assert.ok(menuClickHandler, 'menu click handler should be attached by initMenu');
      menuClickHandler({ target: firstLink });
    },
  };
}

test('menu toggle state transitions are correct for common portrait widths', () => {
  for (const width of PORTRAIT_WIDTHS) {
    globalThis.window = { innerWidth: width };
    const { button, menu, click, classSet } = setupMenuHarness();

    initMenu();

    assert.equal(button.getAttribute('aria-expanded'), 'false', `initial button state at width ${width}`);
    assert.equal(menu.hidden, true, `initial menu hidden state at width ${width}`);

    click();
    assert.equal(button.getAttribute('aria-expanded'), 'true', `open button state at width ${width}`);
    assert.equal(menu.hidden, false, `open menu state at width ${width}`);
    assert.equal(classSet.has('menu-open'), true, `body lock state at width ${width}`);

    click();
    assert.equal(button.getAttribute('aria-expanded'), 'false', `close button state at width ${width}`);
    assert.equal(menu.hidden, true, `close menu state at width ${width}`);
    assert.equal(classSet.has('menu-open'), false, `body unlock state at width ${width}`);
  }
});

test('escape closes the menu and returns focus to toggle', () => {
  const { button, menu, click, pressEscape, getFocused, firstLink } = setupMenuHarness();
  initMenu();

  click();
  assert.equal(getFocused(), firstLink);
  assert.equal(menu.hidden, false);

  pressEscape();
  assert.equal(menu.hidden, true);
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(getFocused(), button);
});

test('outside click closes open menu and returns focus to toggle', () => {
  const { button, menu, click, clickOutside, getFocused, firstLink } = setupMenuHarness();
  initMenu();

  click();
  assert.equal(getFocused(), firstLink);
  clickOutside();

  assert.equal(menu.hidden, true);
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(getFocused(), button);
});

test('menu link click still closes without forcing focus return', () => {
  const { button, menu, click, clickMenuLink, getFocused, firstLink } = setupMenuHarness();
  initMenu();

  click();
  clickMenuLink();

  assert.equal(menu.hidden, true);
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(getFocused(), firstLink);
});

test('regression: hidden attribute is explicitly honored for .site-menu', () => {
  const css = fs.readFileSync(new URL('../assets/css/style.css', import.meta.url), 'utf8');
  assert.match(css, /\.site-menu\[hidden\]\s*\{[\s\S]*display:\s*none\s*!important;/);
});
