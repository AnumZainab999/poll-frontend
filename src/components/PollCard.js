import { Card, Tag, Space, Button } from 'antd';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function PollCard({ poll }) {
  const exp = poll.expires_at ? dayjs(poll.expires_at).fromNow() : 'No expiry';
  const options = poll.options || [];

  return (
    <Card className="card-hover" hoverable style={{ marginBottom: 16 }}>
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#fff', margin: 0 }}>{poll.question}</h3>
          <Tag color="purple">{exp}</Tag>
        </div>
        <Space wrap>
          {options.slice(0, 3).map((o) => (
            <Tag key={o.id}>{o.text}</Tag>
          ))}
          {options.length > 3 && <Tag>+{options.length - 3} more</Tag>}
        </Space>
        <div style={{ textAlign: 'right' }}>
          <Link to={`/poll/${poll.id}`}>
            <Button type="primary">Open</Button>
          </Link>
        </div>
      </Space>
    </Card>
  );
}
