  const VERSION = '2.46.0';
  const TAG = 'cranberry-home-card';
  const EDITOR_TAG = 'cranberry-home-card-editor';
  const FONT_URL = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,400..600,100&family=Figtree:wght@400;500;600;700&display=swap';

  // ---------- Icons (24px, stroked) ----------
  // Lucide's shapes (ISC licence), built in so they look the same with or without the Lucide icons integration
  const I = {
    chev: 'm9 18 6-6-6-6',
    close: 'M18 6 6 18M6 6l12 12',
    power: 'M12 2v10M18.4 6.6a9 9 0 1 1-12.77.04',
    bulb: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4',
    moon: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z',
    sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41',
    cloud: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z',
    // sun or moon peeking out from behind a cloud: only the part not behind it is drawn
    partly: 'M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41M15.95 12.65a4 4 0 0 0-5.93-4.13M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6z',
    partlyNight: 'M13 16a3 3 0 0 1 0 6H7a5 5 0 1 1 4.9-6zM18.38 14.51a6 6 0 0 0 3.46-4.13c.15-.62-.66-.97-1.25-.71a4 4 0 0 1-5.26-5.26c.26-.59-.09-1.4-.72-1.25a6 6 0 0 0-4.59 5.36',
    rain: 'M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24M16 14v6M8 14v6M12 16v6',
    pour: 'M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24M9.2 22l3-7M9 13l-3 7M17 13l-3 7',
    storm: 'M6 16.33A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.97M13 12l-3 5h4l-3 5',
    snow: 'M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24M8 15h.01M8 19h.01M12 17h.01M12 21h.01M16 15h.01M16 19h.01',
    hail: 'M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24M16 14v2M8 14v2M16 20h.01M8 20h.01M12 16v2M12 22h.01',
    wind: 'M12.8 19.6A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2M9.8 4.4A2 2 0 1 1 11 8H2',
    fog: 'M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24M16 17H7M17 21H9',
    umbrella: 'M22 12a10.06 10.06 1 0 0-20 0zM12 12v8a2 2 0 0 0 4 0M12 2v1',
    coat: 'M2 12h10M9 4v16M3 9l3 3-3 3M12 6 9 9 6 6M6 18l3-3 1.5 1.5M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z',
    check: 'M20 6 9 17l-5-5',
    clock: 'M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
    alert: 'M21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4M12 17h.01',
    cal: 'M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18'
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
    rainy: I.rain, pouring: I.pour, lightning: I.storm, 'lightning-rainy': I.storm,
    snowy: I.snow, 'snowy-rainy': I.snow, hail: I.hail, windy: I.wind, 'windy-variant': I.wind, exceptional: I.alert
  };
  const RAINY = ['rainy', 'pouring', 'lightning-rainy', 'snowy-rainy', 'hail'];
  const SNOWY = ['snowy', 'snowy-rainy'];
  // the hour icons, shared with the weather card
  window.CranberryWeather = { I, HOUR_ICON, RAINY };
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


