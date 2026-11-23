const { JSDOM } = require('jsdom');
const code = require('fs').readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window; w.console.info = () => {}; w.eval(code);
const wait = (ms = 10) => new Promise((r) => setTimeout(r, ms));
const DAY = 86400000, H = 3600000;
const day0 = (n) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d; };
const at = (n, h, m = 0) => { const d = day0(n); d.setHours(h, m, 0, 0); return d.toISOString(); };
const ymd = (n) => { const d = day0(n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const now = Date.now();
let asked = [], EV = {};
const hass = () => ({
  states: { 'calendar.family': { entity_id: 'calendar.family', state: 'off', attributes: { friendly_name: 'Family' } }, 'calendar.liam': { entity_id: 'calendar.liam', state: 'off', attributes: { friendly_name: 'Liam' } } },
  language: 'en', locale: { language: 'en-GB', time_format: '24' }, entities: {},
  callApi: async (m, path) => { asked.push(path); return EV[path.split('?')[0].replace('calendars/', '')] || []; },
  callService() {}
});
const make = async (cfg) => { const el = w.document.createElement('cranberry-calendar-card'); el.setConfig(Object.assign({ load_fonts: false }, cfg)); w.document.body.appendChild(el); el.hass = hass(); await wait(); await wait(); return el; };
const $ = (el, s) => el.shadowRoot.querySelector(s), $$ = (el, s) => [...el.shadowRoot.querySelectorAll(s)];
const rowText = (r) => { const tw = r.ownerDocument.createTreeWalker(r, 4); const out = []; while (tw.nextNode()) { const v = tw.currentNode.nodeValue.trim(); if (v) out.push(v); } return out.join(' ').replace(/\s+/g, ' ').replace(/ · /g, ' · '); };

(async () => {
  ok(w.customCards.some((c) => c.type === 'cranberry-calendar-card'), 'in the picker');
  let el = await make({});
  ok($(el, '.empty').textContent.includes('Pick one or more calendars'), 'asks for calendars');

  EV = {
    'calendar.family': [
      { summary: 'Dentist', start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 9, 45) }, location: 'Tandartspraktijk' },
      { summary: 'Dinner', start: { dateTime: at(1, 18, 30) }, end: { dateTime: at(1, 22) } },
      { summary: 'Mylou’s birthday', start: { date: ymd(2) }, end: { date: ymd(3) } },
      { summary: 'Holiday', start: { date: ymd(5) }, end: { date: ymd(8) } },
      { summary: 'Old', start: { dateTime: new Date(now - 3 * H).toISOString() }, end: { dateTime: new Date(now - 2 * H).toISOString() } }
    ],
    'calendar.liam': [
      { summary: 'Night shift', start: { dateTime: at(3, 22) }, end: { dateTime: at(4, 6) } }
    ]
  };
  asked = [];
  el = await make({ calendars: ['calendar.family', 'calendar.liam'], days: 9 });
  ok(asked.length === 2 && /^calendars\/calendar\.family\?start=/.test(asked[0]), 'asks each calendar once');
  const legend = $$(el, '.legend > span').map((x) => x.textContent);
  ok(legend.join() === 'Family,Liam', 'legend with names: ' + legend);
  const days = $$(el, '.day').map(rowText);
  // today: nothing (the old event is over) -> folded into "free"; tomorrow: dentist, dinner
  ok(/^\w+ \d+ Nothing planned$/.test(days[0]), 'today free: ' + days[0]);
  const tm = $$(el, '.day:not(.free)')[0];
  ok(rowText(tm).includes('09:00 Dentist · Tandartspraktijk') && rowText(tm).includes('18:30 Dinner'), 'tomorrow in order: ' + rowText(tm));
  ok($$(el, '.day:not(.free)')[1].textContent.includes('All day') && $$(el, '.day:not(.free)')[1].textContent.includes('birthday'), 'all-day event');
  // night shift spans two days
  const shift = $$(el, '.day:not(.free)').filter((d) => d.textContent.includes('Night shift')).map(rowText);
  ok(shift.length === 2 && /22:00 → Night shift/.test(shift[0]) && /Until 06:00 Night shift/.test(shift[1]), 'overnight event on both days: ' + shift.join(' | '));
  // holiday: three days, numbered
  const hol = $$(el, '.day:not(.free)').filter((d) => d.textContent.includes('Holiday')).map((d) => d.querySelector('.when').textContent);
  ok(hol.join('|') === 'All day · 1 of 3|All day · 2 of 3|All day · 3 of 3', 'multi-day all-day: ' + hol.join('|'));
  // no trailing free lines after the last event
  ok(!$$(el, '.day').slice(-1)[0].classList.contains('free'), 'no free line at the end');
  // dots follow the order of the calendars
  ok($(el, '.legend .dot').getAttribute('style').includes('#B8565B') && $$(el, '.legend .dot')[1].getAttribute('style').includes('#8C7F45'), 'cranberry then olive');

  // folding runs of free days into one line
  EV = { 'calendar.family': [{ summary: 'A', start: { dateTime: at(0, 23, 59) }, end: { dateTime: at(0, 23, 59) } }, { summary: 'B', start: { dateTime: at(4, 10) }, end: { dateTime: at(4, 11) } }] };
  el = await make({ calendars: ['calendar.family'], days: 6 });
  const free = $$(el, '.free').map(rowText);
  ok(free.length === 1 && / – /.test(free[0]), 'three free days in one line: ' + free.join(' | '));
  ok(!$(el, '.legend'), 'no legend for one calendar');
  el = await make({ calendars: ['calendar.family'], days: 6, show_empty: 'hide' });
  ok(!$(el, '.free') && $$(el, '.day').length === 2, 'leave out free days');

  // happening now (skip in the last half hour of the day, when "now" would run past midnight)
  const late = new Date().getHours() === 23 && new Date().getMinutes() >= 25;
  if (!late) {
    EV = { 'calendar.family': [{ summary: 'Call', start: { dateTime: new Date(now - 10 * 60000).toISOString() }, end: { dateTime: new Date(now + 30 * 60000).toISOString() } }] };
    el = await make({ calendars: ['calendar.family'] });
    ok($(el, '.day.today') && $(el, '.ev.now') && /^Now, until \d\d:\d\d$/.test($(el, '.ev.now .when').textContent), 'now: ' + ($(el, '.ev .when') || {}).textContent);
  }
  // tap opens the calendar
  let opened = null; el.addEventListener('hass-more-info', (e) => { opened = e.detail.entityId; });
  if ($(el, '.ev')) { $(el, '.ev').click(); ok(opened === 'calendar.family', 'tap opens the calendar'); }

  // nothing at all
  EV = {};
  el = await make({ calendars: ['calendar.family'], days: 5 });
  ok($(el, '.empty').textContent === 'Nothing planned in the coming 5 days.', 'nothing planned');

  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
