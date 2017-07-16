$( document ).ready(function() {
	// api('http://localhost:3000/content/en/initiate_introduction', 
	// 	'get', introCallBack, {});

	api('http://localhost:3000/content/en/initiate_introduction_guide', 
	 	'get', guideCallBack, {});

});

function introCallBack (res){
	//console.log(res.doc);
	var intro = res.doc.en.b64decode();
	$('#intro').html (intro);
}

function guideCallBack (res){
	console.log(res.doc.hint_en);
	var hint = res.doc.hint_en.b64decode();
	$('#hint').html (hint);
	var context = res.doc.context_en.b64decode();
	$('#context').html (context);
	var background = res.doc.background_en.b64decode();
	$('#background').html (background);
}