const express = require('express');
const app = express();
const PORT = 8080;
const db = require('./data.json');

app.use(express.json());

app.listen(PORT, () => console.log(`its alive on https://localhost:${PORT}`));

app.get('/recipes', (req, res) => {
  const recipes = db.recipes;
  let recipeNames = [];

  for (recipe in recipes) {
    recipeNames.push(recipes[recipe].name);
  }

  res.status(200).send({
    recipeNames,
  });
});

app.get('/recipes/details/:dish', (req, res) => {
  const { recipes } = db;
  const { dish } = req.params;

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    if (recipe.name === dish) {
      const response = {
        details: {
          ingredients: recipe.ingredients,
          numSteps: recipe.instructions.length,
        },
      };
      return res.status(200).send(response);
    }
  }

  // If you went through all recipes and none match the dish you asked for send an empty object
  res.status(200).send({});
});

app.post('/recipes', (req, res) => {
  const { recipes } = db;
  const { body } = req;

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];

    if (recipe.name === body.name) {
      return res.status(400).send({ message: 'This recipe already exists' });
    }
  }

  recipes.push(body);

  res.status(201).send({});
});

// step one should loop array to check for matches and return boolean
// step two based on what that boolean is return the correct staus code

app.put('/recipes', (req, res) => {
  const { recipes } = db;
  const { body } = req;

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];

    if (recipe.name === body.name) {
      recipes[i] = body;
      return res.status(204).send({});
    }
  }
  return res.status(404).send({ message: 'This recipe doesnt exist' });
});
