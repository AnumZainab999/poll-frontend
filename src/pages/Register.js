import { Card, Form, Input, Button, message } from 'antd';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await register({ username: values.username, email: values.email, password: values.password });
      message.success('Account created!');
      navigate('/');
    } catch (e) {
      message.error(e.response?.data?.message || e.message);
    }
  };

  return (
    <Card className="card-hover" style={{ maxWidth: 480, margin: '48px auto' }} title="Create account">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="username" label="Username" rules={[{ required: true }]}>
          <Input placeholder="Anum" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="anum@example.com" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, min: 8 }]}>
          <Input.Password placeholder="At least 8 characters" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Sign up</Button>
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </Form>
    </Card>
  );
}