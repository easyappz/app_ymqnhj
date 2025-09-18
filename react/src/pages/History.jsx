import React, { useMemo, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Space, Table, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { useRunsList, useCreateRun, useUpdateRun, useDeleteRun } from '../hooks/useRuns';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function formatPaceMinPerKm(distanceKm, durationMin) {
  if (!distanceKm || distanceKm <= 0 || !durationMin || durationMin <= 0) return '—';
  const paceMin = durationMin / distanceKm;
  const min = Math.floor(paceMin);
  const sec = Math.round((paceMin - min) * 60);
  const ss = String(sec).padStart(2, '0');
  return `${min}:${ss}`;
}

function History() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [range, setRange] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const params = useMemo(() => {
    const p = { page, limit };
    if (range && range.length === 2 && range[0] && range[1]) {
      p.from = range[0].startOf('day').toISOString();
      p.to = range[1].endOf('day').toISOString();
    }
    return p;
  }, [page, limit, range]);

  const { data, isLoading } = useRunsList(params);
  const createRun = useCreateRun();
  const updateRun = useUpdateRun();
  const deleteRun = useDeleteRun();

  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  const total = typeof data?.total === 'number' ? data.total : items.length;

  const columns = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      render: (v) => (v ? dayjs(v).format('DD.MM.YYYY HH:mm') : '—'),
      sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
    },
    {
      title: 'Дистанция (км)',
      dataIndex: 'distanceKm',
      key: 'distanceKm',
      render: (v) => (v != null ? Number(v).toFixed(2) : '0.00'),
    },
    {
      title: 'Длительность (мин)',
      dataIndex: 'durationMin',
      key: 'durationMin',
      render: (v) => (v != null ? Number(v).toFixed(1) : '0.0'),
    },
    {
      title: 'Средний темп',
      key: 'pace',
      render: (_, r) => formatPaceMinPerKm(r.distanceKm, r.durationMin),
    },
    {
      title: 'Калории',
      dataIndex: 'calories',
      key: 'calories',
      render: (v) => (v != null ? Math.round(v) : 0),
    },
    {
      title: 'Заметки',
      dataIndex: 'notes',
      key: 'notes',
      render: (v) => (v ? <Text ellipsis style={{ maxWidth: 240, display: 'inline-block' }}>{v}</Text> : <Tag>нет</Tag>),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, r) => (
        <Space>
          <Button size="small" onClick={() => onEdit(r)}>Редактировать</Button>
          <Popconfirm title="Удалить тренировку?" okText="Да" cancelText="Нет" onConfirm={() => onDelete(r)}>
            <Button size="small" danger loading={deleteRun.isPending}>Удалить</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ date: dayjs() });
    setIsModalOpen(true);
  };

  const onEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      date: record.date ? dayjs(record.date) : null,
      distanceKm: record.distanceKm || 0,
      durationMin: record.durationMin || 0,
      calories: record.calories || 0,
      notes: record.notes || '',
    });
    setIsModalOpen(true);
  };

  const onDelete = async (record) => {
    try {
      await deleteRun.mutateAsync(record.id || record._id);
      message.success('Тренировка удалена');
    } catch (e) {
      const m = e?.response?.data?.error?.message || 'Не удалось удалить тренировку';
      message.error(m);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        date: values.date ? values.date.toISOString() : new Date().toISOString(),
        distanceKm: Number(values.distanceKm || 0),
        durationMin: Number(values.durationMin || 0),
        calories: values.calories != null ? Number(values.calories) : undefined,
        notes: values.notes || undefined,
      };
      if (editing) {
        await updateRun.mutateAsync({ id: editing.id || editing._id, payload });
        message.success('Тренировка обновлена');
      } else {
        await createRun.mutateAsync(payload);
        message.success('Тренировка создана');
      }
      setIsModalOpen(false);
    } catch (e) {
      if (e?.errorFields) return; // валидация формы
      const m = e?.response?.data?.error?.message || 'Ошибка сохранения';
      message.error(m);
    }
  };

  return (
    <>
      <Title level={3}>История тренировок</Title>
      <Space style={{ marginBottom: 12 }} wrap>
        <RangePicker value={range} onChange={setRange} allowClear />
        <Button type="primary" onClick={onCreate}>Создать запись</Button>
      </Space>
      <Table
        rowKey={(r) => r.id || r._id}
        loading={isLoading}
        dataSource={items}
        columns={columns}
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
      />

      <Modal
        title={editing ? 'Редактирование тренировки' : 'Новая тренировка'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={createRun.isPending || updateRun.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="date" label="Дата" rules={[{ required: true, message: 'Укажите дату' }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="distanceKm" label="Дистанция (км)" rules={[{ required: true, message: 'Укажите дистанцию' }]}>
            <InputNumber min={0} step={0.1} style={{ width: '100%' }} placeholder="Например, 5" />
          </Form.Item>
          <Form.Item name="durationMin" label="Длительность (мин)" rules={[{ required: true, message: 'Укажите длительность' }]}>
            <InputNumber min={0} step={1} style={{ width: '100%' }} placeholder="Например, 30" />
          </Form.Item>
          <Form.Item name="calories" label="Калории">
            <InputNumber min={0} step={1} style={{ width: '100%' }} placeholder="Например, 250" />
          </Form.Item>
          <Form.Item name="notes" label="Заметки">
            <Input.TextArea rows={3} placeholder="Как прошла тренировка?" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default History;
