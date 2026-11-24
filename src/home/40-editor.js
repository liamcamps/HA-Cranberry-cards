  // ---------- Visual editor ----------
  const SHOW_OPTS = [{ value: 'show', label: 'Show' }, { value: 'wide', label: 'Desktop only (side-by-side layout)' }, { value: 'hide', label: 'Hide' }];
  const SCHEMA = [
    { name: 'weather', required: true, selector: { entity: { domain: 'weather' } } },
    { name: 'weather_popup', selector: { text: {} } },
    { name: 'issues', selector: { entity: { multiple: true } } },
    { name: 'lights', selector: { entity: { multiple: true, domain: ['light', 'switch'] } } },
    { name: 'weather_now', selector: { entity: { domain: 'weather' } } },
    { name: 'warning', selector: { entity: { multiple: true, domain: ['binary_sensor', 'sensor'] } } },
    { name: 'warning_text', selector: { select: { mode: 'dropdown', options: [{ value: 'english', label: 'English: warning type and advice' }, { value: 'original', label: 'Original text from the source (KNMI is Dutch)' }] } } },
    { name: 'warning_detail', selector: { boolean: {} } },
    { name: 'rain_nowcast', selector: { entity: { domain: ['binary_sensor', 'sensor'] } } },
    { name: 'warning_from', selector: { select: { mode: 'dropdown', options: [{ value: 'yellow', label: 'Code yellow and up' }, { value: 'orange', label: 'Code orange and up' }, { value: 'red', label: 'Code red only' }] } } },
    {
      type: 'expandable', name: 'bins', flatten: true, title: 'Waste collection', icon: 'mdi:delete-outline',
      schema: [
        { name: 'waste', selector: { entity: { multiple: true, domain: 'sensor' } } },
        { name: 'waste_out', selector: { entity: { domain: 'input_boolean' } } },
        { name: 'waste_remind_from', selector: { time: {} } },
        { name: 'waste_collected_by', selector: { time: {} } }
      ]
    },
    {
      type: 'expandable', name: 'agenda', flatten: true, title: 'Coming up', icon: 'mdi:calendar-outline',
      schema: [
        { name: 'coming_up', selector: { select: { mode: 'dropdown', options: SHOW_OPTS } } },
        { name: 'calendars', selector: { entity: { multiple: true, domain: 'calendar' } } },
        { name: 'coming_up_count', selector: { number: { min: 1, max: 5, step: 1, mode: 'slider' } } },
        { name: 'calendar_popup', selector: { text: {} } }
      ]
    },
    {
      type: 'expandable', name: 'laundry', flatten: true, title: 'Washing machine', icon: 'mdi:washing-machine',
      schema: [
        { name: 'laundry_done', selector: { entity: {} } },
        { name: 'laundry_done_at', selector: { entity: { domain: ['sensor', 'input_datetime'] } } },
        { name: 'laundry_name', selector: { text: {} } }
      ]
    },
    {
      type: 'expandable', name: 'appearance', flatten: true, title: 'Appearance', icon: 'mdi:palette',
      schema: [
        { name: 'layout', selector: { select: { mode: 'dropdown', options: [
          { value: 'auto', label: 'Automatic (stacks when narrow)' },
          { value: 'wide', label: 'Side by side' },
          { value: 'stacked', label: 'Stacked' }
        ] } } },
        { name: 'weather_details', selector: { select: { mode: 'dropdown', options: SHOW_OPTS } } },
        { name: 'hourly_chart', selector: { select: { mode: 'dropdown', options: SHOW_OPTS } } },
        { name: 'hour_step', selector: { number: { min: 1, max: 3, step: 1, mode: 'slider' } } },
        { name: 'show_clock', selector: { boolean: {} } },
        { name: 'insight', selector: { boolean: {} } },
        { name: 'match_row', selector: { boolean: {} } },
        { name: 'home_text', selector: { text: {} } }
      ]
    }
  ];
  const LABELS = {
    weather: 'Weather',
    issues: 'Things to watch',
    lights: 'Lights',
    warning: 'Weather warning sensors',
    weather_now: 'Current conditions (optional)',
    warning_from: 'Show warnings from',
    warning_detail: 'Show the warning text on the card',
    warning_text: 'Warning language',
    rain_nowcast: 'Rain in the next two hours (optional)',
    layout: 'Layout',
    hour_step: 'Hours between points on the chart',
    weather_details: 'Weather details',
    hourly_chart: 'Hourly chart',
    coming_up: 'Show coming up',
    calendars: 'Calendars',
    coming_up_count: 'How many days to show',
    calendar_popup: 'Pop-up to open',
    weather_popup: 'Weather pop-up',
    show_clock: 'Show the clock',
    insight: 'Show the weather tip',
    match_row: 'As tall as the cards next to it',
    home_text: 'Fixed home sentence',
    laundry_done: 'Done sensor',
    laundry_done_at: 'Finished at',
    laundry_name: 'Name',
    waste: 'Waste sensors (Afvalwijzer)',
    waste_out: 'Bins out helper',
    waste_remind_from: 'Remind from (the evening before)',
    waste_collected_by: 'Collected by (on the day)'
  };
  const HELPERS = {
    issues: 'Doors, windows, locks or leak sensors. They show in red when open, unlocked or on.',
    lights: 'Lights, or switches that power a light. Used for the sentence “Lights on in …”, grouped by area.',
    warning: 'Optional. One or more: MeteoAlarm, or the warning sensors from KNMI / NL Weather. The highest level wins.',
    rain_nowcast: 'A sensor with a 5-minute rain forecast in its forecast attribute, such as NL Weather’s Precipitation forecasted. Shows rain to the minute.',
    weather_now: 'Optional. A second weather entity for the current temperature, such as the NL Weather observations. The forecast still comes from Weather.',
    home_text: 'Leave empty to write it automatically.',
    hourly_chart: 'The temperature (or rain) over the coming hours. Desktop only leaves it out on a phone, so the card becomes a short strip.',
    weather_details: 'High and low, rain chance, wind and sunrise or sunset, and a chart that uses the full height of the card. Desktop only leaves it out when the card stacks on a phone.',
    coming_up: 'The next events from your calendars under the clock, and the next bin collection. Desktop only leaves it out when the card stacks on a phone.',
    calendars: 'One or more calendars. Events from the coming week.',
    weather_popup: 'Optional. The Bubble pop-up hash, for example #weather, opened by tapping the weather. Leave empty to open the weather’s details instead.',
    calendar_popup: 'Optional. The Bubble pop-up hash, for example #calendar, opened by tapping Coming up. Leave empty to open the calendar’s details instead.',
    laundry_done: 'Shows a reminder while this is on or done.',
    laundry_done_at: 'Optional. A timestamp sensor or date-time helper. Without it, the card uses the moment the done sensor changed.',
    laundry_name: 'Defaults to “Washing machine”.',
    waste: 'Pick the Afvalwijzer sensors for each bin (gft, papier, pmd, restafval). Shows a reminder the evening before.',
    waste_out: 'Optional toggle helper. Tapping the reminder switches it on and hides it until the next collection.'
  };

  class CranberryHomeCardEditor extends HTMLElement {
    setConfig(config) {
      this._config = Object.assign({ show_clock: true, insight: true, layout: 'auto', hour_step: 2, match_row: true }, config);
      // list fields must be lists for the pickers to draw; older setups stored a single entity
      ['warning', 'lights', 'waste'].forEach((k) => {
        const v = this._config[k];
        if (typeof v === 'string' && v && v !== 'auto') this._config[k] = [v];
        else if (v === 'auto' || v === '') delete this._config[k];
      });
      // YAML may use { entity, name } items; the picker needs plain ids
      if ((this._config.issues || []).some((x) => typeof x !== 'string')) {
        const names = Object.assign({}, this._config.issue_names);
        this._config.issues = this._config.issues.map((x) => {
          if (typeof x === 'string') return x;
          if (x && x.name && x.entity) names[x.entity] = x.name;
          return x && x.entity;
        }).filter(Boolean);
        this._config.issue_names = names;
      }
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      if (this._form) this._form.hass = hass;
      else this._render();
    }

    _issueIds() {
      return (this._config.issues || []).map((x) => (typeof x === 'string' ? x : x && x.entity)).filter(Boolean);
    }

    async connectedCallback() {
      if (!customElements.get('ha-form') && window.loadCardHelpers) {
        try {
          const helpers = await window.loadCardHelpers();
          const card = await helpers.createCardElement({ type: 'entities', entities: [] });
          if (card && card.constructor && card.constructor.getConfigElement) await card.constructor.getConfigElement();
        } catch (e) { /* ha-form usually exists already */ }
      }
      this._render();
    }

    _render() {
      if (!this._hass || !this._config) return;
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.computeLabel = (s) => {
          if (s.name && s.name.indexOf('name__') === 0) {
            const id = s.name.slice(6), st = this._hass.states[id];
            return (st && st.attributes.friendly_name) || id;
          }
          return tr(this._hass, LABELS[s.name] || s.title || s.name);
        };
        this._form.computeHelper = (s) => { const x = s.name && s.name.indexOf('name__') === 0 ? 'Leave empty to use the entity name' : HELPERS[s.name]; return x && tr(this._hass, x); };
        this._form.addEventListener('value-changed', (ev) => {
          ev.stopPropagation();
          const config = Object.assign({}, ev.detail.value);
          const keep = (config.issues || []).map((x) => (typeof x === 'string' ? x : x && x.entity));
          const issueNames = {};
          Object.keys(config).forEach((k) => {
            if (k.indexOf('name__') === 0) {
              const id = k.slice(6);
              if (config[k] && keep.indexOf(id) >= 0) issueNames[id] = config[k];
              delete config[k];
            }
          });
          if (Object.keys(issueNames).length) config.issue_names = issueNames; else delete config.issue_names;
          Object.keys(config).forEach((k) => {
            if (config[k] === '' || (Array.isArray(config[k]) && !config[k].length)) delete config[k];
          });
          this._config = config;
          this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
          this._render();
        });
        this.appendChild(this._form);
      }
      const ids = this._issueIds();
      const names = this._config.issue_names || {};
      const schema = SCHEMA.slice();
      if (ids.length) {
        schema.splice(2, 0, {
          type: 'expandable', name: 'names', flatten: true, title: 'Names for things to watch', icon: 'mdi:rename-outline',
          schema: ids.map((id) => ({ name: 'name__' + id, selector: { text: {} } }))
        });
      }
      const data = Object.assign({}, this._config);
      ids.forEach((id) => { data['name__' + id] = names[id] || ''; });
      this._form.hass = this._hass;
      this._form.schema = trSchema(this._hass, schema);
      this._form.data = data;
    }
  }

  if (!customElements.get(TAG)) customElements.define(TAG, CranberryHomeCard);
  if (!customElements.get(EDITOR_TAG)) customElements.define(EDITOR_TAG, CranberryHomeCardEditor);

  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === TAG)) {
    window.customCards.push({
      type: TAG,
      name: 'Cranberry home card',
      description: 'Time, what needs your attention at home, and the weather in one cranberry card.',
      preview: true,
      documentationURL: ''
    });
  }
  console.info('%c CRANBERRY-HOME-CARD %c ' + VERSION + ' ', 'background:#591E21;color:#F2ECE0;font-weight:700', 'background:#E3DDCF;color:#591E21');
