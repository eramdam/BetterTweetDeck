window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
    });

    function getVersion() {
    var details = chrome.app.getDetails();
    return details.version;
    }

    document.querySelector(".hidden-changelog b").innerHTML = getVersion();

    var pThumbLabel = document.querySelector("span.setting.label").parentNode;
    pThumbLabel.style.marginBottom = "0";
    pThumbLabel.style.marginTop = "1.5em";

    for (var i = document.querySelectorAll('span.tb').length - 1; i >= 0; i--) {
        document.querySelectorAll('span.tb')[i].parentNode.parentNode.style.paddingLeft = "1.5em";
    };

    if(window.top.location.search == "?update") {
        document.querySelector(".notification").innerHTML = document.querySelector(".hidden-changelog").innerHTML;
    } else {
        document.querySelector(".notification").innerHTML = document.querySelector(".hidden-welcome").innerHTML;
        document.querySelector(".notification").classList.add("welcome");
    }

    if(window.top.location.search != "?update") {
        for (var i = document.querySelectorAll("span.new").length - 1; i >= 0; i--) {
            document.querySelectorAll("span.new")[i].classList.add("once");
        };
    }

});
