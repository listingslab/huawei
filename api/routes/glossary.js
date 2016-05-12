'use strict';

function route(app) {
	app
		.route('/glossary/')

		.get(function* (next) {
			this.body = getNumWords();
			this.status = 200;
			yield next;
		})

		.nested(':fragment/')
		.get(function* (next) {
			this.body = getWords(this.params.fragment);
			this.status = 200;
			yield next;
		});
}

function getWords(frag) {
	let content =  require('../content');
	let collection = content.getCollection('content');
	let glossary = collection.find({type: 'glossary'});

	let fragment = decodeURI(frag);
	let ret = {
		type: 'readWords',
		query: fragment,
		numResults: 0,
		data: []
	};
	if (fragment.length === 1) {
		// if it's just one letter, return all with the same first letter
		console.log('Get Glossary items beginning with : ' + fragment);
		for (let j = 0; j < glossary.length; j++) {
			let firstLetter = glossary[j].title.charAt(0);
			if (firstLetter === fragment.toUpperCase()) {
				ret.data.push(glossary[j]);
				ret.numResults ++;
			}
		}
		ret.data.sort(function(a,b) {
		    if ( a.title < b.title )
		        return -1;
		    if ( a.title > b.title )
		        return 1;
		    return 0;
		} );
	}else {
		// if fragment.length > 1 search the word (& definition?) for the string
		console.log('Get Glossary items containing : ' + fragment);
		for (let j = 0; j < glossary.length; j++) {
			let haystack = glossary[j].title.toLowerCase();
			
			// Try uncommenting the next line to also search within definition
			// haystack += ' ' + glossary[j]['definition'].toLowerCase ();
			if (haystack.indexOf(fragment.toLowerCase()) !== -1) {
				
				ret.data.push(glossary[j]);
				ret.numResults ++;
			}
		}
		ret.data.sort(function(a,b) {
		    if ( a.title < b.title )
		        return -1;
		    if ( a.title > b.title )
		        return 1;
		    return 0;
		} );
	}
	if (fragment.toLowerCase() === 'all') {
		ret.data = glossary;
	}
	return ret;
}

function getNumWords() {
	/*	Returns an array of letters of the alphabet with the number of terms
		in the glossary for that letter */
	let content =  require('../content');
	let collection = content.getCollection('content');
	let glossary = collection.find({type: 'glossary'});
	let ret = {
		type: 'readWordNumbers'
	};
	let data = [];
	let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	for (let i = 0; i < alphabet.length; i++) {
		let numWords = 0;
		for (let j = 0; j < glossary.length; j++) {
			let firstLetter = glossary[j].title.charAt(0);
			if (firstLetter === alphabet[i]) {
				numWords ++;
			}
		}
		data.push({['letter']: alphabet[i], ['numWords']: numWords});
	}
	ret.data = data;
	return ret;
}

module.exports = route;
