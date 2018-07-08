const { DICTIONARY, TRANSLATE } = require("./constants");

const getResult = (body, type) => {
  switch (type) {
    case DICTIONARY:
      return JSON.parse(body).results[0];
    case TRANSLATE:
      return JSON.parse(body);
    default:
      throw new Error(`Unknown response type: ${type}`);
  }
};

const handleResponse = (res, callback, type) => {
  const body = [];

  res.on("data", chunk => {
    body.push(chunk);
  });

  res.on("end", () => {
    const preparedBody = Buffer.concat(body).toString();
    const result = getResult(preparedBody, type);

    if (callback) {
      callback(result);
    }
  });
};

module.exports = handleResponse;
