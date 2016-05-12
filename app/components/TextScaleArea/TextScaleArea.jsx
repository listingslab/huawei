import React from 'react';
import styles from './TextScaleArea.css';

export default class TextScaleArea extends React.Component {

	static propTypes = {
		onChange: React.PropTypes.func.isRequired,
		placeholder: React.PropTypes.string,
		value: React.PropTypes.node,
		children: React.PropTypes.node
	}

	constructor() {
		super();
		this.state = {
			areaHeight: {
				flexBasis: 0
			},
			value: null
		};
	}

	componentDidMount() {
		let handler = this.handleInputSize.bind(this);
		this.removeEventListener = ()=>{
			window.removeEventListener('resize', handler);
		};
		window.addEventListener('resize', handler);

		this.handleInputSize();
		this.handleProps(this.props);
	}

	componentWillReceiveProps(props) {
		if (
				props.value !== this.props.value ||
				props.children !== this.props.children
			) {
			this.handleProps(props);
		}
		this.handleInputSize();
	}

	componentDidUpdate() {
		this.handleInputSize();
	}

	componentWillUnmount() {
		this.removeEventListener();
	}

	handleProps(props) {
		this.setState({ value: props.children  || props.value});
	}

	handleInput(event) {
		let value = event.target.value;
		this.setState({ value: value });
		if (typeof this.props.onChange === 'function') {
			this.props.onChange(value);
		}
	}

	handleInputSize() {
		let el = this.refs.textarea;
		el.style.height = 0 + 'px';
		el.style.height = el.scrollHeight + 'px';
	}

	render() {
		return (
			<text-scale-area class={ styles.TextScaleArea }>
				<textarea
					ref="textarea"
					onInput={ this.handleInputSize.bind(this) }
					onChange={ this.handleInput.bind(this) }
					placeholder={ this.props.placeholder }
					value={ this.state.value }
				/>
				<printable-text>{ this.state.value }</printable-text>
			</text-scale-area>
		);
	}

}
