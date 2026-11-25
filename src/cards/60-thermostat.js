  // ---------------------------------------------------------------- thermostat
  // The statement card: the whole card's colour says what the thermostat is doing, the big
  // number is what you set, and one sentence says where the room is and what happens next.
  // Heat/cool stacks its two setpoints. Preset, fan and swing only show when supported.
  const CLIMATE = { TARGET: 1, RANGE: 2, HUMIDITY: 4, FAN: 8, PRESET: 16, SWING: 32 };
  // the card's colour per state, from the theme's fill tokens
  const THERMO_BG = { heating: 'var(--cv-fill-o)', cooling: 'var(--cv-fill-h)', drying: 'var(--cv-fill-ochre)', fan: 'var(--cv-fill-q)', idle: 'var(--cv-fill-ember)', off: 'var(--cv-fill-q)', na: 'var(--cv-fill-q)' };
  const HVAC_NAMES = { off: 'Off', heat: 'Heat', cool: 'Cool', heat_cool: 'Heat/cool', auto: 'Auto', dry: 'Dry', fan_only: 'Fan' };
  class CranberryThermostatCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { position: relative; color: var(--cc-on); padding: 16px 16px 12px 20px; display: flex; flex-direction: column; gap: 6px; transition: background-color .4s ease; }
      .top { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 32px; }
      .room { font-size: 14px; font-weight: 600; opacity: .85; text-align: left; }
      .chip { height: 32px; border-radius: var(--cc-r-chip, 8px); padding: 0 8px 0 10px; background: ${alpha('--cc-on', 14)}; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; }
      .chip[aria-expanded="true"] { background: ${alpha('--cc-on', 28)}; }
      .chip small { font-size: 12px; font-weight: 600; opacity: .75; }
      .chip ha-icon { --mdc-icon-size: 14px; }
      .one { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; min-height: 122px; }
      .one .lbl, .row .lbl { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .72; min-height: 16px; display: block; }
      .big { font-family: Fraunces, Georgia, serif; font-variation-settings: 'SOFT' 100; font-weight: 400; line-height: .95; letter-spacing: -.05em; margin-left: -4px; white-space: nowrap; }
      .steps { display: flex; flex-direction: column; gap: 6px; padding-bottom: 8px; }
      .step { width: 52px; height: 52px; border-radius: 16px; background: ${alpha('--cc-on', 16)}; display: flex; align-items: center; justify-content: center; }
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
      .modes { display: flex; column-gap: 16px; margin-top: 8px; padding-top: 6px; border-top: 1px solid ${alpha('--cc-on', 20)}; }
      .mode { height: 38px; font-size: 15px; font-weight: 700; opacity: .6; border-bottom: 2px solid transparent; flex-shrink: 0; white-space: nowrap; }
      .mode[aria-pressed="true"] { opacity: 1; border-bottom-color: var(--cc-on); }
      .menu { position: absolute; left: 12px; right: 12px; z-index: 2; box-sizing: border-box; border-radius: 16px; background: var(--cc-on); color: var(--cv-on-cream); box-shadow: 0 12px 32px ${alpha('--cv-shadow', 28)}; padding: 6px; display: flex; flex-direction: column; max-height: 300px; overflow-y: auto; animation: cc-in .2s ease both; }
      .menu .t { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--cc-muted); padding: 8px 10px 4px; }
      .opt { height: 40px; border-radius: 10px; padding: 0 10px; display: flex; align-items: center; justify-content: space-between; font-size: 14px; font-weight: 500; text-align: left; }
      .opt[aria-selected="true"] { background: ${alpha('--cv-on-cream', 8)}; font-weight: 700; }
      .opt ha-icon { --mdc-icon-size: 16px; }
      button:focus-visible { outline-color: var(--cc-on); }
      .menu button:focus-visible { outline-color: var(--cv-on-cream); }
      ha-card.compact { padding: 12px 12px 14px 18px; }
      .compact .top { min-height: 28px; }
      .compact .room { font-size: 13px; display: flex; align-items: center; gap: 2px; }
      .compact .room ha-icon { --mdc-icon-size: 14px; }
      .compact .tag { height: 26px; padding: 0 8px; border-radius: var(--cc-r-chip, 8px); background: ${alpha('--cc-on', 14)}; font-size: 12px; font-weight: 700; display: flex; align-items: center; }
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
      .on { height: 40px; flex-shrink: 0; border-radius: var(--cc-r-control, 12px); padding: 0 14px 0 10px; background: var(--cc-on); color: var(--cv-on-cream); font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 6px; }
      .on ha-icon { --mdc-icon-size: 16px; }
      /* compact and narrow: the sentence moves under the setpoint and buttons, so it isn't cut short */
      ha-card { container-type: inline-size; }
      @container (max-width: 360px) {
        .line { flex-wrap: wrap; row-gap: 6px; }
        .line .lead { min-width: 0; }
        .line .steps, .line .on { margin-left: auto; }
        .line .short { order: 3; flex: 1 0 100%; }
      }
      @container (max-width: 240px) { .on .bl { display: none; } .on { padding: 0 11px; } }
      .on:focus-visible { outline-color: var(--cv-on-cream); }
      @media (prefers-reduced-motion: reduce) { ha-card, .row, .mini { transition: none; } .menu { animation: none; } }
    `;
    }
    getGridOptions() { return this._config && this._config.size === 'compact' ? { columns: 12, rows: 'auto', min_columns: 6, min_rows: 2 } : { columns: 12, rows: 'auto', min_columns: 12 }; }
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
      return m < 90 ? this.t('{n} minutes', { n: m }) : this.t('{n} hours', { n: (Math.round(m / 30) / 2).toLocaleString(this._lang()) });
    }
    _etaShort(action, from, to) {
      const m = this._etaMin(action, from, to);
      if (m == null) return null;
      return m < 90 ? this.t('~{n} min', { n: m }) : this.t('~{n} h', { n: (Math.round(m / 30) / 2).toLocaleString(this._lang()) });
    }

    model() {
      const c = this._config, st = this.st(c.entity);
      const na = this.isNa(st) || st.state === 'unknown';
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
      else if (mode === 'off') m.big = this._hass.formatEntityState ? this.fmt(st) : this.t('Off');
      else if (dual) {
        m.rows = [
          { k: 'target_temp_low', label: this.t('Heat below'), value: deg(low), dim: action === 'cooling' },
          { k: 'target_temp_high', label: this.t('Cool above'), value: deg(high), dim: action === 'heating' }
        ];
      } else if (mode === 'dry') {
        if (humT != null && (f & CLIMATE.HUMIDITY)) { m.big = humT + '%'; m.label = this.t('Dry to'); m.steps = 'humidity'; }
        else { m.big = hum != null ? hum + '%' : this.fmt(st); m.label = this.t('Humidity'); }
      } else if (mode === 'fan_only') {
        const fans = a.fan_modes || [];
        m.big = a.fan_mode ? this._attr(st, 'fan_mode', a.fan_mode) : this.t('Fan');
        m.label = this.t('Fan');
        if (fans.length > 1 && (f & CLIMATE.FAN)) m.steps = 'fan';
      } else if (target != null) {
        m.big = deg(target);
        m.label = this.t({ heat: 'Heat to', cool: 'Cool to', auto: 'Around' }[mode] || 'Target');
        m.steps = 'temperature';
      } else { m.big = room || this.fmt(st); m.label = this.t('Now'); }
      m.bigSize = m.big.length > 5 ? 96 : 132;

      // one sentence about what is going on
      const eta = (to) => this._eta(action, cur, to);
      const preset = a.preset_mode && !['none', 'None', 'comfort', 'home'].includes(a.preset_mode) && !na && mode !== 'off' ? this._attr(st, 'preset_mode', a.preset_mode) : '';
      // the room already shows the setpoint: it's only topping up to stay there
      const held = room && target != null && room === deg(target);
      const T = (text, vars) => this.t(text, Object.assign({ room, target: target != null ? deg(target) : '', hum, humT }, vars || {}));
      let s;
      if (na) s = T('The thermostat isn’t responding. Check its power or connection.');
      else if (mode === 'off') s = room ? T('Off. It’s {room} in the {place}.', { place: m.name.toLowerCase() }) : T('Off.');
      else if (dual) s = action === 'heating' ? T(eta(low) ? '{room} now, below {low}. Heating up, warm in about {eta}.' : '{room} now, below {low}. Heating up.', { low: deg(low), eta: eta(low) })
        : action === 'cooling' ? T(eta(high) ? '{room} now, above {high}. Cooling down, cool in about {eta}.' : '{room} now, above {high}. Cooling down.', { high: deg(high), eta: eta(high) })
        : T('{room} now: comfortable, so it’s resting.');
      else if (mode === 'dry') s = T(hum == null ? 'Drying the air.' : humT != null ? 'Drying the air: {hum}% now, down to {humT}%.' : 'Drying the air: {hum}% now.');
      else if (mode === 'fan_only') s = T(room ? 'Just moving air. It’s {room} in the room.' : 'Just moving air.');
      else if ((action === 'heating' || action === 'cooling') && (target == null || !room)) s = T(action === 'heating' ? 'Heating.' : 'Cooling.');
      else if (action === 'heating') s = T(held ? 'It’s {room}, so it’s heating a little to hold {target}.' : eta(target) ? 'It’s {room} now, heating to {target}. Warm in about {eta}.' : 'It’s {room} now, heating to {target}.', { eta: eta(target) });
      else if (action === 'cooling') s = T(held ? 'It’s {room}, so it’s cooling a little to hold {target}.' : eta(target) ? 'It’s {room} now, cooling to {target}. Cool in about {eta}.' : 'It’s {room} now, cooling to {target}.', { eta: eta(target) });
      else if (target != null && mode !== 'auto') s = T(room ? 'Holding at {target}. It’s {room} now.' : 'Holding at {target}.');
      else s = T(!room ? 'Resting.' : mode === 'auto' ? 'It’s {room}. Auto is keeping it there.' : 'It’s {room}. Resting.');
      if (preset) s = preset + ': ' + s.charAt(0).toLowerCase() + s.slice(1);
      m.say = say(s);
      // the compact sentence: shorter, at most two lines
      const etaS = (to) => this._etaShort(action, cur, to);
      let t;
      if (na) t = T('Not responding.');
      else if (mode === 'off') t = T(room ? 'It’s {room} in the room.' : 'Off.');
      else if (dual) t = T(action === 'heating' ? '{room} now. Heating up.' : action === 'cooling' ? '{room} now. Cooling down.' : '{room} now. Comfortable.');
      else if (mode === 'dry') t = T(hum != null ? '{hum}% now. Drying the air.' : 'Drying the air.');
      else if (mode === 'fan_only') t = T(room ? 'Moving air. {room} in the room.' : 'Moving air.');
      else if ((action === 'heating' || action === 'cooling') && (target == null || !room)) t = T(action === 'heating' ? 'Heating.' : 'Cooling.');
      else if (action === 'heating') t = T(held ? 'Heating a little to hold {target}.' : etaS(target) ? '{room} now. Warm in {eta}.' : '{room} now, heating to {target}.', { eta: etaS(target) });
      else if (action === 'cooling') t = T(held ? 'Cooling a little to hold {target}.' : etaS(target) ? '{room} now. Cool in {eta}.' : '{room} now, cooling to {target}.', { eta: etaS(target) });
      else if (mode === 'auto') t = T(room ? '{room} now. Auto is on it.' : 'Auto is on it.');
      else t = T(room ? 'Holding. It’s {room} now.' : 'Holding.');
      m.short = t;
      m.tag = preset;
      m.canOn = !na && mode === 'off';
      m.meta = na ? '' : mode === 'dry' ? (room ? T('It’s {room} in the room') : '') : (hum != null ? T('{hum}% humidity') : '');

      // options, only what the thermostat supports
      const open = this._menu;
      m.preset = !na && mode !== 'off' && (f & CLIMATE.PRESET) && (a.preset_modes || []).length ? { value: a.preset_mode && !['none', 'None'].includes(a.preset_mode) ? this._attr(st, 'preset_mode', a.preset_mode) : this.t('No preset'), open: open === 'preset' } : null;
      m.chips = [];
      if (!na && mode !== 'off') {
        if ((f & CLIMATE.FAN) && (a.fan_modes || []).length && mode !== 'fan_only') m.chips.push({ k: 'fan', label: this.t('Fan'), value: this._attr(st, 'fan_mode', a.fan_mode), open: open === 'fan' });
        if ((f & CLIMATE.SWING) && (a.swing_modes || []).length) m.chips.push({ k: 'swing', label: this.t('Swing'), value: this._attr(st, 'swing_mode', a.swing_mode), open: open === 'swing' });
        if (c.show_humidity !== false && (f & CLIMATE.HUMIDITY) && humT != null && mode !== 'dry') m.chips.push({ k: 'humidity', label: this.t('Humidity'), value: humT + '%', open: open === 'humidity' });
      }
      const LISTS = { preset: [this.t('Preset'), 'preset_mode', a.preset_modes], fan: [this.t('Fan speed'), 'fan_mode', a.fan_modes], swing: [this.t('Swing'), 'swing_mode', a.swing_modes] };
      if (open === 'humidity') {
        const lo = Number(a.min_humidity) || 30, hi = Number(a.max_humidity) || 70;
        const opts = []; for (let x = Math.ceil(lo / 5) * 5; x <= hi; x += 5) opts.push(x);
        m.menu = { title: this.t('Target humidity'), top: false, opts: opts.map((x) => ({ value: String(x), label: x + '%', on: x === humT })) };
      } else if (open && LISTS[open] && (LISTS[open][2] || []).length) {
        const [title, key, list] = LISTS[open];
        m.menu = { title, top: open === 'preset', opts: list.map((x) => ({ value: x, label: this._attr(st, key, x), on: x === a[key] })) };
      } else m.menu = null;
      const shown = (c.modes && c.modes.length ? c.modes : (a.hvac_modes || [])).filter((x) => (a.hvac_modes || []).includes(x));
      m.modes = c.show_modes === false ? [] : shown.map((k) => ({ k, label: HVAC_NAMES[k] ? this.t(HVAC_NAMES[k]) : this._attr(st, 'hvac_mode', k), on: k === mode && !na }));
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
            <button type="button" class="step" data-act="step" data-arg="${r.k}:-1" aria-label="${esc(this.t('Lower {what}', { what: r.label.toLowerCase() }))}"><ha-icon icon="${minus}"></ha-icon></button>
            <button type="button" class="step" data-act="step" data-arg="${r.k}:1" aria-label="${esc(this.t('Raise {what}', { what: r.label.toLowerCase() }))}"><ha-icon icon="${plus}"></ha-icon></button>
          </div>`).join('')}</div>`
        : `<div class="one">
            <span><span class="lbl">${esc(m.label)}</span><span class="big" style="font-size:${m.bigSize}px">${esc(m.big)}</span></span>
            ${m.steps ? `<span class="steps"><button type="button" class="step" data-act="step" data-arg="${m.steps}:1" aria-label="${this.t('Raise')}"><ha-icon icon="${plus}"></ha-icon></button><button type="button" class="step" data-act="step" data-arg="${m.steps}:-1" aria-label="${this.t('Lower')}"><ha-icon icon="${minus}"></ha-icon></button></span>` : ''}
          </div>`}
        <p class="say">${esc(m.say)}</p>
        ${m.meta ? `<span class="meta">${esc(m.meta)}</span>` : ''}
        ${m.chips.length ? `<div class="chips">${m.chips.map((x) => `<button type="button" class="chip" data-act="menu" data-arg="${x.k}" aria-haspopup="listbox" aria-expanded="${x.open}"><small>${esc(x.label)}</small>${esc(x.value)}${ic('chev', 'mdi:chevron-down')}</button>`).join('')}</div>` : ''}
        ${m.modes.length ? `<div class="modes scrollrow" role="group" aria-label="${this.t('Mode')}">${m.modes.map((x) => `<button type="button" class="mode" data-act="mode" data-arg="${x.k}" aria-pressed="${x.on}" ${m.na ? 'disabled' : ''}>${esc(x.label)}</button>`).join('')}</div>` : ''}
        ${m.menu ? `<div class="menu" role="listbox" aria-label="${esc(m.menu.title)}" style="${m.menu.top ? 'top:52px' : 'bottom:' + (m.modes.length ? 62 : 14) + 'px'}"><span class="t">${esc(m.menu.title)}</span>${m.menu.opts.map((o) => `<button type="button" class="opt" role="option" data-act="pick" data-arg="${esc(o.value)}" aria-selected="${o.on}"><span>${esc(o.label)}</span>${o.on ? ic('check', 'mdi:check') : ''}</button>`).join('')}</div>` : ''}
      </ha-card>`;
    }

    // one strip for the everyday column: setpoint, a short sentence, −/+
    _compact(m, ic, plus, minus) {
      const big = m.big.length > 4 ? 34 : 48;
      const step = (k, d, label) => `<button type="button" class="step" data-act="step" data-arg="${k}:${d}" aria-label="${esc(label)}"><ha-icon icon="${d > 0 ? plus : minus}"></ha-icon></button>`;
      const fan = m.steps === 'fan';
      return `<ha-card class="compact ${m.na ? 'na' : ''}" style="background:${m.bg}">
        <div class="top">
          <button type="button" class="room" data-act="more">${esc(m.name)}${ic('chevron-right', 'mdi:chevron-right')}</button>
          ${m.tag ? `<span class="tag">${esc(m.tag)}</span>` : ''}
        </div>
        <div class="line">
          ${m.dual ? `<span class="minis">${m.rows.map((r) => { const l = this.t(r.k === 'target_temp_low' ? 'Heat' : 'Cool'); return `<span class="mini" style="opacity:${r.dim ? 0.5 : 1}"><span class="lbl">${l}</span><span class="big">${esc(r.value)}</span>${step(r.k, -1, 'Lower the ' + l.toLowerCase() + ' point')}${step(r.k, 1, 'Raise the ' + l.toLowerCase() + ' point')}</span>`; }).join('')}</span>`
            : `<span class="lead"><span class="lbl">${esc(m.label)}</span><span class="big" style="font-size:${big}px">${esc(m.big)}</span></span>`}
          <span class="short">${esc(m.short)}</span>
          ${m.steps && !m.dual ? `<span class="steps">${step(m.steps, -1, this.t(fan ? 'Slower' : 'Lower'))}${step(m.steps, 1, this.t(fan ? 'Faster' : 'Raise'))}</span>` : ''}
          ${m.canOn ? `<button type="button" class="on" data-act="on">${ic('power', 'mdi:power')}<span class="bl">${this.t('Turn on')}</span></button>` : ''}
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


