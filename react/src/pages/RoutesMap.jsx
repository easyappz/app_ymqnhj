import React from 'react';
import { Card, Typography, Alert } from 'antd';
import { MapContainer, TileLayer } from 'react-leaflet';

const { Title, Paragraph } = Typography;

function RoutesMap() {
  const position = [55.751244, 37.618423];

  return (
    <>
      <Title level={3}>Карта маршрутов</Title>
      <Paragraph>Исследуйте маршруты и планируйте пробежки.</Paragraph>
      <Card>
        <div style={{ height: 360, borderRadius: 8, overflow: 'hidden' }}>
          <MapContainer center={position} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        </div>
        <Alert style={{ marginTop: 12 }} type="info" showIcon message="Подсказка" description="Добавьте маршруты и точки интереса в будущих обновлениях." />
      </Card>
    </>
  );
}

export default RoutesMap;
