if (typeof browser === "undefined") {
  var browser = chrome;
}
console.log("saver.js");
function listenForClicks() {
  document.addEventListener("click", (e) => {
    console.log("saving");
    /**
       * Given the name of a beast, get the URL to the corresponding image.
       */
    function save_macros(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "save",
      });
    }
    function load_macros(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "load",
      });
    }

    /**
       * Just log the error to the console.
       */
    function reportError(error) {
      console.error(`Unable to update macros: ${error}`);
    }

    function openOptions() {
      browser.runtime.openOptionsPage();
    }
    /**
       * Get the active tab,
       * then call "beastify()" or "reset()" as appropriate.
       */
    if (e.target.classList.contains("save")) {
      browser.tabs.query({ active: true, currentWindow: true })
        .then(save_macros)
        .catch(reportError);
    } else if (e.target.classList.contains("load")) {
      browser.tabs.query({ active: true, currentWindow: true })
        .then(load_macros)
        .catch(reportError);
    } else if (e.target.classList.contains("edit")) {
      openOptions();
    }
  });
}
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({ file: "/content_scripts/macrosave.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
