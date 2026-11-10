/**
 * Wraps text into multiple lines without cutting off words mid-way
 * @param {string} text
 * @param {number} maxChars
 * @returns {string[]}
 */
export function wrapText(text, maxChars = 28) {
  if (!text) return [];
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Auto-summarizes news headlines into a clean, punchy 2-line title (max 50 chars)
 * Never truncates with trailing dots like 'sp...'.
 * @param {string} rawHeadline
 * @returns {{ line1: string, line2: string, fullSummary: string }}
 */
export function summarizeNewsHeadline(rawHeadline) {
  if (!rawHeadline) {
    return { line1: 'BREAKING NEWS', line2: 'LATEST UPDATE', fullSummary: 'BREAKING NEWS UPDATE' };
  }

  let text = rawHeadline
    .replace(/^EXPLAINED:\s*/i, '')
    .replace(/^WATCH:\s*/i, '')
    .replace(/^BREAKING:\s*/i, '')
    .replace(/^JUST IN:\s*/i, '')
    .replace(/🚨/g, '')
    .replace(/['":;%\\#]/g, '')
    .replace(/\s+[-|]\s+[A-Za-z0-9\s]{2,25}$/, '') // Clean publication like " - The Hindu"
    .replace(/\s*\.\.\.\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If text exceeds 50 chars, smart summarize to under 50 chars at a clean word boundary
  if (text.length > 50) {
    const clauseRegex = /\s+(after|as|amid|following|ahead of|over|says|warns)\s+/i;
    const match = text.match(clauseRegex);
    if (match && match.index && match.index >= 18 && match.index <= 48) {
      text = text.substring(0, match.index).trim();
    } else {
      const sub = text.substring(0, 48);
      const lastSpace = sub.lastIndexOf(' ');
      if (lastSpace > 20) {
        text = sub.substring(0, lastSpace).trim();
      } else {
        text = sub.trim();
      }
    }
  }

  // Remove any trailing dashes or punctuation
  text = text.replace(/[,;.\-\s]+$/, '').trim();

  const words = text.split(' ').filter(Boolean);
  if (words.length <= 1) {
    return { line1: text.toUpperCase(), line2: '', fullSummary: text.toUpperCase() };
  }

  // Find optimal split point closest to center character count
  const targetLen = text.length / 2;
  let bestIdx = 1;
  let bestDiff = 999;
  let currentLen = 0;

  for (let i = 0; i < words.length - 1; i++) {
    currentLen += words[i].length + 1;
    const diff = Math.abs(currentLen - targetLen);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i + 1;
    }
  }

  const line1 = words.slice(0, bestIdx).join(' ').toUpperCase();
  const line2 = words.slice(bestIdx).join(' ').toUpperCase();

  return {
    line1,
    line2,
    fullSummary: `${line1} ${line2}`.trim(),
  };
}
