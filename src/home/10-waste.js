  // ---------- Waste collection (Afvalwijzer), shared by the home card and the waste card ----------
  const WASTE_TYPES = [
    ['kerstbomen', 'Christmas trees', 'gft'], ['restafval', 'Residual', 'rest'], ['papier', 'Paper', 'paper'], ['paper', 'Paper', 'paper'],
    ['gft', 'Green (GFT)', 'gft'], ['groente', 'Green (GFT)', 'gft'], ['pmd', 'Plastic (PMD)', 'plastic'], ['plastic', 'Plastic', 'plastic'], ['pbd', 'Plastic (PBD)', 'plastic'],
    ['textiel', 'Textiles', 'rest'], ['glas', 'Glass', 'paper'], ['kca', 'Chemical waste', 'rest'], ['grofvuil', 'Bulky waste', 'rest'], ['rest', 'Residual', 'rest']
  ];
  const WASTE_SKIP = /_(today|tomorrow|day_after_tomorrow|next_[a-z_]+|notification[s]?|formatted)$/;
  const BIN_COLOURS = {
    light: { gft: '#5E7A34', paper: '#3F6585', plastic: '#C2702A', rest: '#4E5457' },
    dark: { gft: '#86A45A', paper: '#7FA3C2', plastic: '#E09A55', rest: '#9AA0A3' }
  };
  const SHORT = { 'Green (GFT)': 'green', 'Plastic (PMD)': 'plastic', 'Plastic (PBD)': 'plastic' };
  const parseHM = (v, d) => { const m = /^(\d{1,2}):(\d{2})/.exec(String(v || d)); return m ? Number(m[1]) * 60 + Number(m[2]) : 0; };
  const wasteState = (hass, cfg, nowDate) => {
    const now = nowDate || new Date();
    const dark = !!(hass.themes && hass.themes.darkMode);
    const C = BIN_COLOURS[dark ? 'dark' : 'light'];
    let ids = [].concat(cfg.waste || []).filter(Boolean);
    if (!ids.length || ids[0] === 'auto') {
      ids = Object.keys(hass.states).filter((id) => id.indexOf('sensor.afvalwijzer') === 0 && !WASTE_SKIP.test(id) && 'days_until_collection_date' in (hass.states[id].attributes || {}));
    }
    const names = cfg.waste_names || {};
    const today0 = new Date(now); today0.setHours(0, 0, 0, 0);
    const items = [];
    ids.forEach((id) => {
      const st = hass.states[id];
      if (!st) return;
      const d = new Date(st.state);
      if (isNaN(d)) return;
      const day0 = new Date(d); day0.setHours(0, 0, 0, 0);
      const days = Math.round((day0 - today0) / 86400000);
      if (days < 0) return;
      const low = id.toLowerCase();
      const type = WASTE_TYPES.find((t) => low.indexOf(t[0]) >= 0);
      const name = names[id] || (type ? type[1] : (st.attributes.friendly_name || id).replace(/^afvalwijzer\s*/i, ''));
      items.push({ id, name, colour: C[type ? type[2] : 'rest'], date: d, days });
    });
    items.sort((a, b) => a.date - b.date || a.name.localeCompare(b.name));
    const mins = now.getHours() * 60 + now.getMinutes();
    const remindFrom = parseHM(cfg.waste_remind_from, '16:00');
    const collectBy = parseHM(cfg.waste_collected_by, '07:30');
    const todayDue = mins < collectBy ? items.filter((x) => x.days === 0) : [];
    const tomorrowDue = mins >= remindFrom ? items.filter((x) => x.days === 1) : [];
    const due = todayDue.length ? todayDue : tomorrowDue;
    const when = todayDue.length ? 'today' : tomorrowDue.length ? 'tonight' : null;
    // "It's out" only counts if it was switched on since this reminder started
    let out = false;
    const helper = cfg.waste_out ? hass.states[cfg.waste_out] : null;
    if (helper && helper.state === 'on' && due.length) {
      const start = new Date(now); start.setHours(0, 0, 0, 0);
      if (when === 'today') start.setDate(start.getDate() - 1);
      start.setMinutes(remindFrom);
      out = Date.parse(helper.last_changed) >= start.getTime() - 4 * 3600000;
    }
    const label = (list) => {
      const n = list.map((x) => SHORT[x.name] || x.name.toLowerCase());
      const txt = n.length === 1 ? n[0] : n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1];
      return txt.charAt(0).toUpperCase() + txt.slice(1);
    };
    const r = { items, due, when, out, upcoming: items.filter((x) => !(x.days === 0 && mins >= collectBy)) };
    if (due.length) {
      const L = label(due);
      r.chip = when === 'today' ? L + (due.length > 1 ? ' are' : ' is') + ' collected today' : L + ' out tonight';
      r.colours = due.map((x) => x.colour);
    }
    return r;
  };
  window.CranberryWaste = { wasteState, label: null };


