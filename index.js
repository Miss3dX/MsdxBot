const Core = require("./core");

require("dotenv").config();
global.Bot = new (require("./core.js"))(process.env.BOT_TOKEN, {}, process.env.BOT_OWNERS.split("|"), process.env.DEV_SERVER);
Bot.launch();