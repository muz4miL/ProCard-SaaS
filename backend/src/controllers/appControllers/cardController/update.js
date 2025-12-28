const Card = require('../../../models/appModels/Card.js');

/**
 * Update existing card
 * Security: Only owner can update their own cards
 */
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const owner = req.admin._id;

        // Find card owned by user
        const card = await Card.findOne({ _id: id, owner, removed: false });

        if (!card) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'Card not found or you do not have permission to edit it',
            });
        }

        // === SLUG CHANGE VALIDATION ===
        if (body.slug && body.slug !== card.slug) {
            const isSlugAvailable = await Card.isSlugAvailable(body.slug, id);
            if (!isSlugAvailable) {
                return res.status(409).json({
                    success: false,
                    result: null,
                    message: `The URL "/${body.slug}" is already taken.`,
                });
            }
        }

        // Update card
        Object.assign(card, body);
        await card.save();

        return res.status(200).json({
            success: true,
            result: card,
            message: 'Card updated successfully',
        });

    } catch (error) {
        console.error('Card Update Error:', error);
        return res.status(500).json({
            success: false,
            result: null,
            message: error.message,
        });
    }
};

module.exports = update;
