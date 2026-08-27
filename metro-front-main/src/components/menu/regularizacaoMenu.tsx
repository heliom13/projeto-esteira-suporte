import {Menu} from "antd";
import {Link} from "react-router-dom";
import {HomeOutlined, TeamOutlined, ApartmentOutlined, ProfileOutlined} from "@ant-design/icons";

export const RegularizacaoMenu = () => {
    const menuItems = [
        {
            key: "1",
            icon: <HomeOutlined/>,
            label: <Link to="/regularizacao">Início</Link>,
        },
        {
            key: "2",
            icon: <TeamOutlined/>,
            label: <Link to="/regularizacao/clientes">Clientes</Link>,
        },
        {
            key: "3",
            icon: <ApartmentOutlined/>,
            label: <Link to="/regularizacao/fluxos">Fluxos</Link>,
        },
        {
            key: "4",
            icon: <ProfileOutlined/>,
            label: <Link to="/regularizacao/processos">Processos</Link>,
        },
    ];

    return (
        <Menu theme="light" style={{height: "fit-content"}} mode="inline">
            {menuItems.map((item) => (
                <Menu.Item key={item.key} icon={item.icon}>
                    {item.label}
                </Menu.Item>
            ))}
        </Menu>
    );
};
