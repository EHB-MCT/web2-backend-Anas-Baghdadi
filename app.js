const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(cors());

const mongoUrl = 'mongodb+srv://login:test123@cluster0.ayowtk8.mongodb.net/mealPlanItems?retryWrites=true&w=majority';

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connecté à la base de données MongoDB');
}).catch((err) => {
  console.error('Erreur de connexion à MongoDB:', err);
});

// Modèle de données pour les repas
const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  calories: { type: Number, required: true },
  imageUrl: { type: String }, 
});

const Meal = mongoose.model('Meal', mealSchema);

app.use(express.json());

// Routes CRUD
app.post('/meals', (req, res) => {
  const { name, description, calories } = req.body;
  const newMeal = new Meal({ name, description, calories });

  newMeal.save().then((meal) => {
    res.status(201).json(meal);
  }).catch((err) => {
    res.status(500).json({ message: 'Erreur lors de la création du repas.', error: err });
  });
});

app.get('/meals', (req, res) => {
  Meal.find()
    .then((meals) => {
      res.status(200).json(meals);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Erreur lors de la récupération des repas.', error: err });
    });
});

app.put('/meals/:id', (req, res) => {
  const { name, description, calories, imageUrl } = req.body;
  const mealId = req.params.id;

  Meal.findByIdAndUpdate(mealId, { name, description, calories, imageUrl }, { new: true })
    .then((updatedMeal) => {
      res.status(200).json(updatedMeal);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du repas.', error: err });
    });
});

app.delete('/meals/:id', (req, res) => {
  const mealId = req.params.id;

  Meal.findByIdAndDelete(mealId).then(() => {
    res.status(200).json({ message: 'Repas supprimé avec succès.' });
  }).catch((err) => {
    res.status(500).json({ message: 'Erreur lors de la suppression du repas.', error: err });
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
