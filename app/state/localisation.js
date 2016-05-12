import localeKeys from 'csv/localisation.csv';
import appState from './app';

let dictionary = {};
localeKeys.forEach(key => {
	dictionary[key.id] = { ...key };
});

let missingKeys = {};

window.app = window.app || {};
window.app.showMissingKeys = () => {
	console.log(
		Object
			.keys(missingKeys)
			.join('\n')
	);
};

export default (wordId) => {
	if ( !!dictionary[wordId] ) {
		return dictionary[wordId][appState.locale] || `*${wordId}*`;
	}
	missingKeys[`${wordId},,`] = null;
	return `*${wordId}*`;
};