import { Layout, FloatButton, message } from 'antd';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PollDetail from './pages/PollDetail';
import { useAuth } from './hooks/useAuth';
import { PlusOutlined } from '@ant-design/icons';
import CreatePollModal from './components/CreatePollModal';
import { useState } from 'react';

const { Content, Footer } = Layout;

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [openCreate, setOpenCreate] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar onCreate={() => (user ? setOpenCreate(true) : navigate('/login'))} />
      <Content>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/poll/:id" element={<PollDetail />} />
          </Routes>
        </div>
      </Content>
      <Footer className="footer-note">Built with ❤️ using React + AntD + Socket.IO</Footer>

      <FloatButton
        icon={<PlusOutlined />}
        tooltip={user ? 'Create Poll' : 'Login to create poll'}
        onClick={() => (user ? setOpenCreate(true) : message.info('Login first'))}
      />

      <CreatePollModal open={openCreate} onClose={() => setOpenCreate(false)} />
    </Layout>
  );
}