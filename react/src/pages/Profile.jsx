import React from 'react';
import { Card, Typography, Descriptions, Button, Space, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

function Profile() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>Профиль</Title>
      <Card>
        <Space size="large" align="center" style={{ width: '100%' }}>
          <Avatar size={72} icon={<UserOutlined />} />
          <div>
            <Title level={4} style={{ margin: 0 }}>Гость</Title>
            <Paragraph type="secondary" style={{ margin: 0 }}>Неавторизованный пользователь</Paragraph>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Button type="primary">Редактировать</Button>
          </div>
        </Space>
      </Card>
      <Card title="Информация">
        <Descriptions column={{ xs: 1, md: 2 }}>
          <Descriptions.Item label="Имя">Гость</Descriptions.Item>
          <Descriptions.Item label="Город">—</Descriptions.Item>
          <Descriptions.Item label="Возраст">—</Descriptions.Item>
          <Descriptions.Item label="Цель">Поддерживать форму</Descriptions.Item>
        </Descriptions>
      </Card>
    </Space>
  );
}

export default Profile;
