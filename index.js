const path = require('path')
const fs = require('fs')
const https = require('https')
const handleResponse = require('./handleResponse')
const { appId, appKey } = require('./privateConstants')

const filePath = path.resolve(__dirname, 'words.txt')

if (!fs.existsSync(filePath)) {
  console.error('File "words.txt" is required to be in root directory')
  return
}

const file = fs.readFileSync(filePath, 'utf8')
const wordsList = file.split('\n').filter(word => word)

wordsList.slice(0, 1).forEach(word => {
  const options = {
    hostname: 'od-api.oxforddictionaries.com',
    headers: {
      Accept: 'application/json',
      app_id: appId,
      app_key: appKey,
    },
    port: 443,
    path: `/api/v1/entries/en/${word}`,
    method: 'GET',
  }

  const req = https.request(options, handleResponse)

  req.on('error', error => {
    console.error(error)
  })

  req.end()
})
