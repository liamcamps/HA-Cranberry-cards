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
      .ic.pic { overflow: hidden; background: var(--cc-q-t); }
      .ic.pic img { width: 100%; height: 100%; object-fit: cover; display: block; transition: filter .3s ease, opacity .3s ease; }
      .ic.pic.away img { filter: grayscale(.7); opacity: .7; }
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
      } else if (domain === 'person' && !(c.people && c.people.length)) {
        // one person: home, away or the zone they are in, and since when
        const home = st.state === 'home';
        m.icon = m.icon || ccIcon('user', 'mdi:account-outline');
        m.name = c.name || firstName(this.nm(c.entity));
        m.tone = home ? 'olive' : 'quail';
        const where = home ? 'Home' : st.state === 'not_home' ? 'Away' : st.state === 'unknown' ? 'Unknown' : String(st.state).replace(/_/g, ' ').replace(/^./, (ch) => ch.toUpperCase());
        const t = new Date(st.last_changed || 0), now = new Date();
        let since = '';
        if (!isNaN(t) && t.getTime() > 0 && st.state !== 'unknown') {
          const days = Math.round((new Date(now).setHours(0, 0, 0, 0) - new Date(t).setHours(0, 0, 0, 0)) / 86400000);
          const tf = this._hass.locale && this._hass.locale.time_format;
          if (days === 0) since = new Intl.DateTimeFormat(this._lang(), { hour: '2-digit', minute: '2-digit', hour12: tf === '12' ? true : tf === '24' ? false : undefined }).format(t);
          else if (days === 1) since = 'yesterday';
          else if (days < 7) since = new Intl.DateTimeFormat(this._lang(), { weekday: 'long' }).format(t);
        }
        m.state = where + (since ? ' · since ' + since : '');
        // the person's own photo, unless the card asks for the icon
        if (c.show_picture !== 'icon' && st.attributes.entity_picture) { m.picture = st.attributes.entity_picture; m.away = !home; }
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
          ${m.picture ? `<div class="ic pic${m.away ? ' away' : ''}"><img src="${esc(m.picture)}" alt=""></div>` : `<div class="ic" style="${icStyle}"><ha-icon icon="${esc(m.icon)}"></ha-icon></div>`}
          <div class="txt tap" role="button" tabindex="0" data-act="more"><span class="name">${esc(m.name)}</span><span class="state">${esc(m.state)}</span></div>
          ${m.btns.length ? `<div class="btns" style="--btns-w:${m.btnsW || 'auto'}">${m.btns.map((b) => `<button type="button" data-act="${b.act}" data-arg="${esc(b.arg || '')}" aria-label="${esc(b.aria || b.label)}" aria-pressed="${b.pressed ? 'true' : 'false'}">${b.icon ? `<ha-icon icon="${b.icon}"></ha-icon>` : ''}${b.label ? esc(b.label) : ''}</button>`).join('')}</div>` : ''}
        </div></ha-card>`;
    }
    act(a, arg) {
      const c = this._config, st = this.st(c.entity);
      if (a === 'more' || !st) return c.popup ? this.navigate(c.popup) : this.moreInfo(c.entity);
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

