  // ---------------------------------------------------------------- music
  const MP = { PAUSE: 1, PREV: 16, NEXT: 32, STOP: 4096, PLAY: 16384 };
  class CranberryMediaCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { border-radius: var(--cc-r-card, 24px); }
      ha-card.playing { background: var(--cv-fill-o); color: var(--cc-on); }
      ha-card.playing .state { color: color-mix(in srgb, var(--cc-on) 80%, var(--cc-o)); }
      .row { display: flex; align-items: center; gap: 10px; padding: 10px 10px 10px 12px; min-height: 64px; box-sizing: border-box; }
      .art { width: 44px; height: 44px; flex-shrink: 0; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-text) center / cover no-repeat; display: flex; align-items: center; justify-content: center; }
      .art span { width: 16px; height: 16px; border-radius: var(--cc-r-chip, 8px); background: var(--cc-c); }
      .name { font-size: 15px; font-weight: 700; }
      .ctl { width: 40px; height: 40px; border-radius: var(--cc-r-ctl, 12px); display: flex; align-items: center; justify-content: center; background: var(--cc-q-t); flex-shrink: 0; }
      ha-card.playing .ctl { background: ${alpha('--cc-on', 14)}; }
      .ctl.main { width: 44px; height: 44px; border-radius: var(--cc-r-ctl, 12px); background: var(--cv-fill-o); color: var(--cc-on); }
      ha-card.playing .ctl.main { background: var(--cc-on); color: var(--cc-o); }
      .ctl ha-icon { --mdc-icon-size: 20px; }
      .tap { cursor: pointer; }
    `;
    }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    model() {
      const c = this._config, st = this.st(c.entity);
      const room = c.name || (st ? this.nm(c.entity) : c.entity);
      if (!st || ['off', 'unavailable', 'unknown', 'standby'].indexOf(st.state) >= 0 || (!st.attributes.media_title && st.state === 'idle')) {
        return { title: room, sub: this.t(this.isNa(st) ? 'Not responding' : 'Nothing playing'), na: this.isNa(st), playing: false, art: '', ctl: [] };
      }
      const a = st.attributes, sf = a.supported_features || 0;
      const playing = st.state === 'playing';
      const art = c.show_artwork === false ? '' : (a.entity_picture_local || a.entity_picture || '');
      const sub = [a.media_artist || a.media_album_artist || a.app_name || a.media_channel, room].filter(Boolean).join(' · ');
      const ctl = [];
      if (sf & MP.PREV) ctl.push({ act: 'media_previous_track', icon: ccIcon('skip-previous', 'mdi:skip-previous'), aria: this.t('Previous track') });
      if (playing) ctl.push({ act: (sf & MP.PAUSE) ? 'media_pause' : 'media_stop', icon: (sf & MP.PAUSE) ? ccIcon('pause', 'mdi:pause') : ccIcon('stop', 'mdi:stop'), aria: this.t((sf & MP.PAUSE) ? 'Pause' : 'Stop'), main: true });
      else ctl.push({ act: 'media_play', icon: ccIcon('play', 'mdi:play'), aria: this.t('Play'), main: true });
      if (sf & MP.NEXT) ctl.push({ act: 'media_next_track', icon: ccIcon('skip-next', 'mdi:skip-next'), aria: this.t('Next track') });
      return { title: a.media_title || this.fmt(st), sub, playing, art, ctl, na: false };
    }
    view(m) {
      return `<ha-card class="${m.playing ? 'playing' : ''} ${m.na ? 'na' : ''}"><div class="row">
        <div class="art" style="${m.art ? `background-image:url('${esc(m.art)}')` : ''}">${m.art ? '' : '<span></span>'}</div>
        <div class="txt tap" role="button" tabindex="0" data-act="more"><span class="name">${esc(m.title)}</span><span class="state">${esc(m.sub)}</span></div>
        ${m.ctl.map((b) => `<button type="button" class="ctl ${b.main ? 'main' : ''}" data-act="${b.act}" aria-label="${b.aria}"><ha-icon icon="${b.icon}"></ha-icon></button>`).join('')}
      </div></ha-card>`;
    }
    act(a) {
      if (a === 'more') return this._config.popup ? this.navigate(this._config.popup) : this.moreInfo(this._config.entity);
      this.call('media_player', a, { entity_id: this._config.entity });
    }
  }
  CranberryMediaCard.defaults = {};


