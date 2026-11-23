# Changelog

## 2.23.0 (2026-11-23)

- The palette is official, and every colour means one thing:
  - **Cranberry** is the house.
  - **Olive** is running.
  - **Harbour** #40606A is cool and wet.
  - **Ochre** #8E6420 is caution.
  - **Quail** is off.
  - **Brick** is only for problems.
  - **Mist** and **Sun** are for weather data.
  - Neutrals: **Paper** #EEE9DF cards on Canvas in light mode, **Night** and **Ember** in dark mode. **Stone** and **Taupe** are the warm secondary text.
- Theme (version 4):
  - Light-mode cards are lighter than the page instead of darker.
  - Secondary text is warm.
  - Cool and info states use Harbour; warnings use Ochre.
  - Dark-mode text is Cream.
  - Brick is the same in both modes.
  - New tokens `cc-harbour`, `cc-ochre-tone`, `cc-paper` and `cc-ember`.
- Problems:
  - A card that needs you turns fully brick with cream text.
  - On the cranberry home card, the problem chip and the warning strip are cream with brick text, so they stand out from the red.
- Room card: new **Turn brick when open** option. Pick doors, windows or locks; while one is open, the card turns brick and says which ("Balcony door open").
- Thermostat card: drying is Ochre, idle is Ember raised, off is Quail.
- Weather tints: ice, dusk and lightning fold into Mist, Taupe and Sun.

## 2.22.0 (2026-11-22)

- Home card: Coming up as date blocks, one per day ("MON 23 · Dentist · 09:00 · +1 more"),
  two days by default.
- Home card: no more sentence under the chips ("All quiet.", "One thing needs you.",
  "All lights are off."). The red chip already says when something needs you. A fixed home
  sentence set in the editor still shows.

## 2.21.0 (2026-11-22)

- Home card, quieter: the clock is the only large thing on the left.
  - Coming up is plain text, the title first and when in grey: "Dentist · tomorrow 09:00".
  - The weather tip no longer has its own dark background.
  - Next to a red chip, the lights chip shortens to "Lights on in 3 rooms" so both fit on one line.

## 2.20.0 (2026-11-22)

- Home card: **Weather details** (Show, Desktop only or Hide). A row with high and low, rain
  chance, wind and the next sunrise or sunset, and the chart grows to use the card's height,
  with rain under the line and a range of at least 6° so a flat night stays flat.
- Home card: **Coming up** (Show, Desktop only or Hide). The next events from one or more
  calendars under the clock ("Tomorrow 09:00 · Dentist", "Now · until 15:00"), plus the next bin
  collection when the bins chip isn't already showing it. Pick how many in the editor.
- Desktop only means the side-by-side layout; when the card stacks on a phone it is left out.

## 2.19.0 (2026-11-22)

- Thermostat card: new **Size** option (Full or Compact) in the card editor. Compact is one strip
  for the everyday column: the same colour, the setpoint, a short sentence ("Heating from 19.4°.
  Warm in ~26 min.") and −/+. Heat/cool gets two small rows, off gets a Turn on button.
  Modes, fan and swing stay in the full card.
- Thermostat card: new **Pop-up to open** option; tapping the room name opens that Bubble pop-up
  instead of the details.

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
