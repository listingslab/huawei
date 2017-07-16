
// Make an async API call and call the callback
function api(endpoint, method, callback, payload) {
    $.ajax({
        url : endpoint,
        type: method,
        data: payload,
        success: function(data, textStatus, jqXHR){
            callback (data);
        },
        error: function (jqXHR, textStatus, errorThrown){
            alertMessge('danger', errorThrown);
        }
    });
}

// Configure the Alloy Editor's settings
function alloyConfig() {
    cms.alloyConfig = {
        forcePasteAsPlainText: true,
        toolbars: {
            add: {
                buttons: ['image'],
                tabIndex: 2
            },
            styles: {
                selections: [
                    {
                        name: 'link',
                        buttons: ['linkEdit'],
                        test: AlloyEditor.SelectionTest.link
                    },{
                        name: 'text',
                        buttons: ['h1', 'bold','ol', 'ul', 'link', 'removeFormat'],
                        test: AlloyEditor.SelectionTest.text
                    },{
                        name: 'image',
                        buttons: ['imageLeft', 'imageCenter', 'imageRight', 'linkEdit'],
                        test: AlloyEditor.SelectionTest.image
                    }
                ]
            }
        }
    };
}

// Sort the list of results by time
function SortByTime(b, a) {
    var aName, bName;
    if (a.meta.updated == undefined){
        aName = a.meta.created
    }else{
        aName = a.meta.updated
    }
    if (b.meta.updated == undefined){
        bName = b.meta.created
    }else{
        bName = b.meta.updated
    }
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

// Publish the app
function publish() {
    window.location.assign('publish');
}

// display alert message
function setupButtons() {
    $('#publish').click(function() {
        $('#publish-confirm').modal();

        $('#cancel_publish').click(function() {
            $('#publish-confirm').modal('hide');
            return false;
        });
        $('#do_publish').click(function() {
            publish();
            return false;
        });
        return false;
    });
}

// Sets the title of the screen
function setScreenTitle(title) {
    $('#screen-title').html ('<h2>' + title + '</h2>');
}

// Hides any alert message
function hideAlertMessge() {
    $('#alert-message').hide();
}

// Fades any alert message
function fadeAlertMessge() {
    $('#alert-message').fadeOut();
}

// Capitalize First Letter of a string
function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Displays an alert message
function alertMessge(type, message) {
    $('#alert-message').html('');
    var alertMessage;
    switch (type) {
        case 'success':
        alertMessage =  `<div class="alert alert-info"><strong>Success!</strong> `
                        + message + `</div>`;
        break;

        case 'info':
        alertMessage = `<div class="alert alert-success><strong>Info!</strong> `
                        + message + `</div>`;
        break;

        case 'warning':
        alertMessage = `<div class="alert alert-warning"><strong>Warning!</strong> `
                        + message + `</div>`;
        break;

        case 'error':
        alertMessage = `<div class="alert alert-danger"><strong>Error!</strong> `
                        + message + `</div>`;
        break;
    }
    $('#alert-message').html(alertMessage);
    $('#alert-message').show();
}

// processURLParams
function processURLParams() {
    cms.urlParams = getURLParams();
    if (cms.urlParams.slug !== undefined && cms.urlParams.slug !== '') {
        cms.slug = cms.urlParams.slug;
    }
    if (cms.urlParams.type !== undefined && cms.urlParams.type !== '') {
        cms.type = cms.urlParams.type;
    }
    if (cms.urlParams.process !== undefined && cms.urlParams.process !== '') {
        cms.process = cms.urlParams.process;
    }
    if (cms.urlParams.search !== undefined && cms.urlParams.search !== '') {
        cms.search = cms.urlParams.search;
    }
    if (cms.urlParams.mode !== undefined && cms.urlParams.mode !== '') {
        cms.mode = cms.urlParams.mode;
    }

    if (cms.urlParams.alert !== undefined && cms.urlParams.alert !== '') {
        if (cms.urlParams.alert == 'save-success'){
            var message = '<br /><em>' + cms.slug + '</em> saved OK';
            alertMessge('success', message);
            setTimeout(fadeAlertMessge, 2500);
        }

        if (cms.urlParams.alert == 'publish-success'){
            var message = '<br />Published OK';
            alertMessge('success', message);
            setTimeout(fadeAlertMessge, 2500);
        }

        if (cms.urlParams.alert == 'delete-success'){
            var message = '<br />Deleted OK';
            alertMessge('success', message);
            setTimeout(fadeAlertMessge, 2500);
        }
    }

}

function setupScreen() {
    $('.screen').hide();
    if (cms.mode === undefined){
        $('#list-screen').show ();
        setupList();
    }else{
        switch (cms.type) {
            case 'introduction':
                setupIntroduction();
                break;

            case 'glossary':
                $('#glossary').show ();
                setupGlossary();
                break;

            case 'guide':
                $('#guide').show ();
                setupGuide();
                break;
        }
    }
    
}

// Read a page's GET URL variables and return them as an associative array.
function getURLParams() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// Use jQuery to set CSS at runtime
function setCSS(selector, css, value){
    try {
        $(selector).css (css,value);
    }catch (err){
        console.log('_css\n\n'+err);
    }
}

// Translate to and from Base64
String.prototype.b64encode = function() { 
    return btoa(unescape(encodeURIComponent(this))); 
};

String.prototype.b64decode = function() { 
    return decodeURIComponent(escape(atob(this))); 
};