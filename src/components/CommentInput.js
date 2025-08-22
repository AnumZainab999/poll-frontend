import { Button, Input, Space } from 'antd';
import { useState } from 'react';

export default function CommentInput({ onSubmit, loading }) {
  const [text, setText] = useState('');

  const handle = () => {
    const t = text.trim();
    if (!t) return;
    onSubmit?.(t);
    setText('');
  };

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        placeholder="Write a comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPressEnter={handle}
      />
      <Button type="primary" onClick={handle} loading={loading}>Send</Button>
    </Space.Compact>
  );
}