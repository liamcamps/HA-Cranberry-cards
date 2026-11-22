const { JSDOM } = require('jsdom');
const fs = require('fs');
const code = fs.readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window; w.eval(code);
const calls = []; let mapCfg = null;
w.loadCardHelpers = async () => ({ createCardElement: (cfg) => { mapCfg = cfg; const el = w.document.createElement('div'); el.className = 'fake-map'; return el; } });
const opened = []; w.open = (u) => opened.push(u);
const S = (id, state, attributes = {}) => ({ entity_id: id, state, attributes });
const mk = (place, extra = {}) => ({
  language: 'en', locale: { language: 'en' }, entities: {}, callService: (d, s, data) => calls.push([d, s, data]),
  states: Object.assign({
    'input_select.parking_location': S('input_select.parking_location', place, { options: ['Home', 'Garage', 'Elsewhere'] }),
    'input_select.parking_layer': S('input_select.parking_layer', 'P2', { options: ['P1', 'P2', 'P3', 'Roof'] }),
    'input_select.parking_zone': S('input_select.parking_zone', 'C', { options: ['A', 'B', 'C', 'D', 'E'] }),
    'input_text.parking_note': S('input_text.parking_note', 'Main Street 12'),
    'sensor.car_parked_spot': S('sensor.car_parked_spot', 'Main Street 12', { latitude: 10.5, longitude: 20.25 })
  }, extra)
});
const cfg = { entity: 'input_select.parking_location', layer: 'input_select.parking_layer', zone: 'input_select.parking_zone', note: 'input_text.parking_note', spot: 'sensor.car_parked_spot' };
const card = w.document.createElement('cranberry-car-card'); w.document.body.appendChild(card);
card.setConfig(cfg);
const $ = (s) => card.shadowRoot.querySelector(s), $$ = (s) => [...card.shadowRoot.querySelectorAll(s)];
(async () => {
  card.hass = mk('Garage');
  ok($('.state').textContent === 'Parked at Garage · P2 · zone C', 'garage summary: ' + $('.state').textContent);
  ok($$('.chip').length === 3 + 4 + 5, 'place, layer and zone chips');
  ok($$('.chip[aria-pressed="true"]').map((b) => b.textContent).join() === 'Garage,P2,C', 'selected chips');
  ok(!$('input.note') && !$('.mapwrap'), 'no note or map at the garage');
  $$('.chip').find((b) => b.textContent === 'Roof').click();
  ok(JSON.stringify(calls.pop()) === JSON.stringify(['input_select', 'select_option', { entity_id: 'input_select.parking_layer', option: 'Roof' }]), 'layer chip selects');
  $$('.chip').find((b) => b.textContent === 'E').click();
  ok(calls.pop()[2].option === 'E', 'zone chip selects');
  $$('.chip').find((b) => b.textContent === 'Elsewhere').click();
  ok(calls.pop()[2].option === 'Elsewhere', 'place chip selects');

  card.hass = mk('Elsewhere');
  ok($('.state').textContent === 'Parked at Main Street 12', 'elsewhere summary uses the note');
  ok($$('.chip').length === 3, 'only place chips elsewhere');
  ok($('input.note').value === 'Main Street 12', 'note filled');
  await new Promise((r) => setTimeout(r, 20));
  ok($('.map .fake-map') && mapCfg.entities[0].entity === 'sensor.car_parked_spot' && mapCfg.map_style === 'muted', 'map mounted from the spot');
  const mapEl = $('.map .fake-map');
  card.hass = mk('Elsewhere', { 'input_text.parking_note': S('input_text.parking_note', 'Main Street 14') });
  ok($('.map .fake-map') === mapEl, 'map survives updates');
  ok($('input.note').value === 'Main Street 14', 'note follows the entity when not editing');
  $('input.note').value = 'Level 2, near the lift';
  $('input.note').dispatchEvent(new w.Event('change'));
  ok(JSON.stringify(calls.pop()) === JSON.stringify(['input_text', 'set_value', { entity_id: 'input_text.parking_note', value: 'Level 2, near the lift' }]), 'note saves on change');
  $('input.note').click();
  ok(calls.length === 0, 'clicking the field does not save');
  $('.mapbtn').click();
  ok(opened.pop() === 'https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=10.5,20.25', 'directions open');

  card.hass = mk('Elsewhere', { 'sensor.car_parked_spot': S('sensor.car_parked_spot', 'unavailable', {}) });
  ok(!$('.mapwrap') && $('.nomap'), 'no map without a location');
  card.hass = mk('Home');
  ok($('.state').textContent === 'Parked at Home' && !$('.nomap') && !$('input.note'), 'home is just a place');
  card.hass = mk('Elsewhere');
  await new Promise((r) => setTimeout(r, 20));
  ok($('.map .fake-map') === mapEl, 'same map is reused when it comes back');
  console.log(pass + ' passed, ' + fail + ' failed'); process.exit(0);
})();
