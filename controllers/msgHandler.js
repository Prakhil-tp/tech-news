const axios = require("axios");
const { WebClient } = require("@slack/web-api");
const { getNewsList, getRandomFiveElements } = require("./helpers");
require("dotenv").config();

const { TOP_STROIES_API, SLACK_TOKEN } = process.env;
const web = new WebClient(SLACK_TOKEN);

/**
 * Function to posts command help messages on corresponding slack channel
 * @function helper
 * @param {string} channel
 * @param {string} msg
 * @returns {void}
 */
const helper = async (channel, msg) => {
  try {
    if (msg && !msg.includes("NEWS")) {
      if (
        msg.includes("YOUR FATHER") ||
        msg.includes("CREATED YOU")
      ) {
        await web.chat.postMessage({
          channel,
          text: `\n It's <http://github.com/prakhil-tp|*Prakhil*> `
        });
      } else {
        await web.chat.postMessage({
          channel,
          text: ` \n Use *news* keyword in your message.`
        });
      }
    }
  } catch (e) {
    console.log(e, e.data);
  }
};

/**
 * Function to fetch news from the API and post it to slack channel.
 * @function postNews
 * @param {string} channel - channel name parsed from the slack event.
 * @returns {void}
 */
const postNews = async (channel) => {
  try {
    const response = await axios.get(TOP_STROIES_API);
    const random5 = await getRandomFiveElements(response.data);
    const newsList = await getNewsList(random5);
    let msgLine = newsList.map(
      (item) => `> *${item.title}.* <${item.url}|Read more>`
    );
    msgLine = msgLine.join("\n\n");

    await web.chat.postMessage({ channel, text: msgLine });
  } catch (e) {
    console.log(e);
  }
};

/**
 * Function to handle messages from the slack.
 * Only replies news for those who having messages with 'news' keyword.
 * @function handleMessage
 * @param {object} data
 * @returns {void}
 */
const handleMessage = async (data) => {
  if (data.type === "message" || !event.client_msg_id) {
    const msg = data.text && data.text.toUpperCase();
    const channel = data.channel;

    if (msg && msg.includes("NEWS")) {
      await postNews(channel);
    } else {
      await helper(channel, msg);
    }
  }
};

module.exports = { handleMessage };
