import React from 'react';
import { Card, Typography, Row, Col, Skeleton } from 'antd';
import { Column } from '@ant-design/plots';

const { Title } = Typography;

function Stats() {
  const weekly = [
    { week: 'Нед 1', km: 20 },
    { week: 'Нед 2', km: 32 },
    { week: 'Нед 3', km: 28 },
    { week: 'Нед 4', km: 35 },
  ];

  const config = {
    data: weekly,
    xField: 'week',
    yField: 'km',
    color: '#52c41a',
    columnWidthRatio: 0.5,
    autoFit: true,
    height: 260,
  };

  return (
    <>
      <Title level={3}>Статистика бега</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Еженедельный километраж">
            <Column {...config} />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Детальная статистика">
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Stats;
