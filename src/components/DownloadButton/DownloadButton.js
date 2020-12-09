import React from 'react';
import Chip from '@material-ui/core/Chip';

const DownloadButton = ({ base64, filename, label }) => {
	return (
		<a
			href={base64}
			download={filename}
			style={{ textDecoration: 'none', color: 'black' }}
			rel="noopener"
			referrerpolicy="no-referrer"
		>
			<Chip label={label} clickable />
		</a>
	);
};

export default DownloadButton;
