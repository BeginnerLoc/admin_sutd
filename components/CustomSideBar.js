import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PlusCircleOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Create from '@/pages/create';

const { Sider, Header, Content } = Layout;


function CustomSideBar({ children }) {

    const router = useRouter();

    const handleMenuClick = (e) => {
        router.push(e.key);
    };

    const menuItems = [
        {
            key: '/create',
            icon: <PlusCircleOutlined />,
            label: 'Create question',
        },
        {
            key: '/option1',
            icon: <VideoCameraOutlined />,
            label: 'Option 2',

        },
        {
            key: '/option2',
            icon: <PlusCircleOutlined />,
            label: 'Option 3',
        },
    ];

    const [collapsed, setCollapsed] = useState(false)

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsed={collapsed}>
                <div style={{
                    height: 32,
                    margin: 16,
                    background: '#E5E3E1',
                    borderRadius: 6,
                    textAlign: 'center',
                    color: 'blue'
                }}>SUTD</div>

                <Menu theme="dark" mode="inline" selectedKeys={[router.pathname]}
                    onClick={handleMenuClick}>
                    {menuItems.map((item) => (
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link href={item.key}>{item.label}</Link>
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: 'white' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: 'white',
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}

export default CustomSideBar;
