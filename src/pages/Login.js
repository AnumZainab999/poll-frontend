import { Card, Form, Input, Button, message } from 'antd';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await login(values.email, values.password);
      message.success('Welcome back!');
      navigate('/');
    } catch (e) {
      message.error(e.response?.data?.message || e.message);
    }
  };

  return (
    <Card className="card-hover" style={{ maxWidth: 420, margin: '48px auto' }} title="Sign in">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="you@example.com" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password placeholder="••••••••" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Sign in</Button>
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          New here? <Link to="/register">Create account</Link>
        </div>
      </Form>
    </Card>
  );
}