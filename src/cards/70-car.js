  // ---------------------------------------------------------------- car
  // Where the car is parked: the place as chips, the layer and zone for a parking garage,
  // a note and a small map for anywhere else. A tap on the map starts walking directions.
  class CranberryCarCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { display: flex; flex-direction: column; gap: 12px; padding: 10px 10px 12px; }
      .head { display: flex; align-items: center; gap: 10px; min-height: 40px; }
      .head .ic { width: 40px; height: 40px; background: var(--cc-c); color: var(--cc-on); }
      .group { display: flex; flex-direction: column; gap: 6px; padding: 0 2px; }
      .label { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--cc-muted); padding-left: 2px; }
      .chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .chip { height: 36px; padding: 0 14px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-q-t); font-size: 14px; font-weight: 600; display: flex; align-items: center; }
      .chip.sq { width: 40px; padding: 0; justify-content: center; }
      .chip[aria-pressed="true"] { background: var(--cc-c); color: var(--cc-on); }
      .note { height: 40px; width: 100%; box-sizing: border-box; padding: 0 14px; border: 0; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-bgc); color: var(--cc-text); font: 500 14px Figtree, var(--ha-font-family-body, sans-serif); outline: none; }
      .note::placeholder { color: var(--cc-muted); }
      .note:focus { box-shadow: inset 0 0 0 2px var(--cc-c); }
      .mapwrap { position: relative; border-radius: var(--cc-r-ctl, 12px); overflow: hidden; background: var(--cc-bgc); }
      .map { height: 168px; pointer-events: none; --ha-card-border-radius: 0; --ha-card-border-width: 0; --ha-card-box-shadow: none; }
      .map > * { display: block; height: 100%; }
      .mapbtn { position: absolute; inset: 0; display: flex; align-items: flex-end; padding: 10px; }
      .go { height: 36px; padding: 0 12px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-c); color: var(--cc-on); display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; box-shadow: 0 2px 8px ${alpha('--cv-on-cream', 18)}; }
      .go ha-icon { --mdc-icon-size: 16px; }
      .nomap { font-size: 13px; color: var(--cc-muted); padding: 0 4px; }
    `;
    }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    _opts(id) { const st = this.st(id); return (st && Array.isArray(st.attributes.options)) ? st.attributes.options : []; }
    _val(id) { const st = this.st(id); return st && !['unknown', 'unavailable'].includes(st.state) ? st.state : ''; }
    _spot() {
      const st = this.st(this._config.spot);
      if (!st || st.state === 'unavailable') return null;
      const lat = parseFloat(st.attributes.latitude), lon = parseFloat(st.attributes.longitude);
      if (isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0)) return null;
      return { lat, lon, url: st.attributes.navigate_url || `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${lat},${lon}` };
    }
    model() {
      const c = this._config;
      const place = this._val(c.entity);
      const garage = place && place === c.layers_for;
      const other = place && place === c.note_for;
      const layer = garage ? this._val(c.layer) : '', zone = garage ? this._val(c.zone) : '';
      const note = other && c.note ? this._val(c.note) : '';
      const spot = other ? this._spot() : null;
      const where = garage ? [place, layer, zone && this.t('zone {zone}', { zone })].filter(Boolean).join(' · ') : (other ? (note || place) : place);
      return {
        title: c.name || this.t('Car'), text: where ? this.t('Parked at {where}', { where }) : this.t('Where is it parked?'),
        places: this._opts(c.entity).map((o) => ({ o, on: o === place })),
        layers: garage && c.layer ? this._opts(c.layer).map((o) => ({ o, on: o === layer })) : null,
        zones: garage && c.zone ? this._opts(c.zone).map((o) => ({ o, on: o === zone })) : null,
        note: other && c.note ? { v: note } : null,
        spot, showMap: !!(other && spot), noSpot: !!(other && c.spot && !spot), na: this.isNa(this.st(c.entity))
      };
    }
    view(m) {
      const chips = (list, act, sq) => `<div class="chips">${list.map((x) => `<button type="button" class="chip ${sq ? 'sq' : ''}" data-act="${act}" data-arg="${esc(x.o)}" aria-pressed="${x.on}">${esc(x.o)}</button>`).join('')}</div>`;
      return `<ha-card class="${m.na ? 'na' : ''}">
        <div class="head">
          <span class="ic"><ha-icon icon="${ccIcon('car', 'mdi:car-outline')}"></ha-icon></span>
          <span class="txt tap" role="button" tabindex="0" data-act="more"><span class="name">${esc(m.title)}</span><span class="state">${esc(m.text)}</span></span>
        </div>
        ${m.places.length ? chips(m.places, 'place') : ''}
        ${m.layers ? `<div class="group"><span class="label">${this.t('Layer')}</span>${chips(m.layers, 'layer')}</div>` : ''}
        ${m.zones ? `<div class="group"><span class="label">${this.t('Zone')}</span>${chips(m.zones, 'zone', true)}</div>` : ''}
        ${m.note ? `<input class="note" data-key="note" data-act="note" type="text" maxlength="100" enterkeyhint="done" placeholder="${esc(this.t('Street, landmark, level…'))}" aria-label="${esc(this.t('Where exactly'))}" value="${esc(m.note.v)}">` : ''}
        ${m.showMap ? `<div class="mapwrap" data-key="mapwrap"><div class="map" data-key="map" data-keep></div>
          <button type="button" class="mapbtn" data-act="nav" aria-label="${esc(this.t('Walking directions to the car'))}"><span class="go"><ha-icon icon="${ccIcon('nav', 'mdi:navigation-variant-outline')}"></ha-icon>${this.t('Directions')}</span></button></div>` : ''}
        ${m.noSpot ? `<div class="nomap">${this.t('No location saved for the car yet')}</div>` : ''}
      </ha-card>`;
    }
    _update() {
      super._update();
      if (!this._m) return;
      const root = this.shadowRoot;
      const inp = root.querySelector('input.note');
      if (inp && root.activeElement !== inp && this._m.note && inp.value !== this._m.note.v) inp.value = this._m.note.v;
      if (inp && !inp._wired) {
        inp._wired = true;
        inp.addEventListener('change', () => this.act('note'));
        inp.addEventListener('click', (ev) => ev.stopPropagation());
      }
      const box = root.querySelector('.map');
      if (box) this._mountMap(box);
      if (this._map) this._map.hass = this._hass;
    }
    async _mountMap(box) {
      const spot = this._config.spot;
      if (!this._map || this._mapFor !== spot) {
        if (this._mapLoading) return;
        this._mapLoading = true;
        try {
          const helpers = window.loadCardHelpers ? await window.loadCardHelpers() : null;
          if (!helpers) return;
          this._map = helpers.createCardElement({
            type: 'map', entities: [{ entity: spot, label_mode: 'icon', color: getComputedStyle(this).getPropertyValue('--cv-fill-c').trim() || 'var(--cc-c)' }],
            default_zoom: 16, theme_mode: 'auto', map_style: 'muted'
          });
          this._mapFor = spot;
          this._map.hass = this._hass;
        } finally { this._mapLoading = false; }
      }
      const cur = this.shadowRoot.querySelector('.map');
      if (cur && this._map.parentNode !== cur) { cur.textContent = ''; cur.appendChild(this._map); this._quietMap(0); }
    }
    // the map is only a preview here: no zoom or fit buttons, no attribution clutter
    _quietMap(n) {
      const css = '.leaflet-control-container, ha-icon-button { display: none !important; } ha-card { height: 100% !important; border-radius: 0 !important; } #root, ha-map { height: 100% !important; padding: 0 !important; }';
      const add = (root) => { if (root && !root.querySelector('style[data-cc]')) { const s = document.createElement('style'); s.setAttribute('data-cc', ''); s.textContent = css; root.appendChild(s); return true; } return !!root; };
      const card = this._map && this._map.shadowRoot;
      const map = card && card.querySelector('ha-map');
      const done = add(card) && add(map && map.shadowRoot);
      if (!done && n < 20) setTimeout(() => this._quietMap(n + 1), 150);
    }
    act(a, arg) {
      const c = this._config;
      if (a === 'place') return this.call('input_select', 'select_option', { entity_id: c.entity, option: arg });
      if (a === 'layer') return this.call('input_select', 'select_option', { entity_id: c.layer, option: arg });
      if (a === 'zone') return this.call('input_select', 'select_option', { entity_id: c.zone, option: arg });
      if (a === 'note') {
        const inp = this.shadowRoot.querySelector('input.note');
        if (!inp || !c.note) return;
        const v = inp.value.trim().slice(0, 100);
        if (v !== this._val(c.note)) this.call('input_text', 'set_value', { entity_id: c.note, value: v });
        if (a === 'note' && document.activeElement) inp.blur();
        return;
      }
      if (a === 'nav') { const s = this._spot(); if (s) window.open(s.url, '_blank', 'noopener'); return; }
      this.moreInfo(c.entity);
    }
  }
  CranberryCarCard.defaults = { layers_for: 'Garage', note_for: 'Elsewhere' };

