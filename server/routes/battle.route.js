const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const battleController = require('../controllers/battle.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/create', authMiddleware.authUser, battleController.createBattle)


module.exports = router;