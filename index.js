const path = require("path");
const fs = require("fs");
const https = require("https");
const handleResponse = require("./handleResponse");
const { dictAppId, dictAppKey, translationApiKey } = require("./private");
const processDataItem = require("./processDataItem");
const formatData = require("./formatData");
const { REQUEST_TIMEOUT, DICTIONARY, TRANSLATE } = require("./constants");

const filePath = path.resolve(__dirname, "words.txt");

if (!fs.existsSync(filePath)) {
  console.error('File "words.txt" is required to be in root directory');
  return;
}

const file = fs.readFileSync(filePath, "utf8");
const wordsList = file.split("\n").filter(word => word);

const writeToFile = data => {
  const usefulData = data.filter(({ error }) => !error);
  const errorData = data.filter(({ error }) => error);
  const processedData = usefulData.map(processDataItem);
  const formattedData = formatData(processedData);

  fs.writeFileSync("result.txt", formattedData.join("\n"), "utf8");

  if (errorData.length) {
    fs.writeFileSync(
      "error.log",
      JSON.stringify(errorData.map(({ word, type }) => ({ word, type }))),
      "utf8"
    );
  }
};

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

const makeRequests = word => {
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
      handleResponse(res, resolve, word, DICTIONARY);
    });

    req.on("error", error => {
      console.error(error);
    });

    req.end();
  });

  const translation = new Promise(resolve => {
    const options = {
      hostname: "dictionary.yandex.net",
      headers: {
        Accept: "application/json",
        app_id: dictAppId,
        app_key: dictAppKey
      },
      port: 443,
      path: `/api/v1/dicservice.json/lookup?key=${translationApiKey}&lang=en-ru&text=${word}`,
      method: "GET"
    };

    const req = https.request(options, res => {
      handleResponse(res, resolve, word, TRANSLATE);
    });

    req.on("error", error => {
      console.error(error);
    });

    req.end();
  });

  return Promise.all([
    dictionaryData,
    translation,
    timeout(REQUEST_TIMEOUT)
  ]).then(data => ({
    ...data[0],
    ...data[1]
  }));
};

const requestWordsData = async (words, callback) => {
  const entries = [];

  for (let word of words) {
    const entry = await makeRequests(word);

    entries.push(entry);
  }

  callback(entries);
};

requestWordsData(wordsList, writeToFile);
