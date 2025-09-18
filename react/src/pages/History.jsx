import React from 'react';
import { Card, Typography, List, Skeleton } from 'antd';

const { Title } = Typography;

function History() {
  const data = [
    { date: '2025-09-10', title: 'Пробежка 5 км' },
    { date: '2025-09-12', title: 'Интервальная тренировка' },
    { date: '2025-09-14', title: 'Длинный забег 12 км' },
  ];

  return (
    <>
      <Title level={3}>История тренировок</Title>
      <Card>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.title} description={item.date} />
            </List.Item>
          )}
        />
      </Card>
      <Card title="Загрузка старых записей" style={{ marginTop: 16 }}>
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
    </>
  );
}

export default History;
