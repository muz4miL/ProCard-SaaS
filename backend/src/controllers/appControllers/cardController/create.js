const Card = require('../../../../../models/appModels/Card.js');

/**
 * Create a new digital business card
 * MONETIZATION: Enforces tier limits (Free = 1 card, Pro = 10, Agency = unlimited)
 */
const create = async (req, res) => {
    try {
        const { body } = req;
        const owner = req.admin._id; // Current logged-in user

        // === TIER LIMIT ENFORCEMENT (The Money Logic) ===
        const existingCards = await Card.countDocuments({ owner, removed: false });

        const tierLimits = {
            Free: 1,
            Pro: 10,
            Agency: -1, // Unlimited
        };

        const userTier = req.admin.tier || 'Free'; // Assuming user has a tier field
        const limit = tierLimits[userTier];

        if (limit !== -1 && existingCards >= limit) {
            return res.status(403).json({
                success: false,
                result: null,
                message: `Card limit reached for ${userTier} tier. Upgrade to create more cards.`,
                tierLimit: limit,
                currentCount: existingCards,
            });
        }

        // === SLUG VALIDATION (Ensure unique URL) ===
        const { slug } = body;
        if (!slug) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Slug is required for custom URL (e.g., "john-doe")',
            });
        }

        const isSlugAvailable = await Card.isSlugAvailable(slug);
        if (!isSlugAvailable) {
            return res.status(409).json({
                success: false,
                result: null,
                message: `The URL "/${slug}" is already taken. Please choose another.`,
            });
        }

        // === CREATE CARD ===
        const card = new Card({
            ...body,
            owner,
            tier: userTier, // Inherit user's tier
        });

        await card.save();

        return res.status(200).json({
            success: true,
            result: card,
            message: 'Card created successfully!',
            publicUrl: card.publicUrl,
            qrCodeUrl: card.qrCodeUrl,
            vcfUrl: card.vcfUrl,
        });
    } catch (error) {
        console.error('Card Creation Error:', error);

        if (error.code === 11000) {
            // Duplicate key error (slug already exists)
            return res.status(409).json({
                success: false,
                result: null,
                message: 'This URL is already taken. Please choose a different slug.',
            });
        }

        return res.status(500).json({
            success: false,
            result: null,
            message: error.message,
        });
    }
};

module.exports = create;
