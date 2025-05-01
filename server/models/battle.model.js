const mongoose = require("mongoose");

const battleSchema = mongoose.Schema({
    battleName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    roomCode: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['waiting', 'in-progress', 'completed'],
        default: 'waiting'
    },
    questionsNumber: {
        type: Number,
        required: true,
        min: 3,
        max: 10
    },
    isSameLanguage: {
        type: Boolean,
        required: true
    },
    
    allowedLanguages: {
        type: [String],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    mode: {
        type: String,
        enum: ['time', 'quality'],
        required: true
    },

    timeLimitPerQuestion: {
        type: Number,
        default: 300 // 5 minutes
    },
    currentQuestionIndex: {
        type: Number,
        default: 0
    },

    questions: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'question' },
            status: {
                type: String,
                enum: ['not-started', 'in-progress', 'completed'],
                default: 'not-started'
            }
        }
    ],

    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    user1SocketId: {
        type: String
    },
    user2SocketId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },



});

const battleModel = mongoose.model("battle", battleSchema);
module.exports = battleModel;
