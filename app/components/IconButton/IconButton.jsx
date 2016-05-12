import React from 'react';
import styles from './IconButton.css';

export default class IconButton extends React.Component {
	static defaultProps = {
		onClick: ()=>{}
	}

	render() {
		return (
			<icon-button onClick={ this.props.onClick } class={ `${styles.IconButton} ${this.props.class}` }>
				<material-icon dangerouslySetInnerHTML={ { __html: this.props.children } }></material-icon>
			</icon-button>
		);
	}
}
