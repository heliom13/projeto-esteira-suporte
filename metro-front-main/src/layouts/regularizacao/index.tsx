import {Button, Typography} from 'antd';
import React from 'react';
import {Link, Outlet, useNavigate} from 'react-router-dom';
import {Header} from 'antd/lib/layout/layout';
import {Layout} from 'antd';
import {LogoutOutlined, SwapOutlined} from '@ant-design/icons';
import {useAuth} from '../../contexts/AuthContext';
import {useWorkspace} from '../../contexts/WorkspaceContext';
import {RegularizacaoMenu} from '../../components/menu/regularizacaoMenu';

const {Title} = Typography;
const {Sider, Content} = Layout;

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'left',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#52c41a',
};

export default function RegularizacaoLayout() {
    const {user, logout} = useAuth();
    const {setWorkspace} = useWorkspace();
    const navigate = useNavigate();

    const handleSwitchWorkspace = () => {
        setWorkspace(null);
        navigate("/escolha");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setWorkspace(null);
        logout();
        navigate("/login");
    };

    return (
        <Layout style={{height: '100vh', overflow: 'hidden'}}>
            <Header style={headerStyle}>
                <div style={{textAlign: 'left', paddingTop: '20px'}}>
                    <Link to="/regularizacao">
                        <Title level={4} style={{color: '#fff'}}>
                            📋 Regularização
                        </Title>
                    </Link>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: '10px', color: '#fff'}}>{user?.name}</span>
                    <Button
                        icon={<SwapOutlined/>}
                        type="primary"
                        onClick={handleSwitchWorkspace}
                        style={{backgroundColor: '#52c41a', border: '1px solid rgba(255,255,255,0.5)', marginRight: 8}}
                    >
                        🔄 Trocar de área
                    </Button>
                    <Button
                        icon={<LogoutOutlined/>}
                        type="primary"
                        onClick={handleLogout}
                        style={{backgroundColor: '#52c41a', border: '1px solid rgba(255,255,255,0.5)'}}
                    >
                        🚪 Sair
                    </Button>
                </div>
            </Header>
            <Layout style={{height: 'calc(100vh - 64px)'}}>
                <Sider style={{background: '#fff', overflowY: 'auto', overflowX: 'hidden', height: '100%'}} width={220}>
                    <RegularizacaoMenu/>
                </Sider>
                <Content style={{margin: '0 16px', overflowY: 'auto', overflowX: 'auto', height: '100%'}}>
                    <div
                        style={{
                            padding: 24,
                            paddingTop: 20,
                            background: '#fff',
                            minHeight: 360,
                        }}
                    >
                        <Outlet/>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
