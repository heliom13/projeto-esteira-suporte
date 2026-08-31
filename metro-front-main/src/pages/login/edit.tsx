import onNotification from '../../components/notification/notification'
import { AuthService } from '../../services/auth'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, Space, Typography } from 'antd'
import { primaryText } from '../../styles/stylesProps'
import { buttonProps } from '../../components/button'
import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons'
import { useForm } from 'antd/lib/form/Form'
import { useState } from 'react'
const { Title, Paragraph } = Typography

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [form] = useForm()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const onFinish = (values: { mail: string }) => {
    setLoading(true)
    AuthService.forgotPassword(values.mail)
      .then(() => {
        setSent(true)
      })
      .catch(() => {
        onNotification('error', {
          message: 'Erro',
          description: 'Não foi possível enviar o e-mail. Tente novamente.',
        })
      })
      .finally(() => setLoading(false))
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
      {sent ? (
        <div style={{ maxWidth: 360, textAlign: 'center' }}>
          <Title level={3} {...primaryText}>
            📧 Verifique seu e-mail
          </Title>
          <Paragraph>
            Se esse e-mail estiver cadastrado, enviamos um link pra
            redefinir sua senha. O link é válido por 30 minutos.
          </Paragraph>
          <Button
            {...buttonProps}
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/login')}
          >
            Voltar para o login
          </Button>
        </div>
      ) : (
        <Form
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
          form={form}
        >
          <Title level={2} {...primaryText}>
            Esqueci a senha
          </Title>
          <Paragraph>
            Digite seu e-mail cadastrado e enviaremos um link pra você
            criar uma nova senha.
          </Paragraph>
          <Form.Item
            label="E-mail"
            name="mail"
            rules={[{ required: true }, { type: 'email' }]}
          >
            <Input />
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
              icon={<SendOutlined />}
              {...buttonProps}
              htmlType="submit"
              loading={loading}
            >
              Enviar link
            </Button>
          </Space>
        </Form>
      )}
    </div>
  )
}

export default ForgotPassword
