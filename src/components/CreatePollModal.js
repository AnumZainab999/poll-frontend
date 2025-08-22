import { Modal, Form, Input, DatePicker, Space, Button, message } from 'antd';
import { useEffect } from 'react';
import api from '../api/axios';

export default function CreatePollModal({ open, onClose }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open]);

  const addOption = () => {
    const opts = form.getFieldValue('options') || ['',''];
    form.setFieldsValue({ options: [...opts, ''] });
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        question: values.question,
        options: (values.options || []).filter(Boolean),
        expiresAt: values.expiresAt?.toISOString?.() || null,
      };
      await api.post('/polls', payload);
      message.success('Poll created');
      onClose?.();
      window.location.reload();
    } catch (e) {
      message.error(e.response?.data?.message || e.message);
    }
  };

  return (
    <Modal open={open} title="Create a Poll" onCancel={onClose} onOk={() => form.submit()} okText="Create">
      <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ options: ['', ''] }}>
        <Form.Item name="question" label="Question" rules={[{ required: true, message: 'Enter a question' }]}>
          <Input placeholder="e.g., Who wins the final?" />
        </Form.Item>
        <Form.Item name="expiresAt" label="Expires At">
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <Space direction="vertical" style={{ width: '100%' }}>
              {fields.map((field, index) => (
                <Space key={field.key} align="baseline">
                  <Form.Item
                    {...field}
                    rules={[{ required: true, message: 'Option required' }]}
                  >
                    <Input placeholder={`Option ${index + 1}`} style={{ width: 300 }} />
                  </Form.Item>
                  {fields.length > 2 && (
                    <Button danger onClick={() => remove(field.name)}>Remove</Button>
                  )}
                </Space>
              ))}
              <Button onClick={() => add()}>Add Option</Button>
            </Space>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}