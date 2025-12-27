const path = require('path');

// Centralized path mapping for all backend modules
// All paths are absolute from the src directory
const srcDir = path.join(__dirname, '..');

module.exports = {
    // Email Templates
    emailVerification: path.join(srcDir, 'emailTemplate', 'emailVerification.js'),

    // Handlers
    errorHandlers: path.join(srcDir, 'handlers', 'errorHandlers.js'),
    downloadPdf: path.join(srcDir, 'handlers', 'downloadHandler', 'downloadPdf.js'),

    // Models
    CardModel: path.join(srcDir, 'models', 'appModels', 'Card.js'),
    modelsUtils: path.join(srcDir, 'models', 'utils', 'index.js'),

    // Controllers
    adminAuth: path.join(srcDir, 'controllers', 'coreControllers', 'adminAuth', 'index.js'),
    adminController: path.join(srcDir, 'controllers', 'coreControllers', 'adminController', 'index.js'),
    settingController: path.join(srcDir, 'controllers', 'coreControllers', 'settingController', 'index.js'),
    createCRUDController: path.join(srcDir, 'controllers', 'middlewaresControllers', 'createCRUDController', 'index.js'),
    createUserController: path.join(srcDir, 'controllers', 'middlewaresControllers', 'createUserController', 'index.js'),
    pdfController: path.join(srcDir, 'controllers', 'pdfController', 'index.js'),
    appControllers: path.join(srcDir, 'controllers', 'appControllers', 'index.js'),

    // Middlewares
    settings: path.join(srcDir, 'middlewares', 'settings.js'),
    serverData: path.join(srcDir, 'middlewares', 'serverData.js'),
    uploadMiddleware: path.join(srcDir, 'middlewares', 'uploadMiddleware.js'),

    // Settings & Locale
    settingsIndex: path.join(srcDir, 'settings', 'index.js'),
    useLanguage: path.join(srcDir, 'locale', 'useLanguage.js'),

    // Helpers
    helpers: path.join(srcDir, 'helpers', 'index.js'),
};
