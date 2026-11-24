// Cranberry weather card: Hours and Days
const { JSDOM } = require('jsdom');
const fs = require('fs');
const code = fs.readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://ha.local/' });
const w = dom.window; w.eval(code);

// from now: rain in the 5th and 6th hour
const base = new Date();
const at = (hh, dd = 0) => { const d = new Date(base); d.setDate(d.getDate() + dd); d.setHours(hh, 0, 0, 0); return d; };
const hourly = [];
for (let i = 1; i <= 24; i++) {
  const d = new Date(base.getTime() + i * 3600000); d.setMinutes(0, 0, 0);
  const wet = i === 5 || i === 6;
  hourly.push({ datetime: d.toISOString(), condition: wet ? 'rainy' : 'cloudy', temperature: 9 - i * 0.2, precipitation: wet ? 0.8 : 0, wind_speed: 18 });
}
const daily = [
  { datetime: at(0).toISOString(), condition: 'rainy', temperature: 10, templow: 4, precipitation: 1.2, precipitation_probability: 60 },
  { datetime: at(0, 1).toISOString(), condition: 'partlycloudy', temperature: 8, templow: 3, precipitation_probability: 20 },
  { datetime: at(0, 2).toISOString(), condition: 'sunny', temperature: 7, templow: 1, precipitation_probability: 0 },
  { datetime: at(0, 3).toISOString(), condition: 'pouring', temperature: 11, templow: 5, precipitation_probability: 80 }
];
const subs = [];
const states = {
  'weather.home': { entity_id: 'weather.home', state: 'partlycloudy', attributes: { temperature: 9.2, apparent_temperature: 6, humidity: 82, wind_speed: 18, wind_bearing: 225, wind_speed_unit: 'km/h', supported_features: 3 } },
  'sun.sun': { entity_id: 'sun.sun', state: 'above_horizon', attributes: { next_setting: at(16).toISOString().replace(/T16:00/, 'T16:35'), next_rising: at(8, 1).toISOString() } }
};
const setAt = new Date(base.getTime() + 2 * 3600000); setAt.setMinutes(35, 0, 0);
states['sun.sun'].attributes.next_setting = setAt.toISOString();
states['sun.sun'].attributes.next_rising = new Date(setAt.getTime() + 15 * 3600000).toISOString();
const hhmm = (d) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
const wetAt = hhmm(new Date(hourly[4].datetime));
const hass = (lang = 'en') => ({ states, language: lang, locale: { language: lang, time_format: '24' }, entities: {},
  formatEntityState: (st) => ({ partlycloudy: 'Partly cloudy' })[st.state] || st.state,
  connection: { subscribeMessage: (cb, msg) => { subs.push(msg); setTimeout(() => cb({ forecast: msg.forecast_type === 'hourly' ? hourly : daily }), 0); return Promise.resolve(() => {}); } } });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const make = (cfg, lang) => { const el = w.document.createElement('cranberry-weather-card'); w.document.body.appendChild(el); el.setConfig(Object.assign({ entity: 'weather.home', load_fonts: false }, cfg)); el.hass = hass(lang); return el; };
const q = (el, s) => el.shadowRoot.querySelector(s), qa = (el, s) => [...el.shadowRoot.querySelectorAll(s)];
const txt = (el, s) => (q(el, s) || {}).textContent || '';

(async () => {
  // a clean start: no remembered view
  try { w.localStorage.clear(); } catch (e) { /* */ }
  const el = make({});
  await wait(20);
  ok(subs.some((s) => s.forecast_type === 'hourly') && subs.some((s) => s.forecast_type === 'daily'), 'subscribes to hourly and daily');
  ok(txt(el, '.big') === '9°' && txt(el, '.cond b') === 'Partly cloudy', 'the top: temperature and condition: ' + txt(el, '.top'));
  ok(txt(el, '.cond span') === 'Feels like 6° · max 10°', 'feels like and today’s max: ' + txt(el, '.cond span'));
  ok(q(el, '.seg button[data-arg="hours"]').getAttribute('aria-pressed') === 'true', 'opens on Hours');
  ok(txt(el, '.say') === 'Dry until about ' + wetAt + ', then rain for about 2 hours.', 'hours sentence: ' + txt(el, '.say'));
  const stats = qa(el, '.stat').map((s) => s.textContent);
  ok(stats[0] === 'WindSW 18 km/h' && stats[1] === 'Rain1.2 mm' && stats[2] === 'Sunset' + hhmm(setAt) && stats[3] === 'Humidity82%', 'stats: ' + stats.join(' | '));
  const hrs = qa(el, '.h');
  ok(hrs.length === 25 && hrs[0].querySelector('small').textContent === 'Now' && q(el, '.strip.scrollrow'), 'strip: now and 24 hours, scrolls sideways: ' + hrs.length);
  ok(hrs.some((x) => x.classList.contains('day')), 'midnight shows the day');
  const wetBars = hrs.filter((x) => parseInt(x.querySelector('.rb span').style.height, 10) > 0);
  ok(wetBars.length === 2, 'rain bars for the two wet hours: ' + wetBars.length);
  ok(hrs[5].querySelector('svg').classList.contains('wet') && !hrs[1].querySelector('svg').classList.contains('wet'), 'a wet hour has a blue icon');

  // Days
  q(el, '.seg button[data-arg="days"]').click();
  ok(q(el, '.seg button[data-arg="days"]').getAttribute('aria-pressed') === 'true' && qa(el, '.d').length === 4, 'switches to Days');
  ok(w.localStorage.getItem('cranberry-weather-view:weather.home') === 'days', 'remembers the view');
  const thirdDay = new w.Intl.DateTimeFormat('en', { weekday: 'long' }).format(at(12, 2));
  ok(txt(el, '.say').startsWith(thirdDay + ' looks best: dry, up to 7°.'), 'days sentence: ' + txt(el, '.say'));
  ok(/brings the most rain\./.test(txt(el, '.say')), 'and the wettest day: ' + txt(el, '.say'));
  const d0 = q(el, '.d');
  ok(d0.classList.contains('today') && d0.querySelector('.dn').textContent === 'Today' && d0.querySelector('.rn').textContent === '60%' && d0.querySelector('.bar i'), 'today: bold, rain chance, a dot for now');
  ok(qa(el, '.d')[2].querySelector('.rn').textContent === '', 'a dry day shows no rain figure');
  const el2 = make({});
  await wait(20);
  ok(q(el2, '.seg button[data-arg="days"]').getAttribute('aria-pressed') === 'true', 'a new card opens on the remembered view');

  // Dutch
  w.localStorage.clear();
  const nl = make({}, 'nl');
  await wait(20);
  ok(txt(nl, '.say') === 'Droog tot ongeveer ' + wetAt + ', dan zo’n 2 uur regen.' && txt(nl, '.seg').includes('Uren') && qa(nl, '.stat')[0].textContent === 'WindZW 18 km/h', 'Dutch: ' + txt(nl, '.say'));

  // no switch without a daily forecast; not responding
  states['weather.home'].attributes.supported_features = 2;
  const only = make({});
  await wait(20);
  ok(!q(only, '.seg') && q(only, '.strip'), 'no daily forecast: no switch, just hours');
  states['weather.home'] = Object.assign({}, states['weather.home'], { state: 'unavailable' });
  const na = make({});
  ok(q(na, 'ha-card.na') && txt(na, '.empty') === 'Not responding', 'not responding');

  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
