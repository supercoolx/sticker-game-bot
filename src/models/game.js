const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    started_at: { type: Date, default: Date.now },
    closed_at: { type: Date },
    first_sticker_id: { type: String, required: true },
    second_sticker_id: { type: String },
    third_sticker_id: { type: String },
    users: [{
        id: { type: Number },
        username: { type: String },
        first_name: { type: String },
        last_name: { type: String },
        sticker_id: { type: String }
    }],
    started_by: { type: String }
});

module.exports = mongoose.model('game', GameSchema);
