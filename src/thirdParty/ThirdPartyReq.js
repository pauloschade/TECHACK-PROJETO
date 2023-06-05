class ThirdPartyReq {
  static domain;
  constructor() {
    this.thirdparty = [];
    this.crosSite = [];
    this.message = null;
    this.domain = null;
    this.insta = 0;
  }
  setMessage(message) {
    this.message = message;
  }
  init(domain) {
    this.domain = domain;
  }

  // displayContent() {
  //   //get thirdparty in local storage
  //   //window.alert(this.thirdparty);
  //   chrome.storage.local.get(["thirdpartycont"]).then((result) => {
  //     str = '';
  //     for (let i in result.thirdpartycont) {
  //       str += i + '\n';
  //     }
  //     window.alert(str);
  //   });
  // }

  checkReq(reqDetails) {
    if(!this.domain) {
      return;
    };
    try {
      
      //let domain = new URL(reqDetails.originUrl).hostname;
      let other = new URL(reqDetails.url).hostname;
      //console.log("domain: " + domain);
      if (this.domain !== other && !this.thirdparty.includes(other)) {
        //console.log("other: " + other);
        this.thirdparty.push(other);
        return this.thirdparty;
      }
    } catch (e) {
    }
    return null;
  }

  checkHeaders(reqDetails) {
    if(!this.domain) {
      return;
    };
    if(!this._identifyCrossSite(reqDetails)) { 
      return;
    }
    try {
    let domain = new URL(reqDetails.url).hostname;
    if(this.crosSite.includes(domain)) return;
    this.crosSite.push(domain);
    } catch (e) {
      this.crosSite.push(1);
    }

    return this.crosSite;
  }


  _identifyCrossSite(details) {
    let foundCrossSite = false;
    let foundCookie = false;
    for(let i in details.requestHeaders) {
      if (details.requestHeaders[i].name.toLowerCase() === 'sec-fetch-site') {
        if(details.requestHeaders[i].value === 'cross-site') {
          foundCrossSite = true;
        }
      }
      if(details.requestHeaders[i].name.toLowerCase() === 'cookie') {
        foundCookie = true;
      }
    }
    return foundCrossSite && foundCookie;
  }

  _cleanDomain(domain) {
    //erase http:// or https://
    //erase www.


    return domain.replace(/^(http:\/\/|https:\/\/)/, "").replace(/^www\./, "");;
  }

  _setMessage(message, str) {
    message.textContent = str;
    message.hidden = false;
  }
}

let thirdPartyReq = new ThirdPartyReq();

export {thirdPartyReq, ThirdPartyReq };

