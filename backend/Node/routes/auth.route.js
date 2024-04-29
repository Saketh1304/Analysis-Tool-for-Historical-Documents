const express = require('express');
const { google, signOut, signin, register } = require('../controllers/auth.controller.js');

const router = express.Router();

router.post("/register", register);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signOut);

module.exports = router;
