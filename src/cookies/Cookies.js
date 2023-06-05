class Cookies {

  constructor() {
    this.domain = '';
    this.data = [];
    this.message = [];
    this.types = {
      'third-party': 0,
      'first-party': 0,
      'session': 0,
      'persistent': 0,
      'all': 0,
      'synced': 0
    }

    this.syncDomains = [];
  }

  init(domain) {
    this.test += domain;
    this.domain = domain;
    this.data = [];
    this.syncDomains = [];
  }

  setMessage(message) {
    this.message = message;
  }
  
  async get() {
    this.data = await chrome.cookies.getAll({ domain: this.domain });
  }

  // getSync() {
  //   this._getSync();
  //   if(this.syncDomains.length > 0) {
  //     let str = '';
  //     for(let domain of this.syncDomains) {
  //       str += domain + '\n';
  //     }
  //     window.alert(str);
  //   }
  // }

  async handleDelete() {
    await this._deleteAll();
    this._setMessage(this.message[4] ,this.data.length + " cookies deleted");
  }

  handleDisplay() {
    this._setTypes();
    //event.preventDefault();
    //this._display();

    this._setMessage(this.message[0], this.types['first-party']  + " first party cookies");
    this._setMessage(this.message[1], this.types['third-party']  + " third party cookies");
    this._setMessage(this.message[2], this.types['session']  + " session cookies");
    this._setMessage(this.message[3], this.types['persistent']  + " persistent cookies");
    this._setMessage(this.message[4], this.types['all']  + " total cookies");
  }

  _setTypes() {
    this.types = {
      'third-party': 0,
      'first-party': 0,
      'session': 0,
      'persistent': 0,
      'all': 0,
      'synced': 0
    }
    for (let cookie of this.data) {
      if (this._cleanDomain(cookie.domain) === this.domain) {
        this.types['first-party']++;
      } else {
        this.types['third-party']++;
      }
      if(cookie.session) {
        this.types['session']++;
      }
      else {
        this.types['persistent']++;
      }
      console.log(cookie.sameSite);
    }
    this.types['all'] = this.data.length;
  }

  _cleanDomain(domain) {
    //erase http:// or https://
    //erase www.


    return domain.replace(/^(http:\/\/|https:\/\/)/, "").replace(/^www\./, "");;
  }

  _display() {
    let str = '';
    for (let cookie of this.data) {
      var url = '';
      url += cookie.domain;
      url += cookie.path;
      str += url + '\n';
    }
    window.alert(str);
  }

  // _addToSync() {
  //   for (let cookie of this.data) {
  //     let val = cookie.value;

  //     let data = {};
  //     data[val] = 'myList';
  //     chrome.storage.local.set({ data }, () => {
  //         if (chrome.runtime.lastError) {
  //           console.error(chrome.runtime.lastError);
  //           return;
  //         }
  //         console.log('List saved to local storage:');
  //       });
  
  //     chrome.storage.local.get(null, (result) => {
  //       if (chrome.runtime.lastError) {
  //         console.error(chrome.runtime.lastError);
  //         return;
  //       }
  //       var allKeys = Object.keys(result);
  //       var all = Object.values(result);

  //       // console.log('allKeys: ', allKeys);
  //       // console.log('all: ', all);


  //       // for (let key in result) {
  //       //   console.log('Value currently is ' + result[key]);
  //       // }
  //       // let myList = result[val] || [];

  //       // console.log('myList: ', result[val], val);
  
  //       // if (!myList.includes(this.domain)) {
  //       //   myList.push(this.domain);
  //       // } else {
  //       //   console.log('Domain already in list');
  //       // }

  //       // let data = {};
  //       // data[val] = myList;
  //       // chrome.storage.local.set({ data }, () => {
  //       //   if (chrome.runtime.lastError) {
  //       //     console.error(chrome.runtime.lastError);
  //       //     return;
  //       //   }
  //       //   console.log('List saved to local storage:', myList);
  //       // });
  //     });
  //   }
  // }
  



  // _getSync() {
  //   for (var key in this.sync) {
  //     if(this.sync[key].length > 1 && this.sync[key].includes(this.domain)) {
  //       //get all domains excelpt this.domian
  //       let domains = this.sync[key].filter(domain => domain !== this.domain);
  //       this.syncDomains = this.syncDomains.concat(domains);
  //     }
  //   }
  // }


  async _deleteAll() {
    let pending = this.data.map(this._delete);
    await Promise.all(pending);
  }


  _setMessage(message, str) {
    message.textContent = str;
    message.hidden = false;
  }

  _delete(cookie) {
    const protocol = cookie.secure ? 'https:' : 'http:';
    const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
    return chrome.cookies.remove({
      url: cookieUrl,
      name: cookie.name,
      storeId: cookie.storeId
    });
  }
}

let cookiesHandler = new Cookies();

export { cookiesHandler };