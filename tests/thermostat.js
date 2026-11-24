// Cranberry thermostat (statement) card
const { JSDOM } = require('jsdom');
const fs = require('fs');
const code = fs.readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window; w.eval(code);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const calls = [];
let history = null;
const F = { TARGET: 1, RANGE: 2, HUMIDITY: 4, FAN: 8, PRESET: 16, SWING: 32 };
const climate = (state, a) => ({ entity_id: 'climate.living_room', state, attributes: Object.assign({ friendly_name: 'Living room', hvac_modes: ['off', 'heat', 'auto'], min_temp: 7, max_temp: 35, target_temp_step: 0.5 }, a) });
const hass = (st) => ({
  language: 'en', locale: { language: 'en' }, entities: {}, config: { unit_system: { temperature: '°C' } },
  states: { 'climate.living_room': st },
  callService: (d, s, data) => calls.push([d, s, data]),
  callWS: async () => history || {}
});
const card = w.document.createElement('cranberry-thermostat-card'); w.document.body.appendChild(card);
card.setConfig({ entity: 'climate.living_room', name: 'Living room' });
const $ = (s) => card.shadowRoot.querySelector(s), $$ = (s) => [...card.shadowRoot.querySelectorAll(s)];
const bg = () => $('ha-card').getAttribute('style');
const say = () => $('.say').textContent;

