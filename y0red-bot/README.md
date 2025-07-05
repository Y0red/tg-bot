# y0red-bot
# Telegram Game & Mini App Client (y0red-bot)

A modular and extensible Node.js library designed to simplify the creation of Telegram **Games** and **Mini Apps**. This package provides a clean `Bot` class to handle webhook updates and a dedicated API client for interacting with the Telegram Bot API.

## Features

-   **Modular Design**: High-level bot logic is separate from the low-level API client.
-   **Extensible**: Easily register handlers for commands (`/start`), callback queries, and messages.
-   **Webhook Ready**: Includes a simple-to-use Express.js middleware to handle incoming updates from Telegram securely.
-   **NPM Package**: Structured and ready to be published and used in any Node.js project.
-   **Focused**: Built specifically for the needs of Games and Mini Apps developers.

## Installation

```bash
npm install y0red-bot express
```

## How to Use

### 1. Get Your Credentials
-   **Bot Token**: Get this from [@BotFather](https://t.me/BotFather) on Telegram.
-   **Game Short Name**: Create a game with `/newgame` via BotFather.
-   **Mini App URL**: The public HTTPS URL where your game or app is hosted.

### 2. Create Your Bot File

Create a file like `my-bot.js`:

```javascript
import express from 'express';
import { Bot } from 'y0red-bot';

// --- CONFIGURATION ---
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_SUPER_SECRET_BOT_TOKEN';
const GAME_SHORT_NAME = process.env.GAME_SHORT_NAME || 'your_game_short_name';
const MINI_APP_URL = process.env.MINI_APP_URL || '[https://your-domain.com/index.html](https://your-domain.com/index.html)';
const PORT = process.env.PORT || 3000;

// 1. Create a new Bot instance
const bot = new Bot(BOT_TOKEN);

// 2. Register handlers for commands and events
bot.onCommand('/start', (ctx) => {
  const chatId = ctx.update.message.chat.id;
  // ctx.api gives you access to all API methods
  ctx.api.sendMessageWithGame({
    chat_id: chatId,
    game_short_name: GAME_SHORT_NAME,
  }).catch(console.error);
});

bot.onCallbackQuery((ctx) => {
  const callbackQuery = ctx.update.callback_query;
  if (callbackQuery.data === `play_${GAME_SHORT_NAME}`) {
    ctx.api.answerCallbackQuery({
      callback_query_id: callbackQuery.id,
      url: MINI_APP_URL
    }).catch(console.error);
  }
});

// 3. Set up an Express server
const app = express();
app.use(express.json());

// 4. Use the webhook middleware provided by the Bot
// It will listen on the path /webhook/YOUR_BOT_TOKEN
app.use(bot.createWebhookMiddleware());

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Bot server is running on port ${PORT}`);
});
```

### 3. Set Your Webhook

Your bot needs a public URL. Use a service like **ngrok** during development.

```bash
# Expose your local server to the internet
ngrok http 3000
```

Ngrok will give you a public URL (e.g., `https://random-string.ngrok-free.app`). Now, tell Telegram where to send updates by running this `curl` command in your terminal:

```bash
curl "https://api.telegram.org/bot<bot-token>/setWebhook?url=<webhook-url>"

```
<bot-token> - bot token get from BotFather on Telegram
<webhook-url> - webhook url in base64


### 4. Run Your Bot
```bash
node my-bot.js
```
Your bot is now live and will process messages automatically.

## API Context (`ctx`) Object
All handlers receive a `ctx` (context) object with two properties:
-   `ctx.update`: The raw update object from Telegram.
-   `ctx.api`: An instance of `TelegramApiClient` for making API calls.
