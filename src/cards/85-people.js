  // ---------------------------------------------------------------- people
  // A title row with a chip per person: photo, name and where they are. Tap opens their pop-up.
  class CranberryPeopleCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { background: none; box-shadow: none; border: 0; padding: 4px 0; }
      .row { display: flex; align-items: center; gap: 8px 12px; min-height: 56px; }
      .title { font-size: 28px; font-weight: 500; letter-spacing: -0.01em; margin-right: auto; padding-left: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; margin-left: auto; }
      /* home: just the photo; away: the photo and where, in a pill */
      .chip { height: 48px; box-sizing: border-box; padding: 4px; border-radius: 24px; background: var(--cc-card); display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; white-space: nowrap; }
      .chip.away { padding-right: 16px; }
      .pic { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--cc-q-t); color: var(--cc-text); font-size: 16px; font-weight: 700; }
      .pic img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .chip span.where { color: var(--cc-muted); font-weight: 600; }
    `;
    }
    getGridOptions() { return { columns: 'full', rows: 'auto' }; }
    _people() {
      return [].concat(this._config.people || []).map((x) => (typeof x === 'string' ? { entity: x } : x)).filter((x) => x && x.entity);
    }
    model() {
      const c = this._config;
      const people = this._people().map((p) => {
        const st = this.st(p.entity), home = !!st && st.state === 'home';
        const na = this.isNa(st);
        const where = na ? this.t('Not responding') : home ? this.t('Home') : st.state === 'not_home' ? this.t('Away') : st.state === 'unknown' ? this.t('Unknown') : String(st.state).replace(/_/g, ' ').replace(/^./, (ch) => ch.toUpperCase());
        return {
          id: p.entity, popup: p.popup || '', home, na,
          name: p.name || firstName(this.nm(p.entity)), where,
          picture: c.show_picture !== 'icon' && st && st.attributes.entity_picture ? st.attributes.entity_picture : '',
          icon: p.icon || ''
        };
      });
      return { title: c.title == null ? '' : c.title, people };
    }
    view(m) {
      // without a photo: their icon if one is set, else their initial
      const face = (p) => p.picture ? `<img src="${esc(p.picture)}" alt="">` : p.icon ? `<ha-icon icon="${esc(p.icon)}"></ha-icon>` : esc(p.name.charAt(0).toUpperCase());
      const chip = (p) => `<button type="button" class="chip${p.home ? '' : ' away'}${p.na ? ' na' : ''}" data-act="open" data-arg="${esc(p.id)}" aria-label="${esc(p.name + ', ' + p.where)}" title="${esc(p.name + ' · ' + p.where)}">
          <span class="pic">${face(p)}</span>${p.home ? '' : `<span class="where">${esc(p.where)}</span>`}</button>`;
      return `<ha-card><div class="row">${m.title ? `<div class="title">${esc(m.title)}</div>` : ''}<div class="chips">${m.people.map(chip).join('')}</div></div></ha-card>`;
    }
    act(a, arg) {
      if (a !== 'open') return;
      const p = this._people().find((x) => x.entity === arg);
      if (p && p.popup) this.navigate(p.popup); else this.moreInfo(arg);
    }
  }
  CranberryPeopleCard.needsEntity = false;
  CranberryPeopleCard.defaults = { show_picture: 'picture' };

