import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App/App';
import store from './data/store';
import appConfig from './shared/appConfig';
import registerServiceWorker from './shared/registerServiceWorker';
import './index.css';

console.log('Starting new CatChat instance (' + appConfig.id + ')');

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
);

registerServiceWorker();
