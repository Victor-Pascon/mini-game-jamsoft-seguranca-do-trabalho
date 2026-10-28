/**
 * Utilitários de texto para canvas.
 * A quebra é feita por caracteres para manter o mesmo ritmo do projeto original.
 */
export function wrapText(text, maxChars = 52) {
  if (text === null || text === undefined) return [];

  const source = String(text);
  const paragraphs = source.split('\n');
  const lines = [];

  for (let p = 0; p < paragraphs.length; p++) {
    const paragraph = paragraphs[p].trim();
    if (!paragraph) {
      lines.push('');
      continue;
    }

    const words = paragraph.split(/\s+/).filter(Boolean);
    let current = '';

    for (const word of words) {
      if (current.length === 0) {
        current = word;
      } else if ((current + ' ' + word).length <= maxChars) {
        current += ' ' + word;
      } else {
        lines.push(current);
        current = word;
      }
    }

    if (current) lines.push(current);
    if (p < paragraphs.length - 1) lines.push('');
  }

  return lines;
}

export function truncate(text, maxChars = 40) {
  const value = String(text ?? '');
  if (value.length <= maxChars) return value;
  return value.slice(0, Math.max(0, maxChars - 1)).trimEnd() + '…';
}

export function capitalize(text) {
  const value = String(text ?? '');
  return value.length ? value[0].toUpperCase() + value.slice(1) : value;
}
