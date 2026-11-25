  // Cranberry heading: Home Assistant's own heading, but it hides itself while every card under it
  // in the section is hidden (a waste card with nothing to put out, an idle washing machine), so a
  // section never shows a title over nothing. It watches the cards after it, up to the next heading
  // or `follows` cards, and shows again as soon as one of them does.
  class CranberryHeadingCard extends HTMLElement {
    setConfig(config) {
      if (!config || !config.heading) throw new Error('Set a heading');
      this._config = config;
      const inner = Object.assign({}, config, { type: 'heading' });
      delete inner.follows;
      this._innerCfg = inner;
      this._build();
    }
    async _build() {
      const cfg = this._innerCfg;
      let el = null;
      try {
        const helpers = window.loadCardHelpers ? await window.loadCardHelpers() : null;
        if (helpers) el = await helpers.createCardElement(cfg);
      } catch (e) { el = null; }
      if (cfg !== this._innerCfg) return;
      if (!el) {
        // no card helpers (outside Home Assistant): a plain title
        el = document.createElement('div');
        el.textContent = cfg.heading;
        el.style.cssText = 'font-size:16px;font-weight:500;padding:8px 0';
      }
      if (this._hass) el.hass = this._hass;
      this.replaceChildren(el);
      this._inner = el;
    }
    set hass(h) { this._hass = h; if (this._inner) this._inner.hass = h; this._schedule(); }
    set editMode(v) { this._edit = v; this._schedule(); }
    set preview(v) { this._preview = v; this._schedule(); }
    getCardSize() { return 1; }
    getGridOptions() { return { columns: 'full', rows: 'auto' }; }
    connectedCallback() {
      // the cards of a section sit side by side in one container, each in its own wrapper (a
      // hui-card, inside a grid cell): climb to the element that is one of the container's cards
      let unit = this;
      for (let i = 0; i < 4 && unit.parentElement && unit.parentElement.children.length === 1; i++) unit = unit.parentElement;
      this._wrap = unit;
      const box = this._wrap.parentNode;
      if (box && box !== this._box) {
        this._unwatch();
        this._box = box;
        this._onVis = (ev) => { if (!ev.composedPath().includes(this)) this._schedule(); };
        box.addEventListener('card-visibility-changed', this._onVis);
        this._mo = new MutationObserver(() => this._schedule());
        this._mo.observe(box, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'style', 'class'] });
      }
      this._schedule();
    }
    disconnectedCallback() { this._unwatch(); }
    _unwatch() {
      if (this._box && this._onVis) this._box.removeEventListener('card-visibility-changed', this._onVis);
      if (this._mo) this._mo.disconnect();
      this._box = null; this._mo = null;
    }
    _schedule() {
      if (this._pending) return;
      this._pending = true;
      const run = () => { this._pending = false; this._check(); };
      (window.requestAnimationFrame || ((f) => setTimeout(f, 16)))(run);
    }
    _off(el) { return !el || el.hidden || el.hasAttribute('hidden') || (el.classList && el.classList.contains('hidden')) || (el.style && el.style.display === 'none'); }
    // the card itself, inside the grid cell and the hui-card wrapper around it
    _card(unit) {
      let el = unit;
      for (let i = 0; i < 4 && el && el.firstElementChild && !/-card$/.test(el.localName); i++) el = el.firstElementChild;
      if (el && el.localName === 'hui-card') el = el.firstElementChild || el;
      return el;
    }
    _shown(unit) {
      if (!unit || unit.nodeType !== 1) return false;
      // any wrapper on the way down, or the card itself, can be the one that is hidden
      for (let el = unit, i = 0; el && i < 5; el = el.firstElementChild, i++) {
        if (this._off(el)) return false;
        if (/-card$/.test(el.localName) && el.localName !== 'hui-card') break;
      }
      return true;
    }
    _isHeading(unit) {
      const card = this._card(unit);
      return !!card && /^(hui-heading-card|cranberry-heading-card)$/.test(card.localName);
    }
    _check() {
      if (!this._config) return;
      const editing = this._edit || this._preview || /[?&]edit=1/.test(window.location.search);
      let any = false;
      const max = Number(this._config.follows) || Infinity;
      let n = 0;
      for (let el = this._wrap && this._wrap.nextElementSibling; el && n < max; el = el.nextElementSibling) {
        if (this._isHeading(el)) break;
        n++;
        if (this._shown(el)) { any = true; break; }
      }
      // nothing after it to watch (on its own, or not in a section): stay visible
      if (!n) any = true;
      this._setHidden(!any && !editing);
    }
    _setHidden(hide) {
      if (this._hidden === hide) return;
      this._hidden = hide;
      this.style.display = hide ? 'none' : '';
      this.toggleAttribute('hidden', hide);
      this.dispatchEvent(new CustomEvent('card-visibility-changed', { detail: { value: !hide }, bubbles: true, composed: true }));
    }
  }
