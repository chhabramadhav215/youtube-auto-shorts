import fs from 'fs';
import http from 'http';
import url from 'url';
import readline from 'readline';
import { google } from 'googleapis';
import { config } from './src/config.js';
import { logger } from './src/utils/logger.js';

async function authenticate() {
  console.log('\n=============================================================');
  console.log('       YOUTUBE DATA API v3 - ONE-TIME AUTHENTICATION         ');
  console.log('=============================================================\n');

  if (!fs.existsSync(config.youtube.clientSecretPath)) {
    logger.error(`client_secret.json not found at: ${config.youtube.clientSecretPath}`);
    logger.info('Please ensure client_secret.json is in the project root directory.');
    process.exit(1);
  }

  const rawSecret = JSON.parse(fs.readFileSync(config.youtube.clientSecretPath, 'utf8'));
  const credentials = rawSecret.installed || rawSecret.web;

  if (!credentials) {
    logger.error('Invalid client_secret.json: missing "installed" or "web" credentials object.');
    process.exit(1);
  }

  const { client_id, client_secret } = credentials;
  const PORT = 3000;
  const redirectUri = `http://localhost:${PORT}/oauth2callback`;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirectUri
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Crucial for getting refresh_token
    prompt: 'consent',      // Forces Google to issue a refresh_token
    scope: config.youtube.scopes,
  });

  console.log('STEP 1: Open the following URL in your web browser:\n');
  console.log(`\x1b[34m${authUrl}\x1b[0m\n`);
  console.log('STEP 2: Sign in with the Google Account that owns your YouTube Channel.');
  console.log('STEP 3: Grant permissions. Google will redirect back to this script to finish.\n');

  let resolved = false;

  const finishAuth = async (code) => {
    if (resolved) return;
    resolved = true;

    try {
      logger.info('Exchanging authorization code for permanent tokens...');
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Save tokens permanently
      fs.writeFileSync(config.youtube.tokenPath, JSON.stringify(tokens, null, 2));
      logger.success(`Permanent tokens saved to: ${config.youtube.tokenPath}`);

      // Verify connection by getting channel details
      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
      const channelRes = await youtube.channels.list({
        part: ['snippet', 'statistics'],
        mine: true,
      });

      const channel = channelRes.data.items?.[0];
      if (channel) {
        console.log('\n-------------------------------------------------------------');
        console.log(` CHANNEL CONNECTED: \x1b[32m${channel.snippet.title}\x1b[0m`);
        console.log(` Channel ID:       ${channel.id}`);
        console.log(` Subscriber Count: ${channel.statistics.subscriberCount || 'Hidden'}`);
        console.log(` Video Count:      ${channel.statistics.videoCount || 0}`);
        console.log('-------------------------------------------------------------\n');
      } else {
        logger.warn('Token saved, but no channel found on this Google account. Please ensure your channel exists.');
      }

      logger.success('YouTube Authentication setup is COMPLETE!');
      logger.info('You can now start the automated publisher using: npm start');
      setTimeout(() => process.exit(0), 1000);
    } catch (err) {
      logger.error('Failed to exchange tokens:', err.message);
      process.exit(1);
    }
  };

  // 1. Setup local HTTP server to capture browser redirect callback automatically
  const server = http.createServer(async (req, res) => {
    try {
      const parsedUrl = url.parse(req.url, true);
      if (parsedUrl.pathname === '/oauth2callback' || parsedUrl.pathname === '/') {
        const code = parsedUrl.query.code;
        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #0d1117; color: #58a6ff;">
                <h1>&#10004; Authentication Successful!</h1>
                <p style="color: #c9d1d9; font-size: 18px;">Your permanent YouTube tokens have been saved. You can close this window now.</p>
              </body>
            </html>
          `);
          server.close();
          await finishAuth(code);
        } else if (parsedUrl.query.error) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Authentication Error: ' + parsedUrl.query.error);
        }
      }
    } catch (e) {
      logger.error('Error handling redirect:', e.message);
    }
  });

  server.listen(PORT, () => {
    logger.info(`Listening for callback on ${redirectUri}...`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.warn(`Port ${PORT} in use, will rely on manual code paste below.`);
    }
  });

  // 2. Setup manual readline fallback in case user wants or needs to paste the code
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\x1b[33mTip:\x1b[0m If the browser does not automatically redirect or shows an error,');
  console.log('copy the authorization code from the URL (or paste the full redirected URL) below:');
  
  rl.question('\nEnter code or URL: ', async (input) => {
    rl.close();
    try {
      server.close();
    } catch (e) {}

    let code = input.trim();
    if (code.includes('code=')) {
      const match = code.match(/code=([^&]+)/);
      if (match) code = decodeURIComponent(match[1]);
    }
    await finishAuth(code);
  });
}

authenticate();
