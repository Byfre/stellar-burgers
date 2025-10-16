import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';
import { Provider } from 'react-redux';
import store from './services/store';
import { BrowserRouter } from 'react-router-dom';

import { fetchIngredients } from './services/slices/ingredients';
import { getUser } from './services/slices/user';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

store.dispatch(getUser());
store.dispatch(fetchIngredients());

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
