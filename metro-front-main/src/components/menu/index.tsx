import React, { ReactNode } from 'react';
import { AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type MenuItem = {
    key: string;
    label: ReactNode;
    icon?: ReactNode;
    roles: string[];
    children?: MenuItem[];
};

export const SideMenu = () => {
    const navigate = useNavigate();
    const {hasAnyRole, logout} = useAuth();

    const menuItems: MenuItem[] = [
        {
            key: "0",
            label: <Link to={"esteira"}>⚡ Esteira de Processos</Link>,
            icon: <AppstoreOutlined />,
            roles: ["ADMIN", "ANALYST", "PROCESSOR", "SECRETARY"]
        },
        {
            key: "1",
            label: (
                <Link to={"cliente-comprador"}>👤 Cadastro de Cliente</Link>
            ),
            roles: ["ADMIN", "ANALYST", "SECRETARY"]
        },
        {
            key: "2",
            label: <Link to={"cliente-vendedor"}>🏠 Cadastro de Imóveis</Link>,
            roles: ["ADMIN", "ANALYST", "SECRETARY"]
        },
        {
            key: "3",
            label: <Link to={"imobiliaria"}>🏢 Imobiliária/Corretor</Link>,
            roles: ["ADMIN", "ANALYST", "SECRETARY"]
        },
        {
            key: "4",
            label: <Link to={"propostas"}>📄 Propostas</Link>,
            roles: ["ADMIN", "ANALYST"]
        },
        {
            key: "5",
            label: <Link to={"processos"}>🔁 Processos</Link>,
            roles: ["ADMIN", "ANALYST", "PROCESSOR"]
        },
        {
            key: "criar-fluxo",
            label: "🗂️ Fluxo",
            roles: ["ADMIN", "ANALYST"],
            children: [
                {
                    key: "criar-fluxo-privados",
                    label: <Link to={"criar-fluxo/bancos-privados"}>🏦 Bancos Privados</Link>,
                    roles: ["ADMIN", "ANALYST"],
                },
                {
                    key: "criar-fluxo-caixa",
                    label: <Link to={"criar-fluxo/caixa"}>🏛️ Caixa</Link>,
                    roles: ["ADMIN", "ANALYST"],
                },
            ],
        },
        {
            key: "8",
            label: <Link to={"documentos"}>📁 Documentos</Link>,
            roles: ["ADMIN"]
        },
        {
            key: "9",
            label: <Link to={"usuarios"}>👥 Usuários</Link>,
            roles: ["ADMIN"]
        },
        {
            key: "11",
            label: <Link to={"monday"}>📋 Board Monday</Link>,
            roles: ["ADMIN", "ANALYST", "PROCESSOR", "SECRETARY"]
        },
        {
            key: "10",
            label: (
                <span
                    onClick={() => {
                        localStorage.removeItem("token");
                        logout()
                        navigate("login");
                    }}
                >
          🚪 Sair
        </span>
            ),
            icon: <LogoutOutlined/>,
            roles: ["ADMIN", "SECRETARY"]
        },
    ];

    const renderItem = (item: MenuItem) => {
        if (!hasAnyRole(item.roles)) return null;

        if (item.children) {
            return (
                <Menu.SubMenu key={item.key} title={item.label} icon={item.icon}>
                    {item.children
                        .filter(child => hasAnyRole(child.roles))
                        .map(child => (
                            <Menu.Item key={child.key}>{child.label}</Menu.Item>
                        ))}
                </Menu.SubMenu>
            );
        }

        return (
            <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
            </Menu.Item>
        );
    };

    return (
        <Menu
            theme={"light"}
            style={{height: "fit-content"}}
            mode="inline"
        >
            {menuItems.map(renderItem)}
        </Menu>
    );
};
