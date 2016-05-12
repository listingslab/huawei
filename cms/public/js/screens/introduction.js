function setupIntroduction() {
	if (cms.mode == 'new'){
		setScreenTitle('New Introduction');
		initIntroductionEditors();
		if (cms.slug !== undefined){
			$('#input_intro_slug').val(cms.slug);
		}
	}else{
		setScreenTitle('Edit Introduction');
		api ('/api/'+cms.slug, 'GET', apiCallbackIntroductionLoad);
	}
	$('.save').click(function() {
        saveIntroduction();
        return false;
    });

   	$('.save_close').click(function() {
   		cms.closeafter = true;
        saveIntroduction();
        return false;
    });
}

function initIntroductionEditors(){
	cms.alloyEditor_en = AlloyEditor.editable('editor_en', cms.alloyConfig);
	cms.alloyEditor_en.extraPlugins =  AlloyEditor.Core.ATTRS.extraPlugins.value + ',oembed,embed',
	cms.alloyEditor_zh = AlloyEditor.editable('editor_zh', cms.alloyConfig);
	$('#introduction-screen').show();
}

function apiCallbackIntroductionLoad(res){
	initIntroductionEditors();
	cms.doc = res.doc[0];
	$('#input_intro_title').val(cms.doc.title);
	$('#input_intro_slug').val(cms.doc.slug);
	$('#input_intro_preview').val(cms.doc.preview);
	$('#input_intro_process').val(cms.doc.process);
	if (cms.doc.showlink === 'false'){
		cms.doc.showlink = false;
	}else{
		cms.doc.showlink = true;
	}
	$('#input_intro_showlink').prop('checked', cms.doc.showlink);
	cms.alloyEditor_en.get('nativeEditor').setData(cms.doc.en.b64decode());
    cms.alloyEditor_zh.get('nativeEditor').setData(cms.doc.zh.b64decode());
}

function apiCallbackIntroductionSave(res){
	if (res.status === 'fail'){
		if (res.errorCode === '001'){
			var message = 'API Error. Slugs must be unique. "' + res.slug + '" already exists in the database';
			alert( message);
			$('#group_intro_slug').removeClass ('has-success');
			$('#group_intro_slug_icon').removeClass ('glyphicon-ok');
			$('#input_intro_slug').val('');
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

function saveIntroduction() {
	if (validateIntroduction()) {
		var payload = {
			title: $('#input_intro_title').val(),
			slug: $('#input_intro_slug').val().replace(/[^a-z0-9]/gi, '_').toLowerCase(),
			oldSlug: cms.slug,
			type: 'introduction',
			process: $('#input_intro_process').val(),
			preview: $('#input_intro_preview').val(),
			showlink: $('#input_intro_showlink').prop("checked"),
			en: cms.alloyEditor_en.get('nativeEditor').getData().b64encode(),
			zh: cms.alloyEditor_zh.get('nativeEditor').getData().b64encode()
		}

		if (cms.mode == 'new'){
			api ('/api/', 'POST', apiCallbackIntroductionSave, payload);
		}else if (cms.mode == 'edit'){
			api ('/api/' + cms.slug, 'PUT', apiCallbackIntroductionSave, payload);
		}
	}
}

function validateIntroduction() {
	var feedbackMessage = '';
	var titleValid = true;
	var slugValid = true;
	cms.requestData.input_intro_title = $('#input_intro_title').val();
	cms.requestData.input_intro_slug = $('#input_intro_slug').val();
	cms.requestData.input_intro_showlink = $('#input_intro_showlink').is(":checked");
	if (cms.requestData.input_intro_title == ''){
		titleValid = false;
		feedbackMessage += '<br />Please create a title for this content item';
		$('#group_intro_title').addClass ('has-warning');
		$('#group_intro_title_icon').addClass ('glyphicon-warning-sign');
	}else{
		$('#group_intro_title').removeClass ('has-warning');
		$('#group_intro_title_icon').removeClass ('glyphicon-warning-sign');
		$('#group_intro_title').addClass ('has-success');
		$('#group_intro_title_icon').addClass ('glyphicon-ok');
	}
	if (cms.requestData.input_intro_slug == ''){
		slugValid = false;
		$('#group_intro_slug').addClass ('has-warning');
		$('#group_intro_slug_icon').addClass ('glyphicon-warning-sign');
		if (titleValid){
			$('#input_intro_slug').val($('#input_intro_title').val().replace(/[^a-z0-9]/gi, '_').toLowerCase());
			feedbackMessage += `<br />The slug "` + $('#input_intro_slug').val() + `"" was automatically created
			Please check it is suitable and re-save`
		}else{
			feedbackMessage += '<br />Please create a slug for this content item';
		}
	}else{
		$('#group_intro_slug').removeClass ('has-warning');
		$('#group_intro_slug_icon').removeClass ('glyphicon-warning-sign');
		$('#group_intro_slug').addClass ('has-success');
		$('#group_intro_slug_icon').addClass ('glyphicon-ok');
	}
	if (titleValid && slugValid){
		hideAlertMessge();
		return true;
	}else{
		alertMessge('warning', feedbackMessage);
		if (!titleValid){
			$('#input_intro_title').focus();
		}
		if (!slugValid && titleValid){
			$('#input_intro_slug').focus();
		}
		return false;
	}
}
