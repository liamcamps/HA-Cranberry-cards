// Cranberry music card: the full size for a pop-up
const { JSDOM } = require('jsdom');
const fs = require('fs');
const code = fs.readFileSync(__dirname + '/../dist/cranberry-cards.js', 'utf8');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window; w.console.info = () => {}; w.eval(code);
const calls = [];
const F = 1 | 2 | 4 | 8 | 16 | 32 | 128 | 256 | 512 | 2048 | 16384 | 32768 | 65536 | 262144;
const player = (state, a) => ({ entity_id: 'media_player.denon', state, attributes: Object.assign({ friendly_name: 'Denon', supported_features: F, source_list: ['Spotify', 'TV', 'Bluetooth'], sound_mode_list: ['Stereo', 'Dolby'] }, a), last_changed: new Date().toISOString() });
const hass = (st) => ({ states: { 'media_player.denon': st }, language: 'en', entities: {}, callService: (d, s, data) => { calls.push([d, s, data]); return Promise.resolve(); }, formatEntityState: (x) => x.state });
const favourites = [
  { name: 'Sunday morning', type: 'playlist', media_content_id: 'spotify:playlist:1' },
  { name: 'Dinner jazz', type: 'playlist', media_content_id: 'spotify:playlist:2', image: '/local/jazz.jpg' },
  { name: 'NPO Radio 2', type: 'radio', media_content_id: 'https://radio/2', source: 'Network' }
];
const el = w.document.createElement('cranberry-media-card'); w.document.body.appendChild(el);
el.setConfig({ entity: 'media_player.denon', size: 'full', favourites, favourites_player: 'media_player.ma_living' });
const $ = (s) => el.shadowRoot.querySelector(s), $$ = (s) => [...el.shadowRoot.querySelectorAll(s)];
const now = new Date().toISOString();
el.hass = hass(player('playing', { media_title: 'Harvest Moon', media_artist: 'Neil Young', media_album_name: 'Harvest Moon', app_name: 'Spotify', source: 'Spotify', sound_mode: 'Stereo', media_playlist: 'Sunday morning', media_duration: 303, media_position: 112, media_position_updated_at: now, volume_level: 0.42, shuffle: false, repeat: 'off', entity_picture: '/api/cover.jpg' }));

ok($('ha-card.full.playing') && $('.cover').getAttribute('style').includes('/api/cover.jpg'), 'olive, with the big cover');
ok($('.what b').textContent === 'Harvest Moon' && $('.what span').textContent === 'Neil Young · Harvest Moon' && $('.what small').textContent === 'Spotify · Sunday morning', 'what is playing: ' + $('.what').textContent);
ok($('.times').textContent === '1:52−3:11' && Math.abs(parseFloat($('.bar i').style.width) - 36.96) < 1, 'progress: ' + $('.times').textContent);
ok($('.controls [data-act="media_pause"]') && $('.controls [data-act="shuffle"]') && $('.controls [data-act="repeat"]') && !$('ha-icon'), 'controls, all built-in icons');
ok($('.vol .pct').textContent === '42%' && $('.vslider i').style.width === '42%', 'volume 42%');
ok($('.chip[data-arg="source"] span').textContent === 'Spotify' && $('.chip[data-arg="sound"] span').textContent === 'Stereo' && $('.pwr'), 'source, sound mode, power');
ok($$('.favs .k').map((x) => x.textContent).join() === 'Playlists,Radio' && $$('.fav').length === 3, 'favourites in two rows');
ok($$('.fav')[0].querySelector('em') && !$$('.fav')[1].querySelector('em'), 'the playlist that is on is marked Playing');
ok($$('.fav')[1].querySelector('.t').getAttribute('style').includes('/local/jazz.jpg'), 'a picture when given');
ok($$('.favrow').every((r) => r.classList.contains('scrollrow')), 'rows scroll sideways');

// the source menu
$('.chip[data-arg="source"]').click();
ok($('.menu') && $$('.menu .opt').length === 3 && $('.menu .opt[aria-checked="true"]').textContent === 'Spotify', 'source list over the card');
$$('.menu .opt')[1].click();
ok(calls.some((c) => c[1] === 'select_source' && c[2].source === 'TV') && !$('.menu'), 'picking TV switches the source and closes');
calls.length = 0;
$('.controls [data-act="repeat"]').click(); $('.controls [data-act="shuffle"]').click(); $('.vbtn').click();
ok(calls[0][1] === 'repeat_set' && calls[0][2].repeat === 'all' && calls[1][1] === 'shuffle_set' && calls[1][2].shuffle === true && calls[2][1] === 'volume_mute' && calls[2][2].is_volume_muted === true, 'repeat, shuffle, mute: ' + JSON.stringify(calls));

// a favourite while off: turn on, switch source, then play on the favourites player
(async () => {
  calls.length = 0;
  el.hass = hass(player('off', { source: 'Spotify' }));
  ok($('.off') && $('.off b').textContent === 'Off' && $('.off .state').textContent === 'Last played: Spotify' && $('button.on'), 'off: last played and Turn on');
  ok($('.favs') && !$('.cover') && !$('.chips'), 'off: favourites, no player');
  $$('.fav')[2].click();
  await new Promise((r) => setTimeout(r, 10));
  ok(calls[0][1] === 'turn_on' && calls[1][1] === 'select_source' && calls[1][2].source === 'Network' && calls[2][1] === 'play_media' && calls[2][2].entity_id === 'media_player.ma_living' && calls[2][2].media_content_id === 'https://radio/2' && calls[2][2].media_content_type === 'music', 'radio: on, source, play: ' + JSON.stringify(calls));
  calls.length = 0;
  el.setConfig({ entity: 'media_player.denon', size: 'full', favourites: [{ name: 'Morning', action: { service: 'script.turn_on', data: { entity_id: 'script.morning_radio' } } }] });
  el.hass = hass(player('off', {}));
  $('.fav').click(); await new Promise((r) => setTimeout(r, 10));
  ok(calls.length === 1 && calls[0][0] === 'script' && calls[0][2].entity_id === 'script.morning_radio', 'or any action, such as a script');
  // TV: no cover, a TV icon
  el.setConfig({ entity: 'media_player.denon', size: 'full' });
  el.hass = hass(player('on', { source: 'TV', volume_level: 0.3 }));
  ok($('.cover svg path').getAttribute('d').startsWith('M4 7h16') && $('.what b').textContent === 'TV' && !$('.pos'), 'TV: the TV icon, no progress');
  // the row size uses the same built-in icons
  const row = w.document.createElement('cranberry-media-card'); w.document.body.appendChild(row);
  row.setConfig({ entity: 'media_player.denon' }); row.hass = hass(player('playing', { media_title: 'Song' }));
  ok(row.shadowRoot.querySelector('.ctl.main svg') && !row.shadowRoot.querySelector('ha-icon'), 'the row: built-in icons too');
  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
