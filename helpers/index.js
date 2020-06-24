const axios = require("axios");
require("dotenv").config();

const { ITEM_API } = process.env;

/**
 * Function to get random five news IDs from topStories.
 * @function getRandomFiveElements
 * @param {Array<number>} topStories - Array of news IDs
 * @returns {Array<number>} - random 5 news IDs [323, 232]
 */
const getRandomFiveElements = async (topStories) => {
  const random5 = [];
  while (random5.length < 5) {
    let element =
      topStories[Math.floor(Math.random() * topStories.length)];
    if (!random5.includes(element)) random5.push(element);
  }
  return random5;
};

/**
 * Function to get title and url of corresponding news IDs.
 * @function getNewsList
 * @param {Array<number>} newsIds - five news IDs. ex: [323, 232]
 * @returns {Array<Object>} - return array titles and urls of news. ex: [{ title, url }]
 */
const getNewsList = async (newsIds) => {
  const newsList = await Promise.all(
    newsIds.map(async (element) => {
      const itemRes = await axios.get(`${ITEM_API}${element}.json`);
      const news = {};
      news.title = itemRes.data && itemRes.data.title;
      news.url = itemRes.data && itemRes.data.url;
      return news;
    })
  );

  return newsList.filter((item) => item.url && item.title);
};

module.exports = {
  getRandomFiveElements,
  getNewsList
};
