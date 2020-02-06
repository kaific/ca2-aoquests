const mongoose = require('mongoose');

const CoordsSchema = new mongoose.Schema({
  x: {
    type: Number,
    required: true
  },
  z: {
    type: Number,
    required: true
  },
  pf: {
    type: Number,
    required: true
  },
}, { _id : false });

const NpcSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  zone: {
    type: String,
    required: true
  },
  coords: {
    type: CoordsSchema,
    required: true
  },
  missions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mission'
    }
  ]
});

const Npc = mongoose.model('Npc', NpcSchema);

module.exports = Npc;
