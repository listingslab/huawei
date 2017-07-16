'use strict';

let atob = require('atob');
let btoa = require('btoa');

function route(app) {
	app
		.route('/content/:lang/:slug')

		.get(function* (next) {
			this.body = getContent(this.params.lang, this.params.slug);
			this.status = 200;
			yield next;
		});
}

function getContent(lang, slug) {
	let content =  require('../content');
	let collection = content.getCollection('content');
	let doc = collection.findOne({slug: slug});
	let ret = {
		slug: slug,
		lang: lang
	};
	if (doc !== null) {
		let retContent = Object.assign({}, doc);
		let terms = [];
		let glossDocs = collection.find({type: 'glossary'});
		for (let i = 0; i < glossDocs.length; i++){
			terms.push ({
				title: glossDocs[i].title,
				slug: glossDocs[i].slug
			});
		}
		
		let haystack = decodeURIComponent(escape(atob(retContent.en)));
		let processTerms = findTerms(terms, haystack);
		let processedHTML = processHTML(processTerms, haystack);
		retContent.en = btoa(unescape(encodeURIComponent(processedHTML)));
		
		ret.found = true;
		ret.doc = retContent;
	}else {
		ret.found = false;
	}
	return ret;
}

function processHTML(terms, html) {
	let newHTML = html;
	let indexOffset = 0;
	for (let i=0; i<terms.length; i++){
		let startHTML = newHTML.slice(0, terms[i].index + indexOffset);
		let newtag = '<glossary-popup slug="' + terms[i].slug + '">' + terms[i].title + '</glossary-popup>';
		let endHTML = newHTML.slice(terms[i].index + terms[i].title.length + indexOffset, newHTML.length);
		newHTML = startHTML + newtag + endHTML;
		indexOffset += newtag.length - terms[i].title.length;
	}
	return newHTML;
}

function getIndexes(term, haystack) {
	let regex = new RegExp('\\b(' + term + ')\\b', "ig");
	let arr;
	let results = [];
	while ((arr = regex.exec(haystack)) !== null){
		arr['input'] = null;
		results.push (arr);
	}
	return results;
}

function findTerms(terms, haystack){
	let indexList = [];
	for (let i=0; i < terms.length; i ++){
		let matches = getIndexes(terms[i].title, haystack);
		if (matches.length > 0){
			for (let j=0; j<matches.length; j++){
				if (indexList[matches[j].index] !== undefined){
					if (indexList[matches[j].index].title.length < terms[i].title.length){
						indexList[matches[j].index] = {
							index: matches[j].index,
							title: indexList[matches[j].index].title,
							slug: indexList[matches[j].index].slug
						}
					}
				}else{
					indexList[matches[j].index] = {
						index: matches[j].index,
						title: terms[i].title,
						slug: terms[i].slug
					}
				}
			}
		}
	}
	indexList.sort(function(a, b) {
	    return parseFloat(a.index) - parseFloat(b.index);
	});
	let readyToProcess = [];
	for (let k=0; k<indexList.length; k++){
		if (indexList[k] !== undefined){
			readyToProcess.push (indexList[k]);
		}
	}
	return readyToProcess;
}

module.exports = route;
