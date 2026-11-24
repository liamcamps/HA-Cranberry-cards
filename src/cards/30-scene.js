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
    isActive() {
      const c = this._config, h = this._hass, st = this.st(c.entity);
      if (c.active_entity) {
        const a = this.st(c.active_entity);
        if (a) return a.state === (c.active_state != null ? String(c.active_state) : 'on') || a.state === this.nm(c.entity) || a.state === c.entity;
      }
      const mine = activatedAt(st);
      if (!mine) return false;
      const pool = c.compare && c.compare.length ? c.compare : Object.keys(h.states).filter((id) => id.indexOf('scene.') === 0);
      if (pool.some((id) => id !== c.entity && activatedAt(h.states[id]) > mine)) return false;
      const members = (st.attributes && st.attributes.entity_id) || [];
      return !members.some((id) => {
        const s = h.states[id];
        return s && Date.parse(s.last_changed) > mine + SETTLE_MS;
      });
    }
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

