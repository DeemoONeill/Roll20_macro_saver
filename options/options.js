if (typeof browser === "undefined") {
    var browser = chrome;
}
async function fetchData(){
    let obj = await browser.storage.sync.get(null)
    await showMacros(obj)
    await eventListener()
}

async function showMacros(object){
        var container = document.createElement("div")
        container.classList.add("buttons-flex")
        document.querySelector("body").appendChild(container)
    for (const key in object) {
           var buttons = document.createElement("button")
           sanitised = key.replaceAll(" ", "%")
           console.log(sanitised)
           buttons.classList.add(sanitised)
           var node = document.createTextNode(key)
           buttons.appendChild(node)
           container.appendChild(buttons)
        }
}


async function populateEvent(button){
    button.addEventListener("click", async (e) => {
        character_name = e.target.classList[0].replaceAll("%", " ")
        let macros = await browser.storage.sync.get(character_name)
        macros = macros[character_name]
        await populatePage(macros)
    })
}

async function populatePage(macros){
    if (document.querySelector(".container") != null){
        document.querySelector(".container").remove()
    }

    let container = document.createElement("div")
    container.classList.add("container")

    for (const key in macros) {
        let row = document.createElement("div")
        row.classList.add("key")
        row.classList.add("row")
        let input = document.createElement("input")
        input.value = key
        let textarea = document.createElement("textarea")
        textarea.value = macros[key].toString()
        row.appendChild(input)
        row.appendChild(textarea)
        container.appendChild(row)
        }
        document.querySelector("body").appendChild(container)
}
async function eventListener(){
    document.querySelectorAll("button").forEach(populateEvent)

}

fetchData()