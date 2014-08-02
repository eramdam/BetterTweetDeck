var Settings;

function SaveSettings() {
		$('input[type=radio]:checked').each(function (index) {
			var key = $(this).attr('name');
			Settings[key] = $(this).attr('value');
		});

		$('input[type=checkbox][name]').each(function(i) {
			var key = $(this).attr('name');
			if (key.indexOf('provide_') == -1) {
				Settings[key] = $(this).is(':checked');
			} else {
				Settings["providers"][key.replace('provide_','')] = $(this).is(':checked');
			}
		});

		chrome.storage.sync.set({"BTDOptions": Settings}, function () {
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

	$('.i18n').each(function (index) {
		var message = $(this).attr('data-message');
		$(this).text(CGetMessage(message));
	});

	chrome.storage.sync.get("BTDOptions", function (obj) {
		Settings = obj.BTDOptions;

		for (var setting in Settings) {
			if (Settings[setting] === true || Settings[setting] === false) {
				$('[name="'+setting+'"]').prop('checked', Settings[setting]);
			} else {
				$('[name="'+setting+'"][value="'+Settings[setting]+'"]').prop('checked', true);
			}
		}

		for (var provider in Settings["providers"]) {
			$('[name="provide_'+provider+'"]').prop('checked', Settings["providers"][provider]);
		}
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

	$('.checkbox img').each(function (index) {
		var linkToImg = $(this).attr('src');
		$(this).parent().css('background-image','url('+linkToImg+')').addClass('favicon');
		$(this).remove();
	});

	$('input').on('change', SaveSettings);

});