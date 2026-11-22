const { JSDOM } = require('jsdom');
const code = require('fs').readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window; w.console.info = () => {}; w.eval(code);
const day = (n) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d.toISOString(); };
const B = (k, n) => ({ entity_id: 'sensor.afvalwijzer_' + k, state: n == null ? 'geen' : day(n), attributes: { days_until_collection_date: n, friendly_name: 'Afvalwijzer ' + k } });
let states; const calls = [];
const reset = (o) => { states = {}; o.forEach((s) => { states[s.entity_id] = s; }); };
const hass = () => ({ states: Object.assign({}, states), language: 'en', locale: { language: 'en-GB' }, entities: {}, callService: (d, s, x) => { calls.push([d, s, x]); } });
const make = (cfg) => { const el = w.document.createElement('cranberry-waste-card'); el.setConfig(cfg); w.document.body.appendChild(el); el.hass = hass(); return el; };
const txt = (el) => el.shadowRoot.textContent.replace(/\s+/g, ' ');
const q = (el, s) => el.shadowRoot.querySelector(s);
const helperOff = { entity_id: 'input_boolean.bins_out', state: 'off', attributes: {}, last_changed: new Date(Date.now() - 4 * 86400000).toISOString() };

ok(w.customCards.some((c) => c.type === 'cranberry-waste-card'), 'in picker');
// quiet: paper in 4 days
reset([B('papier', 4), B('gft', 8), B('pmd', 9), B('restafval', 12), { entity_id: 'sensor.afvalwijzer_tomorrow', state: 'geen', attributes: { days_until_collection_date: null } }, helperOff]);
let el = make({ waste_out: 'input_boolean.bins_out' });
let t = txt(el);
ok(/Paper on \w+day/.test(t) && t.includes('Nothing to put out tonight'), 'quiet: ' + t);
ok(el.shadowRoot.querySelectorAll('.item').length === 4 && !q(el, '.act'), 'list of 4, no button');
ok(el.hidden, 'hidden when nothing goes out soon');
const keep = make({ waste_out: 'input_boolean.bins_out', hide_when_quiet: false }); ok(!keep.hidden, 'option keeps it visible');
ok(el.shadowRoot.querySelectorAll('.item .n')[0].textContent === 'Paper', 'sorted by date');
// urgent tonight with two bins (remind from 00:00 so it always triggers)
reset([B('pmd', 1), B('gft', 1), B('papier', 4), B('restafval', 12), helperOff]);
el = make({ waste_out: 'input_boolean.bins_out', waste_remind_from: '00:00:00' });
t = txt(el);
ok(!el.hidden, 'visible when bins go out tonight');
ok(q(el, 'ha-card').className.includes('urgent') && /(Green and plastic|Plastic and green) out tonight/.test(t) && t.includes('Both collected tomorrow'), 'urgent two: ' + t);
ok(q(el, '.act').textContent.includes('Both out') && el.shadowRoot.querySelectorAll('.bin svg').length === 2, 'both out button, two icons');
q(el, '.act').click(); ok(calls.some((c) => c[1] === 'turn_on' && c[2].entity_id === 'input_boolean.bins_out'), 'marks out');
// after marking out
states['input_boolean.bins_out'] = { entity_id: 'input_boolean.bins_out', state: 'on', attributes: {}, last_changed: new Date().toISOString() };
el.hass = hass(); t = txt(el);
ok(q(el, 'ha-card').className.includes('out') && / are out/.test(t), 'out state: ' + t);
ok(el.hidden, 'hidden again once the bins are out');
// before remind time: quiet "tomorrow · put it out this evening"
reset([B('pmd', 1), B('papier', 4), helperOff]);
el = make({ waste_remind_from: '23:59:00' }); t = txt(el);
ok(t.includes('Plastic tomorrow') && t.includes('Put it out this evening') && !el.hidden, 'before reminder, visible: ' + t);
// today before collection time
reset([B('pmd', 0), B('papier', 4), helperOff]);
el = make({ waste_out: 'input_boolean.bins_out', waste_collected_by: '23:59:00' }); t = txt(el);
ok(t.includes('Plastic is collected today') && t.includes('Still time'), 'today: ' + t);
// today after collection time: skip to next
el = make({ waste_out: 'input_boolean.bins_out', waste_collected_by: '00:00:00' }); t = txt(el);
ok(/Paper on/.test(t) && !t.includes('Today'), 'after collection: ' + t);
// row size
el = make({ size: 'row', waste_collected_by: '00:00:00' }); ok(!q(el, '.list'), 'row has no list');
// none found
reset([]); el = make({}); ok(txt(el).includes('No Afvalwijzer sensors found'), 'none');
// geen (no date) ignored
reset([B('papier', null), B('gft', 3)]); el = make({}); ok(/Green on/.test(txt(el)), 'geen ignored: ' + txt(el));
console.log(pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0);
