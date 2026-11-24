  // ---------------------------------------------------------------- waste collection
  const BIN_PATH = 'M6 7h12l-1 13a1.5 1.5 0 0 1-1.5 1.4h-7A1.5 1.5 0 0 1 7 20zM4.5 5h15M10 3h4';
  const BIN_FILL = 'M7.4 10h9.2l-.7 10H8.1z';
  const binSvg = (col, size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="${BIN_PATH}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke:${col}"></path><path d="${BIN_FILL}" style="fill:${col}"></path></svg>`;

