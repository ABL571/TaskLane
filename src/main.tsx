import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './app/App';
import { ErrorBoundary } from './app/components/ErrorBoundary';
import './styles.css';
import './jira.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={{
      token: {
        colorPrimary: '#0C66E4',
        borderRadius: 5,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
        colorText: '#172B4D',
        colorBgLayout: '#FFFFFF',
      },
    }}>
      <ErrorBoundary><App /></ErrorBoundary>
    </ConfigProvider>
  </React.StrictMode>
);
