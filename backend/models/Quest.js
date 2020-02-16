const mongoose = require('mongoose');
// const NpcSchema = mongoose.model('Npc').schema;

const QuestSchema = new mongoose.Schema({
  name: String,
  location: {
    type: String,
    enum: ['Rubi-Ka', 'Shadowlands', 'APF', 'Legacy of the Xan', 'undefined'],
    default: 'undefined'
  }
  // missions: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Mission'
  // }],
}, { id: false, toJSON: { virtuals: true } });

QuestSchema.virtual('missions', {
  ref: 'Mission',
  localField: '_id',
  foreignField: 'quest',
  justOne: false
});

const Quest = mongoose.model('Quest', QuestSchema);

module.exports = Quest;
