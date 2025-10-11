function searchGoogleMaps(info, tab) {
  const searchstring = info.selectionText;
  chrome.tabs.create({ url: "http://maps.google.com/maps?q=" + searchstring });
}

chrome.contextMenus.create({
  title: "Search Google Maps",
  contexts: ["selection"],
  onclick: searchGoogleMaps
});   