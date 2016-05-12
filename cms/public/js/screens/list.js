function setupList() {
	$('#top-save').hide();
	if (cms.type === undefined || cms.type === 'all'){
		cms.listTitle = 'All Items';
		if (cms.process !== undefined){
			cms.listTitle = capitaliseFirstLetter(cms.process) + ' Items';
		}
	}else{
		cms.listTitle = capitaliseFirstLetter(cms.type) + ' Items';
	}

	if (cms.search !== undefined){
		cms.listTitle = 'Find "' + cms.search + '"';
	}

	apiCallList(cms.type);
}

function apiCallList(filterType, filterProcess) {
	$('#list-table').html('');
	api ('/api/', 'GET', apiCallbackList);
}

function apiDelete(slug) {
	api ('/api/'+slug, 'DELETE', apiCallbackDelete);
}

function apiCallbackDelete(res){
	var assignUrl = '/?&alert=delete-success';
	window.location.assign(assignUrl);
}

function apiCallbackList(res){
	var docs = res.docs;
	docs.sort(SortByTime);
	var filterType = false;
	var filterProcess = false;
	var filterSearch = false;
	if (cms.type !== undefined){
		filterType = cms.type; 
	}
	if (cms.process !== undefined){
		filterProcess = cms.process; 
	}
	if (cms.search !== undefined){
		filterSearch = cms.search; 
	}
	if (docs.length > 0){
		var numItems = 0;
		var tableHTML = '<table class="table table-striped">';
		tableHTML += `
		<thead>
	      <tr>
	        <th>Title</th>
	        <th>Slug</th>
	        <th>Process</th>
	        <th>Type</th>
			<th>Updated</th>
	        <th width="100"></th>
	      </tr>
	    </thead>
	    <tbody>`;
		for (var i=0; i < docs.length; i++){
			var showThisDoc = true;
			if (filterType !== false){
				if (docs[i].type !== filterType){
					showThisDoc = false;
				}
			}
			if (filterProcess !== false){
				if (docs[i].process !== filterProcess){
					showThisDoc = false;
				}
			}

			if (filterSearch !== false){
				showThisDoc = false;
				if(docs[i].title.toLowerCase().search(filterSearch.toLowerCase()) != -1) {
					showThisDoc = true;
				}
			}

			if (showThisDoc){
				numItems ++;
				var title = docs[i].title;
				var type = docs[i].type;
				var slug = docs[i].slug;
				var preview = docs[i].preview;
				var updated;
				var process = '';
				if (docs[i].process != undefined){
					process = docs[i].process;
				}
				if (docs[i].meta.updated == undefined){
					updated = moment(docs[i].meta.created).fromNow();
				}else{
					updated = moment(docs[i].meta.updated).fromNow();
				}
				
				tableHTML += `
						      <tr>
						      	<td><a href="?type=`+ type +`&mode=edit&slug=`+ slug +`">` + title + `</a></td>
						        <td>` + slug + `</td>
						        <td><a href="?process=`+ process + `">` + process + `</a></td>
						        <td><a href="?type=`+ type + `">` + type + `</a></td>
						        <td>` + updated + `</td>
						      	<td>

				<a href="` + preview + `" target="_blank" class="btn btn-default" title="Preview '` + title + `'">
				    <span class="glyphicon glyphicon-share"></span>
				</a>

				<a href="#" id="` + slug + `" class="delete btn btn-default" title="Delete '` + title + `'">
				    <span class="glyphicon glyphicon-trash"></span>
				</a>
						      	</td>
						        
						      </tr>
						    `;
			}
		}
		tableHTML += '</tbody></table>';
		if (numItems > 0){
			$('#list-table').html(tableHTML);
		}else{
			$('#list-table').html('Sorry, no items found');
		}
		

		setScreenTitle( cms.listTitle + ' (' + numItems + ')');

		$('.delete').click(function(but) {
	        alertMessge('warning', `<p>Are you sure you want to delete this? This cannot be undone.</p>
	            <p>
	            <a href="#" id="cancel_delete" class="btn btn-warning">Cancel</a>
	            <a href="#" id="do_delete" id="` + slug + `" class="btn btn-danger">Delete</a>
	            </p>
	            `);
	        $('#cancel_delete').click(function() {
	            fadeAlertMessge();
	            return false;
	        });
	        $('#do_delete').click(function() {
	        	apiDelete(but.currentTarget.id)
	            return false;
	        });
	        return false;
	    });
    }
}
