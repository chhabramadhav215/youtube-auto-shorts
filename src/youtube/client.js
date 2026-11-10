import fs from 'fs';
import { google } from 'googleapis';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

let cachedClient = null;

export function getOAuth2Client() {
  let credentials = null;

  // 1. Try reading client secret from Environment Variable (GitHub Secrets)
  if (process.env.YOUTUBE_CLIENT_SECRET_JSON) {
    try {
      const rawSecret = JSON.parse(process.env.YOUTUBE_CLIENT_SECRET_JSON);
      credentials = rawSecret.installed || rawSecret.web || rawSecret;
      logger.info('Loaded YouTube client credentials from YOUTUBE_CLIENT_SECRET_JSON secret.');
      // Auto-save to client_secret.json on disk if not already present
      if (!fs.existsSync(config.youtube.clientSecretPath)) {
        try { fs.writeFileSync(config.youtube.clientSecretPath, process.env.YOUTUBE_CLIENT_SECRET_JSON, 'utf8'); } catch (e) {}
      }
    } catch (e) {
      logger.warn(`Failed to parse YOUTUBE_CLIENT_SECRET_JSON: ${e.message}`);
    }
  } else if (process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET) {
    credentials = {
      client_id: process.env.YOUTUBE_CLIENT_ID,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET,
    };
    logger.info('Loaded YouTube client credentials from individual environment variables.');
  }

  // 2. Fall back to local file on disk
  if (!credentials && fs.existsSync(config.youtube.clientSecretPath)) {
    try {
      const rawSecret = JSON.parse(fs.readFileSync(config.youtube.clientSecretPath, 'utf8'));
      credentials = rawSecret.installed || rawSecret.web || rawSecret;
    } catch (e) {
      logger.warn(`Failed to read client_secret.json: ${e.message}`);
    }
  }

  if (!credentials || !credentials.client_id || !credentials.client_secret) {
    throw new Error('Missing YouTube OAuth client credentials! Provide YOUTUBE_CLIENT_SECRET_JSON secret or client_secret.json file.');
  }

  const { client_id, client_secret } = credentials;
  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    'http://localhost:3000/oauth2callback'
  );

  // 3. Try reading token from Environment Variable (GitHub Secrets)
  let tokens = null;
  if (process.env.YOUTUBE_TOKEN_JSON) {
    try {
      tokens = JSON.parse(process.env.YOUTUBE_TOKEN_JSON);
      logger.info('Loaded YouTube OAuth tokens from YOUTUBE_TOKEN_JSON secret.');
      // Auto-save to token.json on disk if not already present
      if (!fs.existsSync(config.youtube.tokenPath)) {
        try { fs.writeFileSync(config.youtube.tokenPath, process.env.YOUTUBE_TOKEN_JSON, 'utf8'); } catch (e) {}
      }
    } catch (e) {
      logger.warn(`Failed to parse YOUTUBE_TOKEN_JSON: ${e.message}`);
    }
  } else if (process.env.YOUTUBE_REFRESH_TOKEN) {
    tokens = {
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
      token_type: 'Bearer',
    };
    logger.info('Loaded YouTube OAuth refresh token from YOUTUBE_REFRESH_TOKEN secret.');
  }

  // 4. Fall back to local token.json file on disk
  if (!tokens && fs.existsSync(config.youtube.tokenPath)) {
    try {
      tokens = JSON.parse(fs.readFileSync(config.youtube.tokenPath, 'utf8'));
    } catch (e) {
      logger.warn(`Failed to read token.json: ${e.message}`);
    }
  }

  if (!tokens || (!tokens.refresh_token && !tokens.access_token)) {
    throw new Error('Permanent YouTube OAuth token missing! Set YOUTUBE_TOKEN_JSON in GitHub Secrets or run npm run auth locally.');
  }

  oauth2Client.setCredentials(tokens);

  // Automatically persist refreshed tokens
  oauth2Client.on('tokens', (newTokens) => {
    logger.info('YouTube OAuth access token refreshed automatically.');
    try {
      const updatedTokens = {
        ...tokens,
        ...newTokens,
      };
      fs.writeFileSync(config.youtube.tokenPath, JSON.stringify(updatedTokens, null, 2));
    } catch (err) {
      // Safe to ignore in read-only/ephemeral cloud runner
    }
  });

  return oauth2Client;
}

export function getYouTubeService() {
  if (cachedClient) return cachedClient;
  const auth = getOAuth2Client();
  cachedClient = google.youtube({ version: 'v3', auth });
  return cachedClient;
}

export async function checkYouTubeAuth() {
  try {
    const youtube = getYouTubeService();
    const res = await youtube.channels.list({
      part: ['snippet', 'statistics'],
      mine: true,
    });
    const channel = res.data.items?.[0];
    if (channel) {
      return {
        authenticated: true,
        channelTitle: channel.snippet.title,
        channelId: channel.id,
        subscribers: channel.statistics.subscriberCount,
      };
    }
    return { authenticated: false, error: 'No channel found for authenticated account' };
  } catch (err) {
    return { authenticated: false, error: err.message };
  }
}
