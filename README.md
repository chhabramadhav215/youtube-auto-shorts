# 🎬 YouTube Shorts Automated Publishing Pipeline

A complete, production-ready automated YouTube Shorts pipeline built in **Node.js** featuring:
- **YouTube Data API v3 OAuth2 Integration**: One-time setup with auto-refreshing permanent tokens (`token.json`).
- **4 Daily Slots (Hindi Voiceover + English Subtitles & Titles)**:
  1. 👶 **Slot 1 (Entertainment)**: Cute baby dance / funny animation short with energetic Hindi voiceover and upbeat audio.
  2. 🕉️ **Slot 2 (Devotional)**: Heartwarming Hindu devotional story with peaceful Hindi narration and divine darshan.
  3. 🏹 **Slot 4 (Epic Scriptures & Wisdom Clips)**: Epic moments from Mahabharata, Ramayana, and Bhagavad Gita with 9:16 vertical blur margins, transformative Hindi moral context, and bold English subtitles.
  4. 🚨 **Slot 3 (Viral News)**: High-TRP trending news 30-40s breakdown explainer in Hindi (auto-scraped from Google News RSS).
- **Global Reach Subtitles & Titles**:
  - Voiceover synthesized in **Hindi** (`hi-IN-MadhurNeural`) for authentic local connection.
  - Subtitles burned-in in bold **English** (Alex Hormozi style) so global audiences can follow seamlessly.
  - Video Titles and Descriptions translated and formatted in **English** for international discoverability.
  - Mixed background audio ducking & procedural/stock vertical visuals.
  - SEO-optimized Titles, Descriptions, Tags, and `#Shorts`.
- **Telegram Bot Remote Control**: Trigger uploads, change topics, preview videos, or monitor status directly from your phone.
- **Daily Cron Scheduler**: Automatically generates and publishes videos at designated morning, afternoon, and evening slots.

---

## 📁 Project Structure

```
youtube-auto-shorts/
├── client_secret.json          # Google OAuth Client Secret (Desktop App)
├── token.json                  # Permanent OAuth2 refresh token (created by auth.js)
├── .env                        # Active environment configuration
├── .env.example                # Example configuration reference
├── package.json                # Dependencies and npm scripts
├── auth.js                     # One-time YouTube OAuth setup script
├── test-pipeline.js            # Standalone local rendering & testing tool
├── assets/
│   └── audio/                  # Background music beds (entertainment, devotional, news)
├── output/                     # Generated MP4 videos, audio, and subtitles
└── src/
    ├── config.js               # Central settings loader
    ├── index.js                # Main daemon (Telegram Bot + Cron Scheduler)
    ├── pipeline.js             # End-to-end media generation & publishing orchestrator
    ├── content/
    │   ├── news_fetcher.js     # Google News RSS scraper
    │   ├── slot1_entertainment.js # Baby dance / funny animation content
    │   ├── slot2_devotional.js    # Hindu devotional stories & darshan
    │   └── slot3_news.js          # 30-40s viral news breakdown explainer
    ├── generator/
    │   ├── tts.js              # Neural TTS voiceover engine
    │   ├── subtitles.js        # Timed bold ASS/SRT subtitle generator
    │   ├── visual_synth.js     # 1080x1920 9:16 procedural & stock video composer
    │   └── video_builder.js    # FFmpeg multi-track audio & subtitle burning engine
    ├── youtube/
    │   ├── client.js           # OAuth2 client & permanent token auto-refresher
    │   └── uploader.js         # YouTube Data API v3 video uploader
    ├── scheduler/
    │   └── cron.js             # Daily cron scheduler for the 3 slots
    ├── telegram/
    │   └── bot.js              # Telegram bot listener & phone trigger
    └── utils/
        ├── audio_beds.js       # Background audio synthesizer
        └── logger.js           # Console logger with timestamps & colors
```

---

## ⚡ Quick Start & Setup

### 1. Install Dependencies
```bash
npm install
```
*(Static FFmpeg and FFprobe binaries are included automatically via `ffmpeg-static` and `ffprobe-static` — no external system installations required!)*

---

### 2. One-Time YouTube Authentication
Run the authentication script:
```bash
npm run auth
```
*(or `node auth.js`)*

1. The script will display a Google authorization link in your terminal.
2. Open the URL in your browser, select your Google account, and grant YouTube access.
3. The local callback server (`http://localhost:3000/oauth2callback`) will automatically capture the code, exchange it for permanent refresh tokens, and save them to `token.json`.
4. Your connected channel name and subscriber count will be displayed in the terminal.

> **Note:** If the browser cannot automatically redirect back to localhost, copy the authorization code from the browser's address bar and paste it into the terminal prompt.

---

### 3. Configure Telegram Bot (Optional Phone Control)
1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Type `/newbot` and follow the prompts to get your bot token.
3. Open `.env` and fill in:
   ```env
   TELEGRAM_BOT_TOKEN="your_bot_token_here"
   ```
