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
        enum: ['time', 'speed'],
        required: true
    },

    participants: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            score: { type: Number, default: 0 },
            timeTaken: { type: Number, default: 0 }, // total time in seconds
            codeSubmission: { type: String, default: "" },
            languageUsed: { type: String }
        }
    ],
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
                enum: ['unanswered', 'correct', 'wrong'],
                default: 'unanswered'
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
    }
});

const battleModel = mongoose.model("battle", battleSchema);
module.exports = battleModel;
