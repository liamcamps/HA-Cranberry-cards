# Changelog

## 2.18.0 (2026-11-22)

- New: Cranberry thermostat card (`custom:cranberry-thermostat-card`). The whole card's colour
  says what the thermostat is doing (olive heating, slate cooling, dark resting, ochre drying),
  the setpoint is large with −/+, and one sentence says where the room is and what happens next,
  including "warm in about … minutes" worked out from the current run in the recorder.
- Heat/cool stacks "Heat below" and "Cool above", each with its own −/+, kept at least 1° apart.
- Every HVAC mode the thermostat has, presets, fan speed, swing and target humidity, only when
  supported. Dry sets the humidity to dry to; fan only sets the fan speed.

## 2.17.0 (2026-11-22)

- Home card: the lights are now a chip ("3 · Lights on in Living room and Bedroom").
  Tap it for a menu of every light that is on, grouped by room, with its brightness,
  a button to switch each one off, and All off. Tap a name for its details.
- CI: tests and the HACS check run on every push; a new version is released by itself.

## 2.16.0 (2026-11-22)

- New: Cranberry car card. Where the car is parked as chips, layer and zone chips for a
  parking garage, a note field and a small map with walking directions for anywhere else.
- Music card: `popup` option to open a Bubble pop-up instead of the details window.
- Room card: `temperature` also accepts a weather entity.
- Home card: grows to the height of the sections next to it (`match_row`, on by default).
- Icons: all built-in icons use Lucide when the Lucide Icons integration is installed.
- Theme 3: also themes Home Assistant's own interface (buttons, dialogs, forms, chips,
  tooltips, tables, code editor, graphs) through its colour scales.
