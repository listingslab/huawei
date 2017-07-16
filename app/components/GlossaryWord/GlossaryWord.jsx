import React from 'react';
import styles from './GlossaryWord.css';

export default class GlossaryWord extends React.Component {
	static propTypes = {
		word: React.PropTypes.object.isRequired
	}

	createMarkup(content) {
		return {
			__html: decodeURIComponent(escape(atob(content)))
		};
	}

	render() {
		return (
			<div>
			<glossary-entry class={ styles.GlossaryWord }>
				<glossary-word>{ this.props.word.title }</glossary-word>
				<glossary-definition dangerouslySetInnerHTML={ this.createMarkup(this.props.word.definition_en) }></glossary-definition>
			</glossary-entry>
			</div>
		);
	}
}
