const router = require('express').Router();
const passport = require('passport');
const settings = require('../config/passport')(passport);

let Mission = require('../models/Mission');

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

router.route("/").post(passport.authenticate('jwt', { session: false }), async (req, res) => {
  const token = getToken(req.headers);
  const mission = req.body;

  if(token && req.user.role === "admin") {
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

      const newMission = new Mission(mission);
      newMission.save()
        .then(() => {
          res.json('Mission added!');
        })
        .catch(err => res.status(400).json('Error: ' + err));
    }
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
  const token = getToken(req.headers)
  const missionId = req.params.id;
  const newMission = req.body;

  if(token && req.user.role === "admin") { 
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
  const token = getToken(req.headers)
  const missionId = req.params.id;

  if(token && req.user.role === "admin") {  
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
  }
  else {
    return res.status(403).json({
      success: false,
      message: 'Unauthorised.'
    });
  }
});

module.exports = router;