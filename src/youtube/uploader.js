import fs from 'fs';
import { getYouTubeService } from './client.js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

/**
 * Uploads a video to YouTube as a Short
 * @param {Object} params
 * @param {string} params.videoPath - Path to MP4 file
 * @param {string} params.title - Video title
 * @param {string} params.description - Video description
 * @param {string[]} params.tags - List of tags
 * @param {string} [params.categoryId] - YouTube video category ID (default '24' Entertainment)
 * @param {string} [params.privacyStatus] - 'public', 'unlisted', or 'private'
 */
export async function uploadShort({
  videoPath,
  title,
  description,
  tags = [],
  categoryId = '24',
  privacyStatus = config.youtube.privacyStatus,
}) {
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video file does not exist: ${videoPath}`);
  }

  const fileSize = fs.statSync(videoPath).size;
  if (fileSize < 1000) {
    throw new Error(`Invalid video file size (${fileSize} bytes) at ${videoPath}`);
  }

  // Ensure #Shorts is present in title
  let finalTitle = title.trim();
  if (!finalTitle.toLowerCase().includes('#shorts')) {
    finalTitle = `${finalTitle} #Shorts`;
  }
  // YouTube title limit is 100 characters
  if (finalTitle.length > 100) {
    finalTitle = finalTitle.substring(0, 92) + '... #Shorts';
  }

  const youtube = getYouTubeService();

  logger.info(`Starting YouTube Short upload: "${finalTitle}" (${(fileSize / (1024 * 1024)).toFixed(2)} MB)`);
  logger.info(`Privacy: ${privacyStatus.toUpperCase()}`);

  const res = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: finalTitle,
        description: `${description}\n\n#Shorts #YouTubeShorts #ViralShorts`,
        tags: Array.from(new Set(['shorts', 'youtube shorts', ...tags])),
        categoryId,
        defaultLanguage: 'en',
        defaultAudioLanguage: 'en',
      },
      status: {
        privacyStatus: privacyStatus || 'public',
        selfDeclaredMadeForKids: false,
        embeddable: true,
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  const videoId = res.data.id;
  const shortsUrl = `https://youtube.com/shorts/${videoId}`;

  logger.success(`Upload complete! Video ID: ${videoId}`);
  logger.success(`Shorts URL: ${shortsUrl}`);

  return {
    success: true,
    videoId,
    url: shortsUrl,
    title: finalTitle,
    privacyStatus,
  };
}
