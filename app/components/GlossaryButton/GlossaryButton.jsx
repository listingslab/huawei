import React from 'react';
import styles from './GlossaryButton.css';

export default class GlossaryButton extends React.Component {

  	handleClick (){
  		this.props.onClick(this);
  	}

	render() {
		let buttonText = this.props.children;
		let style, click;
		switch (this.props.mode) {
			case 'ALL':
				style = styles.GlossaryButtonAll;
				click = this.handleClick.bind(this);
				break;
			case 'ON':
				style = styles.GlossaryButtonOn;
				click = this.handleClick.bind(this);
				break;
			case 'OFF':
				style = styles.GlossaryButtonOff;
				click = null;
				break;
		}
		return (
			<glossary-button
				class={ style } 
				onClick={ click }>
					{ buttonText }
			</glossary-button>
		);
	}
}
