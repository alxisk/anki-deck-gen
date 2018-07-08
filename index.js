const path = require("path");
const fs = require("fs");
const https = require("https");
const handleResponse = require("./handleResponse");
const { dictAppId, dictAppKey, translationApiKey } = require("./private");
const processDataItem = require("./processDataItem");
const formatData = require("./formatData");
const { DICTIONARY, TRANSLATE } = require("./constants");
const translateApi = require("google-translate-api");

const filePath = path.resolve(__dirname, "words.txt");

if (!fs.existsSync(filePath)) {
  console.error('File "words.txt" is required to be in root directory');
  return;
}

const file = fs.readFileSync(filePath, "utf8");
const wordsList = file.split("\n").filter(word => word);

const writeToFile = data => {
  const processedData = data.map(processDataItem);
  const formattedData = formatData(processedData);

  fs.writeFileSync("result.txt", formattedData.join("\n"), "utf8");
};

const requestWordsData = (words, callback) => {
  const entries = words.map(word => {
    const dictionaryData = new Promise(resolve => {
      const options = {
        hostname: "od-api.oxforddictionaries.com",
        headers: {
          Accept: "application/json",
          app_id: dictAppId,
          app_key: dictAppKey
        },
        port: 443,
        path: `/api/v1/entries/en/${word}`,
        method: "GET"
      };

      const req = https.request(options, res => {
        handleResponse(res, resolve, DICTIONARY);
      });

      req.on("error", error => {
        console.error(error);
      });

      req.end();
    });

    const translation = translateApi(word, { from: "en", to: "ru" }).then(
      ({ text }) => ({ translation: text })
    );

    return Promise.all([dictionaryData, translation]).then(data => ({
      ...data[0],
      ...data[1]
    }));
  });

  Promise.all(entries).then(data => callback(data));
};

requestWordsData(wordsList, writeToFile);
