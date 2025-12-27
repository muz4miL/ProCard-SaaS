const express = require('express');

const router = express.Router();

const { catchErrors } = require('../../handlers/errorHandlers.js');
const adminAuth = require('../../controllers/coreControllers/adminAuth/index.js');

router.route('/login').post(catchErrors(adminAuth.login));

router.route('/forgetpassword').post(catchErrors(adminAuth.forgetPassword));
router.route('/resetpassword').post(catchErrors(adminAuth.resetPassword));

router.route('/logout').post(adminAuth.isValidAuthToken, catchErrors(adminAuth.logout));

module.exports = router;
