import { List, Avatar } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function CommentList({ comments }) {
    return (
        <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={
                            <Avatar src={item?.User?.avatarUrl}>
                                {item?.User?.username?.[0]}
                            </Avatar>
                        }
                        title={item?.User?.username}
                        description={`${item.text} · ${dayjs(item.createdAt).fromNow()}`}
                    />
                </List.Item>
            )}
        />
    );
}
