function nameDisplay (el) {
	if (el.querySelector('.tweet-detail')) {
		setTimeout(function() {
			var username = el.querySelector('.account-summary a[rel=user]').href.split('/').pop();
			var fullname = el.querySelector('.account-summary b.fullname').innerText;

			el.querySelector('span.username').innerText = fullname;
			el.querySelector('b.fullname').innerText = username;
		}, 0);

	} else if ((el.querySelector('.fullname') && el.querySelector('.username')) && (!el.querySelector('.prf-header'))) {
		var fullname = el.querySelector('.fullname').innerText;
		var username = el.querySelector('header a[rel=user]').href.split('/').pop();

		el.querySelector('.username').innerText = fullname;
		el.querySelector('.fullname').innerText = username;

		if (el.querySelector('.tweet-context .nbfc a[rel=user]')) {
			var username = el.querySelector('.tweet-context .nbfc a[rel=user]').href.split('/').pop();

			el.querySelector('.tweet-context .nbfc a[rel=user]').innerText = username;
		}
	} else if (el.querySelector('.nbfc a[rel=user]') && (mode == "inverted" || mode == "username")) {
		var username = el.querySelector('a[rel=user]').href.split('/').pop();
		el.querySelector('.nbfc a[rel=user]').innerText = username;
	}
}