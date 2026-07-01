import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const MondayBoard: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Title level={3} style={{ color: '#1f3c6b', marginBottom: 16 }}>
                Board — Visualização Monday
            </Title>
            <iframe
                src="/monday-board.html"
                title="Board Monday"
                style={{
                    width: '100%',
                    flex: 1,
                    minHeight: 'calc(100vh - 180px)',
                    border: 'none',
                    borderRadius: 8,
                }}
            />
        </div>
    );
};

export default MondayBoard;
