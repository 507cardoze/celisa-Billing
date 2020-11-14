import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { HashRouter } from 'react-router-dom';
import './index.scss';

ReactDOM.render(
	<HashRouter hashType={'noslash'}>
		<App />
	</HashRouter>,
	document.getElementById('root'),
);

serviceWorker.unregister();
