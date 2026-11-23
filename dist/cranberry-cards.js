/*
 * Cranberry home card for Home Assistant
 * One card that combines the time, what needs attention at home, and the weather.
 * The card stays cranberry; the temperature and the hourly line carry the colour
 * (icy blue when cold, amber when warm) and rain bars are blue.
 *
 * Add to resources as a JavaScript module, then pick "Cranberry home card" in the card picker.
 */
(() => {
  const VERSION = '2.24.0';
  const TAG = 'cranberry-home-card';
  const EDITOR_TAG = 'cranberry-home-card-editor';
  const FONT_URL = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,400..600,100&family=Figtree:wght@400;500;600;700&display=swap';

  // ---------- Icons (24px, stroked) ----------
  const I = {
    chev: 'm9 6 6 6-6 6',
    close: 'M6 6l12 12M18 6 6 18',
    power: 'M12 3v8M7 6.2a7 7 0 1 0 10 0',
    bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
    moon: 'M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z',
    sun: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    cloud: 'M7 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 18z',
    partly: 'M8 4a4 4 0 0 1 6.4 1.6M3.5 9.5l1.2.4M6 2.5l.5 1.2M7 19a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 19z',
    partlyNight: 'M11.5 7.5A4.5 4.5 0 0 1 6 2.5a4.5 4.5 0 1 0 5.5 5zM7 19a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 19z',
    rain: 'M7 15a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 15zM9 18l-1 3M13 18l-1 3M17 18l-1 3',
    storm: 'M7 15a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 15zM13 13l-2 4h3l-2 4',
    snow: 'M7 15a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 15zM8 19h.01M12 18h.01M16 19h.01M10 22h.01M14 22h.01',
    wind: 'M3 8h11a3 3 0 1 0-3-3M3 16h15a3 3 0 1 1-3 3M3 12h7',
    fog: 'M7 13a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 13zM4 17h16M6 21h12',
    umbrella: 'M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9zM12 12v7a2 2 0 0 0 4 0',
    coat: 'M8 3l4 3 4-3 4 4-3 3v11H7V10L4 7z',
    check: 'M5 12l4 4 10-10',
    clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    alert: 'M12 3 2 20h20zM12 10v4M12 17h.01',
    cal: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'
  };

  // ---------- Weather art (64px, three layers: fill, fill, stroke) ----------
  const A = {
    moon: 'M53 37A21 21 0 0 1 26 10a21 21 0 1 0 27 27z',
    stars: 'M50 10l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5zM14 46l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z',
    sun: 'M32 18a14 14 0 1 1 0 28 14 14 0 0 1 0-28z',
    rays: 'M32 6v5M32 53v5M6 32h5M53 32h5M13.6 13.6l3.5 3.5M46.9 46.9l3.5 3.5M13.6 50.4l3.5-3.5M46.9 17.1l3.5-3.5',
    smallSun: 'M24 10a11 11 0 1 1 0 22 11 11 0 0 1 0-22z',
    smallMoon: 'M34 25A12 12 0 0 1 19 10a12 12 0 1 0 15 15z',
    cloud: 'M18 52a10 10 0 0 1-1.2-19.9A15 15 0 0 1 45 30a11 11 0 0 1 1 22z',
    cloudMid: 'M18 46a10 10 0 0 1-1.2-19.9A15 15 0 0 1 45 24a11 11 0 0 1 1 22z',
    cloudHi: 'M18 38a10 10 0 0 1-1.2-19.9A15 15 0 0 1 45 16a11 11 0 0 1 1 22z',
    drops: 'M22 46l-3 8M32 46l-3 8M42 46l-3 8',
    bolt: 'M34 38l-6 10h6l-4 10 12-14h-7l4-6z',
    flakes: 'M22 48v8M18 52h8M38 48v8M34 52h8M30 56v6M27 59h6',
    hail: 'M22 48h.01M32 50h.01M42 48h.01M27 57h.01M37 57h.01',
    fogLines: 'M12 46h40M18 54h28',
    wind: 'M8 22h30a7 7 0 1 0-7-7M8 42h38a7 7 0 1 1-7 7M8 32h20',
    alert: 'M32 10 8 54h48zM32 28v12M32 47v.01'
  };
  const CREAM = '#F2ECE0', AMBER = '#F0B85A', BLUE = '#9CC3D6', ICE = BLUE, DUSK = '#B5ABA0', BOLT = AMBER;
  const ART = {
    'clear-night': [[A.moon, CREAM], [A.stars, '#E3DDCF'], null],
    sunny: [[A.sun, AMBER], null, [A.rays, AMBER]],
    partlycloudy: [[A.smallSun, AMBER], [A.cloud, CREAM], null],
    'partlycloudy-night': [[A.smallMoon, CREAM], [A.cloud, DUSK], null],
    cloudy: [[A.cloudMid, CREAM], null, null],
    fog: [[A.cloudHi, CREAM], null, [A.fogLines, DUSK]],
    rainy: [[A.cloudHi, CREAM], null, [A.drops, BLUE]],
    pouring: [[A.cloudHi, DUSK], null, [A.drops, BLUE]],
    'lightning': [[A.cloudHi, DUSK], [A.bolt, BOLT], null],
    'lightning-rainy': [[A.cloudHi, DUSK], [A.bolt, BOLT], [A.drops, BLUE]],
    snowy: [[A.cloudHi, CREAM], null, [A.flakes, ICE]],
    'snowy-rainy': [[A.cloudHi, CREAM], null, [A.flakes, BLUE]],
    hail: [[A.cloudHi, CREAM], null, [A.hail, ICE]],
    windy: [null, null, [A.wind, CREAM]],
    'windy-variant': [[A.cloudHi, CREAM], null, [A.drops, 'transparent']],
    exceptional: [null, null, [A.alert, BOLT]]
  };
  const HOUR_ICON = {
    'clear-night': I.moon, sunny: I.sun, partlycloudy: I.partly, 'partlycloudy-night': I.partlyNight, cloudy: I.cloud, fog: I.fog,
    rainy: I.rain, pouring: I.rain, lightning: I.storm, 'lightning-rainy': I.storm,
    snowy: I.snow, 'snowy-rainy': I.snow, hail: I.snow, windy: I.wind, 'windy-variant': I.wind, exceptional: I.alert
  };
  const HOUR_LUCIDE = { 'clear-night': 'moon', cloudy: 'cloud', exceptional: 'triangle-alert', fog: 'cloud-fog', hail: 'cloud-hail', lightning: 'cloud-lightning', 'lightning-rainy': 'cloud-lightning', partlycloudy: 'cloud-sun', 'partlycloudy-night': 'cloud-moon', pouring: 'cloud-rain-wind', rainy: 'cloud-rain', snowy: 'cloud-snow', 'snowy-rainy': 'cloud-snow', sunny: 'sun', windy: 'wind', 'windy-variant': 'wind' };
  const RAINY = ['rainy', 'pouring', 'lightning-rainy', 'snowy-rainy', 'hail'];
  const SNOWY = ['snowy', 'snowy-rainy'];
  const DONE_STATES = ['on', 'true', 'done', 'finished', 'complete', 'completed', 'ready', 'klaar', 'gereed'];
  const PROBLEM_STATES = ['on', 'open', 'opening', 'unlocked', 'unlocking', 'jammed', 'triggered', 'problem'];

  // Temperature colour, light enough to read on cranberry (stops in °C)
  const TS = [[-5, [185, 215, 232]], [3, [196, 214, 222]], [9, [226, 220, 200]], [14, [238, 196, 128]], [22, [242, 160, 92]]];
  const tempColour = (c) => {
    let i = 0;
    while (i < TS.length - 2 && c > TS[i + 1][0]) i++;
    const [t0, c0] = TS[i], [t1, c1] = TS[i + 1];
    const f = Math.max(0, Math.min(1, (c - t0) / (t1 - t0)));
    return 'rgb(' + c0.map((v, j) => Math.round(v + (c1[j] - v) * f)).join(',') + ')';
  };

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : null; };
  const round = (v) => (v == null ? '–' : String(Math.round(v)).replace('-', '−'));
  const listJoin = (arr) => arr.length <= 1 ? (arr[0] || '') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  const capital = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  const loadFonts = () => {
    if (document.getElementById('cranberry-home-card-fonts')) return;
    const l = document.createElement('link');
    l.id = 'cranberry-home-card-fonts';
    l.rel = 'stylesheet';
    l.href = FONT_URL;
    document.head.appendChild(l);
  };


  // ---------- Waste collection (Afvalwijzer), shared by the home card and the waste card ----------
  const WASTE_TYPES = [
    ['kerstbomen', 'Christmas trees', 'gft'], ['restafval', 'Residual', 'rest'], ['papier', 'Paper', 'paper'], ['paper', 'Paper', 'paper'],
    ['gft', 'Green (GFT)', 'gft'], ['groente', 'Green (GFT)', 'gft'], ['pmd', 'Plastic (PMD)', 'plastic'], ['plastic', 'Plastic', 'plastic'], ['pbd', 'Plastic (PBD)', 'plastic'],
    ['textiel', 'Textiles', 'rest'], ['glas', 'Glass', 'paper'], ['kca', 'Chemical waste', 'rest'], ['grofvuil', 'Bulky waste', 'rest'], ['rest', 'Residual', 'rest']
  ];
  const WASTE_SKIP = /_(today|tomorrow|day_after_tomorrow|next_[a-z_]+|notification[s]?|formatted)$/;
  const BIN_COLOURS = {
    light: { gft: '#5E7A34', paper: '#3F6585', plastic: '#C2702A', rest: '#4E5457' },
    dark: { gft: '#86A45A', paper: '#7FA3C2', plastic: '#E09A55', rest: '#9AA0A3' }
  };
  const SHORT = { 'Green (GFT)': 'green', 'Plastic (PMD)': 'plastic', 'Plastic (PBD)': 'plastic' };
  const parseHM = (v, d) => { const m = /^(\d{1,2}):(\d{2})/.exec(String(v || d)); return m ? Number(m[1]) * 60 + Number(m[2]) : 0; };
  const wasteState = (hass, cfg, nowDate) => {
    const now = nowDate || new Date();
    const dark = !!(hass.themes && hass.themes.darkMode);
    const C = BIN_COLOURS[dark ? 'dark' : 'light'];
    let ids = [].concat(cfg.waste || []).filter(Boolean);
    if (!ids.length || ids[0] === 'auto') {
      ids = Object.keys(hass.states).filter((id) => id.indexOf('sensor.afvalwijzer') === 0 && !WASTE_SKIP.test(id) && 'days_until_collection_date' in (hass.states[id].attributes || {}));
    }
    const names = cfg.waste_names || {};
    const today0 = new Date(now); today0.setHours(0, 0, 0, 0);
    const items = [];
    ids.forEach((id) => {
      const st = hass.states[id];
      if (!st) return;
      const d = new Date(st.state);
      if (isNaN(d)) return;
      const day0 = new Date(d); day0.setHours(0, 0, 0, 0);
      const days = Math.round((day0 - today0) / 86400000);
      if (days < 0) return;
      const low = id.toLowerCase();
      const type = WASTE_TYPES.find((t) => low.indexOf(t[0]) >= 0);
      const name = names[id] || (type ? type[1] : (st.attributes.friendly_name || id).replace(/^afvalwijzer\s*/i, ''));
      items.push({ id, name, colour: C[type ? type[2] : 'rest'], date: d, days });
    });
    items.sort((a, b) => a.date - b.date || a.name.localeCompare(b.name));
    const mins = now.getHours() * 60 + now.getMinutes();
    const remindFrom = parseHM(cfg.waste_remind_from, '16:00');
    const collectBy = parseHM(cfg.waste_collected_by, '07:30');
    const todayDue = mins < collectBy ? items.filter((x) => x.days === 0) : [];
    const tomorrowDue = mins >= remindFrom ? items.filter((x) => x.days === 1) : [];
    const due = todayDue.length ? todayDue : tomorrowDue;
    const when = todayDue.length ? 'today' : tomorrowDue.length ? 'tonight' : null;
    // "It's out" only counts if it was switched on since this reminder started
    let out = false;
    const helper = cfg.waste_out ? hass.states[cfg.waste_out] : null;
    if (helper && helper.state === 'on' && due.length) {
      const start = new Date(now); start.setHours(0, 0, 0, 0);
      if (when === 'today') start.setDate(start.getDate() - 1);
      start.setMinutes(remindFrom);
      out = Date.parse(helper.last_changed) >= start.getTime() - 4 * 3600000;
    }
    const label = (list) => {
      const n = list.map((x) => SHORT[x.name] || x.name.toLowerCase());
      const txt = n.length === 1 ? n[0] : n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1];
      return txt.charAt(0).toUpperCase() + txt.slice(1);
    };
    const r = { items, due, when, out, upcoming: items.filter((x) => !(x.days === 0 && mins >= collectBy)) };
    if (due.length) {
      const L = label(due);
      r.chip = when === 'today' ? L + (due.length > 1 ? ' are' : ' is') + ' collected today' : L + ' out tonight';
      r.colours = due.map((x) => x.colour);
    }
    return r;
  };
  window.CranberryWaste = { wasteState, label: null };


  // ---------- Update in place, so CSS transitions can animate between states ----------
  const syncChildren = (cur, next) => {
    const a = Array.from(cur.childNodes), b = Array.from(next.childNodes);
    b.forEach((n, i) => {
      const o = a[i];
      if (!o) { cur.appendChild(n); return; }
      const sameEl = o.nodeType === 1 && n.nodeType === 1 && o.nodeName === n.nodeName && o.getAttribute('data-key') === n.getAttribute('data-key');
      if (o.nodeType !== n.nodeType || (o.nodeType === 1 && !sameEl)) { cur.replaceChild(n, o); return; }
      if (o.nodeType !== 1) { if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue; return; }
      Array.from(o.attributes).forEach((at) => { if (!n.hasAttribute(at.name)) o.removeAttribute(at.name); });
      Array.from(n.attributes).forEach((at) => { if (o.getAttribute(at.name) !== at.value) o.setAttribute(at.name, at.value); });
      if (o.hasAttribute('data-keep')) return; // filled by the card itself, e.g. an embedded map
      syncChildren(o, n);
    });
    for (let i = a.length - 1; i >= b.length; i--) cur.removeChild(a[i]);
  };
  const morph = (root, html) => {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    if (!root.firstChild) { root.appendChild(tpl.content); return; }
    syncChildren(root, tpl.content);
  };
  // gentle movement; switched off for people who prefer reduced motion
  const MOTION = `
    @keyframes cc-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
    @keyframes cc-sheen { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
    @media (prefers-reduced-motion: no-preference) {
      ha-card { transition: background-color .35s ease, color .35s ease, opacity .35s ease; }
      .ic, .tog, .extra, .bin, .btns button, .ctl, .act, .step, .issue, .bins, .day, .temp, .chip, .insight, .art { transition: background-color .3s ease, color .3s ease, opacity .3s ease; }
      .fill { transition: width .7s cubic-bezier(.2, .8, .2, 1), background-color .3s ease; }
      .bar span, .bars span { transition: width .8s cubic-bezier(.2, .8, .2, 1), height .6s cubic-bezier(.2, .8, .2, 1), opacity .3s ease; }
      .issue, .bins, .warn, .act, .step.now, .insight, .item.soon { animation: cc-in .35s ease both; }
      ha-card.running .bar span { overflow: hidden; }
      ha-card.running .bar span::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.28), transparent); animation: cc-sheen 2.6s ease-in-out infinite; }
    }
  `;
  window.CranberryMorph = { morph, MOTION };

  const STYLE = `
    :host { display: block; }
    ha-card {
      --chc-bg: var(--cranberry-home-card-background, #591E21);
      --chc-fg: #F2ECE0; --chc-sub: #D9C3C0; --chc-rule: rgba(242,236,224,0.2);
      background: var(--chc-bg); color: var(--chc-fg);
      border: 0; border-radius: var(--cc-r-card, 24px);
      overflow: hidden; height: 100%; box-sizing: border-box; min-height: var(--chc-fit, 0px); position: relative;
      font-family: Figtree, var(--ha-font-family-body, var(--paper-font-body1_-_font-family, sans-serif));
      display: flex; flex-direction: column;
    }
    .serif { font-family: Fraunces, Georgia, serif; font-variation-settings: 'SOFT' 100; font-weight: 400; letter-spacing: -0.03em; }
    button { font: inherit; color: inherit; background: none; border: 0; padding: 0; margin: 0; cursor: pointer; text-align: inherit; }
    button:focus-visible { outline: 2px solid var(--chc-fg); outline-offset: 3px; border-radius: var(--cc-r-chip, 8px); }
    .warn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 20px; box-sizing: border-box; background: #F2ECE0; color: #A8352F; font-size: 13px; font-weight: 600; }
    .body { flex: 1; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 28px; padding: 22px 24px; box-sizing: border-box; }
    .home { min-width: 0; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; }
    .top { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; }
    .date { font-size: 14px; font-weight: 500; color: var(--chc-sub); }
    .time { font-size: 80px; line-height: 0.9; }
    .stack { display: flex; flex-direction: column; gap: 8px; }
    .issue { align-self: flex-start; max-width: 100%; box-sizing: border-box; min-height: 40px; padding: 6px 14px 6px 6px; border-radius: var(--cc-r-ctl, 12px); background: #F2ECE0; color: #A8352F; display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .bins { min-height: 40px; padding: 6px 14px 6px 6px; border-radius: var(--cc-r-ctl, 12px); background: #F2ECE0; color: #591E21; display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; }
    .bins .n { height: 28px; padding: 0 4px; border-radius: var(--cc-r-chip, 8px); background: rgba(89,30,33,0.08); display: flex; align-items: center; gap: 2px; }
    .lamps { align-self: flex-start; max-width: 100%; box-sizing: border-box; min-height: 40px; padding: 6px 10px 6px 6px; border-radius: var(--cc-r-ctl, 12px); background: rgba(242, 236, 224, 0.14); color: var(--chc-fg); display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; text-align: left; }
    .lamps .n { height: 28px; padding: 0 8px 0 6px; flex-shrink: 0; border-radius: var(--cc-r-chip, 8px); background: var(--chc-fg); color: var(--chc-bg); display: flex; align-items: center; gap: 4px; font-weight: 700; }
    .lamps > svg { flex-shrink: 0; opacity: .7; margin-left: -4px; }
    .lamps[aria-expanded="true"] { background: rgba(242, 236, 224, 0.24); }
    .menu { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; gap: 10px; padding: 16px 20px; box-sizing: border-box; background: color-mix(in srgb, var(--chc-bg) 88%, #000); animation: cc-in .25s ease both; }
    .mhead { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .mtitle { font-size: 17px; font-weight: 600; }
    .mlist { flex: 1; min-height: 0; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); align-content: start; gap: 4px 20px; }
    .mgroup { display: flex; flex-direction: column; }
    .mlabel { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--chc-sub); padding: 6px 0 2px; }
    .mrow { display: flex; align-items: center; gap: 10px; min-height: 40px; border-bottom: 1px solid var(--chc-rule); }
    .mname { flex: 1; min-width: 0; display: flex; align-items: baseline; gap: 8px; font-size: 15px; font-weight: 500; }
    .mname span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .mname small { font-size: 13px; color: var(--chc-sub); }
    .mbtn { width: 34px; height: 34px; flex-shrink: 0; border-radius: var(--cc-r-ctl, 12px); background: rgba(242, 236, 224, 0.12); display: flex; align-items: center; justify-content: center; }
    .alloff { align-self: flex-start; height: 40px; padding: 0 16px 0 12px; border-radius: var(--cc-r-ctl, 12px); background: var(--chc-fg); color: var(--chc-bg); display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; }
    @media (prefers-reduced-motion: reduce) { .menu { animation: none; } }
    .issue .n { width: 28px; height: 28px; flex-shrink: 0; border-radius: var(--cc-r-chip, 8px); background: #A8352F; color: #F2ECE0; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    p { margin: 0; font-size: 17px; font-weight: 500; line-height: 1.3; }
    .insight { display: flex; align-items: flex-start; gap: 8px; align-self: flex-start; max-width: 100%; font-size: 15px; color: var(--chc-sub); }
    .insight svg { flex-shrink: 0; margin-top: 1px; color: var(--chc-sub); }
    .weather { cursor: pointer; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; padding-left: 24px; border-left: 1px solid var(--chc-rule); width: 100%; box-sizing: border-box; }
    .head { display: flex; align-items: center; gap: 12px; }
    .head .names { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .label { font-size: 15px; font-weight: 700; }
    .feels { font-size: 13px; font-weight: 500; color: var(--chc-sub); }
    .temp { font-size: 52px; line-height: 1; }
    .temp small { font-size: 20px; color: var(--chc-sub); }
    .chart { display: flex; flex-direction: column; gap: 6px; }
    .hours { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); text-align: center; }
    .hour { display: flex; flex-direction: column; align-items: center; gap: 3px; }
    .hour b { font-size: 14px; font-weight: 700; }
    .hour svg { color: var(--chc-sub); }
    .hour span, .ticks { font-size: 12px; font-weight: 500; color: var(--chc-sub); }
    .bars { display: flex; align-items: flex-end; gap: 3px; height: 58px; border-bottom: 1px solid var(--chc-rule); }
    .bars span { flex: 1; min-height: 2px; border-radius: 3px 3px 0 0; background: #9CC3D6; }
    .ticks { display: flex; justify-content: space-between; }
    .chip { display: none; align-items: center; gap: 8px; }
    .chip .serif { font-size: 40px; line-height: 1; }
    .empty { padding: 24px; font-size: 15px; }
    /* coming up: the next things on the calendar, under the clock */
    .agenda { flex: 1; display: flex; flex-direction: column; gap: 8px; margin-top: 14px; min-height: 0; }
    .agenda .k, .stat .k { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--chc-sub); }
    .agenda .k { margin-bottom: 2px; }
    .agenda button.k, .agenda button.none { align-self: flex-start; text-align: left; }
    .ev { display: flex; align-items: center; gap: 12px; max-width: 100%; text-align: left; }
    .ev .day { width: 44px; height: 48px; flex-shrink: 0; border-radius: var(--cc-r-ctl, 12px); background: rgba(242, 236, 224, 0.12); display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .ev .day small { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--chc-sub); line-height: 12px; }
    .ev .day .serif { font-size: 24px; line-height: 26px; }
    .ev .txt { min-width: 0; display: flex; flex-direction: column; }
    .ev .what { font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ev .when { font-size: 13px; font-weight: 500; color: var(--chc-sub); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .agenda .none { font-size: 16px; font-weight: 500; color: var(--chc-sub); }
    /* weather details: a row of facts, and a chart that uses the height */
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(84px, 1fr)); gap: 12px; padding: 12px 0 2px; border-top: 1px solid var(--chc-rule); }
    .stat { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .stat b { font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .weather.fill .chart { flex: 1; justify-content: flex-end; min-height: 0; }
    .weather.fill .plot { flex: 1; position: relative; min-height: 34px; max-height: 220px; }
    .weather.fill .plot svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .weather.fill .bars { flex: 1; height: auto; min-height: 58px; max-height: 200px; }
    /* stacked layout for phones and narrow columns */
    ha-card.stacked .body { grid-template-columns: minmax(0, 1fr); gap: 14px; padding: 18px; }
    ha-card.stacked .time { font-size: 60px; }
    ha-card.stacked p { font-size: 16px; }
    ha-card.stacked .weather { padding-left: 0; border-left: 0; }
    ha-card.stacked .weather .head { display: none; }
    ha-card.stacked .chip { display: flex; }
    ha-card.no-clock .time { display: none; }
  `;

  class CranberryHomeCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._forecast = null;
      this._unsub = null;
      this._subscribedTo = null;
      this._gid = 'chc' + Math.random().toString(36).slice(2, 8);
      this._width = 0;
      this._last = '';
    }

    // ----- Home Assistant API -----
    static getConfigElement() {
      return document.createElement(EDITOR_TAG);
    }

    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const weather = ids.find((e) => e.startsWith('weather.')) || 'weather.home';
      const lights = ids.filter((e) => e.startsWith('light.')).slice(0, 4);
      return { weather, lights };
    }

    setConfig(config) {
      if (!config || !config.weather) throw new Error('Pick a weather entity');
      this._config = Object.assign({ layout: 'auto', show_clock: true, hour_step: 2, load_fonts: true, match_row: true, weather_details: 'hide', coming_up: 'hide', coming_up_count: 2 }, config);
      this._calAt = 0; this._events = null;
      if (this._config.load_fonts !== false) loadFonts();
      this._last = '';
      if (this._hass) { this._subscribe(); this._render(); }
    }

    set hass(hass) {
      this._hass = hass;
      this._subscribe();
      this._render();
    }

    getCardSize() { return 5; }

    getGridOptions() {
      return { columns: 12, rows: 'auto', min_columns: 6 };
    }

    connectedCallback() {
      this._tick = setInterval(() => this._render(), 20000);
      if (!this._ro && window.ResizeObserver) {
        this._ro = new ResizeObserver((entries) => {
          const w = Math.round(entries[0].contentRect.width);
          if (Math.abs(w - this._width) > 4) { this._width = w; this._render(true); }
          this._queueFit();
        });
        // sections next to this one: grow with them
        this._rowRo = new ResizeObserver(() => this._queueFit());
      }
      if (this._ro) this._ro.observe(this);
      this._queueFit();
      if (this._hass && this._config) this._subscribe();
    }

    disconnectedCallback() {
      clearInterval(this._tick);
      if (this._ro) this._ro.disconnect();
      if (this._rowRo) this._rowRo.disconnect();
      this._rowSec = null;
      cancelAnimationFrame(this._fitRaf);
      this._unsubscribe();
    }

    // ----- Match the height of the sections in the same row -----
    // Home Assistant aligns the sections of a row to the top, so a short card leaves a gap
    // under it. The card finds its section, looks at the sections that start on the same
    // line and grows to the bottom of the tallest one.
    _findSection() {
      let n = this;
      for (let i = 0; n && i < 60; i++) {
        const p = n.parentElement;
        if (n.classList && n.classList.contains('section') && p && (p.classList.contains('content') || p.localName === 'ha-sortable')) return n;
        n = n.assignedSlot || p || (n.getRootNode && n.getRootNode().host);
      }
      return null;
    }

    _queueFit() {
      cancelAnimationFrame(this._fitRaf);
      this._fitRaf = requestAnimationFrame(() => this._fit());
    }

    _fit() {
      if (!this.isConnected || !this._config) return;
      const sec = this._config.match_row === false ? null : this._findSection();
      if (sec !== this._rowSec && this._rowRo) {
        this._rowRo.disconnect();
        this._rowSec = sec;
        if (sec) [...sec.parentElement.children].forEach((s) => { if (s !== sec && s.classList.contains('section')) this._rowRo.observe(s); });
      }
      const card = this.shadowRoot.querySelector('ha-card');
      this.style.removeProperty('--chc-fit');
      if (!sec || !card) return;
      const r = sec.getBoundingClientRect();
      let bottom = 0;
      for (const s of sec.parentElement.children) {
        if (s === sec || !s.classList.contains('section')) continue;
        const q = s.getBoundingClientRect();
        if (q.height > 0 && Math.abs(q.top - r.top) < 4) bottom = Math.max(bottom, q.bottom);
      }
      const grow = Math.round(bottom - r.bottom);
      if (grow > 1) this.style.setProperty('--chc-fit', Math.round(card.getBoundingClientRect().height + grow) + 'px');
    }

    // ----- Forecast subscription -----
    _unsubscribe() {
      if (this._unsub) {
        Promise.resolve(this._unsub).then((u) => { if (typeof u === 'function') u(); }).catch(() => {});
      }
      this._unsub = null;
      this._subscribedTo = null;
    }

    _subscribe() {
      if (!this._hass || !this._config || !this.isConnected) return;
      const id = this._config.weather;
      if (this._subscribedTo === id) return;
      this._unsubscribe();
      const st = this._hass.states[id];
      if (!st || !this._hass.connection) return;
      const sf = st.attributes.supported_features || 0;
      const type = (sf & 2) ? 'hourly' : (sf & 4) ? 'twice_daily' : (sf & 1) ? 'daily' : null;
      if (!type) return;
      this._subscribedTo = id;
      this._forecastType = type;
      try {
        this._unsub = this._hass.connection.subscribeMessage((msg) => {
          this._forecast = msg && msg.forecast ? msg.forecast : [];
          this._render(true);
        }, { type: 'weather/subscribe_forecast', forecast_type: type, entity_id: id });
        Promise.resolve(this._unsub).catch(() => { this._subscribedTo = null; });
      } catch (e) {
        this._subscribedTo = null;
      }
    }

    // ----- Calendar -----
    // "show", "wide" (only in the side-by-side layout) or "hide"; true and false work too
    _on(v, layout) { return v === true || v === 'show' || (v === 'wide' && layout === 'wide'); }

    async _fetchCal() {
      const h = this._hass, c = this._config;
      const ids = [].concat(c.calendars || []).filter(Boolean);
      if (!h || !h.callApi || !ids.length || this._calBusy) return;
      this._calBusy = true; this._calAt = Date.now();
      const start = new Date(), end = new Date(start.getTime() + 8 * 86400000);
      const out = [];
      await Promise.all(ids.map(async (id) => {
        try {
          const evs = await h.callApi('GET', 'calendars/' + id + '?start=' + encodeURIComponent(start.toISOString()) + '&end=' + encodeURIComponent(end.toISOString()));
          (evs || []).forEach((e) => out.push(Object.assign({ cal: id }, e)));
        } catch (err) { /* a calendar that fails is left out */ }
      }));
      this._events = out;
      this._calBusy = false;
      this._render(true);
    }

    _agenda(now, bins) {
      const c = this._config;
      const day0 = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); };
      const DAY = 86400000, today = day0(now);
      const parse = (v) => {
        if (!v) return null;
        if (typeof v === 'object') return v.dateTime ? { d: new Date(v.dateTime), all: false } : (v.date ? { d: new Date(v.date + 'T00:00:00'), all: true } : null);
        return /^\d{4}-\d{2}-\d{2}$/.test(v) ? { d: new Date(v + 'T00:00:00'), all: true } : { d: new Date(v), all: false };
      };
      const list = [];
      (this._events || []).forEach((e) => {
        const s = parse(e.start), en = parse(e.end);
        if (!s || isNaN(s.d)) return;
        const endT = en && !isNaN(en.d) ? en.d.getTime() : s.d.getTime() + (s.all ? DAY : 3600000);
        if (endT <= now.getTime()) return;
        const started = s.d <= now;
        const when = s.all ? 'All day' : started ? 'Now, until ' + this._fmtTime(new Date(endT)) : this._fmtTime(s.d);
        list.push({ day: started ? today : day0(s.d), t: started ? now.getTime() : s.d.getTime(), all: s.all, when, what: e.summary || e.message || 'Busy', id: e.cal });
      });
      // the next bin collection, unless the bins chip already says it
      if (c.waste && !bins) {
        const ws = wasteState(this._hass, c, now);
        const next = (ws.upcoming || []).filter((x) => x.days <= 2);
        if (next.length) {
          const same = next.filter((x) => x.days === next[0].days);
          list.push({ day: day0(next[0].date), t: day0(next[0].date), all: true, when: 'Bin collection', what: capital(listJoin(same.map((x) => (SHORT[x.name] || x.name).toLowerCase()))), id: same[0].id });
        }
      }
      // timed events first within a day, all-day after
      list.sort((a, b) => a.day - b.day || (a.all ? 1 : 0) - (b.all ? 1 : 0) || a.t - b.t);
      // one block per day: the first event, and how many more that day
      const days = [];
      list.forEach((x) => {
        const g = days[days.length - 1];
        if (g && g.day === x.day) g.more++;
        else days.push(Object.assign({ more: 0 }, x));
      });
      const fmt = (o) => new Intl.DateTimeFormat(this._lang(), o);
      return days.slice(0, Math.max(1, Math.min(5, Number(c.coming_up_count) || 2))).map((g) => {
        const d = new Date(g.day);
        return { wd: fmt({ weekday: 'short' }).format(d).replace(/\.$/, ''), n: d.getDate(), what: g.what, when: g.when + (g.more ? ' · +' + g.more + ' more' : ''), id: g.id,
          aria: fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(d) + ': ' + g.what + ', ' + g.when };
      });
    }

    // ----- Helpers -----
    _name(id) {
      const st = this._hass.states[id];
      const reg = this._hass.entities && this._hass.entities[id];
      return (reg && reg.name) || (st && st.attributes.friendly_name) || id;
    }

    _area(id) {
      const h = this._hass;
      const reg = h.entities && h.entities[id];
      if (!reg || !h.areas) return null;
      let areaId = reg.area_id;
      if (!areaId && reg.device_id && h.devices && h.devices[reg.device_id]) areaId = h.devices[reg.device_id].area_id;
      return areaId && h.areas[areaId] ? h.areas[areaId].name : null;
    }

    _stateText(st) {
      if (this._hass.formatEntityState) {
        try { return this._hass.formatEntityState(st); } catch (e) { /* fall through */ }
      }
      return st.state;
    }

    _lang() {
      return (this._hass.locale && this._hass.locale.language) || this._hass.language || navigator.language || 'en';
    }

    _fmtTime(d, withMinutes = true) {
      const opts = withMinutes ? { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' } : { hour: '2-digit', hourCycle: 'h23' };
      try { return new Intl.DateTimeFormat(this._lang(), opts).format(d); } catch (e) { return d.toTimeString().slice(0, withMinutes ? 5 : 2); }
    }

    _ago(d, now) {
      const min = Math.max(0, Math.floor((now - d) / 60000));
      if (min < 1) return 'just now';
      if (min < 60) return min + ' min ago';
      const hrs = Math.floor(min / 60), rest = min % 60;
      if (hrs < 24) return hrs + ' h' + (rest && hrs < 6 ? ' ' + rest + ' min' : '') + ' ago';
      const days = Math.floor(hrs / 24);
      return days === 1 ? 'yesterday' : days + ' days ago';
    }

    _toC(t, unit) { return t == null ? null : (unit && unit.indexOf('F') >= 0 ? (t - 32) * 5 / 9 : t); }

    _moreInfo(entityId) {
      if (!entityId) return;
      this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }));
    }

    // ----- Data model -----
    _model() {
      const h = this._hass, c = this._config;
      const now = new Date();
      const w = h.states[c.weather];

      // home
      const issues = [];
      const names = c.issue_names || {};
      (c.issues || []).forEach((item) => {
        const id = typeof item === 'string' ? item : item && item.entity;
        const st = id && h.states[id];
        if (st && PROBLEM_STATES.indexOf(st.state) >= 0) {
          const label = (item && item.name) || names[id] || this._name(id);
          issues.push({ id, text: label + ' ' + String(this._stateText(st)).toLowerCase() });
        }
      });
      if (c.laundry_done) {
        const ds = h.states[c.laundry_done];
        if (ds && DONE_STATES.indexOf(String(ds.state).toLowerCase()) >= 0) {
          let at = null;
          const ts = c.laundry_done_at && h.states[c.laundry_done_at];
          if (ts) {
            const raw = ts.attributes.timestamp != null && ts.entity_id.startsWith('input_datetime.') ? ts.attributes.timestamp * 1000 : String(ts.state).replace(' ', 'T');
            const d = new Date(raw);
            if (!isNaN(d)) at = d;
          }
          if (!at) at = new Date(ds.last_changed || ds.last_updated || now);
          issues.push({ id: c.laundry_done, text: (c.laundry_name || 'Washing machine') + ' done ' + this._ago(at, now) });
        }
      }
      let warning = null;
      const warnIds = [].concat(c.warning || []).filter(Boolean);
      if (warnIds.length) {
        // Accepts any mix of: on/off sensors (MeteoAlarm, "warning active"), level or colour sensors
        // (yellow/geel, orange/oranje, red/rood, or 1-3), and sensors with a list of warnings in their attributes.
        const COLOURS = { yellow: 1, geel: 1, orange: 2, oranje: 2, red: 3, rood: 3 };
        const NAMES = ['', 'yellow', 'orange', 'red'];
        const levelOf = (v) => {
          if (v == null) return 0;
          const x = String(v).toLowerCase().replace(/^code\s+/, '').trim();
          if (COLOURS[x]) return COLOURS[x];
          if (/^[1-3]$/.test(x)) return Number(x);
          const m = x.match(/(yellow|geel|orange|oranje|red|rood)/);
          return m ? COLOURS[m[1]] : 0;
        };
        const pick = (o, keys) => { for (const k of keys) { if (o && o[k] != null && o[k] !== '') return o[k]; } return null; };
        // short text for the strip: KNMI's description ("Gladheid") before its longer headline
        const TEXT_KEYS = ['description', 'headline', 'phenomenon', 'event', 'title', 'text', 'message'];
        const DETAIL_KEYS = ['details', 'detailed_description', 'instruction', 'headline'];
        const SKIP_STATES = ['none', 'unknown', 'unavailable', 'on', 'off', 'geen', ''];
        const WARN_EN = {
          'snowy-rainy': ['Slippery roads', 'Roads and paths may be slippery. Take care walking, cycling or driving.'],
          snowy: ['Snow', 'Snow can make roads slippery and cause delays. Allow extra time for travel.'],
          hail: ['Hail', 'Hail showers can damage cars and plants. Put the car under cover if you can.'],
          sunny: ['Heat', 'Heat is a health risk, especially for older people and young children. Drink enough and keep the house cool.'],
          exceptional: ['Heat', 'Heat is a health risk, especially for older people and young children. Drink enough and keep the house cool.'],
          pouring: ['Heavy rain', 'Heavy rain may flood roads and tunnels. Keep drains clear and allow extra time for travel.'],
          rainy: ['Heavy rain', 'Heavy rain may flood roads and tunnels. Keep drains clear and allow extra time for travel.'],
          lightning: ['Thunderstorms', 'Thunderstorms with possible hail and strong gusts. Stay indoors when they pass and bring loose things inside.'],
          'lightning-rainy': ['Thunderstorms', 'Thunderstorms with heavy rain, possible hail and strong gusts. Stay indoors when they pass.'],
          windy: ['Strong wind', 'Strong gusts may bring down branches and disrupt traffic. Secure loose things outside.'],
          'windy-variant': ['Wind gusts', 'Strong gusts may bring down branches and disrupt traffic. Secure loose things outside.'],
          fog: ['Fog', 'Dense fog with poor visibility. Drive slowly and keep your distance.']
        };
        const WARN_TRAVEL = ['snowy-rainy', 'snowy', 'pouring', 'rainy', 'lightning', 'lightning-rainy', 'windy', 'windy-variant', 'fog'];
        const WARN_WORD = { windy: 'Wind', 'windy-variant': 'Wind', lightning: 'Thunderstorm', 'lightning-rainy': 'Thunderstorm', snowy: 'Snow and ice', 'snowy-rainy': 'Slippery roads', hail: 'Hail', fog: 'Fog', pouring: 'Heavy rain', rainy: 'Rain', exceptional: 'Heat' };
        const END_KEYS = ['expires', 'valid_until', 'end', 'ends_at', 'end_time', 'until', 'to'];
        let rank = 0, on = false, text = '', detail = '', event = '', wcond = '', until = null, firstId = warnIds[0];
        warnIds.forEach((id) => {
          const ws = h.states[id];
          if (!ws) return;
          const at = ws.attributes || {};
          const list = Array.isArray(at.warnings) ? at.warnings : (Array.isArray(at.alerts) ? at.alerts : []);
          let r = Math.max(levelOf(ws.state), levelOf(pick(at, ['level', 'code', 'color', 'colour', 'awareness_level'])));
          list.forEach((x) => { r = Math.max(r, levelOf(pick(x, ['level', 'code', 'color', 'colour']))); });
          if (ws.state === 'on') on = true;
          if (r > rank) { rank = r; firstId = id; }
          const item = list[0] || at;
          if (!text) {
            // the shortest useful line: KNMI's description ("Gladheid"), MeteoAlarm's headline ("Strong wind")
            const cands = TEXT_KEYS.map((k) => item && item[k]).filter((v) => v != null && String(v).trim() !== '').map(String);
            text = cands.find((v) => v.length <= 40) || cands[0] || '';
          }
          if (!detail) {
            if (list.length) detail = pick(list[0], DETAIL_KEYS) || '';
            else if (at.description && String(at.description).length > 40) detail = String(at.description);
          }
          if (!event) event = pick(item, ['event', 'phenomenon', 'type']) || '';
          if (!wcond) wcond = pick(item, ['condition']) || '';
          if (!until) { const u = pick(item, END_KEYS); if (u) { const d = new Date(u); if (!isNaN(d)) until = d; } }
          if (!text && ws.entity_id.indexOf('sensor.') === 0 && isNaN(parseFloat(ws.state)) && !levelOf(ws.state) && SKIP_STATES.indexOf(String(ws.state).toLowerCase()) < 0) text = ws.state;
        });
        const minimum = { yellow: 1, orange: 2, red: 3 }[String(c.warning_from || 'yellow').toLowerCase()] || 1;
        const active = rank >= minimum || (on && rank === 0);
        if (active) {
          const level = NAMES[rank] || '';
          const levelNl = { yellow: 'geel', orange: 'oranje', red: 'rood' };
          const untilText = until ? 'until ' + this._fmtTime(until) : null;
          // English by default: KNMI's own texts are Dutch only
          const english = c.warning_text !== 'original' && WARN_EN[wcond];
          if (english) {
            text = WARN_EN[wcond][0];
            let advice = WARN_EN[wcond][1];
            if (rank >= 3) advice += ' Follow the advice of the authorities.';
            else if (rank === 2 && WARN_TRAVEL.indexOf(wcond) >= 0) advice += ' Avoid travelling if you can.';
            detail = advice;
          }
          const short = String(text).split(/[.\n]/)[0].slice(0, 70);
          warning = {
            entity: firstId,
            strip: [level ? 'Code ' + (c.warning_language === 'nl' ? levelNl[level] : level) : null, short || null, untilText].filter(Boolean).join(' · '),
            cond: wcond,
            // the actual warning text, shortened to two sentences for the card
            detail: (() => {
              const d = String(detail || '').replace(/\s+/g, ' ').trim();
              if (english) return d;
              if (!d || d.toLowerCase() === String(text).toLowerCase()) return '';
              const parts = d.match(/[^.!?]+[.!?]*/g) || [d];
              let out = parts[0];
              if (parts[1] && (out + parts[1]).length <= 150) out += parts[1];
              return out.length > 170 ? out.slice(0, 167).replace(/\s+\S*$/, '') + '…' : out.trim();
            })(),
            chip: capital(String(english ? WARN_EN[wcond][0] + ' warning' : (event || (WARN_WORD[wcond] ? WARN_WORD[wcond] + ' warning' : (level ? 'Code ' + level : 'Weather warning'))))) + (untilText ? ' ' + untilText : '')
          };
          issues.unshift({ id: firstId, text: warning.chip });
        }
      }
      const litAreas = [], litNames = [];
      (c.lights || []).forEach((id) => {
        const st = h.states[id];
        if (st && st.state === 'on') {
          const a = this._area(id);
          if (a) { if (litAreas.indexOf(a) < 0) litAreas.push(a); } else litNames.push(this._name(id));
        }
      });
      const lit = litAreas.concat(litNames);
      let lights = '';
      if ((c.lights || []).length) {
        if (!lit.length) lights = 'All lights are off.';
        else if (lit.length > 3) lights = 'Lights on in ' + lit.length + ' places.';
        else lights = 'Lights on in ' + listJoin(lit) + '.';
      }
      const lead = issues.length ? (issues.length === 1 ? 'One thing needs you.' : (issues.length === 2 ? 'Two things need you.' : issues.length + ' things need you.')) : 'All quiet.';
      // the lights that are on, for the chip and its menu; a light group lists its members that are on
      const pct = (st) => (st.attributes.brightness != null ? Math.round(st.attributes.brightness / 2.55) + '%' : '');
      const menu = (c.lights || []).filter((id) => h.states[id] && h.states[id].state === 'on').map((id) => {
        const st = h.states[id];
        const members = Array.isArray(st.attributes.entity_id) ? st.attributes.entity_id.filter((e) => h.states[e] && h.states[e].state === 'on') : [];
        return { id, name: this._area(id) || this._name(id), items: (members.length ? members : [id]).map((e) => ({ id: e, name: this._name(e), level: pct(h.states[e]) })) };
      });
      // next to a red chip, the lights chip keeps it short so both fit on one line
      const lampText = issues.length && lit.length > 1 ? 'Lights on in ' + lit.length + (litNames.length ? ' places' : ' rooms') : lights.replace(/\.$/, '');
      const lamps = !c.home_text && lit.length ? { n: menu.reduce((s, g) => s + g.items.length, 0), text: lampText } : null;
      const homeText = c.home_text || (lead + (lights && !lamps ? ' ' + lights : ''));

      // weather
      let bins = null;
      if (c.waste) {
        const ws = wasteState(h, c, now);
        if (ws.chip && !ws.out) bins = { text: ws.chip, colours: ws.colours, id: (c.waste_out || ws.due[0].id) };
      }
      const layout = this._layout || 'wide';
      const model = {
        now, issues, warning, homeText, bins, lamps, menu,
        agenda: this._on(c.coming_up, layout) ? this._agenda(now, bins) : null,
        details: this._on(c.weather_details, layout),
        date: new Intl.DateTimeFormat(this._lang(), this._width && this._width < 560 ? { weekday: 'short', day: 'numeric', month: 'short' } : { weekday: 'long', day: 'numeric', month: 'long' }).format(now),
        time: this._fmtTime(now)
      };
      if (!w) { model.missing = c.weather; return model; }
      const at = w.attributes;
      const unit = at.temperature_unit || (h.config && h.config.unit_system && h.config.unit_system.temperature) || '°C';
      const cond = w.state;
      const obs = c.weather_now ? h.states[c.weather_now] : null;
      const oa = obs ? obs.attributes : {};
      const temp = num(oa.temperature) != null ? num(oa.temperature) : num(at.temperature);
      const fc = (this._forecast || []).filter((f) => new Date(f.datetime) > new Date(now.getTime() - 3600000)).slice(0, 24);
      const hourly = this._forecastType === 'hourly';
      const next12 = hourly ? fc.slice(0, 12) : [];
      const temps12 = next12.map((f) => num(f.temperature)).filter((v) => v != null);

      const sun = h.states['sun.sun'];
      const night = sun ? sun.state === 'below_horizon' : (cond === 'clear-night');
      const rise = sun ? Date.parse(sun.attributes.next_rising) : NaN, set = sun ? Date.parse(sun.attributes.next_setting) : NaN;
      const isNight = (t) => {
        if (isNaN(rise) || isNaN(set)) return night;
        // sunrises and sunsets around now, a day apart; the last one before t decides
        const day = 86400000, ev = [];
        for (let k = -2; k <= 2; k++) { ev.push([rise + k * day, false]); ev.push([set + k * day, true]); }
        let last = null;
        ev.forEach((e) => { if (e[0] <= t && (!last || e[0] > last[0])) last = e; });
        return last ? last[1] : night;
      };
      const atNight = (c, t) => (c === 'partlycloudy' && isNight(t) ? 'partlycloudy-night' : c);
      const feelsBits = [];
      const app = num(oa.apparent_temperature) != null ? num(oa.apparent_temperature) : num(at.apparent_temperature);
      if (app != null && Math.round(app) !== Math.round(temp)) feelsBits.push('Feels like ' + round(app) + '°');
      if (temps12.length) feelsBits.push(night ? 'low ' + round(Math.min.apply(null, temps12)) + '°' : 'high ' + round(Math.max.apply(null, temps12)) + '°');
      else if (!hourly && fc[0]) feelsBits.push('high ' + round(num(fc[0].temperature)) + '°');
      const gust = num(oa.wind_gust_speed) != null ? num(oa.wind_gust_speed) : num(at.wind_gust_speed);
      if (warning && gust) feelsBits.unshift('Gusts up to ' + Math.round(gust) + ' ' + (oa.wind_speed_unit || at.wind_speed_unit || 'km/h'));

      const wet = (f) => (num(f.precipitation) || 0) >= 0.1 || (num(f.precipitation_probability) || 0) >= 50;
      // 5-minute rain nowcast (for example NL Weather's precipitation_forecasted sensor)
      const ncSt = c.rain_nowcast ? h.states[c.rain_nowcast] : null;
      const nc = (ncSt && Array.isArray(ncSt.attributes.forecast) ? ncSt.attributes.forecast : [])
        .filter((p) => Date.parse(p.datetime) > now.getTime() - 5 * 60000).slice(0, 24);
      const ncWet = (p) => (num(p.precipitation) || 0) >= 0.1;
      const ncAny = nc.some(ncWet);
      const rainNow = nc.length ? ncWet(nc[0]) : RAINY.indexOf(cond) >= 0;
      const firstWet = next12.findIndex(wet);
      const showRain = ncAny || (hourly && (rainNow || firstWet >= 0));

      // insight sentence
      let insight, icon;
      const t = (f) => this._fmtTime(new Date(f.datetime));
      const wc = (warning && warning.cond) || cond;
      if (warning && (wc.indexOf('lightning') >= 0 || wc.indexOf('wind') >= 0)) {
        insight = 'Bring loose things in from outside before it picks up.';
        icon = I.alert;
      } else if (warning && (wc.indexOf('snow') >= 0 || wc === 'hail')) {
        insight = 'Slippery out there. Take it slow on the roads and paths.';
        icon = I.alert;
      } else if (ncAny) {
        const tm = (p) => this._fmtTime(new Date(p.datetime));
        if (ncWet(nc[0])) {
          // a dry spell needs at least 10 minutes, so a single dry step between showers doesn't count
          const dry = nc.findIndex((p, i) => !ncWet(p) && (i === nc.length - 1 || !ncWet(nc[i + 1])));
          if (dry > 0) {
            const again = nc.findIndex((p, i) => i > dry && ncWet(p));
            const end = nc[nc.length - 1];
            if (again > 0) {
              insight = 'Rain stops around ' + tm(nc[dry]) + ', starts again around ' + tm(nc[again]) + '.';
            } else {
              // beyond the nowcast, look at the hourly forecast
              const later = next12.find((f) => Date.parse(f.datetime) > Date.parse(end.datetime) && wet(f));
              const lastHour = next12.length ? next12[next12.length - 1] : null;
              if (later) insight = 'Rain stops around ' + tm(nc[dry]) + ', back around ' + t(later) + '.';
              else if (lastHour && Date.parse(lastHour.datetime) > Date.parse(end.datetime)) insight = 'Rain stops around ' + tm(nc[dry]) + ', dry after that.';
              else insight = 'Rain stops around ' + tm(nc[dry]) + ', dry after that.';
            }
            icon = I.clock;
          } else { insight = 'Rain for at least the next two hours. Take an umbrella.'; icon = I.umbrella; }
        } else {
          const start = nc.findIndex(ncWet);
          let peak = start;
          nc.forEach((p, i) => { if ((num(p.precipitation) || 0) > (num(nc[peak].precipitation) || 0)) peak = i; });
          const mins = Math.max(5, Math.round((Date.parse(nc[start].datetime) - now.getTime()) / 60000 / 5) * 5);
          insight = (mins <= 30 ? 'Rain in about ' + mins + ' minutes' : 'Rain from about ' + tm(nc[start])) + (peak !== start ? ', heaviest around ' + tm(nc[peak]) : '') + '.';
          icon = I.umbrella;
        }
      } else if (rainNow && !nc.length) {
        const dry = next12.findIndex((f) => !wet(f));
        const again = dry > 0 ? next12.findIndex((f, i) => i > dry && wet(f)) : -1;
        if (dry > 0 && again > 0) { insight = 'Rain stops around ' + t(next12[dry]) + ', starts again around ' + t(next12[again]) + '.'; icon = I.clock; }
        else if (dry > 0) { insight = 'Rain stops around ' + t(next12[dry]) + ', dry after that.'; icon = I.clock; }
        else if (dry === 0) { insight = 'Rain is easing off, dry within the hour.'; icon = I.clock; }
        else { insight = 'Wet for the next ' + (next12.length || 12) + ' hours. Take an umbrella.'; icon = I.umbrella; }
      } else if (firstWet >= 0) {
        let peak = firstWet;
        next12.forEach((f, i) => { if ((num(f.precipitation) || 0) > (num(next12[peak].precipitation) || 0)) peak = i; });
        insight = 'Rain from about ' + t(next12[firstWet]) + (peak !== firstWet ? ', heaviest around ' + t(next12[peak]) : '') + '.';
        icon = I.umbrella;
      } else if (SNOWY.indexOf(cond) >= 0 || (temps12.length && Math.min.apply(null, temps12.map((v) => this._toC(v, unit))) <= 0)) {
        insight = 'Freezing, down to ' + round(temps12.length ? Math.min.apply(null, temps12) : temp) + '°. Watch for slippery paths.';
        icon = I.alert;
      } else if (cond === 'sunny' && sun && sun.attributes.next_setting) {
        insight = 'Sunny until ' + this._fmtTime(new Date(sun.attributes.next_setting)) + '. Good time to air the house.';
        icon = I.check;
      } else if (hourly && next12.length) {
        const low = Math.min.apply(null, temps12);
        insight = 'Dry for the next ' + next12.length + ' hours' + (night ? ', low of ' + round(low) + '°.' : '.');
        icon = this._toC(low, unit) < 8 ? I.coat : I.check;
      } else {
        insight = 'Dry for now.';
        icon = I.check;
      }
      if (warning && warning.detail && c.warning_detail !== false) { insight = warning.detail; icon = I.alert; }
      if (c.insight === false) insight = null;

      // hourly line
      const step = Math.max(1, Math.min(3, Number(c.hour_step) || 2));
      const hours = [{ temp, cond: atNight(cond, now.getTime()), label: 'Now' }];
      for (let i = step - 1; hours.length < 6 && i < fc.length; i += step) {
        const f = fc[i];
        hours.push({ mm: num(f.precipitation) || 0, temp: num(f.temperature), cond: hourly ? atNight(f.condition, Date.parse(f.datetime)) : f.condition, label: hourly ? this._fmtTime(new Date(f.datetime), false) : new Intl.DateTimeFormat(this._lang(), { weekday: 'short' }).format(new Date(f.datetime)) });
      }
      const ht = hours.map((x) => x.temp).filter((v) => v != null);
      let mn = Math.min.apply(null, ht) - 1, mx = Math.max.apply(null, ht) + 1;
      if (model.details && ht.length) {
        // a tall chart needs a sensible range, or a flat night looks like a cliff
        const mid = (mn + mx) / 2, half = Math.max(3, (mx - mn) / 2);
        mn = mid - half; mx = mid + half;
      }
      const pts = hours.map((x, i) => [25 + i * 50, 40 - ((x.temp ?? mn) - mn) / ((mx - mn) || 1) * 34]);
      const line = hours.length > 1 ? 'M' + pts.map((p) => p[0] + ' ' + p[1].toFixed(1)).join('L') : '';
      const area = line ? line + 'L' + pts[pts.length - 1][0] + ' 46L25 46Z' : '';

      // rain bars: 5-minute nowcast when it shows rain, otherwise hourly
      let bars, ticks, rainAria;
      if (ncAny) {
        const maxN = Math.max(2, ...nc.map((p) => num(p.precipitation) || 0));
        bars = nc.map((p) => { const v = (num(p.precipitation) || 0) / maxN; return { h: Math.round(Math.min(1, v) * 100), o: v > 0 ? 1 : 0.35 }; });
        ticks = [0, 6, 12, 18, nc.length - 1].filter((i, k, a) => i < nc.length && a.indexOf(i) === k).map((i) => (i === 0 ? 'Now' : this._fmtTime(new Date(nc[i].datetime))));
        rainAria = 'Rain for the next ' + Math.round(nc.length * 5) + ' minutes';
      } else {
      const maxP = Math.max(2, ...next12.map((f) => num(f.precipitation) || 0));
      bars = next12.map((f) => {
        const p = num(f.precipitation);
        const v = p != null && (p > 0 || f.precipitation_probability == null) ? p / maxP : (num(f.precipitation_probability) || 0) / 100 * 0.6;
        return { h: Math.round(Math.min(1, v) * 100), o: v > 0 ? 1 : 0.35 };
      });
      ticks = next12.length ? [0, 3, 6, 9, 11].filter((i) => i < next12.length).map((i) => (i === 0 ? 'Now' : this._fmtTime(new Date(next12[i].datetime), false))) : [];
      rainAria = 'Rain for the next ' + next12.length + ' hours';
      }

      // details: high and low, rain chance, wind, the next sunrise or sunset
      let stats = null, rainMarks = '';
      if (model.details) {
        stats = [];
        const t24 = (hourly ? fc.slice(0, 24) : fc.slice(0, 1)).map((f) => num(f.temperature)).concat(hourly ? [temp] : []).filter((v) => v != null);
        const lo24 = hourly ? fc.slice(0, 24).map((f) => num(f.templow != null ? f.templow : f.temperature)) : fc.slice(0, 1).map((f) => num(f.templow));
        const lows = lo24.concat(t24).filter((v) => v != null);
        if (t24.length) stats.push({ k: 'High / low', v: round(Math.max.apply(null, t24)) + '° / ' + round(Math.min.apply(null, lows)) + '°' });
        const probs = next12.map((f) => num(f.precipitation_probability)).filter((v) => v != null);
        const mmSum = next12.reduce((sum, f) => sum + (num(f.precipitation) || 0), 0);
        if (probs.length) stats.push({ k: 'Rain', v: Math.round(Math.max.apply(null, probs)) + '%' });
        else if (next12.length) stats.push({ k: 'Rain', v: (Math.round(mmSum * 10) / 10).toLocaleString(this._lang()) + ' mm' });
        const ws = num(oa.wind_speed) != null ? num(oa.wind_speed) : num(at.wind_speed);
        const wb = num(oa.wind_bearing) != null ? num(oa.wind_bearing) : num(at.wind_bearing);
        if (ws != null) {
          const dir = wb != null ? ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(((wb % 360) + 360) % 360 / 45) % 8] + ' ' : '';
          stats.push({ k: 'Wind', v: dir + Math.round(ws) + ' ' + (oa.wind_speed_unit || at.wind_speed_unit || 'km/h') });
        }
        if (!isNaN(rise) && !isNaN(set)) stats.push(rise < set ? { k: 'Sunrise', v: this._fmtTime(new Date(rise)) } : { k: 'Sunset', v: this._fmtTime(new Date(set)) });
        // rain under the temperature line, per point
        const maxMm = Math.max(2, ...hours.map((x) => x.mm || 0));
        rainMarks = hours.map((x, i) => (x.mm > 0 ? `<rect x="${25 + i * 50 - 7}" y="${(46 - Math.max(1.5, x.mm / maxMm * 16)).toFixed(1)}" width="14" height="${Math.max(1.5, x.mm / maxMm * 16).toFixed(1)}" rx="2" style="fill:${BLUE};opacity:.8"></rect>` : '')).join('');
      }

      return Object.assign(model, {
        stats, rainMarks,
        cond: atNight(cond, now.getTime()), unit: unit.replace('°', ''), temp, label: this._stateText(w), feels: feelsBits.join(' · '),
        tempCol: tempColour(this._toC(temp, unit) ?? 10),
        insight, icon, hours: hours.map((x) => Object.assign(x, { col: x.temp == null ? 'inherit' : tempColour(this._toC(x.temp, unit)) })),
        line, area, showRain, bars, ticks, rainAria
      });
    }

    // ----- Render -----
    _art(cond, size) {
      const layers = ART[cond] || ART.cloudy;
      const p = layers.map((l, i) => {
        if (!l || !l[0]) return '';
        return i < 2 ? `<path d="${l[0]}" style="fill:${l[1]}"></path>` : `<path d="${l[0]}" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="stroke:${l[1]}"></path>`;
      }).join('');
      return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true" style="flex-shrink:0">${p}</svg>`;
    }

    _icon(d, size = 18) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"></path></svg>`;
    }

    _render(force) {
      if (!this._hass || !this._config) return;
      const c = this._config;
      const layout = c.layout === 'stacked' || (c.layout !== 'wide' && this._width > 0 && this._width < 560) ? 'stacked' : 'wide';
      this._layout = layout;
      if (this._on(c.coming_up, layout) && (c.calendars || []).length && Date.now() - (this._calAt || 0) > 15 * 60000) this._fetchCal();
      const m = this._model();
      if (this._menu && !m.menu.length) this._menu = false;
      const key = JSON.stringify([m, layout, c, !!this._menu]);
      if (!force && key === this._last) return;
      this._last = key;

      const cls = [layout === 'stacked' ? 'stacked' : '', c.show_clock === false ? 'no-clock' : ''].join(' ');
      if (m.missing) {
        morph(this.shadowRoot, `<style>${STYLE}${MOTION}</style><ha-card class="${cls}"><div class="empty">Weather entity not found: ${esc(m.missing)}</div></ha-card>`);
        return;
      }
      const g = this._gid;
      const stops = m.hours.map((x, i) => `<stop offset="${((25 + i * 50) / 300).toFixed(3)}" style="stop-color:${x.col}"></stop>`).join('');
      const chart = m.showRain
        ? `<div class="chart"><div class="bars" role="img" aria-label="${esc(m.rainAria)}">${m.bars.map((b) => `<span style="height:${b.h}%;opacity:${b.o}"></span>`).join('')}</div>
             <div class="ticks">${m.ticks.map((t) => `<span>${esc(t)}</span>`).join('')}</div></div>`
        : (m.hours.length > 1 ? `<div class="chart">
             <div class="plot"><svg width="100%" height="34" viewBox="0 0 300 46" preserveAspectRatio="none" aria-hidden="true">
               <defs><linearGradient id="${g}" x1="0" x2="1" y1="0" y2="0">${stops}</linearGradient></defs>
               <path d="${m.area}" stroke="none" style="fill:url(#${g});opacity:.28"></path>
               ${m.rainMarks || ''}
               <path d="${m.line}" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" style="stroke:url(#${g})"></path>
             </svg></div>
             <div class="hours" style="grid-template-columns: repeat(${m.hours.length}, minmax(0,1fr))">${m.hours.map((x) => `<span class="hour"><b style="color:${x.col}">${round(x.temp)}°</b>${window.customIcons && window.customIcons.lucide ? `<ha-icon icon="lucide:${HOUR_LUCIDE[x.cond] || 'cloud'}" style="--mdc-icon-size:18px"></ha-icon>` : this._icon(HOUR_ICON[x.cond] || I.cloud)}<span>${esc(x.label)}</span></span>`).join('')}</div>
           </div>` : '');

      const issueText = m.issues.map((x) => x.text).join(' · ');
      this._m = m;
      morph(this.shadowRoot, `<style>${STYLE}${MOTION}</style>
        <ha-card class="${cls}">
          ${m.warning ? `<button class="warn" data-entity="${esc(m.warning.entity)}">${this._icon(I.alert, 16)}${esc(m.warning.strip)}</button>` : ''}
          <div class="body">
            <div class="home">
              <div class="top">
                <div style="display:flex;flex-direction:column;gap:4px">
                  <span class="date">${esc(m.date)}</span>
                  <span class="time serif">${esc(m.time)}</span>
                </div>
                <button class="chip" data-entity="${esc(c.weather)}" aria-label="${esc(m.label)}, ${round(m.temp)} degrees">
                  ${this._art(m.cond, 44)}<span class="serif" style="color:${m.tempCol}">${round(m.temp)}°</span>
                </button>
              </div>
              ${m.agenda ? `<div class="agenda">${c.calendar_popup ? `<button class="k" data-nav="${esc(c.calendar_popup)}" aria-label="Open the calendar">Coming up</button>` : '<span class="k">Coming up</span>'}${m.agenda.length ? m.agenda.map((e) => `<button class="ev" ${c.calendar_popup ? `data-nav="${esc(c.calendar_popup)}"` : `data-entity="${esc(e.id)}"`} aria-label="${esc(e.aria)}"><span class="day"><small>${esc(e.wd)}</small><span class="serif">${e.n}</span></span><span class="txt"><span class="what">${esc(e.what)}</span><span class="when">${esc(e.when)}</span></span></button>`).join('') : (c.calendar_popup ? `<button class="none" data-nav="${esc(c.calendar_popup)}">Nothing planned this week.</button>` : '<span class="none">Nothing planned this week.</span>')}</div>` : ''}
              <div class="stack">
                ${m.issues.length || m.bins || m.lamps ? `<div class="chips">${m.issues.length ? `<button class="issue" data-entity="${esc(m.issues[0].id)}"><span class="n">${m.issues.length}</span><span>${esc(issueText)}</span></button>` : ''}${m.bins ? `<button class="bins" data-bins="1" aria-label="${esc(m.bins.text)}"><span class="n">${m.bins.colours.map((col) => `<svg width="${m.bins.colours.length > 1 ? 17 : 20}" height="${m.bins.colours.length > 1 ? 17 : 20}" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l-1 13a1.5 1.5 0 0 1-1.5 1.4h-7A1.5 1.5 0 0 1 7 20zM4.5 5h15M10 3h4" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke:${col}"></path><path d="M7.4 10h9.2l-.7 10H8.1z" style="fill:${col}"></path></svg>`).join('')}</span><span>${esc(m.bins.text)}</span></button>` : ''}${m.lamps ? `<button class="lamps" data-lights aria-haspopup="dialog" aria-expanded="${!!this._menu}"><span class="n">${this._icon(I.bulb, 16)}${m.lamps.n}</span><span>${esc(m.lamps.text)}</span>${this._icon(I.chev, 16)}</button>` : ''}</div>` : ''}
                ${c.home_text ? `<p>${esc(m.homeText)}</p>` : ''}
                ${m.insight ? `<p class="insight">${this._icon(m.icon)}<span>${esc(m.insight)}</span></p>` : ''}
              </div>
            </div>
            <div class="weather${m.details ? ' fill' : ''}" role="button" tabindex="0" data-entity="${esc(c.weather)}" aria-label="${esc(m.label)}, ${round(m.temp)} degrees">
              <div class="head">
                ${this._art(m.cond, 64)}
                <span class="names"><span class="label">${esc(m.label)}</span><span class="feels">${esc(m.feels)}</span></span>
                <span class="temp serif" style="color:${m.tempCol}">${round(m.temp)}<small>°${esc(m.unit)}</small></span>
              </div>
              ${m.stats && m.stats.length ? `<div class="stats">${m.stats.map((x) => `<span class="stat"><span class="k">${esc(x.k)}</span><b>${esc(x.v)}</b></span>`).join('')}</div>` : ''}
              ${chart}
            </div>
          </div>
          ${this._menu ? `<div class="menu" role="dialog" aria-label="Lights that are on">
            <div class="mhead"><span class="mtitle">Lights on</span><button class="mbtn" data-close aria-label="Close">${this._icon(I.close)}</button></div>
            <div class="mlist">${m.menu.map((g) => `<div class="mgroup">
              <span class="mlabel">${g.items.length > 1 || g.items[0].id !== g.id ? esc(g.name) : (esc(this._area(g.id) || '') || '&nbsp;')}</span>
              ${g.items.map((x) => `<div class="mrow">
                <button class="mname" data-entity="${esc(x.id)}"><span>${esc(x.name)}</span>${x.level ? `<small>${esc(x.level)}</small>` : ''}</button>
                <button class="mbtn" data-off="${esc(x.id)}" aria-label="Turn off ${esc(x.name)}">${this._icon(I.power)}</button>
              </div>`).join('')}</div>`).join('')}</div>
            <button class="alloff" data-alloff>${this._icon(I.power, 16)}All off</button>
          </div>` : ''}
        </ha-card>`);
      this._fit();
      if (!this._wired) {
        this._wired = true;
        // one set of listeners for the whole card; they survive in-place updates
        const find = (ev) => ev.composedPath().find((el) => el.getAttribute && ['data-bins', 'data-entity', 'data-lights', 'data-close', 'data-off', 'data-alloff', 'data-nav'].some((a) => el.hasAttribute(a)));
        const run = (el) => {
          const cfg = this._config, mm = this._m || {};
          if (el.hasAttribute('data-nav')) {
            // a pop-up hash like #calendar, or a dashboard path
            const path = el.getAttribute('data-nav');
            history.pushState(null, '', path.charAt(0) === '#' ? window.location.pathname + window.location.search + path : path);
            window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
            return;
          }
          if (el.hasAttribute('data-lights')) { this._menu = !this._menu; this._render(true); return; }
          if (el.hasAttribute('data-close')) { this._menu = false; this._render(true); return; }
          if (el.hasAttribute('data-off')) { this._hass.callService('homeassistant', 'turn_off', { entity_id: el.getAttribute('data-off') }); return; }
          if (el.hasAttribute('data-alloff')) {
            const ids = (mm.menu || []).map((g) => g.id);
            if (ids.length) this._hass.callService('homeassistant', 'turn_off', { entity_id: ids });
            this._menu = false; this._render(true); return;
          }
          if (el.hasAttribute('data-bins')) {
            if (cfg.waste_out) this._hass.callService('homeassistant', 'turn_on', { entity_id: cfg.waste_out });
            else if (mm.bins) this._moreInfo(mm.bins.id);
          } else this._moreInfo(el.getAttribute('data-entity'));
        };
        this.shadowRoot.addEventListener('click', (ev) => { const el = find(ev); if (el) { ev.stopPropagation(); run(el); } });
        this.shadowRoot.addEventListener('keydown', (ev) => {
          if (ev.key === 'Escape' && this._menu) { this._menu = false; this._render(true); return; }
          if (ev.key !== 'Enter' && ev.key !== ' ') return;
          const el = find(ev); if (el && el.tagName !== 'BUTTON') { ev.preventDefault(); run(el); }
        });
      }
    }
  }

  // ---------- Visual editor ----------
  const SHOW_OPTS = [{ value: 'show', label: 'Show' }, { value: 'wide', label: 'Desktop only (side-by-side layout)' }, { value: 'hide', label: 'Hide' }];
  const SCHEMA = [
    { name: 'weather', required: true, selector: { entity: { domain: 'weather' } } },
    { name: 'issues', selector: { entity: { multiple: true } } },
    { name: 'lights', selector: { entity: { multiple: true, domain: ['light', 'switch'] } } },
    { name: 'weather_now', selector: { entity: { domain: 'weather' } } },
    { name: 'warning', selector: { entity: { multiple: true, domain: ['binary_sensor', 'sensor'] } } },
    { name: 'warning_text', selector: { select: { mode: 'dropdown', options: [{ value: 'english', label: 'English: warning type and advice' }, { value: 'original', label: 'Original text from the source (KNMI is Dutch)' }] } } },
    { name: 'warning_detail', selector: { boolean: {} } },
    { name: 'rain_nowcast', selector: { entity: { domain: ['binary_sensor', 'sensor'] } } },
    { name: 'warning_from', selector: { select: { mode: 'dropdown', options: [{ value: 'yellow', label: 'Code yellow and up' }, { value: 'orange', label: 'Code orange and up' }, { value: 'red', label: 'Code red only' }] } } },
    {
      type: 'expandable', name: 'bins', flatten: true, title: 'Waste collection', icon: 'mdi:delete-outline',
      schema: [
        { name: 'waste', selector: { entity: { multiple: true, domain: 'sensor' } } },
        { name: 'waste_out', selector: { entity: { domain: 'input_boolean' } } },
        { name: 'waste_remind_from', selector: { time: {} } },
        { name: 'waste_collected_by', selector: { time: {} } }
      ]
    },
    {
      type: 'expandable', name: 'agenda', flatten: true, title: 'Coming up', icon: 'mdi:calendar-outline',
      schema: [
        { name: 'coming_up', selector: { select: { mode: 'dropdown', options: SHOW_OPTS } } },
        { name: 'calendars', selector: { entity: { multiple: true, domain: 'calendar' } } },
        { name: 'coming_up_count', selector: { number: { min: 1, max: 5, step: 1, mode: 'slider' } } },
        { name: 'calendar_popup', selector: { text: {} } }
      ]
    },
    {
      type: 'expandable', name: 'laundry', flatten: true, title: 'Washing machine', icon: 'mdi:washing-machine',
      schema: [
        { name: 'laundry_done', selector: { entity: {} } },
        { name: 'laundry_done_at', selector: { entity: { domain: ['sensor', 'input_datetime'] } } },
        { name: 'laundry_name', selector: { text: {} } }
      ]
    },
    {
      type: 'expandable', name: 'appearance', flatten: true, title: 'Appearance', icon: 'mdi:palette',
      schema: [
        { name: 'layout', selector: { select: { mode: 'dropdown', options: [
          { value: 'auto', label: 'Automatic (stacks when narrow)' },
          { value: 'wide', label: 'Side by side' },
          { value: 'stacked', label: 'Stacked' }
        ] } } },
        { name: 'weather_details', selector: { select: { mode: 'dropdown', options: SHOW_OPTS } } },
        { name: 'hour_step', selector: { number: { min: 1, max: 3, step: 1, mode: 'slider' } } },
        { name: 'show_clock', selector: { boolean: {} } },
        { name: 'insight', selector: { boolean: {} } },
        { name: 'match_row', selector: { boolean: {} } },
        { name: 'home_text', selector: { text: {} } }
      ]
    }
  ];
  const LABELS = {
    weather: 'Weather',
    issues: 'Things to watch',
    lights: 'Lights',
    warning: 'Weather warning sensors',
    weather_now: 'Current conditions (optional)',
    warning_from: 'Show warnings from',
    warning_detail: 'Show the warning text on the card',
    warning_text: 'Warning language',
    rain_nowcast: 'Rain in the next two hours (optional)',
    layout: 'Layout',
    hour_step: 'Hours between points on the chart',
    weather_details: 'Weather details',
    coming_up: 'Show coming up',
    calendars: 'Calendars',
    coming_up_count: 'How many days to show',
    calendar_popup: 'Pop-up to open',
    show_clock: 'Show the clock',
    insight: 'Show the weather tip',
    match_row: 'As tall as the cards next to it',
    home_text: 'Fixed home sentence',
    laundry_done: 'Done sensor',
    laundry_done_at: 'Finished at',
    laundry_name: 'Name',
    waste: 'Waste sensors (Afvalwijzer)',
    waste_out: 'Bins out helper',
    waste_remind_from: 'Remind from (the evening before)',
    waste_collected_by: 'Collected by (on the day)'
  };
  const HELPERS = {
    issues: 'Doors, windows, locks or leak sensors. They show in red when open, unlocked or on.',
    lights: 'Lights, or switches that power a light. Used for the sentence “Lights on in …”, grouped by area.',
    warning: 'Optional. One or more: MeteoAlarm, or the warning sensors from KNMI / NL Weather. The highest level wins.',
    rain_nowcast: 'A sensor with a 5-minute rain forecast in its forecast attribute, such as NL Weather’s Precipitation forecasted. Shows rain to the minute.',
    weather_now: 'Optional. A second weather entity for the current temperature, such as the NL Weather observations. The forecast still comes from Weather.',
    home_text: 'Leave empty to write it automatically.',
    weather_details: 'High and low, rain chance, wind and sunrise or sunset, and a chart that uses the full height of the card. Desktop only leaves it out when the card stacks on a phone.',
    coming_up: 'The next events from your calendars under the clock, and the next bin collection. Desktop only leaves it out when the card stacks on a phone.',
    calendars: 'One or more calendars. Events from the coming week.',
    calendar_popup: 'Optional. The Bubble pop-up hash, for example #calendar, opened by tapping Coming up. Leave empty to open the calendar’s details instead.',
    laundry_done: 'Shows a reminder while this is on or done.',
    laundry_done_at: 'Optional. A timestamp sensor or date-time helper. Without it, the card uses the moment the done sensor changed.',
    laundry_name: 'Defaults to “Washing machine”.',
    waste: 'Pick the Afvalwijzer sensors for each bin (gft, papier, pmd, restafval). Shows a reminder the evening before.',
    waste_out: 'Optional toggle helper. Tapping the reminder switches it on and hides it until the next collection.'
  };

  class CranberryHomeCardEditor extends HTMLElement {
    setConfig(config) {
      this._config = Object.assign({ show_clock: true, insight: true, layout: 'auto', hour_step: 2, match_row: true }, config);
      // list fields must be lists for the pickers to draw; older setups stored a single entity
      ['warning', 'lights', 'waste'].forEach((k) => {
        const v = this._config[k];
        if (typeof v === 'string' && v && v !== 'auto') this._config[k] = [v];
        else if (v === 'auto' || v === '') delete this._config[k];
      });
      // YAML may use { entity, name } items; the picker needs plain ids
      if ((this._config.issues || []).some((x) => typeof x !== 'string')) {
        const names = Object.assign({}, this._config.issue_names);
        this._config.issues = this._config.issues.map((x) => {
          if (typeof x === 'string') return x;
          if (x && x.name && x.entity) names[x.entity] = x.name;
          return x && x.entity;
        }).filter(Boolean);
        this._config.issue_names = names;
      }
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      if (this._form) this._form.hass = hass;
      else this._render();
    }

    _issueIds() {
      return (this._config.issues || []).map((x) => (typeof x === 'string' ? x : x && x.entity)).filter(Boolean);
    }

    async connectedCallback() {
      if (!customElements.get('ha-form') && window.loadCardHelpers) {
        try {
          const helpers = await window.loadCardHelpers();
          const card = await helpers.createCardElement({ type: 'entities', entities: [] });
          if (card && card.constructor && card.constructor.getConfigElement) await card.constructor.getConfigElement();
        } catch (e) { /* ha-form usually exists already */ }
      }
      this._render();
    }

    _render() {
      if (!this._hass || !this._config) return;
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.computeLabel = (s) => {
          if (s.name && s.name.indexOf('name__') === 0) {
            const id = s.name.slice(6), st = this._hass.states[id];
            return (st && st.attributes.friendly_name) || id;
          }
          return LABELS[s.name] || s.title || s.name;
        };
        this._form.computeHelper = (s) => (s.name && s.name.indexOf('name__') === 0 ? 'Leave empty to use the entity name' : HELPERS[s.name]);
        this._form.addEventListener('value-changed', (ev) => {
          ev.stopPropagation();
          const config = Object.assign({}, ev.detail.value);
          const keep = (config.issues || []).map((x) => (typeof x === 'string' ? x : x && x.entity));
          const issueNames = {};
          Object.keys(config).forEach((k) => {
            if (k.indexOf('name__') === 0) {
              const id = k.slice(6);
              if (config[k] && keep.indexOf(id) >= 0) issueNames[id] = config[k];
              delete config[k];
            }
          });
          if (Object.keys(issueNames).length) config.issue_names = issueNames; else delete config.issue_names;
          Object.keys(config).forEach((k) => {
            if (config[k] === '' || (Array.isArray(config[k]) && !config[k].length)) delete config[k];
          });
          this._config = config;
          this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
          this._render();
        });
        this.appendChild(this._form);
      }
      const ids = this._issueIds();
      const names = this._config.issue_names || {};
      const schema = SCHEMA.slice();
      if (ids.length) {
        schema.splice(2, 0, {
          type: 'expandable', name: 'names', flatten: true, title: 'Names for things to watch', icon: 'mdi:rename-outline',
          schema: ids.map((id) => ({ name: 'name__' + id, selector: { text: {} } }))
        });
      }
      const data = Object.assign({}, this._config);
      ids.forEach((id) => { data['name__' + id] = names[id] || ''; });
      this._form.hass = this._hass;
      this._form.schema = schema;
      this._form.data = data;
    }
  }

  if (!customElements.get(TAG)) customElements.define(TAG, CranberryHomeCard);
  if (!customElements.get(EDITOR_TAG)) customElements.define(EDITOR_TAG, CranberryHomeCardEditor);

  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === TAG)) {
    window.customCards.push({
      type: TAG,
      name: 'Cranberry home card',
      description: 'Time, what needs your attention at home, and the weather in one cranberry card.',
      preview: true,
      documentationURL: ''
    });
  }
  console.info('%c CRANBERRY-HOME-CARD %c ' + VERSION + ' ', 'background:#591E21;color:#F2ECE0;font-weight:700', 'background:#E3DDCF;color:#591E21');
})();

