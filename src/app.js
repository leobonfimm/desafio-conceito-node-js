const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validRepositorieId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id))
    return response.status(400).json({ error: "Invalid repositorie ID."});
  
  return next();
}

function validRepositorieExists(request, response, next) {
  const { id } = request.params;

  const indexRepositorie = repositories.findIndex(repositorie => repositorie.id === id);

  if (indexRepositorie < 0) {
    return response.status(400).json({ error: "Repositorie not found!" });
  }

  request.indexRepositorie = indexRepositorie;

  return next();
}

app.use('/repositories/:id', validRepositorieId, validRepositorieExists);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const indexRepositorie = request.indexRepositorie;

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[indexRepositorie].likes
  }

  repositories[indexRepositorie] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const indexRepositorie  = request.indexRepositorie;

  repositories.splice(indexRepositorie, 1);

  return response.status(204).send("");
});

app.post("/repositories/:id/like", (request, response) => {
  const indexRepositorie = request.indexRepositorie;

  repositories[indexRepositorie].likes++;
  
  return response.json(repositories[indexRepositorie]);
});

module.exports = app;
