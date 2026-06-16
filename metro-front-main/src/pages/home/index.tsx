import {Spin, Typography} from "antd";
import {useState} from "react";
import {primaryText,} from "../../styles/stylesProps";

const {Title} = Typography;

const Home = () => {
    const [loading, setLoading] = useState(false);


    return (
        <Spin spinning={loading} tip="Carregando...">
            <Title level={3} {...primaryText}>
                Suporte Imobiliário
            </Title>
        </Spin>
    );
};
export default Home;
