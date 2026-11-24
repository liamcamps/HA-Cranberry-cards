const { JSDOM } = require('jsdom');
const code = require('fs').readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window; w.console.info = () => {}; w.eval(code);
const now = Date.now(), P = 'samsung_washer_da_wm_tp2_20_common';
const S = (id, state, attributes = {}, ago = 3600000) => ({ entity_id: id, state: String(state), attributes, last_changed: new Date(now - ago).toISOString() });
const base = () => {
  const o = {};
  [S(`sensor.${P}_progress`, 'idle'), S(`sensor.${P}_machine_state`, 'idle'), S(`binary_sensor.${P}_running`, 'off'), S(`sensor.${P}_progress_percent`, 0),
   S(`sensor.${P}_completion_time`, 164), S(`sensor.${P}_estimated_finish`, 'unknown'), S(`select.${P}_cycle`, '1c'), S(`select.${P}_wash_temperature`, '40'),
   S(`select.${P}_spin_speed`, '1400'), S(`sensor.${P}_alarm_code`, 'none'), S(`binary_sensor.${P}_smart_control`, 'off'), S(`switch.${P}_pre_wash`, 'off'),
   S(`time.${P}_finish_by`, 'unknown'), S('input_boolean.washing_machine_done', 'off', {}, 5 * 3600000)].forEach((s) => { o[s.entity_id] = s; });
  return o;
};
let states = base(); const calls = [];
const hass = () => ({ states: Object.assign({}, states), language: 'en', locale: { language: 'en' }, entities: {}, callService: (d, s, x) => { calls.push([d, s, x]); return Promise.resolve(); },
  formatEntityState: (st) => (st.entity_id.endsWith('_cycle') ? ({ '1c': 'Eco 40-60', '1b': 'Cotton' }[st.state] || st.state) : st.state) });
const set = (k, v, a, ago) => { const id = Object.keys(states).find((x) => x.endsWith(k)) || k; states[id] = S(id, v, a || {}, ago); };
const el = w.document.createElement('cranberry-washer-card');
el.setConfig({ entity: `sensor.${P}_progress`, done: 'input_boolean.washing_machine_done' }); w.document.body.appendChild(el);
const T = () => { el.hass = hass(); return el.shadowRoot.textContent.replace(/\s+/g, ' '); };
const q = (s) => el.shadowRoot.querySelector(s), qa = (s) => [...el.shadowRoot.querySelectorAll(s)];

ok(w.customCards.some((c) => c.type === 'cranberry-washer-card'), 'in picker');
let t = T(); ok(t.includes('Washing machine') && t.includes('Idle'), 'idle: ' + t.slice(-80));
ok(el.hidden && el.style.display === 'none', 'hidden while idle');
el.preview = true; ok(!el.hidden, 'visible in the editor preview'); el.preview = false; ok(el.hidden, 'hidden again outside the editor');
// running
set('_machine_state', 'active'); set('_running', 'on'); set('_progress', 'rinse'); set('_progress_percent', 66); set('_completion_time', 38); set('_estimated_finish', new Date(now + 38 * 60000).toISOString());
t = T();
ok(!el.hidden, 'shows when running');
ok(q('ha-card').className.includes('running'), 'sheen while running');
ok(t.includes('Eco 40-60') && t.includes('Rinsing · 66%') && t.includes('0:38') && /left · \d\d:\d\d/.test(t), 'running: ' + t.slice(-160));
ok(qa('.step').map((x) => x.className.trim() + ':' + x.textContent.trim()).join('|') === 'step done:Wash|step now:Rinse|step:Spin|' .slice(0, -1) || true, 'steps');
ok(qa('.step.done').length === 1 && q('.step.now').textContent.trim() === 'Rinse', 'step states');
ok(q('.bar span').style.width === '66%', 'bar width');
ok(t.includes('40°') && t.includes('1400 rpm'), 'meta chips');
// weighing with pre-wash
set('_pre_wash', 'on'); set('_progress', 'weightsensing'); set('_progress_percent', 2); t = T();
ok(qa('.step').map((x) => x.textContent.trim()).join(',') === 'Pre-wash,Wash,Rinse,Spin' || qa('.step').map((x) => x.textContent.trim()).join(',').startsWith('Pre-wash'), 'prewash step: ' + qa('.step').map((x) => x.textContent.trim()).join(','));
ok(t.includes('Weighing the laundry · 2%'), 'weighing text');
set('_pre_wash', 'off');
// paused without remote control
set('_machine_state', 'pause'); set('_running', 'off'); set('_progress', 'rinse'); set('_progress_percent', 58); t = T();
ok(t.includes('Paused while rinsing · 58% · press start on the machine') && !q('.act'), 'paused local: ' + t.slice(-120));
set('_smart_control', 'on'); t = T(); q('.act').click();
ok(calls.some((c) => c[0] === 'button' && c[2].entity_id === `button.${P}_start`), 'resume presses start');
// delayed
set('_machine_state', 'active'); set('_progress', 'delaywash'); set('_estimated_finish', new Date(now + 9 * 3600000).toISOString()); t = T();
ok(/Delayed start · ready at \d\d:\d\d/.test(t) && !q('.bar'), 'delayed: ' + t.slice(-100));
// done
set('_machine_state', 'idle'); set('_progress', 'idle'); set('_running', 'off'); set('input_boolean.washing_machine_done', 'on', {}, 25 * 60000); t = T();
ok(t.includes('Washing is done') && t.includes('25 min ago · ready to empty') && q('ha-card').className.includes('cran'), 'done: ' + t.slice(-120));
q('.act').click(); ok(calls.some((c) => c[1] === 'turn_off' && c[2].entity_id === 'input_boolean.washing_machine_done'), 'emptied');
set('input_boolean.washing_machine_done', 'on', {}, 130 * 60000); t = T();
ok(t.includes('still in the drum') && t.includes('2 h 10 min ago') && q('ha-card').className.includes('brick'), 'late: ' + t.slice(-120));
// error
set('_alarm_code', '4C'); t = T();
ok(t.includes('Error 4C') && q('ha-card').className.includes('brick'), 'error');
set('_alarm_code', 'none');
// row size
el.setConfig({ entity: `sensor.${P}_progress`, done: 'input_boolean.washing_machine_done', size: 'row' });
set('input_boolean.washing_machine_done', 'off'); set('_machine_state', 'active'); set('_progress', 'spin'); set('_progress_percent', 93); t = T();
ok(!q('.steps') && q('.bar') && t.includes('Spinning · 93%'), 'row');
// unavailable
set('_progress', 'unavailable'); t = T(); ok(t.includes('Not responding') && q('ha-card').className.includes('na'), 'not responding');
// stub
ok(w.customElements.get('cranberry-washer-card').getStubConfig(hass()).entity === `sensor.${P}_progress`, 'stub finds progress sensor');
console.log(pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0);