(async () => {
  // heating, with the warm-up rate from history
  const now = Date.now();
  history = { 'climate.living_room': [
    { lu: (now - 90 * 60000) / 1000, a: { current_temperature: 18.0, hvac_action: 'idle' } },
    { lu: (now - 40 * 60000) / 1000, a: { current_temperature: 18.2, hvac_action: 'heating' } },
    { lu: (now - 1 * 60000) / 1000, a: { current_temperature: 19.4, hvac_action: 'heating' } }] };
  card.hass = hass(climate('heat', { supported_features: F.TARGET | F.PRESET, temperature: 21, current_temperature: 19.4, current_humidity: 48, hvac_action: 'heating', preset_mode: 'comfort', preset_modes: ['none', 'eco', 'comfort', 'away'] }));
  await wait(20);
  ok(/var\(--cv-fill-o\)/.test(bg()), 'heating is olive');
  ok($('.one .lbl').textContent === 'Heat to' && $('.one .big').textContent === '21°', 'big target');
  ok(/^Heating from 19\.4°\. Warm in about 5[0-9] minutes\.$/.test(say()), 'sentence with eta from history: ' + say());
  ok($('.meta').textContent === '48% humidity', 'humidity meta');
  ok($('.top .chip').textContent.trim() === 'Comfort', 'preset chip');
  ok($$('.mode').map((b) => b.textContent).join() === 'Off,Heat,Auto' && $('.mode[aria-pressed="true"]').textContent === 'Heat', 'modes');
  $$('.step')[0].click(); $$('.step')[0].click();
  ok($('.one .big').textContent === '22°', 'plus shows at once');
  await wait(800);
  ok(JSON.stringify(calls.pop()) === JSON.stringify(['climate', 'set_temperature', { entity_id: 'climate.living_room', temperature: 22 }]), 'two taps, one call');
  $('.top .chip').click();
  ok($('.menu') && $$('.opt').length === 4 && $('.opt[aria-selected="true"]').textContent.trim() === 'Comfort', 'preset menu');
  $$('.opt')[1].click();
  ok(JSON.stringify(calls.pop()) === JSON.stringify(['climate', 'set_preset_mode', { entity_id: 'climate.living_room', preset_mode: 'eco' }]) && !$('.menu'), 'pick a preset');
  $('.mode').click();
  ok(calls.pop()[2].hvac_mode === 'off', 'mode tap');

  // holding with eco
  card.hass = hass(climate('heat', { supported_features: F.TARGET | F.PRESET, temperature: 17, current_temperature: 18.4, hvac_action: 'idle', preset_mode: 'eco', preset_modes: ['none', 'eco'] }));
  ok(/var\(--cv-fill-ember\)/.test(bg()) && say() === 'Eco: holding at 17°. It’s 18.4° now.', 'eco holding: ' + say());

  // cooling with fan and swing chips; fan menu
  card.hass = hass(climate('cool', { hvac_modes: ['off', 'heat', 'cool', 'heat_cool', 'auto', 'dry', 'fan_only'], supported_features: F.TARGET | F.FAN | F.SWING, temperature: 23, current_temperature: 25.6, hvac_action: 'cooling', fan_mode: 'auto', fan_modes: ['auto', 'low', 'high'], swing_mode: 'vertical', swing_modes: ['off', 'vertical'] }));
  ok(/var\(--cv-fill-h\)/.test(bg()) && /^Cooling from 25\.6°\./.test(say()), 'cooling slate');
  ok($$('.chips .chip').map((x) => x.textContent.trim()).join('|') === 'FanAuto|SwingVertical', 'fan and swing chips');
  ok($$('.mode').length === 7 && $$('.mode')[3].textContent === 'Heat/cool', 'all seven modes');
  $$('.chips .chip')[0].click(); $$('.opt')[2].click();
  ok(JSON.stringify(calls.pop()) === JSON.stringify(['climate', 'set_fan_mode', { entity_id: 'climate.living_room', fan_mode: 'high' }]), 'fan menu');
  $$('.chips .chip')[1].click();
  $('.menu').dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
  ok(!$('.menu'), 'Escape closes');

  // heat/cool: two rows, active one full, the other faded
  const dual = (cur, act) => climate('heat_cool', { hvac_modes: ['off', 'heat_cool'], supported_features: F.RANGE, target_temp_low: 19, target_temp_high: 24, current_temperature: cur, hvac_action: act });
  card.hass = hass(dual(22, 'idle'));
  ok($$('.row').length === 2 && $$('.row .lbl').map((x) => x.textContent).join() === 'Heat below,Cool above', 'two rows');
  ok(/var\(--cv-fill-ember\)/.test(bg()) && say() === '22° now: comfortable, so it’s resting.', 'comfortable');
  ok($$('.row').every((r) => r.getAttribute('style').includes('opacity:1')), 'both rows full at rest');
  card.hass = hass(dual(17.8, 'heating'));
  ok(/var\(--cv-fill-o\)/.test(bg()) && /^17\.8° now, below 19°\. Heating up(, warm in about \d+ minutes)?\.$/.test(say()) && $$('.row')[1].getAttribute('style').includes('0.5'), 'heating: cool row faded');
  card.hass = hass(dual(26.1, 'cooling'));
  ok(/var\(--cv-fill-h\)/.test(bg()) && say() === '26.1° now, above 24°. Cooling down.' && $$('.row')[0].getAttribute('style').includes('0.5'), 'cooling: heat row faded');
  $$('.row .step')[1].click();
  await wait(800);
  ok(JSON.stringify(calls.pop()) === JSON.stringify(['climate', 'set_temperature', { entity_id: 'climate.living_room', target_temp_low: 19.5, target_temp_high: 24 }]), 'raise heat point sends both');
  card.hass = hass(climate('heat_cool', { hvac_modes: ['off', 'heat_cool'], supported_features: F.RANGE, target_temp_low: 23, target_temp_high: 24, current_temperature: 23.5, hvac_action: 'idle' }));
  $$('.row .step')[1].click();
  ok($$('.row .big')[0].textContent === '23°', 'heat point stays 1° under cool');
  await wait(800); calls.length = 0;

  // dry: humidity to dry to
  card.hass = hass(climate('dry', { hvac_modes: ['off', 'dry'], supported_features: F.HUMIDITY, current_temperature: 24.1, current_humidity: 62, humidity: 50, hvac_action: 'drying' }));
  ok(/var\(--cv-fill-ochre\)/.test(bg()) && $('.one .big').textContent === '50%' && $('.one .lbl').textContent === 'Dry to', 'dry big humidity');
  ok(say() === 'Drying the air: 62% now, down to 50%.', 'dry sentence');
  $$('.step')[1].click(); await wait(800);
  ok(JSON.stringify(calls.pop()) === JSON.stringify(['climate', 'set_humidity', { entity_id: 'climate.living_room', humidity: 45 }]), 'dry minus 5%');

  // fan only: speed is the big word
  card.hass = hass(climate('fan_only', { hvac_modes: ['off', 'fan_only'], supported_features: F.FAN, current_temperature: 24.8, fan_mode: 'medium', fan_modes: ['low', 'medium', 'high'] }));
  ok(/var\(--cv-fill-q\)/.test(bg()) && $('.one .big').textContent === 'Medium' && !$('.chips'), 'fan only');
  $$('.step')[0].click();
  ok(calls.pop()[2].fan_mode === 'high', 'faster');

  // off and unavailable
  card.hass = hass(climate('off', { current_temperature: 18.2, temperature: 15 }));
  ok(/var\(--cv-fill-q\)/.test(bg()) && $('.one .big').textContent === 'off' || $('.one .big').textContent === 'Off', 'off big: ' + $('.one .big').textContent);
  ok(say() === 'Off. It’s 18.2° in the living room.' && !$('.step'), 'off sentence, no steps');
  card.hass = hass(climate('unavailable', {}));
  ok($('ha-card').classList.contains('na') && $('.one .big').textContent === '—' && /isn’t responding/.test(say()), 'unavailable');
  ok($$('.mode').every((b) => b.disabled), 'modes disabled when unavailable');

  // auto: colour follows the device
  card.hass = hass(climate('auto', { hvac_modes: ['off', 'heat', 'auto'], supported_features: F.TARGET, temperature: 21, current_temperature: 19.6, hvac_action: 'heating' }));
  ok(/var\(--cv-fill-o\)/.test(bg()) && $('.one .lbl').textContent === 'Around' && /auto keeps it around 21°/.test(say()), 'auto: ' + say());

  // options: hide modes, limit modes, no eta
  card.setConfig({ entity: 'climate.living_room', show_eta: false, modes: ['heat', 'off'] });
  card.hass = hass(climate('heat', { supported_features: F.TARGET, temperature: 21, current_temperature: 19.4, hvac_action: 'heating' }));
  ok(say() === 'Heating from 19.4°.', 'no eta when switched off');
  ok($$('.mode').map((b) => b.textContent).join() === 'Heat,Off', 'chosen modes, in that order');
  card.setConfig({ entity: 'climate.living_room', show_modes: false }); card.hass = hass(climate('heat', { temperature: 21, current_temperature: 21 }));
  ok(!$('.modes'), 'modes hidden');

  // compact size
  card.setConfig({ entity: 'climate.living_room', name: 'Living room', size: 'compact', popup: '#living-room' });
  card._rate = { act: 'heating', perMin: 1.6 / 42 };
  card.hass = hass(climate('heat', { supported_features: F.TARGET | F.PRESET | F.FAN, temperature: 21, current_temperature: 19.4, hvac_action: 'heating', preset_mode: 'eco', preset_modes: ['none', 'eco'], fan_mode: 'auto', fan_modes: ['auto', 'high'] }));
  ok($('ha-card').classList.contains('compact') && /var\(--cv-fill-o\)/.test(bg()), 'compact heating olive');
  ok($('.line .lbl').textContent === 'Heat to' && $('.line .big').textContent === '21°' && $('.line .big').style.fontSize === '48px', 'compact setpoint');
  ok(/^Heating from 19\.4°\. Warm in ~[0-9]+ min\.$/.test($('.short').textContent), 'compact sentence: ' + $('.short').textContent);
  ok($('.tag').textContent === 'Eco' && !$('.modes') && !$('.chips') && !$('.say'), 'compact: preset tag, no modes, chips or long sentence');
  ok($$('.line .step').map((b) => b.getAttribute('aria-label')).join() === 'Lower,Raise', 'compact minus then plus');
  $$('.line .step')[1].click(); ok($('.line .big').textContent === '21.5°', 'compact plus');
  await wait(800); ok(calls.pop()[2].temperature === 21.5, 'compact sends');
  let nav = null; const realNav = card.navigate; card.navigate = (p) => { nav = p; };
  $('.room').click();
  ok(nav === '#living-room', 'room name opens the pop-up');
  card.navigate = realNav;
  card.hass = hass(climate('heat_cool', { hvac_modes: ['off', 'heat_cool'], supported_features: F.RANGE, target_temp_low: 19, target_temp_high: 24, current_temperature: 17.8, hvac_action: 'heating' }));
  ok($$('.mini').length === 2 && $$('.mini .lbl').map((x) => x.textContent).join() === 'Heat,Cool' && $$('.mini')[1].style.opacity === '0.5', 'compact heat/cool rows');
  ok($('.short').textContent === '17.8° now. Heating up.' && !$('.line > .steps'), 'compact heat/cool sentence');
  $$('.mini')[0].querySelectorAll('.step')[1].click(); await wait(800);
  ok(JSON.stringify(calls.pop()[2]) === JSON.stringify({ entity_id: 'climate.living_room', target_temp_low: 19.5, target_temp_high: 24 }), 'compact heat point');
  card.hass = hass(climate('off', { current_temperature: 18.2 }));
  ok($('.short').textContent === 'It’s 18.2° in the room.' && $('.on') && !$('.line .step'), 'compact off');
  $('.on').click(); ok(JSON.stringify(calls.pop()) === JSON.stringify(['climate', 'turn_on', { entity_id: 'climate.living_room' }]), 'turn on');
  card.hass = hass(climate('fan_only', { hvac_modes: ['off', 'fan_only'], supported_features: F.FAN, current_temperature: 24.8, fan_mode: 'medium', fan_modes: ['low', 'medium', 'high'] }));
  ok($('.line .big').style.fontSize === '34px' && $$('.line .step').map((b) => b.getAttribute('aria-label')).join() === 'Slower,Faster', 'compact fan');
  card.hass = hass(climate('unavailable', {}));
  ok($('.short').textContent === 'Not responding.' && /opacity:\s*\.6/.test(bg()), 'compact unavailable');

  console.log(pass + ' passed, ' + fail + ' failed'); process.exit(0);
})();
