const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  emote: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const npcDlgSchema = new mongoose.Schema({
  trigger: {
    type: Number,
    required: true
  },
  messages: {
    type: [msgSchema],
    required: true
  }
}, { _id: false });

const optionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  reqOption: {
    type: Number,
    default: 0
  },
  killOptions: {
    type: [Number]
  },
  content: {
    type: String,
    required: true
  },
  reqProgress: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const DlgSchema = new mongoose.Schema({
  npcDialogue: {
    type: [npcDlgSchema],
    required: true
  },
  chatOptions: {
    type: [optionSchema],
    required: true
  }
}, { _id: false });

const MissionSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true
  },
  giver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Npc'
  },
  quest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quest',
      required: true
  },
  dialogue: {
    type: DlgSchema,
    default: null
  },
  description: {
    type: String,
    required: true
  },
  objective: String,
  reward: {
    type: String,
    default: 'None'
  }
});

const Mission = mongoose.model('Mission', MissionSchema);

module.exports = Mission;