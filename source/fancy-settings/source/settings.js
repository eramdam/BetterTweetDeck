window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
    });
    var lang = (navigator.language == "fr") ? "fr" : "en";

    function getVersion() {
    var details = chrome.app.getDetails();
    return details.version;
    }

    for (var i = document.querySelectorAll(".hidden-changelog > p > b").length - 1; i >= 0; i--) {
        document.querySelectorAll(".hidden-changelog > p > b")[i].innerHTML = getVersion();
    };

    var pThumbLabel = document.querySelector("span.setting.label").parentNode;
    pThumbLabel.style.marginBottom = "0";
    pThumbLabel.style.marginTop = "1.5em";

    for (var i = document.querySelectorAll('span.tb').length - 1; i >= 0; i--) {
        document.querySelectorAll('span.tb')[i].parentNode.parentNode.style.paddingLeft = "1.5em";
    };

    if(window.top.location.search == "?update") {
        document.querySelector(".notification").innerHTML = document.querySelector(".hidden-changelog."+lang).innerHTML;
    } else {
        document.querySelector(".notification").innerHTML = document.querySelector(".hidden-welcome."+lang).innerHTML;
        document.querySelector(".notification").classList.add("welcome");
    }

    if(window.top.location.search != "?update") {
        for (var i = document.querySelectorAll("span.new").length - 1; i >= 0; i--) {
            document.querySelectorAll("span.new")[i].classList.add("once");
        };
    }
    for (var i = document.querySelectorAll(".tb").length - 1; i >= 0; i--) {
        document.querySelectorAll(".tb")[i].parentNode.parentNode.parentNode.classList.add("thumb-opt")
    };

});
