  // ---------------------------------------------------------------- washing machine
  // Built for localthings (Samsung, local). Pick the progress sensor; the card finds the
  // other entities of the same machine by name. Done comes from your own helper.
  const WASH_STEP = {
    weightsensing: [0, 'Weighing'], laundrysensing: [0, 'Weighing'],
    prewash: ['pre', 'Pre-wash'],
    wash: [0, 'Wash'], steaming: [0, 'Steaming'], airwashing: [0, 'Air wash'], sanitizing: [0, 'Sanitizing'],
    rinse: [1, 'Rinse'], predrain: [2, 'Draining'], spin: [2, 'Spin'],
    drying: ['dry', 'Dry'], aidrying: ['dry', 'Dry'], dryingwithdooropen: ['dry', 'Venting'], cooling: ['dry', 'Cooling']
  };
  const PHASE_TEXT = { weightsensing: 'Weighing the laundry', laundrysensing: 'Weighing the laundry', prewash: 'Pre-wash', wash: 'Washing', steaming: 'Steaming', airwashing: 'Air washing', sanitizing: 'Sanitizing', rinse: 'Rinsing', predrain: 'Draining', spin: 'Spinning', drying: 'Drying', aidrying: 'Drying', dryingwithdooropen: 'Venting', cooling: 'Cooling down', finish: 'Finished' };
  const NO_ALARM = ['none', 'unknown', 'unavailable', '', '0', 'None'];

  class CranberryWasherCard extends CranberryBase {
    static get styles() {
      return `
      ha-card { padding: 10px; display: flex; flex-direction: column; gap: 8px; }
      ha-card.large { padding: 14px 14px 16px; gap: 14px; }
      ha-card.cran { background: var(--cc-c); color: var(--cc-on); }
      ha-card.brick { background: var(--cc-b); color: var(--cc-on); }
      ha-card.cran .state, ha-card.brick .state { color: color-mix(in srgb, currentColor 82%, transparent); }
      .row { display: flex; align-items: center; gap: 10px; min-height: 40px; }
      .ic { width: 40px; height: 40px; }
      .ic ha-icon { --mdc-icon-size: 22px; }
      .time { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; padding-right: 4px; }
      .time b { font-family: Fraunces, Georgia, serif; font-variation-settings: 'SOFT' 100; font-weight: 400; font-size: 28px; line-height: 1; letter-spacing: -0.02em; }
      .time span { font-size: 11px; font-weight: 600; color: var(--cc-muted); }
      .act { height: 40px; padding: 0 14px; border-radius: var(--cc-r-ctl, 12px); display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; flex-shrink: 0; background: var(--cc-o); color: var(--cc-on); }
      .act ha-icon { --mdc-icon-size: 16px; }
      ha-card.cran .act { background: var(--cc-on); color: var(--cc-c); }
      ha-card.brick .act { background: var(--cc-on); color: var(--cc-b); }
      .bar { position: relative; border-radius: 4px; overflow: hidden; background: color-mix(in srgb, currentColor 11%, transparent); height: 4px; }
      ha-card.large .bar { height: 8px; }
      .bar span { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 4px; background: var(--fill); transition: width .6s ease; }
      .steps { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
      .step { height: 26px; padding: 0 10px 0 8px; border-radius: var(--cc-r-chip, 8px); display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; background: var(--chip); color: var(--cc-muted); }
      .step.done { color: inherit; }
      .step.now { background: var(--nowbg); color: var(--nowfg); font-weight: 700; }
      .step ha-icon { --mdc-icon-size: 13px; }
      .pct { margin-left: auto; font-size: 12px; font-weight: 700; color: var(--cc-muted); }
      .meta { display: flex; flex-wrap: wrap; gap: 6px; }
      .meta span { height: 26px; padding: 0 10px; border-radius: var(--cc-r-chip, 8px); background: var(--chip); display: flex; align-items: center; font-size: 12px; font-weight: 600; }
      .tap { cursor: pointer; }
    `;
    }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    connectedCallback() { this._tick = setInterval(() => this._update(), 30000); }
    disconnectedCallback() { clearInterval(this._tick); }

    sib(domain, key) {
      const c = this._config;
      if (c[key]) return c[key];
      const base = String(c.entity).replace(/^sensor\./, '').replace(/_progress$/, '');
      return domain + '.' + base + '_' + key;
    }
    _lang() { return (this._hass.locale && this._hass.locale.language) || this._hass.language || 'en'; }
    hm(d) { try { return new Intl.DateTimeFormat(this._lang(), { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d); } catch (e) { return d.toTimeString().slice(0, 5); } }
    ago(min) {
      if (min < 1) return this.t('just now');
      if (min < 60) return this.t('{n} min ago', { n: min });
      const h = Math.floor(min / 60), m = min % 60;
      if (h < 24) return m && h < 6 ? this.t('{h} h {m} min ago', { h, m }) : this.t('{h} h ago', { h });
      return Math.floor(h / 24) === 1 ? this.t('yesterday') : this.t('{n} days ago', { n: Math.floor(h / 24) });
    }

    model() {
      const c = this._config, now = Date.now();
      const st = (d, k) => this.st(this.sib(d, k));
      const prog = this.st(c.entity);
      const machine = st('sensor', 'machine_state');
      const running = st('binary_sensor', 'running');
      const pctSt = st('sensor', 'progress_percent');
      const left = st('sensor', 'completion_time');
      const finish = st('sensor', 'estimated_finish');
      const finishBy = st('time', 'finish_by');
      const cycle = st('select', 'cycle');
      const temp = st('select', 'wash_temperature');
      const spin = st('select', 'spin_speed');
      const alarm = st('sensor', 'alarm_code');
      const remote = st('binary_sensor', 'smart_control');
      const prewashOn = (st('switch', 'pre_wash') || {}).state === 'on';
      const doneSt = c.done ? this.st(c.done) : null;
      const doneAtSt = c.done_at ? this.st(c.done_at) : null;
      const name = c.name || this.t('Washing machine');
      const program = cycle && ['unknown', 'unavailable'].indexOf(cycle.state) < 0 ? String(this.fmt(cycle)) : '';
      const meta = [];
      if (temp && !isNaN(parseFloat(temp.state))) meta.push(Math.round(parseFloat(temp.state)) + '°');
      if (spin && spin.state) meta.push(/^\d+$/.test(spin.state) ? spin.state + ' rpm' : String(this.fmt(spin)).replace(/_/g, ' '));
      if (prewashOn) meta.push(this.t('Pre-wash'));
      if ((st('switch', 'intensive') || {}).state === 'on') meta.push(this.t('Intensive'));
      if ((st('switch', 'bubble_soak') || {}).state === 'on') meta.push(this.t('Bubble soak'));

      const doneAt = () => {
        if (doneAtSt) {
          const raw = doneAtSt.entity_id.indexOf('input_datetime.') === 0 && doneAtSt.attributes.timestamp != null ? doneAtSt.attributes.timestamp * 1000 : String(doneAtSt.state).replace(' ', 'T');
          const d = new Date(raw); if (!isNaN(d)) return d;
        }
        return doneSt ? new Date(doneSt.last_changed) : null;
      };
      const m = { tone: 'neutral', icon: ccIcon('washer', 'mdi:washing-machine'), title: name, text: '', big: '', small: '', btn: null, pct: -1, steps: [], meta: [], na: false };

      if (this.isNa(prog)) return Object.assign(m, { text: this.t('Not responding'), na: true, quiet: true });

      const code = alarm ? String(alarm.state) : 'none';
      const phase = String(prog.state).toLowerCase();
      const mstate = machine ? machine.state : (running && running.state === 'on' ? 'active' : 'idle');
      const pct = pctSt && !isNaN(parseFloat(pctSt.state)) ? Math.max(0, Math.min(100, Math.round(parseFloat(pctSt.state)))) : null;

      if (NO_ALARM.indexOf(code) < 0) {
        return Object.assign(m, { tone: 'brick', icon: ccIcon('alert', 'mdi:alert-outline'), title: this.t('{name} stopped', { name }), text: this.t('Error {code}', { code }) + (program ? ' · ' + program : ''), btn: { act: 'more', label: this.t('Details'), icon: ccIcon('alert', 'mdi:alert-outline') }, meta: program ? [program] : [] });
      }

      if (doneSt && doneSt.state === 'on' && mstate !== 'active') {
        const at = doneAt();
        const mins = at ? Math.max(0, Math.round((now - at.getTime()) / 60000)) : 0;
        const late = mins >= (Number(c.alert_after) || 60);
        return Object.assign(m, {
          tone: late ? 'brick' : 'cran',
          title: this.t(late ? 'Washing is still in the drum' : 'Washing is done'),
          text: late ? this.t('Done {ago} · don’t let it sit', { ago: this.ago(mins) }) : this.t('{ago} · ready to empty', { ago: capitalise(this.ago(mins)) }),
          btn: { act: 'emptied', label: this.t('Emptied'), icon: ccIcon('check', 'mdi:check') },
          meta: [program].concat(meta.slice(0, 2)).filter(Boolean)
        });
      }

      const leftMin = left && !isNaN(parseFloat(left.state)) ? Math.round(parseFloat(left.state)) : null;
      const fin = finish && !isNaN(Date.parse(finish.state)) ? new Date(finish.state) : (leftMin != null ? new Date(now + leftMin * 60000) : null);
      const hmm = (n) => Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');

      if (phase === 'delaywash') {
        let ready = finish && !isNaN(Date.parse(finish.state)) ? this.hm(new Date(finish.state)) : (finishBy && /^\d\d:\d\d/.test(finishBy.state) ? finishBy.state.slice(0, 5) : null);
        if (!ready && leftMin != null) ready = this.hm(new Date(now + leftMin * 60000));
        return Object.assign(m, { tone: 'olive', title: program || name, text: this.t('Delayed start') + (ready ? ' · ' + this.t('ready at {time}', { time: ready }) : ''), big: ready || '', small: ready ? this.t('ready at') : '', meta });
      }

      if (mstate === 'active' || mstate === 'pause') {
        // steps: optional pre-wash, wash, rinse, spin, optional dry
        const hasDry = /dry/i.test(program) || ['drying', 'aidrying', 'dryingwithdooropen', 'cooling'].indexOf(phase) >= 0;
        const hasPre = prewashOn || phase === 'prewash';
        const labels = (hasPre ? ['Pre-wash'] : []).concat(['Wash', 'Rinse', 'Spin'], hasDry ? ['Dry'] : []);
        const off = hasPre ? 1 : 0;
        const ws = WASH_STEP[phase];
        let cur = -1, curLabel = null;
        if (ws) {
          cur = ws[0] === 'pre' ? 0 : ws[0] === 'dry' ? labels.length - 1 : ws[0] + off;
          curLabel = ws[1];
        } else if (phase === 'finish') cur = labels.length;
        m.steps = labels.map((l, i) => ({ label: this.t(i === cur && curLabel ? curLabel : l), s: i < cur ? 'done' : i === cur ? 'now' : '' }));
        m.pct = pct == null ? -1 : pct;
        m.meta = meta;
        m.title = program || name;
        const phaseText = PHASE_TEXT[phase] ? this.t(PHASE_TEXT[phase]) : capitalise(phase);
        if (mstate === 'pause') {
          m.text = (PHASE_TEXT[phase] ? this.t('Paused while {phase}', { phase: this.t(PHASE_TEXT[phase]).toLowerCase() }) : this.t('Paused')) + (pct != null ? ' · ' + pct + '%' : '');
          m.btn = remote && remote.state === 'on'
            ? { act: 'resume', label: this.t('Resume'), icon: ccIcon('play', 'mdi:play') }
            : null;
          if (!m.btn) m.text += ' · ' + this.t('press start on the machine');
          return m;
        }
        m.tone = 'olive';
        m.text = phaseText + (pct != null ? ' · ' + pct + '%' : '');
        if (leftMin != null) { m.big = hmm(leftMin); m.small = this.t('left') + (fin ? ' · ' + this.hm(fin) : ''); }
        return m;
      }

      // idle
      const at = doneAt();
      let last = '';
      if (at && now - at.getTime() < 7 * 86400000) {
        const sameDay = new Date(at).toDateString() === new Date(now).toDateString();
        last = ' · ' + this.t('last wash done {when}', { when: sameDay ? this.hm(at) : new Intl.DateTimeFormat(this._lang(), { weekday: 'long' }).format(at).toLowerCase() });
      }
      return Object.assign(m, { text: this.t('Idle') + last, quiet: true });
    }
    view(m) {
      const c = this._config;
      const large = c.size !== 'row';
      const tone = m.tone;
      const icBg = tone === 'cran' || tone === 'brick' ? alpha('--cc-on', 16) : tone === 'olive' ? 'var(--cc-o-t)' : 'var(--cc-q-t)';
      const icFg = tone === 'cran' || tone === 'brick' ? 'currentColor' : tone === 'olive' ? 'var(--cc-o)' : 'var(--cc-q)';
      const coloured = tone === 'cran' || tone === 'brick';
      const vars = [
        '--fill:' + (coloured ? 'currentColor' : tone === 'olive' ? 'var(--cc-o)' : 'var(--cc-q)'),
        '--chip:' + (coloured ? alpha('--cc-on', 12) : 'color-mix(in srgb, var(--cc-bgc) 70%, transparent)'),
        '--nowbg:' + (coloured ? 'var(--cc-on)' : tone === 'olive' ? 'var(--cv-fill-o)' : 'var(--cv-fill-q)'),
        '--nowfg:' + (tone === 'brick' ? 'var(--cc-b)' : tone === 'cran' ? 'var(--cc-c)' : 'var(--cc-on)')
      ].join(';');
      const showBar = m.pct >= 0;
      return `<ha-card class="${large ? 'large' : ''} ${tone === 'cran' ? 'cran' : tone === 'brick' ? 'brick' : ''} ${tone === 'olive' && m.pct >= 0 ? 'running' : ''} ${m.na ? 'na' : ''}" style="${vars}">
        <div class="row">
          <div class="ic" style="background:${icBg};color:${icFg}"><ha-icon icon="${m.icon}"></ha-icon></div>
          <div class="txt tap" role="button" tabindex="0" data-act="more"><span class="name">${esc(m.title)}</span><span class="state">${esc(m.text)}</span></div>
          ${m.big ? `<div class="time"><b>${esc(m.big)}</b><span>${esc(m.small)}</span></div>` : ''}
          ${m.btn ? `<button type="button" class="act" data-act="${m.btn.act}"><ha-icon icon="${m.btn.icon}"></ha-icon>${esc(m.btn.label)}</button>` : ''}
        </div>
        ${showBar ? `<div class="bar" role="progressbar" aria-valuenow="${m.pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${m.pct}%"></span></div>` : ''}
        ${large && m.steps.length ? `<div class="steps">${m.steps.map((x) => `<span class="step ${x.s}">${x.s === 'done' ? `<ha-icon icon="${ccIcon('check', 'mdi:check')}"></ha-icon>` : x.s === 'now' ? '<ha-icon icon="mdi:circle-medium"></ha-icon>' : ''}${esc(x.label)}</span>`).join('')}${m.pct >= 0 ? `<span class="pct">${m.pct}%</span>` : ''}</div>` : ''}
        ${large && m.meta.length ? `<div class="meta">${m.meta.map((x) => `<span>${esc(x)}</span>`).join('')}</div>` : ''}
      </ha-card>`;
    }
    act(a) {
      const c = this._config;
      if (a === 'more') return this.moreInfo(c.entity);
      if (a === 'emptied' && c.done) return this.call('homeassistant', 'turn_off', { entity_id: c.done });
      if (a === 'resume') return this.call('button', 'press', { entity_id: this.sib('button', 'start') });
    }
  }
  const capitalise = (x) => String(x || '').replace(/^./, (ch) => ch.toUpperCase());
  CranberryWasherCard.defaults = { size: 'large', alert_after: 60 };


