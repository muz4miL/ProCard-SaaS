const Card = require('@/models/appModels/Card');

/**
 * Read card(s) - Supports both single and list operations
 */

// === READ SINGLE CARD (Authenticated) ===
const read = async (req, res) => {
    try {
        const { id } = req.params;
        const owner = req.admin._id;

        // Find card owned by current user
        const card = await Card.findOne({ _id: id, owner, removed: false });

        if (!card) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'Card not found',
            });
        }

        // Increment view counter (internal tracking)
        await card.incrementAnalytics('totalViews');

        return res.status(200).json({
            success: true,
            result: card,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: error.message,
        });
    }
};

// === PUBLIC VIEW BY SLUG (NO AUTH REQUIRED) ===
/**
 * CRITICAL: This is the "money route" - public card access
 * Route: GET /api/cards/v/:slug
 */
const publicBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // DEBUG LOGGING
        console.log('🔓 PUBLIC ROUTE HIT! Slug:', slug);
        console.log('📍 Request URL:', req.originalUrl);
        console.log('🔑 Authorization header:', req.headers.authorization || 'NONE (correct!)');

        // Find card by slug (publicly accessible)
        const card = await Card.findOne({ slug, enabled: true, removed: false })
            .select('-features.passwordProtection.password') // Never expose password
            .populate('owner', 'name email company'); // Include owner basics

        if (!card) {
            console.log('❌ Card not found for slug:', slug);
            return res.status(404).json({
                success: false,
                result: null,
                message: 'Card not found or has been disabled',
            });
        }

        console.log('✅ Card found:', card.content.name);

        // === PASSWORD PROTECTION CHECK ===
        if (card.features.passwordProtection.enabled) {
            const { password } = req.query; // Pass via query: ?password=1234

            if (!password || password !== card.features.passwordProtection.password) {
                return res.status(401).json({
                    success: false,
                    result: null,
                    message: 'This card is password protected',
                    passwordRequired: true,
                });
            }
        }

        // === ANALYTICS TRACKING ===
        const analyticsData = {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            // TODO: Add IP geolocation service for country/city
        };

        // Track view asynchronously (don't block response)
        card.incrementAnalytics('totalViews', analyticsData).catch(err => {
            console.error('Analytics tracking failed:', err);
        });

        console.log('📤 Sending card data to client');
        return res.status(200).json({
            success: true,
            result: card,
            publicUrl: card.publicUrl,
            qrCodeUrl: card.qrCodeUrl,
            vcfUrl: card.vcfUrl,
        });
    } catch (error) {
        console.error('❌ PUBLIC ROUTE ERROR:', error);
        return res.status(500).json({
            success: false,
            result: null,
            message: error.message,
        });
    }
};

// === LIST ALL CARDS (Authenticated User) ===
const list = async (req, res) => {
    try {
        const owner = req.admin._id;
        const { page = 1, limit = 10 } = req.query;

        const cards = await Card.find({ owner, removed: false })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Card.countDocuments({ owner, removed: false });

        return res.status(200).json({
            success: true,
            result: cards,
            pagination: {
                page: Number(page),
                pages: Math.ceil(count / limit),
                count,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: error.message,
        });
    }
};

module.exports = { read, publicBySlug, list };
