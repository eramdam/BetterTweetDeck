function buildingEmojiComposer(emojiSource) {
    if (!document.body.classList.contains('emoji-composer-added')) {
        var emojiComposerHTML = emojiSource;
        var emojiComposerButton = '<button class="js-add-emojis js-show-tip needsclick btn btn-on-blue full-width txt-left margin-bl padding-vm" tabindex="0" data-original-title="" id="emojiButton" title=""> <i class="icon btd-icon-smile"></i> <span class="label padding-ls">Emojis</span> </button>';
        document.querySelector(".js-add-image-button").insertAdjacentHTML("beforebegin", emojiComposerButton);
        var emojiHolder = document.createElement("span");
        emojiHolder.className = "js-emoji-holder";
        emojiHolder.innerHTML = emojiComposerHTML;
        document.querySelector(".js-add-emojis").insertAdjacentHTML("afterend", emojiHolder.outerHTML);
        document.querySelector(".js-add-emojis").addEventListener("click", function() {
            if (document.querySelector(".emoji-popover").style.display == "none") {
                document.querySelector(".emoji-popover").style.display = "block";
                document.querySelector(".emoji-popover").setAttribute("id", "emojiOpened");

            } else {
                document.querySelector(".emoji-popover").style.display = "none";
                document.querySelector(".emoji-popover").setAttribute("id", "");
            }
        });

        var catButtons = document.querySelectorAll(".category-chooser > a");
        for (var i = catButtons.length - 1; i >= 0; i--) {
            catButtons[i].addEventListener("click", function(e) {
                e.target.parentNode.querySelector(".active").classList.remove("active");
                e.target.classList.toggle("active");
                document.querySelector(".emoji-container > div.active").classList.toggle("active");
                document.querySelector("." + e.target.getAttribute("data-cat")).classList.toggle("active");
                return false;
            });
        };
        var emojisImg = document.querySelectorAll(".emoji-container > div > a");
        for (var i = emojisImg.length - 1; i >= 0; i--) {
            emojisImg[i].addEventListener("click", function(e) {
                document.querySelector("textarea.js-compose-text").value += e.target.getAttribute("data-string");
                document.querySelector("textarea.js-compose-text").dispatchEvent(new Event("change"));
                return false;
            });
        };
        document.body.classList.add("emoji-composer-added");
        document.onclick = function() {
            if (clickedOutsideElement('emojiOpened') && clickedOutsideElement("emojiButton") && document.getElementById("emojiOpened") != null) {
                document.getElementById("emojiOpened").style.display = "none";
                document.getElementById("emojiOpened").setAttribute("id", "");
            }
        };
    }
}