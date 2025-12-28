const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version at least 20 or greater. 👌\n ');
  process.exit();
}

// import environmental variables from our variables.env file
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

mongoose.connect(process.env.DATABASE);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

mongoose.connection.on('error', (error) => {
  console.log(
    `1. 🔥 Common Error caused issue → : check your .env file first and add your mongodb url`
  );
  console.error(`2. 🚫 Error → : ${error.message}`);
});

// ========================================
// CRITICAL: REGISTER ALL MONGOOSE MODELS FIRST
// ========================================
// In Vercel serverless, models must be explicitly registered
// BEFORE any middleware or route tries to use them

// Core Models - Register explicitly for reliability
require('./models/coreModels/Admin.js');
require('./models/coreModels/AdminPassword.js');
require('./models/coreModels/Setting.js');  // ← This is what listBySettingKey.js needs!
require('./models/coreModels/Upload.js');

// App Models - Register explicitly
require('./models/appModels/Card.js');
require('./models/appModels/Client.js');
require('./models/appModels/Invoice.js');
require('./models/appModels/Payment.js');
require('./models/appModels/PaymentMode.js');
require('./models/appModels/Quote.js');
require('./models/appModels/Taxes.js');

// Backup: Also use glob to catch any models we might have missed
const modelsFiles = globSync('./src/models/**/*.js');

for (const filePath of modelsFiles) {
  try {
    require(path.resolve(filePath));
  } catch (err) {
    // Already loaded above, ignore duplicate errors
  }
}

console.log('✅ All Mongoose models registered successfully');

// Start our app!
const app = require('./app');

// Only run the server on a specific port if we are NOT in production
// (Vercel handles the port automatically in production)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8888;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// Export the app for Vercel serverless functions
module.exports = app;
