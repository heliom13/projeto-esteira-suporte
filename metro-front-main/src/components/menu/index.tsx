// src/components/menu/index.tsx
import {AppstoreOutlined, LogoutOutlined} from "@ant-design/icons";
import {Menu} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";

export const SideMenu = () => {
    const navigate = useNavigate();
    const {user, isAuthenticated, hasAnyRole, logout} = useAuth();

    const menuItems = [
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
            key: "6",
            label: <Link to={"bancos"}>🏦 Cadastro de fluxos</Link>,
            roles: ["ADMIN", "ANALYST"]
        },
        {
            key: "7",
            label: <Link to={"passos"}>🪜 Cadastro de Passos</Link>,
            roles: ["ADMIN", "ANALYST"]
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

    return (
        <Menu
            theme={"light"}
            style={{height: "fit-content"}}
            mode="inline"
        >
            {menuItems.map(item => (
                hasAnyRole(item.roles) && (
                    <Menu.Item key={item.key} icon={item.icon}>
                        {item.label}
                    </Menu.Item>
                )
            ))}
        </Menu>
    );
};
