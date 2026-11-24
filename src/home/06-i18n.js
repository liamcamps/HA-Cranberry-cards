  // ---------- Language ----------
  // The cards speak Dutch when the user's Home Assistant language is Dutch, English otherwise.
  // The texts are written in English in the cards; NL (in 07-nl.js) holds the Dutch for each.
  // Parts in {braces} are filled in: t('Heating to {temp}', { temp: '21°' }).
  // A word that means two things gets a tag in its key, 'Heat@warning', which English leaves off.
  const isNl = (hass) => /^nl\b/i.test(String((hass && ((hass.locale && hass.locale.language) || hass.language)) || ''));
  const tr = (hass, text, vars) => {
    let out = isNl(hass) && typeof NL !== 'undefined' && NL[text] != null ? NL[text] : String(text).replace(/@[a-z]+$/, '');
    if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? String(vars[k]) : m));
    return out;
  };
  // the editor forms: section titles and the labels of choices, in the user's language
  const trSchema = (hass, schema) => (isNl(hass) ? JSON.parse(JSON.stringify(schema), (k, v) => ((k === 'label' || k === 'title') && typeof v === 'string' ? tr(hass, v) : v)) : schema);

