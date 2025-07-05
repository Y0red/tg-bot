import axios from 'axios';

/**
 * A low-level client for making requests to the Telegram Bot API.
 * This class is typically used internally by the Bot class.
 */
export class TelegramApiClient {
  /**
   * @param {string} botToken Your bot token from BotFather.
   */
  constructor(botToken) {
    if (!botToken) {
      throw new Error('Bot token is required.');
    }
    this.token = botToken;
    this.api = axios.create({
      baseURL: `https://api.telegram.org/bot${this.token}`,
    });
  }

  /**
   * A private helper to make API calls.
   * @param {string} methodName The Telegram API method name (e.g., 'sendMessage').
   * @param {object} payload The data to send with the request.
   * @returns {Promise<object>} The data from the Telegram API response.
   */
  async _apiCall(methodName, payload) {
    try {
      const response = await this.api.post(`/${methodName}`, payload);
      return response.data;
    } catch (error) {
      console.error(`[Telegram API Error] Method: ${methodName}`, error.response?.data || error.message);
      throw error;
    }
  }

  // --- Methods for Games and Mini Apps ---
 //callback_data: 'contact'
  sendMessageWithGame({ chat_id, game_short_name, text = 'share', button_text = 'share' , request_contact}) {
    return this._apiCall('sendMessage', {
      chat_id,
      text,
      reply_markup: {
        inline_keyboard: [
          [{ text: button_text, request_contact}]
        ]
      }
    });
  }

  requestContact({ chat_id, text = 'Share Phone Number', button_text = 'Share', request_contact }) {
    return this._apiCall('sendMessage', {
      chat_id,
      
      reply_markup: {
        inline_keyboard: [
          [{text: button_text, request_contact }]
        ]
      }
    });
  }

   sendGame({ chat_id, game_short_name, text = 'Let\'s play!', button_text = '🎮 Play Now' }) {
    return this._apiCall('sendGame', {
      chat_id,
      game_short_name,
      reply_markup_game: {
        inline_keyboard: [
          [{ text: button_text, callback_game: `play_${game_short_name}`, url: "https://t.me/PlayGroundGamesBot/PGGC"}]
        ]
      },
      
    });
  }


  answerCallbackQuery({ callback_query_id, url }) {
    return this._apiCall('answerCallbackQuery', {
      callback_query_id,
      url,
    });
  }

  answerCallbackQuery2({ callback_query_id, request_contact }) {
    return this._apiCall('answerCallbackQuery', {
      callback_query_id,
      request_contact,
    });
  }

  setGameScore(params) {
    return this._apiCall('setGameScore', params);
  }

  getGameHighScores(params) {
    return this._apiCall('getGameHighScores', params);
  }

  setMenuButton(params) {
    return this._apiCall('setChatMenuButton', params);
  }

  getMenuButton(params) {
    return this._apiCall('getChatMenuButton', params);
  }

  // --- General Methods ---
  
  sendMessage(params) {
    return this._apiCall('sendMessage', params);
  }
}
