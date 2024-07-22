chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
      id: "saveText",
      title: "Save Selected Text",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "saveText" && info.selectionText) {
      chrome.storage.local.get('savedTexts', function (result) {
        let savedTexts = result.savedTexts || [];
        savedTexts.push({ text: info.selectionText, url: tab.url });
        chrome.storage.local.set({ savedTexts: savedTexts }, function () {
          alert('Text saved!');
        });
      });
    }
  });
  