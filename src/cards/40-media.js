  // ---------------------------------------------------------------- music
  // Two sizes. Row: what's playing with previous, play/pause and next, for the dashboard.
  // Full: for a pop-up. The cover large, what's playing, where it is in the song, the controls,
  // the volume, the receiver's source and sound mode, and your favourite playlists and radio stations.
  // While it plays the card takes a deep tone from the cover (olive when there is none, or with
  // cover_colour: false). Every icon is Lucide's shape, built in.
  const MP = { PAUSE: 1, SEEK: 2, VOLUME_SET: 4, VOLUME_MUTE: 8, PREV: 16, NEXT: 32, TURN_ON: 128, TURN_OFF: 256, PLAY_MEDIA: 512, SELECT_SOURCE: 2048, STOP: 4096, PLAY: 16384, SHUFFLE: 32768, SOUND_MODE: 65536, REPEAT: 262144 };
  const MI = {
    play: 'M5 5a2 2 0 0 1 3-1.73l12 7a2 2 0 0 1 0 3.46l-12 7A2 2 0 0 1 5 19z',
    pause: 'M7 4h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM15 4h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z',
    stop: 'M6 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
    prev: 'M17.97 4.29A2 2 0 0 1 21 6v12a2 2 0 0 1-3.03 1.71l-10-6a2 2 0 0 1 0-3.43zM3 20V4',
    next: 'M21 4v16M6.03 4.29A2 2 0 0 0 3 6v12a2 2 0 0 0 3.03 1.71l10-6a2 2 0 0 0 0-3.43z',
    shuffle: 'm18 14 4 4-4 4M18 2l4 4-4 4M2 18h1.97a4 4 0 0 0 3.3-1.7l5.45-8.6a4 4 0 0 1 3.3-1.7H22M2 6h1.97a4 4 0 0 1 3.6 2.2M22 18h-6.04a4 4 0 0 1-3.3-1.8l-.36-.45',
    repeat: 'm17 2 4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3',
    repeat1: 'm17 2 4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3M11 10h1v4',
    volume: 'M11 4.7a.7.7 0 0 0-1.2-.5L6.41 7.59A1.4 1.4 0 0 1 5.42 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.42a1.4 1.4 0 0 1 1 .41l3.38 3.39a.7.7 0 0 0 1.2-.5zM16 9a5 5 0 0 1 0 6M19.36 18.36a9 9 0 0 0 0-12.72',
    mute: 'M11 4.7a.7.7 0 0 0-1.2-.5L6.41 7.59A1.4 1.4 0 0 1 5.42 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.42a1.4 1.4 0 0 1 1 .41l3.38 3.39a.7.7 0 0 0 1.2-.5zM22 9l-6 6M16 9l6 6',
    power: 'M12 2v10M18.4 6.6a9 9 0 1 1-12.77.04',
    speaker: 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 6h.01M16 14a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14h.01',
    sound: 'M2 10v3M6 6v11M10 3v18M14 8v7M18 5v13M22 10v3',
    radio: 'M16.25 7.76a6 6 0 0 1 0 8.48M19.08 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14M7.75 16.24a6 6 0 0 1 0-8.48M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
    list: 'M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM12 12H3M16 6H3M12 18H3',
    chev: 'm6 9 6 6 6-6',
    tv: 'M4 7h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM17 2l-5 5-5-5',
    music: 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    check: 'M20 6 9 17l-5-5'
  };
  const mIcon = (d, size, filled) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="${filled ? 0 : 1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"></path></svg>`;
  // tiles without a picture: the cards' fills, in turn
  // not olive: the card itself turns olive while it plays
  // A deep tone from a cover: the average hue of its coloured pixels, kept dark enough for cream
  // text (at least 4.5:1, mostly far more) and not too loud. Worked out once per picture.
  const TONES = new Map();
  const toneOf = (data) => {
    // twelve hue buckets; the one covering the most of the picture wins, darker and more
    // colourful pixels counting a little more, since the tone ends up deep
    const bins = Array.from({ length: 12 }, () => ({ w: 0, x: 0, y: 0, s: 0 }));
    let n = 0, coloured = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue;
      n++;
      const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), c = mx - mn;
      if (c < 0.1) continue;                        // greys and near-whites say nothing about the hue
      coloured++;
      let h = mx === r ? ((g - b) / c) % 6 : mx === g ? (b - r) / c + 2 : (r - g) / c + 4;
      h = (h * 60 + 360) % 360;
      const l = (mx + mn) / 2, s = c / (1 - Math.abs(2 * l - 1) || 1);
      const w = (0.3 + c) * (1.2 - l), bin = bins[Math.floor(h / 30) % 12], rad = h * Math.PI / 180;
      bin.w += w; bin.x += Math.cos(rad) * w; bin.y += Math.sin(rad) * w; bin.s += s * w;
    }
    let h = 20, s = 0.12;                           // little colour in it: a warm grey, like the theme
    if (n && coloured / n >= 0.2) {
      const best = bins.reduce((a, b) => (b.w > a.w ? b : a));
      h = (Math.atan2(best.y, best.x) * 180 / Math.PI + 360) % 360;
      s = Math.min(0.55, best.s / best.w);
    }
    const l = 0.22;
    const f = (k0) => { const k = (k0 + h / 30) % 12, a = s * Math.min(l, 1 - l); return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
    return '#' + [f(0), f(8), f(4)].map((v) => v.toString(16).padStart(2, '0')).join('');
  };
  // no cover, or one it can't read: night blue, the deep tone a blue cover gets
  const NIGHT_BLUE = '#192f57';
  const coverTone = (url, done) => {
    if (!url) return null;
    if (TONES.has(url)) return TONES.get(url);
    TONES.set(url, null);
    if (typeof Image === 'undefined') return null;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const cv = document.createElement('canvas'); cv.width = cv.height = 24;
        const g = cv.getContext('2d'); g.drawImage(img, 0, 0, 24, 24);
        TONES.set(url, toneOf(g.getImageData(0, 0, 24, 24).data));
        done();
      } catch (e) { TONES.set(url, null); }     // a picture from another site without CORS: stay olive
    };
    img.src = url;
    return null;
  };
  const FAV_FILLS = ['var(--cv-fill-ochre)', 'var(--cv-fill-h)', 'var(--cv-fill-c)', 'var(--cv-fill-q)'];
  const OFF_STATES = ['off', 'unavailable', 'unknown', 'standby'];
  const mmss = (s) => { s = Math.max(0, Math.round(s || 0)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };

  class CranberryMediaCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { border-radius: var(--cc-r-card, 24px); }
      ha-card.playing { background: var(--cv-fill-o); color: var(--cc-on); transition: background .5s ease; }
      ha-card.playing .state { color: color-mix(in srgb, var(--cc-on) 80%, var(--cc-o)); }
      .row { display: flex; align-items: center; gap: 10px; padding: 10px 10px 10px 12px; min-height: 64px; box-sizing: border-box; }
      .art { width: 44px; height: 44px; flex-shrink: 0; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-text) center / cover no-repeat; display: flex; align-items: center; justify-content: center; color: var(--cc-card); }
      .name { font-size: 15px; font-weight: 700; }
      .ctl { width: 40px; height: 40px; border-radius: var(--cc-r-ctl, 12px); display: flex; align-items: center; justify-content: center; background: var(--cc-q-t); flex-shrink: 0; }
      ha-card.playing .ctl { background: ${alpha('--cc-on', 14)}; }
      .ctl.main { width: 44px; height: 44px; border-radius: var(--cc-r-ctl, 12px); background: var(--cv-fill-o); color: var(--cc-on); }
      ha-card.playing .ctl.main { background: var(--cc-on); color: var(--cv-fill-o); }
      .tap { cursor: pointer; }
      ha-card { container-type: inline-size; }
      @container (max-width: 380px) { .row { gap: 8px; } .ctl { width: 36px; height: 36px; } .ctl.main { width: 40px; height: 40px; } }
      @container (max-width: 280px) { .ctl:not(.main) { display: none; } }
      @container (max-width: 200px) { .art { display: none; } }

      /* ---- full size, for a pop-up ---- */
      ha-card.full { padding: 16px; display: flex; flex-direction: column; gap: 14px; position: relative; overflow: visible; }
      .cover { width: 100%; aspect-ratio: 1.6; border-radius: 18px; background: ${alpha('--cc-on', 14)} center / cover no-repeat; display: flex; align-items: center; justify-content: center; color: ${alpha('--cc-on', 70)}; }
      .what { display: flex; flex-direction: column; gap: 3px; min-width: 0; text-align: left; }
      .what small { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .75; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .what b { font-family: Fraunces, serif; font-weight: 400; font-size: 28px; line-height: 1.1; font-variation-settings: 'SOFT' 100; }
      .what span { font-size: 14px; opacity: .85; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .pos { display: flex; flex-direction: column; gap: 6px; }
      .bar { height: 6px; border-radius: 3px; background: ${alpha('--cc-on', 22)}; position: relative; touch-action: none; }
      .bar.seek { cursor: pointer; }
      .bar::before { content: ''; position: absolute; inset: -10px 0; }
      .bar i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 3px; background: var(--cc-on); }
      .bar b { position: absolute; top: -5px; width: 16px; height: 16px; margin-left: -8px; border-radius: 50%; background: var(--cc-on); }
      .times { display: flex; justify-content: space-between; font-size: 12px; opacity: .8; font-variant-numeric: tabular-nums; }
      .controls { display: flex; align-items: center; justify-content: space-between; padding: 0 4px; }
      .controls button { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${alpha('--cc-on', 16)}; }
      .controls button.small { width: 40px; height: 40px; background: none; opacity: .6; }
      .controls button.small[aria-pressed="true"] { opacity: 1; }
      .controls button.big { width: 72px; height: 72px; background: var(--cc-on); color: var(--cv-fill-o); }
      .controls .gap { width: 40px; }
      .vol { display: flex; align-items: center; gap: 12px; }
      .vbtn, .chip, .pwr { height: 40px; border-radius: var(--cc-r-ctl, 12px); background: ${alpha('--cc-on', 14)}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .vbtn, .pwr { width: 40px; }
      .vslider { flex: 1; height: 40px; border-radius: var(--cc-r-ctl, 12px); background: ${alpha('--cc-on', 14)}; position: relative; overflow: hidden; cursor: pointer; touch-action: none; }
      .vslider i { position: absolute; left: 0; top: 0; bottom: 0; background: ${alpha('--cc-on', 32)}; }
      .vslider b { position: absolute; top: 10px; width: 4px; height: 20px; margin-left: -6px; border-radius: 2px; background: var(--cc-on); }
      .vol .pct { width: 44px; text-align: right; font-size: 15px; font-weight: 700; font-variant-numeric: tabular-nums; }
      .chips { display: flex; gap: 8px; align-items: center; min-width: 0; }
      .chip { padding: 0 10px 0 12px; gap: 6px; font-size: 14px; font-weight: 600; min-width: 0; }
      .chip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .chip svg { flex-shrink: 0; }
      .chip svg:last-child { opacity: .7; }
      .pwr { margin-left: auto; }
      .menu { position: absolute; left: 12px; right: 12px; bottom: 12px; z-index: 3; max-height: calc(100% - 24px); overflow-y: auto; background: var(--cc-on); color: var(--cv-on-cream); border-radius: 18px; padding: 6px; box-shadow: 0 12px 30px var(--cv-shadow-30, rgba(0,0,0,.3)); animation: cc-in .2s ease both; }
      .menu .mt { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px 4px; font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: color-mix(in srgb, var(--cv-on-cream) 65%, transparent); }
      .menu button.opt { width: 100%; height: 42px; padding: 0 10px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; font-size: 15px; font-weight: 500; text-align: left; }
      .menu button.opt[aria-checked="true"] { font-weight: 700; background: color-mix(in srgb, var(--cv-fill-o) 12%, transparent); color: var(--cv-fill-o); }
      .menu .x { width: 30px; height: 30px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
      .off { display: flex; align-items: center; gap: 12px; }
      .off .ic { width: 56px; height: 56px; border-radius: 16px; background: var(--cc-q-t); color: var(--cc-q); }
      .off .txt b { font-size: 18px; }
      .on { height: 44px; padding: 0 16px 0 12px; border-radius: var(--cc-r-ctl, 12px); background: var(--cv-fill-o); color: var(--cc-on); display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; flex-shrink: 0; }
      .full.idle .cover, .medium.idle .mcover, .medium.na .mcover { background-color: var(--cc-q-t); color: var(--cc-q); }
      .full.idle .what small, .medium.idle .what small { color: var(--cc-muted); opacity: 1; }
      .offact { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
      .again { height: 44px; padding: 0 16px 0 12px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-q-t); display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; flex-shrink: 0; }

      /* ---- medium, for a dashboard ---- */
      ha-card.medium { padding: 12px; }
      .mrow { display: flex; gap: 14px; align-items: stretch; }
      .mcover { width: 128px; height: 128px; flex-shrink: 0; border-radius: 16px; background: ${alpha('--cc-on', 14)} center / cover no-repeat; display: flex; align-items: center; justify-content: center; color: ${alpha('--cc-on', 70)}; }
      .mbody { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; padding: 2px 0; }
      .medium .what b { font-size: 22px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .mpos { height: 4px; border-radius: 2px; background: ${alpha('--cc-on', 22)}; position: relative; overflow: hidden; }
      .mpos i { position: absolute; left: 0; top: 0; bottom: 0; background: var(--cc-on); border-radius: 2px; }
      .mctl { display: flex; align-items: center; gap: 6px; }
      .mctl button { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${alpha('--cc-on', 16)}; flex-shrink: 0; }
      .mctl button.big { width: 48px; height: 48px; background: var(--cc-on); color: var(--cv-fill-o); }
      .mctl button.soft { background: none; opacity: .8; }
      .mctl button.soft[aria-pressed="true"] { opacity: 1; }
      .mtime { flex: 1; text-align: right; font-size: 12px; opacity: .8; font-variant-numeric: tabular-nums; white-space: nowrap; }
      .medium:not(.playing) .mctl button:not(.big) { background: var(--cc-q-t); }
      .medium:not(.playing) .mctl button.big { background: var(--cv-fill-o); color: var(--cc-on); }
      @container (max-width: 360px) { .mcover { width: 96px; height: 96px; } .mrow { gap: 12px; } .medium .what b { font-size: 19px; } .mtime { display: none; } }
      .favs { display: flex; flex-direction: column; gap: 8px; }
      ha-card.playing .favs { padding-top: 12px; border-top: 1px solid ${alpha('--cc-on', 16)}; }
      .favs .k { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; opacity: .75; }
      .favrow { display: flex; gap: 8px; margin-right: -16px; padding-right: 16px; }
      .fav { width: 96px; display: flex; flex-direction: column; gap: 6px; text-align: left; }
      .fav .t { width: 96px; height: 96px; border-radius: 14px; background: center / cover no-repeat; position: relative; display: flex; align-items: flex-end; padding: 8px; box-sizing: border-box; color: var(--cc-on); }
      .fav .t em { position: absolute; top: 6px; right: 6px; height: 22px; padding: 0 7px; border-radius: 11px; background: var(--cc-on); color: var(--cv-fill-o); font-size: 11px; font-weight: 700; font-style: normal; display: flex; align-items: center; }
      .fav .n { font-size: 13px; font-weight: 600; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 96px; }
      .full .na-t { font-size: 15px; color: var(--cc-muted); }
    `;
    }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    connectedCallback() { this._tickOn(); }
    disconnectedCallback() { clearInterval(this._tick); this._tick = null; }
    // while a song plays in the full size, the time moves on every second
    _tickOn() {
      const want = this.isConnected && this._config && (this._config.size === 'full' || this._config.size === 'medium');
      if (want && !this._tick) this._tick = setInterval(() => { if (this._m && this._m.ticking) { this._last = ''; this._update(); } }, 1000);
      if (!want && this._tick) { clearInterval(this._tick); this._tick = null; }
    }
    // What played last. Home Assistant forgets the song once the player stops, so the card keeps it:
    // in this browser while it plays, and otherwise from the player's history of the last two days.
    _lastKey() { return 'cranberry-media-last:' + this._config.entity; }
    _remember(st) {
      const a = st && st.attributes;
      if (!a || st.state !== 'playing' || !a.media_title) return;
      const item = { title: a.media_title, artist: a.media_artist || a.media_album_artist || a.media_channel || '', id: a.media_content_id || '', type: a.media_content_type || '', source: a.source || '', playlist: a.media_playlist || '' };
      if (this._lastItem && this._lastItem.title === item.title && this._lastItem.id === item.id) return;
      this._lastItem = item;
      try { localStorage.setItem(this._lastKey(), JSON.stringify(item)); } catch (e) { /* private mode */ }
    }
    _recall() {
      if (this._lastItem) return this._lastItem;
      try { const s = localStorage.getItem(this._lastKey()); if (s) return (this._lastItem = JSON.parse(s)); } catch (e) { /* none */ }
      if (!this._askedHistory && this._hass && this._hass.callApi) {
        this._askedHistory = true;
        const id = this._config.entity, from = new Date(Date.now() - 2 * 864e5).toISOString();
        this._hass.callApi('GET', `history/period/${from}?filter_entity_id=${encodeURIComponent(id)}&significant_changes_only=0`).then((res) => {
          const list = (res && res[0]) || [];
          for (let i = list.length - 1; i >= 0; i--) {
            const a = list[i].attributes || {};
            if (a.media_title) {
              this._lastItem = { title: a.media_title, artist: a.media_artist || a.media_album_artist || a.media_channel || '', id: a.media_content_id || '', type: a.media_content_type || '', source: a.source || '', playlist: a.media_playlist || '' };
              this._last = ''; this._update();
              return;
            }
          }
        }).catch(() => {});
      }
      return null;
    }
    // how to start the last item again: the favourite it came from, or its own address
    _resume(last) {
      if (!last) return null;
      const favs = [].concat(this._config.favourites || []).filter((f) => f && f.name);
      const keys = [last.id, last.playlist, last.title].filter(Boolean).map(String);
      const fav = favs.find((f) => keys.indexOf(String(f.media_content_id || '')) >= 0 || keys.indexOf(f.name) >= 0);
      if (fav) return fav;
      if (last.id && /^[a-z][a-z0-9+.-]*:/i.test(last.id)) return { media_content_id: last.id, media_content_type: last.type || 'music', source: last.source };
      return null;
    }
    _lastText(last) { return last ? [last.title, last.artist].filter(Boolean).join(' · ') : ''; }

    model() {
      const c = this._config, st = this.st(c.entity);
      const room = c.name || (st ? this.nm(c.entity) : c.entity);
      this._remember(st);
      if (c.size === 'full') return this._full(st, room);
      if (c.size === 'medium') return Object.assign(this._full(st, room), { medium: true });
      if (!st || OFF_STATES.indexOf(st.state) >= 0 || (!st.attributes.media_title && st.state === 'idle')) {
        const na = this.isNa(st);
        if (na || !st) return { title: room, sub: this.t(na ? 'Not responding' : 'Nothing playing'), na, playing: false, art: '', ctl: [] };
        const sf = Number(st.attributes.supported_features) || 0, off = OFF_STATES.indexOf(st.state) >= 0;
        const last = this._recall(), again = (sf & MP.PLAY_MEDIA) ? this._resume(last) : null;
        const ctl = [];
        if (off && (sf & MP.TURN_ON)) ctl.push({ act: 'turn_on', icon: MI.power, aria: this.t('Turn on'), main: !again, stroke: true });
        if (again) ctl.push({ act: 'again', icon: MI.play, aria: this.t('Play {name}', { name: last.title }), main: true });
        else if (!off && (sf & MP.PLAY)) ctl.push({ act: 'media_play', icon: MI.play, aria: this.t('Play'), main: true });
        const sub = last ? this.t('Last played: {what}', { what: this._lastText(last) }) : this.t(off ? 'Off' : 'Nothing playing');
        return { title: room, sub, na: false, playing: false, art: '', ctl };
      }
      const a = st.attributes, sf = a.supported_features || 0;
      const playing = st.state === 'playing';
      const art = c.show_artwork === false ? '' : (a.entity_picture_local || a.entity_picture || '');
      const sub = [a.media_artist || a.media_album_artist || a.app_name || a.media_channel, room].filter(Boolean).join(' · ');
      const ctl = [];
      if (sf & MP.PREV) ctl.push({ act: 'media_previous_track', icon: MI.prev, aria: this.t('Previous track') });
      if (playing) ctl.push({ act: (sf & MP.PAUSE) ? 'media_pause' : 'media_stop', icon: (sf & MP.PAUSE) ? MI.pause : MI.stop, aria: this.t((sf & MP.PAUSE) ? 'Pause' : 'Stop'), main: true });
      else ctl.push({ act: 'media_play', icon: MI.play, aria: this.t('Play'), main: true });
      if (sf & MP.NEXT) ctl.push({ act: 'media_next_track', icon: MI.next, aria: this.t('Next track') });
      return { title: a.media_title || this.fmt(st), sub, playing, art, ctl, na: false };
    }

    _favs(a) {
      const list = [].concat(this._config.favourites || []).filter((f) => f && f.name);
      const cur = [a.media_content_id, a.media_playlist, a.media_channel, a.media_title].filter(Boolean).map(String);
      const tile = (f, i) => ({
        i, name: f.name, radio: f.type === 'radio', image: f.image || '', fill: FAV_FILLS[i % FAV_FILLS.length],
        now: cur.indexOf(String(f.media_content_id || '')) >= 0 || cur.indexOf(f.name) >= 0
      });
      const all = list.map(tile);
      return [
        { k: this.t('Playlists'), items: all.filter((f) => !f.radio) },
        { k: this.t('Radio'), items: all.filter((f) => f.radio) }
      ].filter((r) => r.items.length);
    }

    _full(st, room) {
      const c = this._config;
      if (this.isNa(st)) return { full: true, na: true, room, text: this.t('Not responding') };
      const a = st.attributes, sf = Number(a.supported_features) || 0;
      const favs = this._favs(a);
      if (OFF_STATES.indexOf(st.state) >= 0) {
        const last = this._recall(), again = (sf & MP.PLAY_MEDIA) ? this._resume(last) : null;
        return { full: true, off: true, room, lastItem: last, again: !!again, canOn: !!(sf & MP.TURN_ON), favs, menu: null };
      }
      const playing = st.state === 'playing';
      const art = c.show_artwork === false ? '' : (a.entity_picture_local || a.entity_picture || '');
      const label = [a.app_name || a.source, a.media_playlist].filter(Boolean).filter((x, i, arr) => arr.indexOf(x) === i).join(' · ');
      // where it is in the song
      let pos = null;
      const dur = Number(a.media_duration);
      if (dur > 0 && a.media_position != null) {
        let p = Number(a.media_position);
        if (playing && a.media_position_updated_at) p += (Date.now() - Date.parse(a.media_position_updated_at)) / 1000;
        p = Math.min(dur, Math.max(0, p));
        pos = { pct: (p / dur * 100).toFixed(2), at: mmss(p), left: '−' + mmss(dur - p), seek: !!(sf & MP.SEEK) };
      }
      const vol = (sf & MP.VOLUME_SET) && a.volume_level != null ? Math.round(Number(a.volume_level) * 100) : null;
      const menuKind = this._menu;
      const menu = menuKind === 'source' && a.source_list ? { title: this.t('Source'), act: 'source', opts: a.source_list, cur: a.source }
        : menuKind === 'sound' && a.sound_mode_list ? { title: this.t('Sound mode'), act: 'sound', opts: a.sound_mode_list, cur: a.sound_mode } : null;
      const tv = /^(tv|television|hdmi|tv audio)/i.test(String(a.source || '')) && !a.media_title;
      return {
        full: true, playing, ticking: playing && !!pos, room, art, tv,
        label: label || room, title: a.media_title || (a.source ? a.source : this.fmt(st)),
        artist: [a.media_artist || a.media_album_artist, a.media_album_name].filter(Boolean).join(' · '),
        pos,
        prev: !!(sf & MP.PREV), next: !!(sf & MP.NEXT),
        pause: playing ? ((sf & MP.PAUSE) ? 'media_pause' : 'media_stop') : null,
        shuffle: (sf & MP.SHUFFLE) ? !!a.shuffle : null, repeat: (sf & MP.REPEAT) ? (a.repeat || 'off') : null,
        vol, muted: !!a.is_volume_muted, canMute: !!(sf & MP.VOLUME_MUTE),
        source: (sf & MP.SELECT_SOURCE) && a.source_list && a.source_list.length ? (a.source || this.t('Source')) : null,
        sound: (sf & MP.SOUND_MODE) && a.sound_mode_list && a.sound_mode_list.length ? (a.sound_mode || this.t('Sound mode')) : null,
        canOff: !!(sf & MP.TURN_OFF), favs, menu
      };
    }

    // the cover's tone on the card, through the olive it uses while playing
    _tone(art) {
      if (this._config.cover_colour === false) return '';
      const t = art ? coverTone(art, () => { this._last = ''; this._update(); }) : null;
      return ` style="--cv-fill-o:${t || NIGHT_BLUE}"`;
    }
    // off: turn it on, or start what played last again
    _offButtons(m) {
      if (!m.canOn && !m.again) return '';
      return `<div class="offact">${m.canOn ? `<button type="button" class="on" data-act="turn_on">${mIcon(MI.power, 16)}${esc(this.t('Turn on'))}</button>` : ''}${m.again ? `<button type="button" class="again" data-act="again" aria-label="${esc(this.t('Play {name}', { name: m.lastItem.title }))}">${mIcon(MI.play, 16, true)}${esc(this.t('Play again'))}</button>` : ''}</div>`;
    }
    // medium: the cover beside what's playing and the controls, for a dashboard
    _medium(m) {
      if (m.na) return `<ha-card class="medium na tap" data-act="more"><div class="mrow"><div class="mcover">${mIcon(MI.music, 40)}</div><div class="mbody"><div class="what"><small>${esc(m.room)}</small><b>${esc(m.text)}</b></div></div></div></ha-card>`;
      if (m.off) {
        const l = m.lastItem;
        return `<ha-card class="medium idle tap" data-act="more"><div class="mrow"><div class="mcover">${mIcon(MI.music, 40)}</div><div class="mbody">
          <button type="button" class="what tap" data-act="more"><small>${esc(l ? this.t('Off') + ' · ' + this.t('Last played') : m.room + ' · ' + this.t('Off'))}</small><b>${esc(l ? l.title : this.t('Nothing playing'))}</b>${l && l.artist ? `<span>${esc(l.artist)}</span>` : ''}</button>
          ${this._offButtons(m)}</div></div></ha-card>`;
      }
      const on = m.playing || m.pos || m.title;
      const pos = m.pos ? `<div class="mpos"><i style="width:${m.pos.pct}%"></i></div>` : '';
      const ctl = `<div class="mctl">
          ${m.prev ? `<button type="button" data-act="media_previous_track" aria-label="${esc(this.t('Previous track'))}">${mIcon(MI.prev, 20, true)}</button>` : ''}
          <button type="button" class="big" data-act="${m.pause || 'media_play'}" aria-label="${esc(this.t(m.pause ? (m.pause === 'media_pause' ? 'Pause' : 'Stop') : 'Play'))}">${mIcon(m.pause ? (m.pause === 'media_pause' ? MI.pause : MI.stop) : MI.play, 24, true)}</button>
          ${m.next ? `<button type="button" data-act="media_next_track" aria-label="${esc(this.t('Next track'))}">${mIcon(MI.next, 20, true)}</button>` : ''}
          ${m.pos ? `<span class="mtime">${m.pos.at} / ${m.pos.left.replace('−', '')}</span>` : '<span class="mtime"></span>'}
          ${m.canMute ? `<button type="button" class="soft" data-act="mute" aria-pressed="${m.muted}" aria-label="${esc(this.t(m.muted ? 'Unmute' : 'Mute'))}">${mIcon(m.muted ? MI.mute : MI.volume, 18)}</button>` : ''}
        </div>`;
      return `<ha-card class="medium tap${on ? ' playing' : ''}" data-act="more"${on ? this._tone(m.art) : ''}><div class="mrow">
        <div class="mcover" style="${m.art ? `background-image:url('${esc(m.art)}')` : ''}" role="img" aria-label="${esc(m.title)}">${m.art ? '' : mIcon(m.tv ? MI.tv : MI.music, 40)}</div>
        <div class="mbody"><button type="button" class="what tap" data-act="more"><small>${esc(m.label)}</small><b>${esc(m.title)}</b>${m.artist ? `<span>${esc(m.artist)}</span>` : ''}</button>${pos}${ctl}</div>
      </div></ha-card>`;
    }

    view(m) {
      if (m.medium) return this._medium(m);
      if (!m.full) {
        return `<ha-card class="tap ${m.playing ? 'playing' : ''} ${m.na ? 'na' : ''}" data-act="more"${m.playing ? this._tone(m.art) : ''}><div class="row">
          <div class="art" style="${m.art ? `background-image:url('${esc(m.art)}')` : ''}">${m.art ? '' : mIcon(MI.music, 20)}</div>
          <div class="txt tap" role="button" tabindex="0" data-act="more"><span class="name">${esc(m.title)}</span><span class="state">${esc(m.sub)}</span></div>
          ${m.ctl.map((b) => `<button type="button" class="ctl ${b.main ? 'main' : ''}" data-act="${b.act}" aria-label="${esc(b.aria)}">${mIcon(b.icon, 20, !b.stroke)}</button>`).join('')}
        </div></ha-card>`;
      }
      if (m.na) return `<ha-card class="full na"><div class="off"><span class="ic">${mIcon(MI.music, 24)}</span><span class="txt"><b>${esc(m.room)}</b><span class="state">${esc(m.text)}</span></span></div></ha-card>`;
      const favs = m.favs.length ? `<div class="favs">${m.favs.map((r) => `<span class="k">${esc(r.k)}</span><div class="favrow scrollrow">${r.items.map((f) => `<button type="button" class="fav" data-act="fav" data-arg="${f.i}" aria-label="${esc(this.t('Play {name}', { name: f.name }))}"><span class="t" style="${f.image ? `background-image:url('${esc(f.image)}')` : `background-color:${f.fill}`}">${f.image ? '' : mIcon(f.radio ? MI.radio : MI.list, 22)}${f.now ? `<em>${esc(this.t('Playing'))}</em>` : ''}</span><span class="n">${esc(f.name)}</span></button>`).join('')}</div>`).join('')}</div>` : '';
      if (m.off) {
        const l = m.lastItem;
        return `<ha-card class="full idle"><div class="cover" role="img" aria-label="${esc(this.t('Off'))}">${mIcon(MI.music, 56)}</div>
          <button type="button" class="what tap" data-act="details"><small>${esc(l ? this.t('Off') + ' · ' + this.t('Last played') : this.t('Off'))}</small><b>${esc(l ? l.title : m.room)}</b>${l && l.artist ? `<span>${esc(l.artist)}</span>` : ''}</button>
          ${this._offButtons(m)}${favs}</ha-card>`;
      }
      const cover = `<div class="cover" style="${m.art ? `background-image:url('${esc(m.art)}')` : ''}" role="img" aria-label="${esc(m.title)}">${m.art ? '' : mIcon(m.tv ? MI.tv : MI.music, 56)}</div>`;
      const pos = m.pos ? `<div class="pos"><div class="bar${m.pos.seek ? ' seek' : ''}" data-bar="seek" role="slider" aria-label="${esc(this.t('Position'))}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(m.pos.pct)}"><i style="width:${m.pos.pct}%"></i><b style="left:${m.pos.pct}%"></b></div><div class="times"><span>${m.pos.at}</span><span>${m.pos.left}</span></div></div>` : '';
      const ctl = `<div class="controls">
          ${m.shuffle != null ? `<button type="button" class="small" data-act="shuffle" aria-pressed="${m.shuffle}" aria-label="${esc(this.t('Shuffle'))}">${mIcon(MI.shuffle, 20)}</button>` : '<span class="gap"></span>'}
          ${m.prev ? `<button type="button" data-act="media_previous_track" aria-label="${esc(this.t('Previous track'))}">${mIcon(MI.prev, 22, true)}</button>` : '<span class="gap"></span>'}
          <button type="button" class="big" data-act="${m.pause || 'media_play'}" aria-label="${esc(this.t(m.pause ? (m.pause === 'media_pause' ? 'Pause' : 'Stop') : 'Play'))}">${mIcon(m.pause ? (m.pause === 'media_pause' ? MI.pause : MI.stop) : MI.play, 28, true)}</button>
          ${m.next ? `<button type="button" data-act="media_next_track" aria-label="${esc(this.t('Next track'))}">${mIcon(MI.next, 22, true)}</button>` : '<span class="gap"></span>'}
          ${m.repeat != null ? `<button type="button" class="small" data-act="repeat" aria-pressed="${m.repeat !== 'off'}" aria-label="${esc(this.t('Repeat'))}">${mIcon(m.repeat === 'one' ? MI.repeat1 : MI.repeat, 20)}</button>` : '<span class="gap"></span>'}
        </div>`;
      const vol = m.vol != null ? `<div class="vol">${m.canMute ? `<button type="button" class="vbtn" data-act="mute" aria-pressed="${m.muted}" aria-label="${esc(this.t(m.muted ? 'Unmute' : 'Mute'))}">${mIcon(m.muted ? MI.mute : MI.volume, 18)}</button>` : ''}<div class="vslider" data-bar="volume" role="slider" aria-label="${esc(this.t('Volume'))}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${m.vol}" tabindex="0"><i style="width:${m.vol}%"></i><b style="left:${m.vol}%"></b></div><span class="pct">${m.vol}%</span></div>` : '';
      const chips = m.source || m.sound || m.canOff ? `<div class="chips">${m.source ? `<button type="button" class="chip" data-act="menu" data-arg="source" aria-haspopup="listbox" aria-label="${esc(this.t('Source'))}: ${esc(m.source)}">${mIcon(MI.speaker, 16)}<span>${esc(m.source)}</span>${mIcon(MI.chev, 16)}</button>` : ''}${m.sound ? `<button type="button" class="chip" data-act="menu" data-arg="sound" aria-haspopup="listbox" aria-label="${esc(this.t('Sound mode'))}: ${esc(m.sound)}">${mIcon(MI.sound, 16)}<span>${esc(m.sound)}</span>${mIcon(MI.chev, 16)}</button>` : ''}${m.canOff ? `<button type="button" class="pwr" data-act="turn_off" aria-label="${esc(this.t('Turn off'))}">${mIcon(MI.power, 18)}</button>` : ''}</div>` : '';
      const menu = m.menu ? `<div class="menu" role="listbox" aria-label="${esc(m.menu.title)}"><div class="mt">${esc(m.menu.title)}<button type="button" class="x" data-act="close" aria-label="${esc(this.t('Close'))}">${mIcon('M18 6 6 18M6 6l12 12', 16)}</button></div>${m.menu.opts.map((o) => `<button type="button" class="opt" role="option" data-act="${m.menu.act}" data-arg="${esc(o)}" aria-checked="${o === m.menu.cur}">${esc(o)}${o === m.menu.cur ? mIcon(MI.check, 16) : ''}</button>`).join('')}</div>` : '';
      return `<ha-card class="full${m.playing || m.pos || m.title ? ' playing' : ''}"${m.playing || m.pos || m.title ? this._tone(m.art) : ''}>${cover}
        <button type="button" class="what tap" data-act="details"><small>${esc(m.label)}</small><b>${esc(m.title)}</b>${m.artist ? `<span>${esc(m.artist)}</span>` : ''}</button>
        ${pos}${ctl}${vol}${chips}${favs}${menu}</ha-card>`;
    }

    // drag on the position and volume bars
    _bars() {
      if (this._barsWired) return;
      this._barsWired = true;
      const pick = (e) => e.composedPath().find((el) => el.getAttribute && el.hasAttribute('data-bar'));
      let bar = null, timer = null;
      const frac = (e) => { const r = bar.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); };
      const send = (e, final) => {
        const f = frac(e), kind = bar.getAttribute('data-bar'), st = this.st(this._config.entity);
        if (!st) return;
        bar.querySelector('i').style.width = (f * 100) + '%';
        const knob = bar.querySelector('b'); if (knob) knob.style.left = (f * 100) + '%';
        clearTimeout(timer);
        const go = () => {
          if (kind === 'volume') this.call('media_player', 'volume_set', { entity_id: this._config.entity, volume_level: Math.round(f * 100) / 100 });
          else if (Number(st.attributes.media_duration) > 0 && ((Number(st.attributes.supported_features) || 0) & MP.SEEK)) this.call('media_player', 'media_seek', { entity_id: this._config.entity, seek_position: Math.round(f * Number(st.attributes.media_duration)) });
        };
        if (final) go(); else timer = setTimeout(go, 150);
      };
      this.shadowRoot.addEventListener('pointerdown', (e) => {
        const b = pick(e); if (!b || (b.getAttribute('data-bar') === 'seek' && !b.classList.contains('seek'))) return;
        bar = b; try { bar.setPointerCapture(e.pointerId); } catch (err) { /* */ }
        this._dragging = true; send(e); e.preventDefault();
      });
      this.shadowRoot.addEventListener('pointermove', (e) => { if (bar) send(e); });
      const end = (e) => { if (!bar) return; send(e, true); bar = null; setTimeout(() => { this._dragging = false; }, 600); };
      this.shadowRoot.addEventListener('pointerup', end);
      this.shadowRoot.addEventListener('pointercancel', () => { bar = null; this._dragging = false; });
      // the keyboard on the volume slider
      this.shadowRoot.addEventListener('keydown', (e) => {
        const b = pick(e); if (!b || b.getAttribute('data-bar') !== 'volume' || ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) < 0) return;
        e.preventDefault();
        const st = this.st(this._config.entity); if (!st) return;
        const step = e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -0.05 : 0.05;
        this.call('media_player', 'volume_set', { entity_id: this._config.entity, volume_level: Math.min(1, Math.max(0, Math.round((Number(st.attributes.volume_level) + step) * 100) / 100)) });
      });
    }
    _update() {
      if (this._dragging) return;
      this._tickOn(); super._update(); if (this._config && this._config.size === 'full') this._bars();
    }

    async _play(f) {
      const c = this._config, st = this.st(c.entity), h = this._hass;
      if (f.action && f.action.service) {
        const [d, s] = String(f.action.service).split('.');
        return h.callService(d, s, f.action.data || {});
      }
      if (st && OFF_STATES.indexOf(st.state) >= 0) await this.call('media_player', 'turn_on', { entity_id: c.entity });
      if (f.source) await this.call('media_player', 'select_source', { entity_id: c.entity, source: f.source });
      if (f.media_content_id) {
        await this.call('media_player', 'play_media', { entity_id: f.entity || c.favourites_player || c.entity, media_content_id: f.media_content_id, media_content_type: f.media_content_type || (f.type === 'radio' ? 'music' : 'playlist') });
      }
    }

    act(a, arg) {
      const c = this._config, id = c.entity, st = this.st(id);
      if (a === 'more') return c.popup ? this.navigate(c.popup) : this.moreInfo(id);
      if (a === 'details') return this.moreInfo(id);
      if (a === 'menu') { this._menu = this._menu === arg ? null : arg; this._last = ''; return this._update(); }
      if (a === 'close') { this._menu = null; this._last = ''; return this._update(); }
      if (a === 'source' || a === 'sound') {
        this._menu = null; this._last = ''; this._update();
        return a === 'source' ? this.call('media_player', 'select_source', { entity_id: id, source: arg }) : this.call('media_player', 'select_sound_mode', { entity_id: id, sound_mode: arg });
      }
      if (a === 'again') { const f = this._resume(this._recall()); return f && this._play(f); }
      if (a === 'fav') { const f = [].concat(c.favourites || []).filter((x) => x && x.name)[Number(arg)]; return f && this._play(f); }
      if (a === 'shuffle') return this.call('media_player', 'shuffle_set', { entity_id: id, shuffle: !(st && st.attributes.shuffle) });
      if (a === 'repeat') { const order = ['off', 'all', 'one'], cur = (st && st.attributes.repeat) || 'off'; return this.call('media_player', 'repeat_set', { entity_id: id, repeat: order[(order.indexOf(cur) + 1) % 3] }); }
      if (a === 'mute') return this.call('media_player', 'volume_mute', { entity_id: id, is_volume_muted: !(st && st.attributes.is_volume_muted) });
      this.call('media_player', a, { entity_id: id });
    }
  }
  CranberryMediaCard.defaults = { cover_colour: true };

