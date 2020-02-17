const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const npcsRouter = require('./routes/npcs');
const missionsRouter = require('./routes/missions');
const questsRouter = require('./routes/quests');

const app = express();

const authRouter = require('./routes/auth');

app.use(body_parser.json());
app.use(cors());


const uri = process.env.ATLAS_URI;

try {
  mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  });
}
catch(error) {
  res.json({ error });
}

const connection = mongoose.connection;

connection.once('open', () =>{
  console.log("MongoDB database connection established successfully");
});


app.get("/", (req, res) => {
  res.json({message: "You are in the root route"});
});

app.use('/npcs', npcsRouter);
app.use('/missions', missionsRouter);
app.use('/quests', questsRouter);
app.use('/account', authRouter);

const port = 4000;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
