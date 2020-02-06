const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    speaker: {
      type: String,
      enum: ['npc', 'player', 'emote'],
      required: true
    },
    message: {
      type: String,
      required: true
    }
  });

const MissionSchema = new mongoose.Schema({
    giver: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Npc',
      required: true
    }],
    quest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quest',
        required: true
    },
    dialogue: {
      type: [LogSchema],
      default: []
    },
    description: {
      type: String,
      required: true
    },
    objective: String,
    reward: String
  });

const Mission = mongoose.model('Mission', MissionSchema);

module.exports = Mission;