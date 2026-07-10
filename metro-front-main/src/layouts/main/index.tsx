import {Badge, Button, Dropdown, Layout, Menu, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {Link, Outlet, useNavigate, useLocation} from 'react-router-dom';
import {SideMenu} from '../../components/menu';
import styled from 'styled-components';
import {Header} from "antd/lib/layout/layout";
import {BellOutlined} from '@ant-design/icons';
import api from "../../services/api";
import {useAuth} from '../../contexts/AuthContext';

const {Title} = Typography;
const {Sider, Content} = Layout;

export default function MainLayout({children}: any) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const {user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const headerLabel = location.pathname.includes('bancos-privados')
        ? 'Privados'
        : location.pathname.includes('criar-fluxo/caixa')
        ? 'Caixa'
        : null;

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        textAlign: 'left',
        color: '#fff',
        height: 64,
        paddingInline: 48,
        lineHeight: '64px',
        backgroundColor: '#4096ff',
        position: 'relative',
    };


    const StyledMenuItem = styled(Menu.Item)`
      font-size: 16px;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:hover {
        background-color: #003366 !important;
        color: #fff; // Altere a cor do texto para preto
      }
    `;

    useEffect(() => {
        // Função para buscar notificações
        const fetchNotifications = () => {
            api.get('/notifications')
                .then(response => {
                    const unreadNotifications = response.data.filter((notification: any) => !notification.read);
                    setUnreadCount(unreadNotifications.length);
                    setNotifications(response.data);
                })
                .catch(error => {
                    console.error('Error fetching notifications', error);
                });
        };

        // Chamar a função quando o componente for montado
        fetchNotifications();

        // Configurar um intervalo para chamar a função a cada 5 minutos
        const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000); // 5 minutos em milissegundos

        // Limpar o intervalo quando o componente for desmontado
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handleNotificationClick = (notification: any) => {
        api.put(`/notifications/${notification.id}/read`)
            .then(() => {
                api.get('/notifications')
                    .then(response => {
                        const unreadNotifications = response.data.filter((notification: any) => !notification.read);
                        setUnreadCount(unreadNotifications.length);
                        setNotifications(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching notifications', error);
                    });
                navigate(`/processos/mudar-etapa/${notification.processId}`);

            })
            .catch(error => {
                console.error('Error marking notification as read', error);
            });
    };

    const menu = (
        <Menu>
            {notifications.map((notification: any) => (
                <StyledMenuItem key={notification.id} onClick={() => handleNotificationClick(notification)}
                                style={{backgroundColor: notification.read ? '#f2f2f2' : '#ffe6e6'}}>
                    <div>
                        <strong>Descrição:</strong> {notification.description}
                        <div><strong>Passo Atual:</strong> {notification.currentStepName}</div>
                        <div style={{color: notification.deadlineStatus === 'Atrasado' ? 'red' : 'inherit'}}><strong>Status
                            do Prazo:</strong> {notification.deadlineStatus}</div>
                        <div><strong>Data de Criação:</strong> {new Date(notification.createdAt).toLocaleString()}</div>
                    </div>
                </StyledMenuItem>
            ))}
        </Menu>
    );

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Header style={headerStyle}>
                <div style={{textAlign: 'left', paddingTop: '20px'}}>
                    <Link to="/">
                        <Title level={4} style={{color: '#fff'}}>
                            Suporte Imobiliário
                        </Title>
                    </Link>
                </div>
                {headerLabel && (
                    <div style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>
                        <Title level={4} style={{color: '#fff', margin: 0}}>
                            {headerLabel}
                        </Title>
                    </div>
                )}
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: '10px', color: '#fff'}}>{user?.name}</span>
                    <Dropdown overlay={menu} placement="bottomRight">
                        <Badge count={unreadCount} style={{backgroundColor: '#ff4d4f'}} offset={[10, 0]}>
                            <Button icon={<BellOutlined/>} type="primary"
                                    style={{backgroundColor: '#4096ff', height: '100%', border: 'none'}}/>
                        </Badge>
                    </Dropdown>
                </div>
            </Header>
            <Layout>
                <Sider style={{background: '#fff'}} width={250}>
                    <SideMenu/>
                </Sider>
                <Content style={{margin: '0 16px'}}>
                    <div
                        style={{
                            padding: 24,
                            paddingTop: 20,
                            background: '#fff',
                            minHeight: 360,
                        }}
                    >
                        {children}
                        <Outlet/>
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}
