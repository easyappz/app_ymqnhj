import React, { useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, List, Modal, Popconfirm, Row, Select, Space, Tag, Typography, message, Progress } from 'antd';
import dayjs from 'dayjs';
import { useCreateGoal, useDeleteGoal, useGoalsList, useUpdateGoal } from '../hooks/useGoals';

const { Title, Text } = Typography;

function calcStatus(goal) {
  const target = Number(goal.targetValue || 0);
  const progress = Number(goal.progressValue || 0);
  const now = new Date();
  const end = goal.endDate ? new Date(goal.endDate) : null;
  if (progress >= target && target > 0) return 'completed';
  if (end && now > end && progress < target) return 'failed';
  return 'active';
}

function statusTag(status) {
  if (status === 'completed') return <Tag color="green">Выполнена</Tag>;
  if (status === 'failed') return <Tag color="red">Провалена</Tag>;
  return <Tag color="blue">Активна</Tag>;
}

function Goals() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState();

  const { data, isLoading } = useGoalsList({ page, limit, status: statusFilter });
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  const total = typeof data?.total === 'number' ? data.total : items.length;

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ period: 'month', targetType: 'distance', startDate: dayjs().startOf('day'), endDate: dayjs().add(1, 'month').endOf('day') });
    setIsModalOpen(true);
  };

  const openEdit = (g) => {
    setEditing(g);
    form.setFieldsValue({
      title: g.title,
      targetType: g.targetType,
      targetValue: g.targetValue,
      progressValue: g.progressValue || 0,
      period: g.period,
      startDate: g.startDate ? dayjs(g.startDate) : null,
      endDate: g.endDate ? dayjs(g.endDate) : null,
    });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        title: values.title,
        targetType: values.targetType,
        targetValue: Number(values.targetValue || 0),
        period: values.period,
        startDate: values.startDate ? values.startDate.toISOString() : undefined,
        endDate: values.endDate ? values.endDate.toISOString() : undefined,
        progressValue: values.progressValue != null ? Number(values.progressValue) : 0,
      };
      if (editing) {
        await updateGoal.mutateAsync({ id: editing.id || editing._id, payload });
        message.success('Цель обновлена');
      } else {
        await createGoal.mutateAsync(payload);
        message.success('Цель создана');
      }
      setIsModalOpen(false);
    } catch (e) {
      if (e?.errorFields) return;
      const m = e?.response?.data?.error?.message || 'Ошибка сохранения цели';
      message.error(m);
    }
  };

  const onDelete = async (g) => {
    try {
      await deleteGoal.mutateAsync(g.id || g._id);
      message.success('Цель удалена');
    } catch (e) {
      const m = e?.response?.data?.error?.message || 'Не удалось удалить цель';
      message.error(m);
    }
  };

  return (
    <>
      <Title level={3}>Цели и достижения</Title>
      <Space wrap style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={openCreate}>Создать цель</Button>
        <Select
          allowClear
          placeholder="Фильтр по статусу"
          style={{ width: 220 }}
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'active', label: 'Активна' },
            { value: 'completed', label: 'Выполнена' },
            { value: 'failed', label: 'Провалена' },
          ]}
        />
      </Space>

      <List
        loading={isLoading}
        dataSource={items}
        rowKey={(g) => g.id || g._id}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          onChange: (p, ps) => {
            setPage(p);
            setLimit(ps);
          },
        }}
        renderItem={(g) => {
          const status = calcStatus(g);
          const target = Number(g.targetValue || 0);
          const progress = Number(g.progressValue || 0);
          const percent = target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
          return (
            <List.Item
              actions={[
                <Button size="small" onClick={() => openEdit(g)}>Изменить</Button>,
                <Popconfirm title="Удалить цель?" okText="Да" cancelText="Нет" onConfirm={() => onDelete(g)}>
                  <Button size="small" danger>Удалить</Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <strong>{g.title}</strong>
                    {statusTag(status)}
                  </Space>
                }
                description={
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <Text type="secondary">Тип: {g.targetType} • Период: {g.period}</Text>
                    <Text type="secondary">Дата: {g.startDate ? dayjs(g.startDate).format('DD.MM.YYYY') : '—'} — {g.endDate ? dayjs(g.endDate).format('DD.MM.YYYY') : '—'}</Text>
                    <Progress percent={percent} status={status === 'failed' ? 'exception' : status === 'completed' ? 'success' : 'active'} />
                  </Space>
                }
              />
            </List.Item>
          );
        }}
      />

      <Modal
        title={editing ? 'Редактирование цели' : 'Новая цель'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Сохранить"
        cancelText="Отмена"
        destroyOnClose
        confirmLoading={createGoal.isPending || updateGoal.isPending}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Введите название' }]}>
            <Input placeholder="Например, 100 км за месяц" />
          </Form.Item>
          <Form.Item name="targetType" label="Тип цели" rules={[{ required: true, message: 'Выберите тип' }]}>
            <Select options={[
              { value: 'distance', label: 'Дистанция (км)' },
              { value: 'duration', label: 'Длительность (мин)' },
              { value: 'pace', label: 'Темп (мин/км)' },
              { value: 'frequency', label: 'Частота (раз)' },
            ]} />
          </Form.Item>
          <Form.Item name="targetValue" label="Целевое значение" rules={[{ required: true, message: 'Введите значение' }]}>
            <InputNumber min={0} step={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="progressValue" label="Текущий прогресс">
            <InputNumber min={0} step={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="period" label="Период" rules={[{ required: true, message: 'Выберите период' }]}>
            <Select options={[
              { value: 'week', label: 'Неделя' },
              { value: 'month', label: 'Месяц' },
              { value: 'custom', label: 'Произвольный' },
            ]} />
          </Form.Item>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item name="startDate" label="Начало" rules={[{ required: true, message: 'Укажите дату' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="Окончание" rules={[{ required: true, message: 'Укажите дату' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default Goals;
