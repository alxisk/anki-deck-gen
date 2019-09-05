const getTranscription = entries => {
  try {
    return entries[0].pronunciations[0].phoneticSpelling
  } catch (e) {
    return null
  }
}

const getExplanation = entries => {
  try {
    return entries.map(entry => entry.entries[0].senses[0].definitions[0])
  } catch (e) {
    return null
  }
}

const getExample = entries =>
  entries.map(entry => {
    try {
      return entry.entries[0].senses[0].examples[0].text
    } catch (e) {
      return null
    }
  })

const processDataItem = item => {
  const lexicalEntries = item.lexicalEntries

  if (!Array.isArray(lexicalEntries)) {
    console.error(`Word ${item.word} has no entries.`)
    return
  }

  return {
    english: item.word,
    transcription: getTranscription(lexicalEntries),
    explanation: getExplanation(lexicalEntries),
    example: getExample(lexicalEntries),
    synonyms: '',
    russian: item.translation,
    additionalRussian: '',
  }
}

module.exports = processDataItem
