import express, { text } from 'express';
//import { Bot } from 'y0red-bot';
import { Bot } from './y0red-bot/src/index.js';

// --- CONFIGURATION ---
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_SUPER_SECRET_BOT_TOKEN';
const GAME_SHORT_NAME = process.env.GAME_SHORT_NAME || 'PGA';
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://yg-mini-app-test.netlify.app/';//'https://your-domain.com/my-mini-app/index.html';
const PORT = process.env.PORT || 3000;

// 1. Create a new Bot instance
const bot = new Bot(BOT_TOKEN);

// 2. Register handlers for commands and events

// Handle the /start and /game commands
bot.onCommand('/start', (ctx) => {
  const chatId = ctx.update.message.chat.id;
  console.log(`Received /start command from chat ID: ${chatId}`);
  ctx.api.sendMessageWithGame({
    chat_id: chatId,
    game_short_name: GAME_SHORT_NAME,
    text: 'Welcome! Ready to play?',
    button_text: '🚀 Launch Game!'
  }).catch(console.error);
});

// The '/game' command can do the same thing
bot.onCommand('/game', (ctx) => {
    //bot.commandHandlers.get('/start')(ctx);
    console.log(`sending game`);
    const chatId = ctx.update.message.chat.id;
  ctx.api.sendGame({
      chat_id: chatId,
      game_short_name: "PGGC",
      button_text: '🚀 Launch Game!'}
    ).catch(console.error);
});

bot.onCommand('/share', (ctx) => {
    //bot.commandHandlers.get('/start')(ctx);
    console.log(`share`);
    const chatId = ctx.update.message.chat.id;
  ctx.api.requestContact({
      chat_id: chatId,
      request_contact: true,
    }
    ).catch(console.error);
});
// Handle the /menu command for Mini Apps
bot.onCommand('/menu', (ctx) => {
  const chatId = ctx.update.message.chat.id;
  console.log(`Setting up menu button for chat ID: ${chatId}`);
  ctx.api.setMenuButton({
    chat_id: chatId,
    menu_button: {
      type: 'web_app',
      text: 'Open App',
      web_app: { url: MINI_APP_URL }
    }
  }).catch(console.error);
});
bot.onCommand('/score', (ctx) => {
  const chatId = ctx.update.message.chat.id;
  console.log('sending score');
  ctx.api.setGameScore({chatId, score: 20, game_short_name : 'PGGC' }
  ).catch(console.error);
});



// Handle the callback query when the user clicks "Launch Game!"
bot.onCallbackQuery((ctx) => {
  const callbackQuery = ctx.update.callback_query;
  console.log(`Received callback query: ${callbackQuery.data}`);
  console.log(ctx.update.callback_query.game_short_name);
   if(ctx.update.callback_query.game_short_name === "PGGC")
   {
     ctx.api.answerCallbackQuery({
      callback_query_id: callbackQuery.id,
      url: 'https://yg-mini-app-test.netlify.app/'
    }).catch("sendERROR"+console.error);
   }
});

// Handle any other text message
bot.onMessage((ctx) => {
    const chatId = ctx.update.message.chat.id;
    console.log(ctx.update);
    ctx.api.sendMessage({
        chat_id: chatId,
        text: "I'm a game bot! Try /game to start."
    }).catch(console.error);
});


// 3. Set up an Express server
const app = express();
app.use(express.json());

// 4. Use the webhook middleware provided by the Bot
app.use(bot.createWebhookMiddleware(`/`));

//app.get('/', (req, res) => {
  //res.send({ActivePlayers: playersCount, ActiveRooms: roomCount})
//})

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Bot server is running on port ${PORT}`);
  console.log('Set your webhook to: https://<your-public-url>/webhook/' + BOT_TOKEN);
});


{
  update_id: 802925049,
  message: {
    message_id: 181,
    from: {
      id: 352360707,
      is_bot: false,
      first_name: 'Yared',
      last_name: 'Ayele',
      username: 'y0red',
      language_code: 'en'
    },
    chat: {
      id: 352360707,
      first_name: 'Yared',
      last_name: 'Ayele',
      username: 'y0red',
      type: 'private'
    },
    date: 1751729165,
    reply_to_message: {
      message_id: 180,
      from: [Object],
      chat: [Object],
      date: 1751729131,
      text: 'Share Phone Number'
    },
    contact: {
      phone_number: '+251910876088',
      first_name: 'Yared',
      last_name: 'Ayele',
      user_id: 352360707
    }
  }
}