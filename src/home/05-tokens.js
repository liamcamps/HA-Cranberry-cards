  // ---------- Colours ----------
  // Every colour in the cards comes from the Cranberry Canvas theme's cc- tokens. The values
  // below are only fallbacks, used when the theme isn't installed (they match its light mode).
  // To change a colour, change it in the theme, not here: this is the one place in the cards
  // where colour values are written down.
  //
  // [theme token, name inside the cards, fallback]
  const TOKENS = [
    // accents: small marks, lighter in dark mode
    ['cc-cranberry', '--cc-c', '#591E21'],
    ['cc-olive', '--cc-o', '#514718'],
    ['cc-quail', '--cc-q', '#7D8689'],
    ['cc-brick', '--cc-b', '#A8352F'],
    ['cc-harbour', '--cc-h', '#40606A'],
    ['cc-ochre-tone', '--cc-ochre', '#8B621F'],
    // fills: whole coloured cards and surfaces, the same in both modes
    ['cc-fill-cranberry', '--cv-fill-c', '#591E21'],
    ['cc-fill-olive', '--cv-fill-o', '#514718'],
    ['cc-fill-harbour', '--cv-fill-h', '#40606A'],
    ['cc-fill-ochre', '--cv-fill-ochre', '#8B621F'],
    ['cc-fill-quail', '--cv-fill-q', '#545C5F'],
    ['cc-fill-ember', '--cv-fill-ember', '#3A2F2C'],
    // text and marks on those fills, and on cream
    ['cc-cream', '--cc-on', '#F2ECE0'],
    ['cc-cream-muted', '--cv-on-muted', '#D9C3C0'],
    ['cc-on-cream', '--cv-on-cream', '#231C1A'],
    ['cc-shadow', '--cv-shadow', '#000000'],
    ['cc-brick-text', '--cv-brick-text', '#A8352F'],
    // weather: the art, the rain, and the temperature colours from cold to warm
    ['cc-sun', '--cv-sun', '#F0B85A'],
    ['cc-mist', '--cv-mist', '#9CC3D6'],
    ['cc-taupe', '--cv-taupe', '#B5ABA0'],
    ['cc-canvas', '--cv-canvas', '#E3DDCF'],
    ['cc-temp-freezing', '--cv-temp-1', '#B9D7E8'],
    ['cc-temp-cold', '--cv-temp-2', '#C4D6DE'],
    ['cc-temp-mild', '--cv-temp-3', '#E2DCC8'],
    ['cc-temp-warm', '--cv-temp-4', '#EEC480'],
    ['cc-temp-hot', '--cv-temp-5', '#F2A05C'],
    // bins: like the real ones
    ['cc-bin-green', '--cv-bin-green', '#5E7A34'],
    ['cc-bin-paper', '--cv-bin-paper', '#3F6585'],
    ['cc-bin-plastic', '--cv-bin-plastic', '#C2702A'],
    ['cc-bin-rest', '--cv-bin-rest', '#4E5457'],
    // calendars, in the order they are picked
    ['cc-calendar-1', '--cv-cal-1', '#B8565B'],
    ['cc-calendar-2', '--cv-cal-2', '#8C7F45'],
    ['cc-calendar-3', '--cv-cal-3', '#40606A'],
    ['cc-calendar-4', '--cv-cal-4', '#8B621F'],
    ['cc-calendar-5', '--cv-cal-5', '#6E777A']
  ];
  // Home Assistant's own colours, with the same fallbacks
  const HA_TOKENS = [
    ['--cc-card', 'var(--ha-card-background, var(--card-background-color, #EEE9DF))'],
    ['--cc-text', 'var(--primary-text-color, #231C1A)'],
    ['--cc-muted', 'var(--secondary-text-color, #675F5A)'],
    ['--cc-bgc', 'var(--primary-background-color, #E3DDCF)']
  ];
  const TOKENS_CSS = TOKENS.map(([t, v, f]) => `${v}: var(--${t}, ${f});`).concat(HA_TOKENS.map(([v, x]) => `${v}: ${x};`)).join(' ');
  // a colour mixed with transparency, from a token: alpha('--cc-on', 14)
  const alpha = (v, pct) => `color-mix(in srgb, var(${v}) ${pct}%, transparent)`;
  window.CranberryTokens = { css: TOKENS_CSS, alpha };

