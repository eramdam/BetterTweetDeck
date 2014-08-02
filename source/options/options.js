var Settings;

function SaveSettings() {
	$('input[type=radio]:checked').each(function(index) {
		var key = $(this).attr('name');
		Settings[key] = $(this).attr('value');
	});

	$('input[type=checkbox][name]').each(function(i) {
		var key = $(this).attr('name');
		if (key.indexOf('provide_') == -1) {
			Settings[key] = $(this).is(':checked');
		} else {
			Settings["providers"][key.replace('provide_', '')] = $(this).is(':checked');
		}
	});

	chrome.storage.sync.set({
		"BTDSettings": Settings
	}, function() {
		console.log('Options saved!');
	});
}

$(function() {

	function CGetMessage(message) {
		return chrome.i18n.getMessage(message);
	}

	// Localisation and stuff
	document.title = CGetMessage("optionsPageTitle");
	$('.version-number').text(chrome.app.getDetails().version);
	$('.user-agent').text(navigator.userAgent);

	$('.i18n').each(function(index) {
		var message = $(this).attr('data-message');
		$(this).text(CGetMessage(message));
	});

	chrome.storage.sync.get("BTDSettings", function(obj) {
		Settings = obj.BTDSettings;

		for (var setting in Settings) {
			if (Settings[setting] === true || Settings[setting] === false) {
				$('[name="' + setting + '"]').prop('checked', Settings[setting]);
			} else {
				$('[name="' + setting + '"][value="' + Settings[setting] + '"]').prop('checked', true);
			}
		}

		for (var provider in Settings["providers"]) {
			$('[name="provide_' + provider + '"]').prop('checked', Settings["providers"][provider]);
		}

		tweetPreviewClasses();
		$('#apparence input[type=checkbox], input[name=circled_avatars]').each(contentPreview);
	});

	// Taken from the Chrome Bootstrap styleguide http://roykolak.github.io/chrome-bootstrap/
	$('.menu a').click(function(ev) {
		ev.preventDefault();
		var selected = 'selected';

		$('.mainview > *').removeClass(selected);
		$('.menu li').removeClass(selected);
		setTimeout(function() {
			$('.mainview > *:not(.selected)').css('display', 'none');
		}, 100);

		$(ev.currentTarget).parent().addClass(selected);
		var currentView = $($(ev.currentTarget).attr('href'));
		currentView.css('display', 'block');
		setTimeout(function() {
			currentView.addClass(selected);
		}, 0);

		setTimeout(function() {
			$('body')[0].scrollTop = 0;
		}, 200);
	});
	$('.mainview > *:not(.selected)').css('display', 'none');

	$('.checkbox img').each(function(index) {
		var linkToImg = $(this).attr('src');
		$(this).parent().css('background-image', 'url(' + linkToImg + ')').addClass('favicon');
		$(this).remove();
	});

	$('input').on('change', SaveSettings);

	$('input[name="timestamp"], input[name="name_display"], input[name="circled_avatars"]').on('change', function() {
		tweetPreviewClasses();
	});

	$('#apparence input[type=checkbox], input[name=circled_avatars]').on('change', contentPreview);


	function tweetPreviewClasses() {
		var timestampVal = document.querySelector("input[name='timestamp']:checked").value;
		var nameVal = document.querySelector("input[name='name_display']:checked").value;
		var avatarVal = document.querySelector("input[name='circled_avatars']").checked;
		document.querySelector(".tweet-preview .name").className = "name " + nameVal;
		document.querySelector(".tweet-preview .timestamp").className = "timestamp " + timestampVal;
		document.querySelector(".tweet-preview .picture").className = "picture " + avatarVal;
	}

	function contentPreview() {
		if ($(this).is(':checked')) {
			$('#content_preview').addClass($(this).attr('name'));
		} else {
			$('#content_preview').removeClass($(this).attr('name'));
		}
	}

	if (window.location.hash === "#installed") {
		var modal = $('.overlay').clone();
        $(modal).removeAttr('style');
        $(modal).find('button, .close-button').click(function() {
          $(modal).addClass('transparent');
          setTimeout(function() {
            $(modal).remove();
          }, 1000);
        });

        $(modal).click(function() {
          $(modal).find('.page').addClass('pulse');
          $(modal).find('.page').on('webkitAnimationEnd', function() {
            $(this).removeClass('pulse');
          });
        });
        $(modal).find('.page').click(function(ev) {
          ev.stopPropagation();
        });
        $('body').append(modal);
	} else if (window.location.hash === "#updated") {
		$('a[href="#changelog"]').click();
		$('#changelog section[lang] h3:first-of-type').addClass('alert');
	}

	var currentLocale = chrome.i18n.getMessage("@@ui_locale");

	$('section[lang="'+currentLocale+'"]').show();
});