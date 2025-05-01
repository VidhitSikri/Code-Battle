const battleModel = require("../models/battle.model");
const battleService = require("../services/battle.service");
const { validationResult } = require("express-validator");

module.exports.createBattle = async (req, res, next) => {
  try {

    const createdBy = req.user._id;

    const {
      battleName,
      description,
      isPrivate,
      questionsNumber,
      isSameLanguage,
      allowedLanguages,
      difficulty,
      mode,
      createdAt,
    } = req.body;

    const battle = await battleService.createBattle({
      battleName,
      description,
      isPrivate,
      questionsNumber,
      createdBy,
      isSameLanguage,
      allowedLanguages,
      difficulty,
      mode,
      createdAt,
    });

    res.status(201).json({ battle });
  } catch (error) {
    next(error);
  }
};