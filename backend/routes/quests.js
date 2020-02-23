const router = require('express').Router();
const passport = require('passport');
const settings = require('../config/passport')(passport);

let Quest = require('../models/Quest');

const getToken = (headers) => {
  if(headers && headers.authorization) {
    let parted = headers.authorization.split(' ');
    if(parted.length === 2) {
      return parted[1];
    }
    else {
      return null;
    }
  }
  else {
    return null;
  }
};

// ======================
// GET ALL
// ======================

router.route('/').get((req, res) => {
    Quest.find()
        // .populate('missions')
        .populate({
          path: 'missions',
          model: 'Mission',
          populate: {
            path: "giver",
            model: 'Npc',
            select: '-missions -__v'
          },
          select: '-__v'
        })
        .exec()
        .then(quests => res.json(quests))
        .catch(err => res.status(400).json('Error: ' + err));
  });
  
  // ======================
  // GET ONE
  // ======================
  
  router.route("/:id").get((req, res) => {
    const questId = req.params.id;
    
    Quest.findById(questId)
    .populate({
      path: 'missions',
      model: 'Mission',
      populate: {
        path: "giver",
        model: 'Npc',
        select: '-missions -__v'
      },
      select: '-__v'
    })
    .exec()
    .then(result => {
      if(!result) {
        return res.status(404).json({
          message: "Quest not found with id " + questId
        });
      }
      res.json(result);
    })
    .catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).json({
          message: "Quest not found with id " + questId
        });
      }
      return res.status(500).json({
        message: "Error retrieving Quest with id " + questId
      });
    });
    
  });
  
  // ======================
  // CREATE
  // ======================
  
  router.route("/").post(passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    const quest = req.body;
    
    if(token && req.user.role === "admin") {
      //validate quest
      if(!quest.name) {
        return res.status(400).json({
          message: "Quest name cannot be empty."
        });
      }
    
      const newQuest = new Quest(quest);
      newQuest.save((err, result) => {
        if(err) return res.status(400).json('Error: ' + err);
        res.json({
          message: "Quest added!",
          data: result
        })
      })
      // newQuest.save()
      //   .then(() => {
      //     res.json('Quest added!');
      //   })
      //   .catch(err => res.status(400).json('Error: ' + err));
    }
    else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorised.'
      });
    }
  });
  
  // ======================
  // UPDATE
  // ======================
  
  router.route("/:id").put(passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    const questId = req.params.id;
    const newQuest = req.body;
  
    if(token && req.user.role === "admin") { 
      if(!newQuest.name) {
        return res.status(400).json({
          message: "Quest name cannot be empty."
        });
      }
    
      Quest.findByIdAndUpdate(questId, newQuest, {new: true})
      .then(quest => {
        if(!quest) {
          return res.status(404).json({
            message: "Quest not found with id " + questId
          });
        }
        res.json(quest);
      })
      .catch(err => {
        if(err.kind === 'ObjectId') {
          return res.status(404).json({
            message: "Quest not found with id " + questId
          });
        }
        return res.status(500).json({
          message: "Error updating Quest with id " + questId
        });
      });
    }
    else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorised.'
      });
    }
  });
  
  // ======================
  // DELETE
  // ======================
  
  router.route("/:id").delete(passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    const questId = req.params.id;
  
    if(token && req.user.role === "admin") { 
      Quest.findByIdAndDelete(questId)
      .then(quest => {
        if(!quest) {
          return res.status(404).json({
            message: "Quest not found with id " + questId
          });
        }
        res.json({message: "Quest deleted successfully."});
      })
      .catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).json({
            message: "Quest not found with id " + questId
          });
        }
        return res.status(500).json({
          message: "Could not delete Quest with id " + questId
        });
      });
    }
    else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorised.'
      });
    }
  });
  
  module.exports = router;
  