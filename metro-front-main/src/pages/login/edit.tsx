import onNotification from '../../components/notification/notification'
import { AuthService } from '../../services/auth'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import { primaryText } from '../../styles/stylesProps'
import { buttonProps, buttonRadius } from '../../components/button'
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons'
import { useForm } from 'antd/lib/form/Form'
const { Title } = Typography

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [form] = useForm()

  const onFinish = (values: any) => {
    const email = form.getFieldValue('mail')

    if (values.password === values.passwordConfirm) {
      AuthService.resetPassword(email, values)
        .then((response) => {
          onNotification('success', {
            message: 'Sucesso',
            description: 'Realize o login',
          })
          navigate('/login')
        })
        .catch((error) => {
          onNotification('error', {
            message: 'Erro',
            description: 'Erro ao mudar a senha',
          })
        })
    } else {
      onNotification('error', {
        message: 'Erro',
        description: 'As senhas não coincidem',
      })
    }
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
      <Form
        autoComplete="off"
        layout="vertical"
        onFinish={onFinish}
        form={form}
      >
        <Title level={2} {...primaryText}>
          Esqueci a senha
        </Title>
        <Form.Item
          label="E-mail"
          name="mail"
          rules={[{ required: true }, { type: 'email' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Digite a nova senha"
          name="password"
          rules={[{ required: true, message: 'Por favor, digite a senha!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirme a nova senha"
          name="passwordConfirm"
          rules={[{ required: true, message: 'Por favor, digite a senha!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Space>
          <Button
            {...buttonProps}
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/login')}
          >
            Voltar
          </Button>

          <Button
            type="primary"
            icon={<CheckOutlined />}
            {...buttonProps}
            htmlType="submit"
          >
            Salvar
          </Button>
        </Space>
      </Form>
    </div>
  )
}

export default ForgotPassword
