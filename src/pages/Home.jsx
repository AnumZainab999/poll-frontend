import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Skeleton, Empty } from 'antd';
import PollCard from '../components/PollCard';

export default function Home() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/polls');
        setPolls(data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (!polls.length) return <Empty description="No active polls" />;

  return (
    <div className="hero">
      <h1 className="title">Active Polls</h1>
      <p className="subtitle">Vote and discuss in real-time ✨</p>
      <div style={{ marginTop: 16 }}>
        {polls.map((p) => (
          <PollCard key={p.id} poll={p} />
        ))}
      </div>
    </div>
  );
}