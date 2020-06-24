require("dotenv").config();
const { handleMessage } = require("./msgHandler");

const { SLACK_VERIFICATION_TOKEN } = process.env;
const response = {
  statusCode: 200,
  headers: { "X-Slack-No-Retry": 1 },
  body: {}
};

/**
 * Factory function to verify slack url
 * @function handleUrlVerification
 * @param {object} event - challenge event from the slack
 * @returns {object} - returns same back to slack
 */
const handleUrlVerification = async (event) => {
  if (event.token === SLACK_VERIFICATION_TOKEN) {
    response.body = event.challenge;
    return response;
  }
  response.body = "Verification failed";
  return response;
};

/**
 * Function to handle slack message events
 * @function handleEventCallback
 * @param {object} event
 * @returns {object} - returns `response` as acknowledgement
 */
const handleEventCallback = async (event) => {
  try {
    response.body = { ok: true, token: event.token };
    return response;
  } finally {
    await handleMessage(event.event);
  }
};

module.exports = { handleUrlVerification, handleEventCallback };
