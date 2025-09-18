import React, { useMemo } from 'react';
import { Card, Typography, Row, Col, Statistic, Tabs, Form, Input, Button, Space, Avatar, Divider, message } from 'antd';
import { Line } from '@ant-design/plots';
import { UserOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { useLogin, useRegister, useMe } from '../hooks/useAuth';

const { Title, Paragraph, Text } = Typography;

function Home() {
  const { data: me } = useMe();
  const login = useLogin();
  const register = useRegister();

  const chartData = [
    { day: 'Пн', km: 3 },
    { day: 'Вт', km: 4 },
    { day: 'Ср', km: 5 },
    { day: 'Чт', km: 2 },
    { day: 'Пт', km: 6 },
    { day: 'Сб', km: 8 },
    { day: 'Вс', km: 0 },
  ];

  const config = useMemo(() => ({
    data: chartData,
    xField: 'day',
    yField: 'km',
    smooth: true,
    autoFit: true,
    height: 220,
    point: { size: 4 },
    color: '#1677ff',
  }), []);

  const onLoginFinish = (values) => {
    login.mutate(values, {
      onError: (err) => {
        const m = err?.response?.data?.error?.message || 'Ошибка входа';
        message.error(m);
      },
    });
  };

  const onRegisterFinish = (values) => {
    register.mutate(values, {
      onError: (err) => {
        const m = err?.response?.data?.error?.message || 'Ошибка регистрации';
        message.error(m);
      },
    });
  };

  const isAuth = !!me;

  return (
    <>
      <Title level={3}>Добро пожаловать</Title>
      <Paragraph>Это каркас приложения трекера бега. Используйте меню слева для навигации.</Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Пробег за неделю" value={28} suffix="км" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Активные дни" value={5} suffix="/ 7" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Лучший темп" value="4:50" suffix="мин/км" />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Динамика пробега">
            <Line {...config} />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={isAuth ? 'Ваш профиль' : 'Вход / Регистрация'}>
            {isAuth ? (
              <Space align="center" size="large">
                <Avatar size={72} icon={<UserOutlined />} />
                <div>
                  <Title level={4} style={{ margin: 0 }}>{me?.name || 'Без имени'}</Title>
                  <Text type="secondary">{me?.email}</Text>
                </div>
              </Space>
            ) : (
              <Tabs
                items={[
                  {
                    key: 'login',
                    label: 'Вход',
                    children: (
                      <Form layout="vertical" onFinish={onLoginFinish} disabled={login.isPending}>
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }]}>
                          <Input placeholder="user@example.com" />
                        </Form.Item>
                        <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }]}>
                          <Input.Password placeholder="Пароль" />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" icon={<LoginOutlined />} loading={login.isPending}>
                          Войти
                        </Button>
                      </Form>
                    ),
                  },
                  {
                    key: 'register',
                    label: 'Регистрация',
                    children: (
                      <Form layout="vertical" onFinish={onRegisterFinish} disabled={register.isPending}>
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }]}>
                          <Input placeholder="user@example.com" />
                        </Form.Item>
                        <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }, { min: 6, message: 'Минимум 6 символов' }]}>
                          <Input.Password placeholder="Пароль" />
                        </Form.Item>
                        <Divider style={{ margin: '12px 0' }} />
                        <Form.Item name="name" label="Имя">
                          <Input placeholder="Ваше имя" />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" icon={<UserAddOutlined />} loading={register.isPending}>
                          Зарегистрироваться
                        </Button>
                      </Form>
                    ),
                  },
                ]}
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Home;
