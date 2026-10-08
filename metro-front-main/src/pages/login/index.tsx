import {useEffect, useState} from 'react'
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
    const [entrando, setEntrando] = useState(false)
    const [demorando, setDemorando] = useState(false)

    // Depois de alguns segundos esperando, avisa que o servidor esta respondendo
    // devagar, para a pessoa nao achar que travou e clicar de novo.
    useEffect(() => {
        if (!entrando) {
            setDemorando(false)
            return
        }
        const timer = setTimeout(() => setDemorando(true), 4000)
        return () => clearTimeout(timer)
    }, [entrando])

    const onFinish = (values: any) => {
        setEntrando(true)
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
            .catch((error) => {
                setEntrando(false)
                const status = error?.response?.status
                if (!status) {
                    onNotification('error', {
                        message: 'Servidor sem resposta',
                        description: 'Não foi possível falar com o servidor. Verifique sua internet e tente novamente.',
                    })
                } else if (status >= 500) {
                    onNotification('error', {
                        message: 'Erro no servidor',
                        description: 'O servidor teve um problema ao entrar. Tente novamente em instantes.',
                    })
                } else {
                    onNotification('error', {
                        message: 'Erro',
                        description: 'E-mail ou senha incorretos. Tente novamente.',
                    })
                }
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
                <Button type="primary" htmlType="submit" block loading={entrando}>
                    {entrando ? 'Entrando...' : 'Entrar'}
                </Button>
                {demorando ? (
                    <Text type="secondary" style={{display: 'block', marginTop: 8, fontSize: 12, textAlign: 'center'}}>
                        Conectando ao servidor, isso pode levar alguns segundos...
                    </Text>
                ) : null}
            </Form.Item>
            <Link to="/redefinir-senha">
                <Text>Esqueci a senha</Text>
            </Link>
        </Form>
    )
}

const Login = () => {
    // Acorda o servidor e o banco assim que a tela de login abre, enquanto a
    // pessoa ainda digita: quando ela clicar em "Entrar" a conexao ja esta pronta.
    // O resultado e ignorado (requisicao "no-cors": so precisa chegar ao servidor);
    // se falhar, o login segue normalmente.
    useEffect(() => {
        fetch(`${apiLogin.defaults.baseURL}actuator/health/db`, {mode: 'no-cors', cache: 'no-store'})
            .catch(() => undefined)
    }, [])

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
