import React, { useState, useEffect } from 'react';
import { Form, Input, Button, ColorPicker, Row, Col, message, Space, Divider } from 'antd';
import {
    SaveOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    GlobalOutlined,
    BankOutlined,
    LinkedinOutlined,
    TwitterOutlined,
    PlusOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/config/serverApiConfig';
import './CardForm.css';

const CardForm = ({ initialValues = null, isUpdate = false }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [socials, setSocials] = useState([]);

    // Real-time preview state with placeholders
    const [previewData, setPreviewData] = useState({
        name: '',
        title: '',
        company: '',
        email: '',
        phone: '',
        website: '',
        bio: '',
        primaryColor: '#2563eb',
    });

    // === PRE-FILL FORM IF EDITING ===
    useEffect(() => {
        if (initialValues && isUpdate) {
            console.log('📝 EDIT MODE: Pre-filling form with:', initialValues);

            // Set form values
            form.setFieldsValue({
                name: initialValues.content?.name || '',
                title: initialValues.content?.title || '',
                company: initialValues.content?.company || '',
                bio: initialValues.content?.bio || '',
                email: initialValues.contact?.email || '',
                phone: initialValues.contact?.phone || '',
                website: initialValues.contact?.website || '',
                primaryColor: initialValues.branding?.primaryColor || '#2563eb',
            });

            // Set social links
            if (initialValues.socials && initialValues.socials.length > 0) {
                setSocials(initialValues.socials);
            }

            // Set preview data
            setPreviewData({
                name: initialValues.content?.name || '',
                title: initialValues.content?.title || '',
                company: initialValues.content?.company || '',
                bio: initialValues.content?.bio || '',
                email: initialValues.contact?.email || '',
                phone: initialValues.contact?.phone || '',
                website: initialValues.contact?.website || '',
                primaryColor: initialValues.branding?.primaryColor || '#2563eb',
            });
        }
    }, [initialValues, isUpdate, form]);

    // Handle form value changes for live preview
    const handleValuesChange = (changedValues, allValues) => {
        setPreviewData((prev) => ({
            ...prev,
            ...allValues,
            primaryColor: allValues.primaryColor?.toHexString?.() || prev.primaryColor,
        }));
    };

    // Add social link
    const addSocialLink = () => {
        setSocials([...socials, { platform: 'LinkedIn', url: '' }]);
    };

    // Remove social link
    const removeSocialLink = (index) => {
        const newSocials = socials.filter((_, i) => i !== index);
        setSocials(newSocials);
    };

    // Handle form submission - BULLETPROOF VERSION
    // Handle form submission - WITH TOKEN CLEANER
    const onFinish = async (values) => {
        setLoading(true);
        try {
            // === 1. DEBUG: LOG EVERYTHING IN LOCALSTORAGE ===
            console.log('🔍 DEBUG: Checking localStorage...');
            console.log('Raw localStorage.auth:', window.localStorage.getItem('auth'));
            console.log('Raw localStorage.token:', window.localStorage.getItem('token'));
            console.log('All localStorage keys:', Object.keys(window.localStorage));

            // === 2. TOKEN HUNT - Try ALL possible locations ===
            let authToken = null;

            // Strategy 1: Direct token in localStorage
            authToken = window.localStorage.getItem('token');
            if (authToken && !authToken.startsWith('{')) {
                console.log('✅ Found token: Direct string');
            } else {
                // Strategy 2: Parse 'auth' object and look for token
                try {
                    const authRaw = window.localStorage.getItem('auth');
                    if (authRaw) {
                        const authData = JSON.parse(authRaw);
                        console.log('📦 Parsed auth object:', authData);

                        // Try: authData.current.token
                        if (authData?.current?.token) {
                            authToken = authData.current.token;
                            console.log('✅ Found token: auth.current.token');
                        }
                        // Try: authData.token
                        else if (authData?.token) {
                            authToken = authData.token;
                            console.log('✅ Found token: auth.token');
                        }
                        // Try: authData.result.token
                        else if (authData?.result?.token) {
                            authToken = authData.result.token;
                            console.log('✅ Found token: auth.result.token');
                        }
                    }
                } catch (e) {
                    console.error('❌ Failed to parse auth:', e);
                }
            }

            // === 3. HALT IF NO TOKEN FOUND ===
            if (!authToken) {
                console.error('❌ NO TOKEN FOUND!');
                alert('⚠️ Auth Token not found!\n\nPlease Log Out and Log In again.');
                setLoading(false);
                return; // Stop execution
            }

            console.log('🔑 Using token:', authToken.substring(0, 20) + '...');
            // -----------------------------

            // 2. Generate slug from name
            const slug = values.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            // 3. Prepare the data
            const cardData = {
                slug,
                content: {
                    name: values.name,
                    title: values.title || '',
                    company: values.company || '',
                    bio: values.bio || '',
                },
                contact: {
                    email: values.email || '',
                    phone: values.phone || '',
                    website: values.website || '',
                },
                branding: {
                    primaryColor: values.primaryColor?.toHexString?.() || '#2563eb',
                },
                socials: socials.filter((s) => s.url),
            };

            // 4. The Request - CREATE or UPDATE
            const apiUrl = isUpdate
                ? `${API_BASE_URL}cards/${initialValues._id}`
                : `${API_BASE_URL}cards`;
            const method = isUpdate ? 'PATCH' : 'POST';

            console.log(`📤 ${method} request to:`, apiUrl);
            console.log('� Sending card data:', cardData);

            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(cardData),
            });

            console.log('📥 Response status:', response.status);

            const data = await response.json();
            console.log('📥 Response data:', data);

            // 5. Handle response
            if (response.ok && data.success) {
                // Success!
                console.log('✅ SUCCESS!');
                const successMessage = isUpdate
                    ? '✅ Card updated successfully!'
                    : '🎉 Your digital card is live!';

                message.success({
                    content: successMessage,
                    duration: 3,
                    style: {
                        marginTop: '20vh',
                    },
                });

                setTimeout(() => {
                    navigate('/cards');
                }, 1000);
            } else {
                throw new Error(data.message || `Server returned ${response.status}`);
            }
        } catch (error) {
            // 6. Error Handling
            console.error('Card creation error:', error);
            message.error({
                content: error.message || 'Failed to save. Please try again.',
                duration: 5,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-form-wrapper">
            <div className="card-form-container">
                <Row gutter={[48, 32]}>
                    {/* LEFT: Form Section */}
                    <Col xs={24} lg={13}>
                        <div className="form-card">
                            <div className="form-header">
                                <h1 className="form-title">Create Your Digital Card</h1>
                                <p className="form-subtitle">
                                    Fill in your details below. Watch your card come to life in real-time.
                                </p>
                            </div>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                onValuesChange={handleValuesChange}
                                requiredMark="optional"
                            >
                                {/* Basic Information */}
                                <div className="form-section">
                                    <h3 className="section-title">Basic Information</h3>

                                    <Form.Item
                                        label="Full Name"
                                        name="name"
                                        rules={[
                                            { required: true, message: 'Please enter your name' },
                                            { min: 2, message: 'Name must be at least 2 characters' },
                                        ]}
                                    >
                                        <Input
                                            prefix={<UserOutlined className="input-icon" />}
                                            placeholder="John Doe"
                                            className="premium-input"
                                        />
                                    </Form.Item>

                                    <Form.Item label="Job Title" name="title">
                                        <Input placeholder="Software Engineer" className="premium-input" />
                                    </Form.Item>

                                    <Form.Item label="Company" name="company">
                                        <Input
                                            prefix={<BankOutlined className="input-icon" />}
                                            placeholder="Tech Corp"
                                            className="premium-input"
                                        />
                                    </Form.Item>

                                    <Form.Item label="Bio" name="bio">
                                        <Input.TextArea
                                            placeholder="Tell us about yourself..."
                                            rows={3}
                                            maxLength={500}
                                            showCount
                                            className="premium-textarea"
                                        />
                                    </Form.Item>
                                </div>

                                <Divider />

                                {/* Contact Information */}
                                <div className="form-section">
                                    <h3 className="section-title">Contact Information</h3>

                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{ type: 'email', message: 'Please enter a valid email' }]}
                                    >
                                        <Input
                                            prefix={<MailOutlined className="input-icon" />}
                                            placeholder="john@example.com"
                                            className="premium-input"
                                        />
                                    </Form.Item>

                                    <Form.Item label="Phone" name="phone">
                                        <Input
                                            prefix={<PhoneOutlined className="input-icon" />}
                                            placeholder="+1 234 567 8900"
                                            className="premium-input"
                                        />
                                    </Form.Item>

                                    <Form.Item label="Website" name="website">
                                        <Input
                                            prefix={<GlobalOutlined className="input-icon" />}
                                            placeholder="www.yoursite.com"
                                            className="premium-input"
                                        />
                                    </Form.Item>
                                </div>

                                <Divider />

                                {/* Branding */}
                                <div className="form-section">
                                    <h3 className="section-title">Branding</h3>

                                    <Form.Item
                                        label="Brand Color"
                                        name="primaryColor"
                                        extra="This color will be used for buttons and accents"
                                    >
                                        <ColorPicker
                                            showText
                                            format="hex"
                                            size="large"
                                            defaultValue="#2563eb"
                                            className="premium-color-picker"
                                        />
                                    </Form.Item>
                                </div>

                                <Divider />

                                {/* Social Links */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <h3 className="section-title">Social Links</h3>
                                        <Button
                                            type="dashed"
                                            icon={<PlusOutlined />}
                                            onClick={addSocialLink}
                                            size="small"
                                        >
                                            Add Link
                                        </Button>
                                    </div>

                                    {socials.map((social, index) => (
                                        <Space key={index} style={{ width: '100%', marginBottom: 12 }} align="start">
                                            <Input
                                                placeholder="LinkedIn"
                                                value={social.platform}
                                                onChange={(e) => {
                                                    const newSocials = [...socials];
                                                    newSocials[index].platform = e.target.value;
                                                    setSocials(newSocials);
                                                }}
                                                style={{ width: 120 }}
                                                className="premium-input"
                                            />
                                            <Input
                                                placeholder="https://linkedin.com/in/username"
                                                value={social.url}
                                                onChange={(e) => {
                                                    const newSocials = [...socials];
                                                    newSocials[index].url = e.target.value;
                                                    setSocials(newSocials);
                                                }}
                                                style={{ flex: 1 }}
                                                className="premium-input"
                                            />
                                            <Button
                                                type="text"
                                                danger
                                                icon={<CloseOutlined />}
                                                onClick={() => removeSocialLink(index)}
                                            />
                                        </Space>
                                    ))}
                                </div>

                                {/* Submit Button */}
                                <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                        loading={loading}
                                        className="premium-submit-btn"
                                        block
                                    >
                                        {loading
                                            ? (isUpdate ? 'Updating Card...' : 'Creating Your Card...')
                                            : (isUpdate ? 'Update Card' : 'Create Card')
                                        }
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>

                    {/* RIGHT: Live iPhone Preview */}
                    <Col xs={24} lg={11}>
                        <div className="preview-container">
                            <div className="preview-header">
                                <div className="preview-badge">
                                    <div className="pulse-dot"></div>
                                    <span>Live Preview</span>
                                </div>
                            </div>

                            <div className="iphone-mockup">
                                <div className="iphone-frame">
                                    <div className="iphone-notch"></div>
                                    <div className="iphone-screen">
                                        <div className="card-preview">
                                            {/* Avatar */}
                                            <div className="preview-avatar-wrapper">
                                                <div
                                                    className="preview-avatar"
                                                    style={{
                                                        backgroundColor: previewData.primaryColor || '#2563eb',
                                                    }}
                                                >
                                                    <span className="avatar-text">
                                                        {previewData.name ? previewData.name.charAt(0).toUpperCase() : 'J'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Name & Title */}
                                            <h2 className="preview-name">
                                                {previewData.name || 'Your Name'}
                                            </h2>
                                            <p
                                                className="preview-title"
                                                style={{
                                                    color: previewData.primaryColor || '#2563eb',
                                                }}
                                            >
                                                {previewData.title || 'Your Title'}
                                            </p>
                                            {(previewData.company || !previewData.name) && (
                                                <p className="preview-company">
                                                    {previewData.company || 'Your Company'}
                                                </p>
                                            )}

                                            {/* Bio */}
                                            {previewData.bio && (
                                                <p className="preview-bio">{previewData.bio}</p>
                                            )}

                                            {/* Contact Info */}
                                            <div className="preview-contacts">
                                                {(previewData.email || !previewData.name) && (
                                                    <div className="preview-contact-item">
                                                        <MailOutlined />
                                                        <span>{previewData.email || 'email@example.com'}</span>
                                                    </div>
                                                )}
                                                {(previewData.phone || !previewData.name) && (
                                                    <div className="preview-contact-item">
                                                        <PhoneOutlined />
                                                        <span>{previewData.phone || '+1 234 567 8900'}</span>
                                                    </div>
                                                )}
                                                {(previewData.website || !previewData.name) && (
                                                    <div className="preview-contact-item">
                                                        <GlobalOutlined />
                                                        <span>{previewData.website || 'yoursite.com'}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* CTA Button */}
                                            <button
                                                className="preview-cta"
                                                style={{
                                                    backgroundColor: previewData.primaryColor || '#2563eb',
                                                }}
                                            >
                                                💾 Save Contact
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CardForm;