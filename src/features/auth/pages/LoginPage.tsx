import { AppstoreOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input } from 'antd';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../../../shared/utils/errorMessage';

interface Credentials { username: string; password: string; }

export function LoginPage() {
  const { user, initializing, login } = useAuth();
  const [form] = Form.useForm<Credentials>();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  if (!initializing && user) return <Navigate to="/dashboard" replace />;

  const submit = async ({ username, password }: Credentials) => {
    setLoading(true); setErrorText('');
    try { await login(username, password); navigate('/dashboard', { replace: true }); }
    catch (error) { setErrorText(getErrorMessage(error)); }
    finally { setLoading(false); }
  };
  return <div className="jira-login-page">
    <div className="jira-login-topbrand"><span className="jira-login-logo"><AppstoreOutlined /></span><strong>tasklane</strong></div>
    <section className="jira-login-card">
      <h1>Log in to Tasklane</h1>
      <p>Manage issues, track progress, and keep your sprint on schedule.</p>
      {errorText && <Alert type="error" message={errorText} showIcon className="jira-login-error" />}
      <Form form={form} layout="vertical" onFinish={submit} requiredMark={false}>
        <Form.Item name="username" label="Username" rules={[{ required: true, whitespace: true, message: 'Enter your username' }]}><Input prefix={<UserOutlined />} placeholder="Username" autoComplete="username" size="large" /></Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Enter your password' }]}><Input.Password prefix={<LockOutlined />} placeholder="Password" autoComplete="current-password" size="large" /></Form.Item>
        <Button type="primary" htmlType="submit" loading={loading || initializing} block size="large" className="jira-login-submit">Log in</Button>
      </Form>
      <div className="jira-login-demo"><span>Demo credentials</span><code>emilys / emilyspass</code><button type="button" onClick={() => { form.setFieldsValue({ username: 'emilys', password: 'emilyspass' }); setErrorText(''); }}>Use demo account</button></div>
    </section>
    <footer className="jira-login-footer">Tasklane · Jira-inspired project dashboard · DummyJSON Authentication</footer>
  </div>;
}
