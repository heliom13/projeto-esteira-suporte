// src/pages/Error403.tsx
import React from "react";
import {Button, Result} from "antd";
import {useNavigate} from "react-router-dom";

const Error403: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="403"
            title={<div style={{color: 'red', fontWeight: 'bold'}}>Sem permissão</div>}
            subTitle={<div style={{fontSize: '18px', fontWeight: 'bold'}}>Desculpe, você não tem permissão para acessar
                esta página.</div>}
            extra={
                <Button type="primary" onClick={() => navigate("/")}>
                    Voltar para Home
                </Button>
            }
        />
    );
};

export default Error403;
