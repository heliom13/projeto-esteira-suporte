import {Link} from "react-router-dom";
import {AnimatedMenu} from "./AnimatedMenu";

export const RegularizacaoMenu = () => {
    const menuItems = [
        {
            key: "1",
            label: <Link to="/regularizacao">🏠 Início</Link>,
        },
        {
            key: "2",
            label: <Link to="/regularizacao/clientes">👤 Clientes</Link>,
        },
        {
            key: "3",
            label: <Link to="/regularizacao/processos">🔁 Processos</Link>,
        },
        {
            key: "4",
            label: <Link to="/regularizacao/fluxos">🗂️ Fluxos</Link>,
        },
    ];

    return (
        <AnimatedMenu theme="light" style={{height: "fit-content"}} mode="inline">
            {menuItems.map((item) => (
                <AnimatedMenu.Item key={item.key}>
                    {item.label}
                </AnimatedMenu.Item>
            ))}
        </AnimatedMenu>
    );
};
