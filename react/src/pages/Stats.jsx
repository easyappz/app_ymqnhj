import React, { useMemo, useState } from 'react';
import { Card, Col, DatePicker, InputNumber, Row, Segmented, Space, Statistic, Typography } from 'antd';
import { Column, Line } from '@ant-design/plots';
import dayjs from 'dayjs';
import { useStatsMonthly, useStatsSummary, useStatsWeekly } from '../hooks/useStats';

const { Title } = Typography;
const { RangePicker } = DatePicker;

function labelFromPeriod(item, type) {
  if (type === 'week') {
    return `${item.year}-W${item.week}`;
  }
  return `${item.year}-${String(item.month).padStart(2, '0')}`;
}

function Stats() {
  const [mode, setMode] = useState('week'); // week | month | custom
  const [n, setN] = useState(12);
  const [range, setRange] = useState([]);

  const summaryParams = useMemo(() => {
    if (mode === 'custom' && range && range.length === 2 && range[0] && range[1]) {
      return { from: range[0].startOf('day').toISOString(), to: range[1].endOf('day').toISOString() };
    }
    return {};
  }, [mode, range]);

  const weeklyParams = useMemo(() => {
    const p = { n };
    if (mode === 'custom' && range && range.length === 2 && range[0] && range[1]) {
      p.from = range[0].startOf('day').toISOString();
      p.to = range[1].endOf('day').toISOString();
    }
    return p;
  }, [mode, n, range]);

  const monthlyParams = weeklyParams;

  const { data: summary } = useStatsSummary(summaryParams);
  const { data: weekly } = useStatsWeekly(mode === 'week' || mode === 'custom' ? weeklyParams : { n: 0 });
  const { data: monthly } = useStatsMonthly(mode === 'month' ? monthlyParams : { n: 0 });

  const series = mode === 'month' ? monthly || [] : weekly || [];
  const labeled = (series || []).map((it) => ({
    label: labelFromPeriod(it, mode === 'month' ? 'month' : 'week'),
    km: it.totalDistanceKm || 0,
    runs: it.totalRuns || 0,
    pace: it.avgPace || 0,
  }));

  const distanceConfig = {
    data: labeled,
    xField: 'label',
    yField: 'km',
    color: '#1677ff',
    columnWidthRatio: 0.5,
    height: 260,
  };

  const runsConfig = {
    data: labeled,
    xField: 'label',
    yField: 'runs',
    color: '#52c41a',
    columnWidthRatio: 0.5,
    height: 260,
  };

  const paceConfig = {
    data: labeled,
    xField: 'label',
    yField: 'pace',
    color: '#fa8c16',
    height: 260,
    smooth: true,
    point: { size: 3 },
  };

  return (
    <>
      <Title level={3}>Статистика бега</Title>
      <Card style={{ marginBottom: 12 }}>
        <Space wrap size="middle" align="center">
          <Segmented
            value={mode}
            onChange={(v) => setMode(v)}
            options={[{ label: 'Неделя', value: 'week' }, { label: 'Месяц', value: 'month' }, { label: 'Период', value: 'custom' }]}
          />
          {mode !== 'custom' && (
            <Space>
              <span>Последние</span>
              <InputNumber min={1} max={mode === 'week' ? 52 : 36} value={n} onChange={(val) => setN(val || 1)} />
              <span>{mode === 'week' ? 'недель' : 'месяцев'}</span>
            </Space>
          )}
          {mode === 'custom' && (
            <RangePicker value={range} onChange={setRange} allowClear />
          )}
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Суммарный километраж" value={(summary?.totalDistanceKm || 0).toFixed(2)} suffix="км" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Количество тренировок" value={summary?.totalRuns || 0} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Средний темп" value={summary?.avgPace ? summary.avgPace.toFixed(2) : 0} suffix="мин/км" />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Километраж по периодам">
            <Column {...distanceConfig} />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Количество тренировок по периодам">
            <Column {...runsConfig} />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Средний темп по периодам">
            <Line {...paceConfig} />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Stats;
