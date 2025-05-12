const battleModel = require("../models/battle.model");
const battleService = require("../services/battle.service");
const { validationResult } = require("express-validator");

module.exports.createBattle = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


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

module.exports.getAllBattles = async (req, res, next) => {
  try {
    const battles = await battleModel.find({});
    res.status(200).json({ battles });
  } catch (error) {
    next(error);
  }
};


module.exports.deleteBattle = async (req, res, next) => {
  try {
    const battleId = req.params.id;
    const battle = await battleModel.findByIdAndDelete(battleId);
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }
    return res.status(200).json({ message: "Battle deleted successfully" });
  } catch (error) {
    next(error);
  }
};


module.exports.leaveBattle = async (req, res, next) => {
  try {
    const battleId = req.params.id;
    const { user2SocketId } = req.body; // Expecting to receive user2SocketId (null)
    const battle = await battleModel.findByIdAndUpdate(
      battleId,
      { user2SocketId },
      { new: true }
    );
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }
    return res.status(200).json({ battle, message: "Left battle successfully" });
  } catch (error) {
    next(error);
  }
};