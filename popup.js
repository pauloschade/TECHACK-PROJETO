// import { handleDelete } from "./src/deletion/handler.js";
// import { handleDisplay } from "./src/display/handler.js";
// import { values } from "./src/global/GlobalValues.js";
import {cookiesHandler} from "./src/cookies/Cookies.js";
import { storageHandler } from "./src/storage/Storage.js";
import { thirdPartyReq } from "./src/thirdParty/ThirdPartyReq.js";


const formDeleteCookie = document.getElementById('delete-cookie');
const formDisplayCookie = document.getElementById('display-cookie');

const firstParty = document.getElementById('first-party-cookie');
const thirdParty = document.getElementById('third-party-cookie');
const totalCookies = document.getElementById('total-cookies');

const sessionCookies = document.getElementById('session-cookies');
const persistentCookies = document.getElementById('persistent-cookies');

const formDeleteStorage = document.getElementById('delete-storage');
const formDisplayStorage = document.getElementById('display-storage');
const messageStorageLocal = document.getElementById('message-storage-local');
const messageStorageSession = document.getElementById('message-storage-session');

const formDisplayThirdParty = document.getElementById('display-third-party');
const thirdPartyMessage = document.getElementById('message-third-party');

const formDisplayCrossSite = document.getElementById('display-cross-site');
const crossSiteMessage = document.getElementById('message-cross-site');




//sections
const sectionCookies = document.getElementById('cookies');
const sectionStorage = document.getElementById('storage');
const sectionThirdParty = document.getElementById('third-party');
const sectionCrossSite = document.getElementById('cross-site');

//hide storage section
sectionStorage.hidden = true;
sectionThirdParty.hidden = true;
sectionCrossSite.hidden = true;

//get dropdown menu li
const dropdownMenu = document.querySelectorAll("#dm li");


dropdownMenu[0].addEventListener('click', () => {
  sectionCookies.hidden = false;
  sectionStorage.hidden = true;
  sectionThirdParty.hidden = true;
  sectionCrossSite.hidden = true;
});

dropdownMenu[1].addEventListener('click', () => {
  sectionCookies.hidden = true;
  sectionStorage.hidden = false;
  sectionThirdParty.hidden = true;
  sectionCrossSite.hidden = true;
});

dropdownMenu[2].addEventListener('click', () => {
  sectionCookies.hidden = true;
  sectionStorage.hidden = true;
  sectionThirdParty.hidden = false;
  sectionCrossSite.hidden = true;
});


dropdownMenu[3].addEventListener('click', () => {
  sectionCookies.hidden = true;
  sectionStorage.hidden = true;
  sectionThirdParty.hidden = true;
  sectionCrossSite.hidden = false;
});

// The async IIFE is necessary because Chrome <89 does not support top level await.
(async function initPopupWindow() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  let url = new URL(tab.url);
  let domain = url.hostname;
  domain = domain.replace('www.', '');

  cookiesHandler.init(domain);

  cookiesHandler.setMessage([firstParty, thirdParty, sessionCookies, persistentCookies ,totalCookies]);
  await cookiesHandler.get();
  cookiesHandler.handleDisplay();

  storageHandler.init(tab.id);
  storageHandler.setMessage([messageStorageLocal, messageStorageSession]);
  await storageHandler.get();
  storageHandler.handleDisplay();
  // chrome.runtime.sendMessage({cmd: "setMsg", message: [1, 2]});




  // setMessage([thirdPartyMessage, crossSiteMessage]);

  // thirdPartyReq.init(domain);
  // thirdPartyReq.setMessage([thirdPartyMessage, crossSiteMessage]);
  //await chrome.extension.getBackgroundPage().console.log('fooooooobarrrrr');
})();

// chrome.webRequest.onBeforeSendHeaders.addListener(
//   (details) => {
//     thirdPartyReq.checkHeaders(details);
//   },
//   {urls: ["<all_urls>"]},
//   ["extraHeaders", "requestHeaders"]
// );

// chrome.webRequest.onBeforeRequest.addListener(
//   (details) => {
//     thirdPartyReq.checkReq(details)
//   },
//   {urls: ["<all_urls>"]}
// );

formDeleteCookie.addEventListener('submit', async (event) =>{ 
  event.preventDefault();
  await cookiesHandler.handleDelete()
});

formDisplayCookie.addEventListener('submit', async (event) => {
  event.preventDefault();
  await cookiesHandler.get();
  cookiesHandler.handleDisplay()
});

formDeleteStorage.addEventListener('submit', (event) => storageHandler.handleDelete(event));
formDisplayStorage.addEventListener('submit', async (event) => {
  event.preventDefault();
  await storageHandler.get();
  storageHandler.handleDisplay()
});

formDisplayThirdParty.addEventListener('submit', (event) => {
  event.preventDefault();
  let sending = chrome.runtime.sendMessage({cmd: "display-req"})
  sending.then((response) => {
    console.log(response);
    thirdPartyMessage.textContent = response.len + " third party requests";
    let str = "";
    for(let i in response.req) {
      str += response.req[i] + "\n";
    }
    window.alert(str);
    thirdPartyMessage.hidden = false;
  });
});

formDisplayCrossSite.addEventListener('submit', (event) => {
  event.preventDefault();
  let sending = chrome.runtime.sendMessage({cmd: "display-cross"})
  sending.then((response) => {
    console.log(response);
    crossSiteMessage.textContent = response.len + " domains received cross site cookies";
    let str = "";
    for(let i in response.req) {
      str += response.req[i] + "\n";
    }
    window.alert(str);
    crossSiteMessage.hidden = false;
  });
});
//formDeleteStorage.addEventListener('submit', (event) => storageHandler.handleDelete(event));
