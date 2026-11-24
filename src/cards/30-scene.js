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
  // whether a scene is the one picked last: c holds compare, active_entity and active_state
  const sceneActive = (h, c, id, nm) => {
    const st = h.states[id];
    if (c.active_entity) {
      const a = h.states[c.active_entity];
      if (a) return a.state === (c.active_state != null ? String(c.active_state) : 'on') || a.state === nm || a.state === id;
    }
    const mine = activatedAt(st);
    if (!mine) return false;
    const pool = c.compare && c.compare.length ? c.compare : Object.keys(h.states).filter((x) => x.indexOf('scene.') === 0);
    if (pool.some((x) => x !== id && activatedAt(h.states[x]) > mine)) return false;
    const members = (st.attributes && st.attributes.entity_id) || [];
    return !members.some((x) => {
      const s = h.states[x];
      return s && Date.parse(s.last_changed) > mine + SETTLE_MS;
    });
  };
  class CranberrySceneCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { border-radius: var(--cc-r-card, 24px); transition: background .25s ease, color .25s ease; }
      ha-card.active { background: var(--cv-fill-c); color: var(--cc-on); }
      .btn { width: 100%; height: 100%; min-height: 96px; box-sizing: border-box; padding: 12px 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
      /* the icon on its own, no box behind it; muted until the scene is picked */
      .ic { width: 28px; height: 28px; color: var(--cc-muted); }
      .ic ha-icon { --mdc-icon-size: 22px; }
      .name { font-size: 13px; font-weight: 700; max-width: 100%; color: var(--cc-muted); }
      ha-card.active .ic, ha-card.active .name { color: var(--cc-on); }
      ha-card.na .ic { background: none !important; }
    `;
    }
    getGridOptions() { return { columns: 3, rows: 2, min_columns: 2 }; }
    connectedCallback() { this._tick = setInterval(() => this._update(), 10000); }
    disconnectedCallback() { clearInterval(this._tick); }
    isActive() { return sceneActive(this._hass, this._config, this._config.entity, this.nm(this._config.entity)); }
    model() {
      const c = this._config, st = this.st(c.entity);
      return { name: c.name || (st ? this.nm(c.entity) : c.entity), icon: c.icon || (st && st.attributes.icon) || ccIcon('evening', 'mdi:palette-outline'), active: !!st && this.isActive(), na: this.isNa(st) };
    }
    view(m) {
      return `<ha-card class="${m.na ? 'na' : ''} ${m.active ? 'active' : ''}"><button type="button" class="btn" data-act="run" aria-pressed="${m.active}" aria-label="${esc(m.name)}${m.active ? ', active' : ''}">
        <span class="ic"><ha-icon icon="${esc(m.icon)}"></ha-icon></span>
        <span class="name">${esc(m.name)}</span></button></ha-card>`;
    }
    act() {
      const id = this._config.entity, d = id.split('.')[0];
      this.call(d === 'script' ? 'script' : 'scene', 'turn_on', { entity_id: id });
    }
  }
  CranberrySceneCard.defaults = {};


  // ---------------------------------------------------------------- scene pills
  // Several scenes as one row of pills, for a phone: the picked one in cranberry. The row
  // scrolls sideways when the pills don't fit.
  class CranberryScenesCard extends CranberryBase {
    static get needsEntity() { return false; }
    static get styles() {
      return `
      ha-card { background: none; overflow: visible; }
      .row { display: flex; gap: 8px; }
      .pill { height: 44px; padding: 0 16px 0 12px; border-radius: 22px; background: var(--cc-card); color: var(--cc-muted); display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; transition: background .25s ease, color .25s ease; }
      .pill ha-icon { --mdc-icon-size: 18px; display: flex; }
      .pill[aria-pressed="true"] { background: var(--cv-fill-c); color: var(--cc-on); }
      .pill.na { opacity: .6; }
    `;
    }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    connectedCallback() { this._tick = setInterval(() => this._update(), 10000); }
    disconnectedCallback() { clearInterval(this._tick); }
    setConfig(config) {
      if (!config || !Array.isArray(config.scenes) || !config.scenes.length) throw new Error('Add one or more scenes');
      super.setConfig(config);
    }
    model() {
      const h = this._hass, c = this._config;
      const list = c.scenes.map((x) => (typeof x === 'string' ? { entity: x } : x)).filter((x) => x && x.entity);
      // the scenes on this row are compared with each other, unless compare says otherwise
      const cmp = Object.assign({}, c, { compare: c.compare && c.compare.length ? c.compare : list.map((x) => x.entity) });
      return { pills: list.map((x) => {
        const st = this.st(x.entity), name = x.name || (st ? this.nm(x.entity) : x.entity);
        return { id: x.entity, name, icon: x.icon || (st && st.attributes.icon) || ccIcon('evening', 'mdi:palette-outline'), on: !!st && sceneActive(h, Object.assign({}, cmp, x), x.entity, name), na: this.isNa(st) };
      }) };
    }
    view(m) {
      return `<ha-card><div class="row scrollrow" role="group" aria-label="${esc(this.t('Scenes'))}">${m.pills.map((p) => `<button type="button" class="pill${p.na ? ' na' : ''}" data-act="run" data-arg="${esc(p.id)}" aria-pressed="${p.on}"><ha-icon icon="${esc(p.icon)}"></ha-icon>${esc(p.name)}</button>`).join('')}</div></ha-card>`;
    }
    act(a, id) {
      if (a !== 'run' || !id) return;
      this.call(id.split('.')[0] === 'script' ? 'script' : 'scene', 'turn_on', { entity_id: id });
    }
  }
  CranberryScenesCard.defaults = {};
