import {Button, Form, Input, Tabs, Typography} from 'antd'
import {Link, useNavigate} from 'react-router-dom'
import onNotification from '../../components/notification/notification'
import {useAuth} from '../../contexts/AuthContext'
import {apiLogin} from '../../services/api'
import {primaryText} from '../../styles/stylesProps'

const {Title, Text} = Typography

const LoginForm = ({redirectTo}: {redirectTo: string}) => {
    const navigate = useNavigate()
    const {authenticate} = useAuth()

    const onFinish = (values: any) => {
        apiLogin
            .post('/login', {
                email: values.mail,
                password: values.password,
            })
            .then((response) => {
                localStorage.setItem('token', response.data.token)
                onNotification('success', {message: 'Sucesso'})
                authenticate(response.data.token)
                navigate(redirectTo)
            })
            .catch(() => {
                onNotification('error', {
                    message: 'Erro',
                    description: 'E-mail ou senha incorretos. Tente novamente.',
                })
            })
    }

    return (
        <Form onFinish={onFinish} autoComplete="off" layout="vertical">
            <Form.Item
                label="E-mail"
                name="mail"
                rules={[{required: true}, {type: 'email'}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Senha"
                name="password"
                rules={[{required: true, message: 'Por favor, digite a senha!'}]}
            >
                <Input.Password/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Entrar
                </Button>
            </Form.Item>
            <Link to="/redefinir-senha">
                <Text>Esqueci a senha</Text>
            </Link>
        </Form>
    )
}

const Login = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#B3D3E2',
                width: '100%',
                height: '100%',
            }}
        >
            <div style={{background: '#fff', borderRadius: 8, padding: '32px 40px', minWidth: 360, boxShadow: '0 2px 16px rgba(0,0,0,0.10)'}}>
                <Title level={2} {...primaryText} style={{textAlign: 'center', marginBottom: 24}}>
                    Login
                </Title>
                <Tabs defaultActiveKey="usuario" centered>
                    <Tabs.TabPane tab="👤 Usuário" key="usuario">
                        <LoginForm redirectTo="/" />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="🔐 Administrador" key="administrador">
                        <div style={{
                            background: '#fff7e6',
                            border: '1px solid #ffd591',
                            borderRadius: 6,
                            padding: '8px 12px',
                            marginBottom: 16,
                            fontSize: 13,
                            color: '#874d00'
                        }}>
                            Acesso restrito. Somente administradores podem criar e gerenciar contas de usuários.
                        </div>
                        <LoginForm redirectTo="/usuarios" />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export default Login
