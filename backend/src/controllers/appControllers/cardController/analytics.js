const paths = require('../../../config/paths.js');
const Card = require(paths.CardModel);

/**
 * Track analytics for public card views
 * Route: POST /api/cards/v/:slug/track
 * Body: { type: 'view' | 'linkClick', linkUrl?: string }
 */
const trackAnalytics = async (req, res) => {
    try {
        const { slug } = req.params;
        const { type, linkUrl } = req.body;

        const card = await Card.findOne({ slug, enabled: true, removed: false });

        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Card not found',
            });
        }

        const analyticsData = {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            timestamp: new Date(),
        };

        // Track different metrics
        switch (type) {
            case 'view':
                await card.incrementAnalytics('totalViews', analyticsData);
                break;
            case 'linkClick':
                await card.incrementAnalytics('linkClicks', analyticsData);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid analytics type',
                });
        }

        return res.status(200).json({
            success: true,
            message: 'Analytics tracked',
        });

    } catch (error) {
        console.error('Analytics Tracking Error:', error);
        // Don't fail the request if analytics fail
        return res.status(200).json({
            success: true,
            message: 'Request processed',
        });
    }
};

module.exports = { trackAnalytics };
