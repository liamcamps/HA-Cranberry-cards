// The home card's lights chip and its menu
const { JSDOM } = require('jsdom');
const fs = require('fs');
const code = fs.readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window; w.eval(code);
const S = (id, state, attributes = {}) => ({ entity_id: id, state, attributes });
const calls = [];
const mk = (over = {}) => ({
  language: 'en', locale: { language: 'en' }, areas: { lr: { name: 'Living room' } }, devices: {},
  entities: { 'light.living_room': { area_id: 'lr' } },
  callService: (d, s, data) => calls.push([d, s, data]),
  connection: { subscribeMessage: () => Promise.resolve(() => {}) },
  states: Object.assign({
    'weather.home': S('weather.home', 'cloudy', { temperature: 8, friendly_name: 'Home' }),
    'light.living_room': S('light.living_room', 'on', { friendly_name: 'Living room lights', entity_id: ['light.ceiling', 'light.tv_lamp', 'light.sideboard'] }),
    'light.ceiling': S('light.ceiling', 'on', { friendly_name: 'Ceiling', brightness: 128 }),
    'light.tv_lamp': S('light.tv_lamp', 'on', { friendly_name: 'TV lamp' }),
    'light.sideboard': S('light.sideboard', 'off', { friendly_name: 'Sideboard' }),
    'switch.balcony': S('switch.balcony', 'on', { friendly_name: 'Balcony lights' }),
    'light.bedroom': S('light.bedroom', 'off', { friendly_name: 'Bedroom' })
  }, over)
});
const card = w.document.createElement('cranberry-home-card'); w.document.body.appendChild(card);
card.setConfig({ weather: 'weather.home', lights: ['light.living_room', 'switch.balcony', 'light.bedroom'], load_fonts: false });
const $ = (s) => card.shadowRoot.querySelector(s), $$ = (s) => [...card.shadowRoot.querySelectorAll(s)];
card.hass = mk();
const chip = $('.lamps');
ok(chip && chip.textContent.includes('Lights on in Living room and Balcony lights'), 'chip names where: ' + (chip && chip.textContent));
ok(chip.querySelector('.n').textContent.trim() === '3', 'chip counts the lights that are on (group members): ' + chip.querySelector('.n').textContent);
ok(!card.shadowRoot.querySelector('p').textContent.includes('Lights on'), 'the sentence no longer repeats the chip');
ok(!$('.menu') && chip.getAttribute('aria-expanded') === 'false', 'menu closed at first');
chip.click();
ok($('.menu') && $('.lamps').getAttribute('aria-expanded') === 'true', 'tap opens the menu');
ok($$('.mrow').length === 3, 'three rows: ceiling, TV lamp, balcony');
ok($$('.mlabel').map((x) => x.textContent.trim()).join() === 'Living room,', 'group label for the room, an empty one for a light without a group');
ok($('.mrow small') && $('.mrow small').textContent === '50%', 'brightness shown');
$$('.mbtn[data-off]')[1].click();
ok(JSON.stringify(calls.pop()) === JSON.stringify(['homeassistant', 'turn_off', { entity_id: 'light.tv_lamp' }]), 'row button turns that light off');
let more = null; card.addEventListener('hass-more-info', (e) => { more = e.detail.entityId; });
$('.mname').click();
ok(more === 'light.ceiling', 'tapping a name opens its details');
$('.alloff').click();
ok(JSON.stringify(calls.pop()) === JSON.stringify(['homeassistant', 'turn_off', { entity_id: ['light.living_room', 'switch.balcony'] }]), 'All off turns off what is on');
ok(!$('.menu'), 'All off closes the menu');
$('.lamps').click(); $('[data-close]').click();
ok(!$('.menu'), 'close button closes');
$('.lamps').click();
$('.menu').dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
ok(!$('.menu'), 'Escape closes');
$('.lamps').click();
card.hass = mk({ 'light.living_room': S('light.living_room', 'off', {}), 'switch.balcony': S('switch.balcony', 'off', {}) });
ok(!$('.menu') && !$('.lamps') && !card.shadowRoot.textContent.includes('All lights are off.'), 'menu and chip go when everything is off, no sentence');
card.setConfig({ weather: 'weather.home', lights: ['switch.balcony'], home_text: 'Welcome home.', load_fonts: false }); card.hass = mk();
ok(!$('.lamps'), 'no chip with a fixed home sentence');
console.log(pass + ' passed, ' + fail + ' failed'); process.exit(0);
