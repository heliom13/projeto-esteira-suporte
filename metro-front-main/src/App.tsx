import React from 'react'
import { ConfigProvider } from 'antd'
import AppRoutes from './routes'
import GlobalStyle from './styles/global'
import ptBR from 'antd/lib/locale/pt_BR'
import './App.less'
import { AuthProvider } from './contexts/AuthContext'
import { WorkspaceProvider } from './contexts/WorkspaceContext'

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <ConfigProvider locale={ptBR}>
          <GlobalStyle />
          <AppRoutes />
        </ConfigProvider>
      </WorkspaceProvider>
    </AuthProvider>
  )
}

export default App
