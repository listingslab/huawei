import React from 'react';
import { PropTypes } from 'react-router';
import styles from './Guide.css';
import appState from 'state/app';
import Locale from 'state/localisation.js';
import GuideStream from 'streams/Guide';
import EditButton from 'components/EditButton/EditButton';
import GuideLabel from 'components/GuideLabel/GuideLabel';
import GlossaryDrop from 'components/GlossaryDrop/GlossaryDrop';
export default class Guide extends React.Component {

	static propTypes = {
		guideSlug: React.PropTypes.string.isRequired
	}

	static contextTypes = {
		history: PropTypes.history
	}

	constructor(props) {
		super(props);
		this.state  = {
			contentExists: 'loading',
			showlink: false,
			currentTab: 'tab_hint',
			currentContent: null,
			hint: null,
			context: null,
			background: null
		};
		this.stream = new GuideStream();
	}

	componentWillMount() {
		this.stream.subscribe(
			this.handleQueryResponse.bind(this)
		);
		if (this.getQueryParam ('guide') != undefined){
			this.stream.getContent(this.getQueryParam ('guide'));
		}
	}

	componentWillReceiveProps(props) {
		if (this.getQueryParam ('guide') != undefined){
			this.stream.getContent (this.getQueryParam ('guide'));
		}
	}

	componentWillUnmount() {
		this.stream.unsubscribe();
	}

	handleClick(e) {

		if (this.state.currentTab !== e.target.id) {
			this.setState({
				currentTab: e.target.id
			});
		}
	}

	handleQueryResponse(res) {
		let content;
		if (res.body) {
			if (res.body.found) {
				let hint, context, background, showlink;
				if (appState.locale == 'en'){
					hint = res.body.doc.hint_en;
					context = res.body.doc.context_en;
					background = res.body.doc.background_en;
				}else{
					hint = res.body.doc.hint_zh;
					context = res.body.doc.context_zh;
					background = res.body.doc.background_zh;
				}
				if (res.body.doc.showlink === 'true'){
					showlink = true;
				}else{
					showlink = false;
				}
				this.setState({
					contentExists: true,
					showlink: showlink,
					currentTab: 'tab_hint',
					hint: hint,
					context: context,
					background: background
				});
			}else{
				this.setState({
					contentExists: false
				});
			}
		}
	}

	getQueryParam (param){
		let url = window.location.href;
	    var regex = new RegExp("#" + param + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	createBase64Markup(base64content) {
		if ( base64content!== undefined ){
			return {
				__html: decodeURIComponent(escape(atob(base64content)))
			};
		}
	}

	createMarkup(content) {
		return {
			__html: content
		};
	}

	render() {
		if (this.state.contentExists){
			let editURL = "http://localhost:2500/?type=guide&mode=edit&slug=" + this.getQueryParam ('guide');
			let tab_buttons = {};
			let base64Content;

			if (this.state.hint !== null && this.state.hint !== ''){
				if (this.state.currentTab == 'tab_hint'){
					base64Content = this.state.hint;
					tab_buttons.hint = <tab-btn id="tab_hint" onClick={this.handleClick.bind(this)} class={ styles.TabButtonSelected }>{Locale('guide_btn_hint')}</tab-btn>
				}else{
					tab_buttons.hint = <tab-btn id="tab_hint" onClick={this.handleClick.bind(this)} class={ styles.TabButtonOn }>{Locale('guide_btn_hint')}</tab-btn>
				}
			}else{
				tab_buttons.hint = <tab-btn class={ styles.TabButtonOff }>{Locale('guide_btn_hint')}</tab-btn>
			}

			if (this.state.context !== null && this.state.context !== ''){
				if (this.state.currentTab == 'tab_context'){
					base64Content = this.state.context;
					tab_buttons.context = <tab-btn id="tab_context" onClick={this.handleClick.bind(this)} class={ styles.TabButtonSelected }>{Locale('guide_btn_context')}</tab-btn>
				}else{
					tab_buttons.context = <tab-btn id="tab_context" onClick={this.handleClick.bind(this)} class={ styles.TabButtonOn }>{Locale('guide_btn_context')}</tab-btn>
				}

			}else{
				tab_buttons.context = <tab-btn class={ styles.TabButtonOff }>{Locale('guide_btn_context')}</tab-btn>
			}

			if (this.state.background !== null && this.state.background !== ''){
				if (this.state.currentTab == 'tab_background'){
					base64Content = this.state.background;
					tab_buttons.background = <tab-btn id="tab_background" onClick={this.handleClick.bind(this)} class={ styles.TabButtonSelected }>{Locale('guide_btn_background')}</tab-btn>
				}else{
					tab_buttons.background = <tab-btn id="tab_background" onClick={this.handleClick.bind(this)} class={ styles.TabButtonOn }>{Locale('guide_btn_background')}</tab-btn>
				}
			}else{
				tab_buttons.background = <tab-btn class={ styles.TabButtonOff }>{Locale('guide_btn_background')}</tab-btn>
			}
			return (
				<guide-content class={ styles.Guide }>
					<guide-buttons>
						{ tab_buttons.hint }
						{ tab_buttons.context }
						{ tab_buttons.background }
					</guide-buttons>
					<guide-text dangerouslySetInnerHTML={this.createBase64Markup(base64Content)}>
					</guide-text>
					{ this.state.showlink ? <EditButton editUrl={ editURL }/> : null }
					<GlossaryDrop position="right top"/>
				</guide-content>
			);
		}else if (!this.state.contentExists){
			let content = `No content for <strong>`
			+ this.getQueryParam ('guide') + `</strong>`
			+ ` <a target="_blank" href="http://localhost:2500/?type=guide&mode=new&slug=`
			+ this.getQueryParam ('guide') + `"><br />create it?</a>`;
			return (
				<guide-content class={ styles.Guide }>
					<guide-text dangerouslySetInnerHTML={this.createMarkup(content)}>
					</guide-text>
				</guide-content>
			);
		}else if (contentExists === 'loading'){
			return (
				null
			);
		}
	}
}