# Cranberry Canvas for Home Assistant

Eight dashboard cards and a matching theme in a warm, calm palette: cranberry, canvas,
olive and quail, with brick only when something needs you. Every card has a visual editor.

| Card | Type |
| --- | --- |
| Home: clock, what needs attention, weather and the coming hours | `custom:cranberry-home-card` |
| Status: heating, who is home, a lock or an alarm | `custom:cranberry-status-card` |
| Room: lights on, brightness, temperature, pop-up | `custom:cranberry-room-card` |
| Scene: stays highlighted while the scene is active | `custom:cranberry-scene-card` |
| Music: what is playing, with controls | `custom:cranberry-media-card` |
| Washing machine (localthings): time left, phase, done | `custom:cranberry-washer-card` |
| Waste collection (Afvalwijzer): which bin goes out next | `custom:cranberry-waste-card` |
| Car: where it is parked, with a map | `custom:cranberry-car-card` |

## Install

### Cards, through HACS

1. HACS → ⋮ → **Custom repositories** → `https://github.com/liamcamps/HA-Cranberry`,
   type **Dashboard**.
2. Search for **Cranberry Canvas cards** and download it. HACS adds the resource itself and
   shows an update whenever a new release is published.
3. Reload the browser.

Recommended with it: **Bubble Card** and **Navbar card** (HACS), and **Lucide Icons**
(custom repository `karlis-vagalis/hass-lucide-icons`, type Integration) for the icons.

### Theme

HACS installs one kind of thing per repository, so the theme is copied by hand:

1. Copy `themes/cranberry_canvas.yaml` to `/config/themes/`.
2. Make sure `configuration.yaml` has `frontend:` → `themes: !include_dir_merge_named themes`.
3. Developer tools → Actions → `frontend.reload_themes`, then Profile → Theme →
   **Cranberry Canvas**.

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
```

```yaml
type: custom:cranberry-room-card
entity: light.living_room
icon: lucide:sofa
temperature: sensor.living_room_temperature
popup: '#living-room'
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

Releases: raise `VERSION` in `dist/cranberry-cards.js` and `version` in `package.json`, add
a line to `CHANGELOG.md`, and publish a GitHub release tagged `v<version>` so HACS offers
the update.
