# Changelog

## 2.42.0 (2026-11-25)

- **Music row, when nothing plays:** it says what played last ("Last played: Harvest Moon · Neil Young") and has an on button, plus a play button that starts it again when it can (when it was one of your favourites, or has its own address). The card remembers the last song in the browser while it plays, and otherwise looks it up in the player's history of the last two days. The full size shows the song too, instead of only the source.
- **Thermostat sentence:** says where the room is and where it's going: "It's 19.4° now, heating to 21°. Warm in about 50 minutes.", or on the compact card "19.4° now. Warm in ~50 min.". When the room is already at the setpoint: "Heating a little to hold 21°." instead of "Heating from 21°".
- **Room card:** the extra button (a lava lamp, say) no longer replaces the room's status line; the button itself shows it's on.

## 2.41.1 (2026-11-25)

- **Cranberry heading** now finds the cards under it in a sections view, where each card sits in a grid cell of its own. In 2.41.0 it looked for them one level too low, found none, and so stayed visible.

## 2.41.0 (2026-11-25)

- **Cranberry heading** (`custom:cranberry-heading-card`): Home Assistant's own heading, with the same options, that hides itself while every card under it in the section is hidden, and shows again as soon as one of them does. So a title like "Around the house" no longer sits over nothing when the bins are out and the washer is idle. It watches the cards after it up to the next heading, or only the next `follows` cards.

## 2.40.0 (2026-11-24)

- **Music card, full size** (`size: full`), for a pop-up. Olive while on. The cover large on top (a TV icon when the TV is the source), what's playing, where it is in the song (drag to seek), shuffle, previous, play/pause, next and repeat, a volume slider with mute, and chips for the receiver's source and sound mode that open a list over the card, plus a power button. When it's off: what played last, Turn on, and your favourites.
- **Favourites:** your playlists and radio stations as two rows of tiles that scroll sideways (`favourites`, each with `name`, `type: playlist` or `radio`, `media_content_id`, and optionally `media_content_type`, `source`, `image`, `entity`, or `action` to run a script instead). One tap turns the receiver on if needed, switches the source and starts it, on `favourites_player` if set (a Music Assistant or Spotify player). The one that's playing is marked.
- Every icon on the music card, in both sizes, is now Lucide's shape, built in.

## 2.39.1 (2026-11-24)

- Home card: new option *Weather pop-up* (for example `#weather`). Tapping the weather opens that Bubble pop-up instead of the weather's details.

## 2.39.0 (2026-11-24)

- **Home card on a phone: the glance strip.**
  - New option *Hourly chart* (show, desktop only, hide). With *desktop only* the card on a phone is a short strip: the date, the clock and the weather, the chips and the tip.
  - On a phone the chips are smaller and sit side by side. With more than one problem, the problem chip names the first and adds “+2”; the badge counts them all. When the chips would need more than two rows, the lights and then the bins chip keep only their icon and count. Shorter words too: “GFT tonight”, “lights on”.
  - **Needs you:** tapping the problem chip (with more than one problem) opens a list over the card, the way Lights on does: each problem with its state, tap a name for its details, and a button where there is one obvious thing to do (Lock for an unlocked door, Emptied for the washing machine). On a phone both lists take the card's place and the card grows to fit them.
  - On a tablet or desktop nothing changes.
- **New: scene pills** (`custom:cranberry-scenes-card`): several scenes as one row of pills that scrolls sideways (drag it with a mouse); the one picked last in cranberry.

## 2.38.4 (2026-11-24)

- A flick with the mouse keeps a scrolling row gliding and slowing down, like on a phone. Stopping before letting go means no glide; a click or the scroll wheel stops it.

## 2.38.3 (2026-11-24)

- Rows that scroll sideways can be dragged with a mouse: the weather card's hours, the car card's choices and the thermostat's modes. The cursor shows a hand when there is more to see. A drag never counts as a tap, so dragging the car's chips doesn't pick one. Touch scrolls as before.

## 2.38.2 (2026-11-24)

- Scene card: the icon stands on its own, without the box behind it. Icon and name are muted until the scene is picked, then cream on cranberry.

## 2.38.1 (2026-11-24)

- Scene card: a picked scene is the deep cranberry fill in dark mode too, like the home card, instead of the lighter accent.

## 2.38.0 (2026-11-24)

- **Lucide icons for every small icon**, built into the cards, so they look the same with or without the Lucide icons integration: the home card's hourly chart, its tip and chips, the lights menu, and the weather card. Pouring rain and hail have their own icon now; the cold-weather tip shows a thermometer. The large filled weather picture on the home card stays as it is.

## 2.37.2 (2026-11-24)

- The partly cloudy icon is a sun peeking out from behind a cloud again, instead of a sun drawn through the cloud. Same for the moon at night. In the weather card and the home card's hourly chart (without the Lucide icons integration).

## 2.37.1 (2026-11-24)

