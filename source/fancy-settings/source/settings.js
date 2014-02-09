window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
    });

    function getVersion() {
    var details = chrome.app.getDetails();
    return details.version;
    }

    document.querySelector(".hidden-changelog b").innerHTML = getVersion();

    if(window.top.location.search == "?update") {
        document.querySelector(".notification").innerHTML = document.querySelector(".hidden-changelog").innerHTML;
    } else if(window.top.location.search == "?welcome") {
        document.querySelector(".notification").innerHTML = document.querySelector(".hidden-welcome").innerHTML;
        document.querySelector(".notification").classList.add("welcome");
    } else {
        document.querySelector(".notification").classList.add('once');
    }

    if(window.top.location.search != "?update") {
        for (var i = document.querySelectorAll("span.new").length - 1; i >= 0; i--) {
            document.querySelectorAll("span.new")[i].classList.add("once");
        };
    }

});
