import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Popconfirm, message, Empty, Spin, Tag } from 'antd';
import {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    QrcodeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './CardList.css';

const CardList = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    // Token extraction helper (same as CardForm)
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

    // Fetch cards on mount
    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            setLoading(true);
            const token = getCleanToken();

            if (!token) {
                message.error('Please login again');
                return;
            }

            const response = await fetch('/api/cards', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setCards(data.result || []);
            } else {
                throw new Error(data.message || 'Failed to fetch cards');
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
            message.error('Failed to load cards');
        } finally {
            setLoading(false);
        }
    };

    // Delete card
    const handleDelete = async (id) => {
        try {
            const token = getCleanToken();

            const response = await fetch(`/api/cards/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                message.success('Card deleted successfully');
                fetchCards(); // Refresh list
            } else {
                throw new Error(data.message || 'Failed to delete card');
            }
        } catch (error) {
            console.error('Error deleting card:', error);
            message.error('Failed to delete card');
        }
    };

    // Generate avatar gradient
    const getAvatarGradient = (color) => {
        return `linear-gradient(135deg, ${color}dd, ${color}99)`;
    };

    // Loading state
    if (loading) {
        return (
            <div className="card-list-container">
                <div className="card-list-header">
                    <h1 className="page-title">My Digital Cards</h1>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/cards/create')}
                        size="large"
                    >
                        Create Card
                    </Button>
                </div>
                <div className="loading-container">
                    <Spin size="large" tip="Loading your cards..." />
                </div>
            </div>
        );
    }

    // Empty state
    if (cards.length === 0) {
        return (
            <div className="card-list-container">
                <div className="card-list-header">
                    <h1 className="page-title">My Digital Cards</h1>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/cards/create')}
                        size="large"
                    >
                        Create Card
                    </Button>
                </div>
                <div className="empty-state">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div>
                                <h3>No business cards created yet.</h3>
                                <p>Create your first digital business card to get started!</p>
                            </div>
                        }
                    >
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/cards/create')}
                            size="large"
                        >
                            Create Your First Card
                        </Button>
                    </Empty>
                </div>
            </div>
        );
    }

    // Cards grid
    return (
        <div className="card-list-container">
            <div className="card-list-header">
                <div className="header-left">
                    <h1 className="page-title">My Digital Cards</h1>
                    <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        {cards.length} {cards.length === 1 ? 'Card' : 'Cards'}
                    </Tag>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/cards/create')}
                    size="large"
                >
                    Create Card
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {cards.map((card) => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={card._id}>
                        <Card
                            className="business-card"
                            hoverable
                            cover={
                                <div
                                    className="card-cover"
                                    style={{
                                        background: card.content?.avatar
                                            ? `url(${card.content.avatar})`
                                            : getAvatarGradient(card.branding?.primaryColor || '#2563eb'),
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    {!card.content?.avatar && (
                                        <div className="card-avatar-placeholder">
                                            <span className="avatar-letter">
                                                {card.content?.name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            }
                            actions={[
                                <Button
                                    type="text"
                                    icon={<EyeOutlined />}
                                    onClick={() => window.open(`/cards/v/${card.slug}`, '_blank')}
                                    title="View Public Card"
                                >
                                    View
                                </Button>,
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => navigate(`/cards/edit/${card._id}`)}
                                    title="Edit Card"
                                >
                                    Edit
                                </Button>,
                                <Popconfirm
                                    title="Delete Card"
                                    description="Are you sure you want to delete this card?"
                                    onConfirm={() => handleDelete(card._id)}
                                    okText="Yes, Delete"
                                    cancelText="Cancel"
                                    okButtonProps={{ danger: true }}
                                >
                                    <Button type="text" danger icon={<DeleteOutlined />} title="Delete Card">
                                        Delete
                                    </Button>
                                </Popconfirm>,
                            ]}
                        >
                            <Card.Meta
                                title={
                                    <div className="card-title-section">
                                        <h3 className="card-name">{card.content?.name || 'Unnamed'}</h3>
                                        {card.tier && (
                                            <Tag color={card.tier === 'free' ? 'default' : 'gold'}>
                                                {card.tier.toUpperCase()}
                                            </Tag>
                                        )}
                                    </div>
                                }
                                description={
                                    <div className="card-description">
                                        {card.content?.title && (
                                            <p className="card-job-title">{card.content.title}</p>
                                        )}
                                        {card.content?.company && (
                                            <p className="card-company">{card.content.company}</p>
                                        )}
                                        <div className="card-stats">
                                            <span title="Total Views">
                                                👁️ {card.analytics?.totalViews || 0}
                                            </span>
                                            <span title="Total Downloads">
                                                💾 {card.analytics?.totalDownloads || 0}
                                            </span>
                                        </div>
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default CardList;
