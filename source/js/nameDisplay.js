function nameDisplay (el) {
	if (el.querySelector('.tweet-detail')) {
		setTimeout(function() {
			var username = el.querySelector('.account-summary a[rel=user]').href.split('/').pop();
			var fullname = el.querySelector('.account-summary b.fullname').innerHTML;

			el.querySelector('span.username').innerText = fullname;
			el.querySelector('b.fullname').innerText = username;
		}, 0);

	} else if ( (el.querySelector('.fullname') && el.querySelector('.username')) && el.querySelectorAll('ul.tweet-actions > *').length != 1) {
		var fullname = el.querySelector('.fullname').innerHTML;
		// @TODO This produces an error when profil modals are opened and sometimes with tweets/RT
		var username = el.querySelector('header a[rel=user]');
		if (username) {
			var username = username.href.split('/').pop();
		} else {
			return;
		}
		el.querySelector('.username').innerText = fullname;
		el.querySelector('.fullname').innerText = username;

		if (el.querySelector('.tweet-context .nbfc a[rel=user]')) {
			var username = el.querySelector('.tweet-context .nbfc a[rel=user]').href.split('/').pop();

			el.querySelector('.tweet-context .nbfc a[rel=user]').innerText = username;
		} else if (el.querySelector('.nbfc a[rel=user]')) {
			var username = el.querySelector('.nbfc a[rel=user]').href.split('/').pop();

			el.querySelector('.nbfc a[rel=user]').innerText = username;
		}
	} else if (el.querySelector('.nbfc a[rel=user]') && (settings.name_display == "inverted" || settings.name_display == "username")) {
		var username = el.querySelector('a[rel=user]').href.split('/').pop();
		el.querySelector('.nbfc a[rel=user]').innerText = username;
	} else if (el.querySelectorAll('ul.tweet-actions > *').length == 1) {
		var username = el.querySelector('a[rel=user]').href.split('/').pop();
		var fullname =  el.querySelector('b.fullname').innerHTML;
		el.querySelector('span.username').innerText = fullname;
		el.querySelector('b.fullname').innerHTML = username;
	}
}