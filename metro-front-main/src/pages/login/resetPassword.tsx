import onNotification from '../../components/notification/notification'
import { AuthService } from '../../services/auth'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form, Input, Space, Typography } from 'antd'
import { primaryText } from '../../styles/stylesProps'
import { buttonProps } from '../../components/button'
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons'
import { useForm } from 'antd/lib/form/Form'
import { useState } from 'react'
const { Title } = Typography

const ResetPassword = () => {
  const navigate = useNavigate()
  const { token } = useParams()
  const [form] = useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = (values: any) => {
    if (values.password !== values.passwordConfirm) {
      onNotification('error', {
        message: 'Erro',
        description: 'As senhas não coincidem',
      })
      return
    }

    if (!token) return

    setLoading(true)
    AuthService.resetPasswordWithToken(token, values.password)
      .then(() => {
        onNotification('success', {
          message: 'Sucesso',
          description: 'Senha redefinida. Realize o login.',
        })
        navigate('/login')
      })
      .catch(() => {
        onNotification('error', {
          message: 'Erro',
          description: 'Link inválido ou expirado. Solicite um novo.',
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
      <Form
        autoComplete="off"
        layout="vertical"
        onFinish={onFinish}
        form={form}
      >
        <Title level={2} {...primaryText}>
          Nova senha
        </Title>
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
            loading={loading}
          >
            Salvar
          </Button>
        </Space>
      </Form>
    </div>
  )
}

export default ResetPassword
