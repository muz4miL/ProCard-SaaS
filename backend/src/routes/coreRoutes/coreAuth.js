const express = require('express');

const router = express.Router();

const paths = require('../../config/paths.js');
const { catchErrors } = require(paths.errorHandlers);
const adminAuth = require(paths.adminAuth);

router.route('/login').post(catchErrors(adminAuth.login));

router.route('/forgetpassword').post(catchErrors(adminAuth.forgetPassword));
router.route('/resetpassword').post(catchErrors(adminAuth.resetPassword));

router.route('/logout').post(adminAuth.isValidAuthToken, catchErrors(adminAuth.logout));

module.exports = router;
