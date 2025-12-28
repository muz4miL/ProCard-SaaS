const fs = require('fs');
const path = require('path');

// Files to fix with their correct paths
const fixes = [
    // createCRUDController/index.js needs models/utils
    {
        file: 'backend/src/controllers/middlewaresControllers/createCRUDController/index.js',
        wrong: '../../../../../models/utils/index.js',
        correct: '../../../models/utils/index.js'
    },
    // settingController needs createCRUDController
    {
        file: 'backend/src/controllers/coreControllers/settingController/index.js',
        wrong: '../../../../../controllers/middlewaresControllers/createCRUDController/index.js',
        correct: '../../middlewaresControllers/createCRUDController/index.js'
    }
];

// For ALL appControllers files (they're at depth 4, need only ../../../)
const appControllersPattern = /\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\//g;
const appControllersReplacement = '../../../';

const appControllerFiles = [
    'backend/src/controllers/appControllers/taxesController/index.js',
    'backend/src/controllers/appControllers/quoteController/update.js',
    'backend/src/controllers/appControllers/quoteController/summary.js',
    'backend/src/controllers/appControllers/quoteController/index.js',
    'backend/src/controllers/appControllers/quoteController/create.js',
    'backend/src/controllers/appControllers/paymentModeController/index.js',
    'backend/src/controllers/appControllers/paymentController/update.js',
    'backend/src/controllers/appControllers/paymentController/summary.js',
    'backend/src/controllers/appControllers/paymentController/index.js',
    'backend/src/controllers/appControllers/paymentController/create.js',
    'backend/src/controllers/appControllers/invoiceController/update.js',
    'backend/src/controllers/appControllers/invoiceController/summary.js',
    'backend/src/controllers/appControllers/invoiceController/index.js',
    'backend/src/controllers/appControllers/invoiceController/create.js',
    'backend/src/controllers/appControllers/clientController/index.js',
    'backend/src/controllers/appControllers/cardController/update.js',
    'backend/src/controllers/appControllers/cardController/remove.js',
    'backend/src/controllers/appControllers/cardController/generateVcf.js',
    'backend/src/controllers/appControllers/cardController/generateQr.js',
    'backend/src/controllers/appControllers/cardController/create.js',
    'backend/src/controllers/appControllers/cardController/analytics.js'
];

let totalFixed = 0;

// Fix specific files
fixes.forEach(({ file, wrong, correct }) => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes(wrong)) {
            content = content.replace(wrong, correct);
            fs.writeFileSync(file, content, 'utf8');
            console.log(`✅ Fixed: ${file}`);
            totalFixed++;
        }
    } catch (err) {
        console.error(`❌ Error fixing ${file}:`, err.message);
    }
});

// Fix all appController files (replace 6 levels with 3)
appControllerFiles.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        const before = content;
        content = content.replace(appControllersPattern, appControllersReplacement);
        if (content !== before) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`✅ Fixed: ${file}`);
            totalFixed++;
        }
    } catch (err) {
        console.error(`❌ Error fixing ${file}:`, err.message);
    }
});

console.log(`\n✅ Total files fixed: ${totalFixed}`);
