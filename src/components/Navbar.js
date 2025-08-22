import { Layout, Menu, Button, Space, Dropdown, Typography } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Header } = Layout;
const { Text } = Typography;

export default function Navbar({ onCreate }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { key: '/', label: <Link to="/">Home</Link> },
  ];

  const menu = (
    <Menu
      items={[
        { key: 'create', label: <span onClick={onCreate}>Create Poll</span> },
        { type: 'divider' },
        { key: 'logout', label: <span onClick={logout}>Logout</span> },
      ]}
    />
  );

  return (
    <Header style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'transparent' }}>
      <Link to="/" style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>LivePolls</Link>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ flex: 1, minWidth: 120, background: 'transparent' }}
      />
      <Space>
        {user ? (
          <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
            <Button type="primary" shape="round">{user.username}</Button>
          </Dropdown>
        ) : (
          <>
            <Button shape="round" onClick={() => navigate('/login')}>Sign in</Button>
            <Button type="primary" shape="round" onClick={() => navigate('/register')}>Sign up</Button>
          </>
        )}
      </Space>
    </Header>
  );
}