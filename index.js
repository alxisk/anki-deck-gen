const path = require("path");
const fs = require("fs");
const https = require("https");
const handleResponse = require("./handleResponse");
const results = handleResponse.results;
const { appId, appKey } = require("./private");
const processData = require("./processData");

const filePath = path.resolve(__dirname, "words.txt");

if (!fs.existsSync(filePath)) {
  console.error('File "words.txt" is required to be in root directory');
  return;
}

const file = fs.readFileSync(filePath, "utf8");
const wordsList = file.split("\n").filter(word => word);

const writeToFile = () => {
  const processedData = results.map(processData);
  fs.writeFileSync("result.txt", processedData, "utf8");
};

const requestWordsData = (words, callback) => {
  const requests = words.map(word => {
    return new Promise(resolve => {
      const options = {
        hostname: "od-api.oxforddictionaries.com",
        headers: {
          Accept: "application/json",
          app_id: appId,
          app_key: appKey
        },
        port: 443,
        path: `/api/v1/entries/en/${word}`,
        method: "GET"
      };

      const req = https.request(options, res => {
        handleResponse(res, resolve);
      });

      req.on("error", error => {
        console.error(error);
      });

      req.end();
    });
  });

  Promise.all(requests).then(() => callback());
};

requestWordsData(wordsList, writeToFile);
