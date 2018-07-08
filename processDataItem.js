const getTranscription = entries =>
  entries[0].pronunciations[0].phoneticSpelling;

const getExplanation = entries =>
  entries.map(entry => entry.entries[0].senses[0].definitions[0]);

const getExample = entries =>
  entries.map(entry => {
    const examples = entry.entries[0].senses[0].examples;

    if (examples && examples.length) {
      return examples[0].text;
    }

    return null;
  });

const processDataItem = item => {
  const lexicalEntries = item.lexicalEntries;

  if (!Array.isArray(lexicalEntries)) {
    console.error(`Word ${item.word} has no entries.`);
    return;
  }

  return {
    english: item.word,
    transcription: getTranscription(lexicalEntries),
    explanation: getExplanation(lexicalEntries),
    example: getExample(lexicalEntries),
    synonyms: "",
    russian: item.translation,
    additionalRussian: ""
  };
};

module.exports = processDataItem;
