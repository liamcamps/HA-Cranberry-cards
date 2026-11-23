# Changelog

## 2.32.0 (2026-11-23)

- People card, like Home Assistant's heading:
  - A title on the left ("Home") and a round photo per person on the right.
  - While someone is home it's just the photo; when they're away, "Away" or the zone ("Work") shows next to it in a pill.
  - Without a photo, it shows their initial.
  - The name is still read out by screen readers.

## 2.31.0 (2026-11-23)

- New **people card**: a title row with a chip per person. Each chip has the person's photo, name and where they are ("Liam · Home", "Mylou · Work"); the photo fades while they're away.
  - Tapping a chip opens that person's pop-up, or their details if there is no pop-up.
  - In the editor: the people, an optional title, photo or icon, and a pop-up per person.

## 2.30.0 (2026-11-23)

- Status card for a person: shows the person's photo from Home Assistant by default, faded while they're away. **Picture → Icon** in the editor (`show_picture: icon`) shows the icon instead. Without a photo, the card shows the icon.

## 2.29.0 (2026-11-23)

- Status card: **a person**. Shows the first name, and "Home", "Away" or the zone they're in ("Work") with since when ("Home · since 18:40", "Away · since yesterday"). Olive when home, quail when not.
- Status card: new **Pop-up to open** option, for example a pop-up with a map of that person.
- Room card on narrow screens (two side by side on a phone):
  - The temperature moves into the second line ("All off · 20.8°"), so the name has room.
  - As narrow as on a phone, the extra button is left out. Keep it in the room's pop-up too.

## 2.28.0 (2026-11-23)

- Calendar card: the time of an event in the week is always shown in full.
  - Small events use two compact lines, time then title.
  - Very short ones use one line, where the time stays whole and the title gets what's left.
  - Something happening now shows its real start time; the outline already says it's now.
- Calendar card: tapping an event shows its **details** in the card: the title, "Happening now" when it is, the day and time (or the days, for something longer), where, which calendar, and the description. Descriptions from Google lose their HTML and keep their line breaks. The back button returns to the list or week; tapping the calendar's name still opens the calendar.

## 2.27.1 (2026-11-23)

- Calendar card: events in the week are solid. They use the same tint, mixed with the card's colour, so the hour lines no longer show through them. The current-time line runs behind the events instead of across them.

## 2.27.0 (2026-11-23)

- Calendar card: the week sits on a **time grid**. Hours run down the side and each event is placed and sized by when it starts and ends. Events that overlap sit side by side; when they share a slot, they show just their title.
  - All-day events have their own row under the dates.
  - A cranberry line marks the current time in today's column.
  - The grid runs from 07:00 to 22:00 and stretches when something starts earlier or ends later. An overnight event runs to the bottom of its first day and the top of the next, without stretching the grid.
  - The list per day is still there: **Week → As a list per day** in the editor (`week_layout: list`).

## 2.26.0 (2026-11-23)

- Calendar card: **New event**. The button under the list opens a form: what, which calendar, the day (or all day), from and until, and where. It adds the event through Home Assistant's `calendar.create_event`.
  - Only calendars that accept new events can be picked (Local calendar, Google Calendar and others).
  - An end time before the start runs past midnight.
  - What you type survives the card's refresh every minute.
  - Can be turned off with **Show “New event”**.
- Calendar card: **who sees which calendar**. Per calendar, pick the people who see it, through the person linked to each Home Assistant user. Leave it empty and everyone sees it. In YAML:
  `calendars: [calendar.family, { entity: calendar.liam, people: [person.liam] }]`.
  A calendar keeps its colour whoever looks.

## 2.25.0 (2026-11-23)

- Calendar card: **week view**. The next seven days side by side, each topped by a date block (today in cranberry). Events are tinted by calendar, and what's happening now is outlined.
  - An **Agenda / Week** switch at the top changes between the views.
  - **Start with** in the editor picks the view the card opens on, and the switch can be hidden.
  - Narrower than 560px, the card always shows the agenda.
- Calendar card: the agenda shows at least seven days, so the week always has its data.

## 2.24.1 (2026-11-23)

- Home card: the temperature line is a smooth curve through every hour. It never overshoots, so a flat stretch stays flat and the curve doesn't dip below the coldest hour.
- Home card: no more small rain marks under the temperature line. A trace of rain looked like a loose piece of line. When rain is coming, the chart already switches to rain bars.

## 2.24.0 (2026-11-23)

- New **calendar card**: the coming days from one or more calendars, with the same date blocks as
  the home card.
  - Today is in cranberry.
  - Each event gets a dot in its calendar's colour: cranberry, olive, harbour, ochre, quail, in the order you pick them.
  - Days without plans fold into one line ("Thu 26 – Sun 29 · Nothing planned"), or are left out.
  - Events spanning midnight show on both days ("22:00 →", "Until 06:00"). Multi-day all-day events are numbered ("All day · 2 of 3").
  - What is happening now reads "Now, until 18:30".
  - Tap an event to open its calendar.
- Home card: new **Pop-up to open** option under Coming up. Tapping Coming up opens it, for example a `#calendar` pop-up with the calendar card.

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
