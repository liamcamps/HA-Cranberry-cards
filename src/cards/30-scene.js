  // ---------------------------------------------------------------- scene
  // A scene button: tap to run the scene (or script). It doesn't try to show which scene is on;
  // Home Assistant doesn't know that, so the button only answers the tap.
  // cranberry for a moment after a tap, so you see it went through
  const flash = (el) => {
    if (!el) return;
    el.classList.add('ran');
    clearTimeout(el._ran);
    el._ran = setTimeout(() => el.classList.remove('ran'), 900);
  };
  class CranberrySceneCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { border-radius: var(--cc-r-card, 24px); transition: background .2s ease, color .2s ease; }
      /* a short answer to the tap */
      ha-card.ran, ha-card:has(.btn:active) { background: var(--cv-fill-c); color: var(--cc-on); }
      .btn { width: 100%; height: 100%; min-height: 96px; box-sizing: border-box; padding: 12px 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
      /* the icon on its own, no box behind it */
      .ic { width: 28px; height: 28px; color: var(--cc-muted); }
      .ic ha-icon { --mdc-icon-size: 22px; }
      .name { font-size: 13px; font-weight: 700; max-width: 100%; }
      ha-card.ran .ic, ha-card.ran .name { color: var(--cc-on); }
      ha-card.na .ic { background: none !important; }
    `;
    }
    getGridOptions() { return { columns: 3, rows: 2, min_columns: 2 }; }
    model() {
      const c = this._config, st = this.st(c.entity);
      return { name: c.name || (st ? this.nm(c.entity) : c.entity), icon: c.icon || (st && st.attributes.icon) || ccIcon('evening', 'mdi:palette-outline'), na: this.isNa(st) };
    }
    view(m) {
      return `<ha-card class="${m.na ? 'na' : ''}"><button type="button" class="btn" data-act="run" aria-label="${esc(m.name)}">
        <span class="ic"><ha-icon icon="${esc(m.icon)}"></ha-icon></span>
        <span class="name">${esc(m.name)}</span></button></ha-card>`;
    }
    act() {
      const id = this._config.entity, d = id.split('.')[0];
      this.call(d === 'script' ? 'script' : 'scene', 'turn_on', { entity_id: id });
      flash(this.shadowRoot.querySelector('ha-card'));
    }
  }
  CranberrySceneCard.defaults = {};


  // ---------------------------------------------------------------- scene pills
  // Several scenes as one row of pills, for a phone. The row scrolls sideways when the pills
  // don't fit.
  class CranberryScenesCard extends CranberryBase {
    static get needsEntity() { return false; }
    static get styles() {
      return `
      ha-card { background: none; overflow: visible; }
      .row { display: flex; gap: 8px; }
      .pill { height: 44px; padding: 0 16px 0 12px; border-radius: 22px; background: var(--cc-card); color: var(--cc-text); display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; transition: background .25s ease, color .25s ease; }
      .pill ha-icon { --mdc-icon-size: 18px; display: flex; }
      .pill ha-icon { color: var(--cc-muted); }
      .pill.ran, .pill:active { background: var(--cv-fill-c); color: var(--cc-on); }
      .pill.ran ha-icon, .pill:active ha-icon { color: var(--cc-on); }
      .pill.na { opacity: .6; }
    `;
    }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    setConfig(config) {
      if (!config || !Array.isArray(config.scenes) || !config.scenes.length) throw new Error('Add one or more scenes');
      super.setConfig(config);
    }
    model() {
      const list = this._config.scenes.map((x) => (typeof x === 'string' ? { entity: x } : x)).filter((x) => x && x.entity);
      return { pills: list.map((x) => {
        const st = this.st(x.entity), name = x.name || (st ? this.nm(x.entity) : x.entity);
        return { id: x.entity, name, icon: x.icon || (st && st.attributes.icon) || ccIcon('evening', 'mdi:palette-outline'), na: this.isNa(st) };
      }) };
    }
    view(m) {
      return `<ha-card><div class="row scrollrow" role="group" aria-label="${esc(this.t('Scenes'))}">${m.pills.map((p) => `<button type="button" class="pill${p.na ? ' na' : ''}" data-act="run" data-arg="${esc(p.id)}"><ha-icon icon="${esc(p.icon)}"></ha-icon>${esc(p.name)}</button>`).join('')}</div></ha-card>`;
    }
    act(a, id) {
      if (a !== 'run' || !id) return;
      this.call(id.split('.')[0] === 'script' ? 'script' : 'scene', 'turn_on', { entity_id: id });
      flash([...this.shadowRoot.querySelectorAll('.pill')].find((b) => b.getAttribute('data-arg') === id));
    }
  }
  CranberryScenesCard.defaults = {};
