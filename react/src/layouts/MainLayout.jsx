import React, { useMemo, useState } from 'react';
import { Layout, Menu, Breadcrumb, Typography, Avatar, Space, theme } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
  TrophyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

const menuRoutes = [
  { key: '/', label: 'Главная', icon: <HomeOutlined /> },
  { key: '/profile', label: 'Профиль', icon: <UserOutlined /> },
  { key: '/stats', label: 'Статистика бега', icon: <DashboardOutlined /> },
  { key: '/routes', label: 'Карта маршрутов', icon: <EnvironmentOutlined /> },
  { key: '/history', label: 'История тренировок', icon: <HistoryOutlined /> },
  { key: '/goals', label: 'Цели и достижения', icon: <TrophyOutlined /> },
];

function MainLayout() {
  const { token } = theme.useToken();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const selectedKey = useMemo(() => {
    const found = menuRoutes.find((r) => location.pathname === r.key);
    if (found) return found.key;
    if (location.pathname.startsWith('/profile')) return '/profile';
    if (location.pathname.startsWith('/stats')) return '/stats';
    if (location.pathname.startsWith('/routes')) return '/routes';
    if (location.pathname.startsWith('/history')) return '/history';
    if (location.pathname.startsWith('/goals')) return '/goals';
    return '/';
  }, [location.pathname]);

  const items = menuRoutes.map((r) => ({
    key: r.key,
    icon: r.icon,
    label: <Link to={r.key}>{r.label}</Link>,
  }));

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length === 0) return [{ title: 'Главная' }];
    const mapped = [{ title: <Link to="/">Главная</Link> }];
    const map = new Map(menuRoutes.map((r) => [r.key, r.label]));
    let path = '';
    segments.forEach((seg) => {
      path += '/' + seg;
      const label = map.get(path) || seg;
      mapped.push({ title: label });
    });
    return mapped;
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} breakpoint="lg" width={240}>
        <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>
          {collapsed ? 'EA' : 'Easyappz'}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={items} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <Space size="middle">
              {collapsed ? (
                <MenuUnfoldOutlined onClick={() => setCollapsed(false)} />
              ) : (
                <MenuFoldOutlined onClick={() => setCollapsed(true)} />
              )}
              <Title level={4} style={{ margin: 0 }}>Трекер бега</Title>
            </Space>
            <Space size="small">
              <Avatar size="small" icon={<UserOutlined />} />
              <span style={{ fontWeight: 500 }}>Гость</span>
            </Space>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <Breadcrumb items={breadcrumbs} style={{ marginBottom: 16 }} />
          <div style={{ background: '#fff', padding: 16, borderRadius: 8, minHeight: 360, border: `1px solid ${token.colorBorderSecondary}` }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Easyappz • React + Ant Design • {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
