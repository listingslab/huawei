import React from 'react';
import ReactDom from 'react-dom';
import styles from './DropDown.css';
import DropCss from 'tether-drop/dist/css/drop-theme-arrows-bounce.css';
import Drop from 'tether-drop';
export default class DropDown extends React.Component {

	/**
	*  Attach a dropbox to an item that opens on click
	*  requires two React nodes, one as the target to render
	*  (pass as a child), and one to display in the dropdown itself (content)
	*/

	static propTypes = {
		children: React.PropTypes.node.isRequired,
		content: React.PropTypes.node.isRequired,
		position: React.PropTypes.string,
		beforeClose: React.PropTypes.func
	}

	constructor() {
		super();
		this.contentEl = document.createElement('div');
		this.close = this._close.bind(this);
		this.mountedContent = null;
	}

	componentDidMount() {
		this._attachDrop(this.refs.target);
	}

	componentWillUnmount() {
		ReactDom.unmountComponentAtNode(this.contentEl);
		this.mountedContent = null;
		this.drop.destroy();
	}

	componentWillReceiveProps() {
		ReactDom.render(this.props.content, this.contentEl);
	}

	renderContent() {
		this.mountedContent = ReactDom.render(this.props.content, this.contentEl);
	}

	_attachDrop(target) {
		this.renderContent();
		this.drop = new Drop({
			target: target,
			content: this.contentEl,
			position: this.props.position || 'bottom center',
			classes: 'drop-theme-arrows-bounce',
			remove: true,
			beforeClose: null || this.props.beforeClose
		});
		this.drop.on('open', this.handleDropOpen, this);
		this.drop.on('close', this.handleDropClose, this);
	}

	handleDropOpen() {
		this.renderContent();
		this.mountedContent.dropShow && this.mountedContent.dropShow();
	}

	handleDropClose() {

	}

	_close() {
		this.drop.close();
	}

	render() {
		return (
			<drop-down
				ref="drop" class={ styles.DropDown }
			>
				<drop-target ref="target">{ this.props.children }</drop-target>
			</drop-down>
		);
	}
}
