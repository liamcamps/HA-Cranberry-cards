  class CranberryWasteCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { display: flex; flex-direction: column; gap: 0; padding: 10px; }
      ha-card.large { gap: 10px; padding: 10px 10px 12px; }
      ha-card.urgent { background: var(--cc-c); color: var(--cc-on); }
      ha-card.urgent .item .d { color: color-mix(in srgb, var(--cc-on) 82%, var(--cc-c)); }
      ha-card.urgent .item.soon .d { color: var(--cc-on); }
      ha-card.urgent .item { border-top-color: ${alpha('--cc-on', 14)}; }
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

