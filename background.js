function updateTabNumbers() {
  console.log("Updating tab numbers");
  browser.tabs.query({currentWindow: true}).then((tabs) => {
    tabs.forEach((tab, index) => {
      if (index < 8) {  // Limit to first 8 tabs
        const number = index + 1;
        const newTitle = `${number}: ${tab.title.replace(/^\d+:\s/, '')}`;
        console.log(`Updating tab ${tab.id} to title: ${newTitle}`);
        
        // Use executeScript to update the title
        browser.tabs.executeScript(tab.id, {
          code: `document.title = "${newTitle}";`
        }).catch(error => {
          console.error(`Error updating tab ${tab.id}:`, error);
        });
      }
    });
  }).catch(error => {
    console.error("Error querying tabs:", error);
  });
}

function onTabUpdated(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    console.log(`Tab ${tabId} updated, triggering number update`);
    updateTabNumbers();
  }
}

browser.tabs.onCreated.addListener(() => {
  console.log("Tab created, updating numbers");
  updateTabNumbers();
});
browser.tabs.onRemoved.addListener(() => {
  console.log("Tab removed, updating numbers");
  updateTabNumbers();
});
browser.tabs.onMoved.addListener(() => {
  console.log("Tab moved, updating numbers");
  updateTabNumbers();
});
browser.tabs.onUpdated.addListener(onTabUpdated);

// Initial update when extension is loaded
console.log("Extension loaded, initial update");
updateTabNumbers();

