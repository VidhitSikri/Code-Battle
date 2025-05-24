const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const battleController = require('../controllers/battle.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/create', [
    body('battleName').isLength({ min: 3 }).withMessage('Battle name must be at least 3 characters long'),
    body('description').isLength({ min: 3 }).withMessage('Description must be at least 3 characters long'),
    body('questionsNumber').isNumeric().withMessage('Questions number must be a number'),
    body('isPrivate').isBoolean().withMessage('Is private must be a boolean'),
    body('isSameLanguage').isBoolean().withMessage('Is same language must be a boolean'),
], authMiddleware.authUser, battleController.createBattle);


router.get('/all', authMiddleware.authUser, battleController.getAllBattles);

router.delete('/:id', authMiddleware.authUser, battleController.deleteBattle);

router.patch('/leave/:id', authMiddleware.authUser, battleController.leaveBattle);

// New endpoint to start the battle
router.post('/start/:id', authMiddleware.authUser, battleController.startBattle);

// New endpoint to complete the battle
router.patch('/complete/:id', authMiddleware.authUser, battleController.completeBattle);

module.exports = router;