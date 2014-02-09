window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
    });

    if(window.top.location.search != "?update") {
        for (var i = document.querySelectorAll("span.new, div.notification").length - 1; i >= 0; i--) {
            document.querySelectorAll("span.new, div.notification")[i].classList.add("once");
        };
    }
});
