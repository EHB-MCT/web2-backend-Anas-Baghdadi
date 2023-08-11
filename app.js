const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const crudPort = process.env.CRUD_PORT || 5000;
app.use(cors());

// Connect to MongoDB
const mongoUrl = 'mongodb+srv://login:test123@cluster0.ayowtk8.mongodb.net/mealPlanItems?retryWrites=true&w=majority';

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to mongodb');
}).catch((err) => {
  console.error('Error connecting to mongodb', err);
});

// Define meal schema
const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  calories: { type: Number, required: true },
  imageUrl: { type: String }, 
});

const Meal = mongoose.model('Meal', mealSchema);

app.use(express.json());

// Create a new meal
app.post('/meals', (req, res) => {
  const { name, description, calories } = req.body;
  const newMeal = new Meal({ name, description, calories });

  newMeal.save().then((meal) => {
    res.status(201).json(meal);
  }).catch((err) => {
    res.status(500).json({ message: 'Error during creation of the meal', error: err });
  });
});

// Retrieve all meals
app.get('/meals', (req, res) => {
  Meal.find()
    .then((meals) => {
      res.status(200).json(meals);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error fetching meals.', error: err });
    });
});

// Update a meal
app.put('/meals/:id', (req, res) => {
  const { name, description, calories, imageUrl } = req.body;
  const mealId = req.params.id;

  Meal.findByIdAndUpdate(mealId, { name, description, calories, imageUrl }, { new: true })
    .then((updatedMeal) => {
      res.status(200).json(updatedMeal);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error updating meal', error: err });
    });
});

// Delete a meal
app.delete('/meals/:id', (req, res) => {
  const mealId = req.params.id;

  Meal.findByIdAndDelete(mealId).then(() => {
    res.status(200).json({ message: 'Meal deleted successfully.' });
  }).catch((err) => {
    res.status(500).json({ message: 'Error during meal deletion', error: err });
  });
});

app.listen(crudPort, () => {
  console.log(`Server started on port ${crudPort}`);
});
