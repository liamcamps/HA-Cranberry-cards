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
  ok($(el, '.legend .dot').getAttribute('style').includes('var(--cv-cal-1)') && $$(el, '.legend .dot')[1].getAttribute('style').includes('var(--cv-cal-2)'), 'cranberry then olive');

  // folding runs of free days into one line
  EV = { 'calendar.family': [{ summary: 'A', start: { dateTime: at(0, 23, 59) }, end: { dateTime: at(0, 23, 59) } }, { summary: 'B', start: { dateTime: at(4, 10) }, end: { dateTime: at(4, 11) } }] };
  el = await make({ calendars: ['calendar.family'], days: 7 });
  const free = $$(el, '.free').map(rowText);
  ok(free.length === 1 && / – /.test(free[0]), 'three free days in one line: ' + free.join(' | '));
  ok(!$(el, '.legend'), 'no legend for one calendar');
  el = await make({ calendars: ['calendar.family'], days: 7, show_empty: 'hide' });
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
  if (!late && $(el, '.ev')) {
    $(el, '.ev').click();
    ok($(el, '.detail') && $(el, '.dtitle').textContent === 'Call' && $(el, '.dstatus').textContent === 'Happening now' && !opened, 'tap shows the event, not the calendar');
    $(el, '.dcal').click(); ok(opened === 'calendar.family', 'the calendar name still opens the calendar');
    $(el, '[data-act="back"]').click(); ok(!$(el, '.detail') && $(el, '.ev'), 'back to the list');
  }
  // details: day, time, place and description
  EV = { 'calendar.family': [
    { summary: 'Dentist', start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 9, 45) }, location: 'Tandartspraktijk', description: 'Bring the card<br>Room 2' },
    { summary: 'Holiday', start: { date: ymd(2) }, end: { date: ymd(5) } } ] };
  el = await make({ calendars: ['calendar.family'] });
  $$(el, '.ev')[0].click();
  const rows = $$(el, '.drow').map((r) => r.textContent.trim());
  ok(/^\w+day \d+ \w+ · 09:00 – 09:45$/.test(rows[0]) && rows[1] === 'Tandartspraktijk' && rows[2] === 'Family', 'when, where, calendar: ' + rows.join(' | '));
  ok($(el, '.ddesc').textContent === 'Bring the card\nRoom 2' && !$(el, '.dstatus'), 'description as text with its line break');
  $(el, '[data-act="back"]').click();
  $$(el, '.ev').find((x) => x.textContent.includes('Holiday')).click();
  ok(/^\w{3} \d+ \w+ – \w{3} \d+ \w+ · All day$/.test($(el, '.drow').textContent.trim()), 'multi-day all-day: ' + $(el, '.drow').textContent.trim());

  // nothing at all
  EV = {};
  el = await make({ calendars: ['calendar.family'], days: 5 });
  ok($(el, '.empty').textContent === 'Nothing planned in the coming 7 days.', 'nothing planned (at least a week)');

  // week view
  EV = {
    'calendar.family': [
      { summary: 'Dentist', start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 9, 45) } },
      { summary: 'Holiday', start: { date: ymd(2) }, end: { date: ymd(4) } }
    ],
    'calendar.liam': [{ summary: 'Night shift', start: { dateTime: at(3, 22) }, end: { dateTime: at(4, 6) } }]
  };
  el = await make({ calendars: ['calendar.family', 'calendar.liam'], week_layout: 'list' });
  ok(!$(el, '.week') && $$(el, '.seg button').map((b) => b.getAttribute('aria-pressed')).join() === 'true,false', 'starts on the agenda, switch shown');
  $$(el, '.seg button')[1].click();
  ok($(el, '.week') && $$(el, '.col').length === 7 && $(el, '.col.today'), 'switch to the week: seven columns, today marked');
  const cols = $$(el, '.col').map((c) => [...c.querySelectorAll('.wev')].map((x) => x.querySelector('small').textContent + ' ' + x.querySelector('b').textContent).join(' / ') || c.querySelector('.none').textContent);
  ok(cols[0] === 'Free' && cols[1] === '09:00 Dentist' && cols[2] === 'All day Holiday', 'week columns: ' + cols.slice(0, 3).join(' | '));
  ok(cols[3] === 'All day Holiday / 22:00 → Night shift' && cols[4] === 'Until 06:00 Night shift', 'all day first, overnight on both days: ' + cols[3] + ' | ' + cols[4]);
  ok($$(el, '.wev')[0].getAttribute('style').includes('color-mix(in srgb, var(--cc-c) 24%, var(--cc-card))'), 'tinted by calendar');
  $$(el, '.seg button')[0].click();
  ok(!$(el, '.week') && $(el, '.day'), 'and back to the agenda');
  el = await make({ calendars: ['calendar.family'], view: 'week', week_layout: 'list' });
  ok($(el, '.week'), 'start with the week');

  // week on a time grid
  EV = {
    'calendar.family': [
      { summary: 'Dentist', start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 10) } },
      { summary: 'Call', start: { dateTime: at(1, 9) }, end: { dateTime: at(1, 9, 30) } },
      { summary: 'Lunch', start: { dateTime: at(1, 12) }, end: { dateTime: at(1, 13) } },
      { summary: 'Holiday', start: { date: ymd(2) }, end: { date: ymd(3) } },
      { summary: 'Early run', start: { dateTime: at(3, 6) }, end: { dateTime: at(3, 7) } }
    ],
    'calendar.liam': [{ summary: 'Night shift', start: { dateTime: at(4, 22) }, end: { dateTime: at(5, 6) } }]
  };
  el = await make({ calendars: ['calendar.family', 'calendar.liam'], view: 'week' });
  ok($(el, '.tg') && $$(el, '.dc').length === 7 && $$(el, '.tg .hd').length === 7, 'time grid with seven day columns');
  const box = (name) => { const b = $$(el, '.te').find((x) => x.textContent.includes(name)); return b && b.getAttribute('style'); };
  const num = (st, k) => parseFloat((st.match(new RegExp(k + ':(-?[0-9.]+)')) || [])[1]);
  // the grid starts at 06:00 because of the early run; 40px an hour
  ok(num(box('Dentist'), 'top') === 120 && num(box('Dentist'), 'height') === 40, 'placed at its time: ' + box('Dentist'));
  ok(num(box('Dentist'), 'width') === 50 && num(box('Call'), 'width') === 50 && num(box('Dentist'), 'left') + num(box('Call'), 'left') === 50, 'same start: side by side');
  ok(num(box('Lunch'), 'width') === 100, 'no overlap: full width');
  const callBox = $$(el, '.te').find((x) => x.textContent.includes('Call'));
  ok(num(box('Call'), 'height') === 22 && callBox.classList.contains('tiny') && callBox.querySelector('small').textContent === '09:00', 'a very short event: one line, the whole time');
  ok(!$$(el, '.te').find((x) => x.textContent.includes('Dentist')).classList.contains('tiny'), 'an hour: two lines');
  ok($(el, '.adl') && $$(el, '.ad')[2].textContent.includes('Holiday'), 'all-day row');
  ok($(el, '.hrs span').textContent === '07:00' && num($(el, '.dc').getAttribute('style'), 'height') === 680, 'from 06:00 to 23:00 (night shift ends past 22:00 that day): ' + $(el, '.dc').getAttribute('style'));
  const shiftTop = box('Night shift');
  ok(shiftTop && num(shiftTop, 'top') === 640, 'the night shift starts at 22:00 on its first day');
  const nextDay = $$(el, '.dc')[5].textContent.includes('Night shift');
  ok(nextDay, 'and continues the next morning');
  el._w = 400; el._last = ''; el._update();
  ok(!$(el, '.week') && !$(el, '.seg'), 'narrow: agenda, no switch');
  el = await make({ calendars: ['calendar.family'], switcher: false });
  ok(!$(el, '.seg') && !$(el, '.top'), 'switch can be hidden');

  // ---- who sees which calendar
  const H2 = () => Object.assign(hass(), { user: { id: 'u-mylou' }, states: Object.assign(hass().states, {
    'person.liam': { entity_id: 'person.liam', state: 'home', attributes: { user_id: 'u-liam' } },
    'person.mylou': { entity_id: 'person.mylou', state: 'home', attributes: { user_id: 'u-mylou' } } }) });
  const make2 = async (cfg, hs) => { const el = w.document.createElement('cranberry-calendar-card'); el.setConfig(Object.assign({ load_fonts: false }, cfg)); w.document.body.appendChild(el); el.hass = hs; await wait(); await wait(); return el; };
  EV = { 'calendar.family': [{ summary: 'Dinner', start: { dateTime: at(1, 18) }, end: { dateTime: at(1, 20) } }], 'calendar.liam': [{ summary: 'Padel', start: { dateTime: at(1, 20) }, end: { dateTime: at(1, 21) } }] };
  asked = [];
  el = await make2({ calendars: ['calendar.family', { entity: 'calendar.liam', people: ['person.liam'] }] }, H2());
  ok(asked.length === 1 && asked[0].indexOf('calendar.family') > 0 && !el.shadowRoot.textContent.includes('Padel'), 'Mylou does not see Liam’s calendar');
  const asLiam = Object.assign(H2(), { user: { id: 'u-liam' } });
  el = await make2({ calendars: ['calendar.family', { entity: 'calendar.liam', people: ['person.liam'] }] }, asLiam);
  ok(el.shadowRoot.textContent.includes('Padel') && $$(el, '.legend .dot')[1].getAttribute('style').includes('var(--cv-cal-2)'), 'Liam does, in the same colour');
  const nobody = Object.assign(H2(), { user: { id: 'u-kiosk' } });
  el = await make2({ calendars: ['calendar.family', { entity: 'calendar.liam', people: ['person.liam'] }] }, nobody);
  ok(!el.shadowRoot.textContent.includes('Padel') && el.shadowRoot.textContent.includes('Dinner'), 'a user without a person sees only the shared calendars');

  // ---- the editor keeps people next to the calendar in YAML
  const ed = w.document.createElement('cranberry-calendar-card-editor');
  let saved = null; ed.addEventListener('config-changed', (e) => { saved = e.detail.config; });
  ed.setConfig({ calendars: ['calendar.family', { entity: 'calendar.liam', people: ['person.liam'] }] });
  ok(ed._config.calendars.join() === 'calendar.family,calendar.liam' && ed._config['people:calendar.liam'][0] === 'person.liam', 'editor flattens people');
  ed.hass = hass(); w.document.body.appendChild(ed);
  const form = ed.querySelector('ha-form');
  ok(form && form.schema.some((x) => x.name === 'who' && x.schema.length === 2), 'a who-sees field per calendar');
  form.dispatchEvent(new w.CustomEvent('value-changed', { detail: { value: Object.assign({}, ed._config, { 'people:calendar.family': ['person.mylou'] }) } }));
  ok(JSON.stringify(saved.calendars) === JSON.stringify([{ entity: 'calendar.family', people: ['person.mylou'] }, { entity: 'calendar.liam', people: ['person.liam'] }]) && !Object.keys(saved).some((k) => k.indexOf('people:') === 0), 'saved as entity + people: ' + JSON.stringify(saved));

  // ---- new event
  const calls = [];
  const H3 = () => Object.assign(hass(), {
    states: { 'calendar.family': { entity_id: 'calendar.family', state: 'off', attributes: { friendly_name: 'Family', supported_features: 7 } },
      'calendar.liam': { entity_id: 'calendar.liam', state: 'off', attributes: { friendly_name: 'Liam', supported_features: 7 } },
      'calendar.holidays': { entity_id: 'calendar.holidays', state: 'off', attributes: { friendly_name: 'Holidays', supported_features: 0 } } },
    callService: async (d, sv, data) => { calls.push([d, sv, data]); } });
  EV = {};
  el = await make2({ calendars: ['calendar.family', 'calendar.liam', 'calendar.holidays'] }, H3());
  ok($(el, '.add'), 'New event button');
  $(el, '.add').click();
  ok($(el, '.form') && $$(el, '.chip').map((c) => c.textContent).join() === 'Family,Liam' && $(el, '.chip').getAttribute('aria-pressed') === 'true', 'form: only calendars that accept events, the first picked');
  const set = (f, v) => { const i = $(el, '[data-field="' + f + '"]'); i.value = v; i.dispatchEvent(new w.Event('input', { bubbles: true })); };
  $(el, '[data-act="fsave"]').click(); await wait();
  ok($(el, '.err').textContent === 'Give it a name.' && !calls.length, 'needs a name');
  set('title', 'Dentist'); set('date', ymd(1)); set('start', '09:00'); set('end', '09:45'); set('loc', 'Tandarts');
  $$(el, '.chip')[1].click();
  ok($(el, '[data-field="title"]').value === 'Dentist', 'typing survives a redraw');
  $(el, '[data-act="fsave"]').click(); await wait(); await wait();
  ok(JSON.stringify(calls[0]) === JSON.stringify(['calendar', 'create_event', { entity_id: 'calendar.liam', summary: 'Dentist', start_date_time: ymd(1) + ' 09:00:00', end_date_time: ymd(1) + ' 09:45:00', location: 'Tandarts' }]), 'timed event: ' + JSON.stringify(calls[0]));
  ok(!$(el, '.form'), 'form closes after adding');
  $(el, '.add').click(); set('title', 'Holiday'); set('date', ymd(2)); $(el, '[data-act="fallday"]').click();
  ok(!$(el, '[data-field="start"]'), 'all day hides the times');
  $(el, '[data-act="fsave"]').click(); await wait();
  ok(JSON.stringify(calls[1][2]) === JSON.stringify({ entity_id: 'calendar.family', summary: 'Holiday', start_date: ymd(2), end_date: ymd(3) }), 'all-day: ends the day after: ' + JSON.stringify(calls[1][2]));
  $(el, '.add').click(); set('title', 'Night shift'); set('date', ymd(1)); set('start', '22:00'); set('end', '06:00');
  $(el, '[data-act="fsave"]').click(); await wait();
  ok(calls[2][2].end_date_time === ymd(2) + ' 06:00:00', 'an end before the start is the next day');
  // a failing calendar keeps the form with a message
  el._hass = Object.assign(H3(), { callService: async () => { throw new Error('Not allowed'); } });
  $(el, '.add').click(); set('title', 'X'); $(el, '[data-act="fsave"]').click(); await wait(); await wait();
  ok($(el, '.form') && /Could not add it: Not allowed/.test($(el, '.err').textContent), 'error shown');
  $(el, '[data-act="fcancel"]').click();
  ok(!$(el, '.form'), 'cancel');
  el = await make2({ calendars: ['calendar.holidays'] }, H3());
  ok(!$(el, '.add'), 'no button when no calendar accepts events');
  el = await make2({ calendars: ['calendar.family'], add_events: false }, H3());
  ok(!$(el, '.add'), 'button can be turned off');

  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
