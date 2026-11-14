const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const { parseHTML } = require('linkedom');

const backgroundSource = readFileSync(path.join(__dirname, '..', 'background.js'), 'utf8');

function row(id, name, extra = '') {
  return `<div role="listitem"><span dir="auto">${name}</span>${extra}<div><button data-unblock="${id}">Unblock</button></div></div>`;
}

async function requestUnblock(html, name, { confirmation = true } = {}) {
  const { document } = parseHTML(`<!doctype html><html><body><div role="dialog">${html}</div></body></html>`);
  const calls = { selected: [], confirmations: 0, createdTabs: [], removedTabs: [] };
  for (const button of document.querySelectorAll('[data-unblock]')) {
    button.addEventListener('click', () => {
      calls.selected.push(button.getAttribute('data-unblock'));
      if (!confirmation) return;
      const dialog = document.createElement('div');
      dialog.setAttribute('role', 'dialog');
      dialog.innerHTML = '<button>Confirm</button>';
      dialog.firstElementChild.addEventListener('click', () => { calls.confirmations++; });
      document.body.appendChild(dialog);
    });
  }

  const timers = {
    setTimeout(callback) {
      const timer = { active: true };
      queueMicrotask(() => { if (timer.active) callback(); });
      return timer;
    },
    clearTimeout(timer) { if (timer) timer.active = false; },
  };
  const event = () => ({ addListener() {}, removeListener() {} });
  let messageListener;
  const pageContext = vm.createContext({ document, ...timers });
  const chrome = {
    storage: {
      sync: { get(defaults, callback) { callback?.(defaults); return Promise.resolve(defaults); } },
      onChanged: event(),
    },
    runtime: {
      onInstalled: event(),
      onMessage: { addListener(listener) { messageListener = listener; } },
    },
    tabs: {
      onUpdated: event(), onActivated: event(), onRemoved: event(),
      async create(options) { calls.createdTabs.push({ ...options }); return { id: 7 }; },
      remove(id) { calls.removedTabs.push(id); },
    },
    scripting: {
      async executeScript({ func, args }) {
        const injected = vm.runInContext(`(${func.toString()})`, pageContext);
        return [{ result: await injected(...args) }];
      },
    },
  };
  vm.runInNewContext(backgroundSource, { chrome, URL, ...timers }, { filename: 'background.js' });
  const response = await new Promise(resolve => {
    messageListener({ type: 'AUTONEXT_FB_UNBLOCK', name }, {}, resolve);
  });
  return { response: JSON.parse(JSON.stringify(response)), calls };
}

const cases = [
  {
    name: 'selects the only exact account',
    html: row('target', 'Minh'), target: 'Minh', selected: ['target'],
  },
  {
    name: 'does not select a longer name before the exact account',
    html: row('other', 'Minh Anh') + row('target', 'Minh'), target: 'Minh', selected: ['target'],
  },
  {
    name: 'does not unblock a partial match when no exact account exists',
    html: row('other', 'Minh Anh'), target: 'Minh', selected: [],
  },
  {
    name: 'rejects duplicate account names without any click',
    html: row('first', 'Minh') + row('second', '  mINH  '), target: 'Minh', selected: [],
  },
  {
    name: 'matches equivalent Unicode names and ignores case and outer whitespace',
    html: row('target', 'Nguye\u0302\u0303n'), target: '  NGUYỄN  ', selected: ['target'],
  },
  {
    name: 'does not use a subtitle as the account name',
    html: row('other', 'Lan', '<span dir="auto">Minh</span>'), target: 'Minh', selected: [],
  },
  {
    name: 'does not borrow a sibling account name through a shared parent',
    html: `<div role="list"><div><button data-unblock="orphan">Unblock</button></div>${row('target', 'Minh')}</div>`,
    target: 'Minh', selected: ['target'],
  },
  {
    name: 'ignores labels from a nested account row',
    html: `<div role="listitem"><span dir="auto"></span><button data-unblock="parent">Unblock</button>${row('child', 'Minh')}</div>`,
    target: 'Minh', selected: ['child'],
  },
  {
    name: 'rejects a layout with no identifiable account row',
    html: '<div><span dir="auto">Minh</span><button data-unblock="orphan">Unblock</button></div>',
    target: 'Minh', selected: [],
  },
  {
    name: 'rejects multiple unblock controls for the same account',
    html: row('first', 'Minh', '<button data-unblock="second">Unblock</button>'),
    target: 'Minh', selected: [],
  },
  {
    name: 'accepts a Vietnamese aria-labelled control inside nested wrappers',
    html: '<div role="listitem"><div><span dir="auto">Minh</span></div><div><div><div role="button" aria-label="Bỏ chặn" data-unblock="target"><span dir="auto">Bỏ chặn</span></div></div></div></div>',
    target: 'Minh', selected: ['target'],
  },
  {
    name: 'does not click when the account is absent',
    html: row('other', 'Lan'), target: 'Minh', selected: [],
  },
];

for (const item of cases) {
  test(item.name, { timeout: 3000 }, async () => {
    const { response, calls } = await requestUnblock(item.html, item.target);
    assert.deepEqual(calls.selected, item.selected);
    assert.equal(calls.confirmations, item.selected.length);
    assert.equal(response.ok, item.selected.length === 1);
    assert.deepEqual(calls.createdTabs, [{ url: 'https://www.facebook.com/settings?tab=blocking', active: false }]);
    assert.deepEqual(calls.removedTabs, [7]);
  });
}

test('rejects an empty requested name before opening a tab', { timeout: 3000 }, async () => {
  const { response, calls } = await requestUnblock(row('target', 'Minh'), '   ');
  assert.equal(response.ok, false);
  assert.deepEqual(calls, { selected: [], confirmations: 0, createdTabs: [], removedTabs: [] });
});

test('reports a missing Facebook confirmation and closes the temporary tab', { timeout: 3000 }, async () => {
  const { response, calls } = await requestUnblock(row('target', 'Minh'), 'Minh', { confirmation: false });
  assert.equal(response.ok, false);
  assert.match(response.error, /Xác nhận/);
  assert.deepEqual(calls.selected, ['target']);
  assert.equal(calls.confirmations, 0);
  assert.deepEqual(calls.removedTabs, [7]);
});