/*
 * Cranberry cards: status, room, scene and music.
 * Each is its own card with a visual editor. They follow the Cranberry Canvas theme
 * (cc-cranberry, cc-olive, cc-quail, cc-brick) and fall back to the light palette.
 */
(() => {
  // Use Lucide icons when the Lucide icons integration is installed, otherwise Home Assistant's own.
  const LUCIDE = { vacation: 'plane', car: 'car', pin: 'map-pin', nav: 'navigation', plus: 'plus', minus: 'minus', chev: 'chevron-down', home: 'house', radiator: 'heater', thermometer: 'thermometer', evening: 'sunset', night: 'moon', walk: 'footprints', people: 'users', washer: 'washing-machine', alert: 'triangle-alert', check: 'check', 'chevron-right': 'chevron-right', info: 'info', lock: 'lock', 'lock-open': 'lock-open', shield: 'shield-check', 'shield-off': 'shield-off', play: 'play', pause: 'pause', stop: 'square', 'skip-next': 'skip-forward', 'skip-previous': 'skip-back', bulb: 'lightbulb', power: 'power' };
  const ccIcon = (name, fallback) => (window.customIcons && window.customIcons.lucide && LUCIDE[name] ? 'lucide:' + LUCIDE[name] : fallback);
  const { morph, MOTION } = window.CranberryMorph;
  const FONT_URL = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,400..600,100&family=Figtree:wght@400;500;600;700&display=swap';
  const loadFonts = () => {
    if (document.getElementById('cranberry-home-card-fonts')) return;
    const l = document.createElement('link');
    l.id = 'cranberry-home-card-fonts'; l.rel = 'stylesheet'; l.href = FONT_URL;
    document.head.appendChild(l);
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const listJoin = (a) => a.length <= 1 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' & ' + a[a.length - 1];
  const firstName = (s) => String(s || '').split(' ')[0];

  const BASE = `
    :host { display: block; height: 100%;
      --cc-c: var(--cc-cranberry, #591E21); --cc-o: var(--cc-olive, #514718); --cc-q: var(--cc-quail, #7D8689); --cc-b: var(--cc-brick, #A8352F);
      --cc-h: var(--cc-harbour, #40606A); --cc-ochre: var(--cc-ochre-tone, #8E6420);
      --cc-card: var(--ha-card-background, var(--card-background-color, #EEE9DF));
      --cc-text: var(--primary-text-color, #231C1A); --cc-muted: var(--secondary-text-color, #6E6560);
      --cc-bgc: var(--primary-background-color, #E3DDCF); --cc-on: #F2ECE0;
      --cc-c-t: color-mix(in srgb, var(--cc-c) 15%, transparent);
      --cc-o-t: color-mix(in srgb, var(--cc-o) 18%, transparent);
      --cc-q-t: color-mix(in srgb, var(--cc-q) 20%, transparent); }
    ha-card { height: 100%; box-sizing: border-box; border: 0; border-radius: var(--cc-r-card, 24px); background: var(--cc-card); color: var(--cc-text); overflow: hidden; position: relative;
      font-family: Figtree, var(--ha-font-family-body, sans-serif); }
    button { font: inherit; color: inherit; border: 0; background: none; padding: 0; margin: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
    button:focus-visible, .tap:focus-visible { outline: 2px solid var(--cc-c); outline-offset: 2px; }
    .ic { flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: var(--cc-r-ctl, 12px); }
    .ic ha-icon { --mdc-icon-size: 20px; }
    .txt { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .name { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .state { font-size: 12px; font-weight: 500; color: var(--cc-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .na { opacity: .55; }
  `;

  class CranberryBase extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); this._last = ''; }
    setConfig(config) {
      if (!config || (this.constructor.needsEntity !== false && !config.entity)) throw new Error('Pick an entity');
      this._config = Object.assign({}, this.constructor.defaults || {}, config);
      if (this._config.load_fonts !== false) loadFonts();
      this._last = '';
      if (this._hass) this._update();
    }
    set hass(h) { this._hass = h; this._update(); }
    getCardSize() { return 1; }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 3 }; }
    st(id) { return this._hass && id ? this._hass.states[id] : undefined; }
    _editing() {
      // keep the card visible while the dashboard or the card itself is being edited
      return !!(this.preview || this.editMode || /[?&]edit=1/.test(window.location.search));
    }
    _setQuiet(hide) {
      if (this._hiddenQuiet === hide) return;
      this._hiddenQuiet = hide;
      this.style.display = hide ? 'none' : '';
      this.toggleAttribute('hidden', hide);
      this.dispatchEvent(new CustomEvent('card-visibility-changed', { detail: { value: !hide }, bubbles: true, composed: true }));
    }
    set preview(v) { this._preview = v; this._last = ''; this._update(); }
    get preview() { return this._preview; }
    set editMode(v) { this._editMode = v; this._last = ''; this._update(); }
    get editMode() { return this._editMode; }
    nm(id) {
      const st = this.st(id), reg = this._hass.entities && this._hass.entities[id];
      return (reg && reg.name) || (st && st.attributes.friendly_name) || id;
    }
    fmt(st) {
      if (!st) return 'Unavailable';
      if (this._hass.formatEntityState) { try { return this._hass.formatEntityState(st); } catch (e) { /* ignore */ } }
      return st.state;
    }
    call(domain, service, data) { return this._hass.callService(domain, service, data); }
    moreInfo(entityId) { this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true })); }
    navigate(path) {
      if (!path) return;
      if (path.charAt(0) === '#') {
        history.pushState(null, '', window.location.pathname + window.location.search + path);
      } else {
        history.pushState(null, '', path);
      }
      window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
    }
    _update() {
      if (!this._hass || !this._config) return;
      const m = this.model();
      const key = JSON.stringify(m);
      if (key === this._last) return;
      this._last = key;
      this._m = m;
      this._setQuiet(!!m.quiet && this._config.hide_when_quiet !== false && !this._editing());
      morph(this.shadowRoot, `<style>${BASE}${this.constructor.styles || ''}${MOTION}</style>${this.view(m)}`);
      if (!this._wired) {
        this._wired = true;
        const find = (ev) => ev.composedPath().find((el) => el.getAttribute && el.hasAttribute('data-act'));
        const run = (el) => this.act(el.getAttribute('data-act'), el.getAttribute('data-arg'), this._m);
        this.shadowRoot.addEventListener('click', (ev) => { const el = find(ev); if (el && !el.disabled) { ev.stopPropagation(); run(el); } });
        this.shadowRoot.addEventListener('keydown', (ev) => {
          if (ev.key !== 'Enter' && ev.key !== ' ') return;
          const el = find(ev); if (el && el.tagName !== 'BUTTON') { ev.preventDefault(); run(el); }
        });
      }
    }
  }

  // ---------------------------------------------------------------- status
  const ALARM_MODES = {
    armed_home: { icon: ccIcon('home', 'mdi:home-outline'), label: 'Home', service: 'alarm_arm_home' },
    armed_away: { icon: ccIcon('walk', 'mdi:walk'), label: 'Away', service: 'alarm_arm_away' },
    armed_night: { icon: ccIcon('night', 'mdi:weather-night'), label: 'Night', service: 'alarm_arm_night' },
    armed_vacation: { icon: ccIcon('vacation', 'mdi:airplane'), label: 'Vacation', service: 'alarm_arm_vacation' },
    disarmed: { icon: ccIcon('shield-off', 'mdi:shield-off-outline'), label: 'Off', service: 'alarm_disarm' }
  };
  class CranberryStatusCard extends CranberryBase {
    static get styles() {
      return `
      .row { display: flex; align-items: center; gap: 10px; min-height: 56px; padding: 8px 8px 8px 10px; box-sizing: border-box; height: 100%; }
      .ic { width: 38px; height: 38px; }
      .btns { display: flex; gap: 6px; flex-shrink: 0; width: var(--btns-w, auto); }
      .btns button { flex: 1; min-width: 42px; height: 42px; border-radius: var(--cc-r-ctl, 12px); display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; font-weight: 600; background: var(--tint); color: var(--cc-text); padding: 0 10px; }
      .btns button[aria-pressed="true"] { background: var(--ic); color: var(--cc-on); }
      .btns ha-icon { --mdc-icon-size: 18px; }
      ha-card.alert { background: var(--cc-b); color: var(--cc-on); }
      ha-card.alert .state { color: color-mix(in srgb, var(--cc-on) 82%, var(--cc-b)); }
      ha-card.alert .btns button { background: var(--cc-on); color: var(--cc-b); }
      .tap { cursor: pointer; }
    `;
    }
    getGridOptions() { return { columns: 12, rows: 1, min_columns: 6 }; }

    model() {
      const c = this._config, st = this.st(c.entity);
      const domain = c.entity.split('.')[0];
      const m = { name: c.name || (st ? this.nm(c.entity) : c.entity), icon: c.icon || '', tone: 'quail', state: this.fmt(st), btns: [], alert: false, na: !st || st.state === 'unavailable' };
      if (!st) return m;
      const a = st.attributes;
      const unit = (this._hass.config && this._hass.config.unit_system && this._hass.config.unit_system.temperature) || '°C';
      const t = (v) => (v == null ? '–' : (Math.round(v * 10) / 10).toLocaleString(this._lang()) + (c.short ? '°' : ' ' + unit));
      if (domain === 'climate') {
        m.icon = m.icon || ccIcon('radiator', 'mdi:radiator');
        const target = this._pending != null ? this._pending : a.temperature;
        const action = a.hvac_action;
        const heating = action === 'heating' || action === 'cooling';
        m.tone = st.state === 'off' ? 'quail' : 'olive';
        m.state = st.state === 'off' ? 'Off · ' + t(a.current_temperature)
          : (action === 'heating' ? 'Heating to ' : action === 'cooling' ? 'Cooling to ' : 'Holding ') + t(target) + ' · ' + t(a.current_temperature);
        if (target != null) {
          m.btns = [
            { act: 'temp', arg: '-1', label: '−', aria: 'Lower' },
            { act: 'more', label: (Math.round(target * 10) / 10).toLocaleString(this._lang()) + '°', pressed: heating, aria: 'Target ' + target },
            { act: 'temp', arg: '1', label: '+', aria: 'Raise' }];
        }
        m.btnsW = '44%';
      } else if (domain === 'lock') {
        const locked = st.state === 'locked';
        m.icon = m.icon || (locked ? ccIcon('lock', 'mdi:lock-outline') : ccIcon('lock-open', 'mdi:lock-open-variant-outline'));
        m.tone = locked ? 'olive' : 'quail';
        const alarm = this.st(c.alarm);
        const armed = alarm && String(alarm.state).indexOf('armed') === 0;
        if (['jammed', 'open', 'opening'].indexOf(st.state) >= 0 || (!locked && st.state !== 'locking' && (armed || c.alert_when_unlocked))) {
          m.alert = true;
          if (armed && !locked) m.state = this.fmt(st) + ' · alarm is on';
          m.btns = [{ act: 'lock', icon: ccIcon('lock', 'mdi:lock-outline'), label: 'Lock', aria: 'Lock' }];
        } else {
          m.btns = [{ act: 'lock', icon: ccIcon('lock', 'mdi:lock-outline'), pressed: locked, aria: 'Lock' }, { act: 'unlock', icon: ccIcon('lock-open', 'mdi:lock-open-variant-outline'), pressed: st.state === 'unlocked', aria: 'Unlock' }];
          m.btnsW = '44%';
        }
      } else if (domain === 'alarm_control_panel') {
        m.icon = m.icon || (st.state === 'disarmed' ? ccIcon('shield-off', 'mdi:shield-off-outline') : ccIcon('shield', 'mdi:shield-check-outline'));
        m.tone = st.state === 'disarmed' ? 'quail' : 'olive';
        m.alert = st.state === 'triggered' || st.state === 'pending';
        const modes = c.modes && c.modes.length ? c.modes : ['armed_home', 'armed_away', 'armed_night', 'disarmed'];
        m.btns = modes.filter((x) => ALARM_MODES[x]).map((x) => ({ act: 'alarm', arg: x, icon: ALARM_MODES[x].icon, pressed: st.state === x, aria: ALARM_MODES[x].label }));
        m.btnsW = '44%';
      } else if (domain === 'zone' || (c.people && c.people.length)) {
        const ids = c.people && c.people.length ? c.people : (a.persons || []);
        const ppl = ids.map((id) => ({ n: firstName(this.nm(id)), home: (this.st(id) || {}).state === 'home' }));
        const home = ppl.filter((p) => p.home);
        m.icon = m.icon || ccIcon('people', 'mdi:account-multiple-outline');
        m.name = c.name || (ppl.length && ppl.length <= 3 ? listJoin(ppl.map((p) => p.n)) : 'People');
        m.tone = home.length ? 'olive' : 'quail';
        if (!ppl.length) m.state = st.state + ' home';
        else if (home.length === ppl.length) m.state = ppl.length === 1 ? 'Home' : ppl.length === 2 ? 'Both home' : 'Everyone home';
        else if (!home.length) m.state = ppl.length === 1 ? 'Away' : 'Nobody home';
        else m.state = home.map((p) => p.n).join(' & ') + ' home · ' + ppl.filter((p) => !p.home).map((p) => p.n).join(' & ') + ' away';
      } else {
        m.icon = m.icon || ccIcon('info', 'mdi:information-outline');
        m.tone = ['on', 'home', 'open', 'playing'].indexOf(st.state) >= 0 ? 'olive' : 'quail';
      }
      if (m.na) m.tone = 'quail';
      return m;
    }
    _lang() { return (this._hass.locale && this._hass.locale.language) || this._hass.language || 'en'; }
    view(m) {
      const ic = m.tone === 'olive' ? 'var(--cc-o)' : 'var(--cc-q)';
      const tint = m.tone === 'olive' ? 'var(--cc-o-t)' : 'var(--cc-q-t)';
      const icStyle = m.alert ? 'background: rgba(242,236,224,.18); color: var(--cc-on)' : `background: ${tint}; color: ${ic}`;
      return `<ha-card class="${m.alert ? 'alert' : ''} ${m.na ? 'na' : ''}" style="--ic:${ic};--tint:${tint}">
        <div class="row">
          <div class="ic" style="${icStyle}"><ha-icon icon="${esc(m.icon)}"></ha-icon></div>
          <div class="txt tap" role="button" tabindex="0" data-act="more"><span class="name">${esc(m.name)}</span><span class="state">${esc(m.state)}</span></div>
          ${m.btns.length ? `<div class="btns" style="--btns-w:${m.btnsW || 'auto'}">${m.btns.map((b) => `<button type="button" data-act="${b.act}" data-arg="${esc(b.arg || '')}" aria-label="${esc(b.aria || b.label)}" aria-pressed="${b.pressed ? 'true' : 'false'}">${b.icon ? `<ha-icon icon="${b.icon}"></ha-icon>` : ''}${b.label ? esc(b.label) : ''}</button>`).join('')}</div>` : ''}
        </div></ha-card>`;
    }
    act(a, arg) {
      const c = this._config, st = this.st(c.entity);
      if (a === 'more' || !st) return this.moreInfo(c.entity);
      if (a === 'temp') {
        const step = Number(st.attributes.target_temp_step) || (String(this._hass.config && this._hass.config.unit_system && this._hass.config.unit_system.temperature).indexOf('F') >= 0 ? 1 : 0.5);
        const cur = this._pending != null ? this._pending : Number(st.attributes.temperature);
        let next = Math.round((cur + Number(arg) * step) * 10) / 10;
        if (st.attributes.min_temp != null) next = Math.max(st.attributes.min_temp, next);
        if (st.attributes.max_temp != null) next = Math.min(st.attributes.max_temp, next);
        this._pending = next; this._last = ''; this._update();
        clearTimeout(this._tt);
        this._tt = setTimeout(() => { this.call('climate', 'set_temperature', { entity_id: c.entity, temperature: this._pending }); this._pending = null; }, 700);
      }
      if (a === 'lock' || a === 'unlock') this.call('lock', a, { entity_id: c.entity });
      if (a === 'alarm') {
        const data = { entity_id: c.entity };
        if (c.code) data.code = String(c.code);
        this.call('alarm_control_panel', ALARM_MODES[arg].service, data);
      }
    }
  }
  CranberryStatusCard.defaults = {};

  // ---------------------------------------------------------------- room
  class CranberryRoomCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { min-height: 64px; }
      .fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--cc-c-t); transition: width .4s ease; }
      .row { position: relative; display: flex; align-items: center; gap: 12px; height: 100%; min-height: 64px; padding: 0 10px; box-sizing: border-box; }
      .tog { width: 44px; height: 44px; border-radius: var(--cc-r-ctl, 12px); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .tog ha-icon { --mdc-icon-size: 22px; }
      .open { flex: 1; min-width: 0; height: 100%; display: flex; align-items: center; gap: 8px; text-align: left; }
      .name { font-size: 15px; font-weight: 700; }
      .temp { height: 30px; padding: 0 10px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-bgc); display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; flex-shrink: 0; }
      .temp ha-icon { --mdc-icon-size: 14px; }
      .chev { --mdc-icon-size: 18px; color: var(--cc-muted); flex-shrink: 0; }
      .extra { position: relative; width: 40px; height: 40px; border-radius: var(--cc-r-ctl, 12px); flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--cc-q-t); color: var(--cc-q); }
      .extra[aria-pressed="true"] { background: var(--cc-o); color: var(--cc-on); }
      .extra ha-icon { --mdc-icon-size: 20px; }
      /* something in the room needs you: the whole card turns brick */
      ha-card.alert { background: var(--cc-b); color: var(--cc-on); }
      ha-card.alert .fill { display: none; }
      ha-card.alert .state { color: color-mix(in srgb, var(--cc-on) 82%, var(--cc-b)); font-weight: 600; }
      ha-card.alert .tog { background: rgba(242, 236, 224, 0.16) !important; color: var(--cc-on) !important; }
      ha-card.alert .temp { background: rgba(242, 236, 224, 0.16); }
      ha-card.alert .chev { color: var(--cc-on); }
      ha-card.alert .extra { background: rgba(242, 236, 224, 0.16); color: var(--cc-on); }
    `;
    }
    getGridOptions() { return { columns: 6, rows: 'auto', min_columns: 4 }; }
    model() {
      const c = this._config, st = this.st(c.entity);
      const members = (c.lights && c.lights.length) ? c.lights : (st && Array.isArray(st.attributes.entity_id) ? st.attributes.entity_id : [c.entity]);
      const sts = members.map((id) => this.st(id)).filter(Boolean);
      const live = sts.filter((s) => s.state !== 'unavailable' && s.state !== 'unknown');
      const on = live.filter((s) => s.state === 'on');
      const pct = (s) => (s.entity_id.indexOf('light.') === 0 && s.attributes.brightness != null ? Math.round(s.attributes.brightness / 2.55) : 100);
      const avg = on.length ? Math.round(on.reduce((x, s) => x + pct(s), 0) / on.length) : 0;
      const offline = sts.length - live.length;
      const dims = on.some((s) => s.entity_id.indexOf('light.') === 0 && s.attributes.brightness != null);
      let state;
      if (!st || st.state === 'unavailable') state = 'Unavailable';
      else if (on.length) state = (members.length > 1 ? on.length + ' of ' + members.length + ' on' : 'On') + (dims ? ' · ' + avg + '%' : '');
      else state = members.length > 1 ? 'All off' : 'Off';
      if (offline && st) state += ' · ' + offline + ' offline';
      const tst = this.st(c.temperature);
      let temp = null;
      // a weather entity works too: its current temperature, like the home card shows
      const tval = tst ? (tst.entity_id && tst.entity_id.startsWith('weather.') ? tst.attributes.temperature : tst.state) : null;
      if (tst && !isNaN(parseFloat(tval))) {
        temp = (Math.round(parseFloat(tval) * 10) / 10).toLocaleString((this._hass.locale && this._hass.locale.language) || 'en') + (tst.attributes.unit_of_measurement || '°').replace(/^°?C$/, '°').replace(/^°F$/, '°');
      }
      const lit = on.length > 0 || (st && st.state === 'on');
      let extra = null;
      if (c.button_entity) {
        const bs = this.st(c.button_entity);
        const on = !!bs && ['on', 'open', 'playing', 'home'].indexOf(bs.state) >= 0;
        extra = { on, icon: c.button_icon || (bs && bs.attributes.icon) || ccIcon('bulb', 'mdi:toggle-switch-outline'), name: c.button_name || (bs ? this.nm(c.button_entity) : c.button_entity), na: !bs || bs.state === 'unavailable' };
        if (on) state = extra.name + ' on' + (lit && dims ? ' · ' + avg + '%' : '');
      }
      // doors, windows and locks that make the room need you
      const PROBLEM = ['on', 'open', 'opening', 'unlocked', 'unlocking', 'jammed', 'triggered', 'problem'];
      const bad = [].concat(c.alerts || []).map((id) => this.st(id)).filter((s) => s && PROBLEM.indexOf(s.state) >= 0);
      let alert = false;
      if (bad.length) {
        alert = true;
        const word = (x) => (x.entity_id.indexOf('binary_sensor.') === 0 && x.state === 'on' ? 'open' : this._hass.formatEntityState ? String(this.fmt(x)) : x.state).toLowerCase();
        state = bad.length === 1 ? this.nm(bad[0].entity_id) + ' ' + word(bad[0]) : bad.length + ' things open';
      }
      return { alert, extra, name: c.name || (st ? this.nm(c.entity) : c.entity), icon: c.icon || (st && st.attributes.icon) || ccIcon('home', 'mdi:home-outline'), state, lit, fill: lit ? (dims ? avg : 100) : 0, temp, na: !st || st.state === 'unavailable', open: c.popup || c.navigation_path || '' };
    }
    view(m) {
      return `<ha-card class="${m.na ? 'na' : ''} ${m.alert ? 'alert' : ''}">
        <span class="fill" style="width:${m.fill}%"></span>
        <div class="row">
          <button type="button" class="tog" data-act="toggle" aria-pressed="${m.lit}" aria-label="Switch ${esc(m.name)} ${m.lit ? 'off' : 'on'}"
            style="background:${m.lit ? 'var(--cc-c)' : 'var(--cc-q-t)'};color:${m.lit ? 'var(--cc-on)' : 'var(--cc-q)'}"><ha-icon icon="${esc(m.icon)}"></ha-icon></button>
          <button type="button" class="open" data-act="open" aria-label="Open ${esc(m.name)}">
            <span class="txt"><span class="name">${esc(m.name)}</span><span class="state">${esc(m.state)}</span></span>
            ${m.temp ? `<span class="temp"><ha-icon icon="${ccIcon('thermometer', 'mdi:thermometer')}"></ha-icon>${esc(m.temp)}</span>` : ''}
            ${m.open ? `<ha-icon class="chev" icon="${ccIcon('chevron-right', 'mdi:chevron-right')}"></ha-icon>` : ''}
          </button>
          ${m.extra ? `<button type="button" class="extra" data-act="extra" aria-pressed="${m.extra.on}" aria-label="${esc(m.extra.name)} ${m.extra.on ? 'on' : 'off'}" ${m.extra.na ? 'disabled' : ''}><ha-icon icon="${esc(m.extra.icon)}"></ha-icon></button>` : ''}
        </div></ha-card>`;
    }
    act(a, arg, m) {
      const c = this._config;
      if (a === 'toggle') return this.call('homeassistant', m.lit ? 'turn_off' : 'turn_on', { entity_id: c.entity });
      if (a === 'open') return m.open ? this.navigate(m.open) : this.moreInfo(c.entity);
      if (a === 'extra' && c.button_entity) return this.call('homeassistant', 'toggle', { entity_id: c.button_entity });
    }
  }
  CranberryRoomCard.defaults = {};

  // ---------------------------------------------------------------- scene
  // A scene counts as active when it is the most recently activated scene (or script)
  // and none of the entities it sets have changed since, allowing a few seconds to settle.
  const SETTLE_MS = 15000;
  const activatedAt = (st) => {
    if (!st) return 0;
    const raw = st.entity_id.indexOf('script.') === 0 ? st.attributes.last_triggered : st.state;
    const t = Date.parse(raw);
    return isNaN(t) ? 0 : t;
  };
  class CranberrySceneCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { border-radius: var(--cc-r-card, 24px); transition: background .25s ease, color .25s ease; }
      ha-card.active { background: var(--cc-c); color: var(--cc-on); }
      .btn { width: 100%; height: 100%; min-height: 96px; box-sizing: border-box; padding: 12px 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
      .ic { width: 40px; height: 40px; border-radius: var(--cc-r-ctl, 12px); }
      .name { font-size: 13px; font-weight: 600; max-width: 100%; }
    `;
    }
    getGridOptions() { return { columns: 3, rows: 2, min_columns: 2 }; }
    connectedCallback() { this._tick = setInterval(() => this._update(), 10000); }
    disconnectedCallback() { clearInterval(this._tick); }
    isActive() {
      const c = this._config, h = this._hass, st = this.st(c.entity);
      if (c.active_entity) {
        const a = this.st(c.active_entity);
        if (a) return a.state === (c.active_state != null ? String(c.active_state) : 'on') || a.state === this.nm(c.entity) || a.state === c.entity;
      }
      const mine = activatedAt(st);
      if (!mine) return false;
      const pool = c.compare && c.compare.length ? c.compare : Object.keys(h.states).filter((id) => id.indexOf('scene.') === 0);
      if (pool.some((id) => id !== c.entity && activatedAt(h.states[id]) > mine)) return false;
      const members = (st.attributes && st.attributes.entity_id) || [];
      return !members.some((id) => {
        const s = h.states[id];
        return s && Date.parse(s.last_changed) > mine + SETTLE_MS;
      });
    }
    model() {
      const c = this._config, st = this.st(c.entity);
      return { name: c.name || (st ? this.nm(c.entity) : c.entity), icon: c.icon || (st && st.attributes.icon) || ccIcon('evening', 'mdi:palette-outline'), active: !!st && this.isActive(), na: !st };
    }
    view(m) {
      return `<ha-card class="${m.na ? 'na' : ''} ${m.active ? 'active' : ''}"><button type="button" class="btn" data-act="run" aria-pressed="${m.active}" aria-label="${esc(m.name)}${m.active ? ', active' : ''}">
        <span class="ic" style="background:${m.active ? 'rgba(255,255,255,0.16)' : 'var(--cc-q-t)'};color:${m.active ? 'var(--cc-on)' : 'var(--cc-q)'}"><ha-icon icon="${esc(m.icon)}"></ha-icon></span>
        <span class="name">${esc(m.name)}</span></button></ha-card>`;
    }
    act() {
      const id = this._config.entity, d = id.split('.')[0];
      this.call(d === 'script' ? 'script' : 'scene', 'turn_on', { entity_id: id });
    }
  }
  CranberrySceneCard.defaults = {};

  // ---------------------------------------------------------------- music
  const MP = { PAUSE: 1, PREV: 16, NEXT: 32, STOP: 4096, PLAY: 16384 };
  class CranberryMediaCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { border-radius: var(--cc-r-card, 24px); }
      ha-card.playing { background: var(--cc-o); color: var(--cc-on); }
      ha-card.playing .state { color: color-mix(in srgb, var(--cc-on) 80%, var(--cc-o)); }
      .row { display: flex; align-items: center; gap: 10px; padding: 10px 10px 10px 12px; min-height: 64px; box-sizing: border-box; }
      .art { width: 44px; height: 44px; flex-shrink: 0; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-text) center / cover no-repeat; display: flex; align-items: center; justify-content: center; }
      .art span { width: 16px; height: 16px; border-radius: var(--cc-r-chip, 8px); background: var(--cc-c); }
      .name { font-size: 15px; font-weight: 700; }
      .ctl { width: 40px; height: 40px; border-radius: var(--cc-r-ctl, 12px); display: flex; align-items: center; justify-content: center; background: var(--cc-q-t); flex-shrink: 0; }
      ha-card.playing .ctl { background: rgba(255,255,255,.14); }
      .ctl.main { width: 44px; height: 44px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-o); color: var(--cc-on); }
      ha-card.playing .ctl.main { background: var(--cc-on); color: var(--cc-o); }
      .ctl ha-icon { --mdc-icon-size: 20px; }
      .tap { cursor: pointer; }
    `;
    }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    model() {
      const c = this._config, st = this.st(c.entity);
      const room = c.name || (st ? this.nm(c.entity) : c.entity);
      if (!st || ['off', 'unavailable', 'unknown', 'standby'].indexOf(st.state) >= 0 || (!st.attributes.media_title && st.state === 'idle')) {
        return { title: room, sub: st ? (st.state === 'unavailable' ? 'Unavailable' : 'Nothing playing') : 'Unavailable', playing: false, art: '', ctl: [], na: !st || st.state === 'unavailable' };
      }
      const a = st.attributes, sf = a.supported_features || 0;
      const playing = st.state === 'playing';
      const art = c.show_artwork === false ? '' : (a.entity_picture_local || a.entity_picture || '');
      const sub = [a.media_artist || a.media_album_artist || a.app_name || a.media_channel, room].filter(Boolean).join(' · ');
      const ctl = [];
      if (sf & MP.PREV) ctl.push({ act: 'media_previous_track', icon: ccIcon('skip-previous', 'mdi:skip-previous'), aria: 'Previous track' });
      if (playing) ctl.push({ act: (sf & MP.PAUSE) ? 'media_pause' : 'media_stop', icon: (sf & MP.PAUSE) ? ccIcon('pause', 'mdi:pause') : ccIcon('stop', 'mdi:stop'), aria: (sf & MP.PAUSE) ? 'Pause' : 'Stop', main: true });
      else ctl.push({ act: 'media_play', icon: ccIcon('play', 'mdi:play'), aria: 'Play', main: true });
      if (sf & MP.NEXT) ctl.push({ act: 'media_next_track', icon: ccIcon('skip-next', 'mdi:skip-next'), aria: 'Next track' });
      return { title: a.media_title || this.fmt(st), sub, playing, art, ctl, na: false };
    }
    view(m) {
      return `<ha-card class="${m.playing ? 'playing' : ''} ${m.na ? 'na' : ''}"><div class="row">
        <div class="art" style="${m.art ? `background-image:url('${esc(m.art)}')` : ''}">${m.art ? '' : '<span></span>'}</div>
        <div class="txt tap" role="button" tabindex="0" data-act="more"><span class="name">${esc(m.title)}</span><span class="state">${esc(m.sub)}</span></div>
        ${m.ctl.map((b) => `<button type="button" class="ctl ${b.main ? 'main' : ''}" data-act="${b.act}" aria-label="${b.aria}"><ha-icon icon="${b.icon}"></ha-icon></button>`).join('')}
      </div></ha-card>`;
    }
    act(a) {
      if (a === 'more') return this._config.popup ? this.navigate(this._config.popup) : this.moreInfo(this._config.entity);
      this.call('media_player', a, { entity_id: this._config.entity });
    }
  }
  CranberryMediaCard.defaults = {};


  // ---------------------------------------------------------------- washing machine
  // Built for localthings (Samsung, local). Pick the progress sensor; the card finds the
  // other entities of the same machine by name. Done comes from your own helper.
  const WASH_STEP = {
    weightsensing: [0, 'Weighing'], laundrysensing: [0, 'Weighing'],
    prewash: ['pre', 'Pre-wash'],
    wash: [0, 'Wash'], steaming: [0, 'Steaming'], airwashing: [0, 'Air wash'], sanitizing: [0, 'Sanitizing'],
    rinse: [1, 'Rinse'], predrain: [2, 'Draining'], spin: [2, 'Spin'],
    drying: ['dry', 'Dry'], aidrying: ['dry', 'Dry'], dryingwithdooropen: ['dry', 'Venting'], cooling: ['dry', 'Cooling']
  };
  const PHASE_TEXT = { weightsensing: 'Weighing the laundry', laundrysensing: 'Weighing the laundry', prewash: 'Pre-wash', wash: 'Washing', steaming: 'Steaming', airwashing: 'Air washing', sanitizing: 'Sanitizing', rinse: 'Rinsing', predrain: 'Draining', spin: 'Spinning', drying: 'Drying', aidrying: 'Drying', dryingwithdooropen: 'Venting', cooling: 'Cooling down', finish: 'Finished' };
  const NO_ALARM = ['none', 'unknown', 'unavailable', '', '0', 'None'];

  class CranberryWasherCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { padding: 10px; display: flex; flex-direction: column; gap: 8px; }
      ha-card.large { padding: 14px 14px 16px; gap: 14px; }
      ha-card.cran { background: var(--cc-c); color: var(--cc-on); }
      ha-card.brick { background: var(--cc-b); color: var(--cc-on); }
      ha-card.cran .state, ha-card.brick .state { color: color-mix(in srgb, currentColor 82%, transparent); }
      .row { display: flex; align-items: center; gap: 10px; min-height: 40px; }
      .ic { width: 40px; height: 40px; }
      .ic ha-icon { --mdc-icon-size: 22px; }
      .time { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; padding-right: 4px; }
      .time b { font-family: Fraunces, Georgia, serif; font-variation-settings: 'SOFT' 100; font-weight: 400; font-size: 28px; line-height: 1; letter-spacing: -0.02em; }
      .time span { font-size: 11px; font-weight: 600; color: var(--cc-muted); }
      .act { height: 40px; padding: 0 14px; border-radius: var(--cc-r-ctl, 12px); display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; flex-shrink: 0; background: var(--cc-o); color: var(--cc-on); }
      .act ha-icon { --mdc-icon-size: 16px; }
      ha-card.cran .act { background: var(--cc-on); color: var(--cc-c); }
      ha-card.brick .act { background: var(--cc-on); color: var(--cc-b); }
      .bar { position: relative; border-radius: 4px; overflow: hidden; background: color-mix(in srgb, currentColor 11%, transparent); height: 4px; }
      ha-card.large .bar { height: 8px; }
      .bar span { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 4px; background: var(--fill); transition: width .6s ease; }
      .steps { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
      .step { height: 26px; padding: 0 10px 0 8px; border-radius: var(--cc-r-chip, 8px); display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; background: var(--chip); color: var(--cc-muted); }
      .step.done { color: inherit; }
      .step.now { background: var(--nowbg); color: var(--nowfg); font-weight: 700; }
      .step ha-icon { --mdc-icon-size: 13px; }
      .pct { margin-left: auto; font-size: 12px; font-weight: 700; color: var(--cc-muted); }
      .meta { display: flex; flex-wrap: wrap; gap: 6px; }
      .meta span { height: 26px; padding: 0 10px; border-radius: var(--cc-r-chip, 8px); background: var(--chip); display: flex; align-items: center; font-size: 12px; font-weight: 600; }
      .tap { cursor: pointer; }
    `;
    }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    connectedCallback() { this._tick = setInterval(() => this._update(), 30000); }
    disconnectedCallback() { clearInterval(this._tick); }

    sib(domain, key) {
      const c = this._config;
      if (c[key]) return c[key];
      const base = String(c.entity).replace(/^sensor\./, '').replace(/_progress$/, '');
      return domain + '.' + base + '_' + key;
    }
    _lang() { return (this._hass.locale && this._hass.locale.language) || this._hass.language || 'en'; }
    hm(d) { try { return new Intl.DateTimeFormat(this._lang(), { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d); } catch (e) { return d.toTimeString().slice(0, 5); } }
    ago(min) {
      if (min < 1) return 'just now';
      if (min < 60) return min + ' min ago';
      const h = Math.floor(min / 60), m = min % 60;
      if (h < 24) return h + ' h' + (m && h < 6 ? ' ' + m + ' min' : '') + ' ago';
      return Math.floor(h / 24) === 1 ? 'yesterday' : Math.floor(h / 24) + ' days ago';
    }

    model() {
      const c = this._config, now = Date.now();
      const st = (d, k) => this.st(this.sib(d, k));
      const prog = this.st(c.entity);
      const machine = st('sensor', 'machine_state');
      const running = st('binary_sensor', 'running');
      const pctSt = st('sensor', 'progress_percent');
      const left = st('sensor', 'completion_time');
      const finish = st('sensor', 'estimated_finish');
      const finishBy = st('time', 'finish_by');
      const cycle = st('select', 'cycle');
      const temp = st('select', 'wash_temperature');
      const spin = st('select', 'spin_speed');
      const alarm = st('sensor', 'alarm_code');
      const remote = st('binary_sensor', 'smart_control');
      const prewashOn = (st('switch', 'pre_wash') || {}).state === 'on';
      const doneSt = c.done ? this.st(c.done) : null;
      const doneAtSt = c.done_at ? this.st(c.done_at) : null;
      const name = c.name || 'Washing machine';
      const program = cycle && ['unknown', 'unavailable'].indexOf(cycle.state) < 0 ? String(this.fmt(cycle)) : '';
      const meta = [];
      if (temp && !isNaN(parseFloat(temp.state))) meta.push(Math.round(parseFloat(temp.state)) + '°');
      if (spin && spin.state) meta.push(/^\d+$/.test(spin.state) ? spin.state + ' rpm' : String(this.fmt(spin)).replace(/_/g, ' '));
      if (prewashOn) meta.push('Pre-wash');
      if ((st('switch', 'intensive') || {}).state === 'on') meta.push('Intensive');
      if ((st('switch', 'bubble_soak') || {}).state === 'on') meta.push('Bubble soak');

      const doneAt = () => {
        if (doneAtSt) {
          const raw = doneAtSt.entity_id.indexOf('input_datetime.') === 0 && doneAtSt.attributes.timestamp != null ? doneAtSt.attributes.timestamp * 1000 : String(doneAtSt.state).replace(' ', 'T');
          const d = new Date(raw); if (!isNaN(d)) return d;
        }
        return doneSt ? new Date(doneSt.last_changed) : null;
      };
      const m = { tone: 'neutral', icon: ccIcon('washer', 'mdi:washing-machine'), title: name, text: '', big: '', small: '', btn: null, pct: -1, steps: [], meta: [], na: false };

      if (!prog || prog.state === 'unavailable') return Object.assign(m, { text: 'Unavailable', na: true, quiet: true });

      const code = alarm ? String(alarm.state) : 'none';
      const phase = String(prog.state).toLowerCase();
      const mstate = machine ? machine.state : (running && running.state === 'on' ? 'active' : 'idle');
      const pct = pctSt && !isNaN(parseFloat(pctSt.state)) ? Math.max(0, Math.min(100, Math.round(parseFloat(pctSt.state)))) : null;

      if (NO_ALARM.indexOf(code) < 0) {
        return Object.assign(m, { tone: 'brick', icon: ccIcon('alert', 'mdi:alert-outline'), title: name + ' stopped', text: 'Error ' + code + (program ? ' · ' + program : ''), btn: { act: 'more', label: 'Details', icon: ccIcon('alert', 'mdi:alert-outline') }, meta: program ? [program] : [] });
      }

      if (doneSt && doneSt.state === 'on' && mstate !== 'active') {
        const at = doneAt();
        const mins = at ? Math.max(0, Math.round((now - at.getTime()) / 60000)) : 0;
        const late = mins >= (Number(c.alert_after) || 60);
        return Object.assign(m, {
          tone: late ? 'brick' : 'cran',
          title: late ? 'Washing is still in the drum' : 'Washing is done',
          text: late ? 'Done ' + this.ago(mins) + ' · don’t let it sit' : this.ago(mins).replace(/^just now$/, 'Just now') + ' · ready to empty',
          btn: { act: 'emptied', label: 'Emptied', icon: ccIcon('check', 'mdi:check') },
          meta: [program].concat(meta.slice(0, 2)).filter(Boolean)
        });
      }

      const leftMin = left && !isNaN(parseFloat(left.state)) ? Math.round(parseFloat(left.state)) : null;
      const fin = finish && !isNaN(Date.parse(finish.state)) ? new Date(finish.state) : (leftMin != null ? new Date(now + leftMin * 60000) : null);
      const hmm = (n) => Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');

      if (phase === 'delaywash') {
        let ready = finish && !isNaN(Date.parse(finish.state)) ? this.hm(new Date(finish.state)) : (finishBy && /^\d\d:\d\d/.test(finishBy.state) ? finishBy.state.slice(0, 5) : null);
        if (!ready && leftMin != null) ready = this.hm(new Date(now + leftMin * 60000));
        return Object.assign(m, { tone: 'olive', title: program || name, text: 'Delayed start' + (ready ? ' · ready at ' + ready : ''), big: ready || '', small: ready ? 'ready at' : '', meta });
      }

      if (mstate === 'active' || mstate === 'pause') {
        // steps: optional pre-wash, wash, rinse, spin, optional dry
        const hasDry = /dry/i.test(program) || ['drying', 'aidrying', 'dryingwithdooropen', 'cooling'].indexOf(phase) >= 0;
        const hasPre = prewashOn || phase === 'prewash';
        const labels = (hasPre ? ['Pre-wash'] : []).concat(['Wash', 'Rinse', 'Spin'], hasDry ? ['Dry'] : []);
        const off = hasPre ? 1 : 0;
        const ws = WASH_STEP[phase];
        let cur = -1, curLabel = null;
        if (ws) {
          cur = ws[0] === 'pre' ? 0 : ws[0] === 'dry' ? labels.length - 1 : ws[0] + off;
          curLabel = ws[1];
        } else if (phase === 'finish') cur = labels.length;
        m.steps = labels.map((l, i) => ({ label: i === cur && curLabel ? curLabel : l, s: i < cur ? 'done' : i === cur ? 'now' : '' }));
        m.pct = pct == null ? -1 : pct;
        m.meta = meta;
        m.title = program || name;
        const phaseText = PHASE_TEXT[phase] || capitalise(phase);
        if (mstate === 'pause') {
          m.text = 'Paused' + (PHASE_TEXT[phase] ? ' while ' + PHASE_TEXT[phase].toLowerCase() : '') + (pct != null ? ' · ' + pct + '%' : '');
          m.btn = remote && remote.state === 'on'
            ? { act: 'resume', label: 'Resume', icon: ccIcon('play', 'mdi:play') }
            : null;
          if (!m.btn) m.text += ' · press start on the machine';
          return m;
        }
        m.tone = 'olive';
        m.text = phaseText + (pct != null ? ' · ' + pct + '%' : '');
        if (leftMin != null) { m.big = hmm(leftMin); m.small = 'left' + (fin ? ' · ' + this.hm(fin) : ''); }
        return m;
      }

      // idle
      const at = doneAt();
      let last = '';
      if (at && now - at.getTime() < 7 * 86400000) {
        const sameDay = new Date(at).toDateString() === new Date(now).toDateString();
        last = ' · last wash done ' + (sameDay ? this.hm(at) : new Intl.DateTimeFormat(this._lang(), { weekday: 'long' }).format(at).toLowerCase());
      }
      return Object.assign(m, { text: 'Idle' + last, quiet: true });
    }
    view(m) {
      const c = this._config;
      const large = c.size !== 'row';
      const tone = m.tone;
      const icBg = tone === 'cran' || tone === 'brick' ? 'rgba(255,255,255,.16)' : tone === 'olive' ? 'var(--cc-o-t)' : 'var(--cc-q-t)';
      const icFg = tone === 'cran' || tone === 'brick' ? 'currentColor' : tone === 'olive' ? 'var(--cc-o)' : 'var(--cc-q)';
      const coloured = tone === 'cran' || tone === 'brick';
      const vars = [
        '--fill:' + (coloured ? 'currentColor' : tone === 'olive' ? 'var(--cc-o)' : 'var(--cc-q)'),
        '--chip:' + (coloured ? 'rgba(255,255,255,.12)' : 'color-mix(in srgb, var(--cc-bgc) 70%, transparent)'),
        '--nowbg:' + (coloured ? '#fff' : tone === 'olive' ? 'var(--cc-o)' : 'var(--cc-q)'),
        '--nowfg:' + (tone === 'brick' ? 'var(--cc-b)' : tone === 'cran' ? 'var(--cc-c)' : 'var(--cc-on)')
      ].join(';');
      const showBar = m.pct >= 0;
      return `<ha-card class="${large ? 'large' : ''} ${tone === 'cran' ? 'cran' : tone === 'brick' ? 'brick' : ''} ${tone === 'olive' && m.pct >= 0 ? 'running' : ''} ${m.na ? 'na' : ''}" style="${vars}">
        <div class="row">
          <div class="ic" style="background:${icBg};color:${icFg}"><ha-icon icon="${m.icon}"></ha-icon></div>
          <div class="txt tap" role="button" tabindex="0" data-act="more"><span class="name">${esc(m.title)}</span><span class="state">${esc(m.text)}</span></div>
          ${m.big ? `<div class="time"><b>${esc(m.big)}</b><span>${esc(m.small)}</span></div>` : ''}
          ${m.btn ? `<button type="button" class="act" data-act="${m.btn.act}"><ha-icon icon="${m.btn.icon}"></ha-icon>${esc(m.btn.label)}</button>` : ''}
        </div>
        ${showBar ? `<div class="bar" role="progressbar" aria-valuenow="${m.pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${m.pct}%"></span></div>` : ''}
        ${large && m.steps.length ? `<div class="steps">${m.steps.map((x) => `<span class="step ${x.s}">${x.s === 'done' ? `<ha-icon icon="${ccIcon('check', 'mdi:check')}"></ha-icon>` : x.s === 'now' ? '<ha-icon icon="mdi:circle-medium"></ha-icon>' : ''}${esc(x.label)}</span>`).join('')}${m.pct >= 0 ? `<span class="pct">${m.pct}%</span>` : ''}</div>` : ''}
        ${large && m.meta.length ? `<div class="meta">${m.meta.map((x) => `<span>${esc(x)}</span>`).join('')}</div>` : ''}
      </ha-card>`;
    }
    act(a) {
      const c = this._config;
      if (a === 'more') return this.moreInfo(c.entity);
      if (a === 'emptied' && c.done) return this.call('homeassistant', 'turn_off', { entity_id: c.done });
      if (a === 'resume') return this.call('button', 'press', { entity_id: this.sib('button', 'start') });
    }
  }
  const capitalise = (x) => String(x || '').replace(/^./, (ch) => ch.toUpperCase());
  CranberryWasherCard.defaults = { size: 'large', alert_after: 60 };


  // ---------------------------------------------------------------- waste collection
  const BIN_PATH = 'M6 7h12l-1 13a1.5 1.5 0 0 1-1.5 1.4h-7A1.5 1.5 0 0 1 7 20zM4.5 5h15M10 3h4';
  const BIN_FILL = 'M7.4 10h9.2l-.7 10H8.1z';
  const binSvg = (col, size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="${BIN_PATH}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke:${col}"></path><path d="${BIN_FILL}" style="fill:${col}"></path></svg>`;

  // ---------------------------------------------------------------- thermostat
  // The statement card: the whole card's colour says what the thermostat is doing, the big
  // number is what you set, and one sentence says where the room is and what happens next.
  // Heat/cool stacks its two setpoints. Preset, fan and swing only show when supported.
  const CLIMATE = { TARGET: 1, RANGE: 2, HUMIDITY: 4, FAN: 8, PRESET: 16, SWING: 32 };
  const THERMO_BG = { heating: '#514718', cooling: '#40606A', drying: '#8E6420', fan: '#545C5F', idle: '#3A2F2C', off: '#545C5F', na: '#545C5F' };
  const HVAC_NAMES = { off: 'Off', heat: 'Heat', cool: 'Cool', heat_cool: 'Heat/cool', auto: 'Auto', dry: 'Dry', fan_only: 'Fan' };
  class CranberryThermostatCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { position: relative; color: #F2ECE0; padding: 16px 16px 12px 20px; display: flex; flex-direction: column; gap: 6px; transition: background-color .4s ease; }
      .top { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 32px; }
      .room { font-size: 14px; font-weight: 600; opacity: .85; text-align: left; }
      .chip { height: 32px; border-radius: var(--cc-r-chip, 8px); padding: 0 8px 0 10px; background: rgba(242,236,224,.14); display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; }
      .chip[aria-expanded="true"] { background: rgba(242,236,224,.28); }
      .chip small { font-size: 12px; font-weight: 600; opacity: .75; }
      .chip ha-icon { --mdc-icon-size: 14px; }
      .one { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; min-height: 122px; }
      .one .lbl, .row .lbl { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .72; min-height: 16px; display: block; }
      .big { font-family: Fraunces, Georgia, serif; font-variation-settings: 'SOFT' 100; font-weight: 400; line-height: .95; letter-spacing: -.05em; margin-left: -4px; white-space: nowrap; }
      .steps { display: flex; flex-direction: column; gap: 6px; padding-bottom: 8px; }
      .step { width: 52px; height: 52px; border-radius: 16px; background: rgba(242,236,224,.16); display: flex; align-items: center; justify-content: center; }
      .step ha-icon { --mdc-icon-size: 24px; }
      .rows { display: flex; flex-direction: column; gap: 2px; padding-top: 2px; }
      .row { display: flex; align-items: center; gap: 8px; transition: opacity .3s ease; }
      .row .v { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .row .big { font-size: 64px; line-height: 1; margin-left: -3px; }
      .row .step { width: 48px; height: 48px; border-radius: 14px; }
      .say { margin: 6px 0 0; font-size: 20px; font-weight: 500; line-height: 1.3; max-width: 340px; }
      .meta { font-size: 13px; font-weight: 500; opacity: .75; }
      .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
      .chips .chip { height: 34px; border-radius: 10px; }
      .modes { display: flex; flex-wrap: wrap; column-gap: 16px; margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(242,236,224,.2); }
      .mode { height: 38px; font-size: 15px; font-weight: 700; opacity: .6; border-bottom: 2px solid transparent; }
      .mode[aria-pressed="true"] { opacity: 1; border-bottom-color: #F2ECE0; }
      .menu { position: absolute; left: 12px; right: 12px; z-index: 2; box-sizing: border-box; border-radius: 16px; background: #F2ECE0; color: #231C1A; box-shadow: 0 12px 32px rgba(0,0,0,.28); padding: 6px; display: flex; flex-direction: column; max-height: 300px; overflow-y: auto; animation: cc-in .2s ease both; }
      .menu .t { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--cc-muted); padding: 8px 10px 4px; }
      .opt { height: 40px; border-radius: 10px; padding: 0 10px; display: flex; align-items: center; justify-content: space-between; font-size: 14px; font-weight: 500; text-align: left; }
      .opt[aria-selected="true"] { background: rgba(35,28,26,.08); font-weight: 700; }
      .opt ha-icon { --mdc-icon-size: 16px; }
      button:focus-visible { outline-color: #F2ECE0; }
      .menu button:focus-visible { outline-color: #231C1A; }
      ha-card.compact { padding: 12px 12px 14px 18px; }
      .compact .top { min-height: 28px; }
      .compact .room { font-size: 13px; display: flex; align-items: center; gap: 2px; }
      .compact .room ha-icon { --mdc-icon-size: 14px; }
      .compact .tag { height: 26px; padding: 0 8px; border-radius: var(--cc-r-chip, 8px); background: rgba(242,236,224,.14); font-size: 12px; font-weight: 700; display: flex; align-items: center; }
      .line { display: flex; align-items: center; gap: 12px; min-height: 72px; }
      .line .lead { display: flex; flex-direction: column; flex-shrink: 0; min-width: 92px; }
      .line .lbl, .mini .lbl { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .72; min-height: 14px; }
      .line .big { margin-left: -2px; line-height: 1; }
      .line .short { flex: 1; min-width: 0; font-size: 15px; font-weight: 500; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .line .steps { flex-direction: row; padding: 0; flex-shrink: 0; }
      .line .step { width: 44px; height: 44px; border-radius: 14px; }
      .line .step ha-icon { --mdc-icon-size: 20px; }
      .minis { display: flex; flex-direction: column; gap: 2px; flex-shrink: 0; }
      .mini { display: flex; align-items: center; gap: 6px; transition: opacity .3s ease; }
      .mini .lbl { width: 40px; letter-spacing: .06em; opacity: .75; }
      .mini .big { width: 56px; font-size: 28px; line-height: 34px; letter-spacing: -.04em; margin: 0; }
      .mini .step { width: 34px; height: 34px; border-radius: 10px; }
      .mini .step ha-icon { --mdc-icon-size: 16px; }
      .on { height: 40px; flex-shrink: 0; border-radius: var(--cc-r-control, 12px); padding: 0 14px 0 10px; background: #F2ECE0; color: #231C1A; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 6px; }
      .on ha-icon { --mdc-icon-size: 16px; }
      .on:focus-visible { outline-color: #231C1A; }
      @media (prefers-reduced-motion: reduce) { ha-card, .row, .mini { transition: none; } .menu { animation: none; } }
    `;
    }
    getGridOptions() { return this._config && this._config.size === 'compact' ? { columns: 12, rows: 'auto', min_columns: 6, min_rows: 2 } : { columns: 12, rows: 'auto', min_columns: 6 }; }
    _update() {
      super._update();
      if (!this._escWired && this.shadowRoot.firstChild) {
        this._escWired = true;
        this.shadowRoot.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && this._menu) { this._menu = null; this._last = ''; this._update(); } });
      }
    }
    connectedCallback() { this._tick = setInterval(() => this._history(), 10 * 60000); this._history(); }
    disconnectedCallback() { clearInterval(this._tick); clearTimeout(this._tt); }
    set hass(h) { const first = !this._hass; this._hass = h; if (first) this._history(); this._update(); }
    _a() { const st = this.st(this._config.entity); return st ? st.attributes : {}; }
    _lang() { return (this._hass.locale && this._hass.locale.language) || this._hass.language || 'en'; }
    _deg(t) { return (Math.round(Number(t) * 10) / 10).toLocaleString(this._lang()) + '°'; }
    _attr(st, key, value) {
      if (value == null) return '';
      if (this._hass.formatEntityAttributeValue) { try { return this._hass.formatEntityAttributeValue(st, key, value); } catch (e) { /* fall through */ } }
      const s = String(value).replace(/_/g, ' ');
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    // How fast the room warmed (or cooled) in the current run, from the recorder, for "warm in about … minutes".
    async _history() {
      const c = this._config, h = this._hass;
      if (!c || !h || c.show_eta === false || !h.callWS || this._histBusy) return;
      if (this._histAt && Date.now() - this._histAt < 9 * 60000) return;
      this._histBusy = true;
      try {
        const start = new Date(Date.now() - 3 * 3600000).toISOString();
        const res = await h.callWS({ type: 'history/history_during_period', start_time: start, entity_ids: [c.entity], minimal_response: false, no_attributes: false, significant_changes_only: false });
        const rows = (res && res[c.entity]) || [];
        const pts = rows.map((r) => ({ t: (r.lu || r.lc || 0) * 1000 || Date.parse(r.last_updated || r.last_changed), cur: Number((r.a || r.attributes || {}).current_temperature), act: (r.a || r.attributes || {}).hvac_action })).filter((p) => p.t && !isNaN(p.cur));
        this._rate = null;
        // walk back from the newest point while the action stays the same: that is the current run
        if (pts.length > 1) {
          const last = pts[pts.length - 1];
          let i = pts.length - 1;
          while (i > 0 && pts[i - 1].act === last.act) i--;
          const first = pts[i], mins = (last.t - first.t) / 60000, d = last.cur - first.cur;
          if ((last.act === 'heating' || last.act === 'cooling') && mins >= 10 && Math.abs(d) >= 0.2) this._rate = { act: last.act, perMin: Math.abs(d) / mins };
        }
        this._histAt = Date.now();
      } catch (e) { this._rate = null; this._histAt = Date.now(); }
      this._histBusy = false;
      this._last = ''; this._update();
    }
    _etaMin(action, from, to) {
      const r = this._rate;
      if (this._config.show_eta === false || !r || r.act !== action || !(r.perMin > 0) || from == null || to == null) return null;
      const m = Math.round(Math.abs(to - from) / r.perMin);
      return m < 1 || m > 600 ? null : m;
    }
    _eta(action, from, to) {
      const m = this._etaMin(action, from, to);
      if (m == null) return null;
      return m < 90 ? m + ' minutes' : (Math.round(m / 30) / 2).toLocaleString(this._lang()) + ' hours';
    }
    _etaShort(action, from, to) {
      const m = this._etaMin(action, from, to);
      if (m == null) return null;
      return m < 90 ? '~' + m + ' min' : '~' + (Math.round(m / 30) / 2).toLocaleString(this._lang()) + ' h';
    }

    model() {
      const c = this._config, st = this.st(c.entity);
      const na = !st || st.state === 'unavailable' || st.state === 'unknown';
      const a = st ? st.attributes : {};
      const f = Number(a.supported_features) || 0;
      const mode = na ? 'off' : st.state;
      const p = this._pending || {};
      const cur = a.current_temperature != null ? Number(a.current_temperature) : null;
      const target = p.temperature != null ? p.temperature : (a.temperature != null ? Number(a.temperature) : null);
      const low = p.target_temp_low != null ? p.target_temp_low : (a.target_temp_low != null ? Number(a.target_temp_low) : null);
      const high = p.target_temp_high != null ? p.target_temp_high : (a.target_temp_high != null ? Number(a.target_temp_high) : null);
      const dual = !na && target == null && low != null && high != null && mode !== 'off';
      const hum = a.current_humidity != null ? Math.round(Number(a.current_humidity)) : null;
      const humT = p.humidity != null ? p.humidity : (a.humidity != null ? Math.round(Number(a.humidity)) : null);
      const deg = (t) => this._deg(t);

      // what it is doing: the device says so in hvac_action; otherwise work it out
      let action = a.hvac_action;
      if (na) action = 'na';
      else if (mode === 'off') action = 'off';
      else if (!action || action === 'off') {
        if (cur == null) action = 'idle';
        else if (dual) action = cur < low - 0.2 ? 'heating' : (cur > high + 0.2 ? 'cooling' : 'idle');
        else if (mode === 'heat') action = target != null && cur < target - 0.2 ? 'heating' : 'idle';
        else if (mode === 'cool') action = target != null && cur > target + 0.2 ? 'cooling' : 'idle';
        else if (mode === 'dry') action = 'drying';
        else if (mode === 'fan_only') action = 'fan';
        else action = 'idle';
      }
      if (action === 'preheating' || action === 'defrosting') action = 'heating';
      if (!THERMO_BG[action]) action = 'idle';

      const m = { na, action, bg: (c.colors && c.colors[action]) || THERMO_BG[action], name: c.name || this.nm(c.entity), dual, rows: [], big: '', label: '', steps: null };
      const say = (s) => s;
      const room = cur != null ? deg(cur) : '';

      // the big value and what −/+ change
      if (na) m.big = '—';
      else if (mode === 'off') m.big = this._hass.formatEntityState ? this.fmt(st) : 'Off';
      else if (dual) {
        m.rows = [
          { k: 'target_temp_low', label: 'Heat below', value: deg(low), dim: action === 'cooling' },
          { k: 'target_temp_high', label: 'Cool above', value: deg(high), dim: action === 'heating' }
        ];
      } else if (mode === 'dry') {
        if (humT != null && (f & CLIMATE.HUMIDITY)) { m.big = humT + '%'; m.label = 'Dry to'; m.steps = 'humidity'; }
        else { m.big = hum != null ? hum + '%' : this.fmt(st); m.label = 'Humidity'; }
      } else if (mode === 'fan_only') {
        const fans = a.fan_modes || [];
        m.big = a.fan_mode ? this._attr(st, 'fan_mode', a.fan_mode) : 'Fan';
        m.label = 'Fan';
        if (fans.length > 1 && (f & CLIMATE.FAN)) m.steps = 'fan';
      } else if (target != null) {
        m.big = deg(target);
        m.label = { heat: 'Heat to', cool: 'Cool to', auto: 'Around' }[mode] || 'Target';
        m.steps = 'temperature';
      } else { m.big = room || this.fmt(st); m.label = 'Now'; }
      m.bigSize = m.big.length > 5 ? 96 : 132;

      // one sentence about what is going on
      const eta = (to) => this._eta(action, cur, to);
      const preset = a.preset_mode && !['none', 'None', 'comfort', 'home'].includes(a.preset_mode) && !na && mode !== 'off' ? this._attr(st, 'preset_mode', a.preset_mode) : '';
      let s;
      if (na) s = 'The thermostat isn’t responding. Check its power or connection.';
      else if (mode === 'off') s = 'Off.' + (room ? ' It’s ' + room + ' in the ' + m.name.toLowerCase() + '.' : '');
      else if (dual) s = action === 'heating' ? room + ' now, below ' + deg(low) + '. Heating up' + (eta(low) ? ', warm in about ' + eta(low) : '') + '.'
        : action === 'cooling' ? room + ' now, above ' + deg(high) + '. Cooling down' + (eta(high) ? ', cool in about ' + eta(high) : '') + '.'
        : room + ' now: comfortable, so it’s resting.';
      else if (mode === 'dry') s = 'Drying the air' + (hum != null ? ': ' + hum + '% now' + (humT != null ? ', down to ' + humT + '%' : '') : '') + '.';
      else if (mode === 'fan_only') s = 'Just moving air.' + (room ? ' It’s ' + room + ' in the room.' : '');
      else if (action === 'heating') s = 'Heating from ' + room + '.' + (target != null && eta(target) ? ' Warm in about ' + eta(target) + '.' : '');
      else if (action === 'cooling') s = 'Cooling from ' + room + '.' + (target != null && eta(target) ? ' Cool in about ' + eta(target) + '.' : '');
      else if (target != null && mode !== 'auto') s = 'Holding at ' + deg(target) + '.' + (room ? ' It’s ' + room + ' now.' : '');
      else s = room ? 'It’s ' + room + '. ' + (mode === 'auto' ? 'Auto is keeping it there.' : 'Resting.') : 'Resting.';
      if (mode === 'auto' && (action === 'heating' || action === 'cooling') && target != null) s = s.replace(/\.$/, '') + '; auto keeps it around ' + deg(target) + '.';
      if (preset) s = preset + ': ' + s.charAt(0).toLowerCase() + s.slice(1);
      m.say = say(s);
      // the compact sentence: shorter, at most two lines
      const etaS = (to) => this._etaShort(action, cur, to);
      let t;
      if (na) t = 'Not responding.';
      else if (mode === 'off') t = room ? 'It’s ' + room + ' in the room.' : 'Off.';
      else if (dual) t = action === 'heating' ? room + ' now. Heating up.' : action === 'cooling' ? room + ' now. Cooling down.' : room + ' now. Comfortable.';
      else if (mode === 'dry') t = hum != null ? hum + '% now. Drying the air.' : 'Drying the air.';
      else if (mode === 'fan_only') t = 'Moving air.' + (room ? ' ' + room + ' in the room.' : '');
      else if (action === 'heating') t = 'Heating from ' + room + '.' + (target != null && etaS(target) ? ' Warm in ' + etaS(target) + '.' : '');
      else if (action === 'cooling') t = 'Cooling from ' + room + '.' + (target != null && etaS(target) ? ' Cool in ' + etaS(target) + '.' : '');
      else if (mode === 'auto') t = room ? room + ' now. Auto is on it.' : 'Auto is on it.';
      else t = room ? 'Holding. It’s ' + room + ' now.' : 'Holding.';
      m.short = t;
      m.tag = preset;
      m.canOn = !na && mode === 'off';
      m.meta = na ? '' : mode === 'dry' ? (room ? 'It’s ' + room + ' in the room' : '') : (hum != null ? hum + '% humidity' : '');

      // options, only what the thermostat supports
      const open = this._menu;
      m.preset = !na && mode !== 'off' && (f & CLIMATE.PRESET) && (a.preset_modes || []).length ? { value: a.preset_mode && !['none', 'None'].includes(a.preset_mode) ? this._attr(st, 'preset_mode', a.preset_mode) : 'No preset', open: open === 'preset' } : null;
      m.chips = [];
      if (!na && mode !== 'off') {
        if ((f & CLIMATE.FAN) && (a.fan_modes || []).length && mode !== 'fan_only') m.chips.push({ k: 'fan', label: 'Fan', value: this._attr(st, 'fan_mode', a.fan_mode), open: open === 'fan' });
        if ((f & CLIMATE.SWING) && (a.swing_modes || []).length) m.chips.push({ k: 'swing', label: 'Swing', value: this._attr(st, 'swing_mode', a.swing_mode), open: open === 'swing' });
        if (c.show_humidity !== false && (f & CLIMATE.HUMIDITY) && humT != null && mode !== 'dry') m.chips.push({ k: 'humidity', label: 'Humidity', value: humT + '%', open: open === 'humidity' });
      }
      const LISTS = { preset: ['Preset', 'preset_mode', a.preset_modes], fan: ['Fan speed', 'fan_mode', a.fan_modes], swing: ['Swing', 'swing_mode', a.swing_modes] };
      if (open === 'humidity') {
        const lo = Number(a.min_humidity) || 30, hi = Number(a.max_humidity) || 70;
        const opts = []; for (let x = Math.ceil(lo / 5) * 5; x <= hi; x += 5) opts.push(x);
        m.menu = { title: 'Target humidity', top: false, opts: opts.map((x) => ({ value: String(x), label: x + '%', on: x === humT })) };
      } else if (open && LISTS[open] && (LISTS[open][2] || []).length) {
        const [title, key, list] = LISTS[open];
        m.menu = { title, top: open === 'preset', opts: list.map((x) => ({ value: x, label: this._attr(st, key, x), on: x === a[key] })) };
      } else m.menu = null;
      const shown = (c.modes && c.modes.length ? c.modes : (a.hvac_modes || [])).filter((x) => (a.hvac_modes || []).includes(x));
      m.modes = c.show_modes === false ? [] : shown.map((k) => ({ k, label: HVAC_NAMES[k] || this._attr(st, 'hvac_mode', k), on: k === mode && !na }));
      return m;
    }

    view(m) {
      const ic = (n, mdi) => `<ha-icon icon="${ccIcon(n, mdi)}"></ha-icon>`;
      const plus = ccIcon('plus', 'mdi:plus'), minus = ccIcon('minus', 'mdi:minus');
      if (this._config.size === 'compact') return this._compact(m, ic, plus, minus);
      return `<ha-card class="${m.na ? 'na' : ''}" style="background:${m.bg}">
        <div class="top">
          <button type="button" class="room" data-act="more">${esc(m.name)}</button>
          ${m.preset ? `<button type="button" class="chip" data-act="menu" data-arg="preset" aria-haspopup="listbox" aria-expanded="${m.preset.open}">${esc(m.preset.value)}${ic('chev', 'mdi:chevron-down')}</button>` : ''}
        </div>
        ${m.dual ? `<div class="rows">${m.rows.map((r) => `<div class="row" style="opacity:${r.dim ? 0.5 : 1}">
            <span class="v"><span class="lbl">${esc(r.label)}</span><span class="big">${esc(r.value)}</span></span>
            <button type="button" class="step" data-act="step" data-arg="${r.k}:-1" aria-label="Lower ${esc(r.label.toLowerCase())}"><ha-icon icon="${minus}"></ha-icon></button>
            <button type="button" class="step" data-act="step" data-arg="${r.k}:1" aria-label="Raise ${esc(r.label.toLowerCase())}"><ha-icon icon="${plus}"></ha-icon></button>
          </div>`).join('')}</div>`
        : `<div class="one">
            <span><span class="lbl">${esc(m.label)}</span><span class="big" style="font-size:${m.bigSize}px">${esc(m.big)}</span></span>
            ${m.steps ? `<span class="steps"><button type="button" class="step" data-act="step" data-arg="${m.steps}:1" aria-label="Raise"><ha-icon icon="${plus}"></ha-icon></button><button type="button" class="step" data-act="step" data-arg="${m.steps}:-1" aria-label="Lower"><ha-icon icon="${minus}"></ha-icon></button></span>` : ''}
          </div>`}
        <p class="say">${esc(m.say)}</p>
        ${m.meta ? `<span class="meta">${esc(m.meta)}</span>` : ''}
        ${m.chips.length ? `<div class="chips">${m.chips.map((x) => `<button type="button" class="chip" data-act="menu" data-arg="${x.k}" aria-haspopup="listbox" aria-expanded="${x.open}"><small>${esc(x.label)}</small>${esc(x.value)}${ic('chev', 'mdi:chevron-down')}</button>`).join('')}</div>` : ''}
        ${m.modes.length ? `<div class="modes" role="group" aria-label="Mode">${m.modes.map((x) => `<button type="button" class="mode" data-act="mode" data-arg="${x.k}" aria-pressed="${x.on}" ${m.na ? 'disabled' : ''}>${esc(x.label)}</button>`).join('')}</div>` : ''}
        ${m.menu ? `<div class="menu" role="listbox" aria-label="${esc(m.menu.title)}" style="${m.menu.top ? 'top:52px' : 'bottom:' + (m.modes.length ? 62 : 14) + 'px'}"><span class="t">${esc(m.menu.title)}</span>${m.menu.opts.map((o) => `<button type="button" class="opt" role="option" data-act="pick" data-arg="${esc(o.value)}" aria-selected="${o.on}"><span>${esc(o.label)}</span>${o.on ? ic('check', 'mdi:check') : ''}</button>`).join('')}</div>` : ''}
      </ha-card>`;
    }

    // one strip for the everyday column: setpoint, a short sentence, −/+
    _compact(m, ic, plus, minus) {
      const big = m.big.length > 4 ? 34 : 48;
      const step = (k, d, label) => `<button type="button" class="step" data-act="step" data-arg="${k}:${d}" aria-label="${esc(label)}"><ha-icon icon="${d > 0 ? plus : minus}"></ha-icon></button>`;
      const fan = m.steps === 'fan';
      return `<ha-card class="compact ${m.na ? 'na' : ''}" style="background:${m.bg}${m.na ? ';opacity:.6' : ''}">
        <div class="top">
          <button type="button" class="room" data-act="more">${esc(m.name)}${ic('chevron-right', 'mdi:chevron-right')}</button>
          ${m.tag ? `<span class="tag">${esc(m.tag)}</span>` : ''}
        </div>
        <div class="line">
          ${m.dual ? `<span class="minis">${m.rows.map((r) => { const l = r.k === 'target_temp_low' ? 'Heat' : 'Cool'; return `<span class="mini" style="opacity:${r.dim ? 0.5 : 1}"><span class="lbl">${l}</span><span class="big">${esc(r.value)}</span>${step(r.k, -1, 'Lower the ' + l.toLowerCase() + ' point')}${step(r.k, 1, 'Raise the ' + l.toLowerCase() + ' point')}</span>`; }).join('')}</span>`
            : `<span class="lead"><span class="lbl">${esc(m.label)}</span><span class="big" style="font-size:${big}px">${esc(m.big)}</span></span>`}
          <span class="short">${esc(m.short)}</span>
          ${m.steps && !m.dual ? `<span class="steps">${step(m.steps, -1, fan ? 'Slower' : 'Lower')}${step(m.steps, 1, fan ? 'Faster' : 'Raise')}</span>` : ''}
          ${m.canOn ? `<button type="button" class="on" data-act="on">${ic('power', 'mdi:power')}Turn on</button>` : ''}
        </div>
      </ha-card>`;
    }

    _send(patch) {
      // gather quick taps, send once
      this._pending = Object.assign({}, this._pending, patch);
      this._last = ''; this._update();
      clearTimeout(this._tt);
      this._tt = setTimeout(() => {
        const p = this._pending; this._pending = null;
        if (p.humidity != null) this.call('climate', 'set_humidity', { entity_id: this._config.entity, humidity: p.humidity });
        const t = {}; ['temperature', 'target_temp_low', 'target_temp_high'].forEach((k) => { if (p[k] != null) t[k] = p[k]; });
        if (t.target_temp_low != null || t.target_temp_high != null) {
          const a = this._a(); t.target_temp_low = t.target_temp_low != null ? t.target_temp_low : Number(a.target_temp_low); t.target_temp_high = t.target_temp_high != null ? t.target_temp_high : Number(a.target_temp_high);
        }
        if (Object.keys(t).length) this.call('climate', 'set_temperature', Object.assign({ entity_id: this._config.entity }, t));
      }, 700);
    }

    act(a, arg) {
      const c = this._config, st = this.st(c.entity);
      if (a === 'more' || !st) return c.popup ? this.navigate(c.popup) : this.moreInfo(c.entity);
      const at = st.attributes;
      if (a === 'on') return this.call('climate', 'turn_on', { entity_id: c.entity });
      if (a === 'menu') { this._menu = this._menu === arg ? null : arg; this._last = ''; return this._update(); }
      if (a === 'pick') {
        const k = this._menu; this._menu = null; this._last = '';
        if (k === 'preset') this.call('climate', 'set_preset_mode', { entity_id: c.entity, preset_mode: arg });
        if (k === 'fan') this.call('climate', 'set_fan_mode', { entity_id: c.entity, fan_mode: arg });
        if (k === 'swing') this.call('climate', 'set_swing_mode', { entity_id: c.entity, swing_mode: arg });
        if (k === 'humidity') this._send({ humidity: Number(arg) });
        return this._update();
      }
      if (a === 'mode') { this._menu = null; return this.call('climate', 'set_hvac_mode', { entity_id: c.entity, hvac_mode: arg }); }
      if (a === 'step') {
        const [k, d] = String(arg).split(':'), dir = Number(d);
        const p = this._pending || {};
        if (k === 'fan') {
          const list = at.fan_modes || [], i = list.indexOf(at.fan_mode);
          const next = list[Math.max(0, Math.min(list.length - 1, i + dir))];
          if (next && next !== at.fan_mode) this.call('climate', 'set_fan_mode', { entity_id: c.entity, fan_mode: next });
          return;
        }
        if (k === 'humidity') {
          const now = p.humidity != null ? p.humidity : Number(at.humidity);
          return this._send({ humidity: Math.max(Number(at.min_humidity) || 30, Math.min(Number(at.max_humidity) || 70, now + dir * 5)) });
        }
        const stepSize = Number(at.target_temp_step) || (String(this._hass.config && this._hass.config.unit_system && this._hass.config.unit_system.temperature).indexOf('F') >= 0 ? 1 : 0.5);
        const lo = Number(at.min_temp) || 7, hi = Number(at.max_temp) || 35;
        const cur = p[k] != null ? p[k] : Number(at[k]);
        let next = Math.round((cur + dir * stepSize) * 10) / 10;
        // heat stays at least 1° under cool
        const other = (key) => (p[key] != null ? p[key] : Number(at[key]));
        if (k === 'target_temp_low') next = Math.min(next, other('target_temp_high') - 1);
        if (k === 'target_temp_high') next = Math.max(next, other('target_temp_low') + 1);
        this._send({ [k]: Math.max(lo, Math.min(hi, next)) });
      }
    }
  }
  CranberryThermostatCard.defaults = { size: 'full', show_eta: true, show_modes: true };


  // ---------------------------------------------------------------- car
  // Where the car is parked: the place as chips, the layer and zone for a parking garage,
  // a note and a small map for anywhere else. A tap on the map starts walking directions.
  class CranberryCarCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { display: flex; flex-direction: column; gap: 12px; padding: 10px 10px 12px; }
      .head { display: flex; align-items: center; gap: 10px; min-height: 40px; }
      .head .ic { width: 40px; height: 40px; background: var(--cc-c); color: var(--cc-on); }
      .group { display: flex; flex-direction: column; gap: 6px; padding: 0 2px; }
      .label { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--cc-muted); padding-left: 2px; }
      .chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .chip { height: 36px; padding: 0 14px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-q-t); font-size: 14px; font-weight: 600; display: flex; align-items: center; }
      .chip.sq { width: 40px; padding: 0; justify-content: center; }
      .chip[aria-pressed="true"] { background: var(--cc-c); color: var(--cc-on); }
      .note { height: 40px; width: 100%; box-sizing: border-box; padding: 0 14px; border: 0; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-bgc); color: var(--cc-text); font: 500 14px Figtree, var(--ha-font-family-body, sans-serif); outline: none; }
      .note::placeholder { color: var(--cc-muted); }
      .note:focus { box-shadow: inset 0 0 0 2px var(--cc-c); }
      .mapwrap { position: relative; border-radius: var(--cc-r-ctl, 12px); overflow: hidden; background: var(--cc-bgc); }
      .map { height: 168px; pointer-events: none; --ha-card-border-radius: 0; --ha-card-border-width: 0; --ha-card-box-shadow: none; }
      .map > * { display: block; height: 100%; }
      .mapbtn { position: absolute; inset: 0; display: flex; align-items: flex-end; padding: 10px; }
      .go { height: 36px; padding: 0 12px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-c); color: var(--cc-on); display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; box-shadow: 0 2px 8px rgba(35, 28, 26, 0.18); }
      .go ha-icon { --mdc-icon-size: 16px; }
      .nomap { font-size: 13px; color: var(--cc-muted); padding: 0 4px; }
    `;
    }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    _opts(id) { const st = this.st(id); return (st && Array.isArray(st.attributes.options)) ? st.attributes.options : []; }
    _val(id) { const st = this.st(id); return st && !['unknown', 'unavailable'].includes(st.state) ? st.state : ''; }
    _spot() {
      const st = this.st(this._config.spot);
      if (!st || st.state === 'unavailable') return null;
      const lat = parseFloat(st.attributes.latitude), lon = parseFloat(st.attributes.longitude);
      if (isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0)) return null;
      return { lat, lon, url: st.attributes.navigate_url || `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${lat},${lon}` };
    }
    model() {
      const c = this._config;
      const place = this._val(c.entity);
      const garage = place && place === c.layers_for;
      const other = place && place === c.note_for;
      const layer = garage ? this._val(c.layer) : '', zone = garage ? this._val(c.zone) : '';
      const note = other && c.note ? this._val(c.note) : '';
      const spot = other ? this._spot() : null;
      const where = garage ? [place, layer, zone && 'zone ' + zone].filter(Boolean).join(' · ') : (other ? (note || place) : place);
      return {
        title: c.name || 'Car', text: where ? 'Parked at ' + where : 'Where is it parked?',
        places: this._opts(c.entity).map((o) => ({ o, on: o === place })),
        layers: garage && c.layer ? this._opts(c.layer).map((o) => ({ o, on: o === layer })) : null,
        zones: garage && c.zone ? this._opts(c.zone).map((o) => ({ o, on: o === zone })) : null,
        note: other && c.note ? { v: note } : null,
        spot, showMap: !!(other && spot), noSpot: !!(other && c.spot && !spot), na: !this.st(c.entity)
      };
    }
    view(m) {
      const chips = (list, act, sq) => `<div class="chips">${list.map((x) => `<button type="button" class="chip ${sq ? 'sq' : ''}" data-act="${act}" data-arg="${esc(x.o)}" aria-pressed="${x.on}">${esc(x.o)}</button>`).join('')}</div>`;
      return `<ha-card class="${m.na ? 'na' : ''}">
        <div class="head">
          <span class="ic"><ha-icon icon="${ccIcon('car', 'mdi:car-outline')}"></ha-icon></span>
          <span class="txt tap" role="button" tabindex="0" data-act="more"><span class="name">${esc(m.title)}</span><span class="state">${esc(m.text)}</span></span>
        </div>
        ${m.places.length ? chips(m.places, 'place') : ''}
        ${m.layers ? `<div class="group"><span class="label">Layer</span>${chips(m.layers, 'layer')}</div>` : ''}
        ${m.zones ? `<div class="group"><span class="label">Zone</span>${chips(m.zones, 'zone', true)}</div>` : ''}
        ${m.note ? `<input class="note" data-key="note" data-act="note" type="text" maxlength="100" enterkeyhint="done" placeholder="Street, landmark, level…" aria-label="Where exactly" value="${esc(m.note.v)}">` : ''}
        ${m.showMap ? `<div class="mapwrap" data-key="mapwrap"><div class="map" data-key="map" data-keep></div>
          <button type="button" class="mapbtn" data-act="nav" aria-label="Walking directions to the car"><span class="go"><ha-icon icon="${ccIcon('nav', 'mdi:navigation-variant-outline')}"></ha-icon>Directions</span></button></div>` : ''}
        ${m.noSpot ? '<div class="nomap">No location saved for the car yet</div>' : ''}
      </ha-card>`;
    }
    _update() {
      super._update();
      if (!this._m) return;
      const root = this.shadowRoot;
      const inp = root.querySelector('input.note');
      if (inp && root.activeElement !== inp && this._m.note && inp.value !== this._m.note.v) inp.value = this._m.note.v;
      if (inp && !inp._wired) {
        inp._wired = true;
        inp.addEventListener('change', () => this.act('note'));
        inp.addEventListener('click', (ev) => ev.stopPropagation());
      }
      const box = root.querySelector('.map');
      if (box) this._mountMap(box);
      if (this._map) this._map.hass = this._hass;
    }
    async _mountMap(box) {
      const spot = this._config.spot;
      if (!this._map || this._mapFor !== spot) {
        if (this._mapLoading) return;
        this._mapLoading = true;
        try {
          const helpers = window.loadCardHelpers ? await window.loadCardHelpers() : null;
          if (!helpers) return;
          this._map = helpers.createCardElement({
            type: 'map', entities: [{ entity: spot, label_mode: 'icon', color: '#591E21' }],
            default_zoom: 16, theme_mode: 'auto', map_style: 'muted'
          });
          this._mapFor = spot;
          this._map.hass = this._hass;
        } finally { this._mapLoading = false; }
      }
      const cur = this.shadowRoot.querySelector('.map');
      if (cur && this._map.parentNode !== cur) { cur.textContent = ''; cur.appendChild(this._map); this._quietMap(0); }
    }
    // the map is only a preview here: no zoom or fit buttons, no attribution clutter
    _quietMap(n) {
      const css = '.leaflet-control-container, ha-icon-button { display: none !important; } ha-card { height: 100% !important; border-radius: 0 !important; } #root, ha-map { height: 100% !important; padding: 0 !important; }';
      const add = (root) => { if (root && !root.querySelector('style[data-cc]')) { const s = document.createElement('style'); s.setAttribute('data-cc', ''); s.textContent = css; root.appendChild(s); return true; } return !!root; };
      const card = this._map && this._map.shadowRoot;
      const map = card && card.querySelector('ha-map');
      const done = add(card) && add(map && map.shadowRoot);
      if (!done && n < 20) setTimeout(() => this._quietMap(n + 1), 150);
    }
    act(a, arg) {
      const c = this._config;
      if (a === 'place') return this.call('input_select', 'select_option', { entity_id: c.entity, option: arg });
      if (a === 'layer') return this.call('input_select', 'select_option', { entity_id: c.layer, option: arg });
      if (a === 'zone') return this.call('input_select', 'select_option', { entity_id: c.zone, option: arg });
      if (a === 'note') {
        const inp = this.shadowRoot.querySelector('input.note');
        if (!inp || !c.note) return;
        const v = inp.value.trim().slice(0, 100);
        if (v !== this._val(c.note)) this.call('input_text', 'set_value', { entity_id: c.note, value: v });
        if (a === 'note' && document.activeElement) inp.blur();
        return;
      }
      if (a === 'nav') { const s = this._spot(); if (s) window.open(s.url, '_blank', 'noopener'); return; }
      this.moreInfo(c.entity);
    }
  }
  CranberryCarCard.defaults = { layers_for: 'Garage', note_for: 'Elsewhere' };

  class CranberryWasteCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { display: flex; flex-direction: column; gap: 0; padding: 10px; }
      ha-card.large { gap: 10px; padding: 10px 10px 12px; }
      ha-card.urgent { background: var(--cc-c); color: var(--cc-on); }
      ha-card.urgent .item .d { color: color-mix(in srgb, var(--cc-on) 82%, var(--cc-c)); }
      ha-card.urgent .item.soon .d { color: var(--cc-on); }
      ha-card.urgent .item { border-top-color: rgba(255,255,255,0.14); }
      .head { display: flex; align-items: center; gap: 10px; min-height: 40px; border-radius: var(--cc-r-ctl, 12px); }
      .urgent .head { color: var(--cc-on); }
      .urgent .head .state { color: color-mix(in srgb, var(--cc-on) 82%, var(--cc-c)); }
      .bin { width: 40px; height: 40px; flex-shrink: 0; border-radius: var(--cc-r-ctl, 12px); display: flex; align-items: center; justify-content: center; gap: 1px; background: var(--cc-q-t); }
      .urgent .bin { background: var(--cc-on); }
      .out .bin { background: var(--cc-o-t); }
      .day { height: 32px; padding: 0 10px; border-radius: var(--cc-r-ctl, 12px); background: color-mix(in srgb, var(--cc-bgc) 75%, transparent); display: flex; align-items: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
      .act { height: 36px; padding: 0 12px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-on); color: var(--cc-c); display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; flex-shrink: 0; }
      .act ha-icon { --mdc-icon-size: 15px; }
      .list { display: flex; flex-direction: column; padding: 0 4px; }
      .item { display: flex; align-items: center; gap: 12px; min-height: 36px; border-top: 1px solid color-mix(in srgb, currentColor 8%, transparent); }
      .item:first-child { border-top: 0; }
      .mark { width: 8px; height: 22px; border-radius: 4px; flex-shrink: 0; }
      .item .n { flex: 1; font-size: 14px; font-weight: 600; }
      .item .d { font-size: 13px; font-weight: 500; color: var(--cc-muted); }
      .item.soon .d { font-weight: 700; color: inherit; }
      .tap { cursor: pointer; }
    `;
    }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    connectedCallback() { this._tick = setInterval(() => this._update(), 60000); }
    disconnectedCallback() { clearInterval(this._tick); }
    _lang() { return (this._hass.locale && this._hass.locale.language) || this._hass.language || 'en'; }
    model() {
      const c = this._config;
      const now = new Date();
      const W = window.CranberryWaste.wasteState(this._hass, Object.assign({ waste: 'auto' }, c), now);
      const lang = this._lang();
      const wd = (d, style) => new Intl.DateTimeFormat(lang, { weekday: style || 'long' }).format(d);
      const dateLabel = (x) => x.days === 0 ? 'Today' : x.days === 1 ? 'Tomorrow' : new Intl.DateTimeFormat(lang, { weekday: 'short', day: 'numeric', month: 'short' }).format(x.date);
      const short = (x) => ({ 'Green (GFT)': 'Green', 'Plastic (PMD)': 'Plastic', 'Plastic (PBD)': 'Plastic' }[x.name] || x.name);
      const join = (arr) => arr.length === 1 ? arr[0] : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1].toLowerCase();
      const list = W.upcoming.slice(0, Number(c.show) || 4).map((x) => ({ name: x.name, colour: x.colour, date: dateLabel(x), soon: x.days <= 1 }));
      const m = { tone: 'quiet', colours: [], title: c.name || 'Waste collection', text: '', day: '', btn: null, list, na: false };
      if (!W.items.length) {
        const any = [].concat(c.waste || []).some((id) => id !== 'auto' && this.st(id));
        return Object.assign(m, { colours: ['var(--cc-q)'], text: any ? 'No collections planned' : 'No Afvalwijzer sensors found', na: !any });
      }
      if (W.due && W.due.length) {
        const names = join(W.due.map(short));
        const many = W.due.length > 1;
        m.colours = W.due.map((x) => x.colour);
        if (!W.out) {
          m.tone = 'urgent';
          m.title = W.chip;
          m.text = W.when === 'today' ? 'Still time if it isn’t out yet' : (many ? 'Both collected tomorrow morning' : 'Collected tomorrow morning');
          if (c.waste_out) m.btn = { label: many ? 'Both out' : 'It’s out' };
          return m;
        }
        m.tone = 'out';
        m.quiet = true;
        m.title = names + (many ? ' are out' : ' is out');
        m.text = W.when === 'today' ? 'Collected this morning' : 'Collected tomorrow morning';
        m.day = W.when === 'today' ? 'Today' : wd(W.due[0].date, 'short');
        return m;
      }
      const next = W.upcoming[0];
      if (!next) return Object.assign(m, { colours: ['var(--cc-q)'], text: 'No collections planned' });
      const sameDay = W.upcoming.filter((x) => x.days === next.days);
      m.colours = sameDay.map((x) => x.colour);
      const names = join(sameDay.map(short));
      m.title = names + (next.days === 0 ? ' today' : next.days === 1 ? ' tomorrow' : ' on ' + wd(next.date));
      m.text = next.days === 1 ? 'Put ' + (sameDay.length > 1 ? 'them' : 'it') + ' out this evening' : 'Nothing to put out tonight';
      m.day = next.days === 0 ? 'Today' : next.days === 1 ? 'Tmrw' : wd(next.date, 'short');
      m.quiet = next.days > 1;
      return m;
    }
    view(m) {
      const large = this._config.size !== 'row';
      const size = m.colours.length > 1 ? 18 : 24;
      return `<ha-card class="${m.tone} ${large ? 'large' : ''} ${m.na ? 'na' : ''}">
        <div class="head">
          <span class="bin">${m.colours.map((col) => binSvg(col, size)).join('')}</span>
          <span class="txt tap" role="button" tabindex="0" data-act="more"><span class="name">${esc(m.title)}</span><span class="state">${esc(m.text)}</span></span>
          ${m.btn ? `<button type="button" class="act" data-act="out"><ha-icon icon="${ccIcon('check', 'mdi:check')}"></ha-icon>${esc(m.btn.label)}</button>` : (m.day ? `<span class="day">${esc(m.day)}</span>` : '')}
        </div>
        ${large && m.list.length ? `<div class="list">${m.list.map((x) => `<div class="item ${x.soon ? 'soon' : ''}"><span class="mark" style="background:${x.colour}"></span><span class="n">${esc(x.name)}</span><span class="d">${esc(x.date)}</span></div>`).join('')}</div>` : ''}
      </ha-card>`;
    }
    act(a) {
      const c = this._config;
      if (a === 'out' && c.waste_out) return this.call('homeassistant', 'turn_on', { entity_id: c.waste_out });
      const W = window.CranberryWaste.wasteState(this._hass, Object.assign({ waste: 'auto' }, c), new Date());
      const first = (W.due && W.due[0]) || W.upcoming[0];
      if (first) this.moreInfo(first.id);
    }
  }
  CranberryWasteCard.needsEntity = false;
  CranberryWasteCard.defaults = { size: 'large' };

  // ---------------------------------------------------------------- calendar
  // The coming days from one or more calendars, with the same date blocks as the home card:
  // one block per day, today in cranberry, days without plans folded into one line.
  const CAL_COLOURS = ['var(--cc-c)', 'var(--cc-o)', 'var(--cc-h)', 'var(--cc-ochre)', 'var(--cc-q)'];
  // the same colours, lifted so a small dot still shows on a dark card
  const CAL_DOTS = ['#B8565B', '#8C7F45', '#8FA1A6', '#C99A4A', '#A9AFB1'];
  class CranberryCalendarCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { padding: 12px 16px 8px; display: flex; flex-direction: column; }
      .title { font-size: 17px; font-weight: 700; padding: 4px 0 8px; }
      .legend { display: flex; flex-wrap: wrap; gap: 6px 16px; padding: 2px 2px 10px; border-bottom: 1px solid var(--cc-rule); }
      .legend span { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--cc-muted); }
      .dot { width: 8px; height: 8px; border-radius: 4px; flex-shrink: 0; background: var(--dot); }
      .day { display: flex; gap: 14px; align-items: flex-start; padding: 12px 0; }
      .day + .day, .legend + .day { border-top: 1px solid var(--cc-rule); }
      .legend + .day { border-top: 0; }
      .block { width: 48px; height: 52px; flex-shrink: 0; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-raise); display: flex; flex-direction: column; align-items: center; justify-content: center; }
      .block small { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--cc-muted); line-height: 12px; }
      .block b { font-family: Fraunces, Georgia, serif; font-variation-settings: 'SOFT' 100; font-weight: 400; letter-spacing: -0.03em; font-size: 26px; line-height: 28px; }
      .today .block { background: var(--cc-c); color: var(--cc-on); }
      .today .block small { color: color-mix(in srgb, var(--cc-on) 75%, var(--cc-c)); }
      .evs { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; padding-top: 4px; }
      .ev { display: flex; align-items: baseline; gap: 12px; min-height: 26px; text-align: left; width: 100%; }
      .when { width: 132px; flex-shrink: 0; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--cc-muted); white-space: nowrap; }
      .when .dot { align-self: center; }
      .ev.now .when { color: var(--cc-text); font-weight: 700; }
      .what { flex: 1; min-width: 0; font-size: 16px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .what small { font-size: 16px; color: var(--cc-muted); }
      .free { display: flex; align-items: center; gap: 14px; padding: 10px 0; font-size: 14px; color: var(--cc-muted); }
      .free b { width: 48px; flex-shrink: 0; text-align: center; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; white-space: nowrap; }
      .free.range b { width: auto; min-width: 48px; }
      .empty { padding: 16px 2px; font-size: 15px; color: var(--cc-muted); }
      ha-card { --cc-rule: color-mix(in srgb, var(--cc-text) 12%, transparent); --cc-raise: color-mix(in srgb, var(--cc-text) 7%, transparent); }
      @media (max-width: 480px) { .when { width: 104px; } }
    `;
    }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    connectedCallback() { this._tick = setInterval(() => this._refresh(), 60000); this._refresh(); }
    disconnectedCallback() { clearInterval(this._tick); }
    setConfig(config) { super.setConfig(config); this._at = 0; this._events = null; this._refresh(); }
    set hass(h) { const first = !this._hass; this._hass = h; if (first) this._refresh(); this._update(); }
    _ids() { return [].concat(this._config.calendars || []).map((x) => (typeof x === 'string' ? x : x && x.entity)).filter(Boolean); }
    _refresh() {
      // the clock moves every minute; the calendars are asked again every 10 minutes
      if (!this._hass || !this._config) return;
      if (Date.now() - (this._at || 0) > 10 * 60000) this._fetch();
      this._last = ''; this._update();
    }
    async _fetch() {
      const h = this._hass, ids = this._ids();
      if (!h || !h.callApi || !ids.length || this._busy) return;
      this._busy = true; this._at = Date.now();
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const end = new Date(start.getTime() + (this._days() + 1) * 86400000);
      const out = [];
      await Promise.all(ids.map(async (id) => {
        try {
          const evs = await h.callApi('GET', 'calendars/' + id + '?start=' + encodeURIComponent(start.toISOString()) + '&end=' + encodeURIComponent(end.toISOString()));
          (evs || []).forEach((e) => out.push(Object.assign({ cal: id }, e)));
        } catch (e) { /* a calendar that fails is left out */ }
      }));
      this._events = out; this._busy = false;
      this._last = ''; this._update();
    }
    _days() { return Math.max(1, Math.min(31, Number(this._config.days) || 14)); }
    _lang() { return (this._hass && this._hass.locale && this._hass.locale.language) || (this._hass && this._hass.language) || 'en'; }
    _time(d) {
      const f = this._hass && this._hass.locale && this._hass.locale.time_format;
      const h12 = f === '12' ? true : f === '24' ? false : undefined;
      return new Intl.DateTimeFormat(this._lang(), { hour: '2-digit', minute: '2-digit', hour12: h12 }).format(d);
    }
    model() {
      const c = this._config, ids = this._ids(), now = new Date(), DAY = 86400000;
      const day0 = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); };
      const today = day0(now), n = this._days();
      const colour = {}; ids.forEach((id, i) => { colour[id] = i % CAL_DOTS.length; });
      const parse = (v) => {
        if (!v) return null;
        if (typeof v === 'object') return v.dateTime ? { d: new Date(v.dateTime), all: false } : (v.date ? { d: new Date(v.date + 'T00:00:00'), all: true } : null);
        return /^\d{4}-\d{2}-\d{2}$/.test(v) ? { d: new Date(v + 'T00:00:00'), all: true } : { d: new Date(v), all: false };
      };
      const wd = (t) => new Intl.DateTimeFormat(this._lang(), { weekday: 'short' }).format(new Date(t)).replace(/\.$/, '');
      const days = {};
      for (let i = 0, d = today; i < n; i++, d = day0(d + DAY * 1.5)) days[d] = [];
      (this._events || []).forEach((e) => {
        const s = parse(e.start), en = parse(e.end);
        if (!s || isNaN(s.d)) return;
        let endT = en && !isNaN(en.d) ? en.d.getTime() : s.d.getTime() + (s.all ? DAY : 3600000);
        if (endT <= s.d.getTime()) endT = s.d.getTime() + (s.all ? DAY : 60000);
        if (endT <= now.getTime()) return;
        const first = day0(s.d), last = day0(endT - 1), span = Math.round((last - first) / DAY) + 1;
        for (let d = Math.max(first, today), k = Math.round((Math.max(first, today) - first) / DAY) + 1; d <= last; d = day0(d + DAY * 1.5), k++) {
          if (!days[d]) continue;
          let when, rank;
          const ongoing = d === today && s.d <= now && endT > now.getTime();
          if (s.all) { when = span > 1 ? 'All day · ' + k + ' of ' + span : 'All day'; rank = 0; }
          else if (span === 1) { when = ongoing ? 'Now, until ' + this._time(new Date(endT)) : this._time(s.d); rank = 1; }
          else if (d === first) { when = ongoing ? 'Now' : this._time(s.d) + ' →'; rank = 1; }
          else if (d === last) { when = ongoing ? 'Now, until ' + this._time(new Date(endT)) : 'Until ' + this._time(new Date(endT)); rank = 0; }
          else { when = ongoing ? 'Now' : 'All day'; rank = 0; }
          days[d].push({ t: d === first ? s.d.getTime() : d, rank, when, now: ongoing && !s.all, what: e.summary || e.message || 'Busy', loc: e.location || '', id: e.cal, dot: CAL_DOTS[colour[e.cal] || 0] });
        }
      });
      // a day per block; runs of free days fold into one line
      const rows = [];
      const fold = c.show_empty !== 'hide';
      Object.keys(days).map(Number).sort((a, b) => a - b).forEach((d) => {
        const evs = days[d].sort((a, b) => a.rank - b.rank || a.t - b.t);
        if (evs.length) { rows.push({ d, today: d === today, wd: wd(d), n: new Date(d).getDate(), evs }); return; }
        if (!fold) return;
        const prev = rows[rows.length - 1], label = wd(d) + ' ' + new Date(d).getDate();
        if (prev && prev.free && Math.round((d - prev.last) / DAY) === 1) { prev.to = label; prev.last = d; }
        else rows.push({ free: true, from: label, to: '', d, last: d });
      });
      while (rows.length && rows[rows.length - 1].free) rows.pop();
      const legend = ids.length > 1 ? ids.map((id) => ({ name: this.nm(id), dot: CAL_DOTS[colour[id]] })) : [];
      return { title: c.title || '', legend, rows, loading: this._events == null && ids.length > 0, none: !ids.length };
    }
    view(m) {
      const ev = (e) => `<button type="button" class="ev${e.now ? ' now' : ''}" data-act="open" data-arg="${esc(e.id)}"><span class="when"><span class="dot" style="--dot:${e.dot}"></span>${esc(e.when)}</span><span class="what">${esc(e.what)}${e.loc ? ` <small>· ${esc(e.loc)}</small>` : ''}</span></button>`;
      const body = m.none ? '<div class="empty">Pick one or more calendars in the editor.</div>'
        : m.loading ? '<div class="empty">Loading…</div>'
        : !m.rows.length ? `<div class="empty">Nothing planned in the coming ${this._days()} days.</div>`
        : m.rows.map((r) => r.free
          ? `<div class="day free${r.to ? ' range' : ''}"><b>${esc(r.from)}${r.to ? ' – ' + esc(r.to) : ''}</b>Nothing planned</div>`
          : `<div class="day${r.today ? ' today' : ''}"><span class="block"><small>${esc(r.wd)}</small><b>${r.n}</b></span><div class="evs">${r.evs.map(ev).join('')}</div></div>`).join('');
      return `<ha-card>
        ${m.title ? `<div class="title">${esc(m.title)}</div>` : ''}
        ${m.legend.length ? `<div class="legend">${m.legend.map((l) => `<span><span class="dot" style="--dot:${l.dot}"></span>${esc(l.name)}</span>`).join('')}</div>` : ''}
        ${body}
      </ha-card>`;
    }
    act(a, arg) { if (a === 'open' && arg) this.moreInfo(arg); }
  }
  CranberryCalendarCard.needsEntity = false;
  CranberryCalendarCard.defaults = { days: 14, show_empty: 'fold' };

  // ---------------------------------------------------------------- editors
  const makeEditor = (schema, labels, helpers) => class extends HTMLElement {
    setConfig(config) { this._config = Object.assign({}, config); this._render(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; else this._render(); }
    async connectedCallback() {
      if (!customElements.get('ha-form') && window.loadCardHelpers) {
        try {
          const helpersApi = await window.loadCardHelpers();
          const card = await helpersApi.createCardElement({ type: 'entities', entities: [] });
          if (card && card.constructor && card.constructor.getConfigElement) await card.constructor.getConfigElement();
        } catch (e) { /* ignore */ }
      }
      this._render();
    }
    _render() {
      if (!this._hass || !this._config) return;
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.computeLabel = (s) => labels[s.name] || s.title || s.name;
        this._form.computeHelper = (s) => helpers[s.name];
        this._form.addEventListener('value-changed', (ev) => {
          ev.stopPropagation();
          const config = Object.assign({}, ev.detail.value);
          Object.keys(config).forEach((k) => { if (config[k] === '' || config[k] == null || (Array.isArray(config[k]) && !config[k].length)) delete config[k]; });
          this._config = config;
          this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
          this._render();
        });
        this.appendChild(this._form);
      }
      this._form.hass = this._hass;
      this._form.schema = typeof schema === 'function' ? schema(this._config) : schema;
      this._form.data = this._config;
    }
  };

  const CARDS = [
    {
      tag: 'cranberry-status-card', cls: CranberryStatusCard, name: 'Cranberry status',
      description: 'Heating, lock, alarm or who is home, with buttons beside the name.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('climate.')) || 'zone.home' }),
      schema: (c) => {
        const d = String(c.entity || '').split('.')[0];
        const s = [{ name: 'entity', required: true, selector: { entity: {} } }, { name: 'name', selector: { text: {} } }, { name: 'icon', selector: { icon: {} } }];
        if (d === 'lock') s.push({ name: 'alarm', selector: { entity: { domain: 'alarm_control_panel' } } }, { name: 'alert_when_unlocked', selector: { boolean: {} } });
        if (d === 'alarm_control_panel') s.push({ name: 'modes', selector: { select: { multiple: true, options: Object.keys(ALARM_MODES).map((k) => ({ value: k, label: ALARM_MODES[k].label })) } } }, { name: 'code', selector: { text: { type: 'password' } } });
        if (d === 'zone' || d === 'person') s.push({ name: 'people', selector: { entity: { multiple: true, domain: 'person' } } });
        return s;
      },
      labels: { entity: 'Entity', name: 'Name', icon: 'Icon', alarm: 'Alarm', alert_when_unlocked: 'Always warn when unlocked', modes: 'Alarm buttons', code: 'Alarm code', people: 'People' },
      helpers: { entity: 'Climate, lock, alarm, or zone.home for who is home.', alarm: 'Turns the card red while the door is unlocked and this alarm is on.', people: 'Optional. Leave empty to use everyone in the zone.', code: 'Only if your alarm needs a code to arm or disarm.' }
    },
    {
      tag: 'cranberry-room-card', cls: CranberryRoomCard, name: 'Cranberry room',
      description: 'A room: tap the icon to switch it on or off, tap the card to open its pop-up.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('light.')) || 'light.living_room' }),
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: ['light', 'switch', 'group'] } } },
        { name: 'name', selector: { text: {} } }, { name: 'icon', selector: { icon: {} } },
        { name: 'temperature', selector: { entity: { domain: ['sensor', 'weather'] } } },
        { name: 'popup', selector: { text: {} } },
        { name: 'lights', selector: { entity: { multiple: true, domain: ['light', 'switch'] } } },
        { name: 'alerts', selector: { entity: { multiple: true, domain: ['binary_sensor', 'lock', 'cover'] } } },
        { type: 'expandable', name: 'extra_button', flatten: true, title: 'Extra button', icon: 'mdi:gesture-tap-button', schema: [
          { name: 'button_entity', selector: { entity: { domain: ['input_boolean', 'switch', 'light', 'script', 'scene'] } } },
          { name: 'button_name', selector: { text: {} } },
          { name: 'button_icon', selector: { icon: {} } }
        ] }
      ],
      labels: { entity: 'Room lights (group, light or switch)', name: 'Name', icon: 'Icon', temperature: 'Temperature sensor', popup: 'Pop-up to open', lights: 'Lights to count', alerts: 'Turn brick when open', button_entity: 'Toggle', button_name: 'Name', button_icon: 'Icon' },
      helpers: { popup: 'The Bubble pop-up hash, for example #living-room. Leave empty to open the details instead.', lights: 'Optional. Leave empty to use the members of the group.', alerts: 'Optional. Doors, windows or locks in this room. While one is open or unlocked, the card turns brick and says which.', button_entity: 'Optional. A toggle you want on the room card itself, like a Lego light. Olive while it is on.' }
    },
    {
      tag: 'cranberry-scene-card', cls: CranberrySceneCard, name: 'Cranberry scene',
      description: 'One scene button that stays highlighted while the scene is active.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('scene.')) || 'scene.evening' }),
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: ['scene', 'script'] } } },
        { name: 'name', selector: { text: {} } }, { name: 'icon', selector: { icon: {} } },
        { type: 'expandable', name: 'advanced', flatten: true, title: 'When is it active?', icon: 'mdi:help-circle-outline', schema: [
          { name: 'compare', selector: { entity: { multiple: true, domain: ['scene', 'script'] } } },
          { name: 'active_entity', selector: { entity: {} } },
          { name: 'active_state', selector: { text: {} } }
        ] }
      ],
      labels: { entity: 'Scene', name: 'Name', icon: 'Icon', compare: 'Compare with', active_entity: 'Active when this entity…', active_state: '…has this state' },
      helpers: {
        entity: 'Active while it was the last scene you picked and none of its lights changed since.',
        compare: 'Optional. Only these scenes count as “the last one picked”. Empty means all scenes.',
        active_entity: 'Optional. Use a helper instead, for example an input_select with the scene name.',
        active_state: 'Defaults to on, or the scene name for a dropdown helper.'
      }
    },
    {
      tag: 'cranberry-media-card', cls: CranberryMediaCard, name: 'Cranberry music',
      description: 'What is playing, with previous, play/pause and next. Olive while playing.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('media_player.')) || 'media_player.living_room' }),
      schema: [{ name: 'entity', required: true, selector: { entity: { domain: 'media_player' } } }, { name: 'name', selector: { text: {} } }, { name: 'show_artwork', selector: { boolean: {} } }, { name: 'popup', selector: { text: {} } }],
      labels: { entity: 'Media player', name: 'Room name', show_artwork: 'Show album art', popup: 'Pop-up to open' },
      helpers: { popup: 'The Bubble pop-up hash, for example #music. Leave empty to open the details instead.' }
    },
    {
      tag: 'cranberry-washer-card', cls: CranberryWasherCard, name: 'Cranberry washing machine',
      description: 'Time left, phase and progress while it runs; cranberry when the washing is done.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('sensor.') && e.endsWith('_progress')) || 'sensor.washer_progress' }),
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'sensor' } } },
        { name: 'done', selector: { entity: { domain: ['input_boolean', 'binary_sensor', 'switch'] } } },
        { name: 'done_at', selector: { entity: { domain: ['sensor', 'input_datetime'] } } },
        { name: 'name', selector: { text: {} } },
        { name: 'size', selector: { select: { mode: 'dropdown', options: [{ value: 'large', label: 'Large, with phase steps' }, { value: 'row', label: 'Row, like the status cards' }] } } },
        { name: 'alert_after', selector: { number: { min: 15, max: 240, step: 15, mode: 'slider', unit_of_measurement: 'min' } } },
        { name: 'hide_when_quiet', selector: { boolean: {} } }
      ],
      labels: { entity: 'Washing machine progress sensor', done: 'Done helper', done_at: 'Finished at', name: 'Name', size: 'Size', alert_after: 'Turn red after', hide_when_quiet: 'Hide while it is idle' },
      helpers: {
        entity: 'The “Progress” sensor from localthings. The card finds the machine’s other entities from it.',
        done: 'On while there is washing to take out. “Emptied” turns it off.',
        done_at: 'Optional. When the wash finished. Without it, the time the done helper switched on.',
        alert_after: 'How long done washing may wait before the card turns red.'
      }
    },
    {
      tag: 'cranberry-thermostat-card', cls: CranberryThermostatCard, name: 'Cranberry thermostat',
      description: 'The whole card says what the thermostat is doing: colour, the setpoint large, and one sentence. Every HVAC mode, heat/cool, presets, fan, swing and humidity.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('climate.')) || 'climate.living_room' }),
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'climate' } } },
        { name: 'name', selector: { text: {} } },
        { name: 'size', selector: { select: { mode: 'box', options: [{ value: 'full', label: 'Full' }, { value: 'compact', label: 'Compact' }] } } },
        { name: 'popup', selector: { text: {} } },
        { name: 'modes', selector: { select: { multiple: true, options: [{ value: 'off', label: 'Off' }, { value: 'heat', label: 'Heat' }, { value: 'cool', label: 'Cool' }, { value: 'heat_cool', label: 'Heat/cool' }, { value: 'auto', label: 'Auto' }, { value: 'dry', label: 'Dry' }, { value: 'fan_only', label: 'Fan only' }] } } },
        { name: 'show_modes', selector: { boolean: {} } },
        { name: 'show_eta', selector: { boolean: {} } },
        { name: 'show_humidity', selector: { boolean: {} } }
      ],
      labels: { entity: 'Thermostat', name: 'Room name', size: 'Size', popup: 'Pop-up to open', modes: 'Modes to show', show_modes: 'Show the modes', show_eta: 'Say how long it takes', show_humidity: 'Show the humidity target' },
      helpers: {
        size: 'Compact is one strip for the everyday column: the setpoint, a short sentence and −/+. Modes, fan and swing stay in the full card.',
        popup: 'Optional. The Bubble pop-up hash, for example #living-room, opened by tapping the room name. Leave empty to open the details instead.',
        modes: 'Optional. Leave empty to show every mode the thermostat has. Full size only.',
        show_eta: 'Works out “warm in about … minutes” from how fast the room warmed up in the current run (needs the recorder).',
        show_humidity: 'Only for thermostats that can aim for a humidity.'
      }
    },
    {
      tag: 'cranberry-car-card', cls: CranberryCarCard, name: 'Cranberry car',
      description: 'Where the car is parked: the place, the layer and zone in a garage, or a note and a map.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('input_select.') && e.includes('park')) || 'input_select.parking_location' }),
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'input_select' } } },
        { name: 'name', selector: { text: {} } },
        { type: 'expandable', name: 'garage', flatten: true, title: 'Parking garage', icon: 'mdi:garage-variant', schema: [
          { name: 'layers_for', selector: { text: {} } },
          { name: 'layer', selector: { entity: { domain: 'input_select' } } },
          { name: 'zone', selector: { entity: { domain: 'input_select' } } }
        ] },
        { type: 'expandable', name: 'other', flatten: true, title: 'Anywhere else', icon: 'mdi:map-marker-outline', schema: [
          { name: 'note_for', selector: { text: {} } },
          { name: 'note', selector: { entity: { domain: 'input_text' } } },
          { name: 'spot', selector: { entity: {} } }
        ] }
      ],
      labels: { entity: 'Where it is parked', name: 'Name', layers_for: 'Option for the garage', layer: 'Layer', zone: 'Zone', note_for: 'Option for anywhere else', note: 'Note', spot: 'Location for the map' },
      helpers: {
        layers_for: 'The option that shows the layer and zone chips, e.g. Garage.',
        note_for: 'The option that shows the note and the map, e.g. Elsewhere.',
        spot: 'Any entity with latitude and longitude, like sensor.car_parked_spot.'
      }
    },
    {
      tag: 'cranberry-calendar-card', cls: CranberryCalendarCard, name: 'Cranberry calendar',
      description: 'The coming days from your calendars, with the same date blocks as the home card.',
      stub: (ids) => ({ calendars: ids.filter((e) => e.startsWith('calendar.')).slice(0, 3) }),
      schema: [
        { name: 'calendars', selector: { entity: { multiple: true, domain: 'calendar' } } },
        { name: 'title', selector: { text: {} } },
        { name: 'days', selector: { number: { min: 1, max: 31, step: 1, mode: 'slider' } } },
        { name: 'show_empty', selector: { select: { mode: 'dropdown', options: [{ value: 'fold', label: 'Fold into one line' }, { value: 'hide', label: 'Leave out' }] } } }
      ],
      labels: { calendars: 'Calendars', title: 'Title', days: 'Days to show', show_empty: 'Days without plans' },
      helpers: { calendars: 'The colours follow this order: cranberry, olive, harbour, ochre, quail.', title: 'Optional. Leave empty inside a pop-up, which has its own title.' }
    },
    {
      tag: 'cranberry-waste-card', cls: CranberryWasteCard, name: 'Cranberry waste collection',
      description: 'Which bin goes out next. Cranberry the evening before, with “It’s out”.',
      stub: () => ({ waste: 'auto' }),
      schema: [
        { name: 'waste', selector: { entity: { multiple: true, domain: 'sensor' } } },
        { name: 'waste_out', selector: { entity: { domain: 'input_boolean' } } },
        { name: 'size', selector: { select: { mode: 'dropdown', options: [{ value: 'large', label: 'Large, with the next collections' }, { value: 'row', label: 'Row, like the status cards' }] } } },
        { name: 'waste_remind_from', selector: { time: {} } },
        { name: 'waste_collected_by', selector: { time: {} } },
        { name: 'hide_when_quiet', selector: { boolean: {} } }
      ],
      labels: { hide_when_quiet: 'Hide when nothing goes out tomorrow', waste: 'Waste sensors (Afvalwijzer)', waste_out: 'Bins out helper', size: 'Size', waste_remind_from: 'Remind from (the evening before)', waste_collected_by: 'Collected by (on the day)' },
      helpers: { waste: 'Leave empty to find the Afvalwijzer sensors automatically.', waste_out: 'Toggle helper. “It’s out” switches it on; it is ignored again after the collection.' }
    }
  ];

  window.customCards = window.customCards || [];
  CARDS.forEach((d) => {
    const editorTag = d.tag + '-editor';
    d.cls.getConfigElement = () => document.createElement(editorTag);
    d.cls.getStubConfig = (hass) => d.stub(Object.keys((hass && hass.states) || {}));
    if (!customElements.get(d.tag)) customElements.define(d.tag, d.cls);
    if (!customElements.get(editorTag)) customElements.define(editorTag, makeEditor(d.schema, d.labels, d.helpers));
    if (!window.customCards.some((x) => x.type === d.tag)) window.customCards.push({ type: d.tag, name: d.name, description: d.description, preview: true });
  });
})();
