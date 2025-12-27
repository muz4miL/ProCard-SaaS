const QRCode = require('qrcode');
const Card = require('../../../../../models/appModels/Card.js');

/**
 * Generate QR Code for card's public URL
 * Route: GET /api/cards/v/:slug/qr
 * Query Params: ?format=png|svg&size=300
 */
const generateQr = async (req, res) => {
    try {
        const { slug } = req.params;
        const { format = 'png', size = 300 } = req.query;

        // Find card
        const card = await Card.findOne({ slug, enabled: true, removed: false });

        if (!card) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'Card not found',
            });
        }

        // QR Code options (use card's custom styling)
        const qrOptions = {
            width: parseInt(size) || 300,
            margin: 2,
            color: {
                dark: card.features.qrStyle.foregroundColor || '#000000',
                light: card.features.qrStyle.backgroundColor || '#ffffff',
            },
            errorCorrectionLevel: card.features.qrStyle.errorCorrectionLevel || 'M',
        };

        const cardPublicUrl = card.publicUrl;

        // === SVG FORMAT ===
        if (format === 'svg') {
            const svg = await QRCode.toString(cardPublicUrl, {
                ...qrOptions,
                type: 'svg',
            });

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
            return res.send(svg);
        }

        // === PNG FORMAT (Default) ===
        const pngBuffer = await QRCode.toBuffer(cardPublicUrl, {
            ...qrOptions,
            type: 'png',
        });

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Content-Disposition', `inline; filename="${slug}-qr.png"`);
        return res.send(pngBuffer);

    } catch (error) {
        console.error('QR Generation Error:', error);
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Failed to generate QR code',
            error: error.message,
        });
    }
};

/**
 * Generate QR Code as Data URL (for embedding in frontend)
 * Route: GET /api/cards/:id/qr/dataurl
 */
const generateQrDataUrl = async (req, res) => {
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

        const qrOptions = {
            width: 400,
            color: {
                dark: card.features.qrStyle.foregroundColor,
                light: card.features.qrStyle.backgroundColor,
            },
            errorCorrectionLevel: card.features.qrStyle.errorCorrectionLevel,
        };

        // Generate Data URL
        const dataUrl = await QRCode.toDataURL(card.publicUrl, qrOptions);

        return res.status(200).json({
            success: true,
            result: {
                dataUrl,
                publicUrl: card.publicUrl,
            },
        });

    } catch (error) {
        console.error('QR Data URL Error:', error);
        return res.status(500).json({
            success: false,
            result: null,
            message: error.message,
        });
    }
};

module.exports = { generateQr, generateQrDataUrl };
