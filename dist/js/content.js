(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (main) {
	'use strict';

	/**
	 * Parse or format dates
	 * @class fecha
	 */
	var fecha = {},
		token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,
		dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		amPm = ['am', 'pm'],
		twoDigits = /\d\d?/, threeDigits = /\d{3}/, fourDigits = /\d{4}/,
		word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
		noop = function () {},
		dayNamesShort = [], monthNamesShort = [],
		parseFlags = {
			D: [twoDigits, function (d, v) {
				d.day = v;
			}],
			M: [twoDigits, function (d, v) {
				d.month = v - 1;
			}],
			YY: [twoDigits, function (d, v) {
				var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
				d.year = '' + (v > 68 ? cent - 1 : cent) + v;
			}],
			h: [twoDigits, function (d, v) {
				d.hour = v;
			}],
			m: [twoDigits, function (d, v) {
				d.minute = v;
			}],
			s: [twoDigits, function (d, v) {
				d.second = v;
			}],
			YYYY: [fourDigits, function (d, v) {
				d.year = v;
			}],
			S: [/\d/, function (d, v) {
				d.millisecond = v * 100;
			}],
			SS: [/\d{2}/, function (d, v) {
				d.millisecond = v * 10;
			}],
			SSS: [threeDigits, function (d, v) {
				d.millisecond = v;
			}],
			d: [twoDigits, noop],
			ddd: [word, noop],
			MMM: [word, monthUpdate('monthNamesShort')],
			MMMM: [word, monthUpdate('monthNames')],
			a: [word, function (d, v) {
				var val = v.toLowerCase();
				if (val === amPm[0]) {
					d.isPm = false;
				} else if (val === amPm[1]) {
					d.isPm = true;
				}
			}],
			ZZ: [/[\+\-]\d\d:?\d\d/, function (d, v) {
				var parts = (v + '').match(/([\+\-]|\d\d)/gi), minutes;

				if (parts) {
					minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
					d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
				}

			}]
		};
	parseFlags.dd = parseFlags.d;
	parseFlags.dddd = parseFlags.ddd;
	parseFlags.Do = parseFlags.DD = parseFlags.D;
	parseFlags.mm = parseFlags.m;
	parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
	parseFlags.MM = parseFlags.M;
	parseFlags.ss = parseFlags.s;
	parseFlags.A = parseFlags.a;

	shorten(monthNames, monthNamesShort, 3);
	shorten(dayNames, dayNamesShort, 3);

	function monthUpdate(arrName) {
		return function (d, v) {
			var index = fecha.i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
			if (~index) {
				d.month = index;
			}
		}
	}

	function pad(val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) {
			val = '0' + val;
		}
		return val;
	}

	function shorten(arr, newArr, sLen) {
		for (var i = 0, len = arr.length; i < len; i++) {
			newArr.push(arr[i].substr(0, sLen));
		}
	}

	function DoFn(D) {
		return D + [ 'th', 'st', 'nd', 'rd' ][ D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10 ];
	}

	fecha.i18n = {
		dayNamesShort: dayNamesShort,
		dayNames: dayNames,
		monthNamesShort: monthNamesShort,
		monthNames: monthNames,
		amPm: amPm,
		DoFn: DoFn
	};

	// Some common format strings
	fecha.masks = {
		'default': 'ddd MMM DD YYYY HH:mm:ss',
		shortDate: 'M/D/YY',
		mediumDate: 'MMM D, YYYY',
		longDate: 'MMMM D, YYYY',
		fullDate: 'dddd, MMMM D, YYYY',
		shortTime: 'HH:mm',
		mediumTime: 'HH:mm:ss',
		longTime: 'HH:mm:ss.SSS'
	};

	/***
	 * Format a date
	 * @method format
	 * @param {Date|number} dateObj
	 * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
	 */
	fecha.format = function (dateObj, mask) {
		if (typeof dateObj === 'number') {
			dateObj = new Date(dateObj);
		}

		if (!dateObj || typeof dateObj !== 'object' && typeof dateObj.getDate  !== 'function') {
			throw new Error('Invalid Date in fecha.format');
		}

		mask = fecha.masks[mask] || mask || fecha.masks['default'];

		var D = dateObj.getDate(),
			d = dateObj.getDay(),
			M = dateObj.getMonth(),
			y = dateObj.getFullYear(),
			H = dateObj.getHours(),
			m = dateObj.getMinutes(),
			s = dateObj.getSeconds(),
			S = dateObj.getMilliseconds(),
			o = dateObj.getTimezoneOffset(),
			flags = {
				D: D,
				DD: pad(D),
				Do: fecha.i18n.DoFn(D),
				d: d,
				dd: pad(d),
				ddd: fecha.i18n.dayNamesShort[d],
				dddd: fecha.i18n.dayNames[d],
				M: M + 1,
				MM: pad(M + 1),
				MMM: fecha.i18n.monthNamesShort[M],
				MMMM: fecha.i18n.monthNames[M],
				YY: String(y).slice(2),
				YYYY: y,
				h: H % 12 || 12,
				hh: pad(H % 12 || 12),
				H: H,
				HH: pad(H),
				m: m,
				mm: pad(m),
				s: s,
				ss: pad(s),
				S: Math.round(S / 100),
				SS: pad(Math.round(S / 10), 2),
				SSS: pad(S, 3),
				a: H < 12 ? fecha.i18n.amPm[0] : fecha.i18n.amPm[1],
				A: H < 12 ? fecha.i18n.amPm[0].toUpperCase() : fecha.i18n.amPm[1].toUpperCase(),
				ZZ: (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};

	/**
	 * Parse a date string into an object, changes - into /
	 * @method parse
	 * @param {string} dateStr Date string
	 * @param {string} format Date parse format
	 * @returns {Date|boolean}
	 */
	fecha.parse = function (dateStr, format) {
		var isValid, dateInfo, today, date, info, index;

		if (typeof format !== 'string') {
			throw new Error('Invalid format in fecha.parse');
		}

		format = fecha.masks[format] || format;

		isValid = true;
		dateInfo = {};
		format.replace(token, function ($0) {
			if (parseFlags[$0]) {
				info = parseFlags[$0];
				index = dateStr.search(info[0]);
				if (!~index) {
					isValid = false;
				} else {
					dateStr.replace(info[0], function (result) {
						info[1](dateInfo, result);
						dateStr = dateStr.substr(index + result.length);
						return result;
					});
				}
			}

			return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
		});

		if (!isValid) {
			return false;
		}

		today = new Date();
		if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
			dateInfo.hour = +dateInfo.hour + 12;
		} else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
			dateInfo.hour = 0;
		}

		if (dateInfo.timezoneOffset != null) {
			dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
			date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
				dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
		} else {
			date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
				dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
		}
		return date;
	};

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = fecha;
	} else if (typeof define === 'function' && define.amd) {
		define(function () {
			return fecha;
		});
	} else {
		main.fecha = fecha;
	}
})(this);

},{}],2:[function(require,module,exports){
'use strict';

var _fecha = require('fecha');

var _fecha2 = _interopRequireDefault(_fecha);

var _util = require('./util/util.js');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _refreshTimestamps = function _refreshTimestamps() {
  _util2.default.$('.js-timestamp').forEach(function (jsTimstp) {
    var d = new Date(Number(jsTimstp.getAttribute('data-time')));
    _util2.default.$('a, span', jsTimstp).forEach(function (el) {
      return el.innerHTML = _fecha2.default.format(d, 'MM/DD/YY hh:mm a');
    });
  });
};
var ready = new MutationObserver(function () {
  if (document.querySelector('.js-app-loading').style.display === 'none') ready.disconnect();
});

ready.observe(document.querySelector('.js-app-loading'), {
  attributes: true
});

var InjectScript = document.createElement('script');
InjectScript.src = chrome.extension.getURL('js/inject.js');
document.head.appendChild(InjectScript);

setInterval(_refreshTimestamps, _util2.default.TIMESTAMP_INTERVAL);

document.addEventListener('BTD_dataColumnFeedUpdated', function (event) {
  var detail = event.detail;
  console.log('dataColumnFeedUpdated', detail);
});

document.addEventListener('BTD_uiColumnUpdateMediaPreview', function (event) {
  console.log('BTD_uiColumnUpdateMediaPreview', JSON.parse(event.detail));
  console.log('BTD_uiColumnUpdateMediaPreview', event);
});

document.addEventListener('BTD_uiModalShowing', function (event) {
  console.log('BTD_uiModalShowing', JSON.parse(event.detail));
});

},{"./util/util.js":3,"fecha":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$ = $;
exports.log = log;
function $(sel) {
  var parent = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];

  var arr = undefined;

  arr = [].slice.call(parent.querySelectorAll(sel));

  return arr.length >= 1 ? arr : null;
}

function log() {
  var _console;

  (_console = console).log.apply(_console, arguments);
}

var TIMESTAMP_INTERVAL = exports.TIMESTAMP_INTERVAL = 1e3 * 8;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmVjaGEvZmVjaGEuanMiLCJzcmMvanMvY29udGVudC5qcyIsInNyYy9qcy91dGlsL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0NBQ3RELENBQUMsQ0FBQzs7QUFFSCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDekQsU0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0NBQzdELENBQUMsQ0FBQzs7Ozs7Ozs7UUNwQ2EsQ0FBQyxHQUFELENBQUM7UUFRRCxHQUFHLEdBQUgsR0FBRztBQVJaLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBcUI7TUFBbkIsTUFBTSx5REFBRyxRQUFROztBQUN0QyxNQUFJLEdBQUcsWUFBQSxDQUFDOztBQUVSLEtBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFbEQsU0FBTyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO0NBQ3JDOztBQUVNLFNBQVMsR0FBRyxHQUFVOzs7QUFDM0IsY0FBQSxPQUFPLEVBQUMsR0FBRyxNQUFBLHFCQUFTLENBQUM7Q0FDdEI7O0FBRU0sSUFBTSxrQkFBa0IsV0FBbEIsa0JBQWtCLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKG1haW4pIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qKlxuXHQgKiBQYXJzZSBvciBmb3JtYXQgZGF0ZXNcblx0ICogQGNsYXNzIGZlY2hhXG5cdCAqL1xuXHR2YXIgZmVjaGEgPSB7fSxcblx0XHR0b2tlbiA9IC9kezEsNH18TXsxLDR9fFlZKD86WVkpP3xTezEsM318RG98Wlp8KFtIaE1zRG1dKVxcMT98W2FBXXxcIlteXCJdKlwifCdbXiddKicvZyxcblx0XHRkYXlOYW1lcyA9IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXSxcblx0XHRtb250aE5hbWVzID0gWydKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ10sXG5cdFx0YW1QbSA9IFsnYW0nLCAncG0nXSxcblx0XHR0d29EaWdpdHMgPSAvXFxkXFxkPy8sIHRocmVlRGlnaXRzID0gL1xcZHszfS8sIGZvdXJEaWdpdHMgPSAvXFxkezR9Lyxcblx0XHR3b3JkID0gL1swLTldKlsnYS16XFx1MDBBMC1cXHUwNUZGXFx1MDcwMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSt8W1xcdTA2MDAtXFx1MDZGRlxcL10rKFxccyo/W1xcdTA2MDAtXFx1MDZGRl0rKXsxLDJ9L2ksXG5cdFx0bm9vcCA9IGZ1bmN0aW9uICgpIHt9LFxuXHRcdGRheU5hbWVzU2hvcnQgPSBbXSwgbW9udGhOYW1lc1Nob3J0ID0gW10sXG5cdFx0cGFyc2VGbGFncyA9IHtcblx0XHRcdEQ6IFt0d29EaWdpdHMsIGZ1bmN0aW9uIChkLCB2KSB7XG5cdFx0XHRcdGQuZGF5ID0gdjtcblx0XHRcdH1dLFxuXHRcdFx0TTogW3R3b0RpZ2l0cywgZnVuY3Rpb24gKGQsIHYpIHtcblx0XHRcdFx0ZC5tb250aCA9IHYgLSAxO1xuXHRcdFx0fV0sXG5cdFx0XHRZWTogW3R3b0RpZ2l0cywgZnVuY3Rpb24gKGQsIHYpIHtcblx0XHRcdFx0dmFyIGRhID0gbmV3IERhdGUoKSwgY2VudCA9ICsoJycgKyBkYS5nZXRGdWxsWWVhcigpKS5zdWJzdHIoMCwgMik7XG5cdFx0XHRcdGQueWVhciA9ICcnICsgKHYgPiA2OCA/IGNlbnQgLSAxIDogY2VudCkgKyB2O1xuXHRcdFx0fV0sXG5cdFx0XHRoOiBbdHdvRGlnaXRzLCBmdW5jdGlvbiAoZCwgdikge1xuXHRcdFx0XHRkLmhvdXIgPSB2O1xuXHRcdFx0fV0sXG5cdFx0XHRtOiBbdHdvRGlnaXRzLCBmdW5jdGlvbiAoZCwgdikge1xuXHRcdFx0XHRkLm1pbnV0ZSA9IHY7XG5cdFx0XHR9XSxcblx0XHRcdHM6IFt0d29EaWdpdHMsIGZ1bmN0aW9uIChkLCB2KSB7XG5cdFx0XHRcdGQuc2Vjb25kID0gdjtcblx0XHRcdH1dLFxuXHRcdFx0WVlZWTogW2ZvdXJEaWdpdHMsIGZ1bmN0aW9uIChkLCB2KSB7XG5cdFx0XHRcdGQueWVhciA9IHY7XG5cdFx0XHR9XSxcblx0XHRcdFM6IFsvXFxkLywgZnVuY3Rpb24gKGQsIHYpIHtcblx0XHRcdFx0ZC5taWxsaXNlY29uZCA9IHYgKiAxMDA7XG5cdFx0XHR9XSxcblx0XHRcdFNTOiBbL1xcZHsyfS8sIGZ1bmN0aW9uIChkLCB2KSB7XG5cdFx0XHRcdGQubWlsbGlzZWNvbmQgPSB2ICogMTA7XG5cdFx0XHR9XSxcblx0XHRcdFNTUzogW3RocmVlRGlnaXRzLCBmdW5jdGlvbiAoZCwgdikge1xuXHRcdFx0XHRkLm1pbGxpc2Vjb25kID0gdjtcblx0XHRcdH1dLFxuXHRcdFx0ZDogW3R3b0RpZ2l0cywgbm9vcF0sXG5cdFx0XHRkZGQ6IFt3b3JkLCBub29wXSxcblx0XHRcdE1NTTogW3dvcmQsIG1vbnRoVXBkYXRlKCdtb250aE5hbWVzU2hvcnQnKV0sXG5cdFx0XHRNTU1NOiBbd29yZCwgbW9udGhVcGRhdGUoJ21vbnRoTmFtZXMnKV0sXG5cdFx0XHRhOiBbd29yZCwgZnVuY3Rpb24gKGQsIHYpIHtcblx0XHRcdFx0dmFyIHZhbCA9IHYudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0aWYgKHZhbCA9PT0gYW1QbVswXSkge1xuXHRcdFx0XHRcdGQuaXNQbSA9IGZhbHNlO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHZhbCA9PT0gYW1QbVsxXSkge1xuXHRcdFx0XHRcdGQuaXNQbSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1dLFxuXHRcdFx0Wlo6IFsvW1xcK1xcLV1cXGRcXGQ6P1xcZFxcZC8sIGZ1bmN0aW9uIChkLCB2KSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9ICh2ICsgJycpLm1hdGNoKC8oW1xcK1xcLV18XFxkXFxkKS9naSksIG1pbnV0ZXM7XG5cblx0XHRcdFx0aWYgKHBhcnRzKSB7XG5cdFx0XHRcdFx0bWludXRlcyA9ICsocGFydHNbMV0gKiA2MCkgKyBwYXJzZUludChwYXJ0c1syXSwgMTApO1xuXHRcdFx0XHRcdGQudGltZXpvbmVPZmZzZXQgPSBwYXJ0c1swXSA9PT0gJysnID8gbWludXRlcyA6IC1taW51dGVzO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1dXG5cdFx0fTtcblx0cGFyc2VGbGFncy5kZCA9IHBhcnNlRmxhZ3MuZDtcblx0cGFyc2VGbGFncy5kZGRkID0gcGFyc2VGbGFncy5kZGQ7XG5cdHBhcnNlRmxhZ3MuRG8gPSBwYXJzZUZsYWdzLkREID0gcGFyc2VGbGFncy5EO1xuXHRwYXJzZUZsYWdzLm1tID0gcGFyc2VGbGFncy5tO1xuXHRwYXJzZUZsYWdzLmhoID0gcGFyc2VGbGFncy5IID0gcGFyc2VGbGFncy5ISCA9IHBhcnNlRmxhZ3MuaDtcblx0cGFyc2VGbGFncy5NTSA9IHBhcnNlRmxhZ3MuTTtcblx0cGFyc2VGbGFncy5zcyA9IHBhcnNlRmxhZ3Mucztcblx0cGFyc2VGbGFncy5BID0gcGFyc2VGbGFncy5hO1xuXG5cdHNob3J0ZW4obW9udGhOYW1lcywgbW9udGhOYW1lc1Nob3J0LCAzKTtcblx0c2hvcnRlbihkYXlOYW1lcywgZGF5TmFtZXNTaG9ydCwgMyk7XG5cblx0ZnVuY3Rpb24gbW9udGhVcGRhdGUoYXJyTmFtZSkge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoZCwgdikge1xuXHRcdFx0dmFyIGluZGV4ID0gZmVjaGEuaTE4blthcnJOYW1lXS5pbmRleE9mKHYuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB2LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpKTtcblx0XHRcdGlmICh+aW5kZXgpIHtcblx0XHRcdFx0ZC5tb250aCA9IGluZGV4O1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHBhZCh2YWwsIGxlbikge1xuXHRcdHZhbCA9IFN0cmluZyh2YWwpO1xuXHRcdGxlbiA9IGxlbiB8fCAyO1xuXHRcdHdoaWxlICh2YWwubGVuZ3RoIDwgbGVuKSB7XG5cdFx0XHR2YWwgPSAnMCcgKyB2YWw7XG5cdFx0fVxuXHRcdHJldHVybiB2YWw7XG5cdH1cblxuXHRmdW5jdGlvbiBzaG9ydGVuKGFyciwgbmV3QXJyLCBzTGVuKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0bmV3QXJyLnB1c2goYXJyW2ldLnN1YnN0cigwLCBzTGVuKSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gRG9GbihEKSB7XG5cdFx0cmV0dXJuIEQgKyBbICd0aCcsICdzdCcsICduZCcsICdyZCcgXVsgRCAlIDEwID4gMyA/IDAgOiAoRCAtIEQgJSAxMCAhPT0gMTApICogRCAlIDEwIF07XG5cdH1cblxuXHRmZWNoYS5pMThuID0ge1xuXHRcdGRheU5hbWVzU2hvcnQ6IGRheU5hbWVzU2hvcnQsXG5cdFx0ZGF5TmFtZXM6IGRheU5hbWVzLFxuXHRcdG1vbnRoTmFtZXNTaG9ydDogbW9udGhOYW1lc1Nob3J0LFxuXHRcdG1vbnRoTmFtZXM6IG1vbnRoTmFtZXMsXG5cdFx0YW1QbTogYW1QbSxcblx0XHREb0ZuOiBEb0ZuXG5cdH07XG5cblx0Ly8gU29tZSBjb21tb24gZm9ybWF0IHN0cmluZ3Ncblx0ZmVjaGEubWFza3MgPSB7XG5cdFx0J2RlZmF1bHQnOiAnZGRkIE1NTSBERCBZWVlZIEhIOm1tOnNzJyxcblx0XHRzaG9ydERhdGU6ICdNL0QvWVknLFxuXHRcdG1lZGl1bURhdGU6ICdNTU0gRCwgWVlZWScsXG5cdFx0bG9uZ0RhdGU6ICdNTU1NIEQsIFlZWVknLFxuXHRcdGZ1bGxEYXRlOiAnZGRkZCwgTU1NTSBELCBZWVlZJyxcblx0XHRzaG9ydFRpbWU6ICdISDptbScsXG5cdFx0bWVkaXVtVGltZTogJ0hIOm1tOnNzJyxcblx0XHRsb25nVGltZTogJ0hIOm1tOnNzLlNTUydcblx0fTtcblxuXHQvKioqXG5cdCAqIEZvcm1hdCBhIGRhdGVcblx0ICogQG1ldGhvZCBmb3JtYXRcblx0ICogQHBhcmFtIHtEYXRlfG51bWJlcn0gZGF0ZU9ialxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbWFzayBGb3JtYXQgb2YgdGhlIGRhdGUsIGkuZS4gJ21tLWRkLXl5JyBvciAnc2hvcnREYXRlJ1xuXHQgKi9cblx0ZmVjaGEuZm9ybWF0ID0gZnVuY3Rpb24gKGRhdGVPYmosIG1hc2spIHtcblx0XHRpZiAodHlwZW9mIGRhdGVPYmogPT09ICdudW1iZXInKSB7XG5cdFx0XHRkYXRlT2JqID0gbmV3IERhdGUoZGF0ZU9iaik7XG5cdFx0fVxuXG5cdFx0aWYgKCFkYXRlT2JqIHx8IHR5cGVvZiBkYXRlT2JqICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgZGF0ZU9iai5nZXREYXRlICAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIERhdGUgaW4gZmVjaGEuZm9ybWF0Jyk7XG5cdFx0fVxuXG5cdFx0bWFzayA9IGZlY2hhLm1hc2tzW21hc2tdIHx8IG1hc2sgfHwgZmVjaGEubWFza3NbJ2RlZmF1bHQnXTtcblxuXHRcdHZhciBEID0gZGF0ZU9iai5nZXREYXRlKCksXG5cdFx0XHRkID0gZGF0ZU9iai5nZXREYXkoKSxcblx0XHRcdE0gPSBkYXRlT2JqLmdldE1vbnRoKCksXG5cdFx0XHR5ID0gZGF0ZU9iai5nZXRGdWxsWWVhcigpLFxuXHRcdFx0SCA9IGRhdGVPYmouZ2V0SG91cnMoKSxcblx0XHRcdG0gPSBkYXRlT2JqLmdldE1pbnV0ZXMoKSxcblx0XHRcdHMgPSBkYXRlT2JqLmdldFNlY29uZHMoKSxcblx0XHRcdFMgPSBkYXRlT2JqLmdldE1pbGxpc2Vjb25kcygpLFxuXHRcdFx0byA9IGRhdGVPYmouZ2V0VGltZXpvbmVPZmZzZXQoKSxcblx0XHRcdGZsYWdzID0ge1xuXHRcdFx0XHREOiBELFxuXHRcdFx0XHRERDogcGFkKEQpLFxuXHRcdFx0XHREbzogZmVjaGEuaTE4bi5Eb0ZuKEQpLFxuXHRcdFx0XHRkOiBkLFxuXHRcdFx0XHRkZDogcGFkKGQpLFxuXHRcdFx0XHRkZGQ6IGZlY2hhLmkxOG4uZGF5TmFtZXNTaG9ydFtkXSxcblx0XHRcdFx0ZGRkZDogZmVjaGEuaTE4bi5kYXlOYW1lc1tkXSxcblx0XHRcdFx0TTogTSArIDEsXG5cdFx0XHRcdE1NOiBwYWQoTSArIDEpLFxuXHRcdFx0XHRNTU06IGZlY2hhLmkxOG4ubW9udGhOYW1lc1Nob3J0W01dLFxuXHRcdFx0XHRNTU1NOiBmZWNoYS5pMThuLm1vbnRoTmFtZXNbTV0sXG5cdFx0XHRcdFlZOiBTdHJpbmcoeSkuc2xpY2UoMiksXG5cdFx0XHRcdFlZWVk6IHksXG5cdFx0XHRcdGg6IEggJSAxMiB8fCAxMixcblx0XHRcdFx0aGg6IHBhZChIICUgMTIgfHwgMTIpLFxuXHRcdFx0XHRIOiBILFxuXHRcdFx0XHRISDogcGFkKEgpLFxuXHRcdFx0XHRtOiBtLFxuXHRcdFx0XHRtbTogcGFkKG0pLFxuXHRcdFx0XHRzOiBzLFxuXHRcdFx0XHRzczogcGFkKHMpLFxuXHRcdFx0XHRTOiBNYXRoLnJvdW5kKFMgLyAxMDApLFxuXHRcdFx0XHRTUzogcGFkKE1hdGgucm91bmQoUyAvIDEwKSwgMiksXG5cdFx0XHRcdFNTUzogcGFkKFMsIDMpLFxuXHRcdFx0XHRhOiBIIDwgMTIgPyBmZWNoYS5pMThuLmFtUG1bMF0gOiBmZWNoYS5pMThuLmFtUG1bMV0sXG5cdFx0XHRcdEE6IEggPCAxMiA/IGZlY2hhLmkxOG4uYW1QbVswXS50b1VwcGVyQ2FzZSgpIDogZmVjaGEuaTE4bi5hbVBtWzFdLnRvVXBwZXJDYXNlKCksXG5cdFx0XHRcdFpaOiAobyA+IDAgPyAnLScgOiAnKycpICsgcGFkKE1hdGguZmxvb3IoTWF0aC5hYnMobykgLyA2MCkgKiAxMDAgKyBNYXRoLmFicyhvKSAlIDYwLCA0KVxuXHRcdFx0fTtcblxuXHRcdHJldHVybiBtYXNrLnJlcGxhY2UodG9rZW4sIGZ1bmN0aW9uICgkMCkge1xuXHRcdFx0cmV0dXJuICQwIGluIGZsYWdzID8gZmxhZ3NbJDBdIDogJDAuc2xpY2UoMSwgJDAubGVuZ3RoIC0gMSk7XG5cdFx0fSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFBhcnNlIGEgZGF0ZSBzdHJpbmcgaW50byBhbiBvYmplY3QsIGNoYW5nZXMgLSBpbnRvIC9cblx0ICogQG1ldGhvZCBwYXJzZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGF0ZVN0ciBEYXRlIHN0cmluZ1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gZm9ybWF0IERhdGUgcGFyc2UgZm9ybWF0XG5cdCAqIEByZXR1cm5zIHtEYXRlfGJvb2xlYW59XG5cdCAqL1xuXHRmZWNoYS5wYXJzZSA9IGZ1bmN0aW9uIChkYXRlU3RyLCBmb3JtYXQpIHtcblx0XHR2YXIgaXNWYWxpZCwgZGF0ZUluZm8sIHRvZGF5LCBkYXRlLCBpbmZvLCBpbmRleDtcblxuXHRcdGlmICh0eXBlb2YgZm9ybWF0ICE9PSAnc3RyaW5nJykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGZvcm1hdCBpbiBmZWNoYS5wYXJzZScpO1xuXHRcdH1cblxuXHRcdGZvcm1hdCA9IGZlY2hhLm1hc2tzW2Zvcm1hdF0gfHwgZm9ybWF0O1xuXG5cdFx0aXNWYWxpZCA9IHRydWU7XG5cdFx0ZGF0ZUluZm8gPSB7fTtcblx0XHRmb3JtYXQucmVwbGFjZSh0b2tlbiwgZnVuY3Rpb24gKCQwKSB7XG5cdFx0XHRpZiAocGFyc2VGbGFnc1skMF0pIHtcblx0XHRcdFx0aW5mbyA9IHBhcnNlRmxhZ3NbJDBdO1xuXHRcdFx0XHRpbmRleCA9IGRhdGVTdHIuc2VhcmNoKGluZm9bMF0pO1xuXHRcdFx0XHRpZiAoIX5pbmRleCkge1xuXHRcdFx0XHRcdGlzVmFsaWQgPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkYXRlU3RyLnJlcGxhY2UoaW5mb1swXSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdFx0XHRcdFx0aW5mb1sxXShkYXRlSW5mbywgcmVzdWx0KTtcblx0XHRcdFx0XHRcdGRhdGVTdHIgPSBkYXRlU3RyLnN1YnN0cihpbmRleCArIHJlc3VsdC5sZW5ndGgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcGFyc2VGbGFnc1skMF0gPyAnJyA6ICQwLnNsaWNlKDEsICQwLmxlbmd0aCAtIDEpO1xuXHRcdH0pO1xuXG5cdFx0aWYgKCFpc1ZhbGlkKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dG9kYXkgPSBuZXcgRGF0ZSgpO1xuXHRcdGlmIChkYXRlSW5mby5pc1BtID09PSB0cnVlICYmIGRhdGVJbmZvLmhvdXIgIT0gbnVsbCAmJiArZGF0ZUluZm8uaG91ciAhPT0gMTIpIHtcblx0XHRcdGRhdGVJbmZvLmhvdXIgPSArZGF0ZUluZm8uaG91ciArIDEyO1xuXHRcdH0gZWxzZSBpZiAoZGF0ZUluZm8uaXNQbSA9PT0gZmFsc2UgJiYgK2RhdGVJbmZvLmhvdXIgPT09IDEyKSB7XG5cdFx0XHRkYXRlSW5mby5ob3VyID0gMDtcblx0XHR9XG5cblx0XHRpZiAoZGF0ZUluZm8udGltZXpvbmVPZmZzZXQgIT0gbnVsbCkge1xuXHRcdFx0ZGF0ZUluZm8ubWludXRlID0gKyhkYXRlSW5mby5taW51dGUgfHwgMCkgLSArZGF0ZUluZm8udGltZXpvbmVPZmZzZXQ7XG5cdFx0XHRkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZUluZm8ueWVhciB8fCB0b2RheS5nZXRGdWxsWWVhcigpLCBkYXRlSW5mby5tb250aCB8fCAwLCBkYXRlSW5mby5kYXkgfHwgMSxcblx0XHRcdFx0ZGF0ZUluZm8uaG91ciB8fCAwLCBkYXRlSW5mby5taW51dGUgfHwgMCwgZGF0ZUluZm8uc2Vjb25kIHx8IDAsIGRhdGVJbmZvLm1pbGxpc2Vjb25kIHx8IDApKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGF0ZSA9IG5ldyBEYXRlKGRhdGVJbmZvLnllYXIgfHwgdG9kYXkuZ2V0RnVsbFllYXIoKSwgZGF0ZUluZm8ubW9udGggfHwgMCwgZGF0ZUluZm8uZGF5IHx8IDEsXG5cdFx0XHRcdGRhdGVJbmZvLmhvdXIgfHwgMCwgZGF0ZUluZm8ubWludXRlIHx8IDAsIGRhdGVJbmZvLnNlY29uZCB8fCAwLCBkYXRlSW5mby5taWxsaXNlY29uZCB8fCAwKTtcblx0XHR9XG5cdFx0cmV0dXJuIGRhdGU7XG5cdH07XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmZWNoYTtcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGZlY2hhO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdG1haW4uZmVjaGEgPSBmZWNoYTtcblx0fVxufSkodGhpcyk7XG4iLCJpbXBvcnQgZmVjaGEgZnJvbSAnZmVjaGEnO1xuaW1wb3J0IHV0aWwgZnJvbSAnLi91dGlsL3V0aWwuanMnO1xuY29uc3QgX3JlZnJlc2hUaW1lc3RhbXBzID0gKCkgPT4ge1xuICB1dGlsLiQoJy5qcy10aW1lc3RhbXAnKS5mb3JFYWNoKChqc1RpbXN0cCkgPT4ge1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShOdW1iZXIoanNUaW1zdHAuZ2V0QXR0cmlidXRlKCdkYXRhLXRpbWUnKSkpO1xuICAgIHV0aWwuJCgnYSwgc3BhbicsIGpzVGltc3RwKS5mb3JFYWNoKChlbCkgPT4gZWwuaW5uZXJIVE1MID0gZmVjaGEuZm9ybWF0KGQsICdNTS9ERC9ZWSBoaDptbSBhJykpO1xuICB9KTtcbn07XG5jb25zdCByZWFkeSA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1hcHAtbG9hZGluZycpLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJylcbiAgICByZWFkeS5kaXNjb25uZWN0KCk7XG59KTtcblxucmVhZHkub2JzZXJ2ZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYXBwLWxvYWRpbmcnKSwge1xuICBhdHRyaWJ1dGVzOiB0cnVlXG59KTtcblxuY29uc3QgSW5qZWN0U2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5JbmplY3RTY3JpcHQuc3JjID0gY2hyb21lLmV4dGVuc2lvbi5nZXRVUkwoJ2pzL2luamVjdC5qcycpO1xuZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChJbmplY3RTY3JpcHQpO1xuXG5cbnNldEludGVydmFsKF9yZWZyZXNoVGltZXN0YW1wcywgdXRpbC5USU1FU1RBTVBfSU5URVJWQUwpO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdCVERfZGF0YUNvbHVtbkZlZWRVcGRhdGVkJywgKGV2ZW50KSA9PiB7XG4gIGNvbnN0IGRldGFpbCA9IGV2ZW50LmRldGFpbDtcbiAgY29uc29sZS5sb2coJ2RhdGFDb2x1bW5GZWVkVXBkYXRlZCcsIGRldGFpbCk7XG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignQlREX3VpQ29sdW1uVXBkYXRlTWVkaWFQcmV2aWV3JywgKGV2ZW50KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdCVERfdWlDb2x1bW5VcGRhdGVNZWRpYVByZXZpZXcnLCBKU09OLnBhcnNlKGV2ZW50LmRldGFpbCkpO1xuICBjb25zb2xlLmxvZygnQlREX3VpQ29sdW1uVXBkYXRlTWVkaWFQcmV2aWV3JywgZXZlbnQpO1xufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0JURF91aU1vZGFsU2hvd2luZycsIChldmVudCkgPT4ge1xuICBjb25zb2xlLmxvZygnQlREX3VpTW9kYWxTaG93aW5nJywgSlNPTi5wYXJzZShldmVudC5kZXRhaWwpKTtcbn0pOyIsImV4cG9ydCBmdW5jdGlvbiAkKHNlbCwgcGFyZW50ID0gZG9jdW1lbnQpIHtcbiAgbGV0IGFycjtcblxuICBhcnIgPSBbXS5zbGljZS5jYWxsKHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXG4gIHJldHVybiBhcnIubGVuZ3RoID49IDEgPyBhcnIgOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nKC4uLmFyZ3MpIHtcbiAgY29uc29sZS5sb2coLi4uYXJncyk7XG59XG5cbmV4cG9ydCBjb25zdCBUSU1FU1RBTVBfSU5URVJWQUwgPSAxZTMgKiA4OyJdfQ==
