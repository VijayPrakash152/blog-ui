export function makePlaceholderDataUrl(color = "#0B1220", width = 16, height = 9) {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' preserveAspectRatio='none'>
      <rect width='100%' height='100%' fill='${color}' />
    </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default makePlaceholderDataUrl;
