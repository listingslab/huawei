function setupGuide() {
	if (cms.mode == 'new'){
		setScreenTitle('New Guide');
		if (cms.slug !== undefined){
			$('#input_guide_slug').val(cms.slug);
		}
		initGuideEditors();
	}else{
		setScreenTitle('Edit Guide');
		api ('/api/'+cms.slug, 'GET', apiCallbackGuideLoad);
	}

	$('.save').click(function() {
        saveGuide();
        return false;
    });

    $('.save_close').click(function() {
   		cms.closeafter = true;
        saveGuide();
        return false;
    });
}

function saveGuide() {
	if (validateGuide()) {
		var payload = {
			title: $('#input_guide_title_en').val(),
			title_zh: $('#input_guide_title_zh').val().b64encode(),
			slug: $('#input_guide_slug').val().replace(/[^a-z0-9]/gi, '_').toLowerCase(),
			oldSlug: cms.slug,
			type: 'guide',
			hint_en: cms.alloyEditor_hint_en.get('nativeEditor').getData().b64encode(),
			hint_zh: cms.alloyEditor_hint_zh.get('nativeEditor').getData().b64encode(),
			context_en: cms.alloyEditor_context_en.get('nativeEditor').getData().b64encode(),
			context_zh: cms.alloyEditor_context_zh.get('nativeEditor').getData().b64encode(),
			background_en: cms.alloyEditor_background_en.get('nativeEditor').getData().b64encode(),
			background_zh: cms.alloyEditor_background_zh.get('nativeEditor').getData().b64encode(),
			process: $('#input_guide_process').val(),
			showlink: $('#input_guide_showlink').prop("checked"),
		}
		if (cms.mode == 'new'){
			api ('/api/', 'POST', apiCallbackGuideSave, payload);
		}else if (cms.mode == 'edit'){
			api ('/api/' + cms.slug, 'PUT', apiCallbackGuideSave, payload);
		}
	}
}

function apiCallbackGuideLoad(res){
	initGuideEditors();
	cms.doc = res.doc[0];
	$('#input_guide_title_en').val(cms.doc.title);
	$('#input_guide_title_zh').val(cms.doc.title_zh.b64decode());
	$('#input_guide_slug').val(cms.doc.slug);
	$('#input_guide_process').val(cms.doc.process);
	cms.alloyEditor_hint_en.get('nativeEditor').setData(cms.doc.hint_en.b64decode());
	cms.alloyEditor_hint_zh.get('nativeEditor').setData(cms.doc.hint_zh.b64decode());
	cms.alloyEditor_context_en.get('nativeEditor').setData(cms.doc.context_en.b64decode());
	cms.alloyEditor_context_zh.get('nativeEditor').setData(cms.doc.context_zh.b64decode());
	cms.alloyEditor_background_en.get('nativeEditor').setData(cms.doc.background_en.b64decode());
	cms.alloyEditor_background_zh.get('nativeEditor').setData(cms.doc.background_zh.b64decode());
	if (cms.doc.showlink === 'false'){
		cms.doc.showlink = false;
	}else{
		cms.doc.showlink = true;
	}
	$('#input_guide_showlink').prop('checked', cms.doc.showlink);
}

function apiCallbackGuideSave(res){
	console.log(res);
	if (res.status === 'fail'){
		if (res.errorCode === '001'){
			var message = 'API Error. Slugs must be unique. "' + res.slug + '" already exists in the database';
			alert( message);
			$('#group_guide_slug').removeClass ('has-success');
			$('#group_guide_slug_icon').removeClass ('glyphicon-ok');
			$('#input_guide_slug').val('');
			alertMessge('danger', message);
		}	
		if (res.errorCode === '002'){
			var message = 'Could not update because "' + res.slug + '" does not exist. Which is weird.';
			alertMessge('danger', message);
		}
	}else{
		var assignUrl;
		if (cms.closeafter){
			assignUrl = '/?&alert=save-success';
		}else{
			assignUrl = '/?type=' + cms.type + '&mode=edit&slug=' + res.slug + '&alert=save-success';
		}
		window.location.assign(assignUrl);
	}
}

function initGuideEditors(){
	cms.alloyEditor_hint_en = AlloyEditor.editable('hint_editor_en', cms.alloyConfig);
	cms.alloyEditor_hint_zh = AlloyEditor.editable('hint_editor_zh', cms.alloyConfig);
	cms.alloyEditor_context_en = AlloyEditor.editable('context_editor_en', cms.alloyConfig);
	cms.alloyEditor_context_zh = AlloyEditor.editable('context_editor_zh', cms.alloyConfig);
	cms.alloyEditor_background_en = AlloyEditor.editable('background_editor_en', cms.alloyConfig);
	cms.alloyEditor_background_zh = AlloyEditor.editable('background_editor_zh', cms.alloyConfig);
	$('#guide-screen').show();
}

function validateGuide() {
	var feedbackMessage = '';
	var titleValid = true;
	var slugValid = true;
	cms.requestData.input_guide_title = $('#input_guide_title_en').val();
	cms.requestData.input_guide_slug = $('#input_guide_slug').val();
	if (cms.requestData.input_guide_title == ''){
		titleValid = false;
		feedbackMessage += '<br />Please create a title for this content item';
		$('#group_guide_title_en').addClass ('has-warning');
		$('#group_guide_title_icon').addClass ('glyphicon-warning-sign');
	}else{
		$('#group_guide_title_en').removeClass ('has-warning');
		$('#group_guide_title_icon').removeClass ('glyphicon-warning-sign');
		$('#group_guide_title').addClass ('has-success');
		$('#group_guide_title_icon').addClass ('glyphicon-ok');
	}
	if (cms.requestData.input_guide_slug == ''){
		slugValid = false;
		$('#group_guide_slug').addClass ('has-warning');
		$('#group_guide_slug_icon').addClass ('glyphicon-warning-sign');
		if (titleValid){
			$('#input_guide_slug').val($('#input_guide_title_en').val().replace(/[^a-z0-9]/gi, '_').toLowerCase());
			feedbackMessage += `<br />The slug "` + $('#input_guide_slug').val() + `"" was automatically created
			Please check it is suitable and re-save`
		}else{
			feedbackMessage += '<br />Please create a slug for this content item';
		}
	}else{
		$('#group_guide_slug').removeClass ('has-warning');
		$('#group_guide_slug_icon').removeClass ('glyphicon-warning-sign');
		$('#group_guide_slug').addClass ('has-success');
		$('#group_guide_slug_icon').addClass ('glyphicon-ok');
	}
	if (titleValid && slugValid){
		hideAlertMessge();
		return true;
	}else{
		alertMessge('warning', feedbackMessage);
		if (!titleValid){
			$('#input_guide_title_en').focus();
		}
		if (!slugValid && titleValid){
			$('#input_guide_slug').focus();
		}
		return false;
	}
}
