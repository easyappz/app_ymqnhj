import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Col, Input, List, Modal, Popconfirm, Row, Space, Tag, Typography, message } from 'antd';
import { MapContainer, Polyline, TileLayer, useMapEvents } from 'react-leaflet';
import { totalDistanceKm } from '../utils/distance';
import { useCreateRoute, useDeleteRoute, useRoutesList, useUpdateRoute } from '../hooks/useRoutes';

const { Title, Text } = Typography;

function ClickCapture({ onClickPoint }) {
  useMapEvents({
    click(e) {
      onClickPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function RoutesMap() {
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const { data } = useRoutesList({ page, limit });
  const createRoute = useCreateRoute();
  const updateRoute = useUpdateRoute();
  const deleteRoute = useDeleteRoute();

  const routes = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

  const [points, setPoints] = useState([]);
  const [name, setName] = useState('Новый маршрут');
  const [renameItem, setRenameItem] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const distance = useMemo(() => totalDistanceKm(points), [points]);

  const addPoint = (p) => setPoints((prev) => [...prev, p]);
  const clearPoints = () => setPoints([]);

  const onSave = async () => {
    if (!name || points.length < 2) {
      message.warning('Укажите название и добавьте минимум 2 точки');
      return;
    }
    try {
      await createRoute.mutateAsync({ name, description: '', points, totalDistanceKm: distance });
      message.success('Маршрут сохранён');
      clearPoints();
      setName('Новый маршрут');
    } catch (e) {
      const m = e?.response?.data?.error?.message || 'Не удалось сохранить маршрут';
      message.error(m);
    }
  };

  const onSelectRoute = (r) => {
    const pts = Array.isArray(r.points) ? r.points.map((p) => ({ lat: p.lat, lng: p.lng })) : [];
    setPoints(pts);
    setName(r.name || 'Маршрут');
  };

  const onStartRename = (r) => {
    setRenameItem(r);
    setRenameValue(r.name || '');
  };

  const onConfirmRename = async () => {
    if (!renameItem) return;
    try {
      await updateRoute.mutateAsync({ id: renameItem.id || renameItem._id, payload: { name: renameValue } });
      message.success('Название обновлено');
      setRenameItem(null);
      setRenameValue('');
    } catch (e) {
      const m = e?.response?.data?.error?.message || 'Не удалось переименовать маршрут';
      message.error(m);
    }
  };

  const onDeleteRoute = async (r) => {
    try {
      await deleteRoute.mutateAsync(r.id || r._id);
      message.success('Маршрут удалён');
    } catch (e) {
      const m = e?.response?.data?.error?.message || 'Не удалось удалить маршрут';
      message.error(m);
    }
  };

  const center = useMemo(() => {
    if (points.length > 0) return [points[0].lat, points[0].lng];
    return [55.751244, 37.618423];
  }, [points]);

  const mapRef = useRef(null);

  return (
    <>
      <Title level={3}>Карта маршрутов</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Маршруты">
            <List
              dataSource={routes}
              rowKey={(r) => r.id || r._id}
              renderItem={(r) => (
                <List.Item
                  actions={[
                    <Button size="small" onClick={() => onSelectRoute(r)}>Выбрать</Button>,
                    <Button size="small" onClick={() => onStartRename(r)}>Переименовать</Button>,
                    <Popconfirm title="Удалить маршрут?" okText="Да" cancelText="Нет" onConfirm={() => onDeleteRoute(r)}>
                      <Button size="small" danger loading={deleteRoute.isPending}>Удалить</Button>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    title={r.name || 'Без названия'}
                    description={
                      <Space>
                        <Tag>{(r.totalDistanceKm || 0).toFixed ? (r.totalDistanceKm || 0).toFixed(2) : r.totalDistanceKm} км</Tag>
                        <Text type="secondary">{Array.isArray(r.points) ? r.points.length : 0} точек</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card
            title={
              <Space wrap>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название маршрута" style={{ width: 260 }} />
                <Tag color="blue">{distance.toFixed(3)} км</Tag>
                <Button onClick={clearPoints}>Очистить</Button>
                <Button type="primary" onClick={onSave} loading={createRoute.isPending}>Сохранить маршрут</Button>
              </Space>
            }
          >
            <div style={{ height: 420, borderRadius: 8, overflow: 'hidden' }}>
              <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }} whenCreated={(map) => { mapRef.current = map; }}>
                <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ClickCapture onClickPoint={addPoint} />
                {points && points.length > 1 && (
                  <Polyline positions={points.map((p) => [p.lat, p.lng])} color="#1677ff" />
                )}
              </MapContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Переименовать маршрут"
        open={!!renameItem}
        onOk={onConfirmRename}
        onCancel={() => setRenameItem(null)}
        okText="Сохранить"
        cancelText="Отмена"
        confirmLoading={updateRoute.isPending}
      >
        <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} placeholder="Название" />
      </Modal>
    </>
  );
}

export default RoutesMap;
