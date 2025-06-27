import { TelegramApiClient } from './client.js';

/**
 * The main Bot class that orchestrates updates and handlers.
 */
export class Bot {
  /**
   * @param {string} token The Telegram Bot Token.
   */
  constructor(token) {
    this.token = token;
    this.api = new TelegramApiClient(token);
    this.commandHandlers = new Map();
    this.callbackQueryHandler = null;
    this.messageHandler = null;
  }

  /**
   * Registers a handler for a specific command (e.g., /start).
   * @param {string} command The command text (e.g., '/start').
   * @param {(ctx: object) => void} handler The function to execute.
   */
  onCommand(command, handler) {
    this.commandHandlers.set(command, handler);
  }

  /**
   * Registers a handler for any callback query update.
   * @param {(ctx: object) => void} handler The function to execute.
   */
  onCallbackQuery(handler) {
    this.callbackQueryHandler = handler;
  }
  
  /**
   * Registers a handler for any non-command message update.
   * @param {(ctx: object) => void} handler The function to execute.
   */
  onMessage(handler) {
      this.messageHandler = handler;
  }


  /**
   * Processes an incoming update from Telegram.
   * @param {object} update The update object from Telegram.
   */
  _handleUpdate(update) {
    const ctx = {
      update,
      api: this.api,
    };

    if (update.message) {
      const text = update.message.text;
      if (text && this.commandHandlers.has(text)) {
        this.commandHandlers.get(text)(ctx);
      } else if (this.messageHandler) {
        this.messageHandler(ctx);
      }
    } else if (update.callback_query && this.callbackQueryHandler) {
      this.callbackQueryHandler(ctx);
    }
  }

  /**
   * Creates an Express middleware to handle webhook requests from Telegram.
   * @param {string} [secretPath] An optional secret path segment to verify the request origin.
   * @returns {(req: any, res: any) => void} An Express middleware function.
   */
  createWebhookMiddleware(secretPath = `/webhook/${this.token}`) {
    return (req, res) => {
      if (req.method === 'POST' && req.path === secretPath) {
        this._handleUpdate(req.body);
        res.sendStatus(200); // Acknowledge the update to Telegram
      } else {
        res.sendStatus(403); // Forbidden for other paths or methods
      }
    };
  }
}
