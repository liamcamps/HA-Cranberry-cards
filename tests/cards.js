const { JSDOM } = require('jsdom');
const code = require('fs').readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://ha.local/dashboard-home/home' });
const w = dom.window; w.console.info = () => {}; w.eval(code);
const now = Date.now(), iso = (msAgo) => new Date(now - msAgo).toISOString();
const S = (id, state, attributes = {}, changedAgo = 3600000) => ({ entity_id: id, state, attributes, last_changed: iso(changedAgo), last_updated: iso(changedAgo) });
const calls = [];
const states = {};
[
  S('climate.living_room', 'heat', { friendly_name: 'Living room', temperature: 21, current_temperature: 20.6, hvac_action: 'heating', target_temp_step: 0.5, min_temp: 7, max_temp: 30 }),
  S('lock.front_door', 'locked', { friendly_name: 'Front door' }),
  S('alarm_control_panel.home', 'armed_home', { friendly_name: 'Alarm' }),
  S('zone.home', '2', { friendly_name: 'Home', persons: ['person.anna', 'person.bram'] }),
  S('person.anna', 'home', { friendly_name: 'Anna de Vries' }), S('person.bram', 'home', { friendly_name: 'Bram' }),
  S('light.living_room', 'on', { friendly_name: 'Living room', entity_id: ['light.a', 'light.b', 'light.c'] }),
  S('light.a', 'on', { brightness: 178 }), S('light.b', 'on', { brightness: 102 }), S('light.c', 'off', {}),
  S('light.bath', 'off', { entity_id: ['light.m'] }), S('light.m', 'unavailable', {}),
  S('switch.garden', 'on', { friendly_name: 'Garden lights' }),
  S('sensor.living_temp', '21.14', { unit_of_measurement: '°C' }),
  S('scene.evening', iso(20 * 60000), { friendly_name: 'Evening', entity_id: ['light.a', 'light.b'] }, 20 * 60000),
  S('scene.dinner', iso(3 * 3600000), { friendly_name: 'Dinner', entity_id: ['light.a'] }),
  S('scene.night', 'unknown', { friendly_name: 'Night' }),
  S('media_player.living_room', 'playing', { friendly_name: 'Living room speaker', media_title: 'Harvest Moon', media_artist: 'Neil Young', supported_features: 1 | 16 | 32 | 4096 | 16384, entity_picture: '/api/x.jpg' })
].forEach((s) => { states[s.entity_id] = s; });
const hass = () => ({ states: Object.assign({}, states), language: 'en', locale: { language: 'en' }, config: { unit_system: { temperature: '°C' } }, entities: {}, callService: (d, s, data) => { calls.push([d, s, data]); return Promise.resolve(); }, formatEntityState: (st) => st.state.replace('_', ' ').replace(/^./, (c) => c.toUpperCase()) });
const make = (tag, cfg) => { const el = w.document.createElement(tag); el.setConfig(cfg); w.document.body.appendChild(el); el.hass = hass(); return el; };
const txt = (el) => el.shadowRoot.textContent.replace(/\s+/g, ' ');
const q = (el, s) => el.shadowRoot.querySelector(s);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  ['cranberry-status-card', 'cranberry-room-card', 'cranberry-scene-card', 'cranberry-media-card', 'cranberry-home-card'].forEach((t) => ok(w.customCards.some((c) => c.type === t), 'picker ' + t));

  // climate
  let el = make('cranberry-status-card', { entity: 'climate.living_room', name: 'Heating' });
  ok(txt(el).includes('Heating to 21° · 20.6°'), 'climate state: ' + txt(el).slice(-120));
  el.setConfig({ entity: 'climate.living_room', short: false }); el.hass = hass(); ok(txt(el).includes('Heating to 21 °C · 20.6 °C'), 'climate state with unit: ' + txt(el).slice(-120)); el.setConfig({ entity: 'climate.living_room' }); el.hass = hass();
  let btns = el.shadowRoot.querySelectorAll('.btns button');
  ok(btns.length === 3 && btns[1].textContent.trim() === '21°' && btns[1].getAttribute('aria-pressed') === 'true', 'climate buttons');
  btns[2].click(); btns = el.shadowRoot.querySelectorAll('.btns button'); btns[2].click();
  ok(el.shadowRoot.querySelectorAll('.btns button')[1].textContent.trim() === '22°', 'optimistic target');
  await wait(800); ok(calls.some((c) => c[1] === 'set_temperature' && c[2].temperature === 22), 'set_temperature debounced');

  // lock + alarm alert
  el = make('cranberry-status-card', { entity: 'lock.front_door', alarm: 'alarm_control_panel.home' });
  ok(!q(el, 'ha-card').className.includes('alert') && el.shadowRoot.querySelectorAll('.btns button').length === 2, 'lock fine');
  states['lock.front_door'] = S('lock.front_door', 'unlocked', { friendly_name: 'Front door' }); el.hass = hass();
  ok(q(el, 'ha-card').className.includes('alert') && txt(el).includes('Unlocked · alarm is on'), 'lock alert when armed');
  q(el, '.btns button').click(); ok(calls.some((c) => c[0] === 'lock' && c[1] === 'lock'), 'lock call');

  // alarm
  el = make('cranberry-status-card', { entity: 'alarm_control_panel.home' });
  btns = el.shadowRoot.querySelectorAll('.btns button');
  ok(btns.length === 4 && btns[0].getAttribute('aria-pressed') === 'true', 'alarm modes');
  btns[1].click(); ok(calls.some((c) => c[1] === 'alarm_arm_away'), 'arm away');

  // people
  el = make('cranberry-status-card', { entity: 'zone.home' });
  ok(txt(el).includes('Anna & Bram') && txt(el).includes('Both home'), 'people both: ' + txt(el).slice(-60));
  states['person.bram'] = S('person.bram', 'not_home', { friendly_name: 'Bram' }); el.hass = hass();
  ok(txt(el).includes('Anna home · Bram away'), 'people some');
  states['person.anna'] = S('person.anna', 'not_home', { friendly_name: 'Anna' }); el.hass = hass();
  ok(txt(el).includes('Nobody home'), 'people none');

  // room
  el = make('cranberry-room-card', { entity: 'light.living_room', icon: 'mdi:sofa-outline', temperature: 'sensor.living_temp', popup: '#living-room' });
  ok(txt(el).includes('2 of 3 on · 55%'), 'room state: ' + txt(el).slice(-60));
  ok(q(el, '.fill').style.width === '55%', 'fill bar');
  ok(q(el, '.tog').getAttribute('style').includes('var(--cc-on)'), 'readable icon when on');
  ok(txt(el).includes('21.1°'), 'temperature chip');
  let nav = 0; w.addEventListener('location-changed', () => nav++);
  q(el, '.open').click(); ok(w.location.hash === '#living-room' && nav === 1, 'opens pop-up');
  q(el, '.tog').click(); ok(calls.some((c) => c[0] === 'homeassistant' && c[1] === 'turn_off' && c[2].entity_id === 'light.living_room'), 'toggle room off');
  el = make('cranberry-room-card', { entity: 'light.bath' });
  ok(txt(el).includes('Off · 1 offline'), 'offline count: ' + txt(el).slice(-40));
  el = make('cranberry-room-card', { entity: 'switch.garden' });
  ok(txt(el).includes('On') && q(el, '.fill').style.width === '100%', 'switch room');

  // a person: home, away or a zone, since when; tap opens their pop-up
  const today1020 = new Date(); today1020.setHours(10, 20, 0, 0);
  states['person.liam'] = Object.assign(S('person.liam', 'home', { friendly_name: 'Liam Camps' }), { last_changed: today1020.toISOString() });
  el = make('cranberry-status-card', { entity: 'person.liam', popup: '#liam' });
  ok(q(el, '.name').textContent === 'Liam' && /^Home · since 10:20( AM)?$/.test(q(el, '.state').textContent) && q(el, 'ha-card').getAttribute('style').includes('--cc-o'), 'person home: ' + q(el, '.state').textContent);
  states['person.liam'] = Object.assign(S('person.liam', 'not_home', { friendly_name: 'Liam Camps' }), { last_changed: new Date(Date.now() - 2 * 86400000 - 3600000).toISOString() });
  el = make('cranberry-status-card', { entity: 'person.liam', popup: '#liam' });
  ok(/^Away · since \w+day$/.test(q(el, '.state').textContent) && q(el, 'ha-card').getAttribute('style').includes('--cc-q'), 'person away: ' + q(el, '.state').textContent);
  states['person.liam'] = Object.assign(S('person.liam', 'work', { friendly_name: 'Liam Camps' }), { last_changed: new Date(Date.now() - 86400000).toISOString() });
  el = make('cranberry-status-card', { entity: 'person.liam', popup: '#liam' });
  ok(q(el, '.state').textContent.indexOf('Work · since ') === 0, 'person in a zone: ' + q(el, '.state').textContent);
  // photo by default, icon on request, icon without a photo
  states['person.liam'] = Object.assign(S('person.liam', 'not_home', { friendly_name: 'Liam', entity_picture: '/api/image/serve/abc/512x512' }), { last_changed: new Date().toISOString() });
  el = make('cranberry-status-card', { entity: 'person.liam' });
  ok(q(el, '.ic.pic img') && q(el, '.ic.pic img').getAttribute('src') === '/api/image/serve/abc/512x512' && q(el, '.ic.pic.away'), 'photo by default, faded when away');
  el = make('cranberry-status-card', { entity: 'person.liam', show_picture: 'icon' });
  ok(!q(el, '.ic.pic') && q(el, '.ic ha-icon'), 'icon when asked');
  states['person.liam'] = S('person.liam', 'home', { friendly_name: 'Liam' });
  el = make('cranberry-status-card', { entity: 'person.liam' });
  ok(!q(el, '.ic.pic') && q(el, '.ic ha-icon'), 'icon without a photo');
  let navTo = null; el = make('cranberry-status-card', { entity: 'person.liam', popup: '#liam' }); el.navigate = (p) => { navTo = p; };
  q(el, '.txt').click();
  ok(navTo === '#liam', 'tap opens the pop-up');

  // people card: chips with photo, name and where; tap opens the pop-up
  states['person.liam'] = S('person.liam', 'home', { friendly_name: 'Liam Camps', entity_picture: '/img/liam' });
  states['person.mylou'] = S('person.mylou', 'work', { friendly_name: 'Mylou' });
  el = make('cranberry-people-card', { people: [{ entity: 'person.liam', popup: '#liam' }, 'person.mylou'] });
  const chips = [...el.shadowRoot.querySelectorAll('.chip')];
  ok(chips.length === 2 && !chips[0].querySelector('.where') && chips[1].querySelector('.where').textContent === 'Work', 'home: photo only; away: where');
  ok(chips[0].querySelector('img').getAttribute('src') === '/img/liam' && !chips[0].classList.contains('away') && chips[1].classList.contains('away') && chips[1].querySelector('.pic').textContent === 'M', 'photo, or the initial without one');
  ok(chips[0].getAttribute('aria-label') === 'Liam, Home', 'named for screen readers');
  let went = null, info = null; el.navigate = (p) => { went = p; }; el.addEventListener('hass-more-info', (e) => { info = e.detail.entityId; });
  chips[0].click(); chips[1].click();
  ok(went === '#liam' && info === 'person.mylou', 'tap: pop-up, or the details without one');
  el = make('cranberry-people-card', { people: ['person.liam'], show_picture: 'icon', title: 'Home' });
  ok(!q(el, 'img') && q(el, '.title').textContent === 'Home', 'icon on request, title');
  const ped = w.document.createElement('cranberry-people-card-editor'); let pcfg = null;
  ped.addEventListener('config-changed', (e) => { pcfg = e.detail.config; });
  ped.setConfig({ people: [{ entity: 'person.liam', popup: '#liam' }, 'person.mylou'] });
  ped.hass = hass(); w.document.body.appendChild(ped);
  ped.querySelector('ha-form').dispatchEvent(new w.CustomEvent('value-changed', { detail: { value: Object.assign({}, ped._config, { 'popup:person.mylou': '#mylou' }) } }));
  ok(JSON.stringify(pcfg.people) === JSON.stringify([{ entity: 'person.liam', popup: '#liam' }, { entity: 'person.mylou', popup: '#mylou' }]), 'editor: pop-up per person: ' + JSON.stringify(pcfg));

  // updates chip: admins only, installable updates only, opens Settings › Updates
  const U = (id, state, a) => S(id, state, Object.assign({ supported_features: 1 }, a));
  states['update.home_assistant_core_update'] = U('update.home_assistant_core_update', 'on', { friendly_name: 'Home Assistant Core Update', title: 'Home Assistant Core', installed_version: '2026.11.3', latest_version: '2026.12.0' });
  states['update.hue_lamp_firmware'] = U('update.hue_lamp_firmware', 'on', { friendly_name: 'Hue lamp Firmware', supported_features: 0, latest_version: '1.122' });
  states['update.zigbee2mqtt_update'] = U('update.zigbee2mqtt_update', 'off', { friendly_name: 'Zigbee2MQTT Update' });
  const admin = (isAdmin) => Object.assign(hass(), { user: { is_admin: isAdmin } });
  el = make('cranberry-people-card', { people: ['person.liam'], title: 'Home' });
  ok(!q(el, '.upd'), 'updates: nothing without a user');
  el.hass = admin(false); ok(!q(el, '.upd'), 'updates: not for someone who is not an admin');
  el.hass = admin(true);
  ok(q(el, '.upd') && q(el, '.upd .ul').textContent === 'Home Assistant Core 2026.12.0' && q(el, '.upd .us').textContent === '1', 'updates: one, by name (firmware that cannot install is left out): ' + (q(el, '.upd') || {}).textContent);
  ok(el.shadowRoot.querySelectorAll('.chip').length === 2 && q(el, '.chips').firstElementChild.classList.contains('upd'), 'updates: the chip comes first');
  let upTo = null; el.navigate = (p) => { upTo = p; }; q(el, '.upd').click();
  ok(upTo === '/config/updates', 'updates: tap opens Settings › Updates');
  states['update.zigbee2mqtt_update'] = U('update.zigbee2mqtt_update', 'on', { friendly_name: 'Zigbee2MQTT Update', latest_version: '2.7.0' });
  el.hass = admin(true); ok(q(el, '.upd .ul').textContent === '2 updates' && q(el, '.upd .us').textContent === '2', 'updates: several');
  states['update.zigbee2mqtt_update'] = U('update.zigbee2mqtt_update', 'on', { friendly_name: 'Zigbee2MQTT Update', in_progress: true, update_percentage: 45 });
  el.hass = admin(true); ok(q(el, '.upd .ul').textContent === 'Updating · 45%' && q(el, '.upd circle[stroke-dasharray]'), 'updates: installing, with a ring');
  el = make('cranberry-people-card', { people: ['person.liam'], updates: false }); el.hass = admin(true);
  ok(!q(el, '.upd'), 'updates: can be switched off');
  ['update.home_assistant_core_update', 'update.hue_lamp_firmware', 'update.zigbee2mqtt_update'].forEach((k) => { delete states[k]; });
  el = make('cranberry-people-card', { people: ['person.liam'] }); el.hass = admin(true);
  ok(!q(el, '.upd'), 'updates: no chip when there is nothing to install');

  // not responding: the same on every card
  states['light.gone'] = S('light.gone', 'unavailable', { friendly_name: 'Garage' });
  states['media_player.gone'] = S('media_player.gone', 'unavailable', {});
  states['person.gone'] = S('person.gone', 'unavailable', { friendly_name: 'Kim' });
  const naCards = [
    ['room', make('cranberry-room-card', { entity: 'light.gone', name: 'Garage' }), '.state'],
    ['status', make('cranberry-status-card', { entity: 'light.gone' }), '.state'],
    ['music', make('cranberry-media-card', { entity: 'media_player.gone', name: 'Kitchen' }), null],
    ['status, missing', make('cranberry-status-card', { entity: 'sensor.nothing_here' }), '.state']
  ];
  naCards.forEach(([n, card, sel]) => ok(q(card, 'ha-card').classList.contains('na') && card.shadowRoot.textContent.includes('Not responding') && (!sel || q(card, sel).textContent.includes('Not responding')), 'not responding: ' + n));
  const ppl = make('cranberry-people-card', { people: ['person.gone'] });
  ok(q(ppl, '.chip.na') && q(ppl, '.chip').getAttribute('aria-label') === 'Kim, Not responding', 'not responding: people chip');

  // room alert: an open door turns the card brick and says which
  states['binary_sensor.balcony_door'] = S('binary_sensor.balcony_door', 'on', { friendly_name: 'Balcony door', device_class: 'door' });
  states['lock.front'] = S('lock.front', 'locked', { friendly_name: 'Front door' });
  el = make('cranberry-room-card', { entity: 'light.living_room', name: 'Balcony', alerts: ['binary_sensor.balcony_door', 'lock.front'] });
  ok(q(el, 'ha-card').classList.contains('alert') && q(el, '.state').textContent === 'Balcony door open', 'room alert: ' + q(el, '.state').textContent);
  states['lock.front'] = S('lock.front', 'unlocked', { friendly_name: 'Front door' });
  el = make('cranberry-room-card', { entity: 'light.living_room', name: 'Balcony', alerts: ['binary_sensor.balcony_door', 'lock.front'] });
  ok(q(el, '.state').textContent === '2 things open', 'two alerts');
  states['binary_sensor.balcony_door'] = S('binary_sensor.balcony_door', 'off', { friendly_name: 'Balcony door' }); states['lock.front'] = S('lock.front', 'locked', { friendly_name: 'Front door' });
  el = make('cranberry-room-card', { entity: 'light.living_room', name: 'Balcony', alerts: ['binary_sensor.balcony_door', 'lock.front'] });
  ok(!q(el, 'ha-card').classList.contains('alert') && q(el, '.state').textContent.includes('of 3 on'), 'closed: normal room');

  // room extra button (Lego light)
  states['light.dining'] = S('light.dining', 'on', { entity_id: ['light.dl'] }); states['light.dl'] = S('light.dl', 'on', { brightness: 165 });
  states['input_boolean.lego_light'] = S('input_boolean.lego_light', 'off', { friendly_name: 'Lego light' });
  el = make('cranberry-room-card', { entity: 'light.dining', name: 'Dining room', button_entity: 'input_boolean.lego_light', button_icon: 'mdi:toy-brick-outline', popup: '#dining-room' });
  ok(q(el, '.extra') && q(el, '.extra').getAttribute('aria-pressed') === 'false' && txt(el).includes('On · 65%'), 'extra button off: ' + txt(el).slice(-40));
  q(el, '.extra').click(); ok(calls.some((c) => c[1] === 'toggle' && c[2].entity_id === 'input_boolean.lego_light'), 'extra toggles');
  ok(w.location.hash !== '#dining-room', 'extra does not open pop-up');
  states['input_boolean.lego_light'] = S('input_boolean.lego_light', 'on', { friendly_name: 'Lego light' }); el.hass = hass();
  ok(q(el, '.extra').getAttribute('aria-pressed') === 'true' && txt(el).includes('On · 65%') && !txt(el).includes('Lego light on'), 'extra on: the button shows it, the status stays the room’s: ' + txt(el).slice(-40));

  // in-place updates: same elements survive, so transitions can run; one action per tap
  {
    const r = make('cranberry-room-card', { entity: 'light.living_room', popup: '#living-room' });
    const fill1 = q(r, '.fill'), tog1 = q(r, '.tog');
    states['light.b'] = S('light.b', 'on', { brightness: 255 }); r.hass = hass();
    ok(q(r, '.fill') === fill1 && q(r, '.tog') === tog1, 'elements kept between updates');
    ok(fill1.style.width === '85%', 'fill width updated in place: ' + fill1.style.width);
    const before = calls.length; q(r, '.tog').click(); r.hass = hass(); q(r, '.tog').click();
    ok(calls.length - before === 2, 'exactly one action per tap after updates: ' + (calls.length - before));
    ok(r.shadowRoot.querySelector('style').textContent.includes('prefers-reduced-motion'), 'motion respects reduced-motion');
  }

  // scenes
  const ev = make('cranberry-scene-card', { entity: 'scene.evening' });
  const di = make('cranberry-scene-card', { entity: 'scene.dinner' });
  const ni = make('cranberry-scene-card', { entity: 'scene.night' });
  ok(q(ev, 'button').getAttribute('aria-pressed') === 'true', 'latest scene active');
  ok(q(di, 'button').getAttribute('aria-pressed') === 'false' && q(ni, 'button').getAttribute('aria-pressed') === 'false', 'others inactive');
  states['light.b'] = S('light.b', 'on', { brightness: 40 }, 60000); ev.hass = hass();
  ok(q(ev, 'button').getAttribute('aria-pressed') === 'false', 'inactive after a light changed');
  states['light.b'] = S('light.b', 'on', { brightness: 40 }, 20 * 60000 - 5000); ev.hass = hass();
  ok(q(ev, 'button').getAttribute('aria-pressed') === 'true', 'settle window');
  q(di, 'button').click(); ok(calls.some((c) => c[0] === 'scene' && c[2].entity_id === 'scene.dinner'), 'scene turn_on');
  states['input_select.mode'] = S('input_select.mode', 'Dinner', {});
  const di2 = make('cranberry-scene-card', { entity: 'scene.dinner', active_entity: 'input_select.mode' });
  ok(q(di2, 'button').getAttribute('aria-pressed') === 'true', 'helper override');

  // media
  el = make('cranberry-media-card', { entity: 'media_player.living_room', name: 'Living room' });
  ok(q(el, 'ha-card').className.includes('playing'), 'olive when playing');
  ok(txt(el).includes('Harvest Moon') && txt(el).includes('Neil Young · Living room'), 'title/artist');
  const ctl = [...el.shadowRoot.querySelectorAll('.ctl')].map((b) => b.getAttribute('aria-label'));
  ok(ctl.join() === 'Previous track,Pause,Next track', 'controls: ' + ctl);
  el.shadowRoot.querySelectorAll('.ctl')[2].click(); ok(calls.some((c) => c[1] === 'media_next_track'), 'next');
  states['media_player.living_room'] = S('media_player.living_room', 'off', {}); el.hass = hass();
  ok(txt(el).includes('Last played: Harvest Moon · Neil Young'), 'off: what played last: ' + txt(el));

  // editors
  w.customElements.define('ha-form', class extends w.HTMLElement {});
  const C = w.customElements.get('cranberry-status-card');
  const ed = C.getConfigElement(); w.document.body.appendChild(ed); ed.setConfig({ entity: 'lock.front_door' }); ed.hass = hass(); await wait(5);
  const f = ed.querySelector('ha-form'); ok(f && f.schema.some((s) => s.name === 'alarm'), 'status editor adapts to lock');
  let cfg; ed.addEventListener('config-changed', (e) => cfg = e.detail.config);
  f.dispatchEvent(new w.CustomEvent('value-changed', { detail: { value: { entity: 'alarm_control_panel.home', name: '' } } }));
  ok(cfg && !('name' in cfg), 'editor emits'); ok(f.schema.some((s) => s.name === 'modes'), 'schema follows entity');
  ok(w.customElements.get('cranberry-scene-card').getStubConfig(hass()).entity === 'scene.evening', 'stub');

  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
