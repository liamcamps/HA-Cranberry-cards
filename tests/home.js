const { JSDOM } = require('jsdom');
const fs = require('fs');
const code = fs.readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };

function setup() {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.eval(code);
  return dom.window;
}
const now = Date.now();
const hourly = (temps, precip, conds) => temps.map((t, i) => ({ datetime: new Date(now + (i + 1) * 3600000).toISOString(), temperature: t, precipitation: precip ? precip[i] : 0, precipitation_probability: precip && precip[i] > 0 ? 80 : 5, condition: conds ? conds[i] : 'cloudy' }));
function hass(over = {}, forecast = []) {
  const subs = [];
  const states = Object.assign({
    'weather.home': { entity_id: 'weather.home', state: 'clear-night', attributes: { friendly_name: 'Home', temperature: 7, apparent_temperature: 4, temperature_unit: '°C', supported_features: 3 } },
    'sun.sun': { entity_id: 'sun.sun', state: 'below_horizon', attributes: { next_setting: new Date(now + 5 * 3600000).toISOString() } },
    'binary_sensor.back_door': { entity_id: 'binary_sensor.back_door', state: 'on', attributes: { friendly_name: 'Back door' } },
    'lock.front': { entity_id: 'lock.front', state: 'locked', attributes: { friendly_name: 'Front door' } },
    'light.a': { entity_id: 'light.a', state: 'on', attributes: { friendly_name: 'Ceiling' } },
    'light.b': { entity_id: 'light.b', state: 'on', attributes: { friendly_name: 'Pendant' } },
    'light.c': { entity_id: 'light.c', state: 'off', attributes: { friendly_name: 'Spots' } },
    'switch.garden': { entity_id: 'switch.garden', state: 'on', attributes: { friendly_name: 'Garden lights' } },
    'binary_sensor.meteoalarm': { entity_id: 'binary_sensor.meteoalarm', state: 'off', attributes: {} }
  }, over);
  return {
    states, language: 'en', locale: { language: 'en-GB' },
    entities: { 'light.a': { area_id: 'living' }, 'light.b': { device_id: 'd1' } },
    devices: { d1: { area_id: 'kitchen' } }, areas: { living: { name: 'Living room' }, kitchen: { name: 'Kitchen' } },
    formatEntityState: (st) => ({ on: 'Open', locked: 'Locked', unlocked: 'Unlocked' }[st.state] || st.state),
    connection: { subscribeMessage: (cb, msg) => { subs.push(msg); setTimeout(() => cb({ forecast }), 0); return Promise.resolve(() => { subs.unsub = true; }); } },
    _subs: subs
  };
}
const base = { type: 'custom:cranberry-home-card', weather: 'weather.home', issues: ['binary_sensor.back_door', 'lock.front'], lights: ['light.a', 'light.b', 'light.c', 'switch.garden'], warning: 'binary_sensor.meteoalarm' };
const wait = () => new Promise((r) => setTimeout(r, 10));

