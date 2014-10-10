function timeIsNotRelative(el, mode) {
	function setDateString(mode) {
		if (mode == "absolute_us") {
			dateString = month + "/" + day + "/" + year + " " + hours + ":" + minutes;
		} else {
			dateString = day + "/" + month + "/" + year + " " + hours + ":" + minutes;
		}			
	}


	if (el != undefined && mode != undefined) {
		var ts = el.getAttribute('datetime');
		var ts = new Date(ts);

		var year = ts.getFullYear();

		var month = ts.getMonth()+1;
		month = pad(month);

		var minutes = ts.getMinutes();
		minutes = pad(minutes);

		var hours = ts.getHours();
		hours = pad(hours);

		var day = ts.getDate();
		day = pad(day);

		var dateString;

		if (settings.full_after_24h == true) {
			var now = new Date();
			var difference = now - ts;
			var msPerDay = 86400000;
			if (difference < msPerDay) dateString = hours + ":" + minutes;
			else setDateString(mode);
		} else {
			setDateString(mode);
		}

		el.querySelector('*').innerText = dateString;
	}

}