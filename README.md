# Cranberry Canvas for Home Assistant

Eleven dashboard cards in a warm, calm palette where every colour means
one thing: cranberry for the house, olive for running, harbour for cool and wet, ochre for
caution, quail for off, and brick only when something needs you. Every card has a visual editor.

The matching theme lives in its own repository, [HA-Cranberry](https://github.com/liamcamps/HA-Cranberry),
so HACS can install and update it too.

| Card | Type |
| --- | --- |
| Home: clock, coming up, what needs attention, lights on (tap for a menu), weather details and the coming hours | `custom:cranberry-home-card` |
| Status: heating, who is home, a lock or an alarm | `custom:cranberry-status-card` |
| Room: lights on, brightness, temperature, pop-up | `custom:cranberry-room-card` |
| Scene: stays highlighted while the scene is active | `custom:cranberry-scene-card` |
| Music: what is playing, with controls | `custom:cranberry-media-card` |
| Washing machine (localthings): time left, phase, done | `custom:cranberry-washer-card` |
| Waste collection (Afvalwijzer): which bin goes out next | `custom:cranberry-waste-card` |
| Car: where it is parked, with a map | `custom:cranberry-car-card` |
| People: a chip per person with photo and where they are; for admins, a chip when updates are waiting | `custom:cranberry-people-card` |
| Calendar: the coming days from your calendars, with date blocks like the home card | `custom:cranberry-calendar-card` |
| Thermostat: the card's colour, the setpoint and one sentence; every mode, heat/cool, presets, fan, swing; full or compact | `custom:cranberry-thermostat-card` |

## Install

### Cards, through HACS

1. HACS → ⋮ → **Custom repositories** → `https://github.com/liamcamps/HA-Cranberry-cards`,
   type **Dashboard**.
2. Search for **Cranberry Canvas cards** and download it. HACS adds the resource itself and
   shows an update whenever a new release is published.
3. Reload the browser.

Recommended with it: **Bubble Card** and **Navbar card** (HACS), and **Lucide Icons**
(custom repository `karlis-vagalis/hass-lucide-icons`, type Integration) for the icons.

### Theme

The theme has its own repository: add `https://github.com/liamcamps/HA-Cranberry` to HACS as
type **Theme** and download **Cranberry Canvas theme**. Its
[README](https://github.com/liamcamps/HA-Cranberry) has the one-time `configuration.yaml` step.

### Car card map (optional)

Copy `templates/car_parked.yaml` to `/config/templates/` (loaded with
`template: !include_dir_merge_list templates/`) and reload Template entities. It turns the
coordinates in `input_text.car_parked_latitude` and `input_text.car_parked_longitude` into
`sensor.car_parked_spot`, which the car card's `spot` option uses.

## Use

Edit dashboard → Add card → search **Cranberry**. Each card's editor explains its options.
The most used YAML:

```yaml
type: custom:cranberry-home-card
weather: weather.home
lights: [light.living_room, light.bedroom]
issues: [binary_sensor.front_door]
weather_details: wide       # show | wide (desktop only) | hide: high/low, rain, wind, sun, a taller chart
coming_up: wide             # show | wide (desktop only) | hide: the next events under the clock
calendars: [calendar.family]
coming_up_count: 3
```

```yaml
type: custom:cranberry-room-card
entity: light.living_room
icon: lucide:sofa
temperature: sensor.living_room_temperature
popup: '#living-room'
```

```yaml
type: custom:cranberry-thermostat-card
entity: climate.living_room
modes: [heat, auto, off]   # optional, default: all the thermostat has
```

```yaml
# compact: one strip with the setpoint, a short sentence and −/+
type: custom:cranberry-thermostat-card
entity: climate.living_room
size: compact
popup: '#living-room'      # optional: tapping the room name opens this pop-up
```

```yaml
# the calendar, for example inside a Bubble pop-up #calendar
type: custom:cranberry-calendar-card
calendars:                 # colours follow this order
  - calendar.family          # everyone sees it
  - entity: calendar.liam    # only these people see it
    people: [person.liam]
days: 14
show_empty: fold           # fold | hide
view: agenda               # agenda | week: the view it opens on
switcher: true             # the Agenda / Week switch
week_layout: time          # time: events at their time, overlaps side by side | list
add_events: true           # the New event button, for calendars that accept events
```

```yaml
# a room card that turns brick while its door is open
type: custom:cranberry-room-card
entity: light.balcony
alerts: [binary_sensor.balcony_door]
```

```yaml
type: custom:cranberry-car-card
entity: input_select.parking_location
layers_for: Garage
layer: input_select.parking_layer
zone: input_select.parking_zone
note_for: Elsewhere
note: input_text.parking_note
spot: sensor.car_parked_spot
```

## Develop

```sh
npm install
npm test
```

Releases are automatic: raise `VERSION` in `src/home/00-shared.js` and `version` in
`package.json`, add a `## <version>` section to `CHANGELOG.md`, and push to `main`. When the
tests and the HACS check pass, CI publishes release `v<version>` and HACS offers the update.

## Development

The cards are written in `src/`, one file per card, and built into the single
`dist/cranberry-cards.js` that HACS installs:

```sh
npm install        # once: jsdom for the tests, esbuild for the build
npm run build      # src/ → dist/cranberry-cards.js (minified)
npm test           # checks dist/ is up to date, then runs the tests on it
node build.mjs --plain   # an unminified build, for reading or debugging
```

`src/home/` is the home card; `src/cards/` holds the other cards, with the shared base in
`00-base.js` and the card registrations in `90-editors.js`. Files are joined in name order.
Colours come from the theme's `cc-` tokens; the only colour values in the cards are the
fallbacks for when the theme isn't installed, all in `src/home/05-tokens.js`.

### Language

The cards and their editors speak Dutch when your Home Assistant language (your profile, or the
system language) is Dutch, and English otherwise. Dates and times always follow that language.
The texts are written in English in the cards, as `this.t('Heating to {target}', { target })`;
`src/home/07-nl.js` holds the Dutch for each. `tests/i18n.js` fails when a text has no Dutch, or
when a translation drops one of the `{parts}`.
