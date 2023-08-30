const searchBar = document.getElementById("search-bar");
const resultsContainer = document.getElementById("results");
let currentSearchQuery = "";
let searchResults = [];

searchBar.addEventListener("keydown", (e) => {
    if (
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        e.key == "Backspace" ||
        (e.key == "Enter" && currentSearchQuery.trim() != "")
    ) {
        handleChange(e.key);
    }
});

async function queryAllTabs() {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            const node = document.createElement("a");
            const textNode = document.createTextNode(JSON.stringify(tab.title));
            node.appendChild(textNode);
            node.addEventListener("click", () => handleTabClick(tab));
            resultsContainer.appendChild(node);
        });
    });
}

async function handleTabClick(tab) {
    window.close();
    chrome.tabs.update(tab.id, { active: true });
}

async function handleChange(value) {
    while (resultsContainer.lastChild) {
        resultsContainer.removeChild(resultsContainer.lastChild);
    }
    if (value === "Backspace") {
        currentSearchQuery = currentSearchQuery.substring(
            0,
            currentSearchQuery.length - 1
        );
    } else if (value === "Enter" && searchResults.length > 0) {
        window.close();
        chrome.tabs.update(searchResults[0].id, { active: true });
    } else {
        currentSearchQuery = currentSearchQuery + value;
    }

    if (currentSearchQuery.trim() != "") {
        chrome.tabs.query({}, function (tabs) {
            searchResults = [];
            tabs.forEach(function (tab) {
                if (
                    tab.title
                        .toUpperCase()
                        .replaceAll(" ", "")
                        .indexOf(
                            currentSearchQuery.toUpperCase().replaceAll(" ", "")
                        ) != -1 ||
                    tab.url
                        .toUpperCase()
                        .replaceAll(" ", "")
                        .indexOf(
                            currentSearchQuery.toUpperCase().replaceAll(" ", "")
                        ) != -1
                ) {
                    const container = document.createElement("div");
                    container.className = "item-container";
                    container.title = tab.url;

                    const textContainer = document.createElement("section");
                    textContainer.className = "text-container";

                    const img = document.createElement("img");
                    img.src = tab.favIconUrl
                        ? tab.favIconUrl
                        : "images/No_image_available.png";
                    img.className = "item-img";

                    const a = document.createElement("a");
                    a.className = "item-title";
                    const textNode = document.createTextNode(tab.title);
                    a.appendChild(textNode);
                    a.addEventListener("click", () => handleTabClick(tab));

                    const urlNode = document.createElement("p");
                    urlNode.className = "item-url";
                    const urlText = document.createTextNode(tab.url);
                    urlNode.appendChild(urlText);

                    textContainer.appendChild(a);
                    textContainer.appendChild(urlNode);

                    container.appendChild(img);
                    container.appendChild(textContainer);

                    resultsContainer.appendChild(container);
                    searchResults.push(tab);
                }
            });
        });
    }
}
