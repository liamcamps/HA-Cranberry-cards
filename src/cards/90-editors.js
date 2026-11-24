  // ---------------------------------------------------------------- editors
  const makeEditor = (schema, labels, helpers, io) => class extends HTMLElement {
    setConfig(config) { this._config = io ? io.toForm(config) : Object.assign({}, config); this._render(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; else this._render(); }
    async connectedCallback() {
      if (!customElements.get('ha-form') && window.loadCardHelpers) {
        try {
          const helpersApi = await window.loadCardHelpers();
          const card = await helpersApi.createCardElement({ type: 'entities', entities: [] });
          if (card && card.constructor && card.constructor.getConfigElement) await card.constructor.getConfigElement();
        } catch (e) { /* ignore */ }
      }
      this._render();
    }
    _render() {
      if (!this._hass || !this._config) return;
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.computeLabel = (s) => labels[s.name] || s.title || s.name;
        this._form.computeHelper = (s) => helpers[s.name];
        this._form.addEventListener('value-changed', (ev) => {
          ev.stopPropagation();
          const form = Object.assign({}, ev.detail.value);
          Object.keys(form).forEach((k) => { if (form[k] === '' || form[k] == null || (Array.isArray(form[k]) && !form[k].length)) delete form[k]; });
          this._config = form;
          const config = io ? io.fromForm(form) : form;
          this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
          this._render();
        });
        this.appendChild(this._form);
      }
      this._form.hass = this._hass;
      this._form.schema = typeof schema === 'function' ? schema(this._config) : schema;
      this._form.data = this._config;
    }
  };

  const CARDS = [
    {
      tag: 'cranberry-status-card', cls: CranberryStatusCard, name: 'Cranberry status',
      description: 'Heating, lock, alarm or who is home, with buttons beside the name.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('climate.')) || 'zone.home' }),
      schema: (c) => {
        const d = String(c.entity || '').split('.')[0];
        const s = [{ name: 'entity', required: true, selector: { entity: {} } }, { name: 'name', selector: { text: {} } }, { name: 'icon', selector: { icon: {} } }, { name: 'popup', selector: { text: {} } }];
        if (d === 'lock') s.push({ name: 'alarm', selector: { entity: { domain: 'alarm_control_panel' } } }, { name: 'alert_when_unlocked', selector: { boolean: {} } });
        if (d === 'alarm_control_panel') s.push({ name: 'modes', selector: { select: { multiple: true, options: Object.keys(ALARM_MODES).map((k) => ({ value: k, label: ALARM_MODES[k].label })) } } }, { name: 'code', selector: { text: { type: 'password' } } });
        if (d === 'person') s.push({ name: 'show_picture', selector: { select: { mode: 'box', options: [{ value: 'picture', label: 'Photo' }, { value: 'icon', label: 'Icon' }] } } });
        if (d === 'zone' || d === 'person') s.push({ name: 'people', selector: { entity: { multiple: true, domain: 'person' } } });
        return s;
      },
      labels: { entity: 'Entity', name: 'Name', icon: 'Icon', popup: 'Pop-up to open', show_picture: 'Picture', alarm: 'Alarm', alert_when_unlocked: 'Always warn when unlocked', modes: 'Alarm buttons', code: 'Alarm code', people: 'People' },
      helpers: { show_picture: 'The photo set for this person in Home Assistant. Without a photo the card shows the icon.', popup: 'Optional. The Bubble pop-up hash, for example #liam, opened by tapping the card. Leave empty to open the details instead.', entity: 'Climate, lock, alarm, a person, or zone.home for who is home.', alarm: 'Turns the card red while the door is unlocked and this alarm is on.', people: 'Optional. Leave empty to use everyone in the zone.', code: 'Only if your alarm needs a code to arm or disarm.' }
    },
    {
      tag: 'cranberry-room-card', cls: CranberryRoomCard, name: 'Cranberry room',
      description: 'A room: tap the icon to switch it on or off, tap the card to open its pop-up.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('light.')) || 'light.living_room' }),
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: ['light', 'switch', 'group'] } } },
        { name: 'name', selector: { text: {} } }, { name: 'icon', selector: { icon: {} } },
        { name: 'temperature', selector: { entity: { domain: ['sensor', 'weather'] } } },
        { name: 'popup', selector: { text: {} } },
        { name: 'lights', selector: { entity: { multiple: true, domain: ['light', 'switch'] } } },
        { name: 'alerts', selector: { entity: { multiple: true, domain: ['binary_sensor', 'lock', 'cover'] } } },
        { type: 'expandable', name: 'extra_button', flatten: true, title: 'Extra button', icon: 'mdi:gesture-tap-button', schema: [
          { name: 'button_entity', selector: { entity: { domain: ['input_boolean', 'switch', 'light', 'script', 'scene'] } } },
          { name: 'button_name', selector: { text: {} } },
          { name: 'button_icon', selector: { icon: {} } }
        ] }
      ],
      labels: { entity: 'Room lights (group, light or switch)', name: 'Name', icon: 'Icon', temperature: 'Temperature sensor', popup: 'Pop-up to open', lights: 'Lights to count', alerts: 'Turn brick when open', button_entity: 'Toggle', button_name: 'Name', button_icon: 'Icon' },
      helpers: { popup: 'The Bubble pop-up hash, for example #living-room. Leave empty to open the details instead.', lights: 'Optional. Leave empty to use the members of the group.', alerts: 'Optional. Doors, windows or locks in this room. While one is open or unlocked, the card turns brick and says which.', button_entity: 'Optional. A toggle you want on the room card itself, like a Lego light. Olive while it is on. Left out when the card is as narrow as on a phone, so keep it in the room’s pop-up too.' }
    },
    {
      tag: 'cranberry-scene-card', cls: CranberrySceneCard, name: 'Cranberry scene',
      description: 'One scene button that stays highlighted while the scene is active.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('scene.')) || 'scene.evening' }),
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: ['scene', 'script'] } } },
        { name: 'name', selector: { text: {} } }, { name: 'icon', selector: { icon: {} } },
        { type: 'expandable', name: 'advanced', flatten: true, title: 'When is it active?', icon: 'mdi:help-circle-outline', schema: [
          { name: 'compare', selector: { entity: { multiple: true, domain: ['scene', 'script'] } } },
          { name: 'active_entity', selector: { entity: {} } },
          { name: 'active_state', selector: { text: {} } }
        ] }
      ],
      labels: { entity: 'Scene', name: 'Name', icon: 'Icon', compare: 'Compare with', active_entity: 'Active when this entity…', active_state: '…has this state' },
      helpers: {
        entity: 'Active while it was the last scene you picked and none of its lights changed since.',
        compare: 'Optional. Only these scenes count as “the last one picked”. Empty means all scenes.',
        active_entity: 'Optional. Use a helper instead, for example an input_select with the scene name.',
        active_state: 'Defaults to on, or the scene name for a dropdown helper.'
      }
    },
    {
      tag: 'cranberry-media-card', cls: CranberryMediaCard, name: 'Cranberry music',
      description: 'What is playing, with previous, play/pause and next. Olive while playing.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('media_player.')) || 'media_player.living_room' }),
      schema: [{ name: 'entity', required: true, selector: { entity: { domain: 'media_player' } } }, { name: 'name', selector: { text: {} } }, { name: 'show_artwork', selector: { boolean: {} } }, { name: 'popup', selector: { text: {} } }],
      labels: { entity: 'Media player', name: 'Room name', show_artwork: 'Show album art', popup: 'Pop-up to open' },
      helpers: { popup: 'The Bubble pop-up hash, for example #music. Leave empty to open the details instead.' }
    },
    {
      tag: 'cranberry-washer-card', cls: CranberryWasherCard, name: 'Cranberry washing machine',
      description: 'Time left, phase and progress while it runs; cranberry when the washing is done.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('sensor.') && e.endsWith('_progress')) || 'sensor.washer_progress' }),
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'sensor' } } },
        { name: 'done', selector: { entity: { domain: ['input_boolean', 'binary_sensor', 'switch'] } } },
        { name: 'done_at', selector: { entity: { domain: ['sensor', 'input_datetime'] } } },
        { name: 'name', selector: { text: {} } },
        { name: 'size', selector: { select: { mode: 'dropdown', options: [{ value: 'large', label: 'Large, with phase steps' }, { value: 'row', label: 'Row, like the status cards' }] } } },
        { name: 'alert_after', selector: { number: { min: 15, max: 240, step: 15, mode: 'slider', unit_of_measurement: 'min' } } },
        { name: 'hide_when_quiet', selector: { boolean: {} } }
      ],
      labels: { entity: 'Washing machine progress sensor', done: 'Done helper', done_at: 'Finished at', name: 'Name', size: 'Size', alert_after: 'Turn red after', hide_when_quiet: 'Hide while it is idle' },
      helpers: {
        entity: 'The “Progress” sensor from localthings. The card finds the machine’s other entities from it.',
        done: 'On while there is washing to take out. “Emptied” turns it off.',
        done_at: 'Optional. When the wash finished. Without it, the time the done helper switched on.',
        alert_after: 'How long done washing may wait before the card turns red.'
      }
    },
    {
      tag: 'cranberry-thermostat-card', cls: CranberryThermostatCard, name: 'Cranberry thermostat',
      description: 'The whole card says what the thermostat is doing: colour, the setpoint large, and one sentence. Every HVAC mode, heat/cool, presets, fan, swing and humidity.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('climate.')) || 'climate.living_room' }),
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'climate' } } },
        { name: 'name', selector: { text: {} } },
        { name: 'size', selector: { select: { mode: 'box', options: [{ value: 'full', label: 'Full' }, { value: 'compact', label: 'Compact' }] } } },
        { name: 'popup', selector: { text: {} } },
        { name: 'modes', selector: { select: { multiple: true, options: [{ value: 'off', label: 'Off' }, { value: 'heat', label: 'Heat' }, { value: 'cool', label: 'Cool' }, { value: 'heat_cool', label: 'Heat/cool' }, { value: 'auto', label: 'Auto' }, { value: 'dry', label: 'Dry' }, { value: 'fan_only', label: 'Fan only' }] } } },
        { name: 'show_modes', selector: { boolean: {} } },
        { name: 'show_eta', selector: { boolean: {} } },
        { name: 'show_humidity', selector: { boolean: {} } }
      ],
      labels: { entity: 'Thermostat', name: 'Room name', size: 'Size', popup: 'Pop-up to open', modes: 'Modes to show', show_modes: 'Show the modes', show_eta: 'Say how long it takes', show_humidity: 'Show the humidity target' },
      helpers: {
        size: 'Compact is one strip for the everyday column: the setpoint, a short sentence and −/+. Modes, fan and swing stay in the full card.',
        popup: 'Optional. The Bubble pop-up hash, for example #living-room, opened by tapping the room name. Leave empty to open the details instead.',
        modes: 'Optional. Leave empty to show every mode the thermostat has. Full size only.',
        show_eta: 'Works out “warm in about … minutes” from how fast the room warmed up in the current run (needs the recorder).',
        show_humidity: 'Only for thermostats that can aim for a humidity.'
      }
    },
    {
      tag: 'cranberry-car-card', cls: CranberryCarCard, name: 'Cranberry car',
      description: 'Where the car is parked: the place, the layer and zone in a garage, or a note and a map.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('input_select.') && e.includes('park')) || 'input_select.parking_location' }),
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'input_select' } } },
        { name: 'name', selector: { text: {} } },
        { type: 'expandable', name: 'garage', flatten: true, title: 'Parking garage', icon: 'mdi:garage-variant', schema: [
          { name: 'layers_for', selector: { text: {} } },
          { name: 'layer', selector: { entity: { domain: 'input_select' } } },
          { name: 'zone', selector: { entity: { domain: 'input_select' } } }
        ] },
        { type: 'expandable', name: 'other', flatten: true, title: 'Anywhere else', icon: 'mdi:map-marker-outline', schema: [
          { name: 'note_for', selector: { text: {} } },
          { name: 'note', selector: { entity: { domain: 'input_text' } } },
          { name: 'spot', selector: { entity: {} } }
        ] }
      ],
      labels: { entity: 'Where it is parked', name: 'Name', layers_for: 'Option for the garage', layer: 'Layer', zone: 'Zone', note_for: 'Option for anywhere else', note: 'Note', spot: 'Location for the map' },
      helpers: {
        layers_for: 'The option that shows the layer and zone chips, e.g. Garage.',
        note_for: 'The option that shows the note and the map, e.g. Elsewhere.',
        spot: 'Any entity with latitude and longitude, like sensor.car_parked_spot.'
      }
    },
    {
      tag: 'cranberry-people-card', cls: CranberryPeopleCard, name: 'Cranberry people',
      description: 'A title row with a round photo per person; "Away" or the zone next to the photo when they are not home.',
      stub: (ids) => ({ people: ids.filter((e) => e.startsWith('person.')).slice(0, 4) }),
      // in YAML a person with a pop-up becomes { entity, popup }
      io: {
        toForm: (cfg) => {
          const f = Object.assign({}, cfg);
          f.people = [].concat(cfg.people || []).map((x) => {
            if (x && typeof x === 'object') { if (x.popup) f['popup:' + x.entity] = x.popup; return x.entity; }
            return x;
          }).filter(Boolean);
          return f;
        },
        fromForm: (f) => {
          const cfg = {};
          Object.keys(f).forEach((k) => { if (k.indexOf('popup:') !== 0) cfg[k] = f[k]; });
          if (f.people) cfg.people = f.people.map((id) => (f['popup:' + id] ? { entity: id, popup: f['popup:' + id] } : id));
          return cfg;
        }
      },
      schema: (f) => [
        { name: 'people', selector: { entity: { multiple: true, domain: 'person' } } },
        { name: 'title', selector: { text: {} } },
        { name: 'show_picture', selector: { select: { mode: 'box', options: [{ value: 'picture', label: 'Photo' }, { value: 'icon', label: 'Icon' }] } } },
        ...((f && f.people) || []).length ? [{
          type: 'expandable', name: 'popups', flatten: true, title: 'Pop-up per person', icon: 'mdi:map-marker-outline',
          schema: f.people.map((id) => ({ name: 'popup:' + id, title: id.replace(/^person\./, '').replace(/_/g, ' ').replace(/^./, (ch) => ch.toUpperCase()), selector: { text: {} } }))
        }] : []
      ],
      labels: { people: 'People', title: 'Title', show_picture: 'Picture' },
      helpers: { title: 'Optional, for example Home. Shown on the left, the people on the right.', show_picture: 'The photo set for each person in Home Assistant. Without a photo it shows their initial.', popups: 'A Bubble pop-up hash per person, for example #liam. Leave empty to open the details instead.' }
    },
    {
      tag: 'cranberry-calendar-card', cls: CranberryCalendarCard, name: 'Cranberry calendar',
      description: 'The coming days from your calendars, with the same date blocks as the home card.',
      stub: (ids) => ({ calendars: ids.filter((e) => e.startsWith('calendar.')).slice(0, 3) }),
      // the form is flat; in YAML a calendar with people becomes { entity, people }
      io: {
        toForm: (cfg) => {
          const f = Object.assign({}, cfg);
          f.calendars = [].concat(cfg.calendars || []).map((x) => {
            if (x && typeof x === 'object') { if (x.people && x.people.length) f['people:' + x.entity] = [].concat(x.people); return x.entity; }
            return x;
          }).filter(Boolean);
          return f;
        },
        fromForm: (f) => {
          const cfg = {};
          Object.keys(f).forEach((k) => { if (k.indexOf('people:') !== 0) cfg[k] = f[k]; });
          if (f.calendars) cfg.calendars = f.calendars.map((id) => (f['people:' + id] && f['people:' + id].length ? { entity: id, people: f['people:' + id] } : id));
          return cfg;
        }
      },
      schema: (f) => [
        { name: 'calendars', selector: { entity: { multiple: true, domain: 'calendar' } } },
        ...((f && f.calendars) || []).length ? [{
          type: 'expandable', name: 'who', flatten: true, title: 'Who sees which calendar', icon: 'mdi:account-eye-outline',
          schema: f.calendars.map((id) => ({ name: 'people:' + id, title: id.replace(/^calendar\./, '').replace(/_/g, ' ').replace(/^./, (ch) => ch.toUpperCase()), selector: { entity: { multiple: true, domain: 'person' } } }))
        }] : [],
        { name: 'title', selector: { text: {} } },
        { name: 'days', selector: { number: { min: 7, max: 31, step: 1, mode: 'slider' } } },
        { name: 'show_empty', selector: { select: { mode: 'dropdown', options: [{ value: 'fold', label: 'Fold into one line' }, { value: 'hide', label: 'Leave out' }] } } },
        { name: 'view', selector: { select: { mode: 'box', options: [{ value: 'agenda', label: 'Agenda' }, { value: 'week', label: 'Week' }] } } },
        { name: 'switcher', selector: { boolean: {} } },
        { name: 'week_layout', selector: { select: { mode: 'box', options: [{ value: 'time', label: 'At their time' }, { value: 'list', label: 'As a list per day' }] } } },
        { name: 'add_events', selector: { boolean: {} } }
      ],
      labels: { calendars: 'Calendars', title: 'Title', days: 'Days to show in the agenda', show_empty: 'Days without plans', view: 'Start with', switcher: 'Show the Agenda / Week switch', week_layout: 'Week', add_events: 'Show “New event”' },
      helpers: { calendars: 'The colours follow this order: cranberry, olive, harbour, ochre, quail.', title: 'Optional. Leave empty inside a pop-up, which has its own title.', view: 'Week shows the next seven days side by side. On a narrow screen the card always shows the agenda.', add_events: 'Only calendars that accept new events can be picked, like Local calendar and Google Calendar.', who: 'Pick the people who see a calendar. Leave it empty and everyone sees it.' }
    },
    {
      tag: 'cranberry-waste-card', cls: CranberryWasteCard, name: 'Cranberry waste collection',
      description: 'Which bin goes out next. Cranberry the evening before, with “It’s out”.',
      stub: () => ({ waste: 'auto' }),
      schema: [
        { name: 'waste', selector: { entity: { multiple: true, domain: 'sensor' } } },
        { name: 'waste_out', selector: { entity: { domain: 'input_boolean' } } },
        { name: 'size', selector: { select: { mode: 'dropdown', options: [{ value: 'large', label: 'Large, with the next collections' }, { value: 'row', label: 'Row, like the status cards' }] } } },
        { name: 'waste_remind_from', selector: { time: {} } },
        { name: 'waste_collected_by', selector: { time: {} } },
        { name: 'hide_when_quiet', selector: { boolean: {} } }
      ],
      labels: { hide_when_quiet: 'Hide when nothing goes out tomorrow', waste: 'Waste sensors (Afvalwijzer)', waste_out: 'Bins out helper', size: 'Size', waste_remind_from: 'Remind from (the evening before)', waste_collected_by: 'Collected by (on the day)' },
      helpers: { waste: 'Leave empty to find the Afvalwijzer sensors automatically.', waste_out: 'Toggle helper. “It’s out” switches it on; it is ignored again after the collection.' }
    }
  ];

  window.customCards = window.customCards || [];
  CARDS.forEach((d) => {
    const editorTag = d.tag + '-editor';
    d.cls.getConfigElement = () => document.createElement(editorTag);
    d.cls.getStubConfig = (hass) => d.stub(Object.keys((hass && hass.states) || {}));
    if (!customElements.get(d.tag)) customElements.define(d.tag, d.cls);
    if (!customElements.get(editorTag)) customElements.define(editorTag, makeEditor(d.schema, d.labels, d.helpers, d.io));
    if (!window.customCards.some((x) => x.type === d.tag)) window.customCards.push({ type: d.tag, name: d.name, description: d.description, preview: true });
  });
