  // Use Lucide icons when the Lucide icons integration is installed, otherwise Home Assistant's own.
  const LUCIDE = { vacation: 'plane', car: 'car', pin: 'map-pin', nav: 'navigation', plus: 'plus', minus: 'minus', chev: 'chevron-down', home: 'house', radiator: 'heater', thermometer: 'thermometer', evening: 'sunset', night: 'moon', walk: 'footprints', people: 'users', washer: 'washing-machine', alert: 'triangle-alert', check: 'check', 'chevron-right': 'chevron-right', info: 'info', lock: 'lock', 'lock-open': 'lock-open', shield: 'shield-check', 'shield-off': 'shield-off', play: 'play', pause: 'pause', stop: 'square', 'skip-next': 'skip-forward', 'skip-previous': 'skip-back', bulb: 'lightbulb', power: 'power', x: 'x', 'chevron-left': 'chevron-left', clock: 'clock', pin: 'map-pin', user: 'user' };
  const ccIcon = (name, fallback) => (window.customIcons && window.customIcons.lucide && LUCIDE[name] ? 'lucide:' + LUCIDE[name] : fallback);
  const { morph, MOTION } = window.CranberryMorph;
  const { alpha } = window.CranberryTokens;
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
      ${window.CranberryTokens.css}
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

