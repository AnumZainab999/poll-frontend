import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Radio, Button, message, Row, Col, Typography, Statistic, Divider } from 'antd';
import api from '../api/axios';
import io from 'socket.io-client';
import CommentList from '../components/CommentList';
import CommentInput from '../components/CommentInput';

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title, Text } = Typography;

export default function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [choice, setChoice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState([]);
  const socketRef = useRef(null);

  const socketUrl = 'https://poll-backend-qxux29o0f-anums-projects-9ba48ad6.vercel.app';

  // ✅ Safe Local Time Formatter using dayjs
  const formatLocalTime = (dateString) => {
    try {
      return dayjs.utc(dateString)
        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone) // user ka local timezone
        .format("YYYY-MM-DD HH:mm");
    } catch {
      return dateString;
    }
  };

  // Fetch poll, options, comments
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/polls/${id}`);
        setPoll(data.data);

        // options directly from poll
        if (data.data.options) {
          setOptions(
            data.data.options.map((o) => ({
              id: o.id,
              text: o.text,
              votes: Number(o.votes || 0),
            }))
          );
        }

        // latest votes
        const ops = await fetchVotes(id);
        if (ops.length > 0) setOptions(ops);

        // initial comments
        const cs = await fetchComments(id);
        setComments(cs);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  // ✅ Socket.io real-time updates
  useEffect(() => {
    const s = io(socketUrl, { transports: ['websocket'] });
    socketRef.current = s;

    s.emit('joinPollRoom', { pollId: id });

    s.on('pollUpdated', (payload) => {
      if (String(payload.pollId) !== String(id)) return;
      if (Array.isArray(payload.options)) {
        setOptions(
          payload.options.map((o) => ({
            id: o.id,
            text: o.text,
            votes: Number(o.votes),
          }))
        );
      }
    });

    s.on('newComment', ({ pollId, comment }) => {
      if (String(pollId) !== String(id)) return;
      const mapped = {
        id: comment.id,
        text: comment.text,
        userId: comment.user_id,
        username: comment.user?.username || 'Anonymous',
        createdAt: formatLocalTime(comment.created_at), // ✅ dayjs time
      };
      setComments((prev) => {
        if (prev.some((c) => c.id === mapped.id)) return prev;
        return [mapped, ...prev];
      });
    });

    return () => {
      s.emit('leavePollRoom', { pollId: id });
      s.disconnect();
    };
  }, [id, socketUrl]);

  const totalVotes = useMemo(
    () => options.reduce((a, b) => a + Number(b.votes || 0), 0),
    [options]
  );

  // ✅ Fetch votes
  const fetchVotes = async (pollId) => {
    const { data } = await api.get(`/polls/${pollId}/stats`);
    const ops = data.data || [];
    return ops.map((o) => ({
      id: o.id,
      text: o.text,
      votes: Number(o.votes || 0),
    }));
  };

  // ✅ Fetch comments
  const fetchComments = async (pollId) => {
    const { data } = await api.get(`/comments/${pollId}`);
    const cs = data.data || [];
    return cs.map((c) => ({
      id: c.id,
      text: c.text,
      userId: c.user_id,
      username: c.user?.username || 'Anonymous',
      createdAt: formatLocalTime(c.created_at), // ✅ dayjs time
    }));
  };

  // ✅ Submit vote
  const submitVote = async () => {
    if (!choice) return message.info('Choose an option');
    setSubmitting(true);
    try {
      const { data } = await api.post(`/polls/${id}/vote`, { optionId: choice });

      let ops = [];
      if (Array.isArray(data.data?.options) && data.data.options.length > 0) {
        ops = data.data.options.map((o) => ({
          id: o.id,
          text: o.text,
          votes: Number(o.votes),
        }));
      } else {
        ops = await fetchVotes(id);
      }

      if (ops.length > 0) setOptions(ops);

      message.success(data.message || 'Vote recorded');
    } catch (e) {
      message.error(e.response?.data?.message || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Send comment
  const sendComment = async (text) => {
    const tempId = Date.now(); // temporary ID
    const optimisticComment = {
      id: tempId,
      text,
      userId: "me",
      username: "You",
      createdAt: formatLocalTime(new Date().toISOString()),
    };

    setComments((prev) => [optimisticComment, ...prev]);

    try {
      await api.post(`/comments/${id}`, { text });
    } catch (e) {
      message.error(e.response?.data?.message || e.message);
      setComments((prev) => prev.filter((c) => c.id !== tempId));
    }
  };

  if (!poll) return null;

  return (
    <div className="hero">
      <Title level={2} style={{ color: '#fff' }}>
        {poll.question}
      </Title>
      <Text type="secondary">Created by {poll.User?.username}</Text>
      <Divider />

      <Row gutter={[16, 16]}>
        {/* Voting Section */}
        <Col xs={24} md={12}>
          <Card title="Vote" className="card-hover">
            <Radio.Group
              onChange={(e) => setChoice(e.target.value)}
              value={choice}
              style={{ width: '100%' }}
            >
              {options.map((o) => (
                <Card key={o.id} style={{ marginBottom: 8 }}>
                  <Radio value={o.id}>{o.text}</Radio>
                  <div style={{ float: 'right' }}>
                    <Statistic title="Votes" value={Number(o.votes || 0)} />
                  </div>
                </Card>
              ))}
            </Radio.Group>
            <Button
              type="primary"
              onClick={submitVote}
              loading={submitting}
              block
              style={{ marginTop: 12 }}
            >
              Submit Vote
            </Button>
            <div style={{ marginTop: 8, textAlign: 'right' }}>
              Total votes: {totalVotes}
            </div>
          </Card>
        </Col>

        {/* Comments Section */}
        <Col xs={24} md={12}>
          <Card title="Discussion" className="card-hover">
            <CommentInput onSubmit={sendComment} />
            <div style={{ marginTop: 12 }}>
              <CommentList comments={comments} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
