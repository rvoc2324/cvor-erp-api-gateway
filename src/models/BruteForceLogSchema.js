const mongoose = require('mongoose');

const bruteForceLogSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    ip: { type: String, required: true },
    failedAttempts: { type: Number, default: 0 },
    locked: { type: Boolean, default: false },
    lockUntil: { type: Date, default: null }, // Lockout expiration time
    lastFailedAttempt: { type: Date, default: Date.now }, // Timestamp of the last failed attempt
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('BruteForceLogSchema', bruteForceLogSchema);
