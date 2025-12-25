import React from 'react';
import { useParams } from 'react-router-dom';
import { Result, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

export default function CardEdit() {
    const { id } = useParams();

    return (
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <Result
                icon={<EditOutlined style={{ fontSize: '72px', color: '#2563eb' }} />}
                title="Edit Mode Coming Soon"
                subTitle={`Card ID: ${id}`}
                extra={
                    <Button type="primary" href="/cards">
                        Back to My Cards
                    </Button>
                }
            />
        </div>
    );
}
