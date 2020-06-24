require("dotenv").config();
const {
  handleUrlVerification,
  handleEventCallback
} = require("./controllers/eventHandler");

/**
 * @file index.js is the root file for this tech-news slack app
 * @author Prakhil TP
 * @see github <a href="https://github.com/prakhil-tp">GitHub Profile</a>
 */

/**
 * Pure function to verify the slack requests
 * @function verify
 * @param {object} data
 * @param {object} event
 * @returns {boolean}
 */
function verify(data, event) {
  return (
    (!data.headers["X-Slack-Retry-Num"] &&
      event.event &&
      !event.event["subtype"]) ||
    !event.event
  );
}

/**
 * lambda handler function
 * @function techNews
 * @param {object} - slack events
 * @returns {object} - response depends to the event type
 */
module.exports.techNews = async (data) => {
  const event = JSON.parse(data.body);
  if (verify(data, event)) {
    if (event.type === "url_verification")
      return handleUrlVerification(event);
    else if (event.type === "event_callback")
      return handleEventCallback(event);

    return {
      statusCode: 400,
      body: "Empty Request",
      headers: { "X-Slack-No-Retry": 1 }
    };
  }
};
