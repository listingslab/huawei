function setupGlossary() {
	if (cms.mode == 'new'){
		setScreenTitle('New Glossary');
		initGlossaryEditors();
	}else{
		setScreenTitle('Edit Glossary');
		api ('/api/'+cms.slug, 'GET', apiCallbackGlossaryLoad);
	}

	$('.save').click(function() {
        saveGlossary ();
        return false;
    });

    $('.save_close').click(function() {
   		cms.closeafter = true;
        saveGlossary ();
        return false;
    });
}


function initGlossaryEditors(){
	cms.alloyEditor_definition_en = AlloyEditor.editable('glossary_editor_en', cms.alloyConfig);
	cms.alloyEditor_definition_zh = AlloyEditor.editable('glossary_editor_zh', cms.alloyConfig);
	$('#glossary-screen').show();
}

function apiCallbackGlossaryLoad(res){
	initGlossaryEditors();
	cms.doc = res.doc[0];
	$('#input_glossary_title_en').val(cms.doc.title);
	$('#input_glossary_title_zh').val(cms.doc.title_zh.b64decode());
	$('#input_glossary_slug').val(cms.doc.slug);
	cms.alloyEditor_definition_en.get('nativeEditor').setData(cms.doc.definition_en.b64decode());
	cms.alloyEditor_definition_zh.get('nativeEditor').setData(cms.doc.definition_zh.b64decode());
	if (cms.doc.showlink === 'false'){
		cms.doc.showlink = false;
	}else{
		cms.doc.showlink = true;
	}
	$('#input_guide_showlink').prop('checked', cms.doc.showlink);
}

function apiCallbackGlossarySave(res){
	if (res.status === 'fail'){
		if (res.errorCode === '001'){
			var message = 'API Error. Slugs must be unique. "' + res.slug + '" already exists in the database';
			$('#group_glossary_slug').removeClass ('has-success');
			$('#group_glossary_slug_icon').removeClass ('glyphicon-ok');
			$('#input_glossary_slug').val('');
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

function saveGlossary() {
	if (validateGlossary()) {
		var payload = {
			title: $('#input_glossary_title_en').val(),
			title_zh: $('#input_glossary_title_zh').val().b64encode(),
			slug: $('#input_glossary_slug').val().replace(/[^a-z0-9]/gi, '_').toLowerCase(),
			oldSlug: cms.slug,
			type: 'glossary',
			definition_en: cms.alloyEditor_definition_en.get('nativeEditor').getData().b64encode(),
			definition_zh: cms.alloyEditor_definition_zh.get('nativeEditor').getData().b64encode(),
			showlink: $('#input_glossary_showlink').prop("checked"),
		}
		if (cms.mode == 'new'){
			api ('/api/', 'POST', apiCallbackGlossarySave, payload);
		}else if (cms.mode == 'edit'){
			api ('/api/' + cms.slug, 'PUT', apiCallbackGlossarySave, payload);
		}
	}
}

function validateGlossary() {
	var feedbackMessage = '';
	var titleValid = true;
	var slugValid = true;
	if ($('#input_glossary_title_en').val() == ''){
		titleValid = false;
		feedbackMessage += '<br />Please create a title for this content item';
		$('#group_glossary_title_en').addClass ('has-warning');
		$('#group_glossary_title_en_icon').addClass ('glyphicon-warning-sign');
	}else{
		$('#group_glossary_title_en').removeClass ('has-warning');
		$('#group_glossary_title_en_icon').removeClass ('glyphicon-warning-sign');
		$('#group_glossary_title_en').addClass ('has-success');
		$('#group_glossary_title_en_icon').addClass ('glyphicon-ok');
	}
	if ($('#input_glossary_slug').val() == ''){
		slugValid = false;
		$('#group_glossary_slug').addClass ('has-warning');
		$('#group_glossary_slug_icon').addClass ('glyphicon-warning-sign');
		if (titleValid){
			$('#input_glossary_slug').val('glossary_' + $('#input_glossary_title_en').val().replace(/[^a-z0-9]/gi, '_').toLowerCase());
			feedbackMessage += `<br />The slug "` + $('#input_glossary_slug').val() + `"" was automatically created
			Please check it is suitable and re-save`
		}else{
			feedbackMessage += '<br />Please create a slug for this content item';
		}
	}else{
		$('#group_glossary_slug').removeClass ('has-warning');
		$('#group_glossary_slug_icon').removeClass ('glyphicon-warning-sign');
		$('#group_glossary_slug').addClass ('has-success');
		$('#group_glossary_slug_icon').addClass ('glyphicon-ok');
	}
	if (titleValid && slugValid){
		hideAlertMessge();
		return true;
	}else{
		alertMessge('warning', feedbackMessage);
		if (!titleValid){
			$('#input_glossary_title_en').focus();
		}
		if (!slugValid && titleValid){
			$('#input_glossary_slug').focus();
		}
		return false;
	}
}