(async () => {
  // 1. clear night, dry
  let w = setup(); let card = w.document.createElement('cranberry-home-card');
  ok(w.customCards.some((c) => c.type === 'cranberry-home-card'), 'registered in picker');
  card.setConfig(base); w.document.body.appendChild(card);
  let h = hass({}, hourly([6, 6, 5, 5, 4, 4, 4, 4, 5, 6, 7, 8]));
  card.hass = h; await wait();
  let t = card.shadowRoot.textContent.replace(/\s+/g, ' ');
  ok(h._subs[0] && h._subs[0].forecast_type === 'hourly', 'subscribes hourly');
  ok(card.shadowRoot.querySelector('.issue .n').textContent === '1' && !t.includes('needs you'), 'one issue: in the chip only');
  ok(t.includes('Back door open'), 'issue chip text');
  ok(t.includes('Lights on in 3 places') && card.shadowRoot.querySelector('.lamps'), 'next to a red chip the lights chip is short');
  ok(t.includes('Dry for the next 12 hours, low of 4°.'), 'dry insight');
  ok(t.includes('Feels like 4°'), 'feels like');
  ok(card.shadowRoot.querySelector('linearGradient stop'), 'gradient line');
  ok(card.shadowRoot.querySelectorAll('.hour').length === 6, '6 hours');
  ok(!card.shadowRoot.querySelector('.bars'), 'no rain bars when dry');
  let ev = null; card.addEventListener('hass-more-info', (e) => ev = e.detail.entityId);
  card.shadowRoot.querySelector('.issue').click(); ok(ev === 'binary_sensor.back_door', 'issue opens more-info');
  card.shadowRoot.querySelector('.weather').click(); ok(ev === 'weather.home', 'weather opens more-info');

  // 2. rain later
  w = setup(); card = w.document.createElement('cranberry-home-card'); card.setConfig(base); w.document.body.appendChild(card);
  h = hass({ 'weather.home': { entity_id: 'weather.home', state: 'cloudy', attributes: { temperature: 9, temperature_unit: '°C', supported_features: 2 } }, 'binary_sensor.back_door': { entity_id: 'binary_sensor.back_door', state: 'off', attributes: {} } },
    hourly([9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], [0, 0, 0, 0.3, 1.2, 2.5, 0.8, 0, 0, 0, 0, 0]));
  card.hass = h; await wait();
  t = card.shadowRoot.textContent.replace(/\s+/g, ' ');
  ok(card.shadowRoot.querySelectorAll('.bars span').length === 12, 'rain bars');
  ok(/Rain from about \d\d:\d\d, heaviest around \d\d:\d\d\./.test(t), 'rain later insight: ' + t);
  ok(!t.includes('All quiet.') && !card.shadowRoot.querySelector('.home p:not(.insight)'), 'no home sentence when all is quiet');

  // 3. raining now
  w = setup(); card = w.document.createElement('cranberry-home-card'); card.setConfig(base); w.document.body.appendChild(card);
  h = hass({ 'weather.home': { entity_id: 'weather.home', state: 'rainy', attributes: { temperature: 8, temperature_unit: '°C', supported_features: 2 } } }, hourly(Array(12).fill(8), [1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
  card.hass = h; await wait();
  t = card.shadowRoot.textContent;
  ok(/Rain stops around \d\d:\d\d, dry after that/.test(t), 'rain stops insight: ' + t);

  // 4. storm warning
  w = setup(); card = w.document.createElement('cranberry-home-card'); card.setConfig(base); w.document.body.appendChild(card);
  h = hass({ 'weather.home': { entity_id: 'weather.home', state: 'lightning', attributes: { temperature: 10, temperature_unit: '°C', supported_features: 2, wind_gust_speed: 90, wind_speed_unit: 'km/h' } },
    'binary_sensor.meteoalarm': { entity_id: 'binary_sensor.meteoalarm', state: 'on', attributes: { awareness_level: '3; orange; Moderate', event: 'wind', headline: 'Strong wind', expires: new Date(now + 4 * 3600000).toISOString() } } }, hourly(Array(12).fill(10)));
  card.hass = h; await wait();
  t = card.shadowRoot.textContent.replace(/\s+/g, ' ');
  ok(card.shadowRoot.querySelector('.warn'), 'warning strip');
  ok(t.includes('Code orange · Strong wind · until'), 'strip text: ' + t);
  ok(card.shadowRoot.querySelector('.issue .n').textContent === '2' && !t.includes('need you'), 'warning counts as issue, in the chip only');
  ok(t.includes('Gusts up to 90 km/h'), 'gusts');

  // 5. snow, freezing colour
  w = setup(); card = w.document.createElement('cranberry-home-card'); card.setConfig(Object.assign({}, base, { show_clock: false, layout: 'stacked' })); w.document.body.appendChild(card);
  h = hass({ 'weather.home': { entity_id: 'weather.home', state: 'snowy', attributes: { temperature: -1, temperature_unit: '°C', supported_features: 2 } } }, hourly([-1, -2, -2, -3, -3, -2, -1, -1, 0, 0, 0, 0]));
  card.hass = h; await wait();
  t = card.shadowRoot.textContent;
  ok(t.includes('Freezing, down to −3°'), 'freezing insight: ' + t.replace(/\s+/g, ' '));
  ok(card.shadowRoot.querySelector('ha-card').className.includes('stacked'), 'stacked layout');
  ok(card.shadowRoot.querySelector('.chip .serif').getAttribute('style').includes('var(--cv-temp-1)'), 'icy temp colour');

  // 6. missing entity, bad config, stub, editor
  w = setup(); card = w.document.createElement('cranberry-home-card');
  let threw = false; try { card.setConfig({}); } catch (e) { threw = true; } ok(threw, 'requires weather');
  card.setConfig({ weather: 'weather.nope' }); w.document.body.appendChild(card); card.hass = hass(); await wait();
  ok(card.shadowRoot.textContent.includes('Weather entity not found'), 'missing message');
  const C = w.customElements.get('cranberry-home-card');
  const stub = C.getStubConfig(hass()); ok(stub.weather === 'weather.home' && stub.lights.length === 3, 'stub config');
  const ed = C.getConfigElement(); ok(ed.tagName.toLowerCase() === 'cranberry-home-card-editor', 'editor element');
  w.customElements.define('ha-form', class extends w.HTMLElement {});
  w.document.body.appendChild(ed); ed.setConfig(base); ed.hass = hass(); await wait();
  const form = ed.querySelector('ha-form'); ok(form && form.schema.length === 14 && form.data.weather === 'weather.home', 'editor renders ha-form');
  let changed = null; ed.addEventListener('config-changed', (e) => changed = e.detail.config);
  form.dispatchEvent(new w.CustomEvent('value-changed', { detail: { value: Object.assign({}, base, { home_text: '', lights: [] }) } }));
  ok(changed && !('home_text' in changed) && !('lights' in changed), 'editor emits cleaned config');
  ok(form.computeLabel({ name: 'issues' }) === 'Things to watch', 'labels');
  card.remove(); await wait();

  // 7. washing machine done
  w = setup(); card = w.document.createElement('cranberry-home-card');
  card.setConfig(Object.assign({}, base, { issues: [], laundry_done: 'binary_sensor.washer_done', laundry_done_at: 'sensor.washer_finished' })); w.document.body.appendChild(card);
  h = hass({ 'binary_sensor.washer_done': { entity_id: 'binary_sensor.washer_done', state: 'on', attributes: {}, last_changed: new Date(now - 3 * 60000).toISOString() },
    'sensor.washer_finished': { entity_id: 'sensor.washer_finished', state: new Date(now - 25 * 60000).toISOString(), attributes: {} } }, hourly(Array(12).fill(7)));
  card.hass = h; await wait();
  t = card.shadowRoot.textContent.replace(/\s+/g, ' ');
  ok(t.includes('Washing machine done 25 min ago'), 'washer with timestamp: ' + t.slice(-300));
  ok(card.shadowRoot.querySelector('.issue .n').textContent === '1', 'washer counts');
  h.states['sensor.washer_finished'] = { entity_id: 'sensor.washer_finished', state: 'unknown', attributes: {} };
  h.states['binary_sensor.washer_done'] = Object.assign({}, h.states['binary_sensor.washer_done'], { last_changed: new Date(now - 135 * 60000).toISOString() });
  card.hass = Object.assign({}, h); await wait();
  ok(card.shadowRoot.textContent.includes('Washing machine done 2 h 15 min ago'), 'falls back to last_changed');
  h.states['binary_sensor.washer_done'] = Object.assign({}, h.states['binary_sensor.washer_done'], { state: 'off' });
  card.hass = Object.assign({}, h); await wait();
  ok(!card.shadowRoot.textContent.includes('Washing machine'), 'hidden when not done');
  h.states['input_datetime.w'] = { entity_id: 'input_datetime.w', state: '2026-11-21 10:00:00', attributes: { timestamp: (now - 50 * 60000) / 1000 } };
  h.states['binary_sensor.washer_done'].state = 'on';
  card.setConfig(Object.assign({}, base, { issues: [], laundry_done: 'binary_sensor.washer_done', laundry_done_at: 'input_datetime.w', laundry_name: 'Wasmachine' }));
  card.hass = Object.assign({}, h); await wait();
  ok(card.shadowRoot.textContent.includes('Wasmachine done 50 min ago'), 'input_datetime + name');

  // 8. custom names
  w = setup(); card = w.document.createElement('cranberry-home-card');
  card.setConfig(Object.assign({}, base, { issue_names: { 'binary_sensor.back_door': 'Achterdeur' } })); w.document.body.appendChild(card);
  card.hass = hass({}, hourly(Array(12).fill(7))); await wait();
  ok(card.shadowRoot.textContent.includes('Achterdeur open'), 'issue_names used');
  card.setConfig(Object.assign({}, base, { issues: [{ entity: 'binary_sensor.back_door', name: 'Tuindeur' }] }));
  card.hass = hass({}, hourly(Array(12).fill(7))); await wait();
  ok(card.shadowRoot.textContent.includes('Tuindeur open'), 'object items');
  const ed2 = w.customElements.get('cranberry-home-card').getConfigElement();
  w.customElements.get('ha-form') || w.customElements.define('ha-form', class extends w.HTMLElement {});
  w.document.body.appendChild(ed2); ed2.setConfig(Object.assign({}, base, { issues: [{ entity: 'binary_sensor.back_door', name: 'Tuindeur' }, 'lock.front'] })); ed2.hass = hass(); await wait();
  const f2 = ed2.querySelector('ha-form');
  const namesSec = f2.schema.find((x) => x.name === 'names');
  ok(namesSec && namesSec.schema.length === 2, 'names section per item');
  ok(f2.data['name__binary_sensor.back_door'] === 'Tuindeur' && f2.data.issues[0] === 'binary_sensor.back_door', 'yaml objects normalised');
  ok(f2.computeLabel({ name: 'name__lock.front' }) === 'Front door', 'label is entity name');
  let cfg = null; ed2.addEventListener('config-changed', (e) => cfg = e.detail.config);
  f2.dispatchEvent(new w.CustomEvent('value-changed', { detail: { value: Object.assign({}, f2.data, { 'name__lock.front': 'Voordeur', 'name__binary_sensor.back_door': '' }) } }));
  ok(cfg && cfg.issue_names && cfg.issue_names['lock.front'] === 'Voordeur' && !cfg.issue_names['binary_sensor.back_door'] && !Object.keys(cfg).some((k) => k.startsWith('name__')), 'names saved cleanly: ' + JSON.stringify(cfg));
  f2.dispatchEvent(new w.CustomEvent('value-changed', { detail: { value: Object.assign({}, f2.data, { issues: ['binary_sensor.back_door'] }) } }));
  ok(!cfg.issue_names, 'names of removed items dropped');

  // 9. KNMI colour-code warning + observation entity
  w = setup(); card = w.document.createElement('cranberry-home-card');
  card.setConfig(Object.assign({}, base, { issues: [], warning: 'sensor.knmi_code', weather_now: 'weather.obs' })); w.document.body.appendChild(card);
  h = hass({ 'sensor.knmi_code': { entity_id: 'sensor.knmi_code', state: 'oranje', attributes: { description: 'Zware windstoten. Kans op schade.', valid_until: new Date(now + 3 * 3600000).toISOString() } },
    'weather.obs': { entity_id: 'weather.obs', state: 'cloudy', attributes: { temperature: 6.4, apparent_temperature: 2.1 } } }, hourly(Array(12).fill(7)));
  card.hass = h; await wait();
  t = card.shadowRoot.textContent.replace(/\s+/g, ' ');
  ok(card.shadowRoot.querySelector('.warn') && t.includes('Code orange · Zware windstoten · until'), 'knmi strip: ' + t.slice(-400));
  ok(t.includes('Feels like 2°'), 'obs feels');
  ok(card.shadowRoot.querySelector('.temp').textContent.includes('6'), 'obs temp');
  h.states['sensor.knmi_code'] = { entity_id: 'sensor.knmi_code', state: 'groen', attributes: {} }; card.hass = Object.assign({}, h); await wait();
  ok(!card.shadowRoot.querySelector('.warn'), 'green = no warning');
  h.states['sensor.knmi_code'] = { entity_id: 'sensor.knmi_code', state: 'geel', attributes: {} };
  card.setConfig(Object.assign({}, base, { issues: [], warning: 'sensor.knmi_code', warning_from: 'orange' })); card.hass = Object.assign({}, h); await wait();
  ok(!card.shadowRoot.querySelector('.warn'), 'yellow filtered out');

  // 10. NL Weather, real formats from the integration source
  w = setup(); card = w.document.createElement('cranberry-home-card');
  card.setConfig(Object.assign({}, base, { issues: [], warning: ['binary_sensor.weer_home_warning_active', 'sensor.weer_home_warning_level', 'sensor.weer_home_warnings'], rain_nowcast: 'binary_sensor.weer_home_precipitation_forecasted' })); w.document.body.appendChild(card);
  const exp = new Date(now + 5 * 3600000).toISOString();
  h = hass({ 'binary_sensor.weer_home_warning_active': { entity_id: 'binary_sensor.weer_home_warning_active', state: 'on', attributes: {} },
    'sensor.weer_home_warning_level': { entity_id: 'sensor.weer_home_warning_level', state: 'orange', attributes: { options: ['none', 'yellow', 'orange', 'red'] } },
    'sensor.weer_home_warnings': { entity_id: 'sensor.weer_home_warnings', state: 'Zware windstoten', attributes: { alert_count: 1, description: 'Zware windstoten', alerts: [{ code: 'orange', condition: 'windy', description: 'Zware windstoten', details: 'Lange tekst', headline: 'Code oranje in het noorden. Zware windstoten', onset: new Date(now - 3600000).toISOString(), expires: exp }] } },
    'binary_sensor.weer_home_precipitation_forecasted': { entity_id: 'binary_sensor.weer_home_precipitation_forecasted', state: 'off', attributes: { forecast: [] } } }, hourly(Array(12).fill(9)));
  card.hass = h; await wait();
  t = card.shadowRoot.textContent.replace(/\s+/g, ' ');
  ok(t.includes('Code orange · Strong wind · until') && t.includes('Strong wind warning until'), 'nl warning in English: ' + t.slice(-430));
  ok(t.includes('Secure loose things outside. Avoid travelling if you can.') && !t.includes('Lange tekst'), 'English advice with orange extra: ' + t.slice(-260));
  ev = null; card.addEventListener('hass-more-info', (e) => ev = e.detail.entityId); card.shadowRoot.querySelector('.warn').click();
  ok(ev === 'sensor.weer_home_warning_level', 'strip opens level sensor: ' + ev);
  h.states['binary_sensor.weer_home_warning_active'] = { entity_id: 'binary_sensor.weer_home_warning_active', state: 'off', attributes: {} };
  h.states['sensor.weer_home_warning_level'] = { entity_id: 'sensor.weer_home_warning_level', state: 'none', attributes: {} };
  h.states['sensor.weer_home_warnings'] = { entity_id: 'sensor.weer_home_warnings', state: 'none', attributes: { alert_count: 0, alerts: [], description: '' } };
  // nowcast: raining now, stops after 25 minutes (5-minute steps, includes a past point)
  const nc = (vals) => vals.map((v, i) => ({ datetime: new Date(now + (i - 1) * 300000 + 1000).toISOString(), precipitation: v }));
  h.states['binary_sensor.weer_home_precipitation_forecasted'] = { entity_id: 'binary_sensor.weer_home_precipitation_forecasted', state: 'on', attributes: { forecast: nc([3, 2.5, 2, 1.5, 0.8, 0.3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) } };
  card.hass = Object.assign({}, h); await wait();
  t = card.shadowRoot.textContent.replace(/\s+/g, ' ');
  ok(!card.shadowRoot.querySelector('.warn'), 'warning cleared (none)');
  ok(/Rain stops around \d\d:\d\d, dry after that/.test(t), 'nowcast stops: ' + t.slice(-300));
  ok(card.shadowRoot.querySelectorAll('.bars span').length === 24, '24 five-minute bars: ' + card.shadowRoot.querySelectorAll('.bars span').length);
  ok(/Now\s*\d\d:\d\d/.test(card.shadowRoot.querySelector('.ticks').textContent), 'minute ticks');
  // nowcast: dry now, rain in 15 min
  h.states['binary_sensor.weer_home_precipitation_forecasted'] = { entity_id: 'binary_sensor.weer_home_precipitation_forecasted', state: 'on', attributes: { forecast: nc([0, 0, 0, 0, 0.4, 1.2, 2.6, 1.0, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) } };
  card.hass = Object.assign({}, h); await wait();
  t = card.shadowRoot.textContent.replace(/\s+/g, ' ');
  ok(/Rain in about 15 minutes, heaviest around \d\d:\d\d\./.test(t), 'nowcast soon: ' + t.slice(-300));
  // nowcast dry -> back to hourly line
  h.states['binary_sensor.weer_home_precipitation_forecasted'] = { entity_id: 'binary_sensor.weer_home_precipitation_forecasted', state: 'off', attributes: { forecast: nc(Array(25).fill(0)) } };
  card.hass = Object.assign({}, h); await wait();
  ok(!card.shadowRoot.querySelector('.bars') && card.shadowRoot.querySelectorAll('.hour').length === 6, 'dry nowcast keeps temp line');

  // 11. rain stops and starts again
  const rainy = (vals) => vals.map((v, i) => ({ datetime: new Date(now + (i - 1) * 300000 + 1000).toISOString(), precipitation: v }));
  h.states['binary_sensor.weer_home_precipitation_forecasted'] = { entity_id: 'binary_sensor.weer_home_precipitation_forecasted', state: 'on', attributes: { forecast: rainy([2, 2, 1.5, 0.5, 0, 0, 0, 0, 0.3, 1.4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) } };
  card.hass = Object.assign({}, h); await wait();
  t = card.shadowRoot.textContent.replace(/\s+/g, ' ');
  ok(/Rain stops around \d\d:\d\d, starts again around \d\d:\d\d\./.test(t), 'starts again: ' + t.slice(-200));
  h.states['binary_sensor.weer_home_precipitation_forecasted'].attributes.forecast = rainy([2, 2, 0, 1.2, 1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  card.hass = Object.assign({}, h); await wait();
  t = card.shadowRoot.textContent.replace(/\s+/g, ' ');
  ok(/Rain stops around \d\d:\d\d, dry after that/.test(t) && !t.includes('starts again'), 'short gap ignored: ' + t.slice(-200));
  h.states['binary_sensor.weer_home_precipitation_forecasted'].attributes.forecast = rainy([2, 1, 0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  card._forecast = hourly([9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], [0, 0, 0, 0, 0.6, 1, 0, 0, 0, 0, 0, 0]);
  card.hass = Object.assign({}, h); await wait();
  t = card.shadowRoot.textContent.replace(/\s+/g, ' ');
  ok(/Rain stops around \d\d:\d\d, back around \d\d:\d\d\./.test(t), 'back later from hourly: ' + t.slice(-200));

  // 12. waste chip (Afvalwijzer)
  {
    const day = (n, hh = 0) => { const d = new Date(); d.setHours(hh, 0, 0, 0); d.setDate(d.getDate() + n); return d.toISOString(); };
    const wst = (id, n) => ({ entity_id: id, state: day(n), attributes: { days_until_collection_date: n, friendly_name: id } });
    const mk = () => ({ 'sensor.afvalwijzer_pmd': wst('sensor.afvalwijzer_pmd', 1), 'sensor.afvalwijzer_papier': wst('sensor.afvalwijzer_papier', 4), 'sensor.afvalwijzer_gft': wst('sensor.afvalwijzer_gft', 1),
      'sensor.afvalwijzer_tomorrow': { entity_id: 'sensor.afvalwijzer_tomorrow', state: 'pmd, gft', attributes: { days_until_collection_date: 1 } },
      'input_boolean.bins_out': { entity_id: 'input_boolean.bins_out', state: 'off', attributes: {}, last_changed: new Date(Date.now() - 86400000 * 3).toISOString() } });
    const W = w.CranberryWaste.wasteState;
    let evening = new Date(); evening.setHours(19, 0, 0, 0);
    let r = W({ states: mk() }, { waste: 'auto', waste_out: 'input_boolean.bins_out' }, evening);
    ok(r.items.length === 3, 'auto finds 3 bins, skips tomorrow sensor: ' + r.items.map((x) => x.id));
    ok(r.chip === 'Plastic and green out tonight' || r.chip === 'Green and plastic out tonight', 'two bins tonight: ' + r.chip);
    let noon = new Date(); noon.setHours(12, 0, 0, 0);
    ok(!W({ states: mk() }, { waste: 'auto' }, noon).chip, 'no chip at noon the day before');
    const st2 = mk(); st2['sensor.afvalwijzer_pmd'] = wst('sensor.afvalwijzer_pmd', 0); delete st2['sensor.afvalwijzer_gft'];
    let early = new Date(); early.setHours(6, 45, 0, 0);
    ok(W({ states: st2 }, { waste: 'auto' }, early).chip === 'Plastic is collected today', 'today early');
    let late = new Date(); late.setHours(8, 0, 0, 0);
    ok(!W({ states: st2 }, { waste: 'auto' }, late).chip, 'gone after collection time');
    const st3 = mk(); st3['input_boolean.bins_out'] = { entity_id: 'input_boolean.bins_out', state: 'on', attributes: {}, last_changed: new Date(evening.getTime() - 30 * 60000).toISOString() };
    ok(W({ states: st3 }, { waste: 'auto', waste_out: 'input_boolean.bins_out' }, evening).out === true, 'out tonight hides');
    const st4 = mk(); st4['input_boolean.bins_out'] = { entity_id: 'input_boolean.bins_out', state: 'on', attributes: {}, last_changed: new Date(Date.now() - 86400000 * 5).toISOString() };
    ok(W({ states: st4 }, { waste: 'auto', waste_out: 'input_boolean.bins_out' }, evening).out === false, 'stale on ignored');
    // rendered chip in the card
    w = setup(); card = w.document.createElement('cranberry-home-card');
    card.setConfig(Object.assign({}, base, { waste: ['sensor.afvalwijzer_pmd', 'sensor.afvalwijzer_papier', 'sensor.afvalwijzer_gft'], waste_out: 'input_boolean.bins_out', waste_remind_from: '00:00' })); w.document.body.appendChild(card);
    h = hass(mk(), hourly(Array(12).fill(7))); card.hass = h; await wait();
    const b = card.shadowRoot.querySelector('.bins');
    ok(b && /out tonight/.test(b.textContent) && card.shadowRoot.querySelector('.issue'), 'chip rendered beside issue chip');
    let called = null; h.callService = (d, sv, x) => { called = [d, sv, x]; }; card.hass = Object.assign({}, h); await wait();
    card.shadowRoot.querySelector('.bins').click();
    ok(called && called[1] === 'turn_on' && called[2].entity_id === 'input_boolean.bins_out', 'tap marks out');
  }

  // 13. partly cloudy at night shows a moon
  {
    w = setup(); card = w.document.createElement('cranberry-home-card'); card.setConfig(Object.assign({}, base, { issues: [] })); w.document.body.appendChild(card);
    const at = (hFromNow) => new Date(now + hFromNow * 3600000).toISOString();
    const fc = hourly([6, 6, 5, 5, 5, 5, 6, 7, 8, 9, 9, 9], null, Array(12).fill('partlycloudy'));
    h = hass({ 'weather.home': { entity_id: 'weather.home', state: 'partlycloudy', attributes: { temperature: 6, temperature_unit: '°C', supported_features: 2 } },
      'sun.sun': { entity_id: 'sun.sun', state: 'below_horizon', attributes: { next_rising: at(5.5), next_setting: at(14) } } }, fc);
    card.hass = h; await wait();
    const art = card.shadowRoot.querySelector('.head svg').innerHTML;
    ok(art.includes('M34 25A12') && !art.includes('M24 10a11'), 'big icon is moon at night');
    const icons = [...card.shadowRoot.querySelectorAll('.hour svg path')].map((p) => p.getAttribute('d').slice(0, 8));
    ok(icons[0] === 'M13 16a3' && icons[1] === 'M13 16a3' && icons[3] === 'M12 2v2M', 'hours switch to sun after sunrise: ' + icons.join(' | '));
    h.states['sun.sun'] = { entity_id: 'sun.sun', state: 'above_horizon', attributes: { next_rising: at(20), next_setting: at(3) } };
    card.hass = Object.assign({}, h); await wait();
    ok(card.shadowRoot.querySelector('.head svg').innerHTML.includes('M24 10a11'), 'big icon is sun by day');
  }

  // 14. realistic KNMI yellow warning: description in state, details in the alerts list
  {
    w = setup(); card = w.document.createElement('cranberry-home-card');
    card.setConfig(Object.assign({}, base, { issues: [], warning: ['binary_sensor.weer_home_warning_active', 'sensor.weer_home_warning_level', 'sensor.weer_home_warnings'] })); w.document.body.appendChild(card);
    const exp = new Date(now + 6 * 3600000).toISOString();
    h = hass({ 'binary_sensor.weer_home_warning_active': { entity_id: 'binary_sensor.weer_home_warning_active', state: 'on', attributes: {} },
      'sensor.weer_home_warning_level': { entity_id: 'sensor.weer_home_warning_level', state: 'yellow', attributes: {} },
      'sensor.weer_home_warnings': { entity_id: 'sensor.weer_home_warnings', state: 'Gladheid', attributes: { alert_count: 1, description: 'Gladheid', alerts: [{ code: 'yellow', condition: 'snowy-rainy', description: 'Gladheid', headline: 'Code geel vanwege gladheid', details: 'Vanavond en vannacht kan het plaatselijk glad worden door bevriezing van natte weggedeelten. Ook kan er lokaal ijzel ontstaan. Houd rekening met verkeershinder.', onset: new Date(now - 3600000).toISOString(), expires: exp }] } } }, hourly(Array(12).fill(1)));
    card.hass = h; await wait();
    t = card.shadowRoot.textContent.replace(/\s+/g, ' ');
    ok(t.includes('Code yellow · Slippery roads · until'), 'strip in English: ' + t.slice(-500));
    ok(t.includes('Roads and paths may be slippery. Take care walking, cycling or driving.') && !t.includes('Vanavond') && !t.includes('Avoid travelling'), 'English advice, no extra at yellow: ' + t.slice(-330));
    card.setConfig(Object.assign({}, base, { issues: [], warning_text: 'original', warning: ['binary_sensor.weer_home_warning_active', 'sensor.weer_home_warning_level', 'sensor.weer_home_warnings'] })); card.hass = Object.assign({}, h); await wait();
    t = card.shadowRoot.textContent.replace(/\s+/g, ' ');
    ok(t.includes('Code yellow · Gladheid · until') && t.includes('Vanavond en vannacht kan het plaatselijk glad worden door bevriezing van natte weggedeelten.') && t.includes('Ook kan er lokaal ijzel ontstaan.') && !t.includes('verkeershinder'), 'original Dutch on request: ' + t.slice(-330));
    ok(t.includes('Slippery roads warning until'), 'chip names the type');
    card.setConfig(Object.assign({}, base, { issues: [], warning_detail: false, warning: ['sensor.weer_home_warnings', 'sensor.weer_home_warning_level'] })); card.hass = Object.assign({}, h); await wait();
    ok(!card.shadowRoot.textContent.includes('Vanavond') && !card.shadowRoot.textContent.includes('Roads and paths'), 'can be switched off');
    // only the state, no list (short description) still shows
    h.states['sensor.weer_home_warnings'] = { entity_id: 'sensor.weer_home_warnings', state: 'Onweer', attributes: {} };
    card.setConfig(Object.assign({}, base, { issues: [], warning: ['sensor.weer_home_warning_level', 'sensor.weer_home_warnings'] })); card.hass = Object.assign({}, h); await wait();
    ok(card.shadowRoot.textContent.includes('Code yellow · Onweer'), 'short state used as text');
  }

  // 15. editor turns a single warning entity into a list
  {
    w = setup(); w.customElements.define('ha-form', class extends w.HTMLElement {});
    const ed = w.customElements.get('cranberry-home-card').getConfigElement(); w.document.body.appendChild(ed);
    ed.setConfig({ weather: 'weather.home', warning: 'binary_sensor.meteoalarm', lights: 'light.a' }); ed.hass = hass(); await wait();
    const f = ed.querySelector('ha-form');
    ok(Array.isArray(f.data.warning) && f.data.warning[0] === 'binary_sensor.meteoalarm' && Array.isArray(f.data.lights), 'single values become lists');
    ok(f.schema.some((x) => x.name === 'warning' && x.selector.entity.multiple), 'warning picker present');
  }

  // 16. weather details and coming up: show, desktop only, hide
  {
    w = setup();
    const card = w.document.createElement('cranberry-home-card'); w.document.body.appendChild(card);
    const day = new Date(); day.setHours(0, 0, 0, 0);
    const iso = (d) => d.toISOString();
    const tomorrow9 = new Date(day.getTime() + 86400000 + 9 * 3600000);
    const inTwo = new Date(day.getTime() + 2 * 86400000);
    const ymd = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    let asked = [];
    const h = hass({ 'weather.home': { entity_id: 'weather.home', state: 'clear-night', attributes: { friendly_name: 'Home', temperature: -1, temperature_unit: '°C', supported_features: 3, wind_speed: 12, wind_bearing: 225, wind_speed_unit: 'km/h' } },
      'sun.sun': { entity_id: 'sun.sun', state: 'below_horizon', attributes: { next_rising: new Date(now + 9 * 3600000).toISOString(), next_setting: new Date(now + 18 * 3600000).toISOString() } } },
      hourly([0, 0, 1, 0, -1, 0, 2, 3, 3, 2, 1, 0], [0, 0, 0, 0, 0, 0.6, 0, 0, 0, 0, 0, 0]));
    h.callApi = async (m, path) => { asked.push(path); return path.indexOf('calendar.family') >= 0
      ? [{ summary: 'Dentist', start: { dateTime: iso(tomorrow9) }, end: { dateTime: iso(new Date(tomorrow9.getTime() + 3600000)) } },
         { summary: 'Dinner', start: { dateTime: iso(new Date(tomorrow9.getTime() + 9.5 * 3600000)) }, end: { dateTime: iso(new Date(tomorrow9.getTime() + 12 * 3600000)) } },
         { summary: 'Old thing', start: { dateTime: iso(new Date(now - 7200000)) }, end: { dateTime: iso(new Date(now - 3600000)) } },
         { summary: 'Mylou’s birthday', start: { date: ymd(inTwo) }, end: { date: ymd(new Date(inTwo.getTime() + 86400000)) } }]
      : [{ summary: 'Call with Sam', start: { dateTime: iso(new Date(now - 600000)) }, end: { dateTime: iso(new Date(now + 1800000)) } }]; };
    card.setConfig(Object.assign({}, base, { issues: [], weather_details: 'wide', coming_up: 'show', calendars: ['calendar.family', 'calendar.work'], coming_up_count: 3 }));
    card.hass = h; await wait(); await wait();
    const $ = (s) => card.shadowRoot.querySelector(s), $$ = (s) => [...card.shadowRoot.querySelectorAll(s)];
    ok(asked.length === 2 && /calendars\/calendar\.family\?start=/.test(asked[0]), 'asks each calendar');
    const evs = $$('.ev').map((e) => [...e.querySelectorAll('small,.serif,.what,.when')].map((x) => x.textContent).join('|'));
    const dn = (d) => new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(d) + '|' + d.getDate();
    ok(evs.length === 3 && new RegExp('^' + dn(new Date()) + '\\|Call with Sam\\|Now, until \\d\\d:\\d\\d$').test(evs[0]) && evs[1] === dn(tomorrow9) + '|Dentist|09:00 · +1 more' && evs[2] === dn(inTwo) + '|Mylou’s birthday|All day', 'one block per day, ended left out: ' + evs.join(' / '));
    ok(/^[A-Z][a-z]+day \d+ [A-Z][a-z]+: Dentist, 09:00$/.test($$('.ev')[1].getAttribute('aria-label')), 'spoken label: ' + $$('.ev')[1].getAttribute('aria-label'));
    ok($('.ev').getAttribute('data-entity') === 'calendar.work', 'taps open the calendar');
    const stats = $$('.stat').map((x) => x.textContent);
    ok(stats[0] === 'High / low3° / -1°' || stats[0] === 'High / low3° / −1°', 'high and low: ' + stats.join('|'));
    ok(stats.includes('Rain80%') && stats.includes('WindSW 12 km/h') && stats.some((x) => /^Sunrise\d\d:\d\d$/.test(x)), 'rain, wind, sunrise: ' + stats.join('|'));
    ok($('.weather').classList.contains('fill') && ($('.plot svg') || $('.bars')), 'chart fills the height');
    // count
    card.setConfig(Object.assign({}, base, { issues: [], coming_up: 'show', calendars: ['calendar.family', 'calendar.work'], coming_up_count: 1 })); card.hass = Object.assign({}, h); await wait(); await wait();
    ok($$('.ev').length === 1, 'count limits the list');
    // stacked: desktop only hides, show keeps
    card.setConfig(Object.assign({}, base, { issues: [], layout: 'stacked', weather_details: 'wide', coming_up: 'wide', calendars: ['calendar.family'] })); card.hass = Object.assign({}, h); await wait();
    ok(!$('.agenda') && !$('.stats') && !$('.weather').classList.contains('fill'), 'desktop only: hidden when stacked');
    card.setConfig(Object.assign({}, base, { issues: [], layout: 'stacked', weather_details: 'show', coming_up: 'show', calendars: ['calendar.family'] })); card.hass = Object.assign({}, h); await wait(); await wait();
    ok($('.agenda') && $('.stats'), 'show: also when stacked');
    card.setConfig(Object.assign({}, base, { issues: [], weather_details: 'hide', coming_up: 'hide', calendars: ['calendar.family'] })); card.hass = Object.assign({}, h); await wait();
    ok(!$('.agenda') && !$('.stats'), 'hidden by default and on hide');
    // with a pop-up, Coming up opens it
    card.setConfig(Object.assign({}, base, { issues: [], coming_up: 'show', calendars: ['calendar.family'], calendar_popup: '#calendar' })); card.hass = Object.assign({}, h); await wait(); await wait();
    let navd = 0, pushed = ''; w.addEventListener('location-changed', () => navd++);
    const realPush = w.history.pushState; w.history.pushState = (a, b, url) => { pushed = url; };
    $('.ev').click(); w.history.pushState = realPush;
    ok(/#calendar$/.test(pushed) && navd === 1 && $('button.k') && $('button.k').getAttribute('data-nav') === '#calendar', 'coming up opens the calendar pop-up: ' + [w.location.hash, navd, !!$('button.k'), $$('.ev').length, $('.agenda') && $('.agenda').innerHTML.slice(0,160)].join(' | '));
    // nothing planned
    h.callApi = async () => [];
    card.hass = Object.assign({}, h); card.setConfig(Object.assign({}, base, { issues: [], coming_up: 'show', calendars: ['calendar.family'] })); await wait(); await wait();
    ok($('.agenda .none') && $('.agenda .none').textContent === 'Nothing planned this week.', 'empty calendar: ' + ($('.agenda') ? $('.agenda').textContent : 'no agenda'));
  }

  // the glance strip on a phone: problems summarised, Needs you over the card, no chart
  {
    const w = setup();
    const card = w.document.createElement('cranberry-home-card'); w.document.body.appendChild(card);
    const $ = (q) => card.shadowRoot.querySelector(q), $$ = (q) => [...card.shadowRoot.querySelectorAll(q)];
    const calls = [];
    const h = hass({ 'lock.front': { entity_id: 'lock.front', state: 'unlocked', attributes: { friendly_name: 'Front door' } },
      'binary_sensor.window': { entity_id: 'binary_sensor.window', state: 'on', attributes: { friendly_name: 'Bedroom window' } } }, hourly([7, 6, 6, 5, 5, 4]));
    h.callService = (d, s2, data) => calls.push([d, s2, data]);
    card.setConfig(Object.assign({}, base, { layout: 'stacked', hourly_chart: 'wide', issues: ['binary_sensor.back_door', 'lock.front', 'binary_sensor.window'] }));
    card.hass = h; await wait(); await wait();
    ok($('.issue .n').textContent === '3' && $('.issue .it').textContent === 'Back door open' && $('.issue .more').textContent === '+2', 'phone: the first problem and +2: ' + $('.issue').textContent);
    ok($('.lamps .lbl').textContent === 'lights on', 'phone: a short lights chip: ' + $('.lamps .lbl').textContent);
    ok($('.weather.gone') && !$('.chart'), 'phone: no hourly chart with hourly_chart: wide');
    $('.issue').click(); await wait();
    ok($('ha-card.menu-open') && $('.menu .mtitle').textContent === 'Needs you' && $$('.menu .mrow').length === 3, 'Needs you opens over the card with every problem');
    const rows = $$('.menu .mrow');
    ok(rows[1].querySelector('.mname span').textContent === 'Front door' && rows[1].querySelector('small').textContent === 'Unlocked' && rows[1].querySelector('.mact'), 'a row: name, state, and Lock for an unlocked door');
    ok(!rows[0].querySelector('.mact'), 'an open door has no button');
    rows[1].querySelector('.mact').click();
    ok(calls.some((c) => c[0] === 'lock' && c[1] === 'lock' && c[2].entity_id === 'lock.front'), 'Lock locks it: ' + JSON.stringify(calls));
    let info = null; card.addEventListener('hass-more-info', (e) => { info = e.detail.entityId; });
    rows[0].querySelector('.mname').click();
    ok(info === 'binary_sensor.back_door', 'a name opens its details');
    $('.menu [data-close]').click(); await wait();
    ok(!$('.menu') && !$('ha-card.menu-open'), 'closes');
    // on the desktop layout the chip still lists them all
    card.setConfig(Object.assign({}, base, { layout: 'wide', issues: ['binary_sensor.back_door', 'lock.front'] })); card.hass = Object.assign({}, h); await wait();
    ok($('.issue .it').textContent === 'Back door open · Front door unlocked' && !$('.issue .more'), 'desktop: unchanged: ' + $('.issue').textContent);
    ok($('.chart'), 'desktop: the chart stays');
  }

  // scene pills
  {
    const w = setup();
    const t0 = Date.now();
    const st = (id, ago) => ({ entity_id: id, state: new Date(t0 - ago).toISOString(), attributes: { friendly_name: id.split('.')[1], entity_id: [] } });
    const calls = [];
    const el = w.document.createElement('cranberry-scenes-card'); w.document.body.appendChild(el);
    el.setConfig({ scenes: ['scene.soho', { entity: 'scene.bright', name: 'Bright', icon: 'mdi:sun' }, 'scene.zen'] });
    el.hass = { states: { 'scene.soho': st('scene.soho', 60000), 'scene.bright': st('scene.bright', 3600000), 'scene.zen': st('scene.zen', 7200000) }, language: 'en', entities: {}, callService: (d, s2, data) => calls.push([d, s2, data]) };
    const pills = [...el.shadowRoot.querySelectorAll('.pill')];
    ok(pills.length === 3 && pills[1].textContent.trim() === 'Bright' && el.shadowRoot.querySelector('.row.scrollrow'), 'pills, one row that scrolls');
    ok(pills[0].getAttribute('aria-pressed') === 'true' && pills[1].getAttribute('aria-pressed') === 'false', 'the one picked last is pressed');
    pills[2].click();
    ok(calls.length === 1 && calls[0][0] === 'scene' && calls[0][2].entity_id === 'scene.zen', 'tap turns it on');
    let err = null; try { w.document.createElement('cranberry-scenes-card').setConfig({}); } catch (e) { err = e; }
    ok(err, 'asks for scenes');
  }

  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
