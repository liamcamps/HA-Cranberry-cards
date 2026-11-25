// Scenes: on while the lights still match what the scene set
const { JSDOM } = require('jsdom');
const fs = require('fs');
const code = fs.readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window; w.console.info = () => {}; w.eval(code);
const ago = (s) => new Date(Date.now() - s * 1000).toISOString();
const L = (id, state, a, changed) => ({ entity_id: id, state, attributes: Object.assign({ friendly_name: id }, a || {}), last_changed: changed || ago(3600), last_updated: changed || ago(3600) });
const states = {
  'scene.relax': L('scene.relax', ago(600), { id: '101', friendly_name: 'Relax', entity_id: ['light.sofa', 'light.table'] }),
  'scene.bright': L('scene.bright', ago(1200), { id: '102', friendly_name: 'Bright', entity_id: ['light.sofa', 'light.table'] }),
  'scene.off': L('scene.off', ago(90000), { id: '103', friendly_name: 'All off', entity_id: ['light.sofa', 'light.table'] }),
  'light.sofa': L('light.sofa', 'on', { brightness: 77, color_mode: 'color_temp', color_temp_kelvin: 2700 }, ago(5)),
  'light.table': L('light.table', 'on', { brightness: 128, color_mode: 'color_temp', color_temp_kelvin: 2700 }, ago(5))
};
const CFG = {
  101: { entities: { 'light.sofa': { state: 'on', brightness: 76, color_temp_kelvin: 2700 }, 'light.table': { state: 'on', brightness: 127, color_temp_kelvin: 2702 } } },
  102: { entities: { 'light.sofa': { state: 'on', brightness: 255, color_temp_kelvin: 4000 }, 'light.table': { state: 'on', brightness: 255, color_temp_kelvin: 4000 } } },
  103: { entities: { 'light.sofa': 'off', 'light.table': { state: 'off' } } }
};
let asked = [];
const hass = () => ({ states, language: 'en', entities: {}, callService: () => Promise.resolve(), formatEntityState: (s) => s.state,
  callApi: (m, p) => { asked.push(p); const id = p.split('/').pop(); return CFG[id] ? Promise.resolve(CFG[id]) : Promise.reject(new Error('401')); } });
const tick = () => new Promise((r) => setTimeout(r, 20));
(async () => {
  const el = w.document.createElement('cranberry-scenes-card'); w.document.body.appendChild(el);
  el.setConfig({ scenes: [{ entity: 'scene.relax' }, { entity: 'scene.bright' }, { entity: 'scene.off' }] });
  el.hass = hass(); await tick();
  const on = () => [...el.shadowRoot.querySelectorAll('[aria-pressed="true"]')].map((b) => b.textContent.trim()).join();
  ok(asked.length === 3 && asked[0] === 'config/scene/config/101', 'reads each scene’s settings once: ' + asked);
  ok(on() === 'Relax', 'Relax is on, even though the lights changed just now: ' + on());
  // someone dims the sofa lamp: no scene fits
  states['light.sofa'] = L('light.sofa', 'on', { brightness: 30, color_mode: 'color_temp', color_temp_kelvin: 2700 }, ago(1));
  el.hass = hass(); await tick();
  ok(on() === '', 'dimmed by hand: none: ' + on());
  // lights set to Bright by hand, without the scene: Bright shows
  states['light.sofa'] = L('light.sofa', 'on', { brightness: 255, color_mode: 'color_temp', color_temp_kelvin: 4000 });
  states['light.table'] = L('light.table', 'on', { brightness: 254, color_mode: 'color_temp', color_temp_kelvin: 4000 });
  el.hass = hass(); await tick();
  ok(on() === 'Bright', 'the lights look like Bright: ' + on());
  // all off
  states['light.sofa'] = L('light.sofa', 'off', {}); states['light.table'] = L('light.table', 'off', {});
  el.hass = hass(); await tick();
  ok(on() === 'All off', 'everything off: All off: ' + on());
  ok(asked.length === 3, 'not asked again');
  // an unavailable lamp doesn't count against it
  states['light.table'] = L('light.table', 'unavailable', {});
  el.hass = hass(); await tick();
  ok(on() === 'All off', 'an unavailable lamp is skipped');
  // a scene whose settings can't be read: the old rule, picked last and nothing changed
  states['scene.tv'] = L('scene.tv', ago(30), { id: '999', friendly_name: 'TV', entity_id: ['light.tv'] });
  states['light.tv'] = L('light.tv', 'on', {}, ago(3600));
  const one = w.document.createElement('cranberry-scene-card'); w.document.body.appendChild(one);
  one.setConfig({ entity: 'scene.tv' }); one.hass = hass(); await tick(); one.hass = hass(); await tick();
  ok(one.shadowRoot.querySelector('ha-card.active'), 'no settings: falls back to picked last');
  console.log(`${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
