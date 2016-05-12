import React from 'react';
import styles from './GlossaryDrop.css';
import Drop from 'tether-drop';
import DropCss from 'tether-drop/dist/css/drop-theme-twipsy.css';
import GlossaryStream from 'streams/Glossary';
import appState from 'state/app';
export default class GlossaryDrop extends React.Component {
	static propTypes = {
		position: React.PropTypes.string
	}

	componentWillMount() {
		this.dictionary = null;
		this.dictionaryResolve = null;
		this.dictionaryReady = new Promise((resolve)=>{
			this.dictionaryResolve = resolve;
		});
		this.drops = [];
		this.glossaryStream = new GlossaryStream;
		this.glossaryStream.subscribe(
			this.handleGlossaryUpdate.bind(this)
		);
		this.glossaryStream.readWords('ALL');
	}

	componentDidUpdate() {
		this.destroyDrops();
		const parent = this.refs.root.parentNode;
		let elements = [].slice.call(parent.querySelectorAll('glossary-popup'));
		!!elements.length && this.createDrop(elements);
	}

	componentWillUnmount() {
		this.destroyDrops();
		this.glossaryStream.unsubscribe();
	}

	handleGlossaryUpdate(res) {
		this.dictionary = {};
		res.body.data.forEach(
			item => {
				this.dictionary[item.slug] = item;
			}
		);
		this.dictionaryResolve(this.dictionary);
	}

	createDrop(elements) {
		this.drops = elements.map(
			element =>
			new Drop({
				target: element,
				content: this.getGlossaryItem.bind(this),
				position: this.props.position || 'top center',
				openOn: 'hover',
				classes: 'drop-theme-twipsy',
				hoverOpenDelay: 500,
				tetherOptions: {
					constraints: [{
						to: 'window',
						attachment: 'together',
						pin: true
					}]
				}
			})
		);
	}

	destroyDrops() {
		this.drops.forEach( drop => drop.destroy() );
		this.drops = [];
	}

	getGlossaryItem(drop) {
		this.dictionaryReady
			.then((dic)=>{
				if ( !drop.target ) {
					return;
				}
				let slug = drop.target.getAttribute('slug');
				let item = dic[slug];
				drop.content.innerHTML = `
					<glossary-drop-content>
						<h4>${item.title}</h4>
						<section>
							${
								decodeURIComponent(
									escape(
										atob(
											item['definition_' + appState.locale]
										)
									)
								)
							}
						</section>
					</glossary-drop-content>
				`;
			});
		return '...';
	}

	render() {
		return <glossary-drop ref="root"/>;
	}
}
