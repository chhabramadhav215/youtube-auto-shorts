import { logger } from '../utils/logger.js';

/**
 * Fetches latest trending headlines from Google News RSS
 */
export async function fetchTrendingNews() {
  try {
    const rssUrl = 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en';
    const res = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    const items = [];
    const itemRegex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
      let title = match[1]
        .replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();

      // Clean publication name at end (e.g. " - The Hindu")
      const sourceMatch = title.match(/(.*?)\s*-\s*([^-]+)$/);
      let headline = title;
      let source = 'News';
      if (sourceMatch) {
        headline = sourceMatch[1].trim();
        source = sourceMatch[2].trim();
      }

      if (headline.length > 20) {
        items.push({
          headline,
          source,
          link: match[2].trim(),
          pubDate: match[3].trim(),
        });
      }
    }

    if (items.length > 0) {
      logger.info(`Fetched ${items.length} trending news stories from Google News RSS.`);
      return items;
    }
  } catch (err) {
    logger.warn(`Failed to fetch Google News RSS: ${err.message}. Using high-TRP fallback topics.`);
  }

  // Fallback high-TRP explainer topics
  return [
    {
      headline: 'ISRO Next-Gen Space Mission & Reusable Launch Vehicle Milestone',
      source: 'Space Tech',
    },
    {
      headline: 'Massive Gold Price Movement & Global Currency Shifts Explained',
      source: 'Market Watch',
    },
    {
      headline: 'Major New AI Regulation & Cybersecurity Security Policies Unveiled',
      source: 'Tech Explainer',
    },
  ];
}
