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
		month = (month < 10) ? '0' + month : month;

		var minutes = ts.getMinutes();
		minutes = (minutes < 10) ? '0' + minutes : minutes;

		var hours = ts.getHours();
		hours = (hours < 10) ? '0' + hours : hours;

		var day = ts.getDate();
		day = (day < 10) ? '0' + day : day;

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