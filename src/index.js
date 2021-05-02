const e = require('express')
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

app.get('/sort', async (req, res) => {
  // res.send('Hello World!')
  const order = req.query.order
  const feed = await getFeedInJson(podcastURL)
  const FormatedFeedObject = await remodelFeedObj(feed, order)
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
function remodelFeedObj(feed, order) {
  // const feed = await getFeedInJson(podcastURL)

if (!feed || Object.keys(feed).length === 0) return {}

if (order==="asc") {
  feed.items.sort((a,b) => new Date(a.pubDate) - new Date(b.pubDate))
} else {
  feed.items.sort((a,b) => new Date(b.pubDate) - new Date(a.pubDate))
}

const last10Episodes = feed.items.slice(0, 10)

  const episodesArr = last10Episodes.map(epi => {
    publishedDate = convertISODateToAEST(epi.pubDate)
    return {title: epi.title, audioUrl: epi.enclosure.url, publishedDate}
  })


  let newFeedObj = {title: feed.title , description: feed.description , episodes: episodesArr}

  console.log(newFeedObj)
  return newFeedObj

  // console.log(Object.keys(feed))
}

// remodelFeedObj()




// bonus Round - order data