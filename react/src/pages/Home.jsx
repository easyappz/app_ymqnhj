import React from 'react';
import { Card, Typography, Row, Col, Statistic } from 'antd';
import { Line } from '@ant-design/plots';

const { Title, Paragraph } = Typography;

function Home() {
  const data = [
    { day: 'Пн', km: 3 },
    { day: 'Вт', km: 4 },
    { day: 'Ср', km: 5 },
    { day: 'Чт', km: 2 },
    { day: 'Пт', km: 6 },
    { day: 'Сб', km: 8 },
    { day: 'Вс', km: 0 },
  ];

  const config = {
    data,
    xField: 'day',
    yField: 'km',
    smooth: true,
    autoFit: true,
    height: 220,
    point: { size: 4 },
    color: '#1677ff',
  };

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
      </Row>
    </>
  );
}

export default Home;
