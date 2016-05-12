import React from 'react';
import styles from './DocumentUploader.css';
import LinkButton from 'components/LinkButton/LinkButton';
export default class DocumentUploader extends React.Component {
	render() {
		return (
			<document-uploader class={ styles.DocumentUploader }>
				<uploader-drop>
					<material-icon>cloud_upload</material-icon>
					<p>Drag and drop files</p>
					<LinkButton icon="file_upload">
						Select Files
					</LinkButton>
				</uploader-drop>
			</document-uploader>
		);
	}
}
