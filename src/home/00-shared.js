  const VERSION = '2.35.0';
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
  // the weather art takes its colours from the theme
  const CREAM = 'var(--cc-on)', AMBER = 'var(--cv-sun)', BLUE = 'var(--cv-mist)', ICE = BLUE, DUSK = 'var(--cv-taupe)', BOLT = AMBER;
  const ART = {
    'clear-night': [[A.moon, CREAM], [A.stars, 'var(--cv-canvas)'], null],
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

  // Temperature colour, light enough to read on cranberry: the theme's five temperature colours
  // (cc-temp-freezing … cc-temp-hot) at these temperatures in °C, blended in between
  const TS = [-5, 3, 9, 14, 22];
  const tempColour = (c) => {
    let i = 0;
    while (i < TS.length - 2 && c > TS[i + 1]) i++;
    const f = Math.max(0, Math.min(1, (c - TS[i]) / (TS[i + 1] - TS[i])));
    return `color-mix(in srgb, var(--cv-temp-${i + 1}) ${Math.round((1 - f) * 1000) / 10}%, var(--cv-temp-${i + 2}))`;
  };

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : null; };
  const round = (v) => (v == null ? '–' : String(Math.round(v)).replace('-', '−'));
  const listJoin = (arr, and) => arr.length <= 1 ? (arr[0] || '') : arr.slice(0, -1).join(', ') + ' ' + (and || 'and') + ' ' + arr[arr.length - 1];
  const capital = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  const loadFonts = () => {
    if (document.getElementById('cranberry-home-card-fonts')) return;
    const l = document.createElement('link');
    l.id = 'cranberry-home-card-fonts';
    l.rel = 'stylesheet';
    l.href = FONT_URL;
    document.head.appendChild(l);
  };


