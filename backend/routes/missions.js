const router = require('express').Router();
const mongoose = require('mongoose');

let Mission = require('../models/Mission');

// ======================
// GET ALL
// ======================

router.route('/').get((req, res) => {
  Mission.find()
    .sort([['order', '1']])
    .populate('quest', 'name')
    .populate('giver', ['name', 'zone', 'coords'])
    .exec()
    .then(missions => res.json(missions))
    .catch(err => res.status(400).json('Error: ' + err));
});
  
  // ======================
  // GET ONE
  // ======================
  
router.route("/:id").get((req, res) => {
  const missionId = req.params.id;
  
  Mission.findById(missionId)
    .populate('quest', 'name')
    .populate('giver', ['name', 'zone', 'coords'])
    .then(result => {
      if(!result) {
        return res.status(404).json({
          message: "Mission not found with id " + missionId
        });
      }
      res.json(result);
    })
    .catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).json({
          message: "Mission not found with id " + missionId
        });
      }
      return res.status(500).json({
        message: "Error retrieving Mission with id " + missionId
      });
    });
});

// ======================
// CREATE
// ======================

router.route("/").post(async (req, res) => {
  const mission = req.body;

  // Multiple Missions
  if(Array.isArray(mission)) {
    try {
      var missions = mission.map(m => {
        return new Mission(m);
      });
      await missions.map(async m => {await m.save()});
      res.json({ message: "Missions added successfully!" });   
    }
    catch(err) {
      res.json({ error: err })
    }
  }
  // Single Mission
  else {
    // Validate Mission
    if(!mission.description) {
      return res.status(400).json({
        message: "Mission name cannot be empty."
      });
    }

    // if(!(mission.npc instanceof mongoose.Schema.Types.ObjectId)) {
    //   return res.status(400).json({
    //     message: "Incorrect NPC reference."
    //   });
    // }
  
    const newMission = new Mission(mission);
    newMission.save()
      .then(() => {
        res.json('Mission added!');
      })
      .catch(err => res.status(400).json('Error: ' + err));
  }
});

// ======================
// UPDATE
// ======================

router.route("/:id").put((req, res) => {
  const missionId = req.params.id;
  const newMission = req.body;

  if(!newMission.description) {
    return res.status(400).json({
      message: "Mission description cannot be empty."
    });
  }

  Mission.findByIdAndUpdate(missionId, newMission, {new: true})
  .then(mission => {
    if(!mission) {
      return res.status(404).json({
        message: "Mission not found with id " + missionId
      });
    }
    res.json(mission);
  })
  .catch(err => {
    if(err.kind === 'ObjectId') {
      return res.status(404).json({
        message: "Mission not found with id " + missionId
      });
    }
    return res.status(500).json({
      message: "Error updating Mission with id " + missionId
    });
  });

});

// ======================
// DELETE
// ======================

router.route("/:id").delete((req, res) => {
  const missionId = req.params.id;

  Mission.findByIdAndDelete(missionId)
  .then(mission => {
    if(!mission) {
      return res.status(404).json({
        message: "Mission not found with id " + missionId
      });
    }
    res.json({message: "Mission deleted successfully."});
  })
  .catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).json({
        message: "Mission not found with id " + missionId
      });
    }
    return res.status(500).json({
      message: "Could not delete Mission with id " + missionId
    });
  });
});

module.exports = router;