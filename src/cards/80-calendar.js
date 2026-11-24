  // ---------------------------------------------------------------- calendar
  // The coming days from one or more calendars, with the same date blocks as the home card:
  // one block per day, today in cranberry, days without plans folded into one line.
  const CAL_COLOURS = ['var(--cc-c)', 'var(--cc-o)', 'var(--cc-h)', 'var(--cc-ochre)', 'var(--cc-q)'];
  // the same colours, lifted so a small dot still shows on a dark card
  const CAL_DOTS = ['#B8565B', '#8C7F45', '#8FA1A6', '#C99A4A', '#A9AFB1'];
  class CranberryCalendarCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { padding: 12px 16px 8px; display: flex; flex-direction: column; }
      .title { font-size: 17px; font-weight: 700; padding: 4px 0 8px; }
      .top { display: flex; align-items: center; gap: 12px; min-height: 40px; padding: 0 0 10px; border-bottom: 1px solid var(--cc-rule); }
      .legend { flex: 1; min-width: 0; display: flex; flex-wrap: wrap; gap: 6px 16px; padding: 0 2px; }
      .seg { display: flex; gap: 2px; padding: 4px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-raise); flex-shrink: 0; margin-left: auto; }
      .seg button { height: 32px; padding: 0 14px; border-radius: var(--cc-r-chip, 8px); font-size: 13px; font-weight: 700; color: var(--cc-muted); }
      .seg button[aria-pressed="true"] { background: var(--cc-card); color: var(--cc-text); box-shadow: 0 1px 2px rgba(35, 28, 26, .12); }
      .week { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); margin: 0 -5px; padding: 10px 0 8px; }
      .col { min-width: 0; padding: 0 5px; display: flex; flex-direction: column; gap: 6px; min-height: 200px; }
      .col + .col { border-left: 1px solid var(--cc-rule); }
      .col .block { width: 100%; height: 56px; }
      .wev { width: 100%; box-sizing: border-box; border-radius: 10px; background: var(--tint); border-left: 3px solid var(--dot); padding: 7px 8px 8px; display: flex; flex-direction: column; gap: 1px; text-align: left; }
      .wev small { font-size: 11px; font-weight: 700; color: var(--cc-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .wev b { font-size: 13px; font-weight: 600; line-height: 1.25; overflow-wrap: anywhere; }
      .wev.now { box-shadow: inset 0 0 0 1.5px var(--cc-text); }
      .wev.now small { color: var(--cc-text); }
      .col .none { font-size: 12px; color: var(--cc-muted); padding: 6px 2px; }
      /* week on a time grid: hours down the side, events at their time, overlaps side by side */
      .tg { display: grid; grid-template-columns: 44px repeat(7, minmax(0, 1fr)); padding: 10px 0 8px; }
      .tg .hd { padding: 0 4px 8px; }
      .tg .hd .block { width: 100%; height: 56px; }
      .tg .ad { padding: 0 4px 6px; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
      .tg .adl { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--cc-muted); padding-top: 6px; }
      .tg .hd + .hd, .tg .ad + .ad, .tg .dc + .dc { border-left: 1px solid var(--cc-rule); }
      .hrs { position: relative; }
      .hrs span { position: absolute; right: 8px; transform: translateY(-50%); font-size: 11px; font-weight: 600; color: var(--cc-muted); font-variant-numeric: tabular-nums; }
      .dc { position: relative; background-image: repeating-linear-gradient(to bottom, var(--cc-rule) 0 1px, transparent 1px var(--hh)); border-top: 1px solid var(--cc-rule); }
      .te { position: absolute; z-index: 1; box-sizing: border-box; padding: 0 2px 2px; display: flex; }
      .te .wev { height: 100%; overflow: hidden; padding: 4px 6px; border-radius: 8px; }
      .te .wev small { font-size: 10px; }
      .te .wev b { font-size: 12px; line-height: 1.2; }
      .te .wev small { flex-shrink: 0; overflow: visible; text-overflow: clip; }
      .te.short .wev { padding: 2px 6px; gap: 0; }
      .te.short .wev small { font-size: 10px; line-height: 12px; }
      .te.short .wev b { font-size: 11px; line-height: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .te.tiny .wev { flex-direction: row; align-items: center; gap: 4px; padding: 0 6px; }
      .te.tiny .wev b { min-width: 0; }
      .te.split .wev { padding-left: 5px; padding-right: 4px; }
      .nowline { position: absolute; left: -1px; right: 0; height: 2px; background: var(--cc-c); z-index: 0; pointer-events: none; }
      .nowline::before { content: ''; position: absolute; left: -4px; top: -3px; width: 8px; height: 8px; border-radius: 4px; background: var(--cc-c); }
      .ad .wev { padding: 4px 6px; }
      .ad .wev b { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .foot { display: flex; justify-content: flex-end; padding: 10px 0 6px; }
      .add { height: 44px; padding: 0 18px 0 14px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-c); color: var(--cc-on); display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; }
      .add ha-icon { --mdc-icon-size: 18px; }
      .form { display: flex; flex-direction: column; gap: 14px; padding: 12px 0 6px; }
      .fhead { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .fhead b { font-size: 17px; }
      .x { width: 40px; height: 40px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-raise); display: flex; align-items: center; justify-content: center; }
      .x ha-icon { --mdc-icon-size: 20px; }
      .field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
      .field > span { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--cc-muted); }
      .in { height: 44px; box-sizing: border-box; width: 100%; padding: 0 14px; border: 0; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-raise); color: var(--cc-text); font: 500 15px Figtree, var(--ha-font-family-body, sans-serif); outline: none; color-scheme: light dark; }
      .in.big { height: 52px; font-size: 18px; font-weight: 600; }
      .in:focus { box-shadow: inset 0 0 0 2px var(--cc-c); }
      .in::placeholder { color: var(--cc-muted); }
      .row2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; align-items: end; }
      .chips { display: flex; flex-wrap: wrap; gap: 8px; }
      .chip { height: 40px; padding: 0 14px 0 12px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-raise); display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; }
      .chip[aria-pressed="true"] { background: color-mix(in srgb, var(--tint) 30%, transparent); box-shadow: inset 0 0 0 2px var(--dot); }
      .tog { height: 44px; padding: 0 14px; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-raise); display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; }
      .tog i { width: 36px; height: 22px; border-radius: 11px; background: color-mix(in srgb, var(--cc-text) 22%, transparent); position: relative; transition: background .2s ease; }
      .tog i::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 8px; background: var(--cc-card); transition: transform .2s ease; }
      .tog[aria-pressed="true"] i { background: var(--cc-c); }
      .tog[aria-pressed="true"] i::after { transform: translateX(14px); background: var(--cc-on); }
      .err { font-size: 14px; font-weight: 600; color: var(--cc-b); }
      .detail { display: flex; flex-direction: column; gap: 10px; padding: 12px 0 10px; }
      .dtitle { font-size: 24px; font-weight: 700; line-height: 1.25; padding-top: 4px; }
      .dstatus { align-self: flex-start; height: 28px; padding: 0 10px; border-radius: var(--cc-r-chip, 8px); background: var(--cc-c); color: var(--cc-on); display: flex; align-items: center; font-size: 13px; font-weight: 700; }
      .drow { display: flex; align-items: center; gap: 12px; min-height: 32px; font-size: 16px; font-weight: 500; text-align: left; }
      .drow ha-icon { --mdc-icon-size: 20px; color: var(--cc-muted); width: 20px; flex-shrink: 0; }
      .drow .dot { width: 10px; height: 10px; border-radius: 5px; margin: 0 5px; }
      .dcal { align-self: flex-start; color: var(--cc-muted); }
      .ddesc { margin-top: 6px; padding-top: 14px; border-top: 1px solid var(--cc-rule); font-size: 15px; line-height: 1.5; white-space: pre-wrap; overflow-wrap: anywhere; }
      .btns { display: flex; justify-content: flex-end; gap: 8px; padding-top: 4px; }
      .btn { height: 44px; padding: 0 18px; border-radius: var(--cc-r-ctl, 12px); font-size: 14px; font-weight: 700; background: var(--cc-raise); }
      .btn.go { background: var(--cc-c); color: var(--cc-on); }
      .btn[disabled] { opacity: .5; cursor: default; }
      .legend span { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--cc-muted); }
      .dot { width: 8px; height: 8px; border-radius: 4px; flex-shrink: 0; background: var(--dot); }
      .day { display: flex; gap: 14px; align-items: flex-start; padding: 12px 0; }
      .day + .day { border-top: 1px solid var(--cc-rule); }
      .block { width: 48px; height: 52px; flex-shrink: 0; border-radius: var(--cc-r-ctl, 12px); background: var(--cc-raise); display: flex; flex-direction: column; align-items: center; justify-content: center; }
      .block small { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--cc-muted); line-height: 12px; }
      .block b { font-family: Fraunces, Georgia, serif; font-variation-settings: 'SOFT' 100; font-weight: 400; letter-spacing: -0.03em; font-size: 26px; line-height: 28px; }
      .today .block { background: var(--cc-c); color: var(--cc-on); }
      .today .block small { color: color-mix(in srgb, var(--cc-on) 75%, var(--cc-c)); }
      .evs { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; padding-top: 4px; }
      .ev { display: flex; align-items: baseline; gap: 12px; min-height: 26px; text-align: left; width: 100%; }
      .when { width: 132px; flex-shrink: 0; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--cc-muted); white-space: nowrap; }
      .when .dot { align-self: center; }
      .ev.now .when { color: var(--cc-text); font-weight: 700; }
      .what { flex: 1; min-width: 0; font-size: 16px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .what small { font-size: 16px; color: var(--cc-muted); }
      .free { display: flex; align-items: center; gap: 14px; padding: 10px 0; font-size: 14px; color: var(--cc-muted); }
      .free b { width: 48px; flex-shrink: 0; text-align: center; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; white-space: nowrap; }
      .free.range b { width: auto; min-width: 48px; }
      .empty { padding: 16px 2px; font-size: 15px; color: var(--cc-muted); }
      ha-card { --cc-rule: color-mix(in srgb, var(--cc-text) 12%, transparent); --cc-raise: color-mix(in srgb, var(--cc-text) 7%, transparent); }
      @media (max-width: 480px) { .when { width: 104px; } }
    `;
    }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    connectedCallback() {
      this._tick = setInterval(() => this._refresh(), 60000); this._refresh();
      if (!this._typing) {
        this._typing = true;
        this.shadowRoot.addEventListener('input', () => this._read());
        this.shadowRoot.addEventListener('change', () => this._read());
      }
      // the week needs room: narrower than this, the card shows the agenda
      if (window.ResizeObserver && !this._ro) {
        this._ro = new ResizeObserver((en) => { const w = Math.round(en[0].contentRect.width); if (Math.abs(w - (this._w || 0)) > 8) { this._w = w; this._last = ''; this._update(); } });
      }
      if (this._ro) this._ro.observe(this);
    }
    disconnectedCallback() { clearInterval(this._tick); if (this._ro) this._ro.disconnect(); this._view = null; this._form = null; this._detail = null; }
    setConfig(config) { super.setConfig(config); this._at = 0; this._events = null; this._refresh(); }
    set hass(h) { const first = !this._hass; this._hass = h; if (first) this._refresh(); this._update(); }
    // calendars: "calendar.family" or { entity: calendar.liam, people: [person.liam] }
    _cals() {
      return [].concat(this._config.calendars || []).map((x) => (typeof x === 'string' ? { id: x, people: [] } : x && x.entity ? { id: x.entity, people: [].concat(x.people || []) } : null)).filter(Boolean);
    }
    // the people the logged-in user is: person entities linked to this user
    _mine() {
      const h = this._hass, me = h && h.user && h.user.id;
      if (!me) return null;
      return Object.keys(h.states).filter((k) => k.indexOf('person.') === 0 && h.states[k].attributes && h.states[k].attributes.user_id === me);
    }
    _shown(cal) {
      if (!cal.people.length) return true;
      const mine = this._mine();
      return !!mine && cal.people.some((p) => mine.indexOf(p) >= 0);
    }
    _ids() { return this._cals().filter((c) => this._shown(c)).map((c) => c.id); }
    _writable() {
      // calendars that accept new events (supported_features & 1)
      return this._ids().filter((id) => { const st = this.st(id); return st && (Number(st.attributes.supported_features) & 1); });
    }
    _refresh() {
      // the clock moves every minute; the calendars are asked again every 10 minutes
      if (!this._hass || !this._config) return;
      this._read();
      if (Date.now() - (this._at || 0) > 10 * 60000) this._fetch();
      this._last = ''; this._update();
    }
    async _fetch() {
      const h = this._hass, ids = this._ids();
      if (!h || !h.callApi || !ids.length || this._busy) return;
      this._busy = true; this._at = Date.now();
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const end = new Date(start.getTime() + (this._days() + 1) * 86400000);
      const out = [];
      await Promise.all(ids.map(async (id) => {
        try {
          const evs = await h.callApi('GET', 'calendars/' + id + '?start=' + encodeURIComponent(start.toISOString()) + '&end=' + encodeURIComponent(end.toISOString()));
          (evs || []).forEach((e) => out.push(Object.assign({ cal: id }, e)));
        } catch (e) { /* a calendar that fails is left out */ }
      }));
      this._events = out; this._busy = false;
      this._last = ''; this._update();
    }
    _days() { return Math.max(7, Math.min(31, Number(this._config.days) || 14)); }
    _lang() { return (this._hass && this._hass.locale && this._hass.locale.language) || (this._hass && this._hass.language) || 'en'; }
    _time(d) {
      const f = this._hass && this._hass.locale && this._hass.locale.time_format;
      const h12 = f === '12' ? true : f === '24' ? false : undefined;
      return new Intl.DateTimeFormat(this._lang(), { hour: '2-digit', minute: '2-digit', hour12: h12 }).format(d);
    }
    model() {
      const c = this._config, ids = this._ids(), now = new Date(), DAY = 86400000;
      const day0 = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); };
      const today = day0(now), n = this._days();
      const colour = {}; this._cals().forEach((cal, i) => { colour[cal.id] = i % CAL_DOTS.length; });
      const parse = (v) => {
        if (!v) return null;
        if (typeof v === 'object') return v.dateTime ? { d: new Date(v.dateTime), all: false } : (v.date ? { d: new Date(v.date + 'T00:00:00'), all: true } : null);
        return /^\d{4}-\d{2}-\d{2}$/.test(v) ? { d: new Date(v + 'T00:00:00'), all: true } : { d: new Date(v), all: false };
      };
      const wd = (t) => new Intl.DateTimeFormat(this._lang(), { weekday: 'short' }).format(new Date(t)).replace(/\.$/, '');
      const days = {};
      for (let i = 0, d = today; i < n; i++, d = day0(d + DAY * 1.5)) days[d] = [];
      (this._events || []).forEach((e, ix) => {
        const s = parse(e.start), en = parse(e.end);
        if (!s || isNaN(s.d)) return;
        let endT = en && !isNaN(en.d) ? en.d.getTime() : s.d.getTime() + (s.all ? DAY : 3600000);
        if (endT <= s.d.getTime()) endT = s.d.getTime() + (s.all ? DAY : 60000);
        if (endT <= now.getTime()) return;
        const first = day0(s.d), last = day0(endT - 1), span = Math.round((last - first) / DAY) + 1;
        for (let d = Math.max(first, today), k = Math.round((Math.max(first, today) - first) / DAY) + 1; d <= last; d = day0(d + DAY * 1.5), k++) {
          if (!days[d]) continue;
          let when, rank;
          const ongoing = d === today && s.d <= now && endT > now.getTime();
          if (s.all) { when = span > 1 ? 'All day · ' + k + ' of ' + span : 'All day'; rank = 0; }
          else if (span === 1) { when = ongoing ? 'Now, until ' + this._time(new Date(endT)) : this._time(s.d); rank = 1; }
          else if (d === first) { when = ongoing ? 'Now' : this._time(s.d) + ' →'; rank = 1; }
          else if (d === last) { when = ongoing ? 'Now, until ' + this._time(new Date(endT)) : 'Until ' + this._time(new Date(endT)); rank = 0; }
          else { when = ongoing ? 'Now' : 'All day'; rank = 0; }
          // the week view has less room: just the time, "Now", or where it starts and ends
          const short = s.all ? 'All day' : span === 1 ? this._time(s.d) : d === first ? this._time(s.d) + ' →' : d === last ? 'Until ' + this._time(new Date(endT)) : 'All day';
          const ci = colour[e.cal] || 0;
          // where it sits on the day, in minutes; a piece that fills the whole day goes in the all-day row
          const sMin = s.all ? 0 : d === first ? Math.round((s.d.getTime() - d) / 60000) : 0;
          const eMin = s.all ? 1440 : d === last ? Math.round((endT - d) / 60000) : 1440;
          days[d].push({ t: d === first ? s.d.getTime() : d, rank, when, short, now: ongoing && !s.all, what: e.summary || e.message || 'Busy', loc: e.location || '', id: e.cal, dot: CAL_DOTS[ci], tint: CAL_COLOURS[ci], ix, all: s.all || (sMin <= 0 && eMin >= 1440), sMin: Math.max(0, sMin), eMin: Math.min(1440, eMin), fromPrev: !s.all && d !== first, toNext: !s.all && d !== last });
        }
      });
      const keys = Object.keys(days).map(Number).sort((a, b) => a - b);
      keys.forEach((d) => days[d].sort((a, b) => a.rank - b.rank || a.t - b.t));
      // which view: the switch, else the start view; the week needs at least 560px
      const canWeek = !this._w || this._w >= 560;
      const want = this._view || (c.view === 'week' ? 'week' : 'agenda');
      const view = want === 'week' && canWeek ? 'week' : 'agenda';
      const week = view === 'week' ? keys.slice(0, 7).map((d) => ({ d, today: d === today, wd: wd(d), n: new Date(d).getDate(), evs: days[d] })) : [];
      let grid = null;
      if (view === 'week' && c.week_layout !== 'list') {
        const timed = [].concat(...week.map((r) => r.evs.filter((e) => !e.all)));
        // from 07:00 to 22:00, wider when something starts earlier or ends later; a piece that only
        // continues from yesterday or into tomorrow runs to the edge instead of stretching the grid
        const from = Math.max(0, Math.min(7, ...timed.filter((e) => !e.fromPrev).map((e) => Math.floor(e.sMin / 60))));
        const to = Math.min(24, Math.max(22, ...timed.filter((e) => !e.toNext).map((e) => Math.ceil(e.eMin / 60)), ...timed.map((e) => Math.ceil(e.sMin / 60) + (e.sMin % 60 ? 0 : 1))));
        const cols = week.map((r) => {
          const evs = r.evs.filter((e) => !e.all).map((e) => {
            const sMin = Math.max(from * 60, Math.min(e.sMin, to * 60 - 20)), eMin = Math.min(to * 60, e.eMin);
            return Object.assign({}, e, { sMin, eMin: Math.max(eMin, sMin + 20) });
          }).sort((a, b) => a.sMin - b.sMin || b.eMin - a.eMin);
          // group events that overlap, then give each a lane within its group
          let group = [], groupEnd = -1;
          const done = (g) => { const lanes = []; g.forEach((e) => { let i = lanes.findIndex((end) => end <= e.sMin); if (i < 0) { i = lanes.length; lanes.push(0); } lanes[i] = e.eMin; e.lane = i; }); g.forEach((e) => { e.lanes = lanes.length; }); };
          evs.forEach((e) => { if (e.sMin >= groupEnd && group.length) { done(group); group = []; } group.push(e); groupEnd = Math.max(groupEnd, e.eMin); });
          if (group.length) done(group);
          const nowMin = r.today ? (now.getHours() * 60 + now.getMinutes()) : null;
          return { allDay: r.evs.filter((e) => e.all), timed: evs, now: nowMin != null && nowMin >= from * 60 && nowMin <= to * 60 ? nowMin : null };
        });
        grid = { from, to, cols, hasAllDay: cols.some((x) => x.allDay.length) };
      }
      // a day per block; runs of free days fold into one line
      const rows = [];
      const fold = c.show_empty !== 'hide';
      Object.keys(days).map(Number).sort((a, b) => a - b).forEach((d) => {
        const evs = days[d];
        if (evs.length) { rows.push({ d, today: d === today, wd: wd(d), n: new Date(d).getDate(), evs }); return; }
        if (!fold) return;
        const prev = rows[rows.length - 1], label = wd(d) + ' ' + new Date(d).getDate();
        if (prev && prev.free && Math.round((d - prev.last) / DAY) === 1) { prev.to = label; prev.last = d; }
        else rows.push({ free: true, from: label, to: '', d, last: d });
      });
      while (rows.length && rows[rows.length - 1].free) rows.pop();
      const legend = ids.length > 1 ? ids.map((id) => ({ name: this.nm(id), dot: CAL_DOTS[colour[id]] })) : [];
      const writable = c.add_events === false ? [] : this._writable();
      let form = null;
      if (this._form && writable.length) {
        const f = this._form;
        if (writable.indexOf(f.cal) < 0) f.cal = writable[0];
        form = Object.assign({}, f, { cals: writable.map((id) => ({ id, name: this.nm(id), dot: CAL_DOTS[colour[id]], tint: CAL_COLOURS[colour[id]], on: id === f.cal })) });
      }
      let detail = null;
      if (this._detail) {
        const e = this._detail, s = parse(e.start), en = parse(e.end);
        if (s && !isNaN(s.d)) {
          let endT = en && !isNaN(en.d) ? en.d.getTime() : s.d.getTime() + (s.all ? DAY : 3600000);
          const lastDay = new Date(s.all ? endT - DAY : endT);
          const dayF = (dt, o) => new Intl.DateTimeFormat(this._lang(), Object.assign({ weekday: 'long', day: 'numeric', month: 'long' }, o || {})).format(dt);
          const sameDay = day0(s.d) === day0(s.all ? lastDay : endT - 1);
          let when;
          if (s.all) when = sameDay ? dayF(s.d) + ' · All day' : dayF(s.d, { weekday: 'short' }) + ' – ' + dayF(lastDay, { weekday: 'short' }) + ' · All day';
          else if (sameDay) when = dayF(s.d) + ' · ' + this._time(s.d) + ' – ' + this._time(new Date(endT));
          else when = dayF(s.d, { weekday: 'short' }) + ', ' + this._time(s.d) + ' – ' + dayF(new Date(endT), { weekday: 'short' }) + ', ' + this._time(new Date(endT));
          const nowT = now.getTime(), ci = colour[e.cal] || 0;
          const status = s.d.getTime() <= nowT && endT > nowT ? 'Happening now' : endT <= nowT ? 'Over' : '';
          // descriptions can carry a little HTML (Google); show it as plain text with its line breaks
          const desc = String(e.description || '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\n{3,}/g, '\n\n').trim();
          detail = { what: e.summary || e.message || 'Busy', when, status, loc: e.location || '', desc, cal: e.cal, calName: this.nm(e.cal), dot: CAL_DOTS[ci] };
        }
      }
      return { title: c.title || '', legend, rows, week, grid, view, form, detail, canAdd: writable.length > 0, seg: c.switcher !== false && canWeek, loading: this._events == null && ids.length > 0, none: !ids.length };
    }
    view(m) {
      const ev = (e) => `<button type="button" class="ev${e.now ? ' now' : ''}" data-act="open" data-arg="${e.ix}"><span class="when"><span class="dot" style="--dot:${e.dot}"></span>${esc(e.when)}</span><span class="what">${esc(e.what)}${e.loc ? ` <small>· ${esc(e.loc)}</small>` : ''}</span></button>`;
      const wev = (e) => `<button type="button" class="wev${e.now ? ' now' : ''}" style="--dot:${e.dot};--tint:color-mix(in srgb, ${e.tint} 24%, var(--cc-card))" data-act="open" data-arg="${e.ix}" aria-label="${esc(e.what + ', ' + e.when)}"><small>${esc(e.short)}</small><b>${esc(e.what)}</b></button>`;
      const block = (r) => `<span class="block"><small>${esc(r.wd)}</small><b>${r.n}</b></span>`;
      const body = m.none ? '<div class="empty">Pick one or more calendars in the editor.</div>'
        : m.loading ? '<div class="empty">Loading…</div>'
        : m.view === 'week' && m.grid ? this._gridView(m)
        : m.view === 'week' ? `<div class="week">${m.week.map((r) => `<div class="col${r.today ? ' today' : ''}">${block(r)}${r.evs.length ? r.evs.map(wev).join('') : '<span class="none">Free</span>'}</div>`).join('')}</div>`
        : !m.rows.length ? `<div class="empty">Nothing planned in the coming ${this._days()} days.</div>`
        : m.rows.map((r) => r.free
          ? `<div class="day free${r.to ? ' range' : ''}"><b>${esc(r.from)}${r.to ? ' – ' + esc(r.to) : ''}</b>Nothing planned</div>`
          : `<div class="day${r.today ? ' today' : ''}">${block(r)}<div class="evs">${r.evs.map(ev).join('')}</div></div>`).join('');
      const seg = m.seg ? `<span class="seg" role="group" aria-label="View">${['agenda', 'week'].map((v) => `<button type="button" data-act="view" data-arg="${v}" aria-pressed="${m.view === v}">${v === 'agenda' ? 'Agenda' : 'Week'}</button>`).join('')}</span>` : '';
      const legend = m.legend.length ? `<div class="legend">${m.legend.map((l) => `<span><span class="dot" style="--dot:${l.dot}"></span>${esc(l.name)}</span>`).join('')}</div>` : '';
      if (m.form) return `<ha-card>${this._formView(m.form)}</ha-card>`;
      if (m.detail) return `<ha-card>${this._detailView(m.detail)}</ha-card>`;
      return `<ha-card>
        ${m.title ? `<div class="title">${esc(m.title)}</div>` : ''}
        ${legend || seg ? `<div class="top">${legend}${seg}</div>` : ''}
        ${body}
        ${m.canAdd && !m.none && !m.loading ? `<div class="foot"><button type="button" class="add" data-act="new"><ha-icon icon="${ccIcon('plus', 'mdi:plus')}"></ha-icon>New event</button></div>` : ''}
      </ha-card>`;
    }
    _gridView(m) {
      const g = m.grid, HH = 40, px = (min) => ((min - g.from * 60) / 60) * HH;
      const hours = []; for (let h = g.from + 1; h < g.to; h++) hours.push(h);
      const lbl = (h) => this._time(new Date(2000, 0, 1, h, 0));
      const wev = (e) => `<button type="button" class="wev${e.now ? ' now' : ''}" style="--dot:${e.dot};--tint:color-mix(in srgb, ${e.tint} 24%, var(--cc-card))" data-act="open" data-arg="${e.ix}" aria-label="${esc(e.what + ', ' + e.when)}"><small>${esc(e.short)}</small><b>${esc(e.what)}</b></button>`;
      const head = m.week.map((r) => `<div class="hd${r.today ? ' today' : ''}"><span class="block"><small>${esc(r.wd)}</small><b>${r.n}</b></span></div>`).join('');
      const allDay = g.hasAllDay ? `<div class="adl">All day</div>${g.cols.map((x) => `<div class="ad">${x.allDay.map(wev).join('')}</div>`).join('')}` : '';
      const cols = g.cols.map((x) => `<div class="dc" style="height:${(g.to - g.from) * HH}px">${x.timed.map((e) => {
        const top = px(e.sMin), h = Math.max(22, px(e.eMin) - top), w = 100 / e.lanes;
        return `<div class="te${h < 44 ? ' short' : ''}${h < 28 ? ' tiny' : ''}${e.lanes > 1 ? ' split' : ''}" title="${esc(e.short + ' · ' + e.what)}" style="top:${top.toFixed(1)}px;height:${h.toFixed(1)}px;left:${(e.lane * w).toFixed(3)}%;width:${w.toFixed(3)}%">${wev(e)}</div>`;
      }).join('')}${x.now != null ? `<span class="nowline" style="top:${px(x.now).toFixed(1)}px"></span>` : ''}</div>`).join('');
      return `<div class="tg" style="--hh:${HH}px">
        <div></div>${head}
        ${allDay}
        <div class="hrs">${hours.map((h) => `<span style="top:${px(h * 60)}px">${esc(lbl(h))}</span>`).join('')}</div>${cols}
      </div>`;
    }
    _detailView(d) {
      return `<div class="detail">
        <div class="fhead"><button type="button" class="x" data-act="back" aria-label="Back"><ha-icon icon="${ccIcon('chevron-left', 'mdi:chevron-left')}"></ha-icon></button></div>
        <div class="dtitle">${esc(d.what)}</div>
        ${d.status ? `<div class="dstatus">${esc(d.status)}</div>` : ''}
        <div class="drow"><ha-icon icon="${ccIcon('clock', 'mdi:clock-outline')}"></ha-icon><span>${esc(d.when)}</span></div>
        ${d.loc ? `<div class="drow"><ha-icon icon="${ccIcon('pin', 'mdi:map-marker-outline')}"></ha-icon><span>${esc(d.loc)}</span></div>` : ''}
        <button type="button" class="drow dcal" data-act="cal" data-arg="${esc(d.cal)}"><span class="dot" style="--dot:${d.dot}"></span><span>${esc(d.calName)}</span></button>
        ${d.desc ? `<div class="ddesc">${esc(d.desc)}</div>` : ''}
      </div>`;
    }
    _formView(f) {
      const v = (k) => esc(f[k] == null ? '' : f[k]);
      return `<div class="form" role="form" aria-label="New event">
        <div class="fhead"><b>New event</b><button type="button" class="x" data-act="fcancel" aria-label="Close"><ha-icon icon="${ccIcon('x', 'mdi:close')}"></ha-icon></button></div>
        <label class="field"><span>What</span><input class="in big" data-field="title" value="${v('title')}" placeholder="Dinner with Anna" autocomplete="off"></label>
        ${f.cals.length > 1 ? `<div class="field"><span>Calendar</span><div class="chips">${f.cals.map((c) => `<button type="button" class="chip" data-act="fcal" data-arg="${esc(c.id)}" aria-pressed="${c.on}" style="--dot:${c.dot};--tint:${c.tint}"><span class="dot" style="--dot:${c.dot}"></span>${esc(c.name)}</button>`).join('')}</div></div>` : ''}
        <div class="row2">
          <label class="field"><span>Day</span><input class="in" type="date" data-field="date" value="${v('date')}"></label>
          <button type="button" class="tog" data-act="fallday" aria-pressed="${!!f.allDay}"><i></i>All day</button>
        </div>
        ${f.allDay ? '' : `<div class="row2">
          <label class="field"><span>From</span><input class="in" type="time" data-field="start" value="${v('start')}"></label>
          <label class="field"><span>Until</span><input class="in" type="time" data-field="end" value="${v('end')}"></label>
        </div>`}
        <label class="field"><span>Where</span><input class="in" data-field="loc" value="${v('loc')}" placeholder="Optional" autocomplete="off"></label>
        ${f.err ? `<div class="err" role="alert">${esc(f.err)}</div>` : ''}
        <div class="btns"><button type="button" class="btn" data-act="fcancel">Cancel</button><button type="button" class="btn go" data-act="fsave" ${f.busy ? 'disabled' : ''}>${f.busy ? 'Adding…' : 'Add'}</button></div>
      </div>`;
    }
    act(a, arg) {
      if (a === 'open' && arg != null) {
        const e = (this._events || [])[Number(arg)];
        if (e) { this._detail = Object.assign({}, e); this._redraw(); }
      }
      if (a === 'back') { this._detail = null; this._redraw(); }
      if (a === 'cal' && arg) this.moreInfo(arg);
      if (a === 'view') { this._view = arg; this._last = ''; this._update(); }
      if (a === 'new') {
        const pad = (x) => String(x).padStart(2, '0'), d = new Date();
        const h = Math.min(22, d.getHours() + 1);
        this._form = { title: '', cal: this._writable()[0], date: d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()), allDay: false, start: pad(h) + ':00', end: pad(h + 1) + ':00', loc: '', err: '' };
        this._redraw();
        const t = this.shadowRoot.querySelector('[data-field="title"]'); if (t) t.focus();
      }
      if (!this._form) return;
      if (a === 'fcancel') { this._form = null; this._redraw(); }
      if (a === 'fcal') { this._form.cal = arg; this._redraw(); }
      if (a === 'fallday') { this._form.allDay = !this._form.allDay; this._redraw(); }
      if (a === 'fsave') this._save();
    }
    _redraw() { this._last = ''; this._update(); }
    async _save() {
      const f = this._form;
      this._read();
      const title = (f.title || '').trim();
      f.err = !title ? 'Give it a name.' : !/^\d{4}-\d{2}-\d{2}$/.test(f.date || '') ? 'Pick a day.' : !f.allDay && !(/^\d{2}:\d{2}/.test(f.start || '') && /^\d{2}:\d{2}/.test(f.end || '')) ? 'Pick a start and end time.' : '';
      if (f.err) { this._redraw(); return; }
      const ymd = (dt) => dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
      const day = new Date(f.date + 'T00:00:00');
      const data = { entity_id: f.cal, summary: title };
      if (f.allDay) {
        // the end of an all-day event is the day after
        data.start_date = f.date; data.end_date = ymd(new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1));
      } else {
        // an end before the start runs past midnight
        const endDay = f.end.slice(0, 5) <= f.start.slice(0, 5) ? ymd(new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)) : f.date;
        data.start_date_time = f.date + ' ' + f.start.slice(0, 5) + ':00'; data.end_date_time = endDay + ' ' + f.end.slice(0, 5) + ':00';
      }
      if ((f.loc || '').trim()) data.location = f.loc.trim();
      f.busy = true; this._redraw();
      try {
        await this.call('calendar', 'create_event', data);
        this._form = null; this._at = 0; this._fetch(); this._redraw();
      } catch (e) {
        f.busy = false; f.err = 'Could not add it: ' + ((e && e.message) || 'the calendar said no') + '.'; this._redraw();
      }
    }
    // keep what was typed, so a redraw (every minute) never loses it
    _read() {
      if (!this._form) return;
      this.shadowRoot.querySelectorAll('[data-field]').forEach((el) => { this._form[el.getAttribute('data-field')] = el.value; });
    }
  }
  CranberryCalendarCard.needsEntity = false;
  CranberryCalendarCard.defaults = { days: 14, show_empty: 'fold', view: 'agenda', switcher: true, add_events: true, week_layout: 'time' };

