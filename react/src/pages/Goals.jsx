import React from 'react';
import { Card, Typography, Progress, Row, Col, Button } from 'antd';

const { Title, Paragraph } = Typography;

function Goals() {
  return (
    <>
      <Title level={3}>Цели и достижения</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Цель: 100 км в месяц" extra={<Button type="link">Изменить</Button>}>
            <Paragraph>Прогресс текущего месяца.</Paragraph>
            <Progress percent={65} status="active" />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Достижения">
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Первый 10 км</li>
              <li>Неделя без пропусков</li>
              <li>Лучшее время на 5 км</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Goals;
