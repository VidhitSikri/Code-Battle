const battleModel = require("../models/battle.model");

module.exports.createBattle = async({
  battleName,
  description,
  isPrivate,
  questionsNumber,
  createdBy,
  isSameLanguage,
  allowedLanguages,
  difficulty,
  mode,
  createdAt
}) => {
  if(!isSameLanguage){
    allowedLanguages = [];
  }
  
  // Always generate a roomCode (as a string) for public or private battles.
  const roomCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Create battle with roomCode irrespective of room type.
  const battle = await battleModel.create({ 
    battleName, 
    description, 
    isPrivate, 
    questionsNumber, 
    createdBy, 
    isSameLanguage, 
    allowedLanguages, 
    difficulty, 
    mode, 
    roomCode, 
    createdAt 
  });

  return battle;
};