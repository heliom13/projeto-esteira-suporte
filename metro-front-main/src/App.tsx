import React from 'react'
import { ConfigProvider } from 'antd'
import AppRoutes from './routes'
import GlobalStyle from './styles/global'
import ptBR from 'antd/lib/locale/pt_BR'
import './App.less'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <ConfigProvider locale={ptBR}>
        <GlobalStyle />
        <AppRoutes />
      </ConfigProvider>
    </AuthProvider>
  )
}

export default App
