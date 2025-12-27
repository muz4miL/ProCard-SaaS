const express = require('express');
const router = express.Router();

const cardController = require('../../controllers/appControllers/cardController/index.js');
const adminAuth = require('../../controllers/coreControllers/adminAuth/index.js');

// ============================================
// ⚠️⚠️⚠️ PUBLIC ROUTES - ABSOLUTE TOP PRIORITY! ⚠️⚠️⚠️
// NO AUTHENTICATION! MUST BE FIRST!
// ============================================

// Public card view by slug (NO AUTH!)
router.get('/public/v/:slug', cardController.publicBySlug);

// QR Code generation (NO AUTH!)
router.get('/public/v/:slug/qr', cardController.generateQr);

// vCard download (NO AUTH!)
router.get('/public/v/:slug/vcf', cardController.generateVcf);
router.get('/public/v/:slug/vcf/advanced', cardController.generateVcfAdvanced);

// Analytics tracking (NO AUTH!)
router.post('/public/v/:slug/track', cardController.trackAnalytics);

// ============================================
// AUTHENTICATED ROUTES (Login Required)
// ============================================

// CRUD Operations
router.post('/', adminAuth.isValidAuthToken, cardController.create);
router.get('/', adminAuth.isValidAuthToken, cardController.list);
router.get('/:id', adminAuth.isValidAuthToken, cardController.read);
router.patch('/:id', adminAuth.isValidAuthToken, cardController.update);
router.delete('/:id', adminAuth.isValidAuthToken, cardController.remove);

// QR Code Data URL (for dashboard preview)
router.get('/:id/qr/dataurl', adminAuth.isValidAuthToken, cardController.generateQrDataUrl);

module.exports = router;
