import {Button, Form, Input, Typography} from 'antd'
import {Link, useNavigate} from 'react-router-dom'
import onNotification from '../../components/notification/notification'
import {useAuth} from '../../contexts/AuthContext'
import {apiLogin} from '../../services/api'
import {primaryText} from '../../styles/stylesProps'

const {Title, Text} = Typography

const Login = () => {
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
                onNotification('success', {
                    message: 'Sucesso',
                })
                let token = response.data.token
                navigate('/')
                authenticate(token)

            })
            .catch((error) => {
                onNotification('error', {
                    message: 'Erro',
                    description:
                        'Erro ao fazer login, verifique seu e-mail ou senha e tente novamente',
                })
            })
    }

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
            <Form onFinish={onFinish} autoComplete="off" layout="vertical">
                <Title level={2} {...primaryText}>
                    Login
                </Title>
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
                    <Button type="primary" htmlType="submit">
                        Entrar
                    </Button>
                </Form.Item>
                <Link to="/redefinir-senha">
                    <Text> Esqueci a senha </Text>
                </Link>
            </Form>
        </div>
    )
}

export default Login
