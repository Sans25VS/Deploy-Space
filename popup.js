document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, function (response) {
        if (response && response.selectedText) {
          document.getElementById('selected-text').innerText = response.selectedText;
          document.getElementById('save-text').style.display = 'block';
  
          document.getElementById('save-url').addEventListener('click', function () {
            saveText(response.selectedText, tabs[0].url);
          });
  
          document.getElementById('save-only-text').addEventListener('click', function () {
            saveText(response.selectedText);
          });
        }
      });
    });
  });
  
  function saveText(text, url) {
    let data = { text: text, url: url || '' };
    chrome.storage.local.get('savedTexts', function (result) {
      let savedTexts = result.savedTexts || [];
      savedTexts.push(data);
      chrome.storage.local.set({ savedTexts: savedTexts }, function () {
        alert('Text saved!');
      });
    });
  }
  