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
        const { tr } = window.CranberryI18n;
        this._form.computeLabel = (s) => tr(this._hass, labels[s.name] || s.title || s.name);
        this._form.computeHelper = (s) => helpers[s.name] && tr(this._hass, helpers[s.name]);
        this._form.addEventListener('value-changed', (ev) => {
          ev.stopPropagation();
          const form = Object.assign({}, ev.detail.value);
          Object.keys(form).forEach((k) => { if (form[k] === '' || form[k] == null || (Array.isArray(form[k]) && !form[k].length)) delete form[k]; });
          this._config = form;
          const config = io ? io.fromForm(form, this._config) : form;
          this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
          this._render();
        });
        this.appendChild(this._form);
      }
      this._form.hass = this._hass;
      this._form.schema = window.CranberryI18n.trSchema(this._hass, typeof schema === 'function' ? schema(this._config) : schema);
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
      tag: 'cranberry-scenes-card', cls: CranberryScenesCard, name: 'Cranberry scene pills',
      description: 'Several scenes as one row of pills that scrolls sideways. Made for phones.',
      stub: (ids) => ({ scenes: ids.filter((e) => e.startsWith('scene.')).slice(0, 4) }),
      schema: [{ name: 'scenes', required: true, selector: { entity: { multiple: true, domain: ['scene', 'script'] } } }],
      labels: { scenes: 'Scenes' },
      helpers: { scenes: 'In YAML each can be { entity, name, icon } to set its name and icon.' },
      // a scene with its own name or icon is kept as it is
      io: {
        toForm: (cfg) => Object.assign({}, cfg, { scenes: [].concat(cfg.scenes || []).map((x) => (x && typeof x === 'object' ? x.entity : x)).filter(Boolean) }),
        fromForm: (f, cfg) => {
          const was = {};
          [].concat((cfg && cfg.scenes) || []).forEach((x) => { if (x && typeof x === 'object') was[x.entity] = x; });
          return Object.assign({}, f, { scenes: (f.scenes || []).map((id) => was[id] || id) });
        }
      }
    },
    {
      tag: 'cranberry-scene-card', cls: CranberrySceneCard, name: 'Cranberry scene',
      description: 'One scene button: tap to run the scene. With Stateful Scenes, cranberry while the scene is on.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('scene.')) || 'scene.evening' }),
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: ['scene', 'script'] } } },
        { name: 'name', selector: { text: {} } }, { name: 'icon', selector: { icon: {} } },
        { name: 'stateful', selector: { entity: { domain: 'switch' } } },
      ],
      labels: { entity: 'Scene', name: 'Name', icon: 'Icon', stateful: 'Stateful Scenes switch' },
      helpers: { entity: 'A scene or a script. Tapping runs it.', stateful: 'Optional. With the Stateful Scenes integration the button is cranberry while this switch is on. Found by itself when it is named after the scene.' }
    },
    {
      tag: 'cranberry-media-card', cls: CranberryMediaCard, name: 'Cranberry music',
      description: 'What is playing, with previous, play/pause and next. Olive while playing.',
      stub: (ids) => ({ entity: ids.find((e) => e.startsWith('media_player.')) || 'media_player.living_room' }),
      schema: [{ name: 'entity', required: true, selector: { entity: { domain: 'media_player' } } }, { name: 'name', selector: { text: {} } }, { name: 'size', selector: { select: { mode: 'box', options: [{ value: 'row', label: 'Row' }, { value: 'medium', label: 'Medium, with the cover' }, { value: 'full', label: 'Full, for a pop-up' }] } } }, { name: 'favourites_player', selector: { entity: { domain: 'media_player' } } }, { name: 'show_artwork', selector: { boolean: {} } }, { name: 'popup', selector: { text: {} } }],
      labels: { entity: 'Media player', name: 'Room name', size: 'Size', favourites_player: 'Play favourites on', show_artwork: 'Show album art', popup: 'Pop-up to open' },
      helpers: { popup: 'The Bubble pop-up hash, for example #music. Leave empty to open the details instead.', size: 'Medium puts the cover beside the song and the controls, for a dashboard. Full shows the cover, the song’s progress, the volume, source and sound mode, and your favourites (set in YAML: favourites).', favourites_player: 'Optional. The player that plays a favourite, such as a Music Assistant or Spotify player. Leave empty to use the media player above.' }
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
      tag: 'cranberry-heading-card', cls: CranberryHeadingCard, name: 'Cranberry heading',
      description: 'Home Assistant\u2019s heading, hidden while every card under it is hidden.',
      stub: () => ({ heading: 'Around the house', heading_style: 'title' }),
      schema: [
        { name: 'heading', selector: { text: {} } },
        { name: 'heading_style', selector: { select: { mode: 'dropdown', options: [{ value: 'title', label: 'Title' }, { value: 'subtitle', label: 'Subtitle' }] } } },
        { name: 'icon', selector: { icon: {} } },
        { name: 'follows', selector: { number: { min: 1, max: 20, mode: 'box' } } }
      ],
      labels: { heading: 'Heading', heading_style: 'Style', icon: 'Icon', follows: 'Cards to watch' },
      helpers: { follows: 'How many cards after it to watch. Leave empty for every card up to the next heading.' }
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
          f.updates = cfg.updates !== false;
          return f;
        },
        fromForm: (f) => {
          const cfg = {};
          Object.keys(f).forEach((k) => { if (k.indexOf('popup:') !== 0) cfg[k] = f[k]; });
          // on is the default, so only off is written
          if (cfg.updates !== false) delete cfg.updates;
          if (f.people) cfg.people = f.people.map((id) => (f['popup:' + id] ? { entity: id, popup: f['popup:' + id] } : id));
          return cfg;
        }
      },
      schema: (f) => [
        { name: 'people', selector: { entity: { multiple: true, domain: 'person' } } },
        { name: 'title', selector: { text: {} } },
        { name: 'show_picture', selector: { select: { mode: 'box', options: [{ value: 'picture', label: 'Photo' }, { value: 'icon', label: 'Icon' }] } } },
        { name: 'updates', selector: { boolean: {} } },
        ...((f && f.people) || []).length ? [{
          type: 'expandable', name: 'popups', flatten: true, title: 'Pop-up per person', icon: 'mdi:map-marker-outline',
          schema: f.people.map((id) => ({ name: 'popup:' + id, title: id.replace(/^person\./, '').replace(/_/g, ' ').replace(/^./, (ch) => ch.toUpperCase()), selector: { text: {} } }))
        }] : []
      ],
      labels: { people: 'People', title: 'Title', show_picture: 'Picture', updates: 'Show updates to admins' },
      helpers: { updates: 'A chip when Home Assistant, an add-on or an integration can be updated. Only admins see it; tapping opens Settings › Updates.', title: 'Optional, for example Home. Shown on the left, the people on the right.', show_picture: 'The photo set for each person in Home Assistant. Without a photo it shows their initial.', popups: 'A Bubble pop-up hash per person, for example #liam. Leave empty to open the details instead.' }
    },
    {
      tag: 'cranberry-weather-card', cls: CranberryWeatherCard, name: 'Cranberry weather',
      description: 'Out here, now and later: a sentence, the next 24 hours, and the week. For a balcony or garden pop-up.',
      stub: (ids) => ({ entity: ids.find((id) => id.indexOf('weather.') === 0) || 'weather.home' }),
      schema: [
        { name: 'entity', selector: { entity: { domain: 'weather' } } },
        { name: 'weather_now', selector: { entity: { domain: 'weather' } } },
        { name: 'view', selector: { select: { mode: 'box', options: [{ value: 'hours', label: 'Hours' }, { value: 'days', label: 'Days' }] } } },
        { name: 'switcher', selector: { boolean: {} } },
        { name: 'hours', selector: { number: { min: 6, max: 48, step: 1, mode: 'slider' } } },
        { name: 'days', selector: { number: { min: 3, max: 10, step: 1, mode: 'slider' } } }
      ],
      labels: { entity: 'Weather', weather_now: 'Current conditions (optional)', view: 'Start with', switcher: 'Show the Hours / Days switch', hours: 'Hours in the strip', days: 'Days to show' },
      helpers: { weather_now: 'Optional. A second weather entity for the temperature now, such as NL Weather’s observations.', view: 'The card remembers the view picked last on each device.', hours: 'The strip scrolls sideways.' }
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
