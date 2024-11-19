function getDate() {
  const now = new Date();
  return `${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

function simPliFizeString(string, option) {
  if (option) {
    let text = string.slice(0, 20);
    let sanitizedText = text.replace(/ /g, "_");
    sanitizedText = sanitizedText.replace(/[<>:"/\\|?*]/g, "");
    sanitizedText = sanitizedText.replace(/[\x00-\x1F\x7F]/g, "");
    return sanitizedText;
  }
  let sanitizedText = string.replace(/ /g, "_");
  sanitizedText = sanitizedText.replace(/[<>:"/\\|?*]/g, "");
  sanitizedText = sanitizedText.replace(/[\x00-\x1F\x7F]/g, "");
  return sanitizedText;
}

export { getDate, simPliFizeString };
