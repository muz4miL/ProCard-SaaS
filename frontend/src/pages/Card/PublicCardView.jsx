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
import { API_BASE_URL } from '@/config/serverApiConfig';
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

            const publicUrl = `${API_BASE_URL}cards/public/v/${slug}`;
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
        const vcfUrl = `${API_BASE_URL}cards/public/v/${slug}/vcf`;
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
            <div className="premium-card-wrapper">
                <div className="premium-card-container premium-card-loading">
                    <Spin size="large" className="premium-spinner" />
                </div>
            </div>
        );
    }

    if (error || !card) {
        return (
            <div className="premium-card-wrapper">
                <div className="premium-card-container premium-card-error">
                    <div className="error-icon">🔍</div>
                    <h1>Card Not Found</h1>
                    <p>{error || "This digital card doesn't exist."}</p>
                </div>
            </div>
        );
    }

    const brandColor = card.branding?.primaryColor || '#6366f1';

    return (
        <div className="premium-card-wrapper">
            <div className="premium-card-container">
                {/* Premium Header Section */}
                <div
                    className="premium-header"
                    style={{
                        background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}cc 50%, ${adjustColorBrightness(brandColor, -20)} 100%)`,
                    }}
                >
                    {/* Avatar with glow effect */}
                    <div className="premium-avatar-wrapper">
                        <div
                            className="premium-avatar-glow"
                            style={{ boxShadow: `0 0 40px ${brandColor}60, 0 0 80px ${brandColor}30` }}
                        >
                            <div className="premium-avatar">
                                {card.content?.avatar ? (
                                    <img src={card.content.avatar} alt={card.content.name} />
                                ) : (
                                    <span className="avatar-fallback">
                                        {card.content?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Glassmorphism Card Content */}
                <div className="premium-content">
                    {/* Name & Title */}
                    <div className="premium-name-section">
                        <h1 className="premium-name">{card.content?.name || 'Anonymous'}</h1>
                        {card.content?.title && (
                            <p className="premium-title" style={{ color: brandColor }}>
                                {card.content.title}
                            </p>
                        )}
                        {card.content?.company && (
                            <p className="premium-company">{card.content.company}</p>
                        )}
                    </div>

                    {/* Bio */}
                    {card.content?.bio && (
                        <div className="premium-bio">
                            <p>{card.content.bio}</p>
                        </div>
                    )}

                    {/* Contact Links */}
                    <div className="premium-contact-section">
                        {card.contact?.email && (
                            <a href={`mailto:${card.contact.email}`} className="premium-contact-link">
                                <div className="premium-contact-icon">
                                    <MailOutlined />
                                </div>
                                <span className="premium-contact-text">{card.contact.email}</span>
                            </a>
                        )}
                        {card.contact?.phone && (
                            <a href={`tel:${card.contact.phone}`} className="premium-contact-link">
                                <div className="premium-contact-icon">
                                    <PhoneOutlined />
                                </div>
                                <span className="premium-contact-text">{card.contact.phone}</span>
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
                                className="premium-contact-link"
                            >
                                <div className="premium-contact-icon">
                                    <GlobalOutlined />
                                </div>
                                <span className="premium-contact-text">{card.contact.website}</span>
                            </a>
                        )}
                    </div>

                    {/* Social Links as Premium Pills */}
                    {card.socials && card.socials.length > 0 && (
                        <div className="premium-socials">
                            {card.socials.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="premium-social-pill"
                                    style={{
                                        borderColor: `${brandColor}40`,
                                        backgroundColor: `${brandColor}08`,
                                    }}
                                >
                                    <span className="premium-social-icon">
                                        {getSocialIcon(social.platform)}
                                    </span>
                                    <span className="premium-social-name">{social.platform}</span>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Premium Action Buttons */}
                    <div className="premium-actions">
                        <button
                            onClick={handleDownloadVCard}
                            className="premium-btn premium-btn-primary"
                            style={{
                                background: `linear-gradient(135deg, ${brandColor} 0%, ${adjustColorBrightness(brandColor, -15)} 100%)`,
                                boxShadow: `0 8px 24px ${brandColor}50`,
                            }}
                        >
                            <DownloadOutlined className="premium-btn-icon" />
                            <span>Save Contact</span>
                        </button>

                        <div className="premium-actions-row">
                            <button
                                onClick={() => setQrModalVisible(true)}
                                className="premium-btn premium-btn-secondary"
                            >
                                <QrcodeOutlined className="premium-btn-icon" />
                                <span>Show QR</span>
                            </button>
                            <button
                                onClick={handleShare}
                                className="premium-btn premium-btn-secondary"
                            >
                                <ShareAltOutlined className="premium-btn-icon" />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>

                    {/* Premium Footer */}
                    {!card.features?.hideBranding && (
                        <div className="premium-footer">
                            <span className="premium-footer-brand">
                                <span className="heart">💎</span> ProCard
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium QR Code Modal */}
            <Modal
                title={null}
                open={qrModalVisible}
                onCancel={() => setQrModalVisible(false)}
                footer={null}
                centered
                width={420}
                styles={{
                    body: { padding: '48px 32px' }
                }}
                className="premium-qr-modal"
                closeIcon={<span className="premium-modal-close">✕</span>}
            >
                <div className="premium-qr-content">
                    <div className="premium-qr-title">Scan to Connect</div>
                    <p className="premium-qr-subtitle">
                        Point your camera at this QR code to view this digital card
                    </p>

                    <div className="premium-qr-wrapper">
                        <div className="premium-qr-inner" style={{ borderColor: brandColor }}>
                            <QRCodeCanvas
                                value={window.location.href}
                                size={240}
                                level="H"
                                includeMargin={true}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>
                    </div>

                    <div className="premium-qr-url">
                        {window.location.href}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// Helper function to adjust color brightness
function adjustColorBrightness(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    const clamp = (val) => Math.min(255, Math.max(0, val));

    return '#' + (0x1000000 +
        (clamp(R) << 16) +
        (clamp(G) << 8) +
        clamp(B)
    ).toString(16).slice(1);
}

export default PublicCardView;