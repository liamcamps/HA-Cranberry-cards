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
      .extra[aria-pressed="true"] { background: var(--cv-fill-o); color: var(--cc-on); }
      .extra ha-icon { --mdc-icon-size: 20px; }
      /* something in the room needs you: the whole card turns brick */
      ha-card.alert { background: var(--cc-b); color: var(--cc-on); }
      ha-card.alert .fill { display: none; }
      ha-card.alert .state { color: color-mix(in srgb, var(--cc-on) 82%, var(--cc-b)); font-weight: 600; }
      ha-card.alert .tog { background: ${alpha('--cc-on', 16)} !important; color: var(--cc-on) !important; }
      ha-card.alert .temp { background: ${alpha('--cc-on', 16)}; }
      /* a narrow card (two side by side on a phone) keeps room for the name */
      ha-card { container-type: inline-size; }
      .tin { display: none; }
      @container (max-width: 300px) {
        .temp { display: none; }
        .tin { display: inline; }
        .row { gap: 10px; }
      }
      /* as narrow as on a phone: the extra button gives its room to the name (it is in the pop-up too) */
      @container (max-width: 230px) {
        .extra { display: none; }
        /* the temperature says more than the brightness */
        .state:has(.tin) .lvl { display: none; }
      }
      ha-card.alert .chev { color: var(--cc-on); }
      ha-card.alert .extra { background: ${alpha('--cc-on', 16)}; color: var(--cc-on); }
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
      if (this.isNa(st)) state = this.t('Not responding');
      else if (on.length) state = members.length > 1 ? this.t('{n} of {total} on', { n: on.length, total: members.length }) : this.t('On');
      else state = this.t(members.length > 1 ? 'All off' : 'Off');
      if (offline && st) state += ' · ' + this.t('{n} offline', { n: offline });
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
      }
      // doors, windows and locks that make the room need you
      const PROBLEM = ['on', 'open', 'opening', 'unlocked', 'unlocking', 'jammed', 'triggered', 'problem'];
      const bad = [].concat(c.alerts || []).map((id) => this.st(id)).filter((s) => s && PROBLEM.indexOf(s.state) >= 0);
      let alert = false;
      if (bad.length) {
        alert = true;
        const word = (x) => (x.entity_id.indexOf('binary_sensor.') === 0 && x.state === 'on' ? this.t('open') : this._hass.formatEntityState ? String(this.fmt(x)) : x.state).toLowerCase();
        state = bad.length === 1 ? this.t('{name} {state}', { name: this.nm(bad[0].entity_id), state: word(bad[0]) }) : this.t('{n} things open', { n: bad.length });
      }
      return { alert, extra, name: c.name || (st ? this.nm(c.entity) : c.entity), icon: c.icon || (st && st.attributes.icon) || ccIcon('home', 'mdi:home-outline'), state, level: (!this.isNa(st) && (on.length || (extra && extra.on)) && dims && lit && !alert ? avg + '%' : ''), lit, fill: lit ? (dims ? avg : 100) : 0, temp, na: this.isNa(st), open: c.popup || c.navigation_path || '' };
    }
    view(m) {
      return `<ha-card class="${m.na ? 'na' : ''} ${m.alert ? 'alert' : ''}">
        <span class="fill" style="width:${m.fill}%"></span>
        <div class="row">
          <button type="button" class="tog" data-act="toggle" aria-pressed="${m.lit}" aria-label="${esc(this.t(m.lit ? 'Switch {name} off' : 'Switch {name} on', { name: m.name }))}"
            style="background:${m.lit ? 'var(--cc-c)' : 'var(--cc-q-t)'};color:${m.lit ? 'var(--cc-on)' : 'var(--cc-q)'}"><ha-icon icon="${esc(m.icon)}"></ha-icon></button>
          <button type="button" class="open" data-act="open" aria-label="${esc(this.t('Open {name}', { name: m.name }))}">
            <span class="txt"><span class="name">${esc(m.name)}</span><span class="state">${esc(m.state)}${m.level ? `<span class="lvl"> · ${esc(m.level)}</span>` : ''}${m.temp ? `<span class="tin"> · ${esc(m.temp)}</span>` : ''}</span></span>
            ${m.temp ? `<span class="temp"><ha-icon icon="${ccIcon('thermometer', 'mdi:thermometer')}"></ha-icon>${esc(m.temp)}</span>` : ''}
            ${m.open ? `<ha-icon class="chev" icon="${ccIcon('chevron-right', 'mdi:chevron-right')}"></ha-icon>` : ''}
          </button>
          ${m.extra ? `<button type="button" class="extra" data-act="extra" aria-pressed="${m.extra.on}" aria-label="${esc(this.t(m.extra.on ? '{name} on' : '{name} off', { name: m.extra.name }))}" ${m.extra.na ? 'disabled' : ''}><ha-icon icon="${esc(m.extra.icon)}"></ha-icon></button>` : ''}
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

