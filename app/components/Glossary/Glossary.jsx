import React from 'react';
import styles from './Glossary.css';
import GlossaryButton from 'components/GlossaryButton/GlossaryButton';
import GlossaryWord from 'components/GlossaryWord/GlossaryWord';
import GlossaryStream from 'streams/Glossary';

export default class Glossary extends React.Component {

	constructor(props) {
		super(props);
		let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		this.state = {
			words: [],
			wordNums: alphabet.map(
				letter =>
				({
					letter: letter,
					numWords: 0
				})
			)
		};
		this.stream = new GlossaryStream;
	}

	componentWillMount() {
		this.stream.subscribe(
			this.handleQueryResponse.bind(this)
		);
		this.stream.readWordNumbers();
	}

	componentDidMount() {
		this.setInitialQuery();
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
	}

	componentWillReceiveprops() {
		this.setInitialQuery();
	}

	setInitialQuery() {
		let initalQuery = this.getQuery();
		if (initalQuery !== null) {
			this.refs.input.value = initalQuery;
			this.stream.readWords(initalQuery);
		}else {
			this.stream.readWords('ALL');
		}
	}

	handleQueryResponse(res) {
		let state = {};
		if (res.body.type === 'readWordNumbers') {
			state.wordNums = res.body.data;
		}else if (res.body.type === 'readWords') {
			state.words = res.body.data;
		}
		this.setState(state);
	}

	clearInput() {
		this.refs.input.value = '';
	}

	handleInput(event) {
		let query = event.target.value;
		if (query !== '') {
			this.stream.readWords(query);
		} else {
			this.emptyGlossaryWords();
		}
	}

	glossaryButtonClick(button) {
		let query = button.props.children;
		if (query === 'ALL') {
			this.clearInput();
		} else {
			this.refs.input.value = query;
		}
		if (query !== '') {
			this.stream.readWords(query);
		} else {
			this.emptyGlossaryWords();
		}
	}

	emptyGlossaryWords() {
		this.state.words = [];
		this.forceUpdate();
	}

	checkEscape(event) {
		switch (event.keyCode) {
		case 27:
			this.clearInput();
			break;
		}
	}

	getQuery() {
		let url = window.location.href;
		let regex = new RegExp('#' + 'glossary' + '(=([^&#]*)|&|#|$)');
		let	results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	render() {
		return (
			<glossary-content class={ styles.Glossary }>
				<glossary-top>
					<glossary-filter>

							<input
								type="text"
								onChange={ this.handleInput.bind(this) }
								onKeyUp={ this.checkEscape.bind(this) }
								placeholder="Glossary filter"
								ref="input"
							/>

					</glossary-filter>

					<glossary-picker>

						<left>
							<GlossaryButton
								onClick={ this.glossaryButtonClick.bind(this) }
								mode="ALL"
								key="ALL"
							>
								ALL
							</GlossaryButton>
						</left>

						<right>
						{
							this.state.wordNums.map(
								(res, index) =>
								<GlossaryButton
									index={ `${index}-glossarybutton` }
									onClick={ this.glossaryButtonClick.bind(this) }
									mode={ res.numWords !== 0 ? 'ON' : 'OFF' }
									key={ res.letter }>
									{ res.letter }
								</GlossaryButton>
							)
						}
						</right>

					</glossary-picker>
				</glossary-top>

					<glossary-words>
						{
							this.state.words.map(
								word =>
								<GlossaryWord word={ word } key={ word.$loki } />
							)
						}
					</glossary-words>

			</glossary-content>
		);
	}
}
