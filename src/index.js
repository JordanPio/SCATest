const e = require("express");
const express = require("express");
const app = express();
const port = 3000;

const {
  getFeedInJson,
  displayFeedInAuFormat,
} = require("./utilities/process-feed");

const podcastURL = `https://www.nasa.gov/rss/dyn/Houston-We-Have-a-Podcast.rss`;

app.get("/", async (req, res) => {
  const feed = await getFeedInJson(podcastURL);
  const FormatedFeedObject = await displayFeedInAuFormat(feed);
  res.send(FormatedFeedObject);
});

app.get("/sort", async (req, res) => {
  const order = req.query.order;
  const feed = await getFeedInJson(podcastURL);
  const FormatedFeedObject = await displayFeedInAuFormat(feed, order);
  res.send(FormatedFeedObject);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
