  // ---------------------------------------------------------------- scene
  // A scene counts as active when the lights (and whatever else it sets) are still the way it
  // left them. When its settings can't be read (a script, a scene without an id, a user who isn't
  // an admin): when it's the most recently activated scene and nothing it sets changed since,
  // allowing a few seconds to settle.
  const SETTLE_MS = 15000;
  const activatedAt = (st) => {
    if (!st) return 0;
    const raw = st.entity_id.indexOf('script.') === 0 ? st.attributes.last_triggered : st.state;
    const t = Date.parse(raw);
    return isNaN(t) ? 0 : t;
  };
  // What a scene sets. Home Assistant doesn't say which scene is on, but for a scene made in the
  // editor (or in scenes.yaml with an id) it does give its settings to an admin, so the card can
  // look whether the lights are still the way the scene left them. Loaded once, shared by all cards.
  const TARGETS = {};            // scene entity -> { entities } | null (not available) | 'loading'
  const WAITING = new Set();     // cards to redraw once a scene's settings arrive
  const loadTargets = (h, id) => {
    if (id in TARGETS) return TARGETS[id];
    const st = h.states[id], cid = st && st.attributes && st.attributes.id;
    if (!cid || id.indexOf('scene.') !== 0 || !h.callApi) return (TARGETS[id] = null);
    TARGETS[id] = 'loading';
    h.callApi('GET', 'config/scene/config/' + encodeURIComponent(cid))
      .then((cfg) => { TARGETS[id] = cfg && cfg.entities && Object.keys(cfg.entities).length ? cfg.entities : null; })
      .catch(() => { TARGETS[id] = null; })
      .then(() => WAITING.forEach((card) => { card._last = ''; card._update(); }));
    return 'loading';
  };
  const near = (a, b, tol) => a != null && b != null && Math.abs(Number(a) - Number(b)) <= tol;
  // whether one entity is the way the scene set it
  const matchesOne = (s, want) => {
    if (want == null) return true;
    const w = typeof want === 'object' ? want : { state: want };
    if (w.state != null && String(w.state) !== s.state) return false;
    if (s.state !== 'on' || s.entity_id.indexOf('light.') !== 0) {
      if (s.entity_id.indexOf('climate.') === 0 && w.temperature != null) return near(s.attributes.temperature, w.temperature, 0.25);
      if (s.entity_id.indexOf('cover.') === 0 && w.current_position != null) return near(s.attributes.current_position, w.current_position, 3);
      return true;
    }
    const a = s.attributes;
    // a light that is on: its brightness and colour, with some room for rounding
    if (w.brightness != null && !near(a.brightness, w.brightness, 8)) return false;
    if (w.brightness_pct != null && !near(a.brightness / 2.55, w.brightness_pct, 3)) return false;
    const k = w.color_temp_kelvin != null ? w.color_temp_kelvin : (w.color_temp ? 1e6 / w.color_temp : null);
    if (k != null && a.color_mode === 'color_temp' && a.color_temp_kelvin != null && !near(a.color_temp_kelvin, k, 120)) return false;
    if (w.hs_color && a.hs_color && ['hs', 'xy', 'rgb', 'rgbw', 'rgbww'].indexOf(a.color_mode) >= 0) {
      const dh = Math.abs(a.hs_color[0] - w.hs_color[0]) % 360;
      if (Math.min(dh, 360 - dh) > 8 || !near(a.hs_color[1], w.hs_color[1], 8)) return false;
    }
    return true;
  };
  // whether every entity the scene sets is still that way; null when the settings aren't known
  const sceneMatches = (h, id) => {
    const t = TARGETS[id];
    if (!t || t === 'loading') return null;
    let seen = 0;
    for (const e of Object.keys(t)) {
      const s = h.states[e];
      if (!s || s.state === 'unavailable' || s.state === 'unknown') continue;
      seen++;
      if (!matchesOne(s, t[e])) return false;
    }
    return seen > 0;
  };
  // whether a scene is the one that's on: c holds compare, active_entity and active_state
  const sceneActive = (h, c, id, nm) => {
    const st = h.states[id];
    if (c.active_entity) {
      const a = h.states[c.active_entity];
      if (a) return a.state === (c.active_state != null ? String(c.active_state) : 'on') || a.state === nm || a.state === id;
    }
    if (c.active_when !== 'last') {
      loadTargets(h, id);
      const m = sceneMatches(h, id);
      if (m === false) return false;
      if (m === true) {
        // two scenes can both fit (all off, say): then the one picked last wins
        const mine = activatedAt(st);
        const others = (c.compare && c.compare.length ? c.compare : Object.keys(TARGETS)).filter((x) => x !== id);
        return !others.some((x) => sceneMatches(h, x) === true && activatedAt(h.states[x]) > mine);
      }
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
    connectedCallback() { WAITING.add(this); this._tick = setInterval(() => this._update(), 10000); }
    disconnectedCallback() { WAITING.delete(this); clearInterval(this._tick); }
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
    connectedCallback() { WAITING.add(this); this._tick = setInterval(() => this._update(), 10000); }
    disconnectedCallback() { WAITING.delete(this); clearInterval(this._tick); }
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
