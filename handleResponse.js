const fs = require('fs')

const handleResponse = res => {
  const body = []

  res.on('data', (chunk) => {
    body.push(chunk)
  })

  res.on('end', () => {
    const result = Buffer.concat(body).toString()
    fs.writeFileSync('result.txt', result, 'utf8')
  })
}

module.exports = handleResponse
