// Scene buttons follow the Stateful Scenes switches
const { JSDOM } = require('jsdom');
const fs = require('fs');
const code = fs.readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window; w.console.info = () => {}; w.eval(code);
const S = (id, state, a) => ({ entity_id: id, state, attributes: Object.assign({}, a || {}), last_changed: new Date().toISOString() });
const states = {
  'scene.soho': S('scene.soho', '2026-11-25T20:00:00Z', { friendly_name: 'Soho' }),
  'scene.living_room_bright': S('scene.living_room_bright', '2026-11-25T19:00:00Z', { friendly_name: 'Living room bright' }),
  'scene.zen': S('scene.zen', '2026-11-25T18:00:00Z', { friendly_name: 'Zen' }),
  'switch.soho_stateful_scene': S('switch.soho_stateful_scene', 'on', { friendly_name: 'Soho Stateful Scene' }),
  // a renamed scene: the switch still carries its name
  'switch.lr_bright_stateful_scene': S('switch.lr_bright_stateful_scene', 'off', { friendly_name: 'Living room bright Stateful Scene' })
};
const calls = [];
const hass = () => ({ states, language: 'en', entities: {}, callService: (d, s, data) => { calls.push([d, s, data]); return Promise.resolve(); }, formatEntityState: (x) => x.state });
const card = (cfg) => { const el = w.document.createElement('cranberry-scene-card'); w.document.body.appendChild(el); el.setConfig(cfg); el.hass = hass(); return el; };
const soho = card({ entity: 'scene.soho' });
ok(soho.shadowRoot.querySelector('ha-card.on') && soho.shadowRoot.querySelector('button').getAttribute('aria-pressed') === 'true', 'Soho: cranberry while its switch is on');
const bright = card({ entity: 'scene.living_room_bright', name: 'Bright' });
ok(!bright.shadowRoot.querySelector('ha-card.on') && bright.shadowRoot.querySelector('button').getAttribute('aria-pressed') === 'false', 'Bright: found by name, off');
bright.shadowRoot.querySelector('button').click();
ok(calls[0][0] === 'switch' && calls[0][1] === 'turn_on' && calls[0][2].entity_id === 'switch.lr_bright_stateful_scene', 'a tap turns the switch on: ' + JSON.stringify(calls[0]));
states['switch.lr_bright_stateful_scene'] = S('switch.lr_bright_stateful_scene', 'on', { friendly_name: 'Living room bright Stateful Scene' });
states['switch.soho_stateful_scene'] = S('switch.soho_stateful_scene', 'off', { friendly_name: 'Soho Stateful Scene' });
bright.hass = hass(); soho.hass = hass();
ok(bright.shadowRoot.querySelector('ha-card.on') && !soho.shadowRoot.querySelector('ha-card.on'), 'follows the switches');
const zen = card({ entity: 'scene.zen' });
ok(!zen.shadowRoot.querySelector('button').hasAttribute('aria-pressed'), 'no switch: a plain button');
calls.length = 0; zen.shadowRoot.querySelector('button').click();
ok(calls[0][0] === 'scene' && calls[0][2].entity_id === 'scene.zen' && zen.shadowRoot.querySelector('ha-card.ran'), 'no switch: runs the scene, a short flash');
const off = card({ entity: 'scene.soho', stateful: false });
ok(!off.shadowRoot.querySelector('button').hasAttribute('aria-pressed'), 'stateful: false turns it off');
const set = card({ entity: 'scene.zen', stateful: 'switch.soho_stateful_scene' });
ok(set.shadowRoot.querySelector('button').getAttribute('aria-pressed') === 'false', 'or name the switch yourself');
// the pills
const p = w.document.createElement('cranberry-scenes-card'); w.document.body.appendChild(p);
p.setConfig({ scenes: ['scene.soho', { entity: 'scene.living_room_bright', name: 'Bright' }, 'scene.zen'] }); p.hass = hass();
const pills = [...p.shadowRoot.querySelectorAll('.pill')];
ok(pills.map((x) => x.getAttribute('aria-pressed')).join() === 'false,true,' && pills[1].classList.contains('on'), 'pills follow the switches: ' + pills.map((x) => x.getAttribute('aria-pressed')).join());
calls.length = 0; pills[0].click();
ok(calls[0][0] === 'switch' && calls[0][2].entity_id === 'switch.soho_stateful_scene', 'a pill turns its switch on');
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
