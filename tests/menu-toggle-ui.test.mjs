import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { initMenu } from '../assets/js/app.js';

const PORTRAIT_WIDTHS = [320, 360, 375, 390, 412, 430, 768];

function setupMenuHarness() {
  let clickHandler = null;
  const button = {
    attrs: new Map([['aria-expanded', 'false']]),
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
  const menu = { hidden: true };
  menu.addEventListener = () => {};

  const classSet = new Set();
  globalThis.HTMLElement = class {};

  globalThis.document = {
    body: {
      classList: {
        toggle(name, enabled) {
          if (enabled) classSet.add(name);
          else classSet.delete(name);
        },
      },
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
    classSet,
    click() {
      assert.ok(clickHandler, 'click handler should be attached by initMenu');
      clickHandler();
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

test('regression: hidden attribute is explicitly honored for .site-menu', () => {
  const css = fs.readFileSync(new URL('../assets/css/style.css', import.meta.url), 'utf8');
  assert.match(css, /\.site-menu\[hidden\]\s*\{[\s\S]*display:\s*none\s*!important;/);
});
