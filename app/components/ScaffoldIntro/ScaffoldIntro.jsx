import React from 'react';
import styles from './ScaffoldIntro.css';
import { PropTypes } from 'react-router';
import localise from 'state/localisation.js';
import appState from 'state/app';
import ContentStream from 'streams/Content';
import EditButton from 'components/EditButton/EditButton';
import GlossaryDrop from 'components/GlossaryDrop/GlossaryDrop';

export default class ScaffoldIntro extends React.Component {

	static propTypes = {
		introSlug: React.PropTypes.string.isRequired
	}

	constructor(props) {
		super(props);
		this.stream = new ContentStream();
		this.state = {
			contentSlug: this.props.introSlug,
			showEdit: null,
			base64: true,
			content: '',
			mounted: false
		};
	}

	componentDidMount() {
		this.stream.subscribe(
			this.handleQueryResponse.bind(this)
		);
		this.stream.getContent(this.state.contentSlug);
		this.state.mounted = true;
	}

	componentWillReceiveProps(props) {
		this.state.contentSlug = props.introSlug;
		this.stream.getContent(this.state.contentSlug);
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
	}

	handleQueryResponse(res) {
		let content;
		if (res.body.found) {
			if (res.body.doc.showlink === 'true'){
				this.state.showEdit = true;
			}else{
				this.state.showEdit = false;
			}
			this.state.base64 = true;
			if (appState.locale === 'en') {
				content = res.body.doc.en;
			}else {
				content = res.body.doc.zh;
			}
		}else {
			this.state.base64 = false;
			this.state.showEdit = false;
			content = `No content found for slug <strong>`
						+ this.state.contentSlug + `</strong>`
						+ ` <a target="_blank" href="http://localhost:2500/?type=introduction&mode=new&slug=`
						+ this.state.contentSlug + `">create it now?</a>`;
		}
		if (this.state.mounted) {
			this.setState({
				content: content
			});
		}

	}

	createMarkup(content) {
		if (this.state.base64) {
			return {
				__html: decodeURIComponent(escape(atob(content)))
			};
		}else{
			return {
				__html: this.state.content
			};
		}
	}

	render() {
		let editURL = "http://localhost:2500/?type=introduction&mode=edit&slug=" + this.state.contentSlug;
		return (
			<intro-scaffold class={ styles.IntroScaffold }>
				<introduction-content>
					<content
					className={ styles.ScaffoldIntro }
					dangerouslySetInnerHTML={ this.createMarkup(this.state.content) }
					>
					</content>
					{ this.state.showEdit ? <EditButton editUrl={ editURL }/> : null}
				</introduction-content>
				<GlossaryDrop  position="right top"/>
			</intro-scaffold>
		);
	}
}
