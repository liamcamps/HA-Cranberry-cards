  // ---------- Update in place, so CSS transitions can animate between states ----------
  const syncChildren = (cur, next) => {
    const a = Array.from(cur.childNodes), b = Array.from(next.childNodes);
    b.forEach((n, i) => {
      const o = a[i];
      if (!o) { cur.appendChild(n); return; }
      const sameEl = o.nodeType === 1 && n.nodeType === 1 && o.nodeName === n.nodeName && o.getAttribute('data-key') === n.getAttribute('data-key');
      if (o.nodeType !== n.nodeType || (o.nodeType === 1 && !sameEl)) { cur.replaceChild(n, o); return; }
      if (o.nodeType !== 1) { if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue; return; }
      Array.from(o.attributes).forEach((at) => { if (!n.hasAttribute(at.name)) o.removeAttribute(at.name); });
      Array.from(n.attributes).forEach((at) => { if (o.getAttribute(at.name) !== at.value) o.setAttribute(at.name, at.value); });
      if (o.hasAttribute('data-keep')) return; // filled by the card itself, e.g. an embedded map
      syncChildren(o, n);
    });
    for (let i = a.length - 1; i >= b.length; i--) cur.removeChild(a[i]);
  };
  const morph = (root, html) => {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    if (!root.firstChild) { root.appendChild(tpl.content); return; }
    syncChildren(root, tpl.content);
  };
  // gentle movement; switched off for people who prefer reduced motion
  const MOTION = `
    @keyframes cc-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
    @keyframes cc-sheen { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
    @media (prefers-reduced-motion: no-preference) {
      ha-card { transition: background-color .35s ease, color .35s ease, opacity .35s ease; }
      .ic, .tog, .extra, .bin, .btns button, .ctl, .act, .step, .issue, .bins, .day, .temp, .chip, .insight, .art { transition: background-color .3s ease, color .3s ease, opacity .3s ease; }
      .fill { transition: width .7s cubic-bezier(.2, .8, .2, 1), background-color .3s ease; }
      .bar span, .bars span { transition: width .8s cubic-bezier(.2, .8, .2, 1), height .6s cubic-bezier(.2, .8, .2, 1), opacity .3s ease; }
      .issue, .bins, .warn, .act, .step.now, .insight, .item.soon { animation: cc-in .35s ease both; }
      ha-card.running .bar span { overflow: hidden; }
      ha-card.running .bar span::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--cc-on) 28%, transparent), transparent); animation: cc-sheen 2.6s ease-in-out infinite; }
    }
  `;
  window.CranberryMorph = { morph, MOTION };

