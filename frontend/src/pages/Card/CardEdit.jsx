import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import CardForm from '@/forms/CardForm';

const CardEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cardData, setCardData] = useState(null);

    // Token extraction helper (same as other components)
    const getCleanToken = () => {
        const raw = window.localStorage.getItem('token');
        if (raw && !raw.startsWith('{')) return raw;

        try {
            const authData = JSON.parse(window.localStorage.getItem('auth'));
            if (authData?.current?.token) return authData.current.token;
            if (authData?.token) return authData.token;
            if (authData?.result?.token) return authData.result.token;
        } catch (e) {
            console.error('Failed to parse auth token');
        }
        return null;
    };

    // Fetch card data on mount
    useEffect(() => {
        fetchCardData();
    }, [id]);

    const fetchCardData = async () => {
        try {
            setLoading(true);
            const token = getCleanToken();

            if (!token) {
                setError('Please login again');
                return;
            }

            console.log('📥 Fetching card for edit, ID:', id);

            const response = await fetch(`/api/cards/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log('📦 Card data received:', data);

            if (response.ok && data.success) {
                setCardData(data.result);
                console.log('✅ Card loaded for editing');
            } else {
                throw new Error(data.message || 'Failed to fetch card');
            }
        } catch (err) {
            console.error('❌ Error fetching card:', err);
            setError(err.message || 'Failed to load card');
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                <Spin size="large" />
                <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading card data...</p>
            </div>
        );
    }

    // Error state
    if (error || !cardData) {
        return (
            <div style={{ padding: '48px 24px' }}>
                <Result
                    status="error"
                    title="Failed to Load Card"
                    subTitle={error || 'Card not found or you do not have permission to edit it.'}
                    extra={[
                        <Button
                            type="primary"
                            key="back"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/cards')}
                        >
                            Back to My Cards
                        </Button>,
                    ]}
                />
            </div>
        );
    }

    // Render the form with initial values
    return (
        <div>
            <div
                style={{
                    padding: '16px 32px',
                    borderBottom: '1px solid #e5e7eb',
                    background: 'white',
                    marginBottom: '24px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                    }}
                >
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/cards')}
                        type="text"
                    >
                        Back
                    </Button>
                    <div style={{ flex: 1 }}>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: '24px',
                                fontWeight: 700,
                                color: '#111827',
                            }}
                        >
                            <EditOutlined style={{ marginRight: '8px', color: '#2563eb' }} />
                            Edit Card
                        </h1>
                        <p
                            style={{
                                margin: '4px 0 0',
                                fontSize: '14px',
                                color: '#6b7280',
                            }}
                        >
                            Update your digital business card details
                        </p>
                    </div>
                </div>
            </div>

            {/* Render the CardForm with initial values */}
            <CardForm initialValues={cardData} isUpdate={true} />
        </div>
    );
};

export default CardEdit;
