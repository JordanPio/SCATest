const Parser = require("rss-parser");
const parser = new Parser();
const { convertISODateToAEST } = require("./format-iso-date-to-AEST");

function getFeedInJson(podcastURL) {
  try {
    return parser.parseURL(podcastURL);
  } catch (error) {
    console.error("Error:", error.message);
    return {};
  }
}

function convertFeedToAuFormat(feed, order) {
  if (!feed || Object.keys(feed).length === 0) return {};

  let sortedFeed = feed;

  try {
    if (order === "asc") {
      sortedFeed.items.sort(
        (a, b) => new Date(a.pubDate) - new Date(b.pubDate)
      );
    } else {
      sortedFeed.items.sort(
        (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
      );
    }

    const last10EpisodesSorted = sortedFeed.items.slice(0, 10);

    const episodesArrInAuFormat = last10EpisodesSorted.map((epi) => {
      const publishedDate = convertISODateToAEST(epi.pubDate);
      return { title: epi.title, audioUrl: epi.enclosure.url, publishedDate };
    });

    const feedObjRefactored = {
      title: feed.title,
      description: feed.description,
      episodes: episodesArrInAuFormat,
    };

    return feedObjRefactored;
  } catch (error) {
    console.error("Error:", error.message);
    return {};
  }
}

module.exports = { getFeedInJson, convertFeedToAuFormat };

/*
## Challenges and Consideration

1. Server Timezone
Think about the server location?
Is the server machine in AU?
  If not force to output date in AEST

2. Function convertISODateToAEST not working properly - spent time troubleshooting
considered alternative library such as moment.js, date-fns or luxon.
  Moment is the most used but deprecated although I would try replacements such as date-fns or Luxon (less issues)
**Issue with node.js version 12 - fixed by updating it - function is now working

3. incorporate order to function displayFeedInAuFormat ASC or DESC
Should we rely that the podcast data would always come on desc order?
Should we reorganize the feed items based on date (Assuming some inconsistency in the future?) 
considerations - should we convert object to date and order and after convert back again?

4. optimizations to better process the data.
  order, slice and only after convert to AU (so less itens to work on)

5. feedback

improve naming convention of cuntions
missed some spelling
there was undeclared variables - it wasnt causing error but it could had been avoided if using typescript
immutability - do not mute feed object straight - I was reodering it straight
missed using const instead of let in one of the objects
Create additional unit testing
uncessary use async in one of the functions

*/
