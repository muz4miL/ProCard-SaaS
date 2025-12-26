import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { message, Spin, Modal } from 'antd';
import {
    MailOutlined,
    PhoneOutlined,
    GlobalOutlined,
    DownloadOutlined,
    ShareAltOutlined,
    LinkedinOutlined,
    TwitterOutlined,
    FacebookOutlined,
    InstagramOutlined,
    GithubOutlined,
    QrcodeOutlined,
} from '@ant-design/icons';
import { QRCodeCanvas } from 'qrcode.react';
import './PublicCardView.css';

const PublicCardView = () => {
    const { slug } = useParams();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qrModalVisible, setQrModalVisible] = useState(false);

    useEffect(() => {
        fetchCard();
    }, [slug]);

    const fetchCard = async () => {
        try {
            setLoading(true);

            const publicUrl = `/api/cards/public/v/${slug}`;
            console.log('🔓 Fetching from PUBLIC route:', publicUrl);

            const response = await fetch(publicUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('📥 Response status:', response.status);

            const data = await response.json();
            console.log('📦 Response data:', data);

            if (response.ok && data.success) {
                setCard(data.result);
                console.log('✅ Card loaded successfully!');
            } else {
                setError(data.message || 'Card not found');
                console.error('❌ Error:', data.message);
            }
        } catch (err) {
            console.error('❌ Fatal error fetching card:', err);
            setError('Failed to load card');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadVCard = () => {
        const vcfUrl = `/api/cards/public/v/${slug}/vcf`;
        console.log('💾 Downloading vCard from:', vcfUrl);
        window.open(vcfUrl, '_blank');
        message.success('Downloading contact...', 2);
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${card.content?.name}'s Digital Card`,
                    text: `Check out my digital business card!`,
                    url: shareUrl,
                });
            } catch (err) {
                // User cancelled
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            message.success('Link copied to clipboard!', 2);
        }
    };

    const getSocialIcon = (platform) => {
        const platformLower = platform.toLowerCase();
        if (platformLower.includes('linkedin')) return <LinkedinOutlined />;
        if (platformLower.includes('twitter') || platformLower.includes('x.com')) return <TwitterOutlined />;
        if (platformLower.includes('facebook')) return <FacebookOutlined />;
        if (platformLower.includes('instagram')) return <InstagramOutlined />;
        if (platformLower.includes('github')) return <GithubOutlined />;
        return <GlobalOutlined />;
    };

    if (loading) {
        return (
            <div className="public-standalone-loading">
                <Spin size="large" />
            </div>
        );
    }

    if (error || !card) {
        return (
            <div className="public-standalone-error">
                <div className="error-content">
                    <h1>Card Not Found</h1>
                    <p>{error || "This digital card doesn't exist."}</p>
                </div>
            </div>
        );
    }

    const brandColor = card.branding?.primaryColor || '#2563eb';

    return (
        <div className="public-standalone-wrapper">
            <div className="public-standalone-card">
                {/* Header with Gradient */}
                <div
                    className="public-header-gradient"
                    style={{
                        background: `linear-gradient(180deg, ${brandColor} 0%, ${brandColor}dd 50%, #ffffff 100%)`,
                    }}
                >
                    <div
                        className="public-avatar-large"
                        style={{
                            backgroundColor: brandColor,
                        }}
                    >
                        {card.content?.avatar ? (
                            <img src={card.content.avatar} alt={card.content.name} />
                        ) : (
                            <span className="avatar-letter-large">
                                {card.content?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="public-content-section">
                    {/* Name & Title */}
                    <div className="public-name-section fade-in">
                        <h1 className="public-name-large">{card.content?.name || 'Anonymous'}</h1>
                        {card.content?.title && (
                            <p className="public-title-large" style={{ color: brandColor }}>
                                {card.content.title}
                            </p>
                        )}
                        {card.content?.company && (
                            <p className="public-company-large">{card.content.company}</p>
                        )}
                    </div>

                    {/* Bio */}
                    {card.content?.bio && (
                        <div className="public-bio-large fade-in-delay-1">
                            <p>{card.content.bio}</p>
                        </div>
                    )}

                    {/* Contact Action Tiles */}
                    <div className="public-contact-tiles fade-in-delay-2">
                        {card.contact?.email && (
                            <a href={`mailto:${card.contact.email}`} className="contact-tile">
                                <MailOutlined className="tile-icon" />
                                <span className="tile-text">{card.contact.email}</span>
                            </a>
                        )}
                        {card.contact?.phone && (
                            <a href={`tel:${card.contact.phone}`} className="contact-tile">
                                <PhoneOutlined className="tile-icon" />
                                <span className="tile-text">{card.contact.phone}</span>
                            </a>
                        )}
                        {card.contact?.website && (
                            <a
                                href={
                                    card.contact.website.startsWith('http')
                                        ? card.contact.website
                                        : `https://${card.contact.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-tile"
                            >
                                <GlobalOutlined className="tile-icon" />
                                <span className="tile-text">{card.contact.website}</span>
                            </a>
                        )}
                    </div>

                    {/* Social Links */}
                    {card.socials && card.socials.length > 0 && (
                        <div className="public-socials-grid fade-in-delay-3">
                            {card.socials.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-tile"
                                    style={{ borderColor: `${brandColor}40` }}
                                >
                                    {getSocialIcon(social.platform)}
                                    <span>{social.platform}</span>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="public-action-buttons fade-in-delay-4">
                        <button
                            onClick={handleDownloadVCard}
                            className="action-btn-primary"
                            style={{
                                backgroundColor: brandColor,
                                borderColor: brandColor,
                            }}
                        >
                            <DownloadOutlined />
                            <span>💾 Save Contact</span>
                        </button>
                        <button onClick={() => setQrModalVisible(true)} className="action-btn-secondary">
                            <QrcodeOutlined />
                            <span>Show QR Code</span>
                        </button>
                        <button onClick={handleShare} className="action-btn-secondary">
                            <ShareAltOutlined />
                            <span>Share Card</span>
                        </button>
                    </div>

                    {/* Footer */}
                    {!card.features?.hideBranding && (
                        <div className="public-footer-subtle">
                            <p>
                                Powered by <strong>ProCard</strong> 💼
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* QR Code Modal */}
            <Modal
                title={null}
                open={qrModalVisible}
                onCancel={() => setQrModalVisible(false)}
                footer={null}
                centered
                width={400}
                styles={{
                    body: { padding: '40px 32px' }
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <QRCodeCanvas
                        value={window.location.href}
                        size={280}
                        level="H"
                        includeMargin={true}
                        style={{
                            border: '12px solid white',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        }}
                    />
                    <p
                        style={{
                            marginTop: '24px',
                            fontSize: '15px',
                            fontWeight: 600,
                            color: '#374151',
                        }}
                    >
                        Scan to view this card
                    </p>
                    <p
                        style={{
                            fontSize: '13px',
                            color: '#9ca3af',
                            margin: '8px 0 0',
                        }}
                    >
                        Point your camera at this code
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default PublicCardView;
