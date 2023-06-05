class Logger {
  constructor() {
    this.tabId = null;
  }
  init(tabId) {
    this.tabId = tabId;
  }
  log(msg) {
    chrome.scripting.executeScript({
      target : { tabId : this.tabId },
      func : (msg) => {
        console.log(msg);
      },
      args : [msg]
      //code : `console.log(${message})`
    });
  }
}

const logger = new Logger();

export { logger };