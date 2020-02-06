const router = require('express').Router();
const passport = require('passport');
const settings = require('../config/passport')(passport);

let Npc = require('../models/Npc');

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

router.route('/').get(async (req, res) => {
    Npc.find()
        .populate('missions')
        .exec((err, npcs) => {
          if(err) console.log(err);

          res.json(npcs)
        });
        // .then(npcs => res.json(npcs))
        // .catch(err => res.status(400).json('Error: ' + err));
  });
  
  // ======================
  // GET ONE
  // ======================
  
  router.route("/:id").get((req, res) => {
    const npcId = req.params.id;
    
    Npc.findById(npcId)
    .then(result => {
      if(!result) {
        return res.status(404).json({
          message: "NPC not found with id " + npcId
        });
      }
      res.json(result);
    })
    .catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).json({
          message: "NPC not found with id " + npcId
        });
      }
      return res.status(500).json({
        message: "Error retrieving NPC with id " + npcId
      });
    });
    
  });
  
  // ======================
  // CREATE
  // ======================
  
  router.route("/").post(passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    const npc = req.body;
    
    if(token) {
      //validate npc
      if(!npc.name) {
        return res.status(400).json({
          message: "NPC name cannot be empty."
        });
      }

      if(!npc.zone) {
          return res.status(400).json({
              message: "NPC zone cannot be empty."
          });
      }

      if(!npc.coords) {
          return res.status(400).json({
              message: "NPC coordinates cannot be empty."
          });
      }
    
      const newNpc = new Npc(npc);
      newNpc.save()
              .then(() => {
                res.json('NPC added!');
              })
              .catch(err => res.status(400).json('Error: ' + err));
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
    const npcId = req.params.id;
    const newNpc = req.body;
    
    if(token) {
      if(!newNpc.name) {
        return res.status(400).json({
          message: "NPC name cannot be empty."
        });
      }

      if(!newNpc.zone) {
          return res.status(400).json({
              message: "NPC zone cannot be empty."
          });
      }

      if(!newNpc.coords) {
          return res.status(400).json({
              message: "NPC coordinates cannot be empty."
          });
      }
    
      Npc.findByIdAndUpdate(npcId, newNpc, {new: true})
      .then(npc => {
        if(!npc) {
          return res.status(404).json({
            message: "NPC not found with id " + npcId
          });
        }
        res.json(npc);
      })
      .catch(err => {
        if(err.kind === 'ObjectId') {
          return res.status(404).json({
            message: "NPC not found with id " + npcId
          });
        }
        return res.status(500).json({
          message: "Error updating NPC with id " + npcId
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
    const npcId = req.params.id;
    
    if(token) {
      Npc.findByIdAndDelete(npcId)
      .then(npc => {
        if(!npc) {
          return res.status(404).json({
            message: "NPC not found with id " + npcId
          });
        }
        res.json({message: "NPC deleted successfully."});
      })
      .catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).json({
            message: "NPC not found with id " + npcId
          });
        }
        return res.status(500).json({
          message: "Could not delete NPC with id " + npcId
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
  