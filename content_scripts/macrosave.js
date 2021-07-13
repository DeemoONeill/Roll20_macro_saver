if (typeof browser === "undefined") {
    var browser = chrome;
}
(function() {
	/**
	 * Check and set a global guard variable.
	 * If this content script is injected into the same page again,
	 * it will do nothing next time.
	 */
	if (window.hasRun) {
	  return;
	}
	window.hasRun = true;

function populateLists(){
	document.querySelector("#ui-id-5").click();
	document.querySelectorAll("td.name").forEach(function(macro){macro.click()});
	names = document.querySelectorAll("input.name")
	bodies = document.querySelectorAll("textarea.macro")

	return [names, bodies]
}

function retrieveMacros (){
	[names, bodies] = populateLists()

	obj = {};
	for (var i = 0; i<names.length; i++){
		obj[names[i].value] = bodies[i].value
	}

	buttons = document.querySelectorAll("button")

	buttons.forEach(function(button){
		if (button.innerText == "Cancel"){
			button.click()
		}
	}
	)

	return obj
}

function load_macros(){
	console.log("loading macros")
	browser.storage.sync.get(null)
	.then(console.log)
	.catch(console.log)
}

function getPlayerName(){
	return document.querySelector("#player_displayname").value
}
browser.runtime.onMessage.addListener((message) => {
	switch(message.command){
		case "save":
			obj = retrieveMacros()
			character_name = getPlayerName()
			console.log(obj, character_name)

			try {
				browser.storage.sync.set({[character_name] : obj})
				console.log("saved")
			} catch (error) {
				console.log("not saved")
				console.log(`Unable to save ${error}`)
			}
			break;
		case "load":
			load_macros();
			break;
	}}
)
})()
