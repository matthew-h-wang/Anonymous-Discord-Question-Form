require('dotenv').config();

const atcsServerId = process.env.DISCORD_SERVER_ID
const qaChannelId = process.env.DISCORD_CHANNEL_ID
const webhookId = process.env.DISCORD_WEBHOOK_ID
const webhookToken = process.env.DISCORD_WEBHOOK_TOKEN

const atcsQaChannelURL = `https://discord.com/channels/${atcsServerId}/${qaChannelId}`;
const webhookUrl = `https://discord.com/api/webhooks/${webhookId}/${webhookToken}`;

module.exports = {webhookUrl: webhookUrl, atcsQaChannelURL: atcsQaChannelURL}