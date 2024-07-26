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
    chrome.storage.local.get('user', function(result) {
      const user = result.user || 'defaultUser';
      let data = { user: user, text: text, url: url || '' };
      fetch('http://localhost:5000/saveText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        alert('Text saved to server!');
        loadSavedTexts(); // Reload the saved texts to display the new one
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    });
  }
  
  function loadSavedTexts() {
    chrome.storage.local.get('user', function(result) {
      const user = result.user || 'defaultUser';
      fetch(`http://localhost:5000/getTexts/${user}`)
      .then(response => response.json())
      .then(data => {
        let list = document.getElementById('saved-texts-list');
        list.innerHTML = ''; // Clear the list first
        data.forEach(item => {
          let listItem = document.createElement('li');
          listItem.textContent = item.text;
          if (item.url) {
            let link = document.createElement('a');
            link.href = item.url;
            link.textContent = ' (URL)';
            link.target = '_blank';
            listItem.appendChild(link);
          }
          list.appendChild(listItem);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    });
  }
  