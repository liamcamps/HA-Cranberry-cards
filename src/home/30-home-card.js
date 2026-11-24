  const STYLE = `
    :host { display: block; ${TOKENS_CSS} }
    ha-card {
      --chc-bg: var(--cranberry-home-card-background, var(--cv-fill-c));
      --chc-fg: var(--cc-on); --chc-sub: var(--cv-on-muted); --chc-rule: ${alpha('--cc-on', 20)};
      background: var(--chc-bg); color: var(--chc-fg);
      border: 0; border-radius: var(--cc-r-card, 24px);
      overflow: hidden; height: 100%; box-sizing: border-box; min-height: var(--chc-fit, 0px); position: relative;
      font-family: Figtree, var(--ha-font-family-body, var(--paper-font-body1_-_font-family, sans-serif));
      display: flex; flex-direction: column;
    }
    .serif { font-family: Fraunces, Georgia, serif; font-variation-settings: 'SOFT' 100; font-weight: 400; letter-spacing: -0.03em; }
    button { font: inherit; color: inherit; background: none; border: 0; padding: 0; margin: 0; cursor: pointer; text-align: inherit; }
    button:focus-visible { outline: 2px solid var(--chc-fg); outline-offset: 3px; border-radius: var(--cc-r-chip, 8px); }
    .warn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 20px; box-sizing: border-box; background: var(--cc-on); color: var(--cc-b); font-size: 13px; font-weight: 600; }
    .body { flex: 1; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 28px; padding: 22px 24px; box-sizing: border-box; }
    .home { min-width: 0; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; }
    .top { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; }
    .date { font-size: 14px; font-weight: 500; color: var(--chc-sub); }
    .time { font-size: 80px; line-height: 0.9; }
    .stack { display: flex; flex-direction: column; gap: 8px; }
    .issue { align-self: flex-start; max-width: 100%; box-sizing: border-box; min-height: 40px; padding: 6px 14px 6px 6px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-on); color: var(--cc-b); display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .bins { min-height: 40px; padding: 6px 14px 6px 6px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-on); color: var(--cv-fill-c); display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; }
    .bins .n { height: 28px; padding: 0 4px; border-radius: var(--cc-r-chip, 8px); background: ${alpha('--cv-fill-c', 8)}; display: flex; align-items: center; gap: 2px; }
    .lamps { align-self: flex-start; max-width: 100%; box-sizing: border-box; min-height: 40px; padding: 6px 10px 6px 6px; border-radius: var(--cc-r-ctl, 12px); background: ${alpha('--cc-on', 14)}; color: var(--chc-fg); display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; text-align: left; }
    .lamps .n { height: 28px; padding: 0 8px 0 6px; flex-shrink: 0; border-radius: var(--cc-r-chip, 8px); background: var(--chc-fg); color: var(--chc-bg); display: flex; align-items: center; gap: 4px; font-weight: 700; }
    .lamps > svg { flex-shrink: 0; opacity: .7; margin-left: -4px; }
    .lamps[aria-expanded="true"] { background: ${alpha('--cc-on', 24)}; }
    .menu { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; gap: 10px; padding: 16px 20px; box-sizing: border-box; background: color-mix(in srgb, var(--chc-bg) 88%, var(--cv-shadow)); animation: cc-in .25s ease both; }
    .mhead { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .mtitle { font-size: 17px; font-weight: 600; }
    .mlist { flex: 1; min-height: 0; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); align-content: start; gap: 4px 20px; }
    .mgroup { display: flex; flex-direction: column; }
    .mlabel { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--chc-sub); padding: 6px 0 2px; }
    .mrow { display: flex; align-items: center; gap: 10px; min-height: 40px; border-bottom: 1px solid var(--chc-rule); }
    .mname { flex: 1; min-width: 0; display: flex; align-items: baseline; gap: 8px; font-size: 15px; font-weight: 500; }
    .mname span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .mname small { font-size: 13px; color: var(--chc-sub); }
    .mbtn { width: 34px; height: 34px; flex-shrink: 0; border-radius: var(--cc-r-ctl, 12px); background: ${alpha('--cc-on', 12)}; display: flex; align-items: center; justify-content: center; }
    .alloff { align-self: flex-start; height: 40px; padding: 0 16px 0 12px; border-radius: var(--cc-r-ctl, 12px); background: var(--chc-fg); color: var(--chc-bg); display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; }
    @media (prefers-reduced-motion: reduce) { .menu { animation: none; } }
    .issue .n { width: 28px; height: 28px; flex-shrink: 0; border-radius: var(--cc-r-chip, 8px); background: var(--cc-b); color: var(--cc-on); display: flex; align-items: center; justify-content: center; font-weight: 700; }
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
    .bars span { flex: 1; min-height: 2px; border-radius: 3px 3px 0 0; background: var(--cv-mist); }
    .ticks { display: flex; justify-content: space-between; }
    .chip { display: none; align-items: center; gap: 8px; }
    .chip .serif { font-size: 40px; line-height: 1; }
    .empty { padding: 24px; font-size: 15px; }
    /* not responding: faded, like the other cards */
    .na { opacity: .6; }
    /* coming up: the next things on the calendar, under the clock */
    .agenda { flex: 1; display: flex; flex-direction: column; gap: 8px; margin-top: 14px; min-height: 0; }
    .agenda .k, .stat .k { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--chc-sub); }
    .agenda .k { margin-bottom: 2px; }
    .agenda button.k, .agenda button.none { align-self: flex-start; text-align: left; }
    .ev { display: flex; align-items: center; gap: 12px; max-width: 100%; text-align: left; }
    .ev .day { width: 44px; height: 48px; flex-shrink: 0; border-radius: var(--cc-r-ctl, 12px); background: ${alpha('--cc-on', 12)}; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .ev .day small { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--chc-sub); line-height: 12px; }
    .ev .day .serif { font-size: 24px; line-height: 26px; }
    .ev .txt { min-width: 0; display: flex; flex-direction: column; }
    .ev .what { font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ev .when { font-size: 13px; font-weight: 500; color: var(--chc-sub); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .agenda .none { font-size: 16px; font-weight: 500; color: var(--chc-sub); }
    /* weather details: a row of facts, and a chart that uses the height */
    /* always one row: the columns shrink to their content, and the last one goes when it doesn't fit */
    .stats { display: flex; justify-content: space-between; gap: 10px; padding: 12px 0 2px; border-top: 1px solid var(--chc-rule); container-type: inline-size; }
    .stat { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 0 1 auto; }
    .stat .k { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .stat b { font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    @container (max-width: 340px) { .stat:nth-child(4) { display: none; } }
    @container (max-width: 250px) { .stat:nth-child(3) { display: none; } }
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
        const when = s.all ? this.t('All day') : started ? this.t('Now, until {time}', { time: this._fmtTime(new Date(endT)) }) : this._fmtTime(s.d);
        list.push({ day: started ? today : day0(s.d), t: started ? now.getTime() : s.d.getTime(), all: s.all, when, what: e.summary || e.message || this.t('Busy'), id: e.cal });
      });
      // the next bin collection, unless the bins chip already says it
      if (c.waste && !bins) {
        const ws = wasteState(this._hass, c, now);
        const next = (ws.upcoming || []).filter((x) => x.days <= 2);
        if (next.length) {
          const same = next.filter((x) => x.days === next[0].days);
          list.push({ day: day0(next[0].date), t: day0(next[0].date), all: true, when: this.t('Bin collection'), what: label(this._hass, same), id: same[0].id });
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
        return { wd: fmt({ weekday: 'short' }).format(d).replace(/\.$/, ''), n: d.getDate(), what: g.what, when: g.when + (g.more ? ' · ' + this.t('+{n} more', { n: g.more }) : ''), id: g.id,
          aria: fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(d) + ': ' + g.what + ', ' + g.when };
      });
    }

    // ----- Helpers -----
    // text in the user's language: Dutch when Home Assistant is set to Dutch, else English
    t(text, vars) { return tr(this._hass, text, vars); }

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
      if (min < 1) return this.t('just now');
      if (min < 60) return this.t('{n} min ago', { n: min });
      const hrs = Math.floor(min / 60), rest = min % 60;
      if (hrs < 24) return rest && hrs < 6 ? this.t('{h} h {m} min ago', { h: hrs, m: rest }) : this.t('{h} h ago', { h: hrs });
      const days = Math.floor(hrs / 24);
      return days === 1 ? this.t('yesterday') : this.t('{n} days ago', { n: days });
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
          issues.push({ id, text: this.t('{name} {state}', { name: label, state: String(this._stateText(st)).toLowerCase() }) });
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
          issues.push({ id: c.laundry_done, text: this.t('{name} done {ago}', { name: c.laundry_name || this.t('Washing machine'), ago: this._ago(at, now) }) });
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
          const untilText = until ? this.t('until {time}', { time: this._fmtTime(until) }) : null;
          // English by default: KNMI's own texts are Dutch only
          const english = c.warning_text !== 'original' && WARN_EN[wcond];
          if (english) {
            text = this.t(WARN_EN[wcond][0] + '@warning');
            let advice = this.t(WARN_EN[wcond][1]);
            if (rank >= 3) advice += ' ' + this.t('Follow the advice of the authorities.');
            else if (rank === 2 && WARN_TRAVEL.indexOf(wcond) >= 0) advice += ' ' + this.t('Avoid travelling if you can.');
            detail = advice;
          }
          const short = String(text).split(/[.\n]/)[0].slice(0, 70);
          warning = {
            entity: firstId,
            strip: [level ? this.t('Code {level}', { level: c.warning_language === 'nl' || isNl(h) ? levelNl[level] : level }) : null, short || null, untilText].filter(Boolean).join(' · '),
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
            chip: capital(String(english ? this.t('{what} warning', { what: this.t(WARN_EN[wcond][0] + '@warning') }) : (event || (WARN_WORD[wcond] ? this.t('{what} warning', { what: this.t(WARN_WORD[wcond] + '@warning') }) : (level ? this.t('Code {level}', { level: isNl(h) ? levelNl[level] : level }) : this.t('Weather warning')))))) + (untilText ? ' ' + untilText : '')
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
        if (!lit.length) lights = this.t('All lights are off.');
        else if (lit.length > 3) lights = this.t('Lights on in {n} places.', { n: lit.length });
        else lights = this.t('Lights on in {where}.', { where: listJoin(lit, this.t('and')) });
      }
      const lead = this.t(issues.length ? (issues.length === 1 ? 'One thing needs you.' : (issues.length === 2 ? 'Two things need you.' : '{n} things need you.')) : 'All quiet.', { n: issues.length });
      // the lights that are on, for the chip and its menu; a light group lists its members that are on
      const pct = (st) => (st.attributes.brightness != null ? Math.round(st.attributes.brightness / 2.55) + '%' : '');
      const menu = (c.lights || []).filter((id) => h.states[id] && h.states[id].state === 'on').map((id) => {
        const st = h.states[id];
        const members = Array.isArray(st.attributes.entity_id) ? st.attributes.entity_id.filter((e) => h.states[e] && h.states[e].state === 'on') : [];
        return { id, name: this._area(id) || this._name(id), items: (members.length ? members : [id]).map((e) => ({ id: e, name: this._name(e), level: pct(h.states[e]) })) };
      });
      // next to a red chip, the lights chip keeps it short so both fit on one line
      const lampText = issues.length && lit.length > 1 ? this.t(litNames.length ? 'Lights on in {n} places' : 'Lights on in {n} rooms', { n: lit.length }) : lights.replace(/\.$/, '');
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
      if (app != null && Math.round(app) !== Math.round(temp)) feelsBits.push(this.t('Feels like {temp}', { temp: round(app) + '°' }));
      if (temps12.length) feelsBits.push(night ? this.t('low {temp}', { temp: round(Math.min.apply(null, temps12)) + '°' }) : this.t('high {temp}', { temp: round(Math.max.apply(null, temps12)) + '°' }));
      else if (!hourly && fc[0]) feelsBits.push(this.t('high {temp}', { temp: round(num(fc[0].temperature)) + '°' }));
      const gust = num(oa.wind_gust_speed) != null ? num(oa.wind_gust_speed) : num(at.wind_gust_speed);
      if (warning && gust) feelsBits.unshift(this.t('Gusts up to {speed}', { speed: Math.round(gust) + ' ' + (oa.wind_speed_unit || at.wind_speed_unit || 'km/h') }));

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
        insight = this.t('Bring loose things in from outside before it picks up.');
        icon = I.alert;
      } else if (warning && (wc.indexOf('snow') >= 0 || wc === 'hail')) {
        insight = this.t('Slippery out there. Take it slow on the roads and paths.');
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
              insight = this.t('Rain stops around {stop}, starts again around {start}.', { stop: tm(nc[dry]), start: tm(nc[again]) });
            } else {
              // beyond the nowcast, look at the hourly forecast
              const later = next12.find((f) => Date.parse(f.datetime) > Date.parse(end.datetime) && wet(f));
              const lastHour = next12.length ? next12[next12.length - 1] : null;
              if (later) insight = this.t('Rain stops around {stop}, back around {start}.', { stop: tm(nc[dry]), start: t(later) });
              else insight = this.t('Rain stops around {stop}, dry after that.', { stop: tm(nc[dry]) });
            }
            icon = I.clock;
          } else { insight = this.t('Rain for at least the next two hours. Take an umbrella.'); icon = I.umbrella; }
        } else {
          const start = nc.findIndex(ncWet);
          let peak = start;
          nc.forEach((p, i) => { if ((num(p.precipitation) || 0) > (num(nc[peak].precipitation) || 0)) peak = i; });
          const mins = Math.max(5, Math.round((Date.parse(nc[start].datetime) - now.getTime()) / 60000 / 5) * 5);
          insight = this.t(mins <= 30 ? (peak !== start ? 'Rain in about {n} minutes, heaviest around {peak}.' : 'Rain in about {n} minutes.') : (peak !== start ? 'Rain from about {time}, heaviest around {peak}.' : 'Rain from about {time}.'), { n: mins, time: tm(nc[start]), peak: tm(nc[peak]) });
          icon = I.umbrella;
        }
      } else if (rainNow && !nc.length) {
        const dry = next12.findIndex((f) => !wet(f));
        const again = dry > 0 ? next12.findIndex((f, i) => i > dry && wet(f)) : -1;
        if (dry > 0 && again > 0) { insight = this.t('Rain stops around {stop}, starts again around {start}.', { stop: t(next12[dry]), start: t(next12[again]) }); icon = I.clock; }
        else if (dry > 0) { insight = this.t('Rain stops around {stop}, dry after that.', { stop: t(next12[dry]) }); icon = I.clock; }
        else if (dry === 0) { insight = this.t('Rain is easing off, dry within the hour.'); icon = I.clock; }
        else { insight = this.t('Wet for the next {n} hours. Take an umbrella.', { n: next12.length || 12 }); icon = I.umbrella; }
      } else if (firstWet >= 0) {
        let peak = firstWet;
        next12.forEach((f, i) => { if ((num(f.precipitation) || 0) > (num(next12[peak].precipitation) || 0)) peak = i; });
        insight = this.t(peak !== firstWet ? 'Rain from about {time}, heaviest around {peak}.' : 'Rain from about {time}.', { time: t(next12[firstWet]), peak: t(next12[peak]) });
        icon = I.umbrella;
      } else if (SNOWY.indexOf(cond) >= 0 || (temps12.length && Math.min.apply(null, temps12.map((v) => this._toC(v, unit))) <= 0)) {
        insight = this.t('Freezing, down to {temp}. Watch for slippery paths.', { temp: round(temps12.length ? Math.min.apply(null, temps12) : temp) + '°' });
        icon = I.alert;
      } else if (cond === 'sunny' && sun && sun.attributes.next_setting) {
        insight = this.t('Sunny until {time}. Good time to air the house.', { time: this._fmtTime(new Date(sun.attributes.next_setting)) });
        icon = I.check;
      } else if (hourly && next12.length) {
        const low = Math.min.apply(null, temps12);
        insight = this.t(night ? 'Dry for the next {n} hours, low of {temp}.' : 'Dry for the next {n} hours.', { n: next12.length, temp: round(low) + '°' });
        icon = this._toC(low, unit) < 8 ? I.coat : I.check;
      } else {
        insight = this.t('Dry for now.');
        icon = I.check;
      }
      if (warning && warning.detail && c.warning_detail !== false) { insight = warning.detail; icon = I.alert; }
      if (c.insight === false) insight = null;

      // hourly line
      const step = Math.max(1, Math.min(3, Number(c.hour_step) || 2));
      const hours = [{ temp, cond: atNight(cond, now.getTime()), label: this.t('Now') }];
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
      // a smooth line through every point that never overshoots (monotone cubic, Fritsch–Carlson),
      // so a flat stretch stays flat and the line never dips below the coldest hour
      const smooth = (P) => {
        const n = P.length, d = [], m = [];
        for (let i = 0; i < n - 1; i++) d.push((P[i + 1][1] - P[i][1]) / (P[i + 1][0] - P[i][0]));
        m[0] = d[0]; m[n - 1] = d[n - 2];
        for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
        for (let i = 0; i < n - 1; i++) {
          if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
          const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
          if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
        }
        const f = (v) => v.toFixed(1);
        let out = 'M' + P[0][0] + ' ' + f(P[0][1]);
        for (let i = 0; i < n - 1; i++) {
          const dx = (P[i + 1][0] - P[i][0]) / 3;
          out += 'C' + f(P[i][0] + dx) + ' ' + f(P[i][1] + m[i] * dx) + ' ' + f(P[i + 1][0] - dx) + ' ' + f(P[i + 1][1] - m[i + 1] * dx) + ' ' + P[i + 1][0] + ' ' + f(P[i + 1][1]);
        }
        return out;
      };
      const line = hours.length > 1 ? smooth(pts) : '';
      const area = line ? line + 'L' + pts[pts.length - 1][0] + ' 46L25 46Z' : '';

      // rain bars: 5-minute nowcast when it shows rain, otherwise hourly
      let bars, ticks, rainAria;
      if (ncAny) {
        const maxN = Math.max(2, ...nc.map((p) => num(p.precipitation) || 0));
        bars = nc.map((p) => { const v = (num(p.precipitation) || 0) / maxN; return { h: Math.round(Math.min(1, v) * 100), o: v > 0 ? 1 : 0.35 }; });
        ticks = [0, 6, 12, 18, nc.length - 1].filter((i, k, a) => i < nc.length && a.indexOf(i) === k).map((i) => (i === 0 ? this.t('Now') : this._fmtTime(new Date(nc[i].datetime))));
        rainAria = this.t('Rain for the next {n} minutes', { n: Math.round(nc.length * 5) });
      } else {
      const maxP = Math.max(2, ...next12.map((f) => num(f.precipitation) || 0));
      bars = next12.map((f) => {
        const p = num(f.precipitation);
        const v = p != null && (p > 0 || f.precipitation_probability == null) ? p / maxP : (num(f.precipitation_probability) || 0) / 100 * 0.6;
        return { h: Math.round(Math.min(1, v) * 100), o: v > 0 ? 1 : 0.35 };
      });
      ticks = next12.length ? [0, 3, 6, 9, 11].filter((i) => i < next12.length).map((i) => (i === 0 ? this.t('Now') : this._fmtTime(new Date(next12[i].datetime), false))) : [];
      rainAria = this.t('Rain for the next {n} hours', { n: next12.length });
      }

      // details: high and low, rain chance, wind, the next sunrise or sunset
      let stats = null;
      if (model.details) {
        stats = [];
        const t24 = (hourly ? fc.slice(0, 24) : fc.slice(0, 1)).map((f) => num(f.temperature)).concat(hourly ? [temp] : []).filter((v) => v != null);
        const lo24 = hourly ? fc.slice(0, 24).map((f) => num(f.templow != null ? f.templow : f.temperature)) : fc.slice(0, 1).map((f) => num(f.templow));
        const lows = lo24.concat(t24).filter((v) => v != null);
        if (t24.length) stats.push({ k: this.t('High / low'), v: round(Math.max.apply(null, t24)) + '° / ' + round(Math.min.apply(null, lows)) + '°' });
        const probs = next12.map((f) => num(f.precipitation_probability)).filter((v) => v != null);
        const mmSum = next12.reduce((sum, f) => sum + (num(f.precipitation) || 0), 0);
        if (probs.length) stats.push({ k: this.t('Rain'), v: Math.round(Math.max.apply(null, probs)) + '%' });
        else if (next12.length) stats.push({ k: this.t('Rain'), v: (Math.round(mmSum * 10) / 10).toLocaleString(this._lang()) + ' mm' });
        const ws = num(oa.wind_speed) != null ? num(oa.wind_speed) : num(at.wind_speed);
        const wb = num(oa.wind_bearing) != null ? num(oa.wind_bearing) : num(at.wind_bearing);
        if (ws != null) {
          const dir = wb != null ? (isNl(h) ? ['N', 'NO', 'O', 'ZO', 'Z', 'ZW', 'W', 'NW'] : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'])[Math.round(((wb % 360) + 360) % 360 / 45) % 8] + ' ' : '';
          stats.push({ k: this.t('Wind'), v: dir + Math.round(ws) + ' ' + (oa.wind_speed_unit || at.wind_speed_unit || 'km/h') });
        }
        if (!isNaN(rise) && !isNaN(set)) stats.push(rise < set ? { k: this.t('Sunrise'), v: this._fmtTime(new Date(rise)) } : { k: this.t('Sunset'), v: this._fmtTime(new Date(set)) });
      }

      return Object.assign(model, {
        stats,
        cond: atNight(cond, now.getTime()), unit: unit.replace('°', ''), temp, wna: w.state === 'unavailable', label: w.state === 'unavailable' ? this.t('Not responding') : this._stateText(w), feels: feelsBits.join(' · '),
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
               <path d="${m.line}" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" style="stroke:url(#${g})"></path>
             </svg></div>
             <div class="hours" style="grid-template-columns: repeat(${m.hours.length}, minmax(0,1fr))">${m.hours.map((x) => `<span class="hour"><b style="color:${x.col}">${round(x.temp)}°</b>${this._icon(HOUR_ICON[x.cond] || I.cloud)}<span>${esc(x.label)}</span></span>`).join('')}</div>
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
                <button class="chip" data-entity="${esc(c.weather)}" aria-label="${esc(this.t('{label}, {temp} degrees', { label: m.label, temp: round(m.temp) }))}">
                  ${this._art(m.cond, 44)}<span class="serif" style="color:${m.tempCol}">${round(m.temp)}°</span>
                </button>
              </div>
              ${m.agenda ? `<div class="agenda">${c.calendar_popup ? `<button class="k" data-nav="${esc(c.calendar_popup)}" aria-label="${this.t('Open the calendar')}">${this.t('Coming up')}</button>` : `<span class="k">${this.t('Coming up')}</span>`}${m.agenda.length ? m.agenda.map((e) => `<button class="ev" ${c.calendar_popup ? `data-nav="${esc(c.calendar_popup)}"` : `data-entity="${esc(e.id)}"`} aria-label="${esc(e.aria)}"><span class="day"><small>${esc(e.wd)}</small><span class="serif">${e.n}</span></span><span class="txt"><span class="what">${esc(e.what)}</span><span class="when">${esc(e.when)}</span></span></button>`).join('') : (c.calendar_popup ? `<button class="none" data-nav="${esc(c.calendar_popup)}">${this.t('Nothing planned this week.')}</button>` : `<span class="none">${this.t('Nothing planned this week.')}</span>`)}</div>` : ''}
              <div class="stack">
                ${m.issues.length || m.bins || m.lamps ? `<div class="chips">${m.issues.length ? `<button class="issue" data-entity="${esc(m.issues[0].id)}"><span class="n">${m.issues.length}</span><span>${esc(issueText)}</span></button>` : ''}${m.bins ? `<button class="bins" data-bins="1" aria-label="${esc(m.bins.text)}"><span class="n">${m.bins.colours.map((col) => `<svg width="${m.bins.colours.length > 1 ? 17 : 20}" height="${m.bins.colours.length > 1 ? 17 : 20}" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l-1 13a1.5 1.5 0 0 1-1.5 1.4h-7A1.5 1.5 0 0 1 7 20zM4.5 5h15M10 3h4" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke:${col}"></path><path d="M7.4 10h9.2l-.7 10H8.1z" style="fill:${col}"></path></svg>`).join('')}</span><span>${esc(m.bins.text)}</span></button>` : ''}${m.lamps ? `<button class="lamps" data-lights aria-haspopup="dialog" aria-expanded="${!!this._menu}"><span class="n">${this._icon(I.bulb, 16)}${m.lamps.n}</span><span>${esc(m.lamps.text)}</span>${this._icon(I.chev, 16)}</button>` : ''}</div>` : ''}
                ${c.home_text ? `<p>${esc(m.homeText)}</p>` : ''}
                ${m.insight ? `<p class="insight">${this._icon(m.icon)}<span>${esc(m.insight)}</span></p>` : ''}
              </div>
            </div>
            <div class="weather${m.details ? ' fill' : ''}${m.wna ? ' na' : ''}" role="button" tabindex="0" data-entity="${esc(c.weather)}" aria-label="${esc(this.t('{label}, {temp} degrees', { label: m.label, temp: round(m.temp) }))}">
              <div class="head">
                ${this._art(m.cond, 64)}
                <span class="names"><span class="label">${esc(m.label)}</span><span class="feels">${esc(m.feels)}</span></span>
                <span class="temp serif" style="color:${m.tempCol}">${round(m.temp)}<small>°${esc(m.unit)}</small></span>
              </div>
              ${m.stats && m.stats.length ? `<div class="stats">${m.stats.map((x) => `<span class="stat"><span class="k">${esc(x.k)}</span><b>${esc(x.v)}</b></span>`).join('')}</div>` : ''}
              ${chart}
            </div>
          </div>
          ${this._menu ? `<div class="menu" role="dialog" aria-label="${this.t('Lights that are on')}">
            <div class="mhead"><span class="mtitle">${this.t('Lights on')}</span><button class="mbtn" data-close aria-label="${this.t('Close')}">${this._icon(I.close)}</button></div>
            <div class="mlist">${m.menu.map((g) => `<div class="mgroup">
              <span class="mlabel">${g.items.length > 1 || g.items[0].id !== g.id ? esc(g.name) : (esc(this._area(g.id) || '') || '&nbsp;')}</span>
              ${g.items.map((x) => `<div class="mrow">
                <button class="mname" data-entity="${esc(x.id)}"><span>${esc(x.name)}</span>${x.level ? `<small>${esc(x.level)}</small>` : ''}</button>
                <button class="mbtn" data-off="${esc(x.id)}" aria-label="${esc(this.t('Turn off {name}', { name: x.name }))}">${this._icon(I.power)}</button>
              </div>`).join('')}</div>`).join('')}</div>
            <button class="alloff" data-alloff>${this._icon(I.power, 16)}${this.t('All off')}</button>
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

