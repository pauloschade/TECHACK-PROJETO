import { ThirdPartyReq } from "./src/thirdParty/ThirdPartyReq.js";

const thirdPartyReq = new ThirdPartyReq();

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log("tab updated");
  let url = new URL(tab.url);
  let domain = url.hostname;
  thirdPartyReq.init(domain);
  //get count from local storage
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
   thirdPartyReq.checkHeaders(details);
  },
  {urls: ["<all_urls>"]},
  ["extraHeaders", "requestHeaders"]
);

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    thirdPartyReq.checkReq(details);
    console.log(thirdPartyReq.thirdparty.length);
  },
  {urls: ["<all_urls>"]}
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //sendResponse();
  console.log("onMessage");
  if (request.cmd === "setMsg") {
    console.log("setMsg");
    console.log(request.message);
    // thirdPartyReq.setMessage(request.message);
  }
  if (request.cmd === "display-req") {
    sendResponse({len: thirdPartyReq.thirdparty.length, req : thirdPartyReq.thirdparty});
  }

  if (request.cmd === "display-cross") {
    sendResponse({len: thirdPartyReq.crosSite.length, req : thirdPartyReq.crosSite});
  }
});

function backgroundFunction () {
    return "hello from the background!"
}

function setMessage(message) {
  thirdPartyReq.setMessage(message);
}

function display(event) {
  thirdPartyReq.display(event);
  console.log("displayYYYYYYYYYYYYYYYYYYYYYYYYYY");
}