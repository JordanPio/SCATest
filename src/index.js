const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



// consume feed from URL

const podcastURL = `https://www.nasa.gov/rss/dyn/Houston-We-Have-a-Podcast.rss`

//conver xml to json object


// format date to AEST


// bonus Round - order data