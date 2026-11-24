  // ---------- Weather card: out here, now and later ----------
  // For a balcony or garden pop-up. The temperature now and a switch, then one of two views:
  // Hours: a sentence (when it's dry, when it rains), wind, rain today, sunset, humidity, and
  // a strip of the next 24 hours that scrolls sideways. Days: a sentence (which day is best),
  // then today and the next six with rain and a low-to-high bar on one scale.
  const WX = window.CranberryWeather;
  const WIND_ALERT = { 'km/h': 50, 'm/s': 14, mph: 31, kn: 27 };

  class CranberryWeatherCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { padding: 18px 18px 16px; display: flex; flex-direction: column; gap: 14px; container-type: inline-size; }
      .top { display: flex; align-items: center; gap: 12px; }
      .now { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; text-align: left; }
      .big { font-family: Fraunces, serif; font-size: 56px; line-height: 1; font-weight: 400; font-variation-settings: 'SOFT' 100; }
      .cond { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .cond b { font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .cond span { font-size: 13px; color: var(--cc-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .cond .wi { flex-shrink: 0; }
      ha-icon.wi { display: inline-flex; }
      .seg { display: flex; padding: 3px; border-radius: var(--cc-r-ctl, 12px); background: color-mix(in srgb, var(--cc-text) 7%, transparent); flex-shrink: 0; }
      .seg button { height: 34px; padding: 0 12px; border-radius: 9px; font-size: 13px; font-weight: 700; color: var(--cc-muted); }
      .seg button[aria-pressed="true"] { background: var(--cv-fill-c); color: var(--cc-on); }
      .say { margin: 0; font-size: 16px; font-weight: 600; line-height: 1.4; }
      .stats { display: grid; grid-template-columns: repeat(var(--n, 4), minmax(0, 1fr)); gap: 8px; padding: 10px 0; border-top: 1px solid var(--cc-rule, color-mix(in srgb, var(--cc-text) 12%, transparent)); border-bottom: 1px solid var(--cc-rule, color-mix(in srgb, var(--cc-text) 12%, transparent)); }
      .stat { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .stat i { font-style: normal; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--cc-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .stat b { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .strip { display: flex; gap: 2px; margin: 0 -18px; padding: 0 18px; }
      .strip > .h { flex: 0 0 52px; display: flex; flex-direction: column; align-items: center; gap: 6px; box-sizing: border-box; white-space: normal; }
      .h small { font-size: 12px; font-weight: 500; color: var(--cc-muted); white-space: nowrap; }
      .h.first small, .h.day small { font-weight: 700; color: var(--cc-text); }
      .h.day { border-left: 1px solid color-mix(in srgb, var(--cc-text) 12%, transparent); }
      .h b { font-size: 15px; font-weight: 600; }
      .h .rb { width: 70%; height: 22px; display: flex; align-items: flex-end; }
      .h .rb span { width: 100%; border-radius: 3px; background: var(--cv-rain); }
      .sun { color: var(--cc-ochre); } .wet { color: var(--cv-rain); } .dim { color: var(--cc-muted); }
      .days { display: flex; flex-direction: column; border-top: 1px solid color-mix(in srgb, var(--cc-text) 12%, transparent); }
      .d { display: grid; grid-template-columns: 76px 28px 48px 30px 1fr 30px; align-items: center; gap: 8px; height: 48px; border-bottom: 1px solid color-mix(in srgb, var(--cc-text) 12%, transparent); }
      .d:last-child { border-bottom: 0; }
      .d .dn { font-size: 15px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .d.today .dn { font-weight: 700; }
      .d .rn { font-size: 13px; font-weight: 600; color: var(--cv-rain); white-space: nowrap; }
      .d .lo { font-size: 15px; color: var(--cc-muted); text-align: right; }
      .d .hi { font-size: 15px; font-weight: 600; }
      .bar { height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--cc-text) 10%, transparent); position: relative; }
      .bar span { position: absolute; top: 0; bottom: 0; border-radius: 3px; background: var(--cc-ochre); }
      .bar i { position: absolute; top: -3px; width: 12px; height: 12px; margin-left: -6px; border-radius: 50%; background: var(--cc-card); border: 2.5px solid var(--cc-text); box-sizing: border-box; }
      .empty { font-size: 14px; color: var(--cc-muted); }
      @container (max-width: 420px) {
        .big { font-size: 44px; }
        .d { grid-template-columns: 66px 24px 40px 26px 1fr 26px; }
        .stats { --n: 3 !important; } .stat:nth-child(4) { display: none; }
      }
      @container (max-width: 340px) { .cond span { display: none; } }
      `;
    }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    connectedCallback() { this._subscribe(); }
    disconnectedCallback() { this._unsubscribe(); }
    _lang() { return (this._hass && this._hass.locale && this._hass.locale.language) || (this._hass && this._hass.language) || 'en'; }
    _time(d) {
      const h12 = this._hass && this._hass.locale && this._hass.locale.time_format === '12';
      return new Intl.DateTimeFormat(this._lang(), { hour: '2-digit', minute: '2-digit', hour12: !!h12 }).format(d);
    }
    _num(n, dec) { return Number(n).toLocaleString(this._lang(), { maximumFractionDigits: dec == null ? 1 : dec }); }

    // ----- forecasts: hourly for the strip, daily for the days -----
    _subscribe() {
      const h = this._hass, c = this._config;
      if (!h || !c || !this.isConnected || !h.connection) return;
      if (this._subFor === c.entity) return;
      this._unsubscribe();
      const st = h.states[c.entity];
      if (!st) return;
      this._subFor = c.entity;
      this._fc = {};
      const sf = Number(st.attributes.supported_features) || 0;
      const sub = (type) => {
        try {
          const p = h.connection.subscribeMessage((msg) => { this._fc[type] = (msg && msg.forecast) || []; this._last = ''; this._update(); },
            { type: 'weather/subscribe_forecast', forecast_type: type, entity_id: c.entity });
          this._unsubs.push(p);
          Promise.resolve(p).catch(() => {});
        } catch (e) { /* that forecast isn't offered */ }
      };
      this._unsubs = [];
      if (sf & 2) sub('hourly');
      if (sf & 1) sub('daily');
    }
    _unsubscribe() {
      (this._unsubs || []).forEach((p) => Promise.resolve(p).then((f) => typeof f === 'function' && f()).catch(() => {}));
      this._unsubs = []; this._subFor = null;
    }
    _update() { this._subscribe(); super._update(); }

    _viewNow(hasDays) {
      if (!hasDays) return 'hours';
      if (!this._view) {
        try { this._view = localStorage.getItem('cranberry-weather-view:' + this._config.entity); } catch (e) { /* no storage */ }
        if (this._view !== 'hours' && this._view !== 'days') this._view = this._config.view === 'days' ? 'days' : 'hours';
      }
      return this._view;
    }

    model() {
      const h = this._hass, c = this._config, st = this.st(c.entity);
      if (this.isNa(st)) return { na: true, text: this.t('Not responding') };
      const a = st.attributes, now = new Date(), nowT = now.getTime();
      const num = (v) => (v == null || v === '' || isNaN(Number(v)) ? null : Number(v));
      const obs = c.weather_now ? h.states[c.weather_now] : null;
      const temp = obs && num(obs.attributes.temperature) != null ? num(obs.attributes.temperature) : num(a.temperature);
      const round = (v) => (v == null ? '–' : Math.round(v));
      const cond = st.state;

      // day and night from the sun, for the hour icons
      const sun = h.states['sun.sun'];
      const rise = sun ? Date.parse(sun.attributes.next_rising) : NaN, set = sun ? Date.parse(sun.attributes.next_setting) : NaN;
      const nightNow = sun ? sun.state === 'below_horizon' : cond === 'clear-night';
      const isNight = (t) => {
        if (isNaN(rise) || isNaN(set)) return nightNow;
        const day = 86400000, ev = [];
        for (let k = -2; k <= 2; k++) { ev.push([rise + k * day, false]); ev.push([set + k * day, true]); }
        let last = null;
        ev.forEach((e) => { if (e[0] <= t && (!last || e[0] > last[0])) last = e; });
        return last ? last[1] : nightNow;
      };
      // t null: a day, always shown as daytime
      const icon = (cnd, t) => {
        const dark = t != null && isNight(t);
        let k = cnd;
        if (k === 'sunny' && dark) k = 'clear-night';
        const d = cnd === 'partlycloudy' && dark ? WX.I.partlyNight : (WX.HOUR_ICON[k] || WX.I.cloud);
        const cls = k === 'sunny' || k === 'partlycloudy' ? (cnd === 'partlycloudy' && dark ? 'dim' : 'sun') : WX.RAINY.indexOf(k) >= 0 ? 'wet' : 'dim';
        const lu = WX.HOUR_LUCIDE[cnd === 'partlycloudy' && dark ? 'partlycloudy-night' : k] || 'cloud';
        return { d, cls, lu };
      };

      const hourly = (this._fc && this._fc.hourly || []).filter((f) => Date.parse(f.datetime) > nowT - 3600000);
      const daily = (this._fc && this._fc.daily || []).filter((f) => Date.parse(f.datetime) > nowT - 86400000);
      const sameDay = (x, y) => x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
      const today = daily.find((f) => sameDay(new Date(f.datetime), now));

      // the top
      const label = h.formatEntityState ? h.formatEntityState(st) : cond.replace(/-/g, ' ').replace(/^./, (x) => x.toUpperCase());
      const feels = [];
      if (num(a.apparent_temperature) != null) feels.push(this.t('Feels like {temp}', { temp: round(num(a.apparent_temperature)) + '°' }));
      if (today && num(today.temperature) != null) feels.push(this.t('max {temp}', { temp: round(num(today.temperature)) + '°' }));
      const m = { temp: round(temp), label, feels: feels.join(' · '), icon: icon(cond, nowT) };

      // the views
      const hasDays = daily.length > 1, view = this._viewNow(hasDays);
      m.switcher = hasDays && c.switcher !== false;
      m.view = view;

      const wet = (f) => (num(f.precipitation) || 0) >= 0.1 || (num(f.precipitation_probability) || 0) >= 60 || WX.RAINY.indexOf(f.condition) >= 0;
      if (view === 'hours') {
        const hrs = hourly.slice(0, Math.max(6, Math.min(48, Number(c.hours) || 24)));
        // the sentence
        if (hrs.length) {
          const at = (i) => this._time(new Date(hrs[i].datetime));
          const firstDry = hrs.findIndex((f) => !wet(f)), firstWet = hrs.findIndex(wet);
          if (firstWet === 0) {
            m.say = firstDry < 0 ? this.t('Rain for the next {n} hours.', { n: hrs.length }) : this.t('Rain until about {time}, dry after that.', { time: at(firstDry) });
          } else if (firstWet < 0) {
            m.say = this.t('Dry for the next {n} hours.', { n: hrs.length });
          } else {
            const back = hrs.slice(firstWet).findIndex((f) => !wet(f));
            const len = back < 0 ? hrs.length - firstWet : back;
            m.say = this.t(len <= 1 ? 'Dry until about {time}, then a short shower.' : 'Dry until about {time}, then rain for about {n} hours.', { time: at(firstWet), n: len });
          }
          const unit = a.wind_speed_unit || 'km/h';
          const gusts = hrs.slice(0, 12).map((f) => num(f.wind_gust_speed) != null ? num(f.wind_gust_speed) : num(f.wind_speed)).filter((v) => v != null);
          const top = gusts.length ? Math.max.apply(null, gusts) : null;
          if (top != null && top >= (WIND_ALERT[unit] || 50)) m.say += ' ' + this.t('Windy, gusts up to {speed}.', { speed: Math.round(top) + ' ' + unit });
        } else m.say = '';
        // the stats
        const stats = [];
        if (num(a.wind_speed) != null) {
          const dirs = window.CranberryI18n.isNl(h) ? ['N', 'NO', 'O', 'ZO', 'Z', 'ZW', 'W', 'NW'] : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
          const b = num(a.wind_bearing);
          stats.push({ k: this.t('Wind'), v: (b != null ? dirs[Math.round(b / 45) % 8] + ' ' : '') + Math.round(num(a.wind_speed)) + ' ' + (a.wind_speed_unit || 'km/h') });
        }
        let mm = today && num(today.precipitation);
        if (mm == null && hourly.length) mm = hourly.filter((f) => sameDay(new Date(f.datetime), now)).reduce((s, f) => s + (num(f.precipitation) || 0), 0);
        if (mm != null) stats.push({ k: this.t('Rain'), v: this._num(mm) + ' ' + (a.precipitation_unit || 'mm') });
        if (sun && !isNaN(rise) && !isNaN(set)) stats.push(rise < set ? { k: this.t('Sunrise'), v: this._time(new Date(rise)) } : { k: this.t('Sunset'), v: this._time(new Date(set)) });
        if (num(a.humidity) != null) stats.push({ k: this.t('Humidity@short'), v: Math.round(num(a.humidity)) + '%' });
        m.stats = stats.slice(0, 4);
        // the strip: now, then each hour; midnight shows the day
        const wd = (d) => new Intl.DateTimeFormat(this._lang(), { weekday: 'short' }).format(d).replace(/\.$/, '');
        m.strip = [{ t: this.t('Now'), first: true, icon: m.icon, temp: round(temp), bar: 0 }].concat(hrs.filter((f) => Date.parse(f.datetime) > nowT).map((f) => {
          const d = new Date(f.datetime), mid = d.getHours() === 0;
          const p = num(f.precipitation) || 0;
          return { t: mid ? wd(d) : String(d.getHours()).padStart(2, '0'), day: mid, icon: icon(f.condition, d.getTime()), temp: round(num(f.temperature)), bar: p >= 0.05 ? Math.min(22, Math.max(3, Math.round(p * 18))) : 0 };
        }));
        if (!hourly.length) m.empty = this.t(this._fc && this._fc.hourly ? 'No hourly forecast from this weather service.' : 'Loading…');
      } else {
        const ds = daily.slice(0, Math.max(3, Math.min(10, Number(c.days) || 7)));
        const lows = ds.map((f) => num(f.templow)).filter((v) => v != null), highs = ds.map((f) => num(f.temperature)).filter((v) => v != null);
        const lo = Math.min.apply(null, lows.concat(highs, temp != null ? [temp] : [])), hi = Math.max.apply(null, highs.concat(temp != null ? [temp] : []));
        const span = Math.max(1, hi - lo);
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        // a capital, also in Dutch: the names start a row or a sentence
        const dayName = (d, long) => capitalise(sameDay(d, now) ? this.t('Today') : long && sameDay(d, tomorrow) ? this.t('Tomorrow') : new Intl.DateTimeFormat(this._lang(), { weekday: long ? 'long' : 'short' }).format(d).replace(/\.$/, ''));
        m.days = ds.map((f) => {
          const d = new Date(f.datetime), mn = num(f.templow), mx = num(f.temperature), p = num(f.precipitation_probability), mm2 = num(f.precipitation);
          const isToday = sameDay(d, now);
          return {
            name: dayName(d), today: isToday, icon: icon(f.condition, null),
            rain: p != null ? (p >= 10 ? Math.round(p) + '%' : '') : (mm2 != null && mm2 >= 0.1 ? this._num(mm2) + ' mm' : ''),
            lo: round(mn != null ? mn : mx), hi: round(mx),
            left: (((mn != null ? mn : mx) - lo) / span * 100).toFixed(1), width: (((mx - (mn != null ? mn : mx)) / span) * 100).toFixed(1),
            dot: isToday && temp != null ? ((temp - lo) / span * 100).toFixed(1) : null
          };
        });
        // the sentence: the best day for out here, and the wettest
        const score = (f) => (num(f.precipitation_probability) != null ? num(f.precipitation_probability) : (num(f.precipitation) || 0) * 20);
        const dry = ds.every((f) => score(f) < 20);
        if (dry) m.say = this.t('Dry all week.');
        else {
          const best = ds.slice().sort((x, y) => score(x) - score(y) || (num(y.temperature) || 0) - (num(x.temperature) || 0))[0];
          const worst = ds.slice().sort((x, y) => score(y) - score(x))[0];
          m.say = this.t(score(best) < 20 ? '{day} looks best: dry, up to {temp}.' : '{day} looks best: up to {temp}.', { day: dayName(new Date(best.datetime), true), temp: round(num(best.temperature)) + '°' });
          if (worst !== best && score(worst) >= 60) m.say += ' ' + this.t('{day} brings the most rain.', { day: dayName(new Date(worst.datetime), true) });
        }
      }
      return m;
    }

    view(m) {
      if (m.na) return `<ha-card class="na"><div class="empty">${esc(m.text)}</div></ha-card>`;
      // Lucide icons when the Lucide icons integration is installed, else the cards' own drawn ones
      const lucide = !!(window.customIcons && window.customIcons.lucide);
      const svg = (ic, size) => (lucide
        ? `<ha-icon class="wi ${ic.cls}" icon="lucide:${ic.lu}" style="--mdc-icon-size:${size}px;width:${size}px;height:${size}px" aria-hidden="true"></ha-icon>`
        : `<svg class="wi ${ic.cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ic.d}"></path></svg>`);
      const seg = m.switcher ? `<span class="seg" role="group" aria-label="${esc(this.t('View'))}">${['hours', 'days'].map((v) => `<button type="button" data-act="view" data-arg="${v}" aria-pressed="${m.view === v}">${esc(this.t(v === 'hours' ? 'Hours' : 'Days'))}</button>`).join('')}</span>` : '';
      const top = `<div class="top"><button type="button" class="now tap" data-act="more" aria-label="${esc(m.temp + '°, ' + m.label)}"><span class="big">${esc(m.temp)}°</span><span class="cond"><b>${svg(m.icon, 20)}${esc(m.label)}</b>${m.feels ? `<span>${esc(m.feels)}</span>` : ''}</span></button>${seg}</div>`;
      let body = '';
      if (m.view === 'hours') {
        body = `${m.say ? `<p class="say">${esc(m.say)}</p>` : ''}${m.stats.length ? `<div class="stats" style="--n:${m.stats.length}">${m.stats.map((s) => `<span class="stat"><i>${esc(s.k)}</i><b>${esc(s.v)}</b></span>`).join('')}</div>` : ''}`
          + (m.empty ? `<div class="empty">${esc(m.empty)}</div>` : `<div class="strip scrollrow" role="list" aria-label="${esc(this.t('Next hours'))}">${m.strip.map((x) => `<span class="h${x.first ? ' first' : ''}${x.day ? ' day' : ''}" role="listitem"><small>${esc(x.t)}</small>${svg(x.icon, 22)}<b>${esc(x.temp)}°</b><span class="rb"><span style="height:${x.bar}px"></span></span></span>`).join('')}</div>`);
      } else {
        body = `${m.say ? `<p class="say">${esc(m.say)}</p>` : ''}<div class="days">${m.days.map((d) => `<div class="d${d.today ? ' today' : ''}"><span class="dn">${esc(d.name)}</span>${svg(d.icon, 24)}<span class="rn">${esc(d.rain)}</span><span class="lo">${esc(d.lo)}°</span><span class="bar"><span style="left:${d.left}%;width:${d.width}%"></span>${d.dot != null ? `<i style="left:${d.dot}%"></i>` : ''}</span><span class="hi">${esc(d.hi)}°</span></div>`).join('')}</div>`;
      }
      return `<ha-card>${top}${body}</ha-card>`;
    }

    act(a, arg) {
      if (a === 'view') {
        this._view = arg;
        try { localStorage.setItem('cranberry-weather-view:' + this._config.entity, arg); } catch (e) { /* no storage */ }
        this._last = ''; this._update();
      } else if (a === 'more') this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: this._config.entity }, bubbles: true, composed: true }));
    }
  }
  CranberryWeatherCard.defaults = { view: 'hours', switcher: true, hours: 24, days: 7 };

