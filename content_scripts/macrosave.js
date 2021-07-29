"use strict";

(function () {

  /**
	 * Check and set a global guard variable.
	 * If this content script is injected into the same page again,
	 * it will do nothing next time.
	 */

  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  function populateLists() {

    //  macros are stored in table elements with the class of name
    //  clicking on these elements opens the macros which we can then use
    //  to get the macros name and the body of the macro

    document.querySelectorAll("td.name").forEach(function (macro) {
      macro.click();
    });
    let names = document.querySelectorAll("input.name");
    let bodies = document.querySelectorAll("textarea.macro");
    return [names, bodies];
  }

  function retrieveMacros() {

    /*gets the names and bodies of the macros and stores them as
      key value pairs. Then clicks the cancel button on all of the open
    macro windows so as not to update them.
    */

    let [names, bodies] = populateLists();

    let obj = {};
    for (var i = 0; i < names.length; i++) {
      obj[names[i].value] = bodies[i].value;
    }

    let buttons = document.querySelectorAll("button");

    for (let index = 0; index < buttons.length; index++) {
      const element = buttons[index];
      if (element.innerText == "Cancel") {
        element.click();
      }
    }

    return obj;
  }

  function updateMacros() {

    // loads macros from browser storage, opens the macros
    // if the macros exists in the list it updates it
    // if not it clicks add and adds a new macro.

  }

  function loadMacros() {

    // loads all the macros from browser sync storage
    // sending null retrieves all.

    console.log("loading macros");
    let macros = browser.storage.sync.get(null)
      .then(console.log)
      .catch(console.log);
    return macros
  }

  function getPlayerName() {

    // the player name is stored in a box with the ID player_displayname

    return document.querySelector("#player_displayname").value;
  }
  browser.runtime.onMessage.addListener((message) => {
    switch (message.command) {
      case "save":

        // with save we retreive the macros from the active player
        // get their character name and store it as a keyvalue pair
        // in the browsers sync storage. {Character: macros}

        let obj = retrieveMacros();
        let character_name = getPlayerName();
        console.log(obj, character_name);

        try {
          browser.storage.sync.set({ [character_name]: obj });
          console.log("saved");
        } catch (error) {
          console.log("not saved");
          console.log(`Unable to save ${error}`);
        }
        break;
      case "load":

        // loads macros from sync storage.

        loadMacros();
        break;
      case "update":

        // loads the macros from browser storage, if a macro with the same
        // name exists, its contents are updated. If it doesn't, a new macro
        // is created.

        updateMacros();
        break;
    }
  });
})();
