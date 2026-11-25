// Cranberry heading: hides while every card under it is hidden
const { JSDOM } = require('jsdom');
const fs = require('fs');
const code = fs.readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window; w.console.info = () => {}; w.eval(code);
const d = w.document;
const tick = () => new Promise((r) => setTimeout(r, 60));
const wrap = (card) => { const h = d.createElement('hui-card'); h.appendChild(card); return h; };
(async () => {
  const box = d.createElement('div'); d.body.appendChild(box);
  const head = d.createElement('cranberry-heading-card');
  head.setConfig({ heading: 'Around the house', heading_style: 'title' });
  const a = d.createElement('div'), b = d.createElement('div');
  const hw = wrap(head), aw = wrap(a), bw = wrap(b);
  a.style.display = 'none'; a.setAttribute('hidden', '');
  bw.hidden = true;
  box.append(hw, aw, bw);
  await tick();
  ok(head.hidden && head.style.display === 'none', 'hidden while both cards under it are hidden');
  ok(head.textContent === 'Around the house', 'falls back to a plain title outside Home Assistant');

  bw.hidden = false; await tick();
  ok(!head.hidden, 'shows when a card under it shows (wrapper)');
  bw.hidden = true; await tick();
  ok(head.hidden, 'hides again');
  a.style.display = ''; a.removeAttribute('hidden');
  a.dispatchEvent(new w.CustomEvent('card-visibility-changed', { bubbles: true, composed: true, detail: { value: true } }));
  await tick();
  ok(!head.hidden, 'shows when a card inside a wrapper shows itself');

  // stops at the next heading
  const box2 = d.createElement('div'); d.body.appendChild(box2);
  const h1 = d.createElement('cranberry-heading-card'); h1.setConfig({ heading: 'One' });
  const h2 = d.createElement('cranberry-heading-card'); h2.setConfig({ heading: 'Two' });
  const x = d.createElement('div'), y = d.createElement('div');
  const xw = wrap(x); xw.hidden = true;
  box2.append(wrap(h1), xw, wrap(h2), wrap(y));
  await tick();
  ok(h1.hidden && !h2.hidden, 'only watches the cards up to the next heading');

  // follows: only the first N cards
  const box3 = d.createElement('div'); d.body.appendChild(box3);
  const h3 = d.createElement('cranberry-heading-card'); h3.setConfig({ heading: 'Three', follows: 1 });
  const p = wrap(d.createElement('div')); p.hidden = true;
  box3.append(wrap(h3), p, wrap(d.createElement('div')));
  await tick();
  ok(h3.hidden, 'follows: 1 ignores the cards after the first');

  // in edit mode it stays
  h3.editMode = true; await tick();
  ok(!h3.hidden, 'visible while editing');

  // on its own: visible
  const lone = d.createElement('cranberry-heading-card'); lone.setConfig({ heading: 'Alone' });
  d.body.appendChild(lone); await tick();
  ok(!lone.hidden, 'with nothing after it, it stays');

  let threw = false; try { d.createElement('cranberry-heading-card').setConfig({}); } catch (e) { threw = true; }
  ok(threw, 'needs a heading');
  console.log(`${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
