class Storage {

  constructor() {
    this.data = {};
    this.message = null;
    this.tabId = null;
  }

  init(tabId) {
    this.tabId = tabId;
    this.data = {};
    this.data['local'] = [];
    this.data['session'] = [];
  }

  setMessage(message) {
    this.message = message;
  }
  
  async get() {
    //set storage
    await this._getFromTab();
    //window.alert(this.data);
  }

  handleDisplay() {
    this._setMessage(this.message[0], "local storage count: " +  Object.keys(this.data['local']).length);
    this._setMessage(this.message[1], "session storage count: " + Object.keys(this.data['session']).length);
    // let str = '';
    // for (let key in this.data) {
    //   str += key + ': ' + this.data[key] + '\n';
    // }
    // window.alert(str);
  }

  async handleDelete() {
    await this._deleteAll();;
    this._setMessage(this.message[0], "local storage deleted: " +  Object.keys(this.data['local']).length);
    this._setMessage(this.message[1], "session storage deleted: " + Object.keys(this.data['session']).length);
  }

  async _deleteAll() {
    await chrome.scripting.executeScript({
      target: { tabId: this.tabId },
      func: () => {
        localStorage.clear();
      }
    })
    await chrome.scripting.executeScript({
      target: { tabId: this.tabId },
      func: () => {
        sessionStorage.clear();
      }
    })
  }

  async _getFromTab() {
    const fromPageLocalStore = await chrome.scripting.executeScript({
      target: { tabId: this.tabId },
      func: () => {
        return JSON.stringify(localStorage)
      }
    })
    this.data['local'] = JSON.parse(fromPageLocalStore[0].result)

    const fromPageSessionStore = await chrome.scripting.executeScript({
      target: { tabId: this.tabId },
      func: () => {
        return JSON.stringify(sessionStorage)
      }
    })

    this.data['session'] = JSON.parse(fromPageSessionStore[0].result)
  }

  _setMessage(message, str) {
    message.textContent = str;
    message.hidden = false;
  }
}

let storageHandler = new Storage();

export { storageHandler };