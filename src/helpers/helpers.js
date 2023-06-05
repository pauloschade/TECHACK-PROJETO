export function getUrl(value) {
  event.preventDefault();

  clearMessage();

  let url = stringToUrl(value);
  if (!url) {
    setMessage('Invalid URL');
    return;
  }
  return url;
}


export function setMessage(message, str) {
  message.textContent = str;
  message.hidden = false;
}

export function clearMessage(message) {
  message.hidden = true;
  message.textContent = '';
}

function stringToUrl(input) {
  // Start with treating the provided value as a URL
  try {
    return new URL(input);
  } catch {
    // ignore
  }
  // If that fails, try assuming the provided input is an HTTP host
  try {
    return new URL('http://' + input);
  } catch {
    // ignore
  }
  // If that fails ¯\_(ツ)_/¯
  return null;
}