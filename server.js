const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware pour gérer les requêtes CORS
app.use(cors());

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Configuration de la connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/deplacements', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Définition du schéma de données (modèle Mongoose)
const DeplacementSchema = new mongoose.Schema({
  dateDepart: String,
  heureDepart: String,
  lieuDepart: String,
  lieuArrivee: String,
  projet: String,
  objectif: String,
  cargaison: String,
  passagers: [String]
});

// Création du modèle Deplacement
const Deplacement = mongoose.model('Deplacement', DeplacementSchema);

// Route pour enregistrer un nouveau déplacement
app.post('/api/deplacements', async (req, res) => {
  try {
    const newDeplacement = new Deplacement(req.body);
    await newDeplacement.save();
    res.status(201).send({ message: 'Déplacement enregistré avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erreur lors de l\'enregistrement du déplacement' });
  }
});

// Route pour récupérer tous les déplacements
app.get('/api/deplacements', async (req, res) => {
  try {
    const deplacements = await Deplacement.find();
    res.status(200).send(deplacements);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erreur lors de la récupération des déplacements' });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
