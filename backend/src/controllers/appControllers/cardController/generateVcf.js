const Card = require('@/models/appModels/Card');

/**
 * Generate vCard (.vcf) file for "Save Contact" functionality
 * Route: GET /api/cards/v/:slug/vcf
 * 
 * This is the "killer feature" - one-click contact save
 */
const generateVcf = async (req, res) => {
    try {
        const { slug } = req.params;

        // Find card
        const card = await Card.findOne({ slug, enabled: true, removed: false });

        if (!card) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'Card not found',
            });
        }

        // === GENERATE VCARD STRING ===
        // Using the model's built-in method
        const vcfContent = card.generateVCard();

        // === TRACK DOWNLOAD (Analytics) ===
        // Track asynchronously (don't block response)
        card.incrementAnalytics('vcfDownloads', {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
        }).catch(err => {
            console.error('Analytics tracking failed:', err);
        });

        // === SEND VCF FILE ===
        const filename = `${slug}.vcf`;

        res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Cache-Control', 'no-cache');

        return res.send(vcfContent);

    } catch (error) {
        console.error('VCF Generation Error:', error);
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Failed to generate vCard',
            error: error.message,
        });
    }
};

/**
 * Generate vCard with advanced fields (Pro+ feature)
 * Includes: Photo (Base64), Logo, Geo-coordinates
 */
const generateVcfAdvanced = async (req, res) => {
    try {
        const { slug } = req.params;

        const card = await Card.findOne({ slug, enabled: true, removed: false });

        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Card not found',
            });
        }

        // === BUILD ADVANCED VCARD 3.0 ===
        let vcard = 'BEGIN:VCARD\n';
        vcard += 'VERSION:3.0\n';

        // Basic Info
        vcard += `FN:${card.content.name}\n`;
        if (card.content.title) vcard += `TITLE:${card.content.title}\n`;
        if (card.content.company) vcard += `ORG:${card.content.company}\n`;

        // Contact
        if (card.contact.phone) vcard += `TEL;TYPE=WORK,VOICE:${card.contact.phone}\n`;
        if (card.contact.email) vcard += `EMAIL;TYPE=WORK:${card.contact.email}\n`;
        if (card.contact.website) vcard += `URL:${card.contact.website}\n`;

        // Address
        if (card.contact.address.street) {
            vcard += `ADR;TYPE=WORK:;;${card.contact.address.street};${card.contact.address.city};${card.contact.address.state};${card.contact.address.zipCode};${card.contact.address.country}\n`;
        }

        // Geo-coordinates (Pro+ Feature)
        if (card.contact.mapCoordinates.latitude && card.contact.mapCoordinates.longitude) {
            vcard += `GEO:${card.contact.mapCoordinates.latitude};${card.contact.mapCoordinates.longitude}\n`;
        }

        // Photo (Avatar URL)
        if (card.content.avatar) {
            vcard += `PHOTO;VALUE=URI:${card.content.avatar}\n`;
        }

        // Logo (Branding)
        if (card.branding.logoUrl) {
            vcard += `LOGO;VALUE=URI:${card.branding.logoUrl}\n`;
        }

        // Social Links (as URLs)
        card.socials.forEach(social => {
            vcard += `URL;TYPE=${social.platform}:${social.url}\n`;
        });

        // Note
        if (card.content.bio) {
            vcard += `NOTE:${card.content.bio}\n`;
        }

        // ProCard Identifier
        vcard += `X-PROCARD-URL:${card.publicUrl}\n`;
        vcard += `X-PROCARD-TIER:${card.tier}\n`;

        vcard += 'END:VCARD';

        // === TRACK DOWNLOAD ===
        card.incrementAnalytics('vcfDownloads', {
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        }).catch(err => console.error('Analytics failed:', err));

        // === SEND ===
        const filename = `${slug}.vcf`;
        res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        return res.send(vcard);

    } catch (error) {
        console.error('Advanced VCF Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { generateVcf, generateVcfAdvanced };
