import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';
import 'leaflet/dist/leaflet.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme as antdTheme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import ErrorBoundary from './ErrorBoundary';

dayjs.locale('ru');

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={ruRU}
        theme={{
          algorithm: antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 8,
          },
        }}
      >
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();
