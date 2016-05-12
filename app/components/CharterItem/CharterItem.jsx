import React from 'react';
import styles from './CharterItem.css';
import ComponentHeader from 'components/ComponentHeader/ComponentHeader';
import TextScaleArea from 'components/TextScaleArea/TextScaleArea';

export default class CharterItem extends React.Component {

	static defaultProps = {
		onChange: ()=>{ console.log('no onChange handler'); }
	}

	render() {
		return (
			<charter-item class={ styles.CharterItem }>
				<ComponentHeader
					class="blue"
					title={ this.props.heading }
					index={ this.props.index }
					actions={ this.props.actions }
				/>
				<item-input >
					<TextScaleArea
						onChange={ this.props.onChange }
						placeholder={ this.props.placeholder }
					>
						{ this.props.children }
					</TextScaleArea>
				</item-input>
			</charter-item>
		);
	}
}