- Weather card: the same weather icons as the home card. Lucide icons (cloud-sun, cloud-rain, moon, …) when the Lucide icons integration is installed, the cards’ own drawn icons otherwise.
- 2.37.0 was not released (its build check failed); this release includes it.

## 2.37.0 (2026-11-24)

- **New: weather card**, for a balcony or garden pop-up. The temperature now, the condition and "Feels like 6° · max 10°", with a switch between two views:
  - **Hours:** a sentence ("Dry until about 19:00, then rain for about 2 hours."; it adds gusts when it gets windy), then wind, rain today, sunset or sunrise and humidity, then the next 24 hours as a strip that scrolls sideways. Midnight shows the day; blue bars are rain.
  - **Days:** a sentence ("Thursday looks best: dry, up to 7°. Friday brings the most rain."), then today and the next six: chance of rain and a low-to-high bar on one scale, with a dot for the temperature now.
  - It remembers the view picked last on each device. Without a daily forecast there is no switch, just Hours. In Dutch too.
- Uses the theme's new rain colour (`cc-rain`); use with theme 4.3.0.

## 2.36.0 (2026-11-24)

- **Updates chip for admins.** The people card shows a chip before the people when Home Assistant, an add-on or an integration can be updated: the name and version for one ("Home Assistant Core 2026.12.0"), the count for more ("3 updates"), and a ring with the percentage while one installs. Only admins see it, and only updates that can be installed from Home Assistant count (firmware that updates itself is left out, as are skipped versions). Tapping opens Settings › Updates. On a phone it shows just the count. Switch it off with `updates: false` or in the editor.

## 2.35.0 (2026-11-24)

Every card checked at every width it can have (from half a column on a phone to a wide desktop), in English and Dutch. Nothing sticks out of a card any more, and rows no longer break onto a second line:

- **Thermostat:** the modes stay on one row and scroll sideways when they don't fit, with a fade at the edge and the current mode in view. The full card now needs a whole column. Compact on a phone puts its sentence under the setpoint instead of cutting it off.
- **Status card:** the buttons get smaller on a phone; a labelled button ("Lock") keeps only its icon; at half a column the round icon goes, and an alarm shows only its current mode (tap the card for the others). Temperatures read "21° · 19.4°" instead of "21 °C · 19.4 °C" (`short: false` brings the unit back).
- **Washing machine:** the steps stay on one row; when narrow, only the current step shows.
- **Music:** on a phone the buttons are smaller; at half a column only play or pause, then no cover.
- **Room:** at half a column the temperature is shown instead of the brightness.
- **Bins:** the reminder may take two lines instead of losing its end ("GFT en papier vanavond buiten zetten"); the button keeps only its icon when narrow.
- **Car:** the place, layer and zone chips stay on one row and scroll sideways; "Parked at …" may take two lines.
- **Calendar:** on a phone the time sits above the event, so the title gets the whole width instead of being cut off.

## 2.34.1 (2026-11-24)

- Home card: the weather details always stay on one row. The columns are only as wide as their text; when the weather side is too narrow, sunrise or sunset is left out first, then wind. In Dutch the labels are shorter ("Zon onder").

## 2.34.0 (2026-11-24)

- **Dutch.** Every card and its editor speaks Dutch when your Home Assistant language is Dutch ("Verwarmt naar 21° · 19,5°", "GFT en papier vanavond buiten zetten", "Alles rustig."). Any other language stays English. The home card's own weather warnings and advice follow too, and the wind direction reads ZW instead of SW.
- **Calendar: change and delete events.** An event's details have Edit and Delete, for calendars that allow it (Local calendar, Google Calendar). Edit opens the same form as New event; a repeating event asks whether to delete only this one or this one and all after. The editor option is now "Add, change and delete events".
- **The same "Not responding" everywhere.** When a device is unavailable, every card shows it the same way: faded, a grey icon and "Not responding". The calendar marks a calendar that doesn't answer in its legend, or the whole card when none do.
- Readable colours, checked by the theme's new contrast test: the brick error and Delete text, stone, ochre and calendar colours 3–5 are a little deeper in light mode, and coloured fills on olive cards use the fill colour instead of the lighter accent. Use with theme 4.2.0.

## 2.33.0 (2026-11-24)

- **Every colour comes from the theme.** The cards no longer contain their own colour values: the thermostat states, the hero, the weather art, the temperature line, the bins, the calendar dots and the translucent layers on coloured cards all use the Cranberry Canvas theme's tokens. The fallbacks for when the theme isn't installed are in one place, `src/home/05-tokens.js`. Use with theme 4.1.0 or newer; with an older theme the cards look the same through those fallbacks.
- Bin colours follow the theme per mode, instead of the card checking for dark mode itself.
- The washer card's "now" step is cream instead of white, like the rest of the palette.
- **Built from source:** the cards are written in `src/`, one file per card, and built into `dist/cranberry-cards.js` with esbuild. It's minified now: 60 → 50 KB to download. CI checks the build matches the source.

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
