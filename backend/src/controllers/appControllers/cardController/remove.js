const paths = require('../../../config/paths.js');
const Card = require(paths.CardModel);

/**
 * Soft delete card
 * Security: Only owner can delete their own cards
 */
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const owner = req.admin._id;

        const card = await Card.findOne({ _id: id, owner, removed: false });

        if (!card) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'Card not found',
            });
        }

        // Soft delete
        card.removed = true;
        card.enabled = false;
        await card.save();

        return res.status(200).json({
            success: true,
            result: card,
            message: 'Card deleted successfully',
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: error.message,
        });
    }
};

module.exports = remove;
