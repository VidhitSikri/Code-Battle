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
    const battles = await battleModel.find({}).populate('createdBy', 'fullname');
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

module.exports.startBattle = async (req, res, next) => {
  try {
    const battleId = req.params.id;
    const battle = await battleModel.findById(battleId);
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }
    
    // Import questions from the JSON file
    const questionsData = require('../QuestionData.json');
    
    // Filter questions by battle difficulty
    const filteredQuestions = questionsData.filter(
      (q) => q.difficulty.toLowerCase() === battle.difficulty.toLowerCase()
    );

    if (filteredQuestions.length < battle.questionsNumber) {
      return res.status(400).json({ message: "Not enough questions for the selected difficulty." });
    }
    
    // Select random questions without repetition
    const selectedQuestions = [];
    while (selectedQuestions.length < battle.questionsNumber) {
      const idx = Math.floor(Math.random() * filteredQuestions.length);
      // Check to avoid duplicates
      if (!selectedQuestions.includes(filteredQuestions[idx])) {
        selectedQuestions.push(filteredQuestions[idx]);
      }
    }
    
    // Update battle fields
    battle.questions = selectedQuestions;
    battle.status = 'in-progress';
    await battle.save();
    res.status(200).json({ battle, message: "Battle started successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while starting the battle." });
  }
};

module.exports.completeBattle = async (req, res, next) => {
  try {
    const battleId = req.params.id;
    const { scores } = req.body; // scores: { creator: number, challenger: number }
    const battle = await battleModel.findById(battleId);
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }
    let winner;
    if (scores.creator > scores.challenger) {
      winner = battle.createdBy;
    } else if (scores.creator < scores.challenger) {
      winner = battle.challenger;
    } else {
      winner = null; // tie scenario
    }
    battle.status = 'completed';
    battle.winner = winner;
    await battle.save();

    // Populate user details for createdBy and challenger fields before responding.
    const populatedBattle = await battleModel.findById(battleId)
      .populate('createdBy', 'fullname')
      .populate('challenger', 'fullname');

    return res.status(200).json({ battle: populatedBattle, message: "Battle completed successfully." });
  } catch (error) {
    next(error);
  }
};