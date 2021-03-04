require('dotenv').config();

const channelName = process.env.DISCORD_CHANNEL_NAME

const atcsServerId = process.env.DISCORD_SERVER_ID
const qaChannelId = process.env.DISCORD_CHANNEL_ID
const webhookId = process.env.DISCORD_WEBHOOK_ID
const webhookToken = process.env.DISCORD_WEBHOOK_TOKEN

const atcsQaChannelURL = `https://discord.com/channels/${atcsServerId}/${qaChannelId}`;
const webhookUrl = `https://discord.com/api/webhooks/${webhookId}/${webhookToken}`;

const messageMaxLength = 2000;
const languageList = {
    "~~General~~": "",
    "Python":"py",
    "Java":"java",
    "C":"c",
    "C#":"csharp",
    "HTML":"html",
    "CSS":"css",
    "Javascript":"js",
    "Scheme":"scheme"
  }

module.exports = {channelName : channelName, 
                webhookUrl: webhookUrl, 
                atcsQaChannelURL: atcsQaChannelURL, 
                messageMaxLength: messageMaxLength, languageList:languageList}