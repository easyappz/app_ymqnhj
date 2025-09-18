import React, { useEffect } from 'react';
import { Card, Typography, Space, Avatar, Form, Input, InputNumber, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useMe } from '../hooks/useAuth';
import { useUpdateMe } from '../hooks/useUsers';

const { Title, Paragraph } = Typography;

function Profile() {
  const { data: me, isLoading } = useMe();
  const updateMe = useUpdateMe();
  const [form] = Form.useForm();

  useEffect(() => {
    if (me) {
      form.setFieldsValue({
        name: me.name || '',
        age: me.age != null ? me.age : null,
        weight: me.weight != null ? me.weight : null,
        height: me.height != null ? me.height : null,
      });
    }
  }, [me, form]);

  const onFinish = (values) => {
    updateMe.mutate(values, {
      onError: (err) => {
        const m = err?.response?.data?.error?.message || 'Ошибка обновления профиля';
        message.error(m);
      },
    });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>Профиль</Title>
      <Card>
        <Space size="large" align="center" style={{ width: '100%' }}>
          <Avatar size={72} icon={<UserOutlined />} />
          <div>
            <Title level={4} style={{ margin: 0 }}>{me?.name || 'Без имени'}</Title>
            <Paragraph type="secondary" style={{ margin: 0 }}>{me?.email || '—'}</Paragraph>
          </div>
        </Space>
      </Card>
      <Card title="Редактирование профиля">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={isLoading || updateMe.isPending}
        >
          <Form.Item name="name" label="Имя">
            <Input placeholder="Введите имя" />
          </Form.Item>
          <Form.Item name="age" label="Возраст">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Укажите возраст" />
          </Form.Item>
          <Form.Item name="weight" label="Вес (кг)">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Укажите вес" />
          </Form.Item>
          <Form.Item name="height" label="Рост (см)">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Укажите рост" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={updateMe.isPending}>Сохранить</Button>
        </Form>
      </Card>
    </Space>
  );
}

export default Profile;
