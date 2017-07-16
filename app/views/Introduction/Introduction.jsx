import React from 'react';
import styles from './Introduction.css';
import { PropTypes } from 'react-router';
import localise from 'state/localisation.js';
import appState from 'state/app';
import ContentStream from 'streams/Content';
import EditButton from 'components/EditButton/EditButton';
import ProcessHeader from 'components/ProcessHeader/ProcessHeader';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import GlossaryDrop from 'components/GlossaryDrop/GlossaryDrop';

export default class Introduction extends React.Component {

	static propTypes = {
		route: React.PropTypes.object.isRequired
	}

	constructor(props) {
		super(props);
		this.stream = new ContentStream();
		this.state = {
			showEdit: null,
			contentSlug: null,
			notFound: null,
			base64: false,
			content: '',
			mounted: false
		};
		this.base64Content = '';
	}

	componentDidMount() {
		this.state.contentSlug = this.props.route.props.intro_slug;
		this.stream.subscribe (
			this.handleQueryResponse.bind(this)
		);
		this.stream.getContent (this.state.contentSlug);
		this.state.mounted = true;
	}

	componentWillReceiveProps(props) {
		this.state.contentSlug = props.route.props.intro_slug;
		this.stream.getContent(this.state.contentSlug);
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
		this.state.mounted = false;
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
			let html = decodeURIComponent(escape(atob(content)));
			return {
				__html: html
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
			<introduction-view class={ styles.Introduction }>
				{
					this.props.route.props.process &&
					<ProcessHeader/>
				}
				<intro>
					<content dangerouslySetInnerHTML={this.createMarkup(this.state.content)}>
					</content>
					{ this.state.showEdit ? <EditButton editUrl={ editURL }/> : null}
				</intro>
				<GlossaryDrop/>
			</introduction-view>
		)
	}
}
