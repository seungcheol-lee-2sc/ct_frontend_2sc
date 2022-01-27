/* eslint-disable no-array-constructor */
window.smartlook ||
	(function (d) {
		const o = (smartlook = function () {
			o.api.push(arguments);
		});
		const h = d.getElementsByTagName('head')[0];
		const c = d.createElement('script');
		o.api = new Array();
		c.async = true;
		c.type = 'text/javascript';
		c.charset = 'utf-8';
		c.src = 'https://rec.smartlook.com/recorder.js';
		h.appendChild(c);
	})(document);
smartlook('init', '92be0ce1de8330e5743b25588a033f5a84aa7385');
