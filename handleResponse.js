const { DICTIONARY, TRANSLATE } = require("./constants");

const makeError = (word, type) => ({
  error: true,
  word,
  type
});

const getResult = (body, word, type) => {
  try {
    switch (type) {
      case DICTIONARY:
        return JSON.parse(body).results[0];
      case TRANSLATE:
        const res = JSON.parse(body).def[0];
        const translation = res && res.tr && res.tr[0] && res.tr[0].text;

        if (!translation) {
          throw new Error("No translation")
        }

        return { translation };
      default:
        throw new Error(`Unknown response type: ${type}`);
    }
  } catch (e) {
    console.error("Unable to get some data. See error.log for details.");
    return makeError(word, type)
  }
};

const handleResponse = (res, callback, word, type) => {
  const body = [];

  res.on("data", chunk => {
    body.push(chunk);
  });

  res.on("end", () => {
    if (res.statusCode !== 200) {
      callback(makeError(word, type));
    }

    const preparedBody = Buffer.concat(body).toString();
    const result = getResult(preparedBody, word, type);

    if (callback) {
      callback(result);
    }
  });
};

module.exports = handleResponse;
