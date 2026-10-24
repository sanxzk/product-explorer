import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { persistor, store } from './app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';

try {
  localStorage.removeItem('auth');
} catch (error) {
  console.warn('Could not remove legacy auth data from local storage.', error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
