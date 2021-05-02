const express = require('express')
const app = express()
const port = 3000

const Parser = require('rss-parser')
const parser = new Parser()
const {convertISODateToAEST} = require("./utilities/format-iso-date-to-AEST")


const podcastURL = `https://www.nasa.gov/rss/dyn/Houston-We-Have-a-Podcast.rss`

app.get('/', async (req, res) => {
  // res.send('Hello World!')
  const feed = await getFeedInJson(podcastURL)
  const FormatedFeedObject = await remodelFeedObj(feed)
  res.send(FormatedFeedObject)


})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



// consume feed from URL


//convert xml to json object

async function getFeedInJson(podcastURL) {
  try {
    return await parser.parseURL(podcastURL)
  } catch (error) {
    return {}
  }
}


// getFeedInJson(podcastURL).then(data => console.log(data))


// remodel feedObj and formatDate to AEST
function remodelFeedObj(feed) {
  // const feed = await getFeedInJson(podcastURL)

  const episodesArr = feed.items.map(epi => {
    publishedDate = convertISODateToAEST(epi.pubDate)
    return {title: epi.title, audioUrl: epi.enclosure.url, publishedDate}
  })

  const last10Episodes = episodesArr.slice(0, 10)

  let newFeedObj = {title: feed.title , description: feed.description , episodes: last10Episodes}

  return newFeedObj

  // console.log(Object.keys(feed))
  // console.log(newFeedObj)
}

// remodelFeedObj()




// bonus Round - order data