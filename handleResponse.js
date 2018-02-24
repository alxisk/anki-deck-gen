const fs = require("fs");

const results = [];

const handleResponse = (res, callback) => {
  const body = [];

  res.on("data", chunk => {
    body.push(chunk);
  });

  res.on("end", () => {
    const result = Buffer.concat(body).toString();
    results.push(JSON.parse(result).results[0]);

    if (callback) {
      callback();
    }
  });
};

module.exports = handleResponse;
module.exports.results = results;
