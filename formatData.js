const formatMultilineText = arr => {
  if (Array.isArray(arr) && arr.filter(item => !!item).length) {
    return `"${arr
      .join('\n')
      .replace(/\t/g, ' ')
      .replace(/"/g, '""')}"`
  }

  return 'n/a'
}

const formatDataItem = data =>
  data
    .map(item => ({
      ...item,
      explanation: formatMultilineText(item.explanation),
      example: formatMultilineText(item.example),
    }))
    .map(item => Object.values(item).join('\t'))

module.exports = formatDataItem
