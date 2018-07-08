const formatMultilineText = arr =>
  `"${arr
    .join("\n")
    .replace(/\t/g, " ")
    .replace(/"/g, '""')}"`;

const formatDataItem = data =>
  data
    .map(item => ({
      ...item,
      explanation: formatMultilineText(item.explanation),
      example: formatMultilineText(item.example)
    }))
    .map(item => Object.values(item).join("\t"));

module.exports = formatDataItem;
