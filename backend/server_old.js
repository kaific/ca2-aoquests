const express = require('express');
const body_parser = require('body-parser');
const app = express();

let data = require('./movies.json');

app.use(body_parser.json());

// app.get("/json", (req, res) => {
//   res.json({ message: "Hello World" });
// });
//
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

app.get("/movies", (req, res) => {
  res.json(data);
});

app.get("/movies/:id", (req, res) => {
  const movieId = req.params.id;
  const movie = data.find(currentMovie => currentMovie.id === movieId);

  if (movie) {
    res.json(movie);
  }
  else {
    res.json({ message: `movie ${movieId} doesn't exist` });
  }
});

app.post("/movies", (req, res) => {
  const movie = req.body;
  //validate movie
  console.log('Adding new movie: ', movie);
  data.push(movie);

  //return updated list
  res.json(data);
});

app.put("/movies/:id", (req, res) => {
  const movieId = req.params.id;
  const movie = req.body;

  console.log("Editing movie: ", movieId, " to be ", movie);

  data.forEach((oldMovie, index) => {
    if (oldMovie.id === movieId) {
      data[index] = movie;
    }
  });

  res.json(data);

});

app.delete("/movies/:id", (req, res) => {
  const movieId = req.params.id;

  console.log("Deleting movie with id: ", movieId);

  const filtered_list = data.filter(movie => movie.id !== movieId);

  data = filtered_list;

  res.json(data);
});


const port = 4000;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
