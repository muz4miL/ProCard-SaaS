const create = require('./create');
const { read, publicBySlug, list } = require('./read');
const update = require('./update');
const remove = require('./remove');
const { generateQr, generateQrDataUrl } = require('./generateQr');
const { generateVcf, generateVcfAdvanced } = require('./generateVcf');
const { trackAnalytics } = require('./analytics');

module.exports = {
    // CRUD Operations
    create,
    read,
    update,
    remove,
    list,

    // Public Access
    publicBySlug,

    // Features
    generateQr,
    generateQrDataUrl,
    generateVcf,
    generateVcfAdvanced,

    // Analytics
    trackAnalytics,
};
