// Dutch: every text on the cards has a translation, and the cards speak Dutch only when Home Assistant does
const { JSDOM } = require('jsdom');
const fs = require('fs');
const code = fs.readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://ha.local/home' });
const w = dom.window; w.console.info = () => {}; w.eval(code);
const { NL, tr, isNl } = w.CranberryI18n;

// ---- every literal text the source asks to translate has Dutch, with the same {parts}
const dir = __dirname + '/../src/';
const src = ['home', 'cards'].flatMap((d) => fs.readdirSync(dir + d).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(dir + d + '/' + f, 'utf8'))).join('\n');
const keys = new Set();
const lit = /'((?:[^'\\\n]|\\.)*)'/g;
// the first argument of this.t( / tr(hass, / tr(this._hass, / T(
for (const m of src.matchAll(/(?:\bthis\.t\(|\btr\((?:hass|h|this\._hass),\s*|[^\w.]T\()/g)) {
  let i = m.index + m[0].length, depth = 0, arg = '';
  for (; i < src.length; i++) {
    const ch = src[i];
    if (ch === "'") { const e = src.indexOf("'", i + 1); let j = e; while (src[j - 1] === '\\') j = src.indexOf("'", j + 1); arg += src.slice(i, j + 1); i = j; continue; }
    if (ch === '(' || ch === '[' || ch === '{') depth++;
    if (ch === ')' || ch === ']' || ch === '}') { if (!depth) break; depth--; }
    if (ch === ',' && !depth) break;
    arg += ch;
  }
  // strings compared with === are values, not texts
  for (const s of arg.matchAll(lit)) { const k = s[1].replace(/\\'/g, "'"); if (k && !k.startsWith('@') && /[A-Za-z]/.test(k) && !/[!=]==\s*$/.test(arg.slice(0, s.index))) keys.add(k); }
}
// lookup tables whose values are translated where they are used
const table = (name) => { const s = src.indexOf('const ' + name + ' = {'); const e = src.indexOf('};', s); return [...src.slice(s, e).matchAll(/:\s*(?:\[[^'\]]*)?'((?:[^'\\]|\\.)*)'/g)].map((x) => x[1]); };
['PHASE_TEXT', 'HVAC_NAMES'].forEach((t) => table(t).forEach((k) => keys.add(k)));
[...src.slice(src.indexOf('const WASH_STEP'), src.indexOf('const PHASE_TEXT')).matchAll(/, '([^']+)'\]/g)].forEach((x) => keys.add(x[1]));
[...src.slice(src.indexOf('const ALARM_MODES'), src.indexOf('class CranberryStatusCard')).matchAll(/label: '([^']+)'/g)].forEach((x) => keys.add(x[1]));
[...src.slice(src.indexOf('const WARN_EN'), src.indexOf('const WARN_TRAVEL')).matchAll(/\['([^']+)', '([^']+)'\]/g)].forEach((x) => { keys.add(x[1] + '@warning'); keys.add(x[2]); });
[...src.slice(src.indexOf('const WARN_WORD'), src.indexOf('const END_KEYS')).matchAll(/: '([^']+)'/g)].forEach((x) => keys.add(x[1] + '@warning'));
[...src.slice(src.indexOf('const WASTE_TYPES'), src.indexOf('const WASTE_SKIP')).matchAll(/\['[a-z]+', '([^']+)'/g)].forEach((x) => keys.add(x[1]));
// editor labels, helpers, section titles and choices
const ed = fs.readFileSync(dir + 'home/40-editor.js', 'utf8') + fs.readFileSync(dir + 'cards/90-editors.js', 'utf8');
[...ed.matchAll(/(?:label|title):\s*'((?:[^'\\]|\\.)*)'/g)].forEach((x) => keys.add(x[1].replace(/\\'/g, "'")));
for (const b of ed.matchAll(/(?:LABELS|HELPERS|labels|helpers)\s*[:=]\s*\{/g)) {
  let i = b.index + b[0].length, d = 1; const s = i; while (d) { if (ed[i] === '{') d++; else if (ed[i] === '}') d--; i++; }
  [...ed.slice(s, i).matchAll(/:\s*'((?:[^'\\]|\\.)*)'/g)].forEach((x) => keys.add(x[1].replace(/\\'/g, "'")));
}
const missing = [...keys].filter((k) => NL[k] == null);
ok(keys.size > 400, 'found the texts: ' + keys.size);
ok(!missing.length, 'Dutch for every text, missing: ' + missing.slice(0, 20).join(' | '));
const parts = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((x) => x[1]).sort().join(',');
const bad = Object.keys(NL).filter((k) => parts(k) !== parts(NL[k]));
ok(!bad.length, 'the same {parts} in Dutch: ' + bad.join(' | '));
const unused = Object.keys(NL).filter((k) => !keys.has(k));
ok(unused.length < 15, 'few unused Dutch texts: ' + unused.join(' | '));
if (process.env.SHOW) console.log(keys.size, 'texts; unused:', unused);

// ---- the switch itself
ok(isNl({ language: 'nl' }) && isNl({ locale: { language: 'nl-BE' } }) && !isNl({ language: 'en' }) && !isNl({ language: 'nb' }) && !isNl(null), 'Dutch only for nl and nl-*');
ok(isNl({ language: 'en', locale: { language: 'nl' } }), 'the profile language wins');
ok(tr({ language: 'en' }, 'Heating to {target} · {now}', { target: '21°', now: '20°' }) === 'Heating to 21° · 20°', 'English fills in');
ok(tr({ language: 'nl' }, 'Heating to {target} · {now}', { target: '21°', now: '20°' }) === 'Verwarmt naar 21° · 20°', 'Dutch fills in');
ok(tr({ language: 'en' }, 'Heat@warning') === 'Heat' && tr({ language: 'nl' }, 'Heat@warning') === 'Hitte' && tr({ language: 'nl' }, 'Heat') === 'Verwarmen', 'tags keep two meanings apart');
ok(tr({ language: 'de' }, 'Not responding') === 'Not responding', 'other languages stay English');

// ---- real cards
const now = Date.now();
const S = (id, state, attributes = {}, ago = 3600000) => ({ entity_id: id, state: String(state), attributes, last_changed: new Date(now - ago).toISOString(), last_updated: new Date(now - ago).toISOString() });
const states = {};
[S('climate.living', 'heat', { friendly_name: 'Living room', temperature: 21, current_temperature: 19.5, hvac_action: 'heating', hvac_modes: ['off', 'heat'], supported_features: 1, min_temp: 7, max_temp: 30, target_temp_step: 0.5 }),
 S('zone.home', '1', { persons: ['person.anna', 'person.bram'] }), S('person.anna', 'home', { friendly_name: 'Anna' }), S('person.bram', 'not_home', { friendly_name: 'Bram' }),
 S('light.room', 'on', { friendly_name: 'Room', entity_id: ['light.a', 'light.b', 'light.c'] }), S('light.a', 'on', {}), S('light.b', 'on', {}), S('light.c', 'off', {}),
 S('media_player.x', 'off', { friendly_name: 'Speaker' }), S('lock.front', 'unavailable', { friendly_name: 'Front door' }),
 S('weather.home', 'cloudy', { temperature: 9, temperature_unit: '°C' })].forEach((s) => { states[s.entity_id] = s; });
const H = (lang) => ({ states, language: lang, locale: { language: lang }, entities: {}, devices: {}, areas: {}, config: { unit_system: { temperature: '°C' } }, callService: () => Promise.resolve(), callWS: () => Promise.resolve({}), callApi: () => Promise.resolve([]), connection: { subscribeMessage: () => Promise.resolve(() => {}) }, formatEntityState: (st) => st.state });
const card = (tag, cfg, lang) => { const el = w.document.createElement(tag); el.setConfig(cfg); w.document.body.appendChild(el); el.hass = H(lang); const t = el.shadowRoot.textContent.replace(/\s+/g, ' '); el.remove(); return t; };
let t = card('cranberry-status-card', { entity: 'climate.living' }, 'nl'); ok(t.includes('Verwarmt naar 21') && t.includes('19,5'), 'status, Dutch: ' + t.trim());
t = card('cranberry-status-card', { entity: 'climate.living' }, 'en'); ok(t.includes('Heating to 21'), 'status, English: ' + t.trim());
t = card('cranberry-status-card', { entity: 'zone.home' }, 'nl'); ok(t.includes('Anna thuis · Bram weg'), 'who is home, Dutch: ' + t.trim());
t = card('cranberry-status-card', { entity: 'lock.front' }, 'nl'); ok(t.includes('Reageert niet'), 'not responding, Dutch: ' + t.trim());
t = card('cranberry-room-card', { entity: 'light.room' }, 'nl'); ok(t.includes('2 van 3 aan'), 'room, Dutch: ' + t.trim());
t = card('cranberry-room-card', { entity: 'light.room' }, 'en'); ok(t.includes('2 of 3 on'), 'room, English: ' + t.trim());
t = card('cranberry-media-card', { entity: 'media_player.x' }, 'nl'); ok(t.includes('Er speelt niets'), 'music, Dutch: ' + t.trim());
t = card('cranberry-thermostat-card', { entity: 'climate.living' }, 'nl'); ok(t.includes('Verwarmt vanaf 19,5°') && t.includes('Uit'), 'thermostat, Dutch: ' + t.trim());
t = card('cranberry-people-card', { people: ['person.anna', 'person.bram'] }, 'nl'); ok(t.includes('Weg') && !t.includes('Away'), 'people, Dutch: ' + t.trim());
t = card('cranberry-calendar-card', { entities: [] }, 'nl'); ok(t.includes('Kies een of meer agenda’s'), 'calendar, Dutch: ' + t.trim());
t = card('cranberry-waste-card', {}, 'nl'); ok(t.includes('Geen Afvalwijzer-sensoren gevonden'), 'waste, Dutch: ' + t.trim());
t = card('cranberry-car-card', { entity: 'input_select.none' }, 'nl'); ok(t.includes('Waar staat hij geparkeerd?'), 'car, Dutch: ' + t.trim());
t = card('cranberry-home-card', { weather: 'weather.home', lights: ['light.a'] }, 'nl'); ok(t.includes('Alles rustig.') || t.includes('Lampen aan'), 'home, Dutch: ' + t.trim().slice(0, 160));
t = card('cranberry-home-card', { weather: 'weather.home', lights: ['light.a'] }, 'en'); ok(!/Alles|Lampen/.test(t), 'home, English: ' + t.trim().slice(0, 160));

// ---- editors follow the language too
const ed2 = w.document.createElement('cranberry-room-card-editor');
if (w.customElements.get('cranberry-room-card-editor')) {
  ed2.setConfig({ entity: 'light.room' }); ed2.hass = H('nl'); w.document.body.appendChild(ed2);
  const f = ed2.querySelector('ha-form');
  ok(f && f.computeLabel({ name: 'name' }) === 'Naam', 'editor label in Dutch');
  ed2.hass = H('en'); ok(f && f.computeLabel({ name: 'name' }) === 'Name', 'editor label in English');
} else ok(false, 'room editor registered');

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