4. *(Recommended)* To ensure only you can trigger uploads from your phone, get your numeric User ID from [@userinfobot](https://t.me/userinfobot) and set:
   ```env
   TELEGRAM_ALLOWED_USER_ID="123456789"
   ```

---

### 4. Test Media Generation Locally (No Upload)
Verify video rendering, audio mixing, and subtitles for any slot without uploading to YouTube:

```bash
# Test Slot 1 (Entertainment: Cute Baby Dance)
node test-pipeline.js slot1

# Test Slot 2 (Devotional: Hindu Devotional Story)
node test-pipeline.js slot2

# Test Slot 3 (Viral News: Google News 30s Explainer)
node test-pipeline.js slot3

# Test Slot 3 with a Custom News Topic
node test-pipeline.js slot3 "ISRO Moon Mission Update"
```

The rendered 1080x1920 MP4 video will be saved in the `output/` folder.

---

### 5. Start the Automated Publisher (Daemon)
To start the daily scheduler and Telegram bot listener:
```bash
npm start
```
*(or `node src/index.js`)*

---

## 📱 Telegram Bot Commands

When running, you can interact with your pipeline from your phone anytime:

| Command | Action |
| :--- | :--- |
| `/start` or `/help` | Open the interactive control dashboard |
| `/status` | View YouTube channel connection & token status |
| `/slot1` | Immediately generate and upload Slot 1 Short (Cute Baby Dance) |
| `/slot2` | Immediately generate and upload Slot 2 Short (Hindu Devotional) |
| `/slot4` | Immediately generate and upload Slot 4 Short (Epic Scriptures & Wisdom Clips) |
| `/slot3` | Immediately generate and upload Slot 3 Short (Viral News Explainer) |
| `/news <topic>` | Generate and upload an explainer on a specific news headline |
| `/custom <prompt>` | Generate and upload a custom Short on any topic |
| `/preview slot1` | Render Slot 1 video and **send the MP4 directly to Telegram** for review |
| `/preview slot2` | Render Slot 2 video and send MP4 to Telegram |
| `/preview slot4` | Render Slot 4 video and send MP4 to Telegram |
| `/preview slot3` | Render Slot 3 video and send MP4 to Telegram |
| `/privacy public\|unlisted\|private` | Change YouTube upload visibility |

---

## ⏰ Daily Cron Slots Schedule

Configurable in `.env` (Timezone: `Asia/Kolkata`):

- **Slot 1 (Morning @ 09:00 AM IST)**:
  - Theme: Cute baby dance / funny animation short.
  - Voice: Energetic Hindi (`hi-IN-MadhurNeural`).
  - Style: Neon party aesthetic, bouncing dance character, upbeat audio bed, yellow bold subtitles.
  - Cron: `0 9 * * *`

- **Slot 2 (Afternoon @ 02:00 PM IST)**:
  - Theme: Heartwarming Hindu devotional story / divine darshan.
  - Voice: Peaceful Hindi (`hi-IN-MadhurNeural`).
  - Style: Golden radiant saffron aesthetic, sacred temple motif, meditative drone/flute bed, gold bold subtitles.
  - Cron: `0 14 * * *`

- **Slot 4 (Evening @ 05:00 PM IST)**:
  - Theme: Epic Hindu Scriptures & Wisdom Clips (Mahabharata, Ramayana, Bhagavad Gita dialogues/scenes).
  - Voice: Philosophical, deep Hindi explainer (`hi-IN-MadhurNeural`).
  - Style: 9:16 vertical canvas with **cinematic blur margins**, centered 16:9 clip frame, golden glowing border, top epic badge, and bold English subtitles.
  - Fair Use & Transformative compliance: Transformative moral commentary, scripture attribution, educational analysis.
  - Clip sourcing: Place custom MP4 clips in `assets/clips/scriptures/` or let the procedural epic synthesizer generate them.
  - Cron: `0 17 * * *`

- **Slot 3 (Night @ 07:30 PM IST)**:
  - Theme: Trending viral news / incident 30-40s breakdown explainer.
  - Voice: Fast-paced Hindi news anchor (`hi-IN-MadhurNeural`).
  - Style: Broadcast news layout, breaking news header badge, live ticker bar, white bold subtitles.
  - Cron: `30 19 * * *`

---

## 🛠️ Configuration Reference (`.env`)

```ini
# YouTube Settings
YOUTUBE_CLIENT_SECRET_PATH=./client_secret.json
YOUTUBE_TOKEN_PATH=./token.json
YOUTUBE_PRIVACY_STATUS=public   # 'public', 'unlisted', or 'private'

# Telegram Settings
TELEGRAM_BOT_TOKEN=
TELEGRAM_ALLOWED_USER_ID=

# Cron Schedules
SLOT1_CRON=0 9 * * *
SLOT2_CRON=0 14 * * *
SLOT4_CRON=0 17 * * *
SLOT3_CRON=30 19 * * *
TIMEZONE=Asia/Kolkata

# Neural Voices (Hindi Voiceover)
SLOT1_VOICE=hi-IN-MadhurNeural
SLOT2_VOICE=hi-IN-MadhurNeural
SLOT4_VOICE=hi-IN-MadhurNeural
SLOT3_VOICE=hi-IN-MadhurNeural
SLOT2_VOICE=hi-IN-MadhurNeural
SLOT3_VOICE=en-IN-PrabhatNeural

# Optional Stock Media & AI APIs
PEXELS_API_KEY=        # Free vertical stock videos from Pexels
GEMINI_API_KEY=        # Google Gemini AI for real-time script variations
```
