
import appState from './app';
import ContentStream from 'streams/Content';

export default (slug) => {
	// returns any content identified by 'slug' from the content.json DB
	//var api = 'http://localhost:3000';
	//var endpoint = api + '/content/' + appState.locale + '/' + slug;
	// didmount
	let data = new ContentStream ();
	let subscription = data.subscribe(success, fail);

	function success (res){
		console.log(res);
	}

	function fail (){
		//subscription.dispose ();
	}
	data.getContent(slug);
	// let data.subscribe ();
	// data.dispose (
	// );
	//return endpoint;
};