$( document ).ready(function() {
	cms = {};
	cms.slug = '';
	cms.requestData = {};

	processURLParams();
	alloyConfig();
	setupScreen();
	setupButtons();

	setTimeout(function() {
		try {
			setCSS($('body'), 'visibility', 'visible');
		}catch (err) {
			console.log('setTimeout \n\n' + err);
		}
	}, 500);
});
